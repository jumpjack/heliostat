// gets the moon position and times
function mooncalcMeeus(myDateJS, lat, lon, height) {
  var jdo = new A.JulianDay(myDateJS); 
  var coord = A.EclCoord.fromWgs84(lat, lon, height);

  // gets the position of the moon
  var tp = A.Moon.topocentricPosition(jdo, coord, true);
  var altRad = tp.hz.alt;
  var altDeg = altRad * 180 / Math.PI;
  var azRad = tp.hz.az + Math.PI; // debug: come da istruzioni del prof. Meeus, per calcolare azimuth da nord bisogna aggiungere 180, sennò è da sud!
  var azDeg = azRad * 180 / Math.PI;
  var distKm =  tp.delta;

  // gets the rise, transit and set time of the moon
  var times = A.Moon.times(jdo, coord);

  // print moon phase and illuminated
  var suneq = A.Solar.apparentTopocentric(jdo, coord);
  var i = A.MoonIllum.phaseAngleEq2(tp.eq, suneq);
  var k = A.MoonIllum.illuminated(i);
  var chi =  A.MoonIllum.positionAngle(tp.eq, suneq);

  if (azRad > 2*Math.PI) {
     azRad = azRad - Math.PI;
     azDeg = azDeg -180.0;
  }

	var riseH_GMT = A.Coord.secondsToHMSStr(times.rise).substr(0,2);
	var riseM_GMT = A.Coord.secondsToHMSStr(times.rise).substr(3,2);
	var transitH_GMT = A.Coord.secondsToHMSStr(times.transit).substr(0,2);
	var transitM_GMT = A.Coord.secondsToHMSStr(times.transit).substr(3,2);
	var setH_GMT = A.Coord.secondsToHMSStr(times.set).substr(0,2);
	var setM_GMT = A.Coord.secondsToHMSStr(times.set).substr(3,2);
	
  return {
    moonAzimuthDegrees : azDeg,
    moonAzimuthRad : azRad,
    moonAltitudeDegrees : null,
    moonAltitudeRefractionDegrees : altDeg,
    moonAltitudeRefractionRad : altRad,
    moonIllumFractionDetailPercentage : k,
    moonPhase : i,
    rise : A.Coord.secondsToHMSStr(times.rise),
    riseJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , riseH_GMT, riseM_GMT , 0)),
    transit : A.Coord.secondsToHMSStr(times.transit) ,
    transitJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , transitH_GMT, transitM_GMT , 0)),
    set: A.Coord.secondsToHMSStr(times.set),
    setJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , setH_GMT, setM_GMT , 0)),
	timesRaw: times
  }
}

function suncalcMeeus(myDateJS, lat, lon, height) {
// gets sun position and times 
  var jdo = new A.JulianDay(myDateJS); 
  var coord = A.EclCoord.fromWgs84(lat, lon, height);

  // gets the position of the sun
  var tp = A.Solar.topocentricPosition(jdo, coord, true);
  var altRad = tp.hz.alt;
  var altDeg = altRad * 180 / Math.PI;
  var azRad = tp.hz.az;
  var azDeg = azRad * 180 / Math.PI;
  var distKm =  tp.delta; // debug

  if (azRad < 0) {
     azRad = Math.PI + azRad;
     azDeg = 180.0 + azDeg;
  }
  // gets the rise, transit and set time of the sun
  var times = A.Solar.times(jdo, coord);

	var riseH_GMT = A.Coord.secondsToHMSStr(times.rise).substr(0,2);
	var riseM_GMT = A.Coord.secondsToHMSStr(times.rise).substr(3,2);
	var transitH_GMT = A.Coord.secondsToHMSStr(times.transit).substr(0,2);
	var transitM_GMT = A.Coord.secondsToHMSStr(times.transit).substr(3,2);
	var setH_GMT = A.Coord.secondsToHMSStr(times.set).substr(0,2);
	var setM_GMT = A.Coord.secondsToHMSStr(times.set).substr(3,2);


  return {
    sunAzimuthRad : azRad,
    sunAltitudeRad : altRad,
    sunAzimuthDegrees : azDeg,
    sunAltitudeDegrees : altDeg,
    rise : A.Coord.secondsToHMSStr(times.rise),
    riseJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , riseH_GMT, riseM_GMT , 0)),
    transit : A.Coord.secondsToHMSStr(times.transit) ,
    transitJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , transitH_GMT, transitM_GMT , 0)),
    set: A.Coord.secondsToHMSStr(times.set),
    setJS : new Date(Date.UTC(myDateJS.getFullYear(), myDateJS.getMonth(), myDateJS.getDate() , setH_GMT, setM_GMT , 0)),
  }
}

function getSunTimesMeeus(myDateJS, lat, lon, height) {
  var temp = suncalcMeeus(myDateJS, lat, lon, height);
  return {
    rise : temp.rise,
    riseJS : temp.riseJS,
    transit : temp.transit ,
    transitJS : temp.transitJS,
    set: temp.set,
    setJS : temp.setJS,
  }
}

function getMoonTimesMeeus(myDateJS, lat, lon, height) {
  var temp = mooncalcMeeus(myDateJS, lat, lon, height);
  return {
    rise : temp.rise,
    riseJS : temp.riseJS,
    transit : temp.transit ,
    transitJS : temp.transitJS,
    set: temp.set,
    setJS : temp.setJS,
  }
}

