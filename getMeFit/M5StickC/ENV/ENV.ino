#include <WiFi.h>
#include <HTTPClient.h>
#include <M5StickC.h>
#include "DHT12.h"
#include <Wire.h>
#include "Adafruit_Sensor.h"
#include <Adafruit_BMP280.h>
#include "bmm150.h"
#include "bmm150_defs.h"
DHT12 dht12; 
BMM150 bmm = BMM150();
bmm150_mag_data value_offset;
Adafruit_BMP280 bme;

float accX = 0;
float accY = 0;
float accZ = 0;
float temp = 0;

float acclX[100] ={0};
float acclY[100] ={0};
float acclZ[100] ={0};
float totalVector[100];
float totalAvg[100];
float avgX,avgY,avgZ;
float steps;
bool flag;
int stepFlag = 0;
float threshold=1.5;
const int ledPin = 33;
unsigned long previousMillis=0;
unsigned long currentMillis = 0;
#define WIFI_SSID "OnePlus 6"       // Enter your SSID here
#define WIFI_PASS "tantanatan"    // Enter your WiFi password here
#define serverName "http://37625b93.ngrok.io/testdata"
#define fallURL "http://37625b93.ngrok.io/falldetect"
WiFiClient client;

//-------------------------------------------------------------------------calibrate---------------------------------------------------------------------------------//
void calibrate(uint32_t timeout)
{
  int16_t value_x_min = 0;
  int16_t value_x_max = 0;
  int16_t value_y_min = 0;
  int16_t value_y_max = 0;
  int16_t value_z_min = 0;
  int16_t value_z_max = 0;
  uint32_t timeStart = 0;

  bmm.read_mag_data();  
  value_x_min = bmm.raw_mag_data.raw_datax;
  value_x_max = bmm.raw_mag_data.raw_datax;
  value_y_min = bmm.raw_mag_data.raw_datay;
  value_y_max = bmm.raw_mag_data.raw_datay;
  value_z_min = bmm.raw_mag_data.raw_dataz;
  value_z_max = bmm.raw_mag_data.raw_dataz;
  delay(100);

  timeStart = millis();
  
  while((millis() - timeStart) < timeout)
  {
    bmm.read_mag_data();
    
    /* Update x-Axis max/min value */
    if(value_x_min > bmm.raw_mag_data.raw_datax)
    {
      value_x_min = bmm.raw_mag_data.raw_datax;
      // Serial.print("Update value_x_min: ");
      // Serial.println(value_x_min);

    } 
    else if(value_x_max < bmm.raw_mag_data.raw_datax)
    {
      value_x_max = bmm.raw_mag_data.raw_datax;
      // Serial.print("update value_x_max: ");
      // Serial.println(value_x_max);
    }

    /* Update y-Axis max/min value */
    if(value_y_min > bmm.raw_mag_data.raw_datay)
    {
      value_y_min = bmm.raw_mag_data.raw_datay;
      // Serial.print("Update value_y_min: ");
      // Serial.println(value_y_min);

    } 
    else if(value_y_max < bmm.raw_mag_data.raw_datay)
    {
      value_y_max = bmm.raw_mag_data.raw_datay;
      // Serial.print("update value_y_max: ");
      // Serial.println(value_y_max);
    }

    /* Update z-Axis max/min value */
    if(value_z_min > bmm.raw_mag_data.raw_dataz)
    {
      value_z_min = bmm.raw_mag_data.raw_dataz;
      // Serial.print("Update value_z_min: ");
      // Serial.println(value_z_min);

    } 
    else if(value_z_max < bmm.raw_mag_data.raw_dataz)
    {
      value_z_max = bmm.raw_mag_data.raw_dataz;
      // Serial.print("update value_z_max: ");
      // Serial.println(value_z_max);
    }
    
    Serial.print(".");
    delay(1);

  }

  value_offset.x = value_x_min + (value_x_max - value_x_min)/2;
  value_offset.y = value_y_min + (value_y_max - value_y_min)/2;
  value_offset.z = value_z_min + (value_z_max - value_z_min)/2;
}


//-------------------------------------------------------------------------Setup---------------------------------------------------------------------------------//

void setup() {
  Serial.begin(115200);
  delay(4000);   //Delay needed before calling the WiFi.begin
  pinMode (ledPin, OUTPUT);
  digitalWrite (ledPin, HIGH);
  
  WiFi.begin(WIFI_SSID, WIFI_PASS); 
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  } 
  Serial.println("Connected to the WiFi network");
  Serial.println(WiFi.localIP());

  steps = 0;
  
  M5.begin();
  Wire.begin(0,26);
  M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setCursor(0, 0, 2);
  M5.Lcd.println("Name of the Project");
  pinMode(M5_BUTTON_HOME, INPUT);

  if(bmm.initialize() == BMM150_E_ID_NOT_CONFORM) {
    Serial.println("Chip ID can not read!");
    while(1);
  } else {
    Serial.println("Initialize done!");
  }
  if (!bme.begin(0x76)){  
      Serial.println("Could not find a valid BMP280 sensor, check wiring!");
      while (1);
  }
  calibrate(10);
  Serial.print("\n\rCalibrate done..");
  M5.MPU6886.Init();
  stepsCalibrate();
  previousMillis = millis();
}
uint8_t setup_flag = 1;

//-------------------------------------------------------------------------Loop---------------------------------------------------------------------------------//

void loop() {
 
  for(int i=0;i<100;i++){
      M5.MPU6886.getAccelData(&accX,&accY,&accZ);
      float fall = sqrt(accX*accX + accY*accY + accZ*accZ);
      if (fall < 0.75){
          //fallDetection();
        }
      acclX[i] = accX;
      acclY[i] = accY;
      acclZ[i] = accZ;
      totalVector[i] = sqrt(((acclX[i]-avgX)*(acclX[i]-avgX))+((acclY[i]-avgY)*(acclY[i]-avgY))+((acclZ[i]-avgZ)*(acclZ[i]-avgZ)));
      totalAvg[i] = ( totalVector[i] + totalVector[i-1] )/2;
     // Serial.print("fall ");
      Serial.print(fall);
      Serial.print(" | ");
      Serial.println(totalAvg[i]);
      /*Serial.print(accX );
      Serial.print(" | ");
      Serial.print(accY);
      Serial.print(" | ");
      Serial.println(accZ);*/

      if (totalAvg[i] > threshold && stepFlag == 0) {
          steps = steps+1;
          stepFlag = 1;
        }

      if (totalAvg[i] < threshold && stepFlag == 1) {
          stepFlag = 0;
        }

      float tmp = dht12.readTemperature();
      float hum = dht12.readHumidity();
      M5.Lcd.setCursor(0, 20, 2);
      M5.Lcd.printf("Temp: %2.1f Humi: %2.0f%%", tmp, hum);
      M5.MPU6886.getAccelData(&accX,&accY,&accZ);
      M5.Lcd.setCursor(0, 40, 2);
      M5.Lcd.printf("Steps Taken : %2.1f", steps);
      float pressure = bme.readPressure();
      M5.Lcd.setCursor(0, 60, 2);
      M5.Lcd.printf("pressure: %2.1f", pressure);
      //sendData(tmp,steps,pressure,hum);
      delay(100);
    
      if(!setup_flag){
         setup_flag = 1;
    
         if(bmm.initialize() == BMM150_E_ID_NOT_CONFORM) {
        Serial.println("Chip ID can not read!");
        while(1);
      } else {
        Serial.println("Initialize done!");
      }
      if (!bme.begin(0x76)){  
          Serial.println("Could not find a valid BMP280 sensor, check wiring!");
          while (1);
      }
      calibrate(10);
      Serial.print("\n\rCalibrate done..");
     }
    
    
     if(digitalRead(M5_BUTTON_HOME) == LOW){
      setup_flag = 0;
      while(digitalRead(M5_BUTTON_HOME) == LOW);
     }

     if (millis() - previousMillis > 30000){
        previousMillis = millis();
        //sendData(tmp,steps,pressure,hum);
        steps = 0;
      }
    }
}

//-------------------------------------------------------------------------SendData---------------------------------------------------------------------------------//

void sendData(float temperature, float steps,float pressure, float humidity){
  char httpRequestData[200];
     if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      sprintf(httpRequestData, "temperature=%4f&steps=%4f&pressure=%4f&humidity=%4f",temperature,steps,pressure,humidity);
      int httpResponseCode = http.POST(httpRequestData);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
    }
  }
//-------------------------------------------------------------------------Fall Detection---------------------------------------------------------------------------------//

void fallDetection(){
    char httpRequestData2[200];
    
     if(WiFi.status()== WL_CONNECTED){
      HTTPClient http2;
      http2.begin(fallURL);
      http2.addHeader("Content-Type", "application/x-www-form-urlencoded");
      sprintf(httpRequestData2, "fall=1");
      int httpResponseCode = http2.POST(httpRequestData2);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http2.end();
    }
  }
//-------------------------------------------------------------------------StepsCalibrate---------------------------------------------------------------------------------//

void stepsCalibrate()
{
  Serial.print("Calibrating Steps");
  float sumX=0;
  float sumY=0;
  float sumZ=0;
  float valX[100] ={0};
  float valY[100] ={0};
  float valZ[100] ={0};
  for (int i=0;i<100;i++){
    M5.MPU6886.getAccelData(&accX,&accY,&accZ);
    valX[i]=accX;
    valY[i]=accY;
    valZ[i]=accZ;
    sumX=valX[i]+sumX;
    sumY=valY[i]+sumY;
    sumZ=valZ[i]+sumZ;
    }

  avgX=sumX/100.0;
  avgY=sumY/100.0;
  avgZ=sumZ/100.0;

  Serial.print("Steps Calibration Complete  : ");
  Serial.print(avgX);
  Serial.print(" | ");
  Serial.print(avgY);
  Serial.print(" | ");
  Serial.println(avgZ);

}
