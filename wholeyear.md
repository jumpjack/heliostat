Building a polar-mounted mechanism which rotates a mirror to follow the sun along the day is not enough to make it work all along the year: sun altitude will change by +/-24° from equinox to solstice; this page analyses how to add this movement to a passivesun-follower mechanism.
The sun follows a simple arc in the sky along the day; unfortunately, this arc does not remain the same along the day, due to orbital mechanics:

![sun path in 3d](https://user-images.githubusercontent.com/1620953/230616983-01ca00b8-52be-40d6-8f15-a6b119922a6f.png)

This site shows how this arc moves in the sky along the year: http://andrewmarsh.com/apps/staging/sunpath3d.html

Seen from ground, with observer always in same position along the year, and sun position marked always at same hour in the day, the sun appars describing a curve named "[analemma](https://github.com/jumpjack/heliostat/blob/main/analemma.md)":

![image](https://github.com/jumpjack/heliostat/assets/1620953/e0d2a736-d71c-47f1-a27a-036ef048700d)

Analemma has an "8" shape, both if plotted in Alt/Az coordinates and Declination/Hour coordinates; the big difference is that if plotted in Alt/Az, the curve is different for any different latitude of the observer; instead, if plotted in terms of Declination and Hour Angle changes, the curve is costant.

In Declination/HourAngle coordinates:

![image](https://github.com/jumpjack/heliostat/assets/1620953/05f32589-3d3e-48ff-8d6c-0b9a03615ef2)
([source](https://ben8photo.altervista.org/en/equation-of-time))

In Altitude/Azimuth coordinates:

![image](https://github.com/jumpjack/heliostat/assets/1620953/27a1c074-1acc-43e0-be95-1be0aef33ddd)

How does this apply to real life? You must consider the 2 possible mounts of telescopes:

![image](https://github.com/jumpjack/heliostat/assets/1620953/ac803e27-2808-4fb1-9151-2e3918815ec7)

https://www.virtualtelescope.eu/2016/09/29/montatura-del-telescopio/

If you use equatorial mount, where the telescope rotates around an axis pointed to North, declination changes will make telescope move toward North or South, Hour Angle changes will make it rotate clockwise or counterclockwise, or accelerate/decelerate w.r.t its 24h rotation.

#### Turning math into mechanics

The declination change along the year follows this plot:

![image](https://github.com/jumpjack/heliostat/assets/1620953/448c40a1-f484-432c-99b0-f3091b3ddbd5)

It's easy to implement this plot by converting it into polar coordinates to get a cam:

![image](https://github.com/jumpjack/heliostat/assets/1620953/399f67e0-00a7-41e9-8e75-8e1f94625e72)

The hour angle along the year is much more complex:

![image](https://github.com/jumpjack/heliostat/assets/1620953/f9c90fa2-228f-476f-8e93-d739e0632318)

It is possible to obtain this profile combining the two factors which contribute to Equation Of time, using 2 cams:

![image](https://github.com/jumpjack/heliostat/assets/1620953/ed0cf259-6eca-4925-803b-1e0973c251e4) 

or you can combine the two contributions into a sinlgle cam; there are two possibilities: the "kidney" cam, and the Greubel/Forsey cam:

![image](https://github.com/jumpjack/heliostat/assets/1620953/e8611117-980d-4b93-b002-61d8f6a6e41c)

Applying a rotating follower to a declination cam and another rotating follower to kidney cam, you get two mechanisms which produce the angular changes for declination and hour angle, i.e. you turn each constant angular rotation into an oscillating movement, which combined make the sun pointer follow the analemma path around the polar axis:

![image](https://github.com/jumpjack/heliostat/assets/1620953/f80adfd3-417b-4664-b6ba-c019e42a2b8f)








An heliostat could be seen as a peculiar type of polar-mounted telescope, which always points the same "star": the Sun; to properly follow the sun all along the year, rotating the mirror driver around polar axis one turn every 24 hours is not enough: corrections to sun declination and hour angle must be added to the instrument.

One of Foucault's heliostat designs apparently could do the trick, being it equipped with two gears which allow external inputs:

![Foucault](https://user-images.githubusercontent.com/1620953/238906372-e2d23598-971b-43e5-bdb0-e442070a76d5.png)

- "q" allows introducing time variations (Hour Angle or Right Ascension, it's not clear to me) to the upper clock mechanism
- "u" allows introducing declination variations without affecting upper clock mechanism
  
**Question is: which mechanisms should be connected to "q" and "u" to automatically follow the sun along each day of the year?**

Maybe these sites could provide some hints (I am currently investigating):

- [Mechanical implementation of Equation of Time](https://equation-of-time.info/gears) ([contact](https://equation-of-time.info/contact))
- [Analemma calculator](https://mtirado.com/resources/analemma-calc/) ([contact](https://mtirado.com/about/))
