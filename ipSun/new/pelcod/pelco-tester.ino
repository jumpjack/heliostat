  /*
 * There are three serial ports on the ESP known as U0UXD, U1UXD and U2UXD.
 * 
 * U0UXD is used to communicate with the ESP32 for programming and during reset/boot.
 * U1UXD is unused and can be used for your projects. Some boards use this port for SPI Flash access though
 * U2UXD is unused and can be used for your projects.
 * 
*/

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


void setup() {
  // Note the format for setting a serial port is as follows: Serial2.begin(baud-rate, protocol, RX pin, TX pin);
  Serial.begin(115200);
  pinMode(INFOPIN, OUTPUT);
  pinMode(MODEPIN, OUTPUT);
  digitalWrite(MODEPIN,HIGH);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.println("Serial Txd is on pin: "+String(TX));
  Serial.println("Serial Rxd is on pin: "+String(RX));
  delay(2000);
}

void loop() { //Choose Serial1 or Serial2 as required
  
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

      case 'q':
        sendPelcoDFrame(C_SET_PAN_POSITION, 5, 5);
        checkResponse();
        break;
      case 'w':
        sendPelcoDFrame(C_SET_TILT_POSITION, 5, 5);
        checkResponse();
        break;
      case 'e':
        sendPelcoDFrame(C_SET_POS, 0, 1);
        checkResponse();
        break;
      case 'r':
        sendPelcoDFrame(C_GOTO_POS, 0, 1);
        checkResponse();
        break;
      case 't':
        sendPelcoDFrame(C_CLEAR_POS, 0, 1);
        checkResponse();
        break;

      case 'a':
        sendPelcoDFrame(0x51, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

       sendPelcoDFrame(0x53, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        delay(1000);    

       sendPelcoDFrame(0x55, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

       sendPelcoDFrame(0x61, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

        sendPelcoDFrame(0x59, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

        sendPelcoDFrame(0x5b, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

        sendPelcoDFrame(0x5d, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

        sendPelcoDFrame(0x63, 0, 1);
        digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
        delay(100);                      // wait for a second
        digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
        checkResponse();
        delay(1000);    

        break;

      case '5':
        stopCamera();
        break;
      default:
        // Gestione di comandi non validi
        break;
    }
  }
  /*sendPelcoDFrame(C_PAN_LEFT_TILL_STOP,5,5);
  digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
  delay(1000);                      // wait for a second
  digitalWrite(INFOPIN, LOW);   // turn the LED off by making the voltage LOW
  stopCamera();
  delay(1000);    

  sendPelcoDFrame(C_PAN_RIGHT_TILL_STOP,5,5);
  digitalWrite(INFOPIN, HIGH);  // turn the LED on (HIGH is the voltage level)
  delay(1000);                      // wait for a second
  stopCamera();
  digitalWrite(17, LOW);   // turn the LED off by making the voltage LOW
  delay(2000);    */
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
