# ipSun - il sole, sempre!

![image](https://github.com/jumpjack/heliostat/assets/1620953/ef235171-2cf4-443f-badb-16915fe94733)


Vecchio progetto presentato al makerfaire 2016: un eliostato elettronico wifi realizzato tramite una ipcamera, un pennarello e un CD usato!

- [Mia pagina ufficiale](https://jumpjack.wixsite.com/progetti/ipsun)
- [Vecchia pagina dei sorgenti](https://jumpjack.wixsite.com/progetti/sorgenti-ipsun)
- [Vecchia pagina makerfaire 2016 (con immagine sbagliata)](https://makerfairerome.eu/it/espositori/?edition=2016&exhibit=626)
- [Video](https://www.youtube.com/watch?v=MaHDBx17t8A)

## Calcoli astronomici

I calcoli astronomici per posizionare erano stati implementati  in una [pagina di prova in HTML+javascript](https://github.com/jumpjack/heliostat/blob/main/ipSun/SunPositionCalculator101.html), che si appoggiava alla libreria suncalc, mentre una [pagina web dimostrativa](https://github.com/jumpjack/heliostat/blob/main/ipSun/interfaccia-001.html) permetteva di controllare la telecamera manualmente.

La funzione che si occupava di effettuare i calcoli astronomici per trovare la posizione del sole e quindi calcolare l'orientamento dello specchio era la seguente:

```
	function setPosition() {
	    ////////////////////////
	    // Posiziona la telecamera/specchio secondo l'angolo calcolato
	    ////////////////////////

	    // Prepara immagine dove disegnare per verificare i calcoli:
	    var CanvasContainer = document.getElementById('cnvTopView');
	    var CanvasContext = CanvasContainer.getContext("2d");
	    //////////////////////////////
	    var DataRichiesta = new Date(document.getElementById('testdate').value);
	    //			DataRichiesta.addSeconds(3600);
	    //////////////////////////////
	    // Memorizza posizione geografica dell'eliostato:
	    lat = document.getElementById('LAT').value;
	    lng = document.getElementById('LON').value;
	    // Inizia calcoli:
	    var pos = SunCalcGetPosition(DataRichiesta, lat, lng);
	    // Memorizza dati precedenti per cancellare disegno precedent:
	    PrevAz = SunAzimuth;
	    PrevAlt = SunAltitude;

	    ///// Calcola posizione angolare del sole ////
	    var SunAzimuth = parseFloat(180 + Math.round((pos.azimuth * 180 / 3.14) * 100) / 100).toFixed(2); // Add 180 because suncalc returns "0°" for "South".
	    var SunAltitude = parseFloat(Math.round((pos.altitude * 180 / 3.14) * 100) / 100).toFixed(2);

	    // Mostra risultati dei calcoli:
	    var OutputText = document.getElementById('txtOutput').value;
	    OutputText = "Time:" + DataRichiesta + "\nAz:" + SunAzimuth + "°\nAlt:" + SunAltitude + "°" + "\n";
	    if (notte) {
	        OutputText = OutputText + "\n NOTTE...";
	    }
	    document.getElementById('txtOutput').value = OutputText;

	    if (SunAltitude > 0) { // Lo specchio viene mosso solo durante il giorno
	        drawClock(CanvasContext);
	        // Delete previous Sun:
	        // drawToAngle(CenterX,CenterY,Len,Angle,Canvas,Draw)
	        drawToAngle(100, 150, 60, PrevAz, CanvasContext, false);
	        drawToAngle(300, 150, 60, 90 - PrevAlt, CanvasContext, false);
	        // Draw new Sun:
	        drawToAngle(100, 150, 60, SunAzimuth, CanvasContext, true);
	        drawToAngle(300, 150, 60, 90 - SunAltitude, CanvasContext, true);
	        ////////////// Disegna specchio sinistro:
	        drawToAngle(100, 150, 20, MirrorAzimuth + 90, CanvasContext, true);
	        drawToAngle(100, 150, 20, MirrorAzimuth - 90, CanvasContext, true);
	        ////////////// Disegna specchio destro
	        drawToAngle(300, 150, 20, 90 - (MirrorAlt + 90), CanvasContext, true);
	        drawToAngle(300, 150, 35, 90 - (MirrorAlt - 90), CanvasContext, true);
	        // Memorizza posizione attuale specchio per poterlo cancellare dopo:
	        PrevMirrorAz = MirrorAzimuth;

            ///////////////////////////////////////////////
	         ///// Calcola prossima posizione specchio /////
            ///////////////////////////////////////////////
	        MirrorAzimuth = TargetAzimuth + (SunAzimuth - TargetAzimuth) / 2;
	        MirrorAlt = TargetAlt + (SunAltitude - TargetAlt) / 2;


	        ///// Draw ray (constant):
	        // Azimuth 0° = top
	        drawToAngle(100, 150, 100, TargetAzimuth, CanvasContext, true);

	        // Altitude 0° = right --> add 90°
	        drawToAngle(300, 150, 100, 90 + TargetAlt, CanvasContext, true);

	        calcAzimuth(parseFloat(SunAzimuth), parseFloat(SunAltitude));
	        setTimeout(function() {
	            calcAlt(parseFloat(SunAzimuth), parseFloat(SunAltitude));
	        }, 3000);
	        notte = false;
	    } else {
	        notte = true;
	    }
	}
 ```

Il cuore dell'algoritmo è ovviamente questo:

 ```
	        // Calcola prossima posizione specchio
	        MirrorAzimuth = TargetAzimuth + (SunAzimuth - TargetAzimuth) / 2;
	        MirrorAlt = TargetAlt + (SunAltitude - TargetAlt) / 2;
 ```

Nota la posizione del sole (calcolata in base alla posizione dell'eliostato) e la direzione del bersaglio (TargetAlt, TargetAzimuth), si calcola la direzione di puntamento dello specchio, ossia della telecamera.


## Controllo telecamera tramite Arduino

Il programma per arduino era una draft in grado solo di movimentare la telecamera, senza contenere la logica per il calcolo, presente invece nella versione di prova precedente, scritta in Javascript. Lo sketch arduino usava questa istruzione per inviare comandi alla telecamera:

`SendCommandToCam( CamURL,  CamCommand,  CommandDegrees)`

Definizione della funzione:
```
int SendCommandToCam(String CamURL, String CamCommand, String CommandDegrees) {
USE_SERIAL.print("Connessione al router: ");
   if (!client.connect(host, Port)) {
     Serial.print("OPS! ERRORE DI CONNESSIONE A: ");   
     USE_SERIAL.print(host);
     USE_SERIAL.print(":");
     USE_SERIAL.println(Port);
     } else {
      Serial.println("Ok.");
    } 
  
  CamURL.replace("#COMMAND#",CamCommand);
  CamURL.replace("#DEGREES#",CommandDegrees);
  
  USE_SERIAL.println("Comando: " + CamURL);

  client.print("GET " + CamURL + " HTTP/1.1\r\n" +
               "Host: " + "http://192.168.1.239" + "\r\n" + 
               "Connection: close\r\n\r\n");
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    //USE_SERIAL.println("Risultato = " + line);
  }
  USE_SERIAL.println("Eseguito?!?\n");
}
```

L'URL da usare per comandare la telecamera era così strutturato:
```
   String CamURL = "/decoder_control.cgi?command=#COMMAND#&degree=#DEGREES#&user=#USER#&pwd=#PASS#";
```

