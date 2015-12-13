#!/bin/sh

#cd /home/root/edi-cam/web/server
#echo "Starting Server.js"
#node server &

cd
python app.py &
cd

cd /home/root/homebridge
node app &
cd


rfkill unblock bluetooth
killall bluetoothd 
hciconfig hci0 up 




cd /home/root
motion

cd
killall btsync*
./btsync --webui.listen 0.0.0.0:1111 &


cd
python app.py &
cd