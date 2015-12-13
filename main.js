/*jslint node  :true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*Larabar MAC = f0:4f:7c:e5:49:08  For the amazon dash button*/
//Why am i using "no" and "yes" instead of true? i needed 3 states
'use strict';

//Module declarations
var express = require('express');                       //For the API
var app = express();                                    //Instance declaration
var mraa = require("mraa");                             //For controlling Edison's ports
var accountSid = 'AC5e54hb6g5646g46tg546fsb4vbrg4579';  //Twilio Credentials
var authToken = 'd26g54645h567yg756h47g67y54h6726a0';     //Twilio Credentials      
var request = require('request');                       //For making web requests
var client = require('twilio')(accountSid, authToken);  //require the Twilio module and create a REST client
var ForecastIo = require('forecastio');                 //For weather updates
var forecastIo = new ForecastIo("13084bh5777777777777767fg7927");
var moment = require('moment');                         //For Time/date stuff
var bodyParser = require('body-parser');                //For json parsing
var multer = require('multer');                         //For json parsing
var upload = multer();                                  // for parsing multipart/form-data

app.use(bodyParser.json());                             // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-urlencoded


console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));//If you see the current date in the console, you're getting somewhere!
var startTime = moment();                               //Time of startup. Useful for knowing uptime.
var endTime;                                            //FD 
//var sys            = require('util');
var iphoneUUID = 'chre97v8tgew9hw0cr0we8grve0wgdweas0dyc';
var photonAPI = 'https://api.particle.io/v1/devices/2131321231684168415163432/servo?access_token=60fd45616h5g31d35g41df61gd6f8g4acbacb';
/********************************************************************************/
/*PushBullet*/
var PushBullet = require('pushbullet');                                         //For Netflix n Chill.
var push = new PushBullet('v1bdhbfsgebiuwgbsboasdbnsdfdI');     				//Instance Dec
var Chrome = 'ujxxxxxxxxxxxx';                                          		//You want to go to pushbullet's site and get 'keys' for the devices you want to communicate with
var Ozymandias = 'ujxxxxxxxxxxxx';
var Safari = 'ujxxxxxxxxxxxx';
var self = 'ujAxxxxxxxxxxxx';
var iphonekey = 'ujxxxxxxxxxxxx';
var macbookair = 'ujxxxxxxxxxxxx';

/*************************** SETUP_VARIABLES*****************************************/
var ledPin = 8;                                         //LED	Initializes light(LED) pin etc...
var motionPin = 2;                                      //MOTION SENSOR
var lightSenPin = 2;                                    //LIGHTSENSOR -ANALOG Initializes temp sensor pin which is actually A0
var tempPin = 3;                                        //TEMPERATURE-ANALOG
var B = 3975;                                           //Temp Constant (for conversion)
//var thresholdvalue   = 400;                           //FD
var soundSensorPin = 1;                                 //Sound Sensor pin. IMO its wayyy better to hook up an actual mic. 

/** Analog Pins **/
var thetempsensor = new mraa.Aio(tempPin);              //Initialization
var thelightsensor = new mraa.Aio(lightSenPin);         
var thesoundsensor = new mraa.Aio(soundSensorPin);      

/**DIGITAL pins**/              
var LED = new mraa.Gpio(ledPin);                        //Initialization
LED.dir(mraa.DIR_OUT); //LED.write(1) turns it on!!     //Initializing the direction. conversely  mraa.DIR_IN makes it an input
var theMotion = new mraa.Gpio(motionPin);
theMotion.dir(mraa.DIR_IN);

/*** Locations***/
var leagueCityLat = '29.48';                        //Possible locations
var leagueCityLon = '-95.15';
var londonlat = '51.506';
var londonlon = '-0.127';
var cornellLat = '42.44';
var cornellLon = '-76.48';
var ishome = "yes";                                     //Home status. There's a reason for me not using true/false
var tempArray = new Array(20)                           //Temp array initializer. App crashes if it has no data to go on. 
tempArray = [100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,100.0,0,0,0,0,0]
var tempFloat=0.0;
var vitals = {                                          // Exports stats/vitals in the API
    'temp': 0,
    'light': 0,
    'outsideTemp': 0,
    'icon': "",
    'ishome': "yes",
    'ismotion': false,
    'isnoise': false,
    'state1': "off",
    'state2': "off",
    'state3': "off",
    'state4': "off",
    'visits': 0,
    'webcamstatus': "undefined",
    'tempRaw': 0,
    'uptime': moment().from(startTime),
    'motionLights':"0000",
    'motionlight1':0,
    'motionlight2':0,
    'motionlight3':0,
    'motionlight4':0,
    'tempArray':[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
};
console.log(vitals);
/*
setTimeout(function(){request('http://0.0.0.0:606068/switch4off', function (error, response, body) {              //FD
	if (!error) {
		//console.log(body);
	}
});},5500);
setTimeout(function(){request('http://0.0.0.0:606068/switch3off', function (error, response, body) {
	if (!error) {
		//console.log(body);
	}
});},6500);
setTimeout(function(){request('http://0.0.0.0:high606068/switch2off', function (error, response, body) {
	if (!error) {
		//console.log(body);
	}
});},7500);
setTimeout(function(){request('http://0.0.0.0:606068/switch1off', function (error, response, body) {
	if (!error) {
		//console.log(body);
	}
});},8500);

*/
function updateArray() {                                                                    //Append new temp to tempArray
    tempArray.splice(tempArray.length - 1, tempArray.length);
    tempArray.unshift.apply(tempArray, [tempFloat]);
    vitals.tempArray = tempArray
}

function settrue() {                                                                        //set is home to true
    ishome = "yes";
    vitals.ishome = ishome;
    console.log('setTrue has been called. vitals.ishome = ' + vitals.ishome);
}

function setfalse() {                                                                       //set is home to false
    ishome = "no";
    vitals.ishome = ishome;
    console.log('setFalse has been called. vitals.ishome = ' + vitals.ishome);
}

function getTemp() {                                                                        //get current temp from temp sensor and update vars
    var tempValueRAW = thetempsensor.read();
    var resistance = (1023 - tempValueRAW) * 10000 / tempValueRAW; //Get sensors' resistance
    var celsius = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; //convert to temperature
    var temp = (celsius * (9 / 5)) + 31;
    //console.log("Temperature: " + temp.toFixed(1) + '\xB0' + 'F');
    vitals.temp = temp.toFixed(0);
    tempFloat = temp.toFixed(1);
    console.log(temp)
    console.log(tempValueRAW)
    vitals.tempRaw = tempValueRAW;
}

function getLight() {                                                                       //Get current light value from sensor.
    var Lux = thelightsensor.read();
    var lightValue = Math.abs((Lux * 0.15) - 15);
    //console.log('The light level is about ' + lightValue.toFixed(2) + '%');
    vitals.light = Math.floor(lightValue);                                                  //this line (always for succeeding functions) updates the vitals dictionary i init above. 
}
/*function turnOnLED() {                                                                    //DB
	LED.write(1);
}

function turnOffLED() {
	LED.write(0);
}*/
function isMotion() {                                                                       //Get motion sensor value
    vitals.ismotion = theMotion.read();
    return vitals.ismotion;
}

function getSound() {                                                                       //Get motion sensor value             
    vitals.isnoise = thesoundsensor.read();
    //console.log('Sound : ' + vitals.isnoise)

    return vitals.isnoise;

}

function awaycase() {                                                                       //Handles case where i'm not home and motion is detected. 
    if ((vitals.ishome === "no") && (vitals.ismotion === 1)) {                              //in this case, it turns on lights depending on what my ZULU 
        if (vitals.motionlight1 === 1 && vitals.state1 == 'off'){                           //app preferences indicates. Then it alerts me on my phone.
            request('http://0.0.0.0:20208/state1', function (error, response, body) { /*Do nothing*/ });
        }
        if (vitals.motionlight2 === 1 && vitals.state2 == 'off'){
            request('http://0.0.0.0:20208/state2', function (error, response, body) { /*Do nothing*/ });
        }
        if (vitals.motionlight3 === 1 && vitals.state3 == 'off'){
            request('http://0.0.0.0:20208/state3', function (error, response, body) { /*Do nothing*/ });
        }
        if (vitals.motionlight4 === 1 && vitals.state4 == 'off'){
            request('http://0.0.0.0:20208/state4', function (error, response, body) { /*Do nothing*/ });

        }
        push.link(iphonekey, 'Hey Fam, there\'s been some movement in your room', 'http://0.0.0.0:4261/', function (error, response) {
            if (!error) {
                console.log('Pushed Succesfully');
            }
        });
    }
}

function checkIsHome() {                                                                    //Turns on LED when not home. Mostly FD
    if (vitals.ishome === "no") {
        LED.write(1);
    } else {
        LED.write(0);
    }
}

function updateVitals() {                                                                   //Updates weather every 30 mins(time interveal determined below)
    var seconds = Math.floor((new Date()).getTime() / 1000);
    console.log(seconds);
    try {
        forecastIo.timeMachine(cornellLat, cornellLon, seconds, function (err, data) {      //Read the forecastio github page for more info on this. 
            if (err)
                console.log('Error in forecastio');
            //console.log(JSON.stringify(data, null, 2));
            //console.log(JSON.stringify(data.currently.temperature, null, 2));
            vitals.outsideTemp = (data.currently.temperature).toFixed(1);
            console.log(vitals.outsideTemp);
            vitals.icon = data.currently.icon;
            console.log(vitals.icon);
        });
    } catch (err) {
        console.log('Check to see if forecast is ok');
    }
}

function pauseweb() {                                                                       //Pause webcam 'recording'
    request('http://Harttland:Harttland@xx.xx.xx.xx.xx:xxxx/0/detection/pause', function (error, response, body) {
        if (!error) {
            //console.log(body);
        } else {
            console.log(error)
        }
    });
}

function getWebStatus() {                                                                   //Get webcam status. 
    request('http://Harttland:Harttland@xx.xx.xx.xx.xx:xxxx0/detection/status', function (error, response, body) {
        if (!error) {
            if (body.search("PAUSE") > 1) {
                vitals.webcamstatus = 'paused'
            } else if (body.search("ACTIVE") > 1) {
                vitals.webcamstatus = 'active'
            } else {
                vitals.webcamstatus = 'undefined'
            }

        } else {
            console.log(error)
        }
    });
}
String.prototype.replaceAt=function(index, character) {                                     //For appending the temp. Thanks StackOverflow =)
    return this.substr(0, index) + character + this.substr(index+character.length);
}

/*&*****#$%^%%$************SERVER*******************************/                           //Be sure to read the express API manual
var num_err = 0;                                                                            //Number of uncaught exceptions

app.use(function (req, res, next) { // middleware to use for all requests
    vitals.visits++;

    next(); //  go to the next route and don't stop here
});

app.get('/', function (req, res) {                                                          //Test this! 
    res.send('Hello World!');
});

app.get('/shutdown', function (req, res) {                                                  //FD. Now handled in the app
    res.send('Shutdown!');
    //request(...)?
    console.log('Shutdown link Accessed');
});
app.get('/netflix', function (req, res) {                                                   //Turns off switches and requests netflix via pushbullet. 
    res.send('Chillllll!');
    request('http://0.0.0.0:606068/switch2off', function (error, response, body) {            //Could have made these functions but then as they are, they could be reduced to a line.        
        if (!error) {
            //console.log(body);
        }
    });
    request('http://0.0.0.0:606068/switch1off', function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });
    push.link('ujAz2riWPZIsjzWIEVDzOK', 'Spot', 'https://netflix.com', function (err, response) { //Useful for Debugging perhaps
        console.log(response);
    });
    vitals.state1 = 'off';
    vitals.state2 = 'off';
    vitals.state4 = 'off';

    request.post(photonAPI, {
        form: {
            radio: 110
        }
    });
    console.log('NFLX+CHLL ACTIVATED');
});
app.get(['/sleep','/alloff'], function (req, res) {                                                 //Turns everything off. 
    res.send('Goodnight!');
    vitals.state1 = 'off';
    vitals.state2 = 'off';
    vitals.state3 = 'off';
    vitals.state4 = 'off';
    request('http://0.0.0.0:606068/switch1off', function (error, response, body) { /*Do nothing*/ });
    request('http://0.0.0.0:606068/switch2off', function (error, response, body) { /*Do nothing*/ });
    request('http://0.0.0.0:606068/switch3off', function (error, response, body) { /*Do nothing*/ });
    request.post(photonAPI, {
        form: {
            radio: 110
        }
    });
    console.log('Sleep time');
});
app.get(['/wake','/allon'], function (req, res) {                                                  //Turns everything on
    res.send('Morning!');
    vitals.state1 = 'on';
    vitals.state2 = 'on';
    vitals.state3 = 'on';
    vitals.state4 = 'on';
    request('http://0.0.0.0:606068/switch1on', function (error, response, body) { /*//Do nothing*/ });
    request('http://0.0.0.0:606068/switch2on', function (error, response, body) { /*//Do nothing*/ });
    request('http://0.0.0.0:606068/switch3on', function (error, response, body) { /*//Do nothing*/ });
    request.post(photonAPI, {
        form: {
            radio: 40
        }
    });
    console.log('Wakey Wakey');
});

app.get('/home', function (req, res) {                                                  //set ishome to yes, stop 'recording'
    res.send('Welcome Home Batman!');
    if (ishome !== "yes") {
        settrue();
        console.log('Welcome Home');
    }
    console.log(ishome);
    request('http://Harttland:Harttland@xx.xx.xxx.xxx:xxxx/0/detection/pause', function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });
});
app.get('/nothome', function (req, res) {                                               //set ishome to no, begin 'recording'                
    res.send('Bye!');
    if (ishome === "yes") {
        setfalse();
        console.log('Bye ');
    }
    console.log(ishome)
    request('http://Harttland:Harttland@xx.xx.xxx.xxx:xxxx/0/detection/start', function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });
});
app.get('/vitals', function (req, res) {                                                //return vitals dictionary if pinged
    res.json(vitals);
    //console.log(vitals);
});
app.get(['/camon', '/cameraon', '/webcamon', '/webon'], function (req, res) {           //turn on camera 'recording' if pinged
    res.send('Camera is online');

    request('http://Harttland:Harttland@xx.xx.xxx.xxx:xxxx/0/detection/start', function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });

});
app.get(['/camoff', '/cameraoff', '/webcamoff', '/weboff'], function (req, res) {        //turn on camera 'recording' if pinged
    res.send('Camera is offline')
    request('http://Harttland:Harttland@xx.xx.xxx.xxx:xxxx/0/detection/pause', function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });

});
app.get('/state1', function (req, res) {                                                //Turn ON/OFF lightsand and set states correctly. 
    res.send('Ok');
    console.log('dgfh')
    if (vitals.state1 === 'on') {
        vitals.state1 = 'off';
        request('http://0.0.0.0:606068/switch1off', function (error, response, body) {
            if (!error) {
                //console.log(body);
            }
        });
    } else if (vitals.state1 === 'off') {
        vitals.state1 = 'on';
        request('http://0.0.0.0:606068/switch1on', function (error, response, body) {
            if (!error) {
                //console.log(body);
            } else {
                console.log(error)
            };
        });
    }

    console.log("the current state is" + vitals.state1);
});
app.get('/state2', function (req, res) {
    res.send('Ok');
    if (vitals.state2 === 'on') {
        vitals.state2 = 'off';
        request('http://0.0.0.0:606068/switch2off', function (error, response, body) {
            if (!error) {
                //console.log(body);
            }
        });
    } else if (vitals.state2 === 'off') {
        vitals.state2 = 'on';
        request('http://0.0.0.0:606068/switch2on', function (error, response, body) {
            if (!error) {
                //console.log(body);
            }
        });
    }

    console.log("the current state is" + vitals.state2);
});
app.get('/state3', function (req, res) {
    res.send('Ok');
    if (vitals.state3 === 'on') {
        vitals.state3 = 'off';
        request('http://0.0.0.0:606068/switch3off', function (error, response, body) {
            if (!error) {
                //console.log(body);
            }
        });
    } else if (vitals.state3 === 'off') {
        vitals.state3 = 'on';
        request('http://0.0.0.0:606068/switch3on', function (error, response, body) {
            if (!error) {
                //console.log(body);
            }
        });
    }

    console.log("the current state is" + vitals.state3);
});
app.get('/state4', function (req, res) {

    if (vitals.state4 === 'on') {
        vitals.state4 = 'off';

        request.post(photonAPI, {
            form: {
                radio: 110
            }
        });


    } else {
        vitals.state4 = 'on';

        request.post(photonAPI, {
            form: {
                radio: 40
            }
        });


    }
    res.send(vitals.state4);
    console.log("the current state is" + vitals.state4);
});


app.get('/mainon', function (req, res) {                                    //Turn on the main light only
    
    vitals.state4 = 'on';
    request.post(photonAPI, {
        form: {
            radio: 40
        }
    });

});
app.get('/mainoff', function (req, res) {                                   //Turn the main light off   
    
    vitals.state4 = 'off';
    request.post(photonAPI, {
        form: {
            radio: 110
        }
    });

});
app.post('/motionlight', function (req, res) {                                  //Handles app preference of which lights to turn on when not home and motion is detected
     var lightInQuestion = parseInt(req.body.key[0], 10)
     var lightMode = parseInt(req.body.key[1], 10)
     //console.log(lightMode)
     //console.log(lightInQuestion)
     
    if (lightMode === 1 || lightMode === 0) {
    switch (lightInQuestion) {
    case 1:
        vitals.motionlight1 = lightMode;
        vitals.motionLights.replaceAt(lightInQuestion - 1, req.body.key[1]);
        break;
    case 2:
        vitals.motionlight2 = lightMode;
        vitals.motionLights.replaceAt(lightInQuestion - 1, req.body.key[1]);

        break;
    case 3:
        vitals.motionlight3 = lightMode;
        vitals.motionLights.replaceAt(lightInQuestion - 1, req.body.key[1]);

        break;
    case 4:
        vitals.motionlight4 = lightMode;
        vitals.motionLights.replaceAt(lightInQuestion - 1, req.body.key[1]);

        break;
    
    default:
        break;
    }
    res.send('Ok');
} else {
        res.send('not Ok')
    }
    res.end
});
app.get('/motionlights',function(req,res){
    res.send(vitals.motionLights)
})
app.get('/spotify',function(req,res){                       //opens up spotify's web interface. Closest i could get to automatically playing music. 
    push.link('ujxxxxxxxxxxxxxxK', 'Spot', 'https://play.spotify.com/radio/user/oooseun/playlist/7Gd4eg56h46e5he645xER', function(error, response) {});
})
/*** EXECUTE***/
updateVitals();
setInterval(updateVitals, 300000);                          //Weather every 5 mins)
setInterval(isMotion, 500);
setInterval(getSound, 500);
setInterval(getTemp, 4000);
setInterval(awaycase, 4000);
setInterval(checkIsHome, 20);
setInterval(getLight, 500);
setInterval(getWebStatus, 10000);
setInterval(updateArray, 900000);//900000                   //Temp updates every 15 mins
setInterval(function () {
    console.log('Number of hits :' + vitals.visits);
}, 50000);
setInterval(function () {
    vitals.uptime = startTime.from(moment());
}, 10000);
setTimeout(pauseweb, 9000);

request('http://localhost:20208/home', function (error, response, body) {
    if (!error) {
        console.log(body);
    }
});
setTimeout(function () {
    for (var x =0;x<21;x++){updateArray()}
}, 7000);





var server = app.listen(20208, function () {             //start API server
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

var strng;  
process.on('uncaughtException', function (err) {           //'Handle' Uncaught Exceptions
    console.error('Caught exception: ' + err);
    console.log("Node NOT Exiting...");
    num_err++;
    endTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    strng = 'An Error has occured, check if the Intel is down.  Count = ' + num_err;
    push.note('ujew5b4t3bvbv5tdscdzxK', strng + ' The error was' + err + '      The err stack is' + err.stack, '', function (error, response) {});
    //push.note('ujAz2riWPZIsjzWIEVDzOK', 'Start time = ' + startTime +'  EndTime = ' + endTime, function (error, response) {});
    console.log('this is the ' + num_err + ' time it\'s happened');
    console.log(err.stack);

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function wakeup() {                                                             //should integrate this with the app.
    var wakeup1time = '9:00:00 am';                                             //Turns on lighst in the morning to wake me up according to my calendar.
    var wakeup2time = '9:07:00 am';
    var wakeup3time = '9:11:00 am';
    var day = new moment().format('dddd');
    if ( 1===2) {     //Schools over =) /*day === 'Monday' || day === 'Wednesday' || day === 'Friday'*/
        if (moment().format('h:mm:ss a') === wakeup1time) {
            vitals.state1 = 'on';
            request('http://0.0.0.0:606068/switch1on', function (error, response, body) {
                if (!error) {
                    //console.log(body);
                } else {
                    console.log(error)
                };
            });
        }
        if (moment().format('h:mm:ss a') === wakeup2time) {
            vitals.state2 = 'on';
            request('http://0.0.0.0:606068/switch2on', function (error, response, body) {
                if (!error) {
                    //console.log(body);
                } else {
                    console.log(error)
                };
            });
        }
        if (moment().format('h:mm:ss a') === wakeup3time) {
            vitals.state3 = 'on';
            request.post(photonAPI, {
                form: {
                    radio: 40
                }
            });

        }
    }
}
setInterval(wakeup, 1000);