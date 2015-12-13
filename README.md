What is Zulu
============

Zulu is a DIY home automation platform/hub with several integrations and features like controlling switches via a RF transmitter, webcam monitoring, Siri integration, Browser/Netflix integration, away mode, vitals monitors and an iOS app to control all of this.

App <http://zulu.oooseun.com/>
Community
=========

If you're having any issues, feel free to open issues and PRs here

Disclaimer
==========

I’m not a programmer, so some of the code may be a little redundant or inefficient.

Hardware
========

I’m sure you don’t have to use an Edison, but it worked for me

-   Edison –Arduino Edition <http://amzn.to/1Qk0vkr>

-   Grove IoT starter Kit <http://amzn.to/1Qk0Aoa>

-   PIR motion sensor <http://amzn.to/1Qk0Qna>

-   A webcam

-   9v DC power supply. &gt;1A <http://amzn.to/1Nh10bp>

-   LED RF control <http://amzn.to/1Nh19LU>

-   RF remote outlet control <http://amzn.to/1Qk1KA1>

-   RF receiver/transmitter <http://amzn.to/1Nh1caH>

-   Microservo TowerPro SG90

-   5050 Waterproof LED Strip light

Installation
============

The full installation is somewhat complex and requires many parts. Do not fear though as if I did it with no experience whatsoever, you can do it to !

To start off, go look through the code. Like now, make sure you understand what each line is doing. It’s heavily commented, so that should help. “FD” means for debugging purposes and can be ignored. “%%%%” will be in place of a private API key.

Done? Ok, lets begin.

Basic/Background
----------------

Some accounts that may be useful to get the most out of this would be Push bullet, forecastio(makers of dark sky) dev account, and twilio (if you want to be texted by your Edison).

I’m going to assume you’re a little bit familiar with the terminal & you’ve played around with your Edison before beginning this tutorial. If you haven’t you can learn about that [here](http://www.instructables.com/id/Absolute-Beginners-Guide-To-The-Intel-Edison/) and [here](http://www.instructables.com/id/REAL-beginners-guide-to-setting-up-the-Intel-Ediso/?ALLSTEPS). Those links will go over how to get into the Edison’s terminal via ssh & serial port. When in trouble/doubt connect via [Serial](https://software.intel.com/en-us/setting-up-serial-terminal-on-system-with-windows). Some things I recommend you do (if you haven’t already) would be to update your edison’s image.

Download WinSCP and log in to your Edison. Get familiar with the file structure (it’s a GUI so this should be easy). Now in the terminal type

> echo "src mraa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" &gt; /etc/opkg/mraa-upm.conf

opkg update

opkg install libmraa0

These commands will update mraa, the native library for communicating between Edison and IO devices. Next Navigate to this file ‘/etc/opkg/base-feeds.conf’ and paste this in. You could use Vi but I prefer GUI’s because I have to google how to exit vi every single time.

> src/gz all <http://repo.opkg.net/edison/repo/all>
>
> src/gz edison http://repo.opkg.net/edison/repo/edison
>
> src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32

Now return back to your home directory on the Edison (using cd commands and using pwd &/or ls to check where you are). Type this ‘opkg install git’, This should give an error. Now type ‘opkg update’ (NOT UPGRADE) and then ‘opkg install git’ and now it’ll install git. You can read more about the repo [here](http://alextgalileo.altervista.org/edison-package-repo-configuration-instructions.html).

This is step is necessary for homebridge (siri control) to work.Now this part will involve you taking a 2hr break, we’re gonna install the latest node. I personally use 0.12.7 but this is the [link](https://nodejs.org/dist/v4.2.3/node-v4.2.3.tar.gz) to the latest, feel free to try that. Copy and paste this, and if it finishes (after ~2 hours) without errors then restart your Edison and make sure ‘node –v’ returns the version you just installed.

> wget https://nodejs.org/dist/v0.12.7node-v0.12.7.tar.gz --no-check-certificate
>
> tar xvf node-v0.12.7.tar.gz
>
> cd node-v0.12.7
>
> ./configure
>
> make
>
> make install

Arduino
-------

This part was a little tricky but I got it to work anyway! Ensure you can connect to your Edison via the [arduino IDE](https://www.arduino.cc/en/Guide/IntelEdison) (there’s a special IDE/IDE extension to download) and run blink on it. Make sure everything is good. Then take a look at [this library](https://github.com/sui77/rc-switch) (I’m assuming at this stage you have all your RC stuff, that is your transmitter ad ETEKcity switches). Include it in your arduino libraries ( think you do that by putting it in your libraries folder in my documents) and then run an advanced receive demo with the RF receiver connected. Press different keys and record what they output on the serial monitor is. A much better tutorial for this sniffing procedure can be found [here](http://www.princetronics.com/how-to-read-433-mhz-codes-w-arduino-433-mhz-receiver/). Once that’s done, upload my arduino code changing the rf remote values (if they differ), the wifi info on lines 6&7, the server port number on line 11 and you may/may not get rid of the temperature reading in the loop. Hook up your transmitter to pin 7 (or any pin you fancy) and test! Be wary of the pulse length (line 29) because I found shorter pulses to do wonders for my range but too much of anything isn’t good. Find your limit and experiment with ranges and pulses. If your range is too low, chances are your pulse isn’t short enough (or you’re expecting too much haha).

Photon
------

I was able to control my physical light switch by connecting a servo motor to a [photon](https://store.particle.io/). The code is super simple, the execution not so much. I resorted to taping the servo on, but it’s been worth it! I can now control all my lights! Photon’s documentation is second to none. My code basically connects a function to the internet which allows me to control the servo motor angle by sending a link. This link will be determined by your Auth code and device id. It should look like this ‘https://api.particle.io/v1/devices/25678965789908790890872/servo?access\_token=rehfg9tu3bh493n9h39dhw09ehda89bb7e0acb'’

You should then be able to send post requests controlling the servo angle hence directly turning your light switch on and off. I found 40 & 110 to do the trick for me. I return it to a neutral position to enable manual override of my light switch if need be. This doesn’t happen much because it means I have to get up.

Sensors/Peripherals.
--------------------

As mentioned in the hardware section, you should get the grove starter kit. The sensors I used were the motion sensor, temp (I could use humidity too, got lazy), sound, light and 1 led.

Webcam
------

I used [other solutions](https://github.com/drejkim/edi-cam) before settling on [Motion](http://www.lavrsen.dk/foswiki/bin/view/Motion/DownloadFiles). There’s an extensive set of [instructions](http://www.lavrsen.dk/foswiki/bin/view/Motion/MotionGuideInstallation) on the website, but the gist of installation is to [download](http://sourceforge.net/projects/motion/files/latest/download?source=files) the source file and as we did with our node installation, we ./configure, make and make install. A more user friendly instruction set to get this up and running can be found [here](http://www.instructables.com/id/Motion-detecting-video-streaming-doorbell/)

NOTE: the webcam won’t show on chrome or mobile safari. Firefox works well

Homebridge
----------

I personally wrote an instructable on this, [check it out](http://www.instructables.com/id/Get-Siri-to-control-your-home/). Also check the official source and documentation [here](https://github.com/nfarina/homebridge).

Amazon Dash button
------------------

This is an unneeded feature, but it works! Sometimes that is. I can’t take credit for this, but the idea is pretty simple. You use a python code to sniff when a particular mac address is sending out data/packets, and then you execute a function. The only trouble I had here was installing Scapy and the other required libraries, I think I just ended up manually copying and pasting in the python library directory but [here’s](https://docs.python.org/2/install/) documentation on how to get that started(installing packages that is). [This is the medium](https://medium.com/@edwardbenson/how-i-hacked-amazon-s-5-wifi-button-to-track-baby-data-794214b0bdd8#.79347k2ni) article that I used to set mine up.

The possibilities for a $5 button are endless and amazing! The next best/official thing costs [$34](http://amzn.to/1NOak8d), which I think is ridiculous considering the next gen of raspberry pi’s are [$5 computers](http://www.element14.com/community/community/raspberry-pi). Considering it can be integrated with ifttt, the [possibilities are endless](https://flic.io/ifttt)! For $5 you should consider getting a few. Mine currently sits by my bed and turns off all my lights. The code is included of course in the GitHub directory. I wasn’t able to get it to automatically startup, so if you have any ides, let me know.

Wrapping up
-----------

At this point, you should have a set of links you sould be able to plug into the main nodejs script to make your hope come alive! Including a webcam link, switches of all kinds, sensors that tell you the temp,light level, etc and hopefully you were able to set up the Netflix and chill button using pushbullet.

Insert these links into your main.js file and run! (hopefully it works the first time and/or trouble shooting won’t be a pain). It took me a few months to ‘complete’ this so if you can do all this in less than a week that’s incredible.

Future Improvements
===================

I’m open to suggestions, feedback, contributions and you may even feel free to clean up my code to make it easier to read/understand. Note though, the code is structured this way so as not to confuse complete amateurs.

Features
========

-   Intel Edison

    -   Switches

    -   Photon

    -   Sensors

    -   Webcam-motion framework

-   Amazon Dash button-python

-   Siri-homebridge

-   Web UI-arduino

-   iOS App

Looking through the code
========================

I start out with declaring my dependencies. Express for the API, ‘mraa’ for port control,’twilio’ for texting, ‘forecastio’ for weather updates, ‘moment’ for dates/time

Issues
======

Actual Issues
-------------

-   Can’t get python to open on startup.

### Known Quirks

-   The mic won’t actually detect sound disruptions. Just very loud bangs, and if that happens, I think you’ve got bigger problems to worry about.

-   Location of the Edison is hardcoded. I could use my phones gps (since they’re integrated somewhat) to get the current location, but then it wasn’t intended to be that way because I’d like to know the weather just where the Edison is and not where the phone is. We have tons of apps for that
