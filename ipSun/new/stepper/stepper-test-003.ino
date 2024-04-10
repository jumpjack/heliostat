// Test per motore 28BYJ-48 5V
//////
// ATTENZIONE:
// - esistono versioni a 12V e a 5V di questo motore
// - uno dei miei motori aveva i fili collegati a vanvera, ho dovuto ricablare a mano il connettore!


#include <Stepper.h>

// Costanti per il primo motore
const int stepsPerRevolution1 = 2048;
#define IN1_1 19
#define IN2_1 18
#define IN3_1 5
#define IN4_1 17

// Costanti per il secondo motore
const int stepsPerRevolution2 = 2048;  // Cambia questo valore per adattarlo al numero di passi per rivoluzione
#define IN1_2 23 
#define IN2_2 22  
#define IN3_2 21  
#define IN4_2 16  

// Inizializza la libreria stepper per il primo motore
Stepper myStepper1(stepsPerRevolution1, IN1_1, IN3_1, IN2_1, IN4_1);
// Inizializza la libreria stepper per il secondo motore
Stepper myStepper2(stepsPerRevolution2, IN1_2, IN3_2, IN2_2, IN4_2);

void setup() {
  // Imposta la velocità a 10 rpm per entrambi i motori
  myStepper1.setSpeed(10);
  myStepper2.setSpeed(10);
  // Inizializza la porta seriale
  Serial.begin(115200);
}

void loop() {
  // Esegui una rotazione in senso orario per il primo motore
  Serial.println("Motore 1: orario");
  myStepper1.step(stepsPerRevolution1/4);
  delay(200);

  // Esegui una rotazione in senso antiorario per il secondo motore
  Serial.println("Motore 2: antiorario");
  myStepper2.step(-stepsPerRevolution2/4);
  delay(200);

  // Esegui una rotazione in senso antiorario per il primo motore
  Serial.println("Motore 1: antiorario");
  myStepper1.step(-stepsPerRevolution1/4);
  delay(200);

  // Esegui una rotazione in senso orario per il secondo motore
  Serial.println("Motore 2: orario");
  myStepper2.step(stepsPerRevolution2/4);
  delay(200);
}
