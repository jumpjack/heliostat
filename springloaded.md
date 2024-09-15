In '800s, before electric light was invented, many scientists attempted brining sunlight inside house, for pleasure or for science.

## Basic principles

Basic principle of an heliostat is that the mirror shall not point directly sun, but the bisector between sun and target. To accomplish this task, it is possibile to build a totally passive mechanism, without any sensor, any electronic, and even any electricity: a springloaded clockwork would be enough to build an heliostat working for a whole day; to get it working for the whole year without manual adjustement, a little more work is needed, due to sun movement along **analemma**.

### Types of heliostats

There are 2 main types of heliostats: north-facing and south-facing:

Type 1 - North facing: the mirror points toward North:

![North facing](https://github.com/jumpjack/heliostat/assets/1620953/948c524e-36cf-4e02-b4a4-2c5c8b633770)



Type 2 - South facing: the mirror points toward south:

![South facing](https://github.com/jumpjack/heliostat/assets/1620953/9ef59556-111b-4d78-911c-0b8e69e550f5)


If you want to reflect sun rays toward a north-oriented window, you will need the south facing type:

![e](https://github.com/jumpjack/heliostat/assets/1620953/21a02f81-2e7c-4211-9fce-c7d64639d1f9)


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
