#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <EEPROM.h>

//Variables
int i = 0;
int statusCode;
const char* ssid = "Default SSID";
const char* passphrase = "Default passord";
String st;
String content = "";
String esid = "";
String epass = "";
String eusername = "";
String euid = "";

#define CONFIG_MODE  1
#define RUN_MODE     2
#define AUTO_MODE    3

unsigned char MODE = RUN_MODE, reset_time = 0;


const uint16_t port = 6789;
const char * host = "192.168.2.184";

String tcp_data = "";
String secret_key = "";


//Function Decalration
bool testWifi(void);
void launchWeb(void);
void setupAP(void);
void config_task();

//Establishing Local server at port 80
WebServer server(80);

void setup()
{
  // check switch here to set suitable mode
  ///////////////////////////////////////
  Serial.begin(115200); //Initialising if(DEBUG)Serial Monitor
  Serial.println();
  Serial.println("Disconnecting current wifi connection");
  WiFi.disconnect();
  EEPROM.begin(512); //Initialasing EEPROM
  delay(10);
  pinMode(15, INPUT);
  Serial.println();
  Serial.println();
  Serial.println("Startup");

  //---------------------------------------- Read eeprom for ssid and pass
  Serial.println("Reading EEPROM ssid");


  for (int i = 0; i < 32; ++i)
  {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");

  for (int i = 32; i < 96; ++i)
  {
    
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);


  Serial.println("Reading EEPROM user name web");

  for (int i = 96; i < 96 + 40; ++i)
  {
    char c = char(EEPROM.read(i));
    if(c!= 0)
    eusername += char(EEPROM.read(i));
  }
  Serial.print("user nname web: ");
  Serial.println(eusername);

  Serial.println("Reading EEPROM user name web");

  for (int i = 136; i < 136 + 10; ++i)
  {
    char c = char(EEPROM.read(i));
    if(c!= 0)
    euid += char(EEPROM.read(i));
  }
  Serial.print("nodeid web: ");
  Serial.println(euid);

  reset_time = (unsigned char)(char(EEPROM.read(146)) - 48);
  Serial.print("reset time: ");
  Serial.println(reset_time);
  if(reset_time >= 9) 
  {
    reset_time = 0;
    EEPROM.write(146, (char)(reset_time + 48));
    EEPROM.commit();
    MODE = AUTO_MODE;  
  }

  WiFi.begin(esid.c_str(), epass.c_str());
  delay(1000);
}

void loop() {
  if(RUN_MODE == MODE) 
  {
    WiFiClient client;
    int reconnect_time = 0;
    if ((WiFi.status() == WL_CONNECTED))
    {
//      if (!client.connect(host, port)) 
//      {
//        Serial.println("Connection to host failed");
//        delay(1000);
//        return;
//      }
      if (client.connect(host, port)) 
      {
        Serial.println("Connected to server successful!");
        String secret_key = eusername + ";";
        secret_key = secret_key + euid;
  
        //secret_key.replace(0, "");
        
        client.print(secret_key);
      }
      
      while(client.connected()) 
      {
        while (client.available() > 0) 
        {
          char k = client.read();
          tcp_data.concat(k);
          if(k == '}') 
          {
              Serial.println(tcp_data);
              tcp_data = "";
          }
        }
      }
      
      reconnect_time++;

      if(reconnect_time >= 1)
      {
        reconnect_time = 0;
        Serial.println("Connection to host failed");
        reset_time++;
        EEPROM.write(146, (char)(reset_time + 48));
        EEPROM.commit();
        // reset CPU to connect to wifi
        ESP.restart();
      }
    }
    else
    {
      // check number of reset time because can't connect to wifi, switch to auto mode
      // ++ number time of reset, check it
      reset_time++;
      EEPROM.write(146, (char)(reset_time + 48));
      EEPROM.commit();
      // reset CPU to connect to wifi
      ESP.restart();
    }
  }
  else if(CONFIG_MODE == MODE)
  {
    config_task();
  }
  else if(AUTO_MODE == MODE)
  {
    // Do auto task here (such as set time to turn on/off light)
    Serial.println("In Auto-mode.....");
    delay(1000);
  }
}

void config_task()
{
      if (testWifi() ) //&& (digitalRead(15) != 1
    {
      Serial.println(" connection status positive");
      return;
    }
    else
    {
      Serial.println("Connection Status Negative / D15 HIGH");
      Serial.println("Turning the HotSpot On");
      launchWeb();
      setupAP();// Setup HotSpot
    }
  
    Serial.println();
    Serial.println("Waiting.");
  
    while ((WiFi.status() != WL_CONNECTED))
    {
      Serial.print(".");
      delay(100);
      server.handleClient();
    }
    delay(1000);
}

//----------------------------------------------- Fuctions used for WiFi credentials saving and connecting to it which you do not need to change
bool testWifi(void)
{
  int c = 0;
  //Serial.println("Waiting for Wifi to connect");
  while ( c < 20 ) {
    if (WiFi.status() == WL_CONNECTED)
    {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}

void launchWeb()
{
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("WiFi connected");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("SoftAP IP: ");
  Serial.println(WiFi.softAPIP());
  createWebServer();
  // Start the server
  server.begin();
  Serial.println("Server started");
}

void setupAP(void)
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      //Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "<ol>";
  for (int i = 0; i < n; ++i)
  {
    // Print SSID and RSSI for each network found
    st += "<li>";
    st += WiFi.SSID(i);
    st += " (";
    st += WiFi.RSSI(i);

    st += ")";
    //st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "</li>";
  }
  st += "</ol>";
  delay(100);
  WiFi.softAP("Connect to set up your wifi", "");
  Serial.println("Initializing_softap_for_wifi credentials_modification");
  launchWeb();
  Serial.println("over");
}

void createWebServer()
{
  {
    server.on("/", []() {

      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
      content = "<!DOCTYPE HTML>\r\n<html>Welcome to Wifi Credentials Update page";
      content += "<form action=\"/scan\" method=\"POST\"><input type=\"submit\" value=\"scan\"></form>";
      content += ipStr;
      content += "<p>";
      content += st;
      content += "</p><form method='get' action='setting'><label>SSID: </label><input name='ssid' length=32></br>";
      content += "<label>Pass: </label><input name='pass' length=64></br>";
      content += "<label>User name: </label><input name='uname' length=40></br>";
      content += "<label>Id: </label><input name='uid' length=10></br>";
      content += "<input type='submit'></form>";
      content += "</html>";
      server.send(200, "text/html", content);
    });
    server.on("/scan", []() {
      //setupAP();
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);

      content = "<!DOCTYPE HTML>\r\n<html>go back";
      server.send(200, "text/html", content);
    });

    server.on("/setting", []() {
      String qsid = server.arg("ssid");
      String qpass = server.arg("pass");
      String qusername = server.arg("uname"); // maximum 40 char
      String quid = server.arg("uid"); // maximum 10 char
      
      if (qsid.length() > 0 && qpass.length() > 0 && qusername.length() > 0 && quid.length() > 0) {
        Serial.println("clearing eeprom");
        for (int i = 0; i < 96+50; ++i) {
          EEPROM.write(i, 0);
        }
        Serial.println(qsid);
        Serial.println("");
        Serial.println(qpass);
        Serial.println("");

        Serial.println("writing eeprom ssid:");
        for (int i = 0; i < qsid.length(); ++i)
        {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (int i = 0; i < qpass.length(); ++i)
        {
          EEPROM.write(32 + i, qpass[i]);
          Serial.print("Wrote: ");
          Serial.println(qpass[i]);
        }

        Serial.println("writing user name of web:");
        for (int i = 0; i < qusername.length(); ++i)
        {
          EEPROM.write(96 + i, qusername[i]);
          Serial.print("Wrote: ");
          Serial.println(qusername[i]);
        }

        Serial.println("writing node id of web:");
        for (int i = 0; i < quid.length(); ++i)
        {
          EEPROM.write(136 + i, quid[i]);
          Serial.print("Wrote: ");
          Serial.println(quid[i]);
        }
        
        EEPROM.commit();

        content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
        statusCode = 200;
        ESP.restart();
      } else {
        content = "{\"Error\":\"404 not found\"}";
        statusCode = 404;
        Serial.println("Sending 404");
      }
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(statusCode, "application/json", content);

    });
  }
}
