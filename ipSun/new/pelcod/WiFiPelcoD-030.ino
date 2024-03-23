/*****************
Control Pelco-D camera over wifi with ESP32
- V. 0.1.0 - First test: move Left/Right/Up/Down for 1 second
- V. 0.2.0 - Implemented time-limited commands from serial
- V. 0.3.0 - Implemented time-limited commands from web (access point)
- Found value for pan: PAN: 180° in 15200ms

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
#define MAX_COMMAND_LENGTH 5
#define PAN180 15200



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
char command[MAX_COMMAND_LENGTH + 1]; // +1 per il carattere terminatore della stringa
int commandValue;


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

void printWiFiStatus() {
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
    // Leggi la stringa dalla porta seriale
    String input = Serial.readStringUntil('\n');
    input.trim(); // Rimuove spaziature extra dalla stringa

    // Controlla la lunghezza della stringa per determinare il tipo di comando
    if (input.length() == 1) {
      // Comando di un solo carattere
      char singleCommand = input.charAt(0);
      executeShortCommand(singleCommand);
    } else  {
      // Comando con parametro
      input.toCharArray(command, input.length() + 1); // Converti la stringa in un array di caratteri
      executeLongCommand(command);
    } 
  }

  WiFiClient client = server.available();   // listen for incoming clients

  if (client)  {
    // if you get a client,
    Serial.println(F("New client"));           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client

    while (client.connected())    {
      // loop while the client's connected
      if (client.available())      {
        // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        //Serial.write(c);                    // print it out the serial monitor

        if (c == '\n')  {
          // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0)  {
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
            client.println(F("    <input type=\"text\" id=\"valueInput\" placeholder=\"Inserisci un valore\" value = \"500\">"));
            client.println(F("    <button onclick=\"retrieveFile('/U')\">Up</button>"));
            client.println(F("    <button onclick=\"retrieveFile('/L')\">Left</button>"));
            client.println(F("    <button onclick=\"retrieveFile('/R')\">Right</button>"));
            client.println(F("    <button onclick=\"retrieveFile('/D')\">Down</button><br>"));
            client.println();
            client.println(F("    <script>"));
            client.println(F("        function retrieveFile(command) {"));
            client.println(F("            var value = document.getElementById('valueInput').value;")); // Recupera il valore inserito dall'utente
            client.println(F("            var fileUrl = command + value;")); // Concatena il valore inserito al comando
            client.println();
            client.println(F("            fetch(fileUrl)"));
            client.println(F("                .then(response => response.text())"));
            client.println(F("                .then(data => {"));
            client.println(F("                    console.log(\"Contenuto del file:\", data);"));
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
                  
          }  else  {

          // Check client request for commands:
          if (currentLine.indexOf(F("GET /R")) != -1) {
            sendPelcoDFrame(C_PAN_RIGHT_TILL_STOP, 5, 5);
            //checkResponse();           
            digitalWrite(led, HIGH);               
            Serial.print("\nCurrentline = ")  ;
            Serial.println(currentLine);
            Serial.print("DESTRA per...")  ;
            int tempVal =  getDelayValue(currentLine, "GET /R");
            Serial.println(tempVal)  ;
            delay(tempVal); // Ottieni il valore del ritardo dall'URL
            digitalWrite(led, LOW);                
            stopCamera();
          }

          if (currentLine.indexOf(F("GET /L")) != -1) {
            sendPelcoDFrame(C_PAN_LEFT_TILL_STOP, 5, 5);
            //checkResponse();           
            digitalWrite(led, HIGH);               
            Serial.print("\nCurrentline = ")  ;
            Serial.println(currentLine);
            Serial.print("SINISTRA per...")  ;
            int tempVal =  getDelayValue(currentLine, "GET /L");
            Serial.println(tempVal)  ;
            delay(tempVal); // Ottieni il valore del ritardo dall'URL
            digitalWrite(led, LOW);                
            stopCamera();
          }

          if (currentLine.indexOf(F("GET /U")) != -1) {
            sendPelcoDFrame(C_TILT_UP_TILL_STOP, 5, 5);
            //checkResponse();           
            digitalWrite(led, HIGH);               
            Serial.print("\nCurrentline = ")  ;
            Serial.println(currentLine);
            Serial.print("SU per...")  ;
            int tempVal =  getDelayValue(currentLine, "GET /U");
            Serial.println(tempVal)  ;
            delay(tempVal); // Ottieni il valore del ritardo dall'URL
            digitalWrite(led, LOW);                
            stopCamera();
          }


          if (currentLine.indexOf(F("GET /D")) != -1) {
            sendPelcoDFrame(C_TILT_DOWN_TILL_STOP, 5, 5);
            //checkResponse();           
            digitalWrite(led, HIGH);               
            Serial.print("\nCurrentline = ")  ;
            Serial.println(currentLine);
            Serial.print("GIU per...")  ;
            int tempVal =  getDelayValue(currentLine, "GET /D");
            Serial.println(tempVal)  ;
            delay(tempVal); // Ottieni il valore del ritardo dall'URL
            digitalWrite(led, LOW);                
            stopCamera();
          }
    
            // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        }  else if (c != '\r')   {
          // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }

    // close the connection:
    client.stop();
    Serial.println(F("Client disconnected"));
  }
}


int getDelayValue(String line, String command) {
  // Cerca la posizione del comando nel link
  int index = line.indexOf(command);
  if (index != -1) {
    // Se il comando è presente, trova il primo carattere numerico dopo il comando
    int numIndex = index + command.length(); // Indice del primo carattere dopo il comando
    String numStr = ""; // Stringa per memorizzare il numero
    // Continua a leggere i caratteri finché sono numeri
    while (numIndex < line.length() && isDigit(line.charAt(numIndex))) {
      numStr += line.charAt(numIndex); // Aggiungi il carattere alla stringa numerica
      numIndex++; // Passa al carattere successivo
    }
    // Converte la stringa numerica in un intero e restituisce il valore
    return numStr.toInt();
  }
  return 1000; // Ritorna il valore predefinito se il comando non è presente nell'URL o se non viene trovato alcun numero dopo il comando
}

void sendPelcoDFrame( byte command, byte data1, byte data2){
  byte bytes[7] = {0xFF, 0x01, 0x00, command, data1, data2, 0x00};
  byte crc = (bytes[1] + bytes[2] + bytes[3] + bytes[4] + bytes[5]) % 0x100;
  bytes[6] = crc;

  for (int i = 0; i < 7; i++)   {
    if (bytes[i] < 0x10) {
      Serial.print("0"); // Assicurati che ogni byte sia rappresentato da due cifre esadecimali
    }
//Serial.println(bytes[i], HEX); // Stampa il valore del byte in formato esadecimale
    Serial2.write(bytes[i]);
  }
}

void stopCamera() {
  Serial.println("STOP!");
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

void executeShortCommand(char singleCommand) {
  Serial.println("=============");
  Serial.println("Comando breve.");
  // Esecuzione del comando corrispondente
  switch (singleCommand) {
    case '6':
      panRight(5, 1000);
      break;
    case '4':
      panLeft(5, 1000);
      break;
    case '2':
      tiltUp(5, 1000);
      break;
    case '8':
      tiltDown(5, 1000);
      break;
    case '5':
      stopCamera();
      break;
    default:
      // Gestione di comandi non validi
      break;
  }
}

void executeLongCommand(char command[]) {
  // Analizza il comando di 5 caratteri e salva il numero dopo il primo carattere in commandValue
  sscanf(command, "%*c %d", &commandValue);

  Serial.println("=============");
Serial.print("Comando lungo:");
Serial.println(command[0]);
Serial.print("Parametro:");
Serial.println(commandValue);
  // Esegui l'azione appropriata basata sul primo carattere del comando
  switch (command[0]) {
    case '6':
      panRight(5, commandValue);
      checkResponse();
      break;
    case '4':
      panLeft(5, commandValue);
      checkResponse();
      break;
    case '2':
      tiltUp(5, commandValue);
      checkResponse();
      break;
    case '8':
      tiltDown(5, commandValue);
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

void panRight(int speed, int durationMS) {
  // PAN: 180° in 15200ms
  Serial.print("Right for ");
  Serial.println(durationMS);
  sendPelcoDFrame(C_PAN_RIGHT_TILL_STOP, speed, speed);
  checkResponse();           
  digitalWrite(led, HIGH);               
  delay(durationMS);
  digitalWrite(led, LOW);                
  stopCamera();
}


void panLeft(int speed, int durationMS) {
  // PAN: 180° in 15200ms
  Serial.print("Left for ");
  Serial.println(durationMS);
  sendPelcoDFrame(C_PAN_LEFT_TILL_STOP, speed, speed);
  checkResponse();           
  digitalWrite(led, HIGH);               
  delay(durationMS);
  digitalWrite(led, LOW);                
  stopCamera();
}


void tiltUp(int speed, int durationMS) {
  sendPelcoDFrame(C_TILT_UP_TILL_STOP, speed, speed);
  checkResponse();           
  digitalWrite(led, HIGH);               
  delay(durationMS);
  digitalWrite(led, LOW);                
  stopCamera();
}


void tiltDown(int speed, int durationMS) {
  sendPelcoDFrame(C_TILT_DOWN_TILL_STOP, speed, speed);
  checkResponse();           
  digitalWrite(led, HIGH);               
  delay(durationMS);
  digitalWrite(led, LOW);                
  stopCamera();
}
