# Stuff to build your heliostat by yourself

## Ideas

### Static
- Concave parabolic mirror
- Convex circular mirror
- Light tube (optical fiber)

### Moving

#### Electronic

![image](https://github.com/user-attachments/assets/22fdba81-07a7-4938-a70a-186c4d14c76e)

- Pan-tilt servo bracket with ESP32 driver
    - 1 pan-tilt brackets ([with servos](https://www.amazon.it/SDENSHI-Pan-Tilt-Plastica-Assemblato-Servo/dp/B08CHJQVZB) (17€) , [without servos](https://www.amazon.it/elechawk-Staffa-Montaggio-Inclinazione-panoramica/dp/B07PQ12TXS) (15€))
    - 2 [servos](https://www.amazon.it/s?k=servo&__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=FXL0JD3NAMXC&sprefix=servo%2Caps%2C100&ref=nb_sb_noss_1) - 10-100€
    - 1 [ESP32](https://amzn.to/38aEtli)
    - ESP32Servo Library by Kevin Harrington (check inside IDE)
    - Source code
        -  [Project 1 (randomnerdtutorials)](https://randomnerdtutorials.com/esp32-cam-pan-and-tilt-2-axis/)
        -  [Project 2 (Instructable)](https://www.instructables.com/DIY-Pan-Tilt-Control-Using-Servos-for-ESP32-Cam-Wi/) ([source code](https://github.com/un0038998/PanTiltCamera/blob/main/Pan_Tilt_Camera/Pan_Tilt_Camera.ino), [Github repo](https://github.com/un0038998/PanTiltCamera))
        -  Note: above source codes are written with an ESP32-CAM in mind, you will have remove parts related to camera if you are using a simple ESP32

![image](https://github.com/user-attachments/assets/820d49d3-403d-43ff-8f56-a2cc4ddb9cfc)

- Pan-tilt ready-made head with Pelco-D control over RS485 
    - Pan-tilt head supporting Pelco-D ([27€](https://www.amazon.it/gp/product/B07G8WK3HS), [40€](https://www.amazon.it/VBESTLIFE-Installazione-Supporto-Telecamera-Controllo/dp/B07NPGG5Z4))
    - [TTL/RS485 adapter x 2](https://www.amazon.it/gp/product/B07KFKSS1X) (10€)
    - ([wifi RS485 adapter](https://www.amazon.it/Bsowte-Multifunzionale-Seriale-Ricetrasmettitore-Fotocamera/dp/B0CD6SPH46), 2x18€)
    - [ESP32](https://amzn.to/38aEtli)/[Arduino](https://www.hackster.io/arduino/products/arduino-nano-r3?ref=project-4fed3c)
    - Software
        -   [Project 1 - "Pelco_And_Arduino"](https://github.com/Pixelbo/Pelco_And_Arduino/)
            - [Arduino Pelco-D library for installation in IDE](https://www.arduino.cc/reference/en/libraries/pelco_and_arduino/)
            - [Arduino Pellco-D library documentation](https://hackaday.io/project/183986-controlling-a-cctv-camera-with-arduino/log/203267-understanding-how-it-works#discussion-list)
            - The commands: use  **Camera1.send_command(SET_PAN, i**) and **Camera1.send_command(SET_TILT , i)**; SET_PAN is 0x4B, SET_TILT is 0x4D, "i" is any value between 0 and 35999  (35999?359.99 degrees).
        -  [Project 2 - "Arduino and Pelco-D"](https://github.com/cakoch10/Arduino-and-PelcoD/blob/master/M1_D_controller.ino)
        -  [Project 3 - "Pelco-D-PTZ-Camera-Control"](https://github.com/eziosoft/Pelco-D-PTZ-Camera-Control)
    - [MAX485 wokwi simulator](https://wokwi.com/projects/388502574445130753)
    - [Another MAX485 WOKWI simulator](https://wokwi.com/projects/377014769065300993)
    - [MAX485 definition for WOKWI](https://github.com/iconnor/max485-chip)
    - Windows software (requires [USB/RS485 adapter](https://www.amazon.it/Waveshare-USB-RS485-Converter-Lightningproof/dp/B0B87YJLJQ/))
        - [Description](https://learn.linksprite.com/project/bracket/),  Download [KMTronic_PelcoD_Tester](https://deepcam123.s3.amazonaws.com/KMTronic_PelcoD_Tester/KMTronic_PelcoD_Tester.zip) ([mirror](http://www.info.kmtronic.com/software/PTZ/KMTronic_PelcoD_Tester.zip), [mirror](https://github.com/jumpjack/heliostat/blob/main/building/KMTronic_PelcoD_Tester.zip)) , no source code
        - [Description](https://www.commfront.com/pages/pelco-d-protocol-tutorial#4), Download [232Analyzer FREE](https://cdn.shopify.com/s/files/1/1014/5789/files/232Analyzer.zip), no source code

![image](https://github.com/user-attachments/assets/ad9c3724-2f6d-44a7-b140-c3cd21213f3f)

- Pan-tilt ready-made head with DMX512 protocol over RS485
  - Pin mapping ([source](https://github.com/andyboeh/esphome-dmx512)):
    - MAX3485 D+/A  ->   XLR 3 (DMX +)
    - MAX3485 D-/B  ->   XLR 2 (DMX -)
    - MAX3485 GND   ->   XLR 1 (DMX GND)
  - Libraries:
    - [ESP32-DMX](https://github.com/luksal/ESP32-DMX)
      - Minimal command: `DMX::Write(channel, value);`
    - [esp_dmx](https://github.com/someweisguy/esp_dmx)
      - Minimal command (sequence required):
      ```
      dmx_write(dmxPort, data, DMX_PACKET_SIZE);
      dmx_send_num(dmxPort, DMX_PACKET_SIZE)
      dmx_wait_sent(dmxPort, DMX_TIMEOUT_TICK);
      ```
   - Software
      - [Project by FuturaShop](https://futuranet.it/progetti/2024/12/18/illuminazione-professionale-con-esp32-scopri-la-libreria-dmxasled-per-il-dmx/?srsltid=AfmBOorHAWwXGdnw358sgcN0aDeOVxNtbyF-d6kQlY0b4kQ75svhw_Yq) (only lights, but [useful schematic](https://futuranet.it/wp-content/uploads/2024/12/Schema.png))
   - Hardware
     - [ESP32](https://amzn.to/38aEtli)/[Arduino](https://www.hackster.io/arduino/products/arduino-nano-r3?ref=project-4fed3c)
     - [TTL/RS485 adapter x 2](https://www.amazon.it/gp/product/B07KFKSS1X) (10€)
     - ([wifi RS485 adapter](https://www.amazon.it/Bsowte-Multifunzionale-Seriale-Ricetrasmettitore-Fotocamera/dp/B0CD6SPH46), 2x18€)
     - [ESP32](https://amzn.to/38aEtli)/[Arduino](https://www.hackster.io/arduino/products/arduino-nano-r3?ref=project-4fed3c)
     - [DMX line terminator](https://www.amazon.it/Adam-Hall-DMXT-Connettore-terminator/dp/B00A7W4K3Y) (120 Ohm resistor between pin 2 and 3)
     - [DMX shield RS485 for Arduino](https://www.amazon.it/CQRobot-Network-Management-Extended-Functions/dp/B01DUHZAT0/)
     - [Whadda/Velleman VMA432 interface](https://www.velleman.eu/products/view/dmx512-module-vma432/?id=439222&lang=en) (old, no optocoupler), 17,00 euro
     - [Whadda/Velleman WPM432 intrerface](https://www.amazon.it/Whadda-Modulo-DMX512-WPM432/dp/B09L4SNRYK) (replaces VMA432, adds optocoupler), 27,00 euro  ([14,90 euro](https://www.velleman.eu/products/view/dmx512-module-wpm432/?id=460570&lang=en))
     - [Seedstudio Grove DMX512 interface](https://www.reichelt.com/it/it/shop/prodotto/arduino_-_grove_dmx512-191179?PROVID=2814&gad_source=1&gclid=Cj0KCQjwh_i_BhCzARIsANimeoGJvrNmybku25aTeVXd-lkDLyZVjTqX3aHlROX6igAxk_94NJhBsRgaAvXKEALw_wcB), 10,00 euro
  -  Protocol
 
![image](https://github.com/user-attachments/assets/f61325f1-cfb5-44a5-a4cb-7eb6ea8abdc8)
  - Wiring

![image](https://github.com/user-attachments/assets/8f847088-1b51-492a-a2ab-424520586063)



      
      
#### Spring loaded
- See section dedicated to ancient siderostats/heliostats of 1800s'

## Real projects
- [Lego techinc heliostat](https://github.com/diabad/EV3-Solar-Station/tree/master)
- "Cleardome" [static heliostat](http://cleardomesolar.com/solareflexpanels.html)
