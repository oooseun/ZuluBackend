from scapy.all import *
import requests
#Scapy is required to work. As is Requests


#Function to turn off all switches
def toggle_st():
    url = 'http://0.0.0.0:2015/sleep'
    headers = {"Authorization": "Bearer YOUR_API_TOKEN"}
    data = '{"command":"toggle"}'
    r = requests.get(url)	#Make the call

	
def arp_display(pkt):
  if pkt[ARP].op == 1: #who-has (request)
    if pkt[ARP].psrc == '0.0.0.0': # ARP Probe
      if pkt[ARP].hwsrc == 'f0:4f:7c:e5:49:08': #Larabar
        print "Toggle the light"
        toggle_st()
      else:
        print "ARP Probe from unknown device: " + pkt[ARP].hwsrc

print sniff(prn=arp_display, filter="arp", store=0)