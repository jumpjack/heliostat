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

# Impieghi del ruotismo satelllite

Entrambi i meccanismi si basano sullo stesso "ruotismo satellite" formato dagli ingranaggi **b** e **c**, il cui asse di rotazione è inserito nella ruota **A** e si muove con essa, ma sono leggermente diversi:

- un primo meccanismo, più semplice, prende il movimento principale solo dalla ruota A, azionata da un "regolatore isocrono di precisione" (un orologio), a cui aggiunge/toglie una certa velocità rotazionale tramite una ruota esterna controllata dall'utilizzatore
- un secondo meccanismo, più complesso, aggiunge una ruota **A1**, coassiale alla ruota **A**, e un ruotino **a1**, coassiale al ruotino **a** che nell'altro meccanismo aziona la ruota **A**; queste due ruote aggiuntive **A1** e **a1**, unitamente a un differente tipo di fissaggio delle ruote all'asse **XX'**, permettono di far ruotare la ruota finale **B** alla stessa velocità dell'asse **XX'** in assenza di intervento dall'esterno, ma di muoverla all'occorrenza **temporaneamente** più avanti o più indietro, in modo che la semiruota di declinazione ad essa collegata, che ruota con l'asse **XX'**, possa anche ruotare **perpendicolarmente** all'asse **XX'**, in modo da variare il puntamentro dello strumento (variazione della declinazione).

## Ruotismo 1 - variazione oraria

Vediamo meglio il meccanismo in questa moderna ricostruzione 3d:

![image](https://github.com/jumpjack/heliostat/assets/1620953/5a76caf5-48b1-4ec5-b0ca-1cfac2de1976)

Qui la colorazione ha una logica differente rispetto a prima:

- Il colore giallo raggruppa gli ingranaggi che trasmettono il movimento orario principale.
- Il colore celeste raggruppa quelli che permettono di aggiungere/togliere una componente rotazionale a quella di base.
- Il colore verde raggruppa gli ingranaggi che sommano insieme i due contributi; questo movimento viene poi trasmesso a un meccanismo successivo che vedremo dopo (TBW - ruotismo superiore di declinaziope)
- Il colore rosso raggruppa ingranaggi che non interagiscono con questo meccanismo, ma con quello superiore.

Possiamo rappresentare questo primo meccanismo in forma più compatta:

![image](https://github.com/jumpjack/heliostat/assets/1620953/bdf8a05b-4db3-441b-a555-a848a671f6f3)

**N.B.: E' importante notare che in questa variante del meccanismo la ruota B è libera, non è collegata all'asse XX', quindi B e XX' possono avere  velocità diverse e indipendenti l'una dall'altra.**

Foucault (o forse Eichens?) calcolò queste formule:

![image](https://github.com/jumpjack/heliostat/assets/1620953/47ae356d-8002-4a4c-b449-d952588cc891)

 

1: $${V_A}(\frac{B}{b} - \frac{C}{c}) = {v_B}\frac{B}{b}$$

da cui:

1a: $$ {v_B} = {V_A}\frac{(\frac{B}{b} - \frac{C}{c})}{\frac{B}{b}} $$

che può essere espressa anche come:

1b: $$ v_B=\frac{Bc-Cb}{Bc}V_A $$

dove:


- $${v_B}$$ = velocità di B
- $$ {V_A} $$ = velocità di A

Sulla quantità al numeratore possiamo porre due condizioni:

**Condizione 1**

Per avere **verso di $$ v_B $$ uguale a quello di $$ V_A $$** il numeratore dovrà essere maggiore di 0:

2: $$ \frac{B}{b} - \frac{C}{c}>0 $$ 

quindi:

3: $$ \frac{B}{b}>\frac{C}{c} $$

**Condizione 2**

**Per avere esattamente $$ v_B = \frac{9}{10}V_A $$**  (per motivi che vedremo più avanti (TBW: l'accoppiamento A-a-A1-a1 causa anch'esso una velocità di rotazione pari a 9/10 di VA))

dovrà essere:

4: $$\frac{\frac{B}{b} - \frac{C}{c}}{\frac{B}{b}} = \frac{9}{10} $$ 

Cioè:

5:  $$ \frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b} $$ 

da cui:

6: $$ \frac{b}{B}\frac{C}{c}=\frac{1}{10} $$

Relazione che è soddisfatta, ad esempio, prendendo:

7: $$ B=5b $$

8: $$ C=\frac{1}{2}c $$

Formule originali:

![image](https://github.com/jumpjack/heliostat/assets/1620953/71e6df08-acde-4d8c-bb96-13e0dcf2f28a)

Infine, anche se Foucault non lo specifica, è necessario che le ruote **b, B, c e C** soddisfino un'ulteriore condizione, affinchè **b** e **c** siano coassiali, formando così un unico meccanismo satellite:

9: b + B = c + C

Quindi abbiamo complessivamente queste 3 condizioni:

- 3: $$ \frac{B}{b} > \frac{C}{c} $$
- 9: $$ b + B = c + C $$
- 5: $$ \frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b} $$

Le ho elencate in ordine diverso rispetto a quello in cui le ho prima mostrate perchè la (5) può forse essere modificata, a condizione di modificare anche quella su A-a-A1-a1, per eventualmente provare a ridurre le dimensioni delle ruote a 200 denti, che rendono il meccanismo un po' ingombrante.

Secondo i miei calcoli, tutte queste condizioni sono soddisfatte, **ad esempio**, per questi valori:
- b = 1
- B = 5
- c = 4
- C = 2

Infatti:

La (3) diventa:

 $$ \Large{\frac{5}{1} > \frac{2}{4}} $$

 $$ \Large{5>\frac{1}{2}} $$

La (9) diventa:

 $$ 1 + 5 = 4 + 2 $$

 $$ 6 = 6 $$

E la 5 diventa:

 $$  frac{5}{1} - \frac{2}{4} = \frac{9}{10}\frac{5}{1}  $$

 $$ 5 - \frac{1}{2} = \frac{9}{10}5 $$

 $$ 5-0.5=\frac{45}{10} $$

 $$ 4.5=4.5 $$ 

## Combinazioni possibili di in granaggi

La tabella che segue mostra le combinazioni possibili di ingranaggi che soddisfino le condizioni viste:

|  c  |  C  | b  |  B  |
|-----|-----|----|-----|
|  32 |  16 |  8 |  40 |
|  40 |  20 | 10 |  50 |
|  48 |  24 | 12 |  60 |
|  56 |  28 | 14 |  70 |
|  64 |  32 | 16 |  80 |
|  72 |  36 | 18 |  90 |
|  80 |  40 | 20 | 100 |
|  88 |  44 | 22 | 110 |
|  96 |  48 | 24 | 120 |
| 104 |  52 | 26 | 130 |
| 112 |  56 | 28 | 140 |
| 120 |  60 | 30 | 150 |
| 128 |  64 | 32 | 160 |
| 136 |  68 | 34 | 170 |
| 144 |  72 | 36 | 180 |
| 152 |  76 | 38 | 190 |
| 160 |  80 | 40 | 200 |

![image](https://github.com/jumpjack/heliostat/assets/1620953/91f6e76a-e704-43f8-97e5-90531ef08077)

Notare come per ogni riga risulta vera la (9) c+C = b+B, che vale 48. Ovviamente sono vere anche la (3) e la (5):

- 3:  $$ \Large{\frac{B}{b} > \frac{C}{c}} $$ 
    - B/b = 5
    - C/c = 1/2
- 5:  $$ \frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b}\ $$ 
    -  $$ \frac{40}{8} - \frac{16}{32} = \frac{9}{10}\frac{40}{8}\ $$ 
    -  $$  5 - \frac{1}{2} = 5\frac{9}{10}\ $$ 
    -  $$  \frac{9}{2} = \frac{45}{10}\ $$ 
    -  $$  \frac{9}{2} = \frac{9}{2}\ $$ 

# Cambiare i valori suggeriti da Foucault

Di queste 3 condizioni:

- 3:  $$ \Large{\frac{B}{b} > \frac{C}{c}} $$
- 9:  $$ b + B = c + C $$
- 5:  $$ \Large\frac{B}{b} - \frac{C}{c} = \frac{9}{10}\frac{B}{b} $$ 

Le prime due sono indispensabili; sulla (5) si può lavorare; bisogna tenere presente che la (5) è dettata dalla necessità che la ruota finale B abbia velocità pari a 9/10 della velocità di A:

 $$ v_B = \frac{9}{10}V_A $$ 

Questo però solo perchè **A** ha velocità pari a:

10:  $$ V_A=0.10V_C $$ 

dove  $$ V_C $$  è la velocità dell'orologio (Clock), e quindi:

11:  $$ v_B = \frac{9}{10}V_A=0.9V_A=0.9 * 0.1V_C=0.09 V_C $$ 

ma la (10) è dovuta a come è strutturato il secondo meccanismo, dotato della coppia aggiuntiva a1-A1, oltre ad a-A; per questo meccanismo valgono infatti le relazioni:

12:  $$ \frac{a}{A}=\frac{20}{200}=\frac{1}{10}=0.10 $$ 

e

13:  $$ \frac{a1}{A1}=\frac{18}{200}=\frac{9}{100}=0.09 $$ 

Essendo la ruota A1 solidale con l'asse XX', la velocità di A1 è anche la velocità dell'asse XX', e risulterà pari a:

14:  $$ V_{A_1}=\frac{a1}{A1}V_C=\frac{18}{200}V_C=\frac{9}{100}V_C=0.09V_C $$ 

e:

15:  $$ V_A=\frac{20}{200}V_C =\frac{1}{10}V_C=0.10V_C $$ 

Quindi la (13) fa sì che   $$ V_{A_1}=V_{XX'}=0.09V_C $$  (14), mentre la (12) fa sì che   $$ v_B=0.09 V_C $$  (11):

- (13) =>  (14)
- (12) => (11)


cioè:

-  $$ \frac{a1}{A1} = 0.09 $$   =>  $$ V_{A_1} = V_{XX'} = 0.09V_C $$ 
-  $$ \frac{a}{A} = 0.10 $$     =>  $$ v_B     = 0.09 V_C $$ 


Ma proviamo a generalizzare: riprendiamo la 1b:

1b:  $$ \Large{v_B=\frac{Bc-Cb}{Bc}V_A} $$ 

La possiamo anche riscrivere come:

16:  $$ \Large{v_B=\frac{Bc-Cb}{Bc}\frac{a}{A}V_C} $$ 

Mentre la velocità dell'asse XX' è:

17:  $$ V_{XX'} = \frac{a_1}{A1}V_C $$ 

Questo significa che, affinchè le due velocità siano uguali, è necessario che:

18:  $$ \Large{\frac{Bc-Cb}{Bc}\frac{a}{A} = \frac{a_1}{A_1}} $$ 

Proviamo a rendere le cose più semplici rispettando l'ipotesi A=A1: possiamo allora semplificare a:

19:  $$ \Large{\frac{Bc-Cb}{Bc}a = a_1} $$ 

cioè

20:  $$ \Large{\frac{a_1}{a}=\frac{Bc-Cb}{Bc}} $$ 

Questo vorrebbe dire che dovrebbe essere possibile rendere uguali  $$ v_B $$  e  $$ V_{XX'} $$  a prescindere dalle dimensioni di  $$ A $$  e  $$ A_1 $$ , purchè sia rispettata la (20).

Per i succitati valori:

- b = 1
- B = 5
- c = 4
- C = 2

e:

- a1 = 18
- a = 20


La (20) diventa:

21:  $$ \Large{\frac{a1}{a}=\frac{5 * 4 - 2 * 1}{5 * 4} = \frac{18}{20}} $$ 

che è quanto riportato nei testi originali di Foucault.

Quindi complessivamente le condizioni necessarie dovrebbero essere:

- 3:  $$ \Large{\frac{B}{b} > \frac{C}{c}} $$ 
- 9:  $$ b + B = c + C $$ 
- 20:  $$ \Large{\frac{a_1}{a} = \frac{Bc-Cb}{Bc}} $$ 

Sviluppiamo la (3):

3a:  $$ \Large{b < \frac{B}{\frac{C}{c}}} $$ 

3b:  $$ \Large{b < \frac{cB}{C}} $$ 

Sviluppiamo la (9):

9a:  $$ b  = c + C - B $$ 

e mettiamola la (9a) nella (20), tenendo conto anche della 3b:

- 3b:  $$ \Large{b < \frac{cB}{C}} $$ 
- 22:  $$ \Large{\frac{a_1}{a} = \frac{Bc-C(c + C - B)}{Bc}} = 1-\frac{C(c + C - B)}{Bc} $$ 

Queste dovrebbero essere le uniche condizioni da rispettare, a prescindere dalle dimensioni di A e A1.

C'è però da considerare che il satellite deve essere attaccato alla ruota A, quindi sicuramente il suo asse YY' dovrà distare dall'asse XX' meno del raggio di A; ma la distanza di YY' da XX' è data dalla somma di b+B o la somma di c+C (che sono uguali), quindi un'altra condizione è:

23: b+B < A


Quindi alla fine le condizioni  sarebbero:

- 3b:  $$ \Large{b < \frac{cB}{C}} $$ 
- 23:  $$ A > b+B $$ 
- 9:  $$ b + B = c + C $$ 
- 22:  $$ \Large{\frac{a_1}{a} = \frac{Bc-C(c + C - B)}{Bc}} = 1-\frac{C(c + C - B)}{Bc} $$

C'è però un'altra condizione importante, che però non saprei come scrivere matematicamente: tutti i numeri devono essere interi, perchè gli ingranaggi ovviamente non possono avere un numero frazionario di denti! Quindi è vero che basta rispettare le 3 condizioni qui sopra, ma solo se tutti i valori risultanti, cioè b, A, a1 e a, sono interi se vengono presi interi i valori di input B, C e c.

# Ruotismo 2 - Variazione della declinazione

L'altro meccanismo in cui è inserito il ruotismo satellite è quello superiore del siderostato di Foucault, quello che si occupa, principalmente, di far eseguire una rotazione ogni 24 ore all'asse dello strumento:

![image](https://github.com/jumpjack/heliostat/assets/1620953/15e7c1ef-8b89-4bb8-93ab-88fa6191b9e3)

![image](https://github.com/jumpjack/heliostat/assets/1620953/528a677c-1614-4ef5-9ec7-bf859abe4b62)

Schematicamente:

![image](https://github.com/jumpjack/heliostat/assets/1620953/82dbec2b-d6e5-4dea-91a9-2659c5c7a8aa)


.stl)
