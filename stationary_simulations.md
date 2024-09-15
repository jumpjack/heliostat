# 2d and 3d simulations of stationary heliostats

## 3D

### Made with Three.js

#### Parabola3.html ([source](https://github.com/jumpjack/heliostat/blob/main/parabola3.html), [live demo](https://jumpjack.github.io/heliostat/parabola3.html))

Paraboloid customizable by user. No mirrors, because Three.js has so many versions, subversions and variants that I was not yet able to figure out whic version to use to create a reflective mirror..

### Made with [BabylonJS](https://www.cdnpkg.com/babylonjs?id=22051)

#### Spherical mirrors

How sun trajectories at solstices and equinox are reflected in spherical mirrors of different diameters:

![specchi](https://github.com/user-attachments/assets/92e4e9df-b8c8-4b2b-bb61-cc6b16eef1b9)

In the scene there are 3 arcs representing sun trajectories at solstice and equinox:

![scena](https://github.com/jumpjack/heliostat/assets/1620953/a697f1a1-7bb5-4ef1-b696-20ff391133c0)

This 2d simulation shows how reflected rays spread differently depending on mirror radius: the more they spread, the less intense is the reflected light:

![image](https://github.com/jumpjack/heliostat/assets/1620953/e66015bb-a2cf-490f-b827-fd54c6c99742)

- [LINK TO 3D SIMULATION](https://playground.babylonjs.com/#FEEK7G#1069)
- [LINK TO 2D SIMULATION](https://phydemo.app/ray-optics/simulator/#XQAAAAK7CAAAAAAAAABDKcrGU8hqLFnpmU9EnTFrXtfVT8bZE8XK1aL-VxfAXu7Qd-aGpdITjmLt98azixf6MnQiWQCQByQjBD4Lrms5gN7pNhaWS_xe4u6dTbbik5-nz2ozkC9R17zlalpiLTYwChJmCBxsfAOrV8yzs9lMGvhDEE5MhlQiuIb_RFKDdMDqHh5OigxvUBApv4Vs9-e5Mz26wkZyKBY4cwb9XI1co1WwcMnu-vwNIUSnvBUcD7usCt1uFZmUYjZftioruaWwe9AEyC6INKOMkYWJyJdus5IKf_i6-NmW_on0FLiv5BVWoTLvJVNR7XgdCu9R6gHV5w46O6iwlgXImHTjDwGb01vaniWeuRJMMI3fS8-sawRbLXE5sdR3AIIDH7-GhlsuoASuwt5P_9qiO_O1R7sXRuS0uhOxZ8IJI5LN4cVYjFZz-JQdMRM8UzMDw4pwCJ002sw4Zf1ZXkJj-bDuOehUN6ePZfit_Ul1brwAfsEi6lCfjkar1PgJVwnEWh0DfmVu9fXudVSrPCUJpc_TUaxdjIkKITMXvjz0P7m7Sw8umg2Ew3CdQZNTewDL7XOhjrGEBqccQv9uDZMvd93JskPIZi-QhvadAFUBy4i5l_FkvbTmBYGMc1H436g7DMXhzJwPtJ4TwYHzPTyD0PyGlw1W0NeOs-zfmjhN_lezXMWs5UDi8NJGS7K9SOWwP9vrM6BNrmGIm6DhGBeptv5DOWgBo5mmfEbO3o7i3AOWsnfDBSIurOQZIoHP8k5WzcJMZ7kKV-DhsQph17Qfil-0s0WyTsxuAL9ylX7tOzPHr42ywwN2O0FJDwRE6BHTcM-AkfGBc6oQrHjiJR3P5_nCxWRtkmZZgDl8Ac15xu8Ni74up7BERx_WCCGyToKifWc5IWGeCTDUC5tLj2qawzEDHeXsofmkkaqueoS8F6XIA-Gxx3lPfxZbdxAYcQpPwJhLCIaHemDK9R_KtCjDuceF-adUnBVu52PX3a7_PKyNCitjp6jLVlXga-Ai2vhUCoOm8ADgB0t3IEeoCf-6YHrY)


The larger is the curvature radius, the bigger appears the sun; **but** the larger is such radius, the **shorter** path of the sun is visible in the mirror; so, to have whole sun path visible in a mirror, the curvature radius must be small, but the sun will appear small too.
A matrix of small mirror could cover whole sun path, compensating the small appearance by multypling the number of reflections?

![image](https://github.com/jumpjack/heliostat/assets/1620953/6c83beb8-eb7e-475e-9b5b-b18b76c2a867)


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



