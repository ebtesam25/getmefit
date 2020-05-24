#include <OneWire.h>
#include <DallasTemperature.h>
#define USE_ARDUINO_INTERRUPTS true    // Set-up low-level interrupts for most acurate BPM math.
#include <PulseSensorPlayground.h>     // Includes the PulseSensorPlayground Library. 
#define ONE_WIRE_BUS 2

const int PulseWire = A0;      // PulseSensor PURPLE WIRE connected to ANALOG PIN 0
int Threshold = 550;           // Determine which Signal to "count as a beat" and which to ignore.
                               // Use the "Gettting Started Project" to fine-tune Threshold Value beyond default setting.
                               // Otherwise leave the default "550" value. 
                               
PulseSensorPlayground pulseSensor;  // Creates an instance of the PulseSensorPlayground object called "pulseSensor"

// Setup a oneWire instance to communicate with any OneWire devices 
// (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);
 
void setup(void)
{
  // start serial port
  Serial.begin(115200);
  // Configure the PulseSensor object, by assigning our variables to it. 
  pulseSensor.analogInput(PulseWire);
  pulseSensor.setThreshold(Threshold); 
  if (pulseSensor.begin()) {
  }
  // Start up the library
  sensors.begin();
}
 
 
void loop(void)
{
  sensors.requestTemperatures(); // Send the command to get temperatures
  int a=analogRead(1);
  
  int myBPM = pulseSensor.getBeatsPerMinute();
  if (pulseSensor.sawStartOfBeat()) {  
     Serial.print(sensors.getTempCByIndex(0));
     Serial.print(" | ");          
     Serial.print(myBPM); 
     Serial.print(" | ");
     Serial.println(a);                      
    }
    delay(10);
}
