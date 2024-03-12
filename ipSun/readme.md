# ipSun - il sole, sempre!

![image](https://github.com/jumpjack/heliostat/assets/1620953/ef235171-2cf4-443f-badb-16915fe94733)


Vecchio progetto presentato al makerfaire 2016: un eliostato elettronico wifi realizzato tramite una ipcamera, un pennarello e un CD usato!

- [Mia pagina ufficiale](https://jumpjack.wixsite.com/progetti/ipsun)
- [Vecchia pagina dei sorgenti](https://jumpjack.wixsite.com/progetti/sorgenti-ipsun)
- [Vecchia pagina makerfaire 2016 (con immagine sbagliata)](https://makerfairerome.eu/it/espositori/?edition=2016&exhibit=626)
- [Video](https://www.youtube.com/watch?v=MaHDBx17t8A)

## Calcoli astronomici

I calcoli astronomici per posizionare erano stati implementati  in una pagina di prova in HTML+javascript.

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

