
int servopin = D0;
Servo myservo;
int led1 = D7;

void setup()
{
   myservo.attach(servopin);  // attaches the servo on pin d0


   Particle.function("servo",servoControl);
        digitalWrite(led1, HIGH);


}



void loop()
{
   // Nothing to do here
}

int servoControl(String command){
    
  int pos = command.toInt();
    myservo.attach()
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(150); 
    myservo.write(90);              // tell servo to go to position in variable 'pos'
    myservo.detach()
    return 2;
    
}
