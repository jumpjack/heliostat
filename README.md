# heliostat studies

This page collects documents, images, source codes and formulas about "heliostats", "special mirrors" used to make solar light static while sun crosses the sky.

## Source codes

### Made with Three.js

#### Parabola3.html ([source](https://github.com/jumpjack/heliostat/blob/main/parabola3.html), [live demo](https://jumpjack.github.io/heliostat/parabola3.html))

Paraboloid customizable by user. No mirrors, because Three.js has so many versions, subversions and variants that I was not yet able to figure out whic version to use to create a reflective mirror..

### Made with [BabylonJS](https://www.cdnpkg.com/babylonjs?id=22051)

#### Parabolic mirror 001 ([source](https://github.com/jumpjack/heliostat/blob/main/parabolic-001.html), [live demo](https://jumpjack.github.io/heliostat/parabolic-001.html))

It displays in 3d space a paraboloid with one hexagon parallel to each face; ideally the cylinder should be turned into a real reflector capable of reflecting surrounding objects, to simulate how moving sun appears in the mirror.

To do:
- each face currently has two mirrors oriented slightly differently, but only one mirror should be presemt
- "mirrors" are currently just cylinders, they do not reflect
- paraboloid should be modifiable by user (inclination, height, width,...)
- moving sun to be added
- mirrors to be made smaller and denser

#### Parabolic-004 ([source](https://github.com/jumpjack/heliostat/blob/main/parabolic-004.html), [live demo](https://jumpjack.github.io/heliostat/parabolic-004.html))

First functional version: a paraboloid mesh has been created starting from the embedded BabylonJS function which creates a "Toroidal knot"

#### Parabolic-005 ([source](https://github.com/jumpjack/heliostat/blob/main/parabolic-005.html), [live demo](https://jumpjack.github.io/heliostat/parabolic-005.html))

Fully functional parabolic mirror simulator:

![image](https://user-images.githubusercontent.com/1620953/228653475-7ea5423e-3a35-4fcc-81af-80700c61af1c.png)


You can change inclination of the rotation axis of the sun, and change the hour angle of the sun, to see how rays are reflected by the mirror; the mirror itself can be chamged by means of two parameter, but please note that only a simmetrical mirror (i.e. elliptical paraboloid, with a = b) will have a point-shaped focus and will reflect all rays into parallel rays). Symmetric paraboloid, with parallel test rays reflectd into single point:

![image](https://user-images.githubusercontent.com/1620953/228653131-e628e908-5b03-4a09-a23a-eb8f84452b6b.png)

Non-symmetric paraboloid, reflecting parallel rays into "something else" (catenary?):

![image](https://user-images.githubusercontent.com/1620953/228653335-a45d2f1d-6eab-43c5-9274-5e12833b37c4.png)





## Documents

- [A Heliostat for Photo-Micrography](https://www.jstor.org/stable/pdf/3220592.pdf), by S. W. **Stratton** and T. J. **Burrill**, in **Proceedings of the American Society of Microscopists**, Vol. 7, Eighth Annual Meeting (**1885**), pp. 103-107
    - **Mirror rotation speed**: 1 turn in 24 hours (full sun speed)
    - **Reflection direction**: customizable
    - **Reflection target**: final target
    - **Clock mechanism**: an endless screw is fixed to the axis of the minutes-hand of a standard clock, engaging a 24-cogs wheel on heliostat main axis

![image](https://user-images.githubusercontent.com/1620953/228312007-33b91315-f914-4d36-9e7a-73c9df2a6cf7.png)

- [A New Heliostat](https://archive.org/details/jstor-3220382/page/n1/mode/2up) ([alternative link](https://www.jstor.org/stable/3220382?searchText=heliostat&searchUri=%2Faction%2FdoBasicSearch%3Fscope%3DeyJwYWdlTmFtZSI6ICJUcmFuc2FjdGlvbnMgb2YgdGhlIEFtZXJpY2FuIE1pY3Jvc2NvcGljYWwgU29jaWV0eSIsICJwYWdlVXJsIjogIi9qb3VybmFsL3RyYW5hbWVybWljcnNvY2kiLCAidHlwZSI6ICJqb3VybmFsIiwgImpjb2RlcyI6ICJpbnZlYmlvbDp0cmFuYW1lcm1pY3Jzb2NpOnByb2NhbWVybWljcnNvY2k6cHJvY2FtZXJzb2NpbWljciJ9%26Query%3Dheliostat&ab_segments=0%2Fbasic_search_gsv2%2Fcontrol&refreqid=fastly-default%3A73b72a9b1de22ed680d93b1cc70cf071)), by **Deck**, Lyman S. , in **Transactions of the American Microscopical Society**, Vol. 25, Twenty-Sixth Annual Meeting (Sep., **1904**), pp. 187-234 (48 pages) (how to build a simple heliostat using a standard mechanical clock)
    - **Mirror rotation speed**: 1 turn in 48 hours (half sun speed)
    - **Reflection direction**: orthogonal to clock axis 
    - **Reflection target** : final target
    - **clock mechanism**: 1:4 reduction mechanism applied to hour-hand of a standard clock.

![image](https://user-images.githubusercontent.com/1620953/228319119-c0e29a55-c808-4b09-acf3-d83c787ef096.png)

- On an improved heliostat invented by Alfred M. Mayer (**1886**) - [Document is behind a paywall](https://www.ajsonline.org/content/s4-4/22/306), but the patent of the device is available for free, with full explanation of the mechanism: [link](https://patentimages.storage.googleapis.com/cd/0e/33/16c660c35582f1/US333769.pdf) . The device makes use of a clock mechanism which rotates an axis by 360 degrees every 24 hours, which is not part of this patent. The device is specifically intended to project "one single ray" from the sun. 
    - **Mirror rotation speed**: 1 turn in 24 hours (full sun speed)
    - **Reflection direction**: parallel to clock axis 
    - **Reflection target** : secondary mirror
    - **clock mechanism**: not specified
    

![immagine](https://user-images.githubusercontent.com/1620953/228582818-987919a8-e179-45b8-939b-8773defc18e7.png)


## Images

- ![image](https://user-images.githubusercontent.com/1620953/226894896-5f8caf1d-481c-4d04-a28d-cad1f78b68c1.png)
- ![image](https://user-images.githubusercontent.com/1620953/226895117-0e9c855e-5906-4f84-abe6-6b2ea357b6ea.png)


# Sites

![image](https://user-images.githubusercontent.com/1620953/226892902-a38785df-6b23-4803-b6e4-cced0a9ec8aa.png)

- Silbermann's heliostat [explained](http://www.fondazionegalileogalilei.it/museo/collezioni/strumenti_scientifici/astronomia/schede_astronomia/eli_silbermann.html) at Fondazione Galileo Galilei (italian)
- Silbermann's heliostat [explained](https://en.m.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Heliostat) by Encyclopedia Britannica
- Sun path simulator in 3d: http://andrewmarsh.com/apps/staging/sunpath3d.html and derived repo https://github.com/joaopedroalbq/helios
- Some dozens of heliostats linked, with [pictures and patents](http://www.redrok.com/neat.htm) - [link](http://www.redrok.com/main.htm#gsc.tab=0)


## Commercial products (not yet on sale)
- Heliosfera - https://heliostat.pl/it/di-progetto  (Poland)
- Caia - https://www.solenica.com  (Italy)
- 
