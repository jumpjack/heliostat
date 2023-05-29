Il ruotismo-satellite di Foucalt-Eichens è così rappresentato negli scritti di Foucalt:

- **Recueil de scientifique travaux**

![Figura 3, tavola 15](https://github.com/jumpjack/heliostat/assets/1620953/4dfca861-417b-4bef-b047-baa681083219)

Fig.3, Planche 15  (Figura 3, tavola 15)

Mia versione a colori:

![image](https://github.com/jumpjack/heliostat/assets/1620953/dad494bd-fb8a-4649-8af7-f4c59bff6a5c)

Fig.3, Planche 15  (Figura 3, tavola 15, versione a colori)

- **Annales**

![Figura 3 nel testo](https://github.com/jumpjack/heliostat/assets/1620953/51a99e59-55a9-4272-bbc1-590e049233b9)

Mia versione a colori:

![Figura 3 nel testo - a colori](https://github.com/jumpjack/heliostat/assets/1620953/8525410f-2dee-499e-a6b6-54aae722f29e)


La figura 3 della tavola 15 della "Recueil" (prime due figure) rappresenta il meccanismo che permette di **far ruotare la semi-ruota di declinazione** del siderostato senza influenzare la rotazione oraria dell'asse.

La figura 3 all'interno del testo degli "Annales", invece (successive 2 figure) rappresenta la variante di meccanismo usata per **introdurre una variazione positiva o negativa della rotazione oraria** senza però influenzare il movimento orario di base.

Entrambi i meccanismi si basano però sullo stesso "ruotismo satellite" formato dagli ingranaggi **b** e **c**, il cui asse di rotazione è inserito nella ruota **A** e si muove con essa, come meglio illustrato in questa ricostruzione 3d:

![image](https://github.com/jumpjack/heliostat/assets/1620953/5a76caf5-48b1-4ec5-b0ca-1cfac2de1976)

Qui la colorazione ha una logica differente:

- Il colore giallo raggruppa gli ingranaggi che trasmettono il movimento orario principale.
- Il colore celeste raggruppa quelli che permettono di aggiungere/togliere una componente rotazionale a quella di base.
- Il colore verde raggruppa gli ingranaggi che sommano insieme i due contributi; questo movimento viene poi trasmesso a un meccanismo successivo che vedremo dopo (TBW - ruotismo superiore di declinaziope)
- Il colore rosso raggruppa ingranaggi che non interagiscono con questo meccanismo, ma con quello superiore.

Possiamo rappresentare questo primo meccanismo in forma più compatta:

![image](https://github.com/jumpjack/heliostat/assets/1620953/ecdacaf2-f6b2-4c77-9b64-e0bbc0cc7b12)

Foucault (o forse Eichens?) calcolò queste formule:

![image](https://github.com/jumpjack/heliostat/assets/1620953/47ae356d-8002-4a4c-b449-d952588cc891)

1:  $\Large{{V_A}(\frac{B}{b} - \frac{C}{c}) = {v_B}\frac{B}{b}}$

da cui:

1a: $\Large{{v_B} = {V_A}\frac{(\frac{B}{b} - \frac{C}{c})}{\frac{B}{b}}}$

dove:

- $\Large{{v_B}}$ = velocità di B
- $\Large{{V_A}}$ = velocità di A

Sulla quantità al numeratore possiamo porre due condizioni:

**Condizione 1**

Per avere **verso di $v_B$ uguale a quello di $V_A$** il numeratore dovrà essere maggiore di 0:

2: $\frac{B}{b} - \frac{C}{c}>0$ 

quindi:

3: $\Large{\frac{B}{b}>\frac{C}{c}}$;

**Condizione 2**

Per avere esattamente: $v_B = \frac{9}{10}V_A$  (per motivi che vedremo più avanti (TBW: l'accoppiamento A-a-A1-a1 causa anch'esso una velocità di rotazione pari a 9/10 di VA))

dovrà essere:

4: $\Large\frac{\frac{B}{b} - \frac{C}{c}}{\frac{B}{b}} = \frac{9}{10}\$ 

Cioè:

5:  $\Large\frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b}\$ 

da cui:

6: $\frac{b}{B}\frac{C}{c}=\frac{1}{10}$

Relazione che è soddisfatta, ad esempio, prendendo:

7: $B=5b$

8: $C=\frac{1}{2}c$

Formule originali:

![image](https://github.com/jumpjack/heliostat/assets/1620953/71e6df08-acde-4d8c-bb96-13e0dcf2f28a)

Infine, anche se Foucault non lo specifica, è necessario che le ruote **b, B, c e C** soddisfino un'ulteriore condizione, affinchè **b** e **c** siano coassiali, formando così un unico meccanismo satellite:

9: b + B = c + C

Quindi abbiamo complessivamente queste 3 condizioni:

- 3: $\Large{\frac{B}{b} > \frac{C}{c}}$
- 9: $b + B = c + C$
- 5: $\Large\frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b}\$ 

Le ho elencate in ordine diverso rispetto a quello in cui le ho prima mostrate perchè la (5) può forse essere modificata, a condizione di modificare anche quella su A-a-A1-a1, per eventualmente provare a ridurre le dimensioni delle ruote a 200 denti, che rendono il meccanismo un po' ingombrante.





