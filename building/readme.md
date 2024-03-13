# Stuff to build your heliostat by yourself

## Ideas

### Static
- Concave parabolic mirror
- Convex circular mirror
- Light tube (optical fiber)

### Moving

#### Electronic
- Pan-tilt servo bracket with ESP32 driver
    - 1 pan-tilt brackets ([with servos](https://www.amazon.it/SDENSHI-Pan-Tilt-Plastica-Assemblato-Servo/dp/B08CHJQVZB) (17€) , [without servos](https://www.amazon.it/elechawk-Staffa-Montaggio-Inclinazione-panoramica/dp/B07PQ12TXS) (15€))
    - 2 [servos](https://www.amazon.it/s?k=servo&__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=FXL0JD3NAMXC&sprefix=servo%2Caps%2C100&ref=nb_sb_noss_1) - 10-100€
    - 1 [ESP32](https://amzn.to/38aEtli)
    - ESP32Servo Library by Kevin Harrington (check inside IDE)
    - Source code
        -  [Project 1 (randomnerdtutorials)](https://randomnerdtutorials.com/esp32-cam-pan-and-tilt-2-axis/)
        -  [Project 2 (Instructable)](https://www.instructables.com/DIY-Pan-Tilt-Control-Using-Servos-for-ESP32-Cam-Wi/) ([source code](https://github.com/un0038998/PanTiltCamera/blob/main/Pan_Tilt_Camera/Pan_Tilt_Camera.ino), [Github repo](https://github.com/un0038998/PanTiltCamera))
        -  Note: above source codes are written with an ESP32-CAM in mind, you will have remove parts related to camera if you are using a simple ESP32
- Pan-tilt ready-made head with Pelco-D control over RS485
    - Pan-tilt head supporting Pelco-D ([27€](https://www.amazon.it/gp/product/B07G8WK3HS), [40€](https://www.amazon.it/VBESTLIFE-Installazione-Supporto-Telecamera-Controllo/dp/B07NPGG5Z4))
    - [TTL/RS485 adapter x 2](https://www.amazon.it/gp/product/B07KFKSS1X) (10€)
    - ([wifi RS485 adapter](https://www.amazon.it/Bsowte-Multifunzionale-Seriale-Ricetrasmettitore-Fotocamera/dp/B0CD6SPH46), 2x18€)
    - [ESP32](https://amzn.to/38aEtli)/[Arduino](https://www.hackster.io/arduino/products/arduino-nano-r3?ref=project-4fed3c)
    - Source code
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
 
      
      
#### Spring loaded
- See section dedicated to ancient siderostats/heliostats of 1800s'

## Real projects
- ...
- ...
