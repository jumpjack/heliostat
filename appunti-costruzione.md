# Annotazioni e osservazioni fatte durante la costruzione fisica del siderostato

1) La forcella deve essere molto lunga per poter supportare angoli molto piccoli della coda direttrice dello specchio

 ![image](https://github.com/jumpjack/heliostat/assets/1620953/870733a4-e3c4-44d2-a6d0-aed70d4ab9c2)


2) Il punto estremo dell'asse orario deve essere "molto" distante dalla base del meccanismo superiore, per evitare che la forcella, ruotando, ci sbatta contro:

 ![image](https://github.com/jumpjack/heliostat/assets/1620953/c3d262ee-6169-4d4d-a4e4-7a67fafb17c1)

 ![image](https://github.com/jumpjack/heliostat/assets/1620953/90986df0-ed50-4f97-b067-eb937871fe56)

![immagine](https://github.com/jumpjack/heliostat/assets/1620953/11317685-ff53-4e7e-b6a0-729ef408c4b2)


3) La "molla di aiuto" menzionata nella "[Raccolta di lavori](https://github.com/jumpjack/heliostat/blob/main/foucault%20(in%20Recueil%20des%20travaux).md)" è effettivamente indispensabile, perchè c'è un "punto morto" durante la notte,
quando il sole è nel punto più basso e quindi la forcella nel punto più in alto della sua corsa, quasi sulla verticale dello specchio; che l'eliostato
funzioni anche di notte è necessario però solo se si riesce a implementare anche il meccanismo che lo adatta automaticamente al cambiamento giornaliero di declinazione, che varia da -23° a +23° tra estate e inverno.

![image](https://github.com/jumpjack/heliostat/assets/1620953/61af8bda-3b72-4d8d-9e03-66ec85aa90fb)

![image](https://github.com/jumpjack/heliostat/assets/1620953/f91fc8de-b668-4aed-ba30-fc51e742d573)

Al posto di una molla forse si può usare un elastico avvolto intorno all'albero dello specchio; assicurarsi che sia in tensione nel punto morto, ma non troppo in tensione negli altri punti, altrimenti probabilmente poi l'orologio non ce la fa a far ruotare lo specchio.

4) Non ho ancora capito come è fatto il perno che unisce l'alidada del cerchio di declinazione all'asse orario, nonostante vari disegni e foto, ma tutti troppo vaghi:

![image](https://github.com/jumpjack/heliostat/assets/1620953/afd1a6aa-c338-42cb-ac9a-b55009192214)

![image](https://github.com/jumpjack/heliostat/assets/1620953/53f565f4-3b0b-46a3-926f-db9e5f40d592)

![image](https://github.com/jumpjack/heliostat/assets/1620953/4c84722f-2e5a-4beb-a078-5077f4bb53e5)

5) Anche l'altro alidada non mi è chiaro, il perno I che dovrebbe fissare il cerchio VV:

"_I noni si trovano su un cerchio alidada VV concentrico al primo, montato su un manicotto mobile attorno all'asse. A tale manicotto è fissato un braccio I tenuto in posizione da due viti attestate, i cui dadi sono solidali al supporto del dispositivo; possiamo quindi regolare i noni in modo da segnare 0h 0m 0s sul cerchio orario quando la riflessione è fatta nel piano del meridiano."_ ([Annales](https://github.com/jumpjack/heliostat/blob/main/foucault%20(C.%20Wolf%20in%20Annales).md), p.60)

![image](https://github.com/jumpjack/heliostat/assets/1620953/8cdce10e-7ab2-46f2-9e8b-8acf2e5c9ccd)

![image](https://github.com/jumpjack/heliostat/assets/1620953/1525e98b-6640-4f70-a6f4-ddddce8064cb)

![image](https://github.com/jumpjack/heliostat/assets/1620953/8999167c-7081-40f9-992f-b1cc8e258db0)

![image](https://github.com/jumpjack/heliostat/assets/1620953/3e172d8d-1ab1-4ca5-916f-e6d3ea584425)



Come è fissato e come funziona?

-----------

Aggiornamento 15/1/204

Svelato il "mistero" dell'alidada orario sull'asse principale  grazie a una [versione ad altissima risoluzione della tavola 15](https://github.com/jumpjack/heliostat/blob/main/images/tav-15-highres-6000x4000.jpg)https://github.com/jumpjack/heliostat/blob/main/images/tav-15-highres-6000x4000.jpg, di cui qui riporto un dettaglio:

![image](https://github.com/jumpjack/heliostat/assets/1620953/f3bbb7e3-8041-4d60-a148-7f8fd0cd545b)

Quindi le due "viti a battuta" in effetti "battono" contemporaneamente sul gambo verticale **I**, al  quale permettono quindi solo una lieve rotazione, forse di un grado o due, intorno all'asse orario.

Essendo **I** solidale col "cerchio alidada **v**" a causa di questa "spina o vite"...

![image](https://github.com/jumpjack/heliostat/assets/1620953/8b06a6c8-ebf0-4b99-8944-d33f35968d6b)

, anche **v** ruoterà leggermente intorno all'asse orario quando si ruota **I**. A cosa serva, ancora non l'ho capito.

Nella stessa immagine si vede un altro particolare interessante, relativo al cerchio **v**:

![image](https://github.com/jumpjack/heliostat/assets/1620953/f775cef2-5de0-44d5-90c9-6b665de490d3)

Esso non "striscia" contro il cerchio **H**, è leggermente staccato, in modo da non causare attrito; solo un anellino intorno all'asse lo tiene separato dal cerchio **H**.

Nota: in questi giorno ho trovato su internet un artigiano/orologiaio che ha deciso di cimentarsi nell'impresa di costruire in metallo una replica di questo eliostato!

io nel frattempo sono passato a un modello più semplice a doppio specchio, inizialmente testato con stampa "casalinga" con stampantina FDM, poi commissionato in stampa onlne su JLPCB.




