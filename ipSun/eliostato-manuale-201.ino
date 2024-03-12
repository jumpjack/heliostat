/*
 The circuit:
 * LED attached from pin 13 to ground
 * pushbutton attached between Button pin and o +5V
 * 10K resistor attached between Button pin and ground
 */

// Network settings:
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
WiFiClient client;

const char host[] = "192.168.1.239";
const char mySSID[] = "wireless";
const char myPass[] = "testami1";
const int Port = 2239;

// Camera settings:
 String CameraCommandBASE = "/decoder_control.cgi?command=#COMMAND#&degree=#DEGREES#&user=#USER#&pwd=#PASS#";
 String CameraPTZ_UP = "0";
 String CameraPTZ_DOWN = "2";
 String CameraPTZ_CW = "6"; // Ruota in senso orario
 String CameraPTZ_CCW = "4"; // Ruota in senso antiorario
 int CameraRESET_TIME = 10000; // Secondi per passare da un estremo all'altro
 int CameraCENTER_TIME = 5000; // Secondi necessari per centratura
 String CamURL_BASE = "";
 String CameraUser = "eliostato";
 String CameraPwd = "eliostato";
 const String PTZ_STEP="10";
 const String PTZ_STEP_SMALL="2";

String temp;
 
// set pin numbers:
const int buttonUp = D8;  
const int buttonDown = D7;   
const int buttonRight = D6;   
const int buttonLeft = D5;   
const int buttonAuto = D4; 
const int buttonUpSmall = D3; 
const int buttonDownSmall = D2; 
const int buttonRightSmall = D1; 
const int buttonLeftSmall = D0; 

const int ledPin = D9; // the number of the LED pin

// Variables will change:
int ledState = HIGH;         // the current state of the output pin
int buttonUpState;             // the current reading from the input pin
int buttonDownState;             // the current reading from the input pin
int buttonRightState;             // the current reading from the input pin
int buttonLeftState;             // the current reading from the input pin
int buttonUpSmallState;             // the current reading from the input pin
int buttonDownSmallState;             // the current reading from the input pin
int buttonRightSmallState;             // the current reading from the input pin
int buttonLeftSmallState;             // the current reading from the input pin
int buttonAutoState;             // the current reading from the input pin

int lastButtonUpState = HIGH;   // the previous reading from the input pin
int lastButtonDownState= HIGH;   // the previous reading from the input pin
int lastButtonRightState = HIGH;   // the previous reading from the input pin
int lastButtonLeftState = HIGH;   // the previous reading from the input pin
int lastButtonUpSmallState = HIGH;   // the previous reading from the input pin
int lastButtonDownSmallState= HIGH;   // the previous reading from the input pin
int lastButtonRightSmallState = HIGH;   // the previous reading from the input pin
int lastButtonLeftSmallState = HIGH;   // the previous reading from the input pin
int lastButtonAutoState = HIGH;   // the previous reading from the input pin

// the following variables are long's because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
long lastDebounceTimeUp = 0;  // the last time the output pin was toggled
long lastDebounceTimeDown = 0;  // the last time the output pin was toggled
long lastDebounceTimeRight = 0;  // the last time the output pin was toggled
long lastDebounceTimeLeft = 0;  // the last time the output pin was toggled
long lastDebounceTimeUpSmall = 0;  // the last time the output pin was toggled
long lastDebounceTimeDownSmall = 0;  // the last time the output pin was toggled
long lastDebounceTimeRightSmall = 0;  // the last time the output pin was toggled
long lastDebounceTimeLeftSmall = 0;  // the last time the output pin was toggled
long lastDebounceTimeAuto = 0;  // the last time the output pin was toggled
long debounceDelay = 50;    // the debounce time; increase if the output flickers


int SendCommandToCam(String CamURL, String CamCommand, String CommandDegrees) {
     USE_SERIAL.print("Connessione al router: ");
   if (!client.connect(host, Port)) {
     Serial.print("OPS! ERRORE DI CONNESSIONE A: ");   
     USE_SERIAL.print(host);
     USE_SERIAL.print(":");
     USE_SERIAL.println(Port);
     } else {
      Serial.println("Ok.");
    } 
  
  CamURL.replace("#COMMAND#",CamCommand);
  CamURL.replace("#DEGREES#",CommandDegrees);
  
  USE_SERIAL.println("Comando: " + CamURL);

  client.print("GET " + CamURL + " HTTP/1.1\r\n" +
               "Host: " + "http://192.168.1.239" + "\r\n" + 
               "Connection: close\r\n\r\n");
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    //USE_SERIAL.println("Risultato = " + line);
  }
  USE_SERIAL.println("Eseguito?!?\n");
}


void setup() {
  pinMode(buttonUp, INPUT);
  pinMode(buttonDown, INPUT);
  pinMode(buttonLeft, INPUT);
  pinMode(buttonRight, INPUT);
  pinMode(buttonAuto, INPUT);
  pinMode(buttonUpSmall, INPUT);
  pinMode(buttonDownSmall, INPUT);
  pinMode(buttonLeftSmall, INPUT);
  pinMode(buttonRightSmall, INPUT);
  pinMode(buttonAuto, INPUT);
  pinMode(ledPin, OUTPUT);


digitalWrite(buttonUp,buttonUpState);
digitalWrite(buttonDown,buttonDownState);             
digitalWrite(buttonRight,buttonRightState);             
digitalWrite(buttonLeft,buttonLeftState);             
digitalWrite(buttonUpSmall,buttonUpSmallState);            
digitalWrite(buttonDownSmall,buttonDownSmallState);             
digitalWrite(buttonRightSmall,buttonRightSmallState);             
digitalWrite(buttonLeftSmall,buttonLeftSmallState);             
digitalWrite(buttonAuto,buttonAutoState);            

  // set initial LED state
  digitalWrite(ledPin, LOW);

   Serial.begin(9600);

   // Setup the base url once with login data:
   temp = CameraCommandBASE;
   temp.replace("#USER#",CameraUser);
   temp.replace("#PASS#",CameraPwd);

   USE_SERIAL.println("URL in setup = " + temp);

  // Countdown to program start
   for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        ledState = !ledState;
        digitalWrite(ledPin,ledState);
        delay(1000);
    }

    USE_SERIAL.print("Connessione a rete: ");
    USE_SERIAL.print(mySSID);
    USE_SERIAL.print(",");
    USE_SERIAL.println(myPass);

    WiFiMulti.addAP(mySSID, myPass);
    while (WiFiMulti.run() != WL_CONNECTED) {
      delay(500);
    Serial.print(".");
    }
    USE_SERIAL.println("OK");
}

void loop() {
   if((WiFiMulti.run() == WL_CONNECTED)) {

      // read the state of the switch into a local variable:
      int readingUp = digitalRead(buttonUp);
      int readingDown = digitalRead(buttonDown);
      int readingRight = digitalRead(buttonRight);
      int readingLeft = digitalRead(buttonLeft);
      int readingUpSmall = digitalRead(buttonUpSmall);
      int readingDownSmall = digitalRead(buttonDownSmall);
      int readingRightSmall = digitalRead(buttonRightSmall);
      int readingLeftSmall = digitalRead(buttonLeftSmall);
      int readingAuto = digitalRead(buttonAuto);

/*Serial.print(readingUp);
Serial.print(", ");      
Serial.print(readingDown);
Serial.print(", ");      
Serial.print(readingRight);
Serial.print(", ");      
Serial.print(readingLeft);
Serial.print(", ");      
Serial.print(readingUpSmall);
Serial.print(", ");      
Serial.print(readingDownSmall);
Serial.print(", ");      
Serial.print(readingRightSmall);
Serial.print(", ");      
Serial.print(readingLeftSmall);
Serial.print(", ");      
Serial.print(readingAuto);
Serial.println("");      
*/      // check to see if you just pressed the button
      // (i.e. the input went from LOW to HIGH),  and you've waited
      // long enough since the last press to ignore any noise:
      
      // If the switch changed, due to noise or pressing:
      if (readingUp != lastButtonUpState) {
        // reset the debouncing timer
        Serial.println("prePREMUTO up");        
        lastDebounceTimeUp = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingDown != lastButtonDownState) {
        // reset the debouncing timer
        Serial.println("prePREMUTO down");        
        lastDebounceTimeDown = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingRight != lastButtonRightState) {
        // reset the debouncing timer
        Serial.println("prePREMUTO right");        
        lastDebounceTimeRight = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingLeft != lastButtonLeftState) {
        // reset the debouncing timer
        Serial.println("prePREMUTO left");        
        lastDebounceTimeLeft = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingAuto != lastButtonAutoState) {
        Serial.println("prePREMUTO auto");        
        // reset the debouncing timer
        lastDebounceTimeAuto = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingUpSmall != lastButtonUpSmallState) {
        Serial.println("prePREMUTO UpSmall");        
        // reset the debouncing timer
        lastDebounceTimeUpSmall = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingDownSmall != lastButtonDownSmallState) {
        Serial.println("prePREMUTO DownSmall");        
        // reset the debouncing timer
        lastDebounceTimeDownSmall = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingRightSmall != lastButtonRightSmallState) {
        Serial.println("prePREMUTO RightSmall");        
        // reset the debouncing timer
        lastDebounceTimeRightSmall = millis();
      }
      
      // If the switch changed, due to noise or pressing:
      if (readingLeftSmall != lastButtonLeftSmallState) {
        Serial.println("prePREMUTO LeftSmall");        
        // reset the debouncing timer
        lastDebounceTimeLeftSmall = millis();
      }
      
      
      
      
      if ((millis() - lastDebounceTimeUp) > debounceDelay) {
        if (readingUp != buttonUpState) {
          buttonUpState = readingUp;
          if (buttonUpState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO Up");  
            SendCommandToCam(temp, CameraPTZ_UP, PTZ_STEP);      
          }
        }
      }
      
      if ((millis() - lastDebounceTimeDown) > debounceDelay) {
        if (readingDown != buttonDownState) {
          buttonDownState = readingDown;
          if (buttonDownState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO Down");        
            SendCommandToCam(temp, CameraPTZ_DOWN, PTZ_STEP);
          }
        }
      }
      
      if ((millis() - lastDebounceTimeRight) > debounceDelay) {
        if (readingRight != buttonRightState) {
          buttonRightState = readingRight;
          if (buttonRightState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO Right");  
            SendCommandToCam(temp, CameraPTZ_CW, PTZ_STEP);      
          }
        }
      }
      
      if ((millis() - lastDebounceTimeLeft) > debounceDelay) {
        if (readingLeft != buttonLeftState) {
          buttonLeftState = readingLeft;
          if (buttonLeftState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO Left");   
            SendCommandToCam(temp, CameraPTZ_CCW, PTZ_STEP);     
          }
        }
      }
      

      ///////////////////
      
      if ((millis() - lastDebounceTimeUpSmall) > debounceDelay) {
        if (readingUpSmall != buttonUpSmallState) {
          buttonUpSmallState = readingUpSmall;
          if (buttonUpSmallState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO UpSmall");        
            SendCommandToCam(temp, CameraPTZ_UP, PTZ_STEP_SMALL);
          }
        }
      }
      
      if ((millis() - lastDebounceTimeDownSmall) > debounceDelay) {
        if (readingDownSmall != buttonDownSmallState) {
          buttonDownSmallState = readingDownSmall;
          if (buttonDownSmallState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO DownSmall");        
            SendCommandToCam(temp, CameraPTZ_DOWN, PTZ_STEP_SMALL);
          }
        }
      }
      
      if ((millis() - lastDebounceTimeRight) > debounceDelay) {
        if (readingRightSmall != buttonRightSmallState) {
          buttonRightSmallState = readingRightSmall;
          if (buttonRightSmallState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO RightSmall");  
            SendCommandToCam(temp, CameraPTZ_CW, PTZ_STEP_SMALL);      
          }
        }
      }
      
      if ((millis() - lastDebounceTimeLeft) > debounceDelay) {
        if (readingLeftSmall != buttonLeftSmallState) {
          buttonLeftSmallState = readingLeftSmall;
          if (buttonLeftSmallState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO LeftSmall");   
            SendCommandToCam(temp, CameraPTZ_CCW, PTZ_STEP_SMALL);     
          }
        }
      }
      
//////////////      
      
      if ((millis() - lastDebounceTimeAuto) > debounceDelay) {
        if (readingAuto != buttonAutoState) {
          buttonAutoState = readingAuto;
          if (buttonAutoState == HIGH) {
            ledState = !ledState;
            Serial.println("finalPREMUTO Auto"); 

              // Start position (reset):
            SendCommandToCam(temp, CameraPTZ_CW, "300");      
            delay(10000);
            SendCommandToCam(temp, CameraPTZ_CCW, "120");      
            delay(5000);
            SendCommandToCam(temp, CameraPTZ_UP, "200");      
            delay(5000);
            SendCommandToCam(temp, CameraPTZ_DOWN, "90");   
            delay(5000);
               
            // Standard position:
            SendCommandToCam(temp, CameraPTZ_CW, "20");      
            delay(2000);
            SendCommandToCam(temp, CameraPTZ_UP, "30");      
            delay(2000);
            
          }
        }
      }
      
      // set the LED:
      digitalWrite(ledPin, ledState);
      
      // save the reading.  Next time through the loop,
      // it'll be the lastButtonState:
      lastButtonUpState = readingUp;   
      lastButtonDownState= readingDown;  
      lastButtonRightState = readingRight;   
      lastButtonLeftState = readingLeft;   
      lastButtonUpSmallState = readingUpSmall;   
      lastButtonDownSmallState= readingDownSmall;  
      lastButtonRightSmallState = readingRightSmall;   
      lastButtonLeftSmallState = readingLeftSmall;   
      lastButtonAutoState = readingAuto                                    ;  
      //Serial.print(".");
   }
}
