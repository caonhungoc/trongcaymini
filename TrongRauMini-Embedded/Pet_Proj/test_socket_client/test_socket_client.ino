#include <WiFi.h>
//#include "MySocketHandle.h"
const char* ssid = "Embedded-Training-Lab-Gigabit";
const char* password = "_Pass1234_";

const uint16_t port = 6789;
const char * host = "192.168.2.184";

int pin1 = 19;
int pin2 = 18;



void setup()
{
    pinMode(pin1, OUTPUT);
    pinMode(pin2, OUTPUT);
    Serial.begin(115200);
    delay(10);
    // Start by connecting to a WiFi network

    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}
String tcp_data = "";
const String secret_key = "Hello from ESP32!id:hh32123441,pass:sdkjdkj21uid91@@#E12";// Node_01_id
void loop()
{
    WiFiClient client;
    if (!client.connect(host, port)) {
      Serial.println("Connection to host failed");
      delay(1000);
      return;
    }
    Serial.println("Connected to server successful!");
    client.print(secret_key);
    while(client.connected()) 
    {
      while (client.available() > 0) 
      {
        char k = client.read();
        tcp_data.concat(k);
        if(k == '}') 
        {
            Serial.print(tcp_data);
            //Serial.println(tcp_data.substring(0, 4));
            if(tcp_data.substring(0, 5).equals("pin1:")) // control pin 1
            {
                String temp = tcp_data.substring(5, 6);
                if(temp.toInt() == 0) 
                {
                  Serial.print("pin1 off");
                  digitalWrite(pin1, LOW);
                }
                else
                {
                  Serial.print("pin1 on");
                  digitalWrite(pin1, HIGH);
                }
            }
            else if(tcp_data.substring(0, 5).equals("pin2:")) // control pin 2
            {
                String temp = tcp_data.substring(5, 6);
                if(temp.toInt() == 0) 
                {
                  Serial.print("pin2 off");
                  digitalWrite(pin2, LOW);
                }
                else
                {
                  Serial.print("pin2 on");
                  digitalWrite(pin2, HIGH);
                }
            }
            tcp_data = "";
        }
        //Serial.print(k);
      }
      delay(10);
    }
    Serial.println();
    client.stop();
    Serial.println("Client disconnected");
}
