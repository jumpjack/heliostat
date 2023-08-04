# heliostat studies

This page collects documents, images, source codes and formulas about "heliostats", "special mirrors" used to make solar light static while sun crosses the sky.

## Basic principles

Basic principle of an heliostat is that the mirror shall not point directly sun, but the bisector between sun and target. To accomplish this task, it is possibile to build a totally passive mechanism, without any sensor, any electronic, and even any electricity: a springloaded clockwork would be enough to build an heliostat working for a whole day; to get it working for the whole year without manual adjustement, a little more work is needed, due to sun movement along **analemma**.

### Types of heliostats

There are 2 main types of heliostats: north-facing and south-facing:

Type 1 - North facing: the mirror points toward North:

![North facing](https://github.com/jumpjack/heliostat/assets/1620953/948c524e-36cf-4e02-b4a4-2c5c8b633770)



Type 2 - South facing: the mirror points toward south:

![South facing](https://github.com/jumpjack/heliostat/assets/1620953/9ef59556-111b-4d78-911c-0b8e69e550f5)


If you want to reflect sun rays toward a north-oriented window, you will need the south facing type:

![image](https://github.com/jumpjack/heliostat/assets/1620953/21a02f81-2e7c-4211-9fce-c7d64639d1f9)


### Single day lasting heliostat

All you need to build an heliostat which follows the sun along a single day is:

1) Pointer: a Mirror mounted on a 2-degrees-of-freedom stand (horizontal and vertical)
2) Clockwork: a clockwork making 1 turn in 24 hours
3) Joint: a peculiar joint to connect the mirror to the driving mechanism

Some more items will be needed to join 1) and 2):

- 1a) Mirror tail: a rod fixed perpendicularly to the back of the mirror
- 2a) Clockwork extension: a rod parallel to the clockworx axis, extending it by some centimeters
- 2b) Driver: a rod fixed to clockwork axis with **a certain** angle (corresponding to sun declination)

Showing them for both types (but we need type 2):

![South facing](https://github.com/jumpjack/heliostat/assets/1620953/0786fef3-582e-4ff7-892c-aab47bc4cc54)

![North facing](https://github.com/jumpjack/heliostat/assets/1620953/8545c73a-34f3-4dfc-9543-10764a23b622)

The joint 3 is the most important part and the most difficult to build. Its requirement are:

- Shall be able to freely slide along tail (1a)
- Shall allow driver (2b) to rotate around tail (1a)
- Shall allow driver (2b) to rotate around the pivot on joint (3) itself
- Shall have very low friction with mirror tail, hence only 2 points of contact at joint edges

This is how the joint appears in Foucault's drawings:

![image](https://github.com/jumpjack/heliostat/assets/1620953/08190412-a3aa-4301-8aff-93a5ce70723d)

Modern 3d representation:

![image](https://github.com/jumpjack/heliostat/assets/1620953/e3cb1a8c-5738-42dc-b7ab-6c7018cfa227)


Foucualt highlighted how the friction between the joint and the mirror tail should be reduced at minimum, adding that thia could be better accomplished if just the edge of the joint are in touch with the tail, so this is how I imagined the interior of the joint:

![image](https://github.com/jumpjack/heliostat/assets/1620953/453a5216-9686-4315-8c4a-c3613e2881dd)


An other fundamental requirement of the whole instrument is that, whatever it happens, segments highlighted in this picture  must remain exactly equal in length:

![image](https://github.com/jumpjack/heliostat/assets/1620953/b61a763c-1730-4950-ad52-aa36dee42e62)

They are marked as (P'L' and P'M) in following schematic:

![image](https://github.com/jumpjack/heliostat/assets/1620953/ee177027-8773-442e-b97f-f37368fdb87b)

Two configurations are possible for heliostats: "underdrive" and "overdrive"; for south-facing type, they look like this:

![image](https://github.com/jumpjack/heliostat/assets/1620953/8461e87d-f7fe-491d-9383-fb99fc825aa1)

Underdrive connects driver to mirror tail, which is ortogonal to mirror and below it; it's how Foucault's heliostat is deisgned; overdrive connects driver to a rod which is parallel to the mirror and above it.

Various arrangements are wel described in "[A Note on the Principle And Nomenclature of Heliostats, Coelostats, Siderostats](https://articles.adsabs.harvard.edu/pdf/1982JBAA...92..182D)" by Dougherty, L. M., in
"_Journal of the British Astronomical Association_", vol.92, no.4, p.182-187 (1982)


### Whole year lasting heliostat

The sun follows a simple arc in the sky along the day; unfortunately, this arc does not remain the same along the day, due to orbital mechanics:

![sun path in 3d](https://user-images.githubusercontent.com/1620953/230616983-01ca00b8-52be-40d6-8f15-a6b119922a6f.png)

This site shows how this arc moves in the sky along the year: http://andrewmarsh.com/apps/staging/sunpath3d.html

Seen from ground, with observer always in same position along the year, and sun position marked always at same hour in the day, the sun appars describing a curve named "[analemma](https://github.com/jumpjack/heliostat/blob/main/analemma.md)":

![image](https://github.com/jumpjack/heliostat/assets/1620953/e0d2a736-d71c-47f1-a27a-036ef048700d)

In Alt/Az coordinates, analemma has an "8" shape.

To properly follow the sun all along the year, rotating a mirror around an axis one turn every 24 hours is not enough: corrections to sun declination and hour angle must be added to the instrument.

One of Foucault's heliostat designs apparently could do the trick, being it equipped with two gears which allow external inputs:

![Foucault](https://user-images.githubusercontent.com/1620953/238906372-e2d23598-971b-43e5-bdb0-e442070a76d5.png)

- "q" allows introducing time variations (Hour Angle or Right Ascension, it's not clear to me) to the upper clock mechanism
- "u" allows introducing declination variations without affecting upper clock mechanism
  
**Question is: which mechanisms should be connected to "q" and "u" to automatically follow the sun along each day of the year?**

Maybe these sites could provide some hints (I am currently investigating):

- [Mechanical implementation of Equation of Time](https://equation-of-time.info/gears) ([contact](https://equation-of-time.info/contact))
- [Analemma calculator](https://mtirado.com/resources/analemma-calc/) ([contact](https://mtirado.com/about/))

## Source codes

### Made with Plotly.js

![image](https://github.com/jumpjack/heliostat/assets/1620953/e4e21218-d761-4cd2-aaea-303fee05a1ac)

Cams plotter - try it here: [link](https://jumpjack.github.io/heliostat/equation-of-time.html)

Plotter for "kidney cam", [Greubel/Forsey cam](https://equation-of-time.info/copy-of-equation-clocks-forerunners), declination cam and analemma.

You can download ready-made ownload cams from this folder: https://github.com/jumpjack/heliostat/tree/main/cams

You can use CamFollowerJS to import JSON cams and simulate cam/follower mechanism: [link](https://jumpjack.github.io/CamFollowerJS/)

You can use [Algodoo](http://www.algodoo.com/) to import cams as 3d images and build 3d mechanisms.


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
- [Heliostats, Siderostats, and Coelostats: A Review of Practical Instruments for Astronomical Applications](https://articles.adsabs.harvard.edu/pdf/1985JBAA...95...89M), by A. A. Mills, 1985, in  Journal of the British Astronomical Association, Vol. 95, NO.3/APR, P. 89, 1985  (describing various types of heliostats, also taking into account declination change along the year)

![image](https://user-images.githubusercontent.com/1620953/235441506-1361cc0c-b14e-418d-8330-31d4dc1d35b7.png)


- [A Note on the Principle And Nomenclature of Heliostats, Coelostats, Siderostats](https://articles.adsabs.harvard.edu/pdf/1982JBAA...92..182D) by Dougherty, L. M., in  
**Journal of the British Astronomical Association**, vol.92, no.4, p.182-187 (**1982**) (describing geometry of  various types of heliostats)

![image](https://user-images.githubusercontent.com/1620953/235206087-1c56417d-d700-4dca-ae5d-0b87bd5c6af3.png)

- [A self-setting heliostat and its use in experimental optics](https://archive.org/details/sim_popular-astronomy_1913-11_21_9/page/534/mode/2up) - by Edison Pettit, in **Popular Astronomy** Vol 21, Iss 9 (double mirror)
- [BULLETIN OF THE ENCOURAGEMENT SOCIETY FOR NATIONAL INDUSTRY](https://cnum.cnam.fr/CGI/fpage.cgi?BSPI.25/0117/100/507/6/401) - Details page
- [ON A HELIOSTAT FOR THE SMITHSONIAN INSTITUTION, WASHINGTON](https://www.biodiversitylibrary.org/page/30422459) by SIR HOWARD GRUBB, F.R.S., an Hon. Secretary of the Royal Dublin Society (Plate XIII) in [The Scientific proceedings of the Royal Dublin Society - new series - volume 6](https://www.biodiversitylibrary.org/item/95855#page/7/mode/1up), on [page 598](https://www.biodiversitylibrary.org/item/95855#page/614/mode/1up), drawing on [Plate XIII](https://www.biodiversitylibrary.org/item/95855#page/671/mode/1up):

![image](https://user-images.githubusercontent.com/1620953/235440997-2929a7c8-a611-4019-a5a7-8acd63a7b012.png)

- [VARIÉTÉS SUR LA THEORIE DES HËLIOSTATS](https://www.persee.fr/docAsPDF/bastr_0572-7405_1884_num_1_1_9783.pdf), by Par M. R. RADAU, in "Bulletin astronomique", tome 1, **1884**. pp. 153-160.  Detailed descriptions of mechanism of heliostats by **Foucalt**, **Silbermann** and **Littrow** in **French language**. See transcriptions [here](https://github.com/jumpjack/heliostat/blob/main/VARI%C3%89T%C3%89S_SUR_LA_THEORIE_DES_H%C3%8BLIOSTATS(Fr-En).md).

![image](https://user-images.githubusercontent.com/1620953/228923691-b19b96dd-cf33-4565-a9aa-cbd25e46d8e0.png)

- [A Heliostat for Photo-Micrography](https://www.jstor.org/stable/pdf/3220592.pdf), by S. W. **Stratton** and T. J. **Burrill**, in **Proceedings of the American Society of Microscopists**, Vol. 7, Eighth Annual Meeting (**1885**), pp. 103-107
    - **Mirror rotation speed**: 1 turn in 24 hours (full sun speed)
    - **Reflection direction**: customizable
    - **Reflection target**: final target
    - **Clock mechanism**: an endless screw is fixed to the axis of the minutes-hand of a standard clock, engaging a 24-cogs wheel on heliostat main axis

![image](https://user-images.githubusercontent.com/1620953/228312007-33b91315-f914-4d36-9e7a-73c9df2a6cf7.png) (also [here](https://www.persee.fr/doc/bastr_0572-7405_1884_num_1_1_9783))

- [Un heliostat a la portee de tous](https://articles.adsabs.harvard.edu/pdf/1923LAstr..37..410R), by G. Raymond, in "L'Astronomie", vol. 37, pp.410-411:

![image](https://user-images.githubusercontent.com/1620953/235598422-b87ed49b-ce84-4776-a092-bb40ecfd7056.png)

- [A New Heliostat](https://archive.org/details/jstor-3220382/page/n1/mode/2up) ([alternative link](https://www.jstor.org/stable/3220382?searchText=heliostat&searchUri=%2Faction%2FdoBasicSearch%3Fscope%3DeyJwYWdlTmFtZSI6ICJUcmFuc2FjdGlvbnMgb2YgdGhlIEFtZXJpY2FuIE1pY3Jvc2NvcGljYWwgU29jaWV0eSIsICJwYWdlVXJsIjogIi9qb3VybmFsL3RyYW5hbWVybWljcnNvY2kiLCAidHlwZSI6ICJqb3VybmFsIiwgImpjb2RlcyI6ICJpbnZlYmlvbDp0cmFuYW1lcm1pY3Jzb2NpOnByb2NhbWVybWljcnNvY2k6cHJvY2FtZXJzb2NpbWljciJ9%26Query%3Dheliostat&ab_segments=0%2Fbasic_search_gsv2%2Fcontrol&refreqid=fastly-default%3A73b72a9b1de22ed680d93b1cc70cf071)), by **Deck**, Lyman S. , in **Transactions of the American Microscopical Society**, Vol. 25, Twenty-Sixth Annual Meeting (Sep., **1904**), pp. 187-234 (48 pages) (how to build a simple heliostat using a standard mechanical clock)
    - **Mirror rotation speed**: 1 turn in 48 hours (half sun speed)
    - **Reflection direction**: orthogonal to clock axis 
    - **Reflection target** : final target
    - **clock mechanism**: 1:4 reduction mechanism applied to hour-hand of a standard clock.

![image](https://user-images.githubusercontent.com/1620953/228319119-c0e29a55-c808-4b09-acf3-d83c787ef096.png)

- On an improved heliostat invented by Alfred M. Mayer (**1886**) - [Document is behind a paywall](https://www.ajsonline.org/content/s4-4/22/306), but the patent of the device is available for free, with full explanation of the mechanism: [link](https://patentimages.storage.googleapis.com/cd/0e/33/16c660c35582f1/US333769.pdf) . Also available in "**The American journal of science**" (AKA "Silliman's Journal"), series 4, vol. 4: [link](https://archive.org/details/americanjournal441897newh/page/306/mode/2up?q=heliostat) (link found in "[Die Fortschritte der Physik](https://archive.org/details/diefortschritte60gesegoog/page/n137/mode/2up?q=nouvel+heliostat+stoney)" by Deutsche Physikalische Gesellschaft, vol. 53, 1845.  The device makes use of a clock mechanism which rotates an axis by 360 degrees every 24 hours, which is not part of this patent. The device is specifically intended to project "one single ray" from the sun. 
    - **Mirror rotation speed**: 1 turn in 24 hours (full sun speed)
    - **Reflection direction**: parallel to clock axis 
    - **Reflection target** : secondary mirror
    - **clock mechanism**: not specified
    
![immagine](https://user-images.githubusercontent.com/1620953/228582818-987919a8-e179-45b8-939b-8773defc18e7.png)


- Teoria dei "tubi solari": https://www.researchgate.net/publication/340111732_Study_and_Analysis_of_Parameters_Affecting_Tubular_Daylighting_Device
- Multiple references:

![immagine](https://user-images.githubusercontent.com/1620953/235970330-5cfe554f-a1d5-4675-8156-4102aa1cb969.png) (source: [Sur la théorie des héliostats](https://www.persee.fr/doc/bastr_0572-7405_1884_num_1_1_9783), R. Radau
"Bulletin astronomique, Observatoire de Paris", 1884,1 pp. 153-160 )


## Images

- ![image](https://user-images.githubusercontent.com/1620953/230624103-41b78e41-bc39-4367-97d1-260e8ba3e5d8.png)
- ![image](https://user-images.githubusercontent.com/1620953/226894896-5f8caf1d-481c-4d04-a28d-cad1f78b68c1.png)
- ![image](https://user-images.githubusercontent.com/1620953/226895117-0e9c855e-5906-4f84-abe6-6b2ea357b6ea.png)
- ![Keith's american heliostat](https://user-images.githubusercontent.com/1620953/235442076-88581fb3-78e4-4cb6-8250-d1c3b03639b4.png) ([source](https://airandspace.si.edu/collection-media/NASM-A19880210000cp02))
- ![Foacault heliostat](https://user-images.githubusercontent.com/1620953/235442361-a88de498-f6fe-46f5-9e72-132c15e0973c.png) ([source: "Instruments of Precision Laboratory Apparatus", W.M. Gaertner & co](https://digital.sciencehistory.org/works/mc87pq27c))
- ![image](https://user-images.githubusercontent.com/1620953/235448896-c4bd22ec-b8dc-4a71-aeb8-8748f8051d5a.png) ([source](http://waywiser.fas.harvard.edu/objects/16281/solar-light-source); remotely operated! unknown inventor)
- ![Stoney's heliostat](https://user-images.githubusercontent.com/1620953/235600536-6bedad97-ac94-4f49-b709-bd6165ddda6b.png) ([source](https://collection.sciencemuseumgroup.org.uk/objects/co56796/heliostat-contrived-by-the-late-g-johnstone-stoney-ancillary-instruments-astronomical-instruments-heliostats-astronomical)) Stoney's heliostat - setup description [here](https://www.google.it/books/edition/It_s_Part_of_What_We_Are_Volumes_1_and_2/cjnJDwAAQBAJ?hl=it&gbpv=1&dq=Stoney+heliostat&pg=PA1762&printsec=frontcover); [other hires images](https://www.flintsauctions.com/auction/lot/220-a-rare-dr-g-johnstone-stoneys-improved-heliostat-by-watson--sons/?lot=14174&sd=1#); geometric description: ?
 - ![Gray's heliostat](https://user-images.githubusercontent.com/1620953/235961194-312d984a-c2b5-4065-b4eb-2a0f530bb050.png) - Gray's heliostat in "Journal of the Royal Microscopical Society" byy Royal Microscopical Society (Great Britain) , 1904
- Alternative method proposed by Johnstone Stoney to guarantee rectilinear motion of connection between mirror tail and clockwork driver arm, in place of hollow cylinder moving along a bar; [article](https://ui.adsabs.harvard.edu/abs/1896MNRAS..56..452S/abstract) "On making the siderostat an instrument of precision" in "Monthly Notices of the Royal Astronomical Society":

![image](https://user-images.githubusercontent.com/1620953/236227979-559ccfaf-4cf8-435e-967c-f5cc39dd1b54.png)

Modern view:

![image](https://user-images.githubusercontent.com/1620953/236236449-bb02ceb9-d88e-4508-bf22-683e7a8f4117.png)


## Inventors

- Colonel Archibald Campbell (1865-1940) from Blythswood; device built by Adam Hilger.  [Link](https://www.superstock.com/asset/photograph-universal-heliostat-made-english-instrument-makers-adam-hilger-london/1895-25564)

![image](https://user-images.githubusercontent.com/1620953/231557793-b4f0f21b-1aa7-4899-95da-710428823ca0.png)

UNITED KINGDOM - JUNE 09: Photograph of a universal heliostat made by the English instrument makers, Adam Hilger in London. Lord Blythswood, Archibald Campell (1865-1940), a Scottish scientist designed this instrument. It was used to direct sunlight into an ancillary instrument, such as a spectrograph, for analysis. It uses a flat mirror, driven by a clockwork mechanism, to follow the Sun as it move across the sky. This heliostat was displayed at the 1876 Loan exhibition that was held on the site of today's Science Museum at South Kensington, London. (Photo by SSPL/Getty Images)

- BERTHOLLET and MALUS ():
- Ekling ():

![image](https://user-images.githubusercontent.com/1620953/230623926-f8be295d-b8a6-424c-b61c-8a58a291f1ed.png)

- [Tornaghi](https://collection.maas.museum/object/250225) ();

![image](https://user-images.githubusercontent.com/1620953/230623189-fcee2439-e733-4076-bcef-f31b4875ac94.png)

![image](https://user-images.githubusercontent.com/1620953/230623296-e4bbfe04-fb82-4985-8d6d-32ab5d9eb6a9.png)



- Hilger (1919):

![image](https://user-images.githubusercontent.com/1620953/230622052-d6ca8a36-3ebe-40d1-9fed-cc4e05bcff20.png)


- [Thomas Comber](https://www.biodiversitylibrary.org/item/196100#page/19/mode/1up) ():

![image](https://user-images.githubusercontent.com/1620953/230619233-b9f71d2a-fa39-43b6-8332-737d838bc822.png)


- Silbermann ([Annales de chimie et de physique](https://gallica.bnf.fr/ark:/12148/bpt6k6570842f/f306.item.r=silbermann) - )

- George Johnston Stoney (1869)

- [Grassmann (inventor), Rudolf Fuess (builder)](http://hdl.handle.net/20.500.12460/111014) (1870-1872):

![image](https://user-images.githubusercontent.com/1620953/230617429-3c3b23f4-4e38-4ca4-961e-98e73c107a8d.png)



[Brashear](https://www.uvm.edu/~dahammon/museum/heliostat.html) (1910):

![image](https://user-images.githubusercontent.com/1620953/230617302-64c2b4c2-5540-4789-a5a8-57cf561b1ca7.png)

- Alfonso Borrelli ()

- Pietro Prandi ([Nuova Collezione d'Opuscoli scientifici -  Bologna , 1824](https://books.google.fr/books?id=8CJ4-jCC-UcC&pg=RA1-PA243&lpg=RA1-PA243&dq=Prandi+%22Nuova++collezione++d%E2%80%99Opuscoli++scienti%EF%AC%81ci%22+1824&source=bl&ots=_nrqc8zwT4&sig=ACfU3U3LjytyjYxLh7MsmvADLlA7rOjN_g&hl=it&sa=X&ved=2ahUKEwj8ktPC68KAAxWoVKQEHf8ECikQ6AF6BAgaEAM#v=onepage&q=Prandi%20%22Nuova%20%20collezione%20%20d%E2%80%99Opuscoli%20%20scienti%EF%AC%81ci%22%201824&f=false) )

- Giovanni Santini ("[Teorica degli stromenti ottici destinati ad estendere i confini della visione naturale](https://archive.org/details/bub_gb_cSgh6SYxBQoC/page/n17/mode/2up?q=prandi+eliostato)" (figure parzialmente visibili))

- Gambey [Elementi di fisica sperimentale e di meteorologia,  M. Pouillet](https://archive.org/details/bub_gb_KKggwcLGp88C/page/n428/mode/1up?q=giovanni+santini+eliostata)  (figura parziale), **Description de l'héliostat de M. Gambey, di Hachette (M., Jean Nicolas Pierre)** (versione digitale non disponibile), [Bulletin de la Société d'encouragement pour l'industrie nationale, Volume 23](https://books.google.fr/books?id=cDmxVZBY5poC&pg=PA105&lpg=PA105&dq=Description+de+l%27h%C3%A9liostat+de+M.+Gambey&source=bl&ots=viCIxFJYt-&sig=ACfU3U273adaI8RKhUKppLRxB2EtsS4PTA&hl=it&sa=X&ved=2ahUKEwi4ybGS_sKAAxXYVqQEHfgBA88Q6AF6BAgbEAM#v=onepage&q=heliostat&f=false), p.169 (figure non disponibili)

- [Corso elementare di fisica](https://archive.org/details/bub_gb_9vh7jHkd3FkC/page/n33/mode/1up?q=santini+eliostata) di Ranieri Gerbi 3  (p.32)  (figure 5 e 7, non visibili)

- Antonio Tessarolo - [Physics instrument makers in 19th-century Veneto: Two case-studies, by  Fanny Marcon](http://eprints.bice.rm.cnr.it/21406/1/ncc12224.pdf)


- Gambey - Descrizione fatta da Hachette:[Bulletin de la Société d'encouragement pour l'industrie nationale, Volume 23](https://books.google.fr/books?id=cDmxVZBY5poC&pg=PA105&lpg=PA105&dq=Description+de+l%27h%C3%A9liostat+de+M.+Gambey&source=bl&ots=viCIxFJYt-&sig=ACfU3U273adaI8RKhUKppLRxB2EtsS4PTA&hl=it&sa=X&ved=2ahUKEwi4ybGS_sKAAxXYVqQEHfgBA88Q6AF6BAgbEAM#v=onepage&q&f=false)

# Sites

- [Spiegazione dettagliata eliostato di Gambey](http://www.museodifisica.unito.it/index.phtml?Museo&id=582)
- [How Silbermann heliostat moves (video)](http://rhe.ish-lyon.cnrs.fr/instruments-scientifiques/instr_opt_heliostat.htm)


- https://www.redrok.com/main.htm#gsc.tab=0
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
- [Linkage mechanism by Peaucellier–Lipkin](https://en.wikipedia.org/wiki/Peaucellier%E2%80%93Lipkin_linkage) to turn linear motion into circular, **and vicerversa** (could be used to force driver edge moving along mirror tail?)

![aa](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Peaucellier-Lipkin_Inversor.gif/220px-Peaucellier-Lipkin_Inversor.gif)

- [Linkage mechanism by James watt](https://it.wikipedia.org/wiki/Parallelogramma_di_Watt) with similar function

![aa](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Watts_Linkage.gif/220px-Watts_Linkage.gif)

Literatur:

- [1] Frick-Lehmann, Physikalische Technik I, 7. Aufl., S. 208 f., Braunschweig 1904. 
– [2] Radau, Zur Theorie der Heliostaten, Carls Repertorium für physikalische Technik II (1867), S. 1 ff. und S. 234 ff. - https://technik.de-academic.com/dic.nsf/technik/10800/Heliostat
– [3] Zech, Ueber Heliostaten, ebend., S. 10 f. und Katalog von Leybolds Nachfolger, Köln. - https://technik.de-academic.com/dic.nsf/technik/10800/Heliostat



## Commercial products 
- Heliosfera - https://heliostat.pl/it/di-progetto  (Poland) (not yet on sale)
- Caia - https://www.solenica.com  (Italy) (not yet on sale)
- Heliostat on https://www.heliostaat.nl/products.html (just mechanics+electronics, no mirror: 539$)
