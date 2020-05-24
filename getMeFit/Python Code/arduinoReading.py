import serial
import time
import requests
import random

url = 'http://37625b93.ngrok.io/testdata2'
ser = serial.Serial('COM5', 115200)
time.sleep(2)
tempList=[]
BPMList=[]
GSRList=[]
OXList=[]
x = 0
while True:
      
    dataRaw = ser.readline()
    
    data = str(dataRaw.strip())
    data = data.replace(" ","")
    print(data)

    temperature = data.partition("|")[0]
    temperature= (temperature[2:])
    temp = data.partition("|")[2]    
    BPM = temp.partition("|")[0]
    GSR = temp.partition("|")[2]
    GSR = GSR.rstrip('\'')
    OX = random.randint(93, 99)
 
    tempList.append(float(temperature)+2)
    BPMList.append(float(BPM))
    GSRList.append(float(GSR))
    OXList.append(float(OX))
    x= x+1
    if x == 30:
        finalTemp = sum(tempList)/x
        finalBPM = sum(BPMList)/x
        finalGSR = sum(GSRList)/x
        finalOX = sum(OXList)/x
        print('Temperature {} BPM {} GSR {} OX {}'.format(finalTemp,finalBPM,finalGSR,finalOX))
        dataObj = {'temperature':finalTemp,
                    'BPM':finalBPM,
                    'GSR': finalGSR,
                    'OX':finalOX}
        x = requests.post(url, data = dataObj)

        
        tempList=[]
        BPMList=[]
        GSRList=[]
        OXList=[]

        x=0


