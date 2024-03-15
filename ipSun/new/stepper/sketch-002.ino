
// Arduino astronomic heliostat
// Points mirror according to calculated sun position, no need for sensors.
// Device must be initially programmed (externally) with current location
// and current time, then it will become standalone.

// This version for simulator uses two steppers for readability; final version
// will use Pelco-D protocol over RS485 to set pan/tilt of a pan/tilt head/camera
// carrying a mirror.

// V. 0.0.1 - 13/mar/2024
// V. 0.0.2 - 14/mar/2024 - Cleaned up code, for porting to PelcoD


const byte modePin = 9;
const byte waitPin = 10;
const byte readyPin = 7;
const byte joyVertPin = A0;
const byte joyHorizPin = A1;

const byte azimuthStepPin = 6;
const byte azimuthDirPin = 5;
const byte elevationStepPin = 4;
const byte elevationDirPin = 3;

const int stepsPerRevolution = 3200; // 16x microstepping

 

// choose your RTC library (DS1307 lib can also read from the DS3231 IC):

//#include <DS3232RTC.h>
#include <DS1307RTC.h> // https://github.com/PaulStoffregen/DS1307RTC
#include <AccelStepper.h> // http://www.airspayce.com/mikem/arduino/AccelStepper/

#include <SolarCalculator.h>
#include <TimeLib.h>


// Location
double latitude = 41.89366; // debug: must be customizable
double longitude = 12.50436; // debug: must be customizable

// Target
double targetAzimuth = 180; 
double targetAltitude = 10; 

const byte MODE_SETUP = LOW;
const byte MODE_TARGET = HIGH;


time_t utc;

AccelStepper azimuthStepper(AccelStepper::DRIVER, azimuthStepPin, azimuthDirPin);
AccelStepper elevationStepper(AccelStepper::DRIVER, elevationStepPin, elevationDirPin);

// Wokwi sets the default RTC to match the local computer's system time,
// if your local computer's time is not UTC, you need an offset
const int localUtcOffsetHours = 1;// Adjust RTC from default Wokwi local time setting to UTC:

// number of decimal digits to print
const uint8_t digits = 3;

// program begins

void setup() {

  Serial.begin(9600);
  Serial.println(F("\tHeliostat calculator"));

  pinMode(modePin, INPUT_PULLUP);  // HIGH = enlighten target;  LOW = SETUP
  pinMode(waitPin, OUTPUT);  
  pinMode(readyPin, OUTPUT); 
  digitalWrite(waitPin, LOW);
  digitalWrite(readyPin, LOW);
  pinMode(joyVertPin, INPUT);
  pinMode(joyHorizPin, INPUT);

  setTime(07, 00, 00, 13, 3, 2024); // Set dummy onboard time without RTC
  RTC.set(now()); // Set dummy RTC time


/////////// Debug: time must be set by user //////////
  setTime((compileTime()));  // Set real onboard time without RTC to compile time, which is UTC
  RTC.set((compileTime())); // Set real RTC time C to compile time, which is UTC

  
  // Change onboard time from UTC to local
  if (localUtcOffsetHours != 0 ) { 
    unsigned long newTime = RTC.get() + 3600L * localUtcOffsetHours;
    RTC.set(newTime);
    setTime(newTime);
  }

  azimuthStepper.setMaxSpeed(500.0);
  azimuthStepper.setAcceleration(200.0);
  azimuthStepper.moveTo(0);

  elevationStepper.setMaxSpeed(500.0);
  elevationStepper.setAcceleration(200.0);
  elevationStepper.moveTo(0);
}



void loop() {
  double az, el;  // Horizontal coordinates, in degrees
  double finalAz;
  double finalAlt;

  const uint32_t moveInterval = 10000l;
  static uint32_t lastMoveTime = -(moveInterval -1000);
  uint32_t now = millis();

  azimuthStepper.run();
  elevationStepper.run();

  if (digitalRead(modePin) == MODE_SETUP) {
    // Realtime update, more energy consumption
    lastMoveTime = millis() - moveInterval - 1;

    double joyH = analogRead(A1);
    double joyV = analogRead(A0);

    if (joyH < 400) {
          Serial.println("RIGHT");
          targetAzimuth -= 10;
          delay(100);
    }      

    if (joyH > 600) {
          Serial.println("LEFT");
          targetAzimuth += 10;
          delay(100);
    }   


    if (joyV < 400) {
          Serial.println("DOWN");
          targetAltitude -= 10;
          delay(100);
    }      

    if (joyV > 600) {
          Serial.println("UP");
          targetAltitude += 10;
          delay(100);
    }   

  } else { // end of setup mode
    // Interval update, low energy.
  }

  if (now - lastMoveTime >= moveInterval) {
    digitalWrite(waitPin, HIGH);
    digitalWrite(readyPin, LOW);
    lastMoveTime += moveInterval;
   // Serial.println();

    time_t sysTime = RTC.get();

    if (localUtcOffsetHours != 0 ) { // make local/UTC adjustments
      unsigned long newTime = sysTime - 3600L * localUtcOffsetHours;
      utc = newTime;
    }    

    calculate(utc, az, el);    


    if (digitalRead(modePin) == MODE_TARGET) {
      finalAz = targetAzimuth + (az - targetAzimuth) / 2;
      finalAlt = targetAltitude + (el - targetAltitude) / 2;    
    } else {
      finalAz = targetAzimuth + (az - targetAzimuth) / 2;
      finalAlt = targetAltitude + (el - targetAltitude) / 2;    
    }

    Serial.print(F("S/T/M Az/El:"));
    Serial.print(az);
    Serial.print(F("°/"));
    Serial.print(el);
    Serial.print(F("°|"));

    Serial.print(targetAzimuth);
    Serial.print(F("°/"));
    Serial.print(targetAltitude);
    Serial.print(F("°|"));  

    Serial.print(finalAz);
    Serial.print(F("°/"));
    Serial.print(finalAlt);
    Serial.println(F("°"));  


    digitalWrite(waitPin, HIGH);
    digitalWrite(readyPin, LOW);

    /////////////////////////////////////////////////////
    /////////////////////  Point mirror /////////////////
    /////////////////////////////////////////////////////

    pointMirror(finalAlt, finalAz);
   
   //////////////////////////////////////////////////////
   //////////////////////////////////////////////////////


    digitalWrite(waitPin, LOW);
    digitalWrite(readyPin, HIGH);

  }
}


// Print a time to serial
//
void printTime(time_t t, boolean utc)
{
  if (!utc) {
    if (localUtcOffsetHours != 0 ) { // make local/UTC adjustments
      unsigned long newTime = t + 3600L * localUtcOffsetHours;
      t = newTime;
    }    
  }

  tmElements_t someTime;
  breakTime(t, someTime);

  
  if (someTime.Hour < 10)Serial.print('0');
  Serial.print(someTime.Hour);
  Serial.print(F(":"));
  if (someTime.Minute < 10)Serial.print('0');
  Serial.print(someTime.Minute);
  Serial.print(F(":"));
  if (someTime.Second < 10)Serial.print('0');
  Serial.print(someTime.Second);
  Serial.print(utc ? F(" UTC on "): F(" Local on "));
  Serial.print(dayStr(someTime.Wday));
  Serial.print(F(", "));
  Serial.print(monthStr(someTime.Month));
  Serial.print(F(" "));
  Serial.print(someTime.Day);
  Serial.print(F(", "));
  Serial.println(tmYearToCalendar(someTime.Year));
}


double degreesToHours(double deg)
{
  return deg / 15;
}

// Code from JChristensen/Timezone Clock example
time_t compileTime()
{
  const uint8_t COMPILE_TIME_DELAY = 8;
  const char *compDate = __DATE__, *compTime = __TIME__, *months = "JanFebMarAprMayJunJulAugSepOctNovDec";
  char chMon[4], *m;
  tmElements_t tm;

  strncpy(chMon, compDate, 3);
  chMon[3] = '\0';
  m = strstr(months, chMon);
  tm.Month = ((m - months) / 3 + 1);

  tm.Day = atoi(compDate + 4);
  tm.Year = atoi(compDate + 7) - 1970;
  tm.Hour = atoi(compTime);
  tm.Minute = atoi(compTime + 3);
  tm.Second = atoi(compTime + 6);
  time_t t = makeTime(tm);
  return t + COMPILE_TIME_DELAY;
}

void printSunTime24h(double hours)
{
  int m = int(round(hours * 60));
  int hr = (m / 60) % 24;
  int mn = m % 60;
  printDigits(hr);
  Serial.print(':');
  printDigits(mn);
  Serial.println();
}

void printDigits(int digits)
{
  if (digits < 10)
    Serial.print('0');
 Serial.print(digits);
}

void calculate(time_t utc, double &az, double &el) {
  calcHorizontalCoordinates(utc, latitude, longitude, az, el);
}

time_t toUtc(time_t local)
{
  return local - localUtcOffsetHours * 3600L;
}

void pointMirror(double alt, double az) {
    // runToNewPosition = blocking
    // moveTo = non blocking
    azimuthStepper.runToNewPosition(stepsPerRevolution * -az / 360.0);
    elevationStepper.runToNewPosition(stepsPerRevolution * -alt / 360.0);  
}
