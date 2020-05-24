from flask import Flask, request, redirect, session, url_for, Response, json, render_template, send_from_directory
from werkzeug.utils import secure_filename
from flask.json import jsonify
import json
import os
import random
import time
import requests
from pymongo import MongoClient
from pprint import pprint
from google.cloud import datastore
from google.cloud import vision
from google.cloud import storage
from flask_cors import CORS
from google.cloud import automl_v1beta1
from google.cloud.automl_v1beta1.proto import service_pb2
from clarifai.rest import ClarifaiApp
import pyttsx3




with open('credentials.json', 'r') as f:
    creds = json.load(f)

mongostr = creds["mongostr"]
client = MongoClient(mongostr)
clarifaikey = creds["clarifai"]["api_key"]

capp = ClarifaiApp(api_key=clarifaikey)
model = capp.public_models.food_model
# response = model.predict_by_url('@@sampleTrain')



db = client["ufit"]


eng = pyttsx3.init()

# 'content' is base-64-encoded image data.
def get_prediction(content, project_id, model_id):
  prediction_client = automl_v1beta1.PredictionServiceClient.from_service_account_json('gc.json')

  name = 'projects/{}/locations/us-central1/models/{}'.format(project_id, model_id)
  payload = {'image': {'image_bytes': content }}
  params = {}
  request = prediction_client.predict(name, payload, params)
  return request  # waits till request is returned


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config.from_object(__name__)
CORS(app)



datastore_client = datastore.Client.from_service_account_json('gc.json')




def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_top_labels(uri):
    """Detects labels in the file located in Google Cloud Storage or on the
    Web."""
    # imageurl = "https://storage.googleapis.com/hacklarious/testimage.jpg"
    
    client = vision.ImageAnnotatorClient.from_service_account_json('gc.json')
    image = vision.types.Image()
    image.source.image_uri = uri

    
    response = client.label_detection(image=image)

    print ('hereeeeeeeeeeeeeeeeeeeeeee')

    labels = response.label_annotations
    # print('Labels:')

    i = 0

    keywords = []
    for label in labels:
        print(label.description)
        keywords.append(label.description)
        i = i + 1
        if i == 3:
            break


    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
    if len(keywords) == 0:
        keywords.append("random")
    return keywords


def uploadtogcp(filename):
    # Explicitly use service account credentials by specifying the private key
    # file.
    storage_client = storage.Client.from_service_account_json('gc.json')

    # Make an authenticated API request
    ##buckets = list(storage_client.list_buckets())
    ##print(buckets)

    bucketname = "hackybucket"
    # filename = sys.argv[2]


    bucket = storage_client.get_bucket(bucketname)

    destination_blob_name = "current.jpg"
    source_file_name = filename

    blob = bucket.blob(destination_blob_name)
    blob.cache_control = "no-cache"

    blob.upload_from_filename(source_file_name)
    blob.make_public()
    blob.cache_control = "no-cache"

    print('File {} uploaded to {}.'.format(source_file_name, destination_blob_name))


@app.route("/file_upload", methods=["POST"])
def fileupload():

    if 'file' not in request.files:
          return "No file part"
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
      return "No selected file"
    if file and allowed_file(file.filename):
        UPLOAD_FOLDER = "./uploads"
  
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        uploadtogcp(os.path.join(UPLOAD_FOLDER, filename))
        return 'file uploaded successfully'
    
    return 'file not uploaded successfully'


@app.route("/caloriecount", methods=["POST"])
def calorify():

    if 'file' not in request.files:
          return "No file part"
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
      return "No selected file"
    if file and allowed_file(file.filename):
        UPLOAD_FOLDER = "./uploads"
  
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        uploadtogcp(os.path.join(UPLOAD_FOLDER, filename))
        response = model.predict_by_url('https://storage.googleapis.com/hackybucket/current.jpg')
        print (response)
        calorievalue = 0
        names = []
        for x in response["outputs"][0]["data"]["concepts"]:
            if float(x["value"]) < 0.9:
                continue
            print(x["name"])
            print(x["value"])
            name = x["name"]
            if 'burger' in name:
                calorievalue += 350
                names.append(name)
            if 'cheese' in name:
                calorievalue += 40
                names.append(name)
            if 'french fries' in name:
                calorievalue += 180
                names.append(name)
            if 'pizza' in name:
                calorievalue += 280
                names.append(name)   
            if 'waffle' in name:
                calorievalue += 380
                names.append(name)
            if 'dumpling' in name:
                calorievalue += 180
                names.append(name)   
            

        print (calorievalue)

        ret = {} 
        ret["calories"] = str(calorievalue)
        ret["names"] = names

        return json.dumps(ret)
    
    return 'file not uploaded successfully'



@app.route("/file_analysis", methods=["POST"])
def fileanalysis():

    if 'file' not in request.files:
          return "No file part"
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
      return "No selected file"
    if file and allowed_file(file.filename):
        UPLOAD_FOLDER = "./uploads"
  
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        # uploadtogcp(os.path.join(UPLOAD_FOLDER, filename))
        with open(os.path.join(UPLOAD_FOLDER, filename), 'rb') as ff:
            content = ff.read()

        project_id = '127305337349'
        model_id = 'ICN2229277417501884416'

        result = get_prediction(content, project_id, model_id)

        print (result.payload[0].display_name)

        return result.payload[0].display_name
    
    return 'file not uploaded successfully'



@app.route("/file_analysis2", methods=["POST"])
def fileanalysis2():

    if 'file' not in request.files:
          return "No file part"
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
      return "No selected file"
    if file and allowed_file(file.filename):
        UPLOAD_FOLDER = "./uploads"
  
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        # uploadtogcp(os.path.join(UPLOAD_FOLDER, filename))
        with open(os.path.join(UPLOAD_FOLDER, filename), 'rb') as ff:
            content = ff.read()

        project_id = '127305337349'
        model_id = 'ICN848924131712827392'
        

        result = get_prediction(content, project_id, model_id)

        print (result.payload[0].display_name)

        return result.payload[0].display_name
    
    return 'file not uploaded successfully'






@app.route("/labelanimage", methods=['POST'])
def labels():

    print(request)

    res = request.get_json()
    print (res)

    resraw = request.get_data()
    print (resraw)

##    args = request.args
##    form = request.form
##    values = request.values

##    print (args)
##    print (form)
##    print (values)

##    sres = request.form.to_dict()
    imageurl = res["imgurl"]
    labels = get_top_labels(imageurl)

    status = {}
    status["server"] = "up"
    status["message"] = "some random message here"
    status["request"] = res 
    status["results"] = labels

    statusjson = json.dumps(status)

    print(statusjson)

    js = "<html> <body>OK THIS WoRKS</body></html>"

    resp = Response(statusjson, status=200, mimetype='application/json')
    ##resp.headers['Link'] = 'http://google.com'

    return resp




@app.route("/dummyJson", methods=['GET', 'POST'])
def dummyJson():

    print(request)

    res = request.get_json()
    print (res)

    resraw = request.get_data()
    print (resraw)

##    args = request.args
##    form = request.form
##    values = request.values

##    print (args)
##    print (form)
##    print (values)

##    sres = request.form.to_dict()
 

    status = {}
    status["server"] = "up"
    status["message"] = "some random message here"
    status["request"] = res 

    statusjson = json.dumps(status)

    print(statusjson)

    js = "<html> <body>OK THIS WoRKS</body></html>"

    resp = Response(statusjson, status=200, mimetype='application/json')
    ##resp.headers['Link'] = 'http://google.com'

    return resp


@app.route("/testdata", methods=['GET', 'POST'])
def testdata():

    ts = str(int(time.time()))
    ##res = request.json
    # args = request.args
    form = request.form
    # print(args)
    print (form.get('temperature'))
    print (form.get('humidity'))
    print (form.get('pressure'))
    print (form.get('steps'))

    col = db.readings
    payload = {}
    payload['ts'] = ts
    payload['humid'] = form.get('humidity')
    payload['press'] = form.get('pressure')
    payload['tempout'] = form.get('temperature')
    print (payload)

    result=db.readings.insert_one(payload)

    print(result)

    col = db.steps
    area  = col.find_one({"status": "current"})
    oldpop = float(area["steps"])
    newpop = oldpop+float(form.get('steps'))
    col.update_one({"status":"current"}, {"$set":{"steps":str(newpop)}})
    payload = {}
    payload['ts'] = ts
    payload['steps'] = str(newpop)
    print (payload)

    result=db.allsteps.insert_one(payload)
    print(result)



    js = "<html> <body>OK THIS WoRKS</body></html>"

    resp = Response(js, status=200, mimetype='text/html')
    ##resp.headers['Link'] = 'http://google.com'

    return resp



@app.route("/testdata2", methods=['GET', 'POST'])
def testdata2():

    ts = str(int(time.time()))
    ##res = request.json
    # args = request.args
    form = request.form
    # print(args)
    print (form.get('BPM'))
    print (form.get('OX'))
    print (form.get('GSR'))
    print (form.get('temperature'))

    col = db.readings
    payload = {}
    payload['ts'] = ts
    payload['gsr'] = form.get('GSR')
    payload['ox'] = form.get('OX')
    payload['pulse'] = form.get('BPM')
    payload['tempint'] = form.get('temperature')
    print (payload)

    result=db.internal.insert_one(payload)

    print(result)

    col = db.ox
    area  = col.find_one({"status": "current"})
    oldpop = float(area["ox"])
    newpop = float(form.get('OX'))
    col.update_one({"status":"current"}, {"$set":{"ox":str(newpop)}})
    payload = {}
    payload['ts'] = ts
    payload['ox'] = str(newpop)
    print (payload)

    result=db.ox.insert_one(payload)
    print(result)

    col = db.heartrates
    area  = col.find_one({"status": "current"})
    oldpop = float(area["pulse"])
    newpop = float(form.get('BPM'))
    col.update_one({"status":"current"}, {"$set":{"pulse":str(newpop)}})
    payload = {}
    payload['ts'] = ts
    payload['pulse'] = str(newpop)
    print (payload)

    result=db.heartrates.insert_one(payload)
    print(result)



    js = "<html> <body>OK THIS WoRKS</body></html>"

    resp = Response(js, status=200, mimetype='text/html')
    ##resp.headers['Link'] = 'http://google.com'

    return resp


@app.route("/falldetect", methods=['GET', 'POST'])
def falldetect():

    ##res = request.json

    js = "<html> <body>OK THIS WoRKS</body></html>"
    eng = pyttsx3.init()
    eng.say("Fall detected. Please cancel the alert using your app in the next 60 seconds. If the alert is not cancelled emergency services will be notified.")
    # eng.runAndWait()
    print ("fall detected")
    



    resp = Response(js, status=200, mimetype='text/html')
    ##resp.headers['Link'] = 'http://google.com'

    return resp





@app.route("/dummy", methods=['GET', 'POST'])
def dummy():

    ##res = request.json

    js = "<html> <body>OK THIS WoRKS</body></html>"

    resp = Response(js, status=200, mimetype='text/html')
    ##resp.headers['Link'] = 'http://google.com'

    return resp

@app.route("/api", methods=["GET"])
def index():
    if request.method == "GET":
        return {"hello": "world"}
    else:
        return {"error": 400}


if __name__ == "__main__":
    app.run(debug=True, host = 'localhost', port = 8002)
    # app.run(debug=True, host = '45.79.199.42', port = 8002)
