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

- **A Note on the Principle And Nomenclature of Heliostats, Coelostats, Siderostats** by Dougherty, L. M., in  
**Journal of the British Astronomical Association**, vol.92, no.4, p.182-187 (**1982**) ([source](https://ui.adsabs.harvard.edu/search/p_=6&q=bibstem%3A(%22JBAA...92%22)&sort=date%20desc%2C%20bibcode%20desc)

[VARIÉTÉS SUR LA THEORIE DES HËLIOSTATS](https://www.persee.fr/docAsPDF/bastr_0572-7405_1884_num_1_1_9783.pdf), by Par M. R. RADAU, in "Bulletin astronomique", tome 1, **1884**. pp. 153-160.  Detailed descriptions of mechanism of heliostats by **Foucalt**, **Silbermann** and **Littrow** in **French language**. See transcriptions [here]().

![image](https://user-images.githubusercontent.com/1620953/228923691-b19b96dd-cf33-4565-a9aa-cbd25e46d8e0.png)


- [A Heliostat for Photo-Micrography](https://www.jstor.org/stable/pdf/3220592.pdf), by S. W. **Stratton** and T. J. **Burrill**, in **Proceedings of the American Society of Microscopists**, Vol. 7, Eighth Annual Meeting (**1885**), pp. 103-107
    - **Mirror rotation speed**: 1 turn in 24 hours (full sun speed)
    - **Reflection direction**: customizable
    - **Reflection target**: final target
    - **Clock mechanism**: an endless screw is fixed to the axis of the minutes-hand of a standard clock, engaging a 24-cogs wheel on heliostat main axis

![image](https://user-images.githubusercontent.com/1620953/228312007-33b91315-f914-4d36-9e7a-73c9df2a6cf7.png) (also [here](https://www.persee.fr/doc/bastr_0572-7405_1884_num_1_1_9783))

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

- ![image](https://user-images.githubusercontent.com/1620953/230624103-41b78e41-bc39-4367-97d1-260e8ba3e5d8.png)


- ![image](https://user-images.githubusercontent.com/1620953/226894896-5f8caf1d-481c-4d04-a28d-cad1f78b68c1.png)
- ![image](https://user-images.githubusercontent.com/1620953/226895117-0e9c855e-5906-4f84-abe6-6b2ea357b6ea.png)

## Inventors

- Ekling ():

![image](https://user-images.githubusercontent.com/1620953/230623926-f8be295d-b8a6-424c-b61c-8a58a291f1ed.png)


- [Tornaghi](https://collection.maas.museum/object/250225) ();

![image](https://user-images.githubusercontent.com/1620953/230623189-fcee2439-e733-4076-bcef-f31b4875ac94.png)

![image](https://user-images.githubusercontent.com/1620953/230623296-e4bbfe04-fb82-4985-8d6d-32ab5d9eb6a9.png)



- Hilger (1919):

![image](https://user-images.githubusercontent.com/1620953/230622052-d6ca8a36-3ebe-40d1-9fed-cc4e05bcff20.png)


- [Thomas Comber](https://www.biodiversitylibrary.org/item/196100#page/19/mode/1up) ():

![image](https://user-images.githubusercontent.com/1620953/230619233-b9f71d2a-fa39-43b6-8332-737d838bc822.png)


- Silbermann ()

- George Johnston Stoney (1869)

- [Grassmann (inventor), Rudolf Fuess (builder)](http://hdl.handle.net/20.500.12460/111014) (1870-1872):

![image](https://user-images.githubusercontent.com/1620953/230617429-3c3b23f4-4e38-4ca4-961e-98e73c107a8d.png)


- ADAM HILGER IN LONDON. LORD BLYTHSWOOD, ARCHIBALD CAMPELL:
![image](https://user-images.githubusercontent.com/1620953/230616890-ee1f50d8-c6ab-4e74-a3aa-00404e4b31b5.png)

[Brashear](https://www.uvm.edu/~dahammon/museum/heliostat.html) (1910):

![image](https://user-images.githubusercontent.com/1620953/230617302-64c2b4c2-5540-4789-a5a8-57cf561b1ca7.png)

- Alfonso Borrelli ()



# Sites

 - https://helioreflect.com/en/content/6-solar-reflectors-those-forgotten-inventions

- Images/link: https://ro.pinterest.com/adimuraru11/heliostat/

![image](https://user-images.githubusercontent.com/1620953/226892902-a38785df-6b23-4803-b6e4-cced0a9ec8aa.png)

- Some dozens of heliostats linked, with [pictures and patents](http://www.redrok.com/neat.htm) - [link](http://www.redrok.com/main.htm#gsc.tab=0):
- Silbermann's heliostat [explained](http://www.fondazionegalileogalilei.it/museo/collezioni/strumenti_scientifici/astronomia/schede_astronomia/eli_silbermann.html) at Fondazione Galileo Galilei (italian)
- Sun path in 3d: http://andrewmarsh.com/apps/staging/sunpath3d.html

![image](https://user-images.githubusercontent.com/1620953/230616983-01ca00b8-52be-40d6-8f15-a6b119922a6f.png)

- Sun path in 3d: https://ccnmtl.github.io/astro-simulations/sun-motion-simulator/

![image](https://user-images.githubusercontent.com/1620953/230616952-a4db4afb-8420-49bd-9c90-374791eb7425.png)

- Silbermann's heliostat [explained](https://en.m.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Heliostat) by Encyclopedia Britannica
- Sun path simulator in 3d: http://andrewmarsh.com/apps/staging/sunpath3d.html and derived repo https://github.com/joaopedroalbq/helios :

- http://www.redrok.com/main.htm#gsc.tab=0





## Commercial products (not yet on sale)
- Heliosfera - https://heliostat.pl/it/di-progetto  (Poland)
- Caia - https://www.solenica.com  (Italy)
- 
