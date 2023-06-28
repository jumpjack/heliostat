/* solar.js -- Solar position ported source
   This file was a part of Redshift.
   Redshift is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
   Redshift is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   You should have received a copy of the GNU General Public License
   along with Redshift.  If not, see <http://www.gnu.org/licenses/>.
   Copyright (c) 2010  Jon Lund Steffensen <jonlst@gmail.com>
*/

/* Model of atmospheric refraction near horizon (in degrees). */
var SOLAR_ATM_REFRAC = 0.833

var SOLAR_ASTRO_TWILIGHT_ELEV  = -18.0
var SOLAR_NAUT_TWILIGHT_ELEV   = -12.0
var SOLAR_CIVIL_TWILIGHT_ELEV  =  -6.0
var SOLAR_DAYTIME_ELEV         =  (0.0 - SOLAR_ATM_REFRAC)

var solar_time = [
	'SOLAR_TIME_ASTRO_DAWN',
	'SOLAR_TIME_NAUT_DAWN',
	'SOLAR_TIME_CIVIL_DAWN',
	'SOLAR_TIME_SUNRISE',
	'SOLAR_TIME_SUNSET',
	'SOLAR_TIME_CIVIL_DUSK',
	'SOLAR_TIME_NAUT_DUSK',
	'SOLAR_TIME_ASTRO_DUSK'
];

/* C was ported from javascript code by U.S. Department of Commerce,
   National Oceanic & Atmospheric Administration:
   http://www.srrb.noaa.gov/highlights/sunrise/calcdetails.html
   It is based on equations from "Astronomical Algorithms" by
   Jean Meeus. */

function RAD(x) { return (x)*(Math.PI/180); }
function DEG(x) { return (x)*(180/Math.PI); }

/* Angels of various times of day. */
var time_angle = {
	SOLAR_TIME_ASTRO_DAWN: RAD(-90.0 + SOLAR_ASTRO_TWILIGHT_ELEV),
	SOLAR_TIME_NAUT_DAWN: RAD(-90.0 + SOLAR_NAUT_TWILIGHT_ELEV),
	SOLAR_TIME_CIVIL_DAWN: RAD(-90.0 + SOLAR_CIVIL_TWILIGHT_ELEV),
	SOLAR_TIME_SUNRISE: RAD(-90.0 + SOLAR_DAYTIME_ELEV),
	SOLAR_TIME_NOON: RAD(0.0),
	SOLAR_TIME_SUNSET: RAD(90.0 - SOLAR_DAYTIME_ELEV),
	SOLAR_TIME_CIVIL_DUSK: RAD(90.0 - SOLAR_CIVIL_TWILIGHT_ELEV),
	SOLAR_TIME_NAUT_DUSK: RAD(90.0 - SOLAR_NAUT_TWILIGHT_ELEV),
	SOLAR_TIME_ASTRO_DUSK: RAD(90.0 - SOLAR_ASTRO_TWILIGHT_ELEV)
};

/* Unix epoch from Julian day */
function epoch_from_jd(jd)
{
	return new Date(86400.0*(jd - 2440587.5) * 1000);
}

/* Julian day from unix epoch */
function jd_from_epoch(t)
{
	return (t / 1000 / 86400.0) + 2440587.5;
}

/* Julian centuries since J2000.0 from Julian day */
function jcent_from_jd(jd)
{
	return (jd - 2451545.0) / 36525.0;
}

/* Julian day from Julian centuries since J2000.0 */
function jd_from_jcent(t)
{
	return 36525.0*t + 2451545.0;
}

/* Geometric mean longitude of the sun.
   t: Julian centuries since J2000.0
   Return: Geometric mean logitude in radians. */
function sun_geom_mean_lon(t)
{
	/* FIXME returned value should always be positive */
	return RAD((280.46646 + t*(36000.76983 + t*0.0003032)) % 360);
}

/* Geometric mean anomaly of the sun.
   t: Julian centuries since J2000.0
   Return: Geometric mean anomaly in radians. */
function sun_geom_mean_anomaly(t)
{
	return RAD(357.52911 + t*(35999.05029 - t*0.0001537));
}

/* Eccentricity of earth orbit.
   t: Julian centuries since J2000.0
   Return: Eccentricity (unitless). */
function earth_orbit_eccentricity(t)
{
	return 0.016708634 - t*(0.000042037 + t*0.0000001267);
}

/* Equation of center of the sun.
   t: Julian centuries since J2000.0
   Return: Center(?) in radians */
function sun_equation_of_center(t)
{
	/* Use the first three terms of the equation. */
	var m = sun_geom_mean_anomaly(t);
	var c = Math.sin(m)*(1.914602 - t*(0.004817 + 0.000014*t)) +
		Math.sin(2*m)*(0.019993 - 0.000101*t) +
		Math.sin(3*m)*0.000289;
	return RAD(c);
}

/* True longitude of the sun.
   t: Julian centuries since J2000.0
   Return: True longitude in radians */
function sun_true_lon(t)
{
	var l_0 = sun_geom_mean_lon(t);
	var c = sun_equation_of_center(t);
	return l_0 + c;
}

/* Apparent longitude of the sun. (Right ascension).
   t: Julian centuries since J2000.0
   Return: Apparent longitude in radians */
function sun_apparent_lon(t)
{
	var o = sun_true_lon(t);
	return RAD(DEG(o) - 0.00569 - 0.00478*Math.sin(RAD(125.04 - 1934.136*t)));
}

/* Mean obliquity of the ecliptic
   t: Julian centuries since J2000.0
   Return: Mean obliquity in radians */
function mean_ecliptic_obliquity(t)
{
	var sec = 21.448 - t*(46.815 + t*(0.00059 - t*0.001813));
	return RAD(23.0 + (26.0 + (sec/60.0))/60.0);
}

/* Corrected obliquity of the ecliptic.
   t: Julian centuries since J2000.0
   Return: Currected obliquity in radians */
function obliquity_corr(t)
{
	var e_0 = mean_ecliptic_obliquity(t);
	var omega = 125.04 - t*1934.136;
	return RAD(DEG(e_0) + 0.00256*Math.cos(RAD(omega)));
}

/* Declination of the sun.
   t: Julian centuries since J2000.0
   Return: Declination in radians */
function solar_declination(t)
{
	var e = obliquity_corr(t);
	var lambda = sun_apparent_lon(t);
	return Math.asin(Math.sin(e)*Math.sin(lambda));
}

/* Difference between true solar time and mean solar time.
   t: Julian centuries since J2000.0
   Return: Difference in minutes */
function equation_of_time(t)
{
	var epsilon = obliquity_corr(t);
	var l_0 = sun_geom_mean_lon(t);
	var e = earth_orbit_eccentricity(t);
	var m = sun_geom_mean_anomaly(t);
	var y = Math.pow(Math.tan(epsilon/2.0), 2.0);

	var eq_time = y*Math.sin(2*l_0) - 2*e*Math.sin(m) +
		4*e*y*Math.sin(m)*Math.cos(2*l_0) -
		0.5*y*y*Math.sin(4*l_0) -
		1.25*e*e*Math.sin(2*m);
	return 4*DEG(eq_time);
}

function copysign(x, y) {
  return Math.abs(x) * (y < 0 ? -1 : 1);
}

/* Hour angle at the location for the given angular elevation.
   lat: Latitude of location in degrees
   decl: Declination in radians
   elev: Angular elevation angle in radians
   Return: Hour angle in radians */
function hour_angle_from_elevation(lat, decl, elev)
{
	var omega = Math.acos((Math.cos(Math.abs(elev)) - Math.sin(RAD(lat))*Math.sin(decl))/
			    (Math.cos(RAD(lat))*Math.cos(decl)));
	return copysign(omega, -elev);
}

/* Angular elevation at the location for the given hour angle.
   lat: Latitude of location in degrees
   decl: Declination in radians
   ha: Hour angle in radians
   Return: Angular elevation in radians */
function elevation_from_hour_angle(lat, decl, ha)
{
	return Math.asin(Math.cos(ha)*Math.cos(RAD(lat))*Math.cos(decl) +
		    Math.sin(RAD(lat))*Math.sin(decl));
}

/* Time of apparent solar noon of location on earth.
   t: Julian centuries since J2000.0
   lon: Longitude of location in degrees
   Return: Time difference from mean solar midnigth in minutes */
function time_of_solar_noon(t, lon)
{
	/* First pass uses approximate solar noon to
	   calculate equation of time. */
	var t_noon = jcent_from_jd(jd_from_jcent(t) - lon/360.0);
	var eq_time = equation_of_time(t_noon);
	var sol_noon = 720 - 4*lon - eq_time;

	/* Recalculate using new solar noon. */
	t_noon = jcent_from_jd(jd_from_jcent(t) - 0.5 + sol_noon/1440.0);
	eq_time = equation_of_time(t_noon);
	sol_noon = 720 - 4*lon - eq_time;

	/* No need to do more iterations */
	return sol_noon;
}

/* Time of given apparent solar angular elevation of location on earth.
   t: Julian centuries since J2000.0
   t_noon: Apparent solar noon in Julian centuries since J2000.0
   lat: Latitude of location in degrees
   lon: Longtitude of location in degrees
   elev: Solar angular elevation in radians
   Return: Time difference from mean solar midnight in minutes */
function time_of_solar_elevation(t, t_noon, lat, lon, elev)
{
	/* First pass uses approximate sunrise to
	   calculate equation of time. */
	var eq_time = equation_of_time(t_noon);
	var sol_decl = solar_declination(t_noon);
	var ha = hour_angle_from_elevation(lat, sol_decl, elev);
	var sol_offset = 720 - 4*(lon + DEG(ha)) - eq_time;

	/* Recalculate using new sunrise. */
	var t_rise = jcent_from_jd(jd_from_jcent(t) + sol_offset/1440.0);
	eq_time = equation_of_time(t_rise);
	sol_decl = solar_declination(t_rise);
	ha = hour_angle_from_elevation(lat, sol_decl, elev);
	sol_offset = 720 - 4*(lon + DEG(ha)) - eq_time;

	/* No need to do more iterations */
	return sol_offset;
}

/* Solar angular elevation at the given location and time.
   t: Julian centuries since J2000.0
   lat: Latitude of location
   lon: Longitude of location
   Return: Solar angular elevation in radians */
function solar_elevation_from_time(t, lat, lon)
{
	/* Minutes from midnight */
	var jd = jd_from_jcent(t);
	var offset = (jd - Math.round(jd) - 0.5)*1440.0;

	var eq_time = equation_of_time(t);
	var ha = RAD((720 - offset - eq_time)/4 - lon);
	var decl = solar_declination(t);
	return elevation_from_hour_angle(lat, decl, ha);
}

/* Solar angular elevation at the given location and time.
   date: Seconds since unix epoch
   lat: Latitude of location
   lon: Longitude of location
   Return: Solar angular elevation in degrees */
function solar_elevation (date, lat, lon)
{
	var jd = jd_from_epoch(date);
	return DEG(solar_elevation_from_time(jcent_from_jd(jd), lat, lon));
};

function solar_table (date, lat, lon)
{
  var table = {};

	/* Calculate Julian day */
	var jd = jd_from_epoch(date);

	/* Calculate Julian day number */
	var jdn = Math.round(jd);
	var t = jcent_from_jd(jdn);

	/* Calculate apparent solar noon */
	var sol_noon = time_of_solar_noon(t, lon);
	var j_noon = jdn - 0.5 + sol_noon/1440.0;
	var t_noon = jcent_from_jd(j_noon);
	table.SOLAR_TIME_NOON = epoch_from_jd(j_noon);

	/* Calculate solar midnight */
	table.SOLAR_TIME_MIDNIGHT = epoch_from_jd(j_noon + 0.5);

	/* Calulate absoute time of other phenomena */
	solar_time.forEach(function (i) {
		var angle = time_angle[i];
		var offset =
			time_of_solar_elevation(t, t_noon, lat, lon, angle);
		table[i] = epoch_from_jd(jdn - 0.5 + offset/1440.0);
	});

  return table;
};
