// Absolute positioning of two stepper motors 28BYJ-48 driven by ULN2003
#include <Unistep2.h>

// Define some steppers and the pins they will use
// pins for IN1, IN2, IN3, IN4, steps per rev, step delay(in micros)
Unistep2 stepper1(19, 18, 5, 17, 2048, 5000);
Unistep2 stepper2(23, 22, 21, 16, 2048, 5000);

void setup() {
  // Your setup code here
  // The library initializes the pins for you

  Serial.begin(9600);
  Serial.println(F(" *** Unistep2 library example ***"));
  Serial.println(F(" Enter absolute position between 0 and 360 degrees"));
}

void loop() {
  // We need to call run() frequently, so we place it in the loop()
  stepper1.run();
  stepper2.run();

  // Get user input via Serial monitor
  while (Serial.available() > 0 && (stepper1.stepsToGo() == 0 || stepper2.stepsToGo() == 0)) {
    float angle1 = Serial.parseFloat();
    float angle2 = Serial.parseFloat();

    if (Serial.read() == '\n') {
      Serial.print("Movement command: ");
      // currentPosition() gives us stepper position
      Serial.print("Stepper 1: ");
      Serial.print(stepper1.currentPosition());
      Serial.print(" --> ");
      Serial.print(angle1);
      Serial.print(" degrees | Stepper 2: ");
      Serial.print(stepper2.currentPosition());
      Serial.print(" --> ");
      Serial.print(angle2);
      Serial.println(" degrees");

      // Convert angles to steps
      int steps1 = (angle1 / 360.0) * 4096;
      int steps2 = (angle2 / 360.0) * 4096;

      // moveTo() chooses the shortest path between the two positions.
      stepper1.moveTo(steps1);
      stepper2.moveTo(steps2);
    }
  }
}
