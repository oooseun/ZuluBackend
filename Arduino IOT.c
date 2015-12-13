#include <RCSwitch.h>
RCSwitch mySwitch = RCSwitch();
#include <SPI.h>
#include <WiFi.h>

char ssid[] = "NETGEAR";      //  your network SSID (name) 
char pass[] = "xxxxxxxxxxxxxxxxx";   // your network password
int keyIndex = 0;                 // your network key Index number (needed only for WEP)

int status = WL_IDLE_STATUS;
WiFiServer server(66556);

#include <math.h>
int a;
float temperature;
int B=3975;                  //B value of the thermistor
float resistance;
bool ishome;
long previousMillis = 0; 
int interval = 1000;
void setup() {
  Serial.begin(9600);      // initialize serial communication

  
  // Transmitter is connected to Arduino Pin #10  
  mySwitch.enableTransmit(7);

  // Optional set pulse length.
  mySwitch.setPulseLength(180);

  
  while ( status != WL_CONNECTED) { 
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);                   // print the network name (SSID);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:    
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(2000);
  } 
  server.begin();                           // start the web server on port 8080
  printWifiStatus();                        // you're connected now, so print out the status
 
}


void loop() {
	//Totally not needed
unsigned long currentMillis = millis();
  if(currentMillis - previousMillis > interval) {
    // save the last time you blinked the LED 
    previousMillis = currentMillis;   
    unsigned long currentMillis = millis();
    a=analogRead(3);
    resistance=(float)(1023-a)*10000/a; //get the resistance of the sensor;
    temperature=1/(log(resistance/10000)/B+1/298.15)-273.15;//convert to temperature via datasheet ;
    Serial.print("Current temperature is ");
    Serial.println(temperature);
  }
    

  WiFiClient client = server.available();   // listen for incoming clients
  if (client) {                             // if you get a client,
    Serial.println("new client");           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        if (c == '\n') {                    // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {  
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:    
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();

            // the content of the HTTP response follows the header:
           client.print("<!DOCTYPE html><html><head><meta name='apple-mobile-web-app-capable' content='yes' /><meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' /><title>Ope's Room Control</title><style type='text/css'>@import url('css.css');</style><link href='http://www.oooseun.com/css.css' rel='stylesheet' type='text/css'></head><body><h1>Ope's Room Control</h1><hr /><br /><br /><a href=\'/switch1on\'>Switch 1 On</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\'/switch1off\'>Switch 1 Off</a> <br/><br /><br /><a href=\'/switch2on\'>Switch 2 On</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ");
           client.print("<a href=\'/switch2off\'>Switch 2 Off</a> <br/><br/><br/><a href=\'/switch3on\'>Switch 3 On</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\'/switch3off\'>Switch 3 Off</a><br/><br/><br/><a href=\'/switch4on\'>Switch 4 On</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=\'/switch4off\'>Switch 4 Off</a> <br/><br/><br/><a href=\'/switch5on\'>Switch 5 On</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\'/switch5off\'>Switch 5 Off</a><br/><br/><br/><footer>Created by Ope Oladipo. </footer><br /></body></html>");

            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;         
          } 
          else {      // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        }     
        else if (c != '\r') {    // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine       
          }

        // Check to see if the client request was "GET /H" or "GET /L":
            if (currentLine.endsWith("GET /switch1on"))   {
                  mySwitch.send(5526835,24);}                       
            if (currentLine.endsWith("GET /switch1off"))  {
                  mySwitch.send(5526844,24);}             
            if (currentLine.endsWith("GET /switch2on"))   {
                  mySwitch.send(5526979,24);}
            if (currentLine.endsWith("GET /switch2off"))  {
                  mySwitch.send(5526988,24);}
            if (currentLine.endsWith("GET /switch3on"))   {
                  mySwitch.send(5527299,24);}
            if (currentLine.endsWith("GET /switch3off"))  {
                  mySwitch.send(5527308,24);}
            if (currentLine.endsWith("GET /switch4on"))   {
                  mySwitch.send(5528835,24);}
            if (currentLine.endsWith("GET /switch4off"))  {
                  mySwitch.send(5528844,24);}
            if (currentLine.endsWith("GET /switch5on"))   {
                  mySwitch.send(5534979,24);}
            if (currentLine.endsWith("GET /switch5off"))  {
                  mySwitch.send(5534988,24);
            if (currentLine.endsWith("GET /home"))  {
                  ishome=true;}
            if (currentLine.endsWith("GET /nothome"))   {
                  ishome=false;} 
      if (currentLine.endsWith("GET /cd"))   {
                  system("cd home/root/homebridge");} 
      if (currentLine.endsWith("GET /homebridge"))   {
                  system("node app");}   
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disonnected");
  }
  
}
void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}

