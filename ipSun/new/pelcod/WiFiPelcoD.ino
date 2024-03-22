/*****************
Control Pelco-D camera over wifi with ESP32
- V. 0.1.0 - First test: move Left/Right/Up/Down for 1 second

Connect to ESPtest access point with your phone
Check in advanced wifi settings of the phone which is the IP of the ESP (something like 192.168.4.1)
User your android browser to connect to  that page
Click buttons to move the camera
*****************/

#include "defines.h"


#define RXD2 16
#define TXD2 17
#define INFOPIN 18
#define MODEPIN 23

const byte C_SET_PAN_POSITION = 0x4B; 
const byte C_SET_TILT_POSITION = 0x4D; 
const byte C_TILT_DOWN_TILL_STOP = 0x10; 
const byte C_TILT_UP_TILL_STOP = 0x08; 
const byte C_PAN_LEFT_TILL_STOP = 0x04 ;
const byte C_PAN_RIGHT_TILL_STOP = 0x02; 
const byte C_SET_POS = 0x03; 
const byte C_GOTO_POS = 0x07; // 5?
const byte C_CLEAR_POS = 0x05;  // 7?

int keyIndex = 0;                // your network key Index number (needed only for WEP)

#if defined(LED_BUILTIN)
  const int led =  LED_BUILTIN;


#else
  #if (ESP32)
    // Using pin 13 will crash ESP32_C3
    const int led =  18;
  #else
    const int led =  13;
  #endif
#endif

int status = WL_IDLE_STATUS;

WiFiServer server(80);

void printWiFiStatus()
{
  // print your WiFi shield's IP address:

#if (ESP32 || ESP8266)
  IPAddress ip = WiFi.softAPIP();
#else

  // print the SSID of the network you're attached to:
  Serial.print(F("SSID: "));

  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
#endif

  Serial.print(F("IP Address: "));
  Serial.println(ip);

  // print where to go in a browser:
  Serial.print(F("To see this page in action, open a browser to http://"));
  Serial.println(ip);

    Serial.print("LED on pin ");
    Serial.println(led);  
}

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);

  pinMode(INFOPIN, OUTPUT);
  pinMode(MODEPIN, OUTPUT);
  digitalWrite(MODEPIN,HIGH);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  while (!Serial && millis() < 5000);

  delay(200);

  Serial.print(F("\nStarting AP_SimpleWebServer on "));
  Serial.print(BOARD_NAME);
  Serial.print(F(" with "));
  Serial.println(SHIELD_TYPE);
  Serial.println(WIFI_WEBSERVER_VERSION);

  pinMode(led, OUTPUT);      // set the LED pin mode
  pinMode(13, OUTPUT);      // set the LED pin mode
  digitalWrite(13,LOW);

#if WIFI_USING_ESP_AT

  // initialize serial for ESP module
  EspSerial.begin(115200);
  // initialize ESP module
  WiFi.init(&EspSerial);

  Serial.println(F("WiFi shield init done"));

#endif

#if !(ESP32 || ESP8266)

  // check for the presence of the shield
#if USE_WIFI_NINA

  if (WiFi.status() == WL_NO_MODULE)
#else
  if (WiFi.status() == WL_NO_SHIELD)
#endif
  {
    Serial.println(F("WiFi shield not present"));

    // don't continue
    while (true);
  }

#if USE_WIFI_NINA
  String fv = WiFi.firmwareVersion();

  if (fv < WIFI_FIRMWARE_LATEST_VERSION)
  {
    Serial.println(F("Please upgrade the firmware"));
  }

#endif

#endif

  // by default the local IP address of will be 192.168.4.1
  // you can override it with the following:
  // WiFi.config(IPAddress(10, 0, 0, 1));

  // print the network name (SSID);
  Serial.print(F("Creating access point named: "));
  Serial.print(ssid);
  Serial.print(F(" and password: "));
  Serial.println(pass);

#if (ESP32 || ESP8266)

  WiFi.softAP(ssid, pass);

#else

  // Create open network. Change this line if you want to create an WEP network:
  // default AP channel = 1
  uint8_t ap_channel = 2;

  status = WiFi.beginAP(ssid, pass, ap_channel);

  //status = WiFi.beginAP(ssid, pass);

  if (status != WL_AP_LISTENING)
  {
    Serial.println(F("Creating access point failed"));

    // don't continue
    while (true);
  }

#endif

  // wait 10 seconds for connection:
  //delay(10000);

  // start the web server on port 80
  server.begin();

  // you're connected now, so print out the status
  printWiFiStatus();
}

void loop() {
#if !(ESP32 || ESP8266)

  // compare the previous status to the current status
  if (status != WiFi.status())
  {
    // it has changed update the variable
    status = WiFi.status();


    if (status == WL_AP_CONNECTED)
    {
      // a device has connected to the AP
      Serial.println(F("Device connected to AP"));
    }
    else
    {
      // a device has disconnected from the AP, and we are back in listening mode
      Serial.println(F("Device disconnected from AP"));
    }
  }

#endif


  
  if (Serial.available() > 0) {
    char command = Serial.read();

    // Esecuzione del comando corrispondente
    switch (command) {
      case '6':
        sendPelcoDFrame(C_PAN_RIGHT_TILL_STOP, 5, 5);
        checkResponse();
        break;
      case '4':
        sendPelcoDFrame(C_PAN_LEFT_TILL_STOP, 5, 5);
        checkResponse();
        break;
      case '2':
        sendPelcoDFrame(C_TILT_UP_TILL_STOP, 5, 5);
        checkResponse();
        break;
      case '8':
        sendPelcoDFrame(C_TILT_DOWN_TILL_STOP, 5, 5);
        checkResponse();
        break;

      case '5':
        stopCamera();
        break;
      default:
        // Gestione di comandi non validi
        break;
    }
  }


  WiFiClient client = server.available();   // listen for incoming clients

  if (client)
  {
    // if you get a client,
    Serial.println(F("New client"));           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client

    while (client.connected())
    {
      // loop while the client's connected
      if (client.available())
      {
        // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor

        if (c == '\n')
        {
          // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0)
            {

    // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
    // and a content-type so the client knows what's coming, then a blank line:
    client.println(F("HTTP/1.1 200 OK"));
    client.println(F("Content-type:text/html"));
    client.println();

    // the content of the HTTP response follows the header:
    client.println(F("<!DOCTYPE html>"));
    client.println(F("<html>"));
    client.println(F("<head>"));
    client.println(F("    <title>Pagina con Pulsante</title>"));
    client.println(F("</head>"));
    client.println(F("<body>"));
    client.println(F("    <h1>Premi il pulsante per eseguire il retrieve del file</h1>"));
    client.println(F("    <button onclick=\"retrieveFile(\'/U\')\">Up</button><br>"));
    client.println(F("    <button onclick=\"retrieveFile(\'/L\')\">Left</button>"));
    client.println(F("    <button onclick=\"retrieveFile(\'/R\')\">Right</button><br>"));
    client.println(F("    <button onclick=\"retrieveFile(\'/D\')\">Down</button>"));
    client.println();
    client.println(F("    <script>"));
    client.println(F("        function retrieveFile(fileUrl) {"));
    client.println(F("            // Definisci l'URL del file da recuperare"));
    client.println(F("            //var fileUrl = \"/H\"; // Cambia questo con l'URL corretto"));
    client.println();
    client.println(F("            // Effettua il retrieve del file"));
    client.println(F("            fetch(fileUrl)"));
    client.println(F("                .then(response => response.text())"));
    client.println(F("                .then(data => {"));
    client.println(F("                    console.log(\"Contenuto del file:\", data);"));
    client.println(F("                    // Puoi manipolare il contenuto del file qui come desideri"));
    client.println(F("                })"));
    client.println(F("                .catch(error => {"));
    client.println(F("                    console.error(\"Errore durante il retrieve del file:\", error);"));
    client.println(F("                });"));
    client.println(F("        }"));
    client.println(F("    </script>"));
    client.println(F("</body>"));
    client.println(F("</html>"));

    // The HTTP response ends with another blank line:
    client.println();
    // break out of the while loop:
    break;
                  
              /*
              // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
              // and a content-type so the client knows what's coming, then a blank line:
              client.println(F("HTTP/1.1 200 OK"));
              client.println(F("Content-type:text/html"));
              client.println();

              // the content of the HTTP response follows the header:
              client.print(F("Click <a href=\"/H\">here</a> turn the LED on<br>"));
              client.print(F("Click <a href=\"/L\">here</a> turn the LED off<br>"));

              // The HTTP response ends with another blank line:
              client.println();
              // break out of the while loop:
              break;*/
            }
          else
          {
            // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        }
        else if (c != '\r')
        {
          // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        // Check to see if the client request was "GET /H" or "GET /L":
        if (currentLine.endsWith(F("GET /R")))        {
          sendPelcoDFrame(C_PAN_RIGHT_TILL_STOP, 5, 5);
          checkResponse();           
          digitalWrite(led, HIGH);               
          delay(1000);
          digitalWrite(led, LOW);                
          stopCamera();
        }

        if (currentLine.endsWith(F("GET /L")))        {
          sendPelcoDFrame(C_PAN_LEFT_TILL_STOP, 5, 5);
          checkResponse();           
          digitalWrite(led, HIGH);                
          delay(1000);
          digitalWrite(led, LOW);                
          stopCamera();
        }

        if (currentLine.endsWith(F("GET /U")))        {
          sendPelcoDFrame(C_TILT_UP_TILL_STOP, 5, 5);
          checkResponse();           
          digitalWrite(led, HIGH);   
          delay(1000);
          digitalWrite(led, LOW);                
          stopCamera();
        }

        if (currentLine.endsWith(F("GET /D")))        {
          sendPelcoDFrame(C_TILT_DOWN_TILL_STOP, 5, 5);
          checkResponse();           
          digitalWrite(led, HIGH);                
          delay(1000);
          digitalWrite(led, LOW);                
          stopCamera();
        }
      }
    }

    // close the connection:
    client.stop();
    Serial.println(F("Client disconnected"));
  }
}

void sendPelcoDFrame( byte command, byte data1, byte data2){
  byte bytes[7] = {0xFF, 0x01, 0x00, command, data1, data2, 0x00};
  byte crc = (bytes[1] + bytes[2] + bytes[3] + bytes[4] + bytes[5]) % 0x100;
  bytes[6] = crc;

  for (int i = 0; i < 7; i++)   {
    Serial2.write(bytes[i]);
  }
}

void stopCamera() {
  byte bytes[7] = {0xFF, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01};
   for (int i = 0; i < 7; i++)   {
    Serial2.write(bytes[i]);
  }  
}

void checkResponse() {
    digitalWrite(MODEPIN,LOW);
    if (Serial2.available() > 0) {
    while (Serial2.available() > 0) {
      char receivedChar = Serial2.read();
      Serial.print("Numero ricevuto dalla seriale 2: 0x");
      Serial.print(receivedChar, HEX);
      Serial.println();
    }  
    Serial.println("--");
  } else {
    Serial.println("no response.");
    digitalWrite(MODEPIN,HIGH);
  }
}
