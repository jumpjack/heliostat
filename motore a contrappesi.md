Tratto da [Télégraphie multiple : le système de télégraphie Baudot et ses applications, by Mercy, Paul ](https://cnum.cnam.fr/pgi/fpage.php?8CA687/99/90/648/3/3)

La spiegazione del funzionamento di questo meccanismo può aiutare a comprendere il funzionamento del "regolatore di Eichens" usato nel siderostato di Foucault, qui rappresentato:

![image](https://github.com/jumpjack/heliostat/assets/1620953/b110c194-3200-4f3a-b49c-af453e74ef63)

Nel dettaglio si può vedere la presenza di due ruote "a senso unico" contrapposte:

![image](https://github.com/jumpjack/heliostat/assets/1620953/8f798514-5098-45c4-88a0-939836ccb0bf)

In questa possibile ricostruzione 3d si può capire meglio il meccanismo:

![image](https://github.com/jumpjack/heliostat/assets/1620953/c951bdb0-e5bb-496b-80fa-23234783ebeb)


![image](https://github.com/jumpjack/heliostat/assets/1620953/6727d819-799f-4042-afe7-14f28fe2806f)

![image](https://github.com/jumpjack/heliostat/assets/1620953/03491f08-966e-4023-9859-9099876484c8)

La manovella connessa al perno M, ruotata in senso orario, fa ruotare in senso orario la ruota H e quindi in senso antiorario la ruota A solidale coll rocchetto R a cui è appeso il contrappeso P; la ruota A è solidale con la "ruota a senso unico" B,  che cioè può girare in senso antiorario, perchè frenata dal dente E, tenuto a contatto con la ruota dalla molla G; una volta che il cavo che sorregge il peso è stato riavvolto, il peso stesso trascinerà tutto il blocco R+A+B a ruotare in senso orario; incastrandosi nel dente E, la ruota B trascinerà con sè in senso orario la ruota C (che invece durante la ricarica non poteva ruotare in senso antiorario), che è solidale con la ruota dentata D.

La ruota D trasmette il movimento a una moltiplica formata da una catena di ingranaggi che fa girare velocissimo il perno finale, la cui velocità è mantenuta costante dal "regolatore isocrono a forza centrifuga":

![image](https://github.com/jumpjack/heliostat/assets/1620953/a6089b82-908c-444a-9e11-279f547a2d88)

Nel frattempo, però, la ruotina L trasmette il movimento al sistema di regolazione dell'anticipo orario, che infine  trasmette il suo movimento al meccanismo superiore tramite una ruota posteriore:

![image](https://github.com/jumpjack/heliostat/assets/1620953/61992483-ea00-47ab-a56a-d58c6131e8ed)

Il meccanismo anticipatore è illustrato nella figura 3 all'interno del testo degli annales, qui modificate per mostrare come ingrana la ruota L:

![image](https://github.com/jumpjack/heliostat/assets/1620953/6e2e6123-3cb5-424b-825a-afb5fad895be)

Secondo i miei calcoli:
- l'asse XX' di uscita dell'anticipatore ha una velocità pari a L/200 di $V_L$
- questa velocità è ulteriormente ridotta di un fattore 1/K dalla coppia worm-gear in alto:

![image](https://github.com/jumpjack/heliostat/assets/1620953/899cc279-9b54-4c2a-aab2-f3d74608b798)

- Il perno che supporta le ruote K, a e a1 imprime il suo moto alle ruote A e A1, col risultato finale che l'asse XX' finale dell'eliostato avrà una velocità pari a 9/100 dell'asse K.

La velocità finale dell'asse XX' superiore sarà quindi pari a:

$$V_{xx'} = V_L * \frac{L}{200} * \frac 1K *  \frac{9}{100}$$

cioè

$$V_{xx'} = V_L * \frac{L*9}{20000} * \frac 1K$$


Questo asse XX' dovrà compiere 1 giro ogni 24 ore, ossia 1 giro ogni 1440 minuti, cioè avere una velocità di 0.000694444 RPM:

$$\frac1{1440}  = V_L * \frac{L*9}{20000} * \frac 1K$$

Questo significa che L deve  avere velocità pari a:

$$V_L = \frac1{1440} * \frac{20000}{L*9} * K$$

Quindi il numero di denti K deve essere:

$$K = L * V_L * \frac{1440*9}{20000}$$

$$K = L * V_L * 0.648$$

$$K = L * V_L * \frac {648}{1000}$$

$$K = L * V_L * \frac {3^4 * 2^3}{1000}$$

Ora, che velocità hanno le lancette di un orologio?

- ore: 2 giri / giorno = 2 giri / 24 ore = 2 giri / 1440 minuti = $\frac{2}{3^2 * 2^5 * 5}$
- minuti: 1 giro / 1 ora = 1 giro / 60 minuti = $\frac{1}{3 * 2^2 * 5}$
- secondi: 1 giro / 1 minuto

Uguagliando i 3 casi a VL otteniamo i possibili valori di K:

- Ore: $K = L *  \frac{2}{3^2 * 2^5 * 5} * \frac {3^4 * 2^3}{1000}$
- Minuti: $K = L * \frac{1}{3 * 2^2 * 5} * \frac {3^4 * 2^3}{1000}$
- Secondi: $K = L *  \frac {3^4 * 2^3}{1000}$

$$\frac{K}{L} =  \frac{2}{3^2 * 2^5 * 5} * \frac {3^4 * 2^3}{1000} = \frac{9}{10000} = 0.0009$$

$$\frac{K}{L} =  \frac{1}{3 * 2^2 * 5} * \frac {3^4 * 2^3}{1000} = \frac{18}{5000} = 0.0036$$

-------

  
Pagina 87

IV

ORGANI DI MOVIMENTO

Base. Motore a peso. — Il movimento di rotazione dei pennelli del distributore, così come quello degli organi responsabili della traduzione dei segnali, è generalmente fornito da un sistema di ingranaggi e ruote dentate mossi dall'azione di un peso che agisce su una catena senza fine. Cinque assi orizzontali e paralleli, ognuno dotato di un pignone e una ruota dentata, ruotano tra due piastre forate, allineate, unite da robusti supporti in acciaio. Il primo asse, posizionato nella parte superiore, ha un movimento principale in acciaio M (fig. 23) su cui scorre una catena di Gallé, sotto l'azione di una puleggia di appoggio g1. La catena passa poi su una seconda puleggia g2, sotto la puleggia di un contrappeso p, destinato a tendere la catena, poi su una ruota R2 e ritorna a chiudersi sotto la puleggia del peso motore P, tramite una vite. Durante la caduta del peso, la catena tenuta in R2 tira il mobile M e lo porta nella direzione indicata dalla freccia; questo movimento è trasmesso agli altri mobili da una ruota dentata in bronzo R3 solidale con la ruota della catena.

Remontoir. — Per poter riavvolgere il peso motore senza interrompere la sua azione sulla catena, è stato installato in R2 un dispositivo di ruote dentate e ruote a rinvio chiamato remontoir.

Pagina 88

Sullo stesso asse, sono posizionati, a basso attrito, due manicotti in acciaio; il primo porta una ruota dentata R1 (fig. 24), il secondo una ruota dentata R2, e due ruote a rinvio r1 e r2.

Su R1 passa un pezzo di catena teso da una robusta molla a bolla b fissata al telaio del tavolo; all'altro estremo della catena 
è attaccata una barra di ferro che può essere manovrata, verticalmente, da un pedale con il suo punto di appoggio su una traversa posta tra le gambe del tavolo.

L'indice I, dipendente dallo stesso manicotto della ruota R1, è fornito, alla sua estremità, di un robusto arpione c1. 
Una lama a molla forza quest'ultimo a ingranare nei denti della ruota a rinvio r1 del secondo manicotto. La catena senza fine, portante il peso motore, ingrana con i denti della ruota R2 

![image](https://github.com/jumpjack/heliostat/assets/1620953/e3cb109d-5d8f-40ce-aa17-16dcee23764f)


Pagina 89

posizionata tra il contrappeso e il peso. Infine, la ruota a rinvio r2 può ruotare solo in un senso, [poichè] il dente c2, chiamato dente di trattenuta, 
impedisce qualsiasi movimento in direzione opposta.

Il funzionamento è piuttosto semplice. Durante la discesa del peso motore, la ruota R2 non può spostarsi e rispondere alla trazione del peso, a causa 
dell'azione del dente di trattenuta che blocca la ruota r2. Per riavvolgere il peso motore, è sufficiente premere il pedale per vincere l'opposizione 
della molla a bolla; il pezzo di catena che ingrana con i denti della ruota R1, essendo sollecitato

![image](https://github.com/jumpjack/heliostat/assets/1620953/627eae4f-601e-4918-9b2f-7a2bb9da3694)

pagina 90

dall'alto verso il basso, costringerà la ruota a girare nella direzione indicata dalla freccia. Ma la ruota è solidale 
con l'indice I; questo, tramite il suo scatto, fa girare la ruota r1, e di conseguenza, le altre due ruote R2 e r2 solidali 
anche allo stesso manicotto. La ruota R2, portante la catena senza fine, gira nella stessa direzione di R1, e una parte 
della catena posta dal lato del peso motore passa dal lato del contrappeso, il che ha come risultato il riavvolgimento del peso motore e la discesa del contrappeso.

Quando si rilascia il pedale, esso torna nella sua posizione di riposo sotto la trazione della molla a bolla b; la ruota 
R1 e l'indice I si muovono nella direzione opposta della freccia per tornare alla loro posizione originale. Ma questo movimento 
retrogrado non può essere trasmesso al secondo manicotto. Infatti, a causa della sua direzione, lo scatto c1 scivola sul retro 
dei denti della ruota a rinvio senza potersi incastrare tra di essi per trascinarli; d'altra parte, il dente c2 si oppone a un
movimento retrogrado del manicotto; il sollevamento del peso ottenuto tramite la manovra della catena rimane quindi acquisito.

Si nota, dall'esame della figura 24, che il peso motore durante questa operazione, non ha smesso di agire sul mobile principale
M e che, di conseguenza, il movimento di rotazione non è stato disturbato.

Si noterà che, a causa del gioco degli scatti, le due parti del remontoir sono solidali solo per gli spostamenti avanti e indietro della figura.

L'insieme degli ingranaggi e del remontoir prende il nome di base-motore a peso. È sovrastato da una piastra in ottone che porta un asse che riceve il movimento del quinto mobile della base.

La ruota dentata di quest'ultimo mobile non è bloccata sull'asse; è fissata solo da 4 viti (fig. 23) che penetrano in una piattaforma solidale all'asse. Grazie 

pagina 91

a questa disposizione, la stessa base-motore può essere utilizzata sia per il traduttore che per il distributore; è sufficiente cambiare la piastra superiore e la ruota dentata del quinto mobile, il cui numero di denti differisce a seconda che si tratti dell'uno o dell'altro di questi dispositivi.

A titolo informativo, diamo il numero di denti dei pignoni e delle ruote della base-motore del distributore:

1o mobile: pignone ",  ruota 55;
2o mobile: pignone 22, ruota 90;
3o mobile: pignone 20, ruota 110;
4o mobile: pignone 19, ruota 110;
5o mobile: pignone 18, ruota 105;
6o mobile: pignone 21, ruota 12;

Per il traduttore, la ruota del 5o mobile ha 100 denti e ingrana con la ruota del 6o asse che ne ha 35. Il pignone di quest'ultimo mobile è dotato di 12 denti.

[Cioè per il traduttore gli ingranaggi dovrebbero essere:

1o mobile: pignone ",  ruota 55;
2o mobile: pignone 22, ruota 90;
3o mobile: pignone 20, ruota 110;
4o mobile: pignone 19, ruota 110;
5o mobile: pignone 18, ruota 100;
6o mobile: pignone 35, ruota 12;

]

Il 6o asse ruota alla massima velocità di cui il sistema è suscettibile, è quindi dotato di un organo di regolazione che differisce a seconda che si tratti del distributore o del traduttore: ne studieremo più avanti i tipi.

Remontoirs automatici. — Al fine di rendere il servizio meno faticoso e di evitare la manovra frequentemente ripetuta del pedale, l'Amministrazione ha fatto ricorso all'uso di remontoirs automatici azionati da motore elettrico, idraulico, a seconda dei casi. Descriveremo solo il tipo utilizzato presso il Posto centrale telegrafico di Parigi.

Se si considera che il funzionamento del remontoir consiste nel far passare la catena dal lato del peso motore al lato del contrappeso, si vedrà che lo stesso

pagina 92

risultato può essere ottenuto tirando la catena, dall'alto verso il basso, dal lato del contrappeso. Questa funzione è realizzata mediante un pignone p, dipendente da un asse terminante all'altro estremo con una ruota R (fig. 25) con denti obliqui. Questa ruota riceve il movimento da un altro asse orizzontale posizionato perpendicolarmente al primo, e dotato di un vite senza fine V.


Questo asse a sua volta è mosso dal motore M, tramite una cinghia di trasmissione che agisce su una puleggia P. Un dito in acciaio lucidato d, sotto l'azione di una molla a bolla, forza la catena a ingranare con il pignone p. Per consentire l'uso del remontoir a pedale, nel caso in cui la forza motrice dovesse mancare e rendere inutilizzabile il remontoir automatico, la ruota R è montata a basso attrito sull'asse del pignone p. Essa trasmette il suo movimento a quest'ultimo solo tramite uno scatto c (fig. 26), fissato dietro la ruota

![image](https://github.com/jumpjack/heliostat/assets/1620953/5e82fb28-c598-4893-8ce6-5db06a65a353)


pagina 93


 e inserendosi, sotto l'azione della molla, nell'incavo di un supporto e dell'asse.

Senza questa disposizione, la catena, fermata dal pignone p, non potrebbe scendere sotto il contrappeso quando si usa il pedale. Infatti, il pignone, non essendo solidale con la ruota R, potrebbe ruotare liberamente sotto il peso della catena portata su di esso dal gioco del remontoir a pedale. La sua presenza potrebbe essere un ostacolo solo nel caso in cui, a causa di una mancanza di lubrificazione, non potesse girare facilmente. Basterebbe quindi sganciare la molla a bolla dal dito d'appoggio, in modo da lasciare alla catena uno spazio sufficientemente ampio per permetterle di scendere senza toccare i denti del pignone.  

![image](https://github.com/jumpjack/heliostat/assets/1620953/b30c9e38-2214-49fb-a3c9-6073c165eb42)


------------


p.87

IV

ORGANES DE MOUVEMENT

Socle. Moteur à poids. — Le mouvement de rotation 
des balais du distributeur, de même que celui des organes
chargés de la traduction des signaux, est généralement 
fourni par un système de pignons et de roues d’engrenage 
mûs par l’action d’un poids agissant sur une chaîne sans 
fin. Cinq axes horizontaux et parallèles, comportant 
chacun un pignon et une roue dentée, pivotent entre deux
Platines ajourées, en ionte, réunies par de fortes entremises
en acier. Le premier axe, placé à la partie supérieure 
possède un maître-mobile en acier M (fig. 23) sur lequel 
cagrène une chaîne de Galle, sous l’action d’un galet
d'appui g1. La chaîne passe ensuite sur un deuxième galet
g2, sous la poulie d’un contrepoids p, destiné à tendre la
chaîne, puis sur une roue R2 et revient se fermer sous la
poulie du poids moteur P, au moyen d’une vis. Pendant 
la chute du poids, la chaîne maintenue en R2, tire sur le 
mobile M et l’entraîne dans le sens indiqué par la flèche; 
ce mouvement est transmis aux autres mobiles par une 
roue dentée en bronze R3 solidaire de la roue de chaîne.

Remontoir. — Afin de pouvoir remonter le poids mo-
teur sans interrompre son action sur la chaîne, on a ins-
tallé en R2 un dispositif de roues dentées et de roues à ro-
chet appelé remontoir.

p.88


Sur le même axe, sont placés, à frottement doux, deux
manchons en acier; le
premier porte une roue 
dentée R1 (fig. 24), le 
second une roue dentée 
R2, et deux roues 
à rochet r1 et r2.

Sur la roue R1, passe 
un bout de chaîne tendu 
par un fort ressort à
boudin b fixé au bâti 
de la table ; à l’autre 
extrémité de la chaîne 
est accrochée une tige 
de fer pouvant être ma-
nœuvrée, dans le sens 
vertical, par une pédale
ayant son point 
d’appui sur une entretoise 
placée entre les 
pieds de la table.

L’index I,dépendant 
du même manchon que 
la roue R1, est pourvu, 
à son extrémité, d’un 
fort cliquet d’entraînement 
c1. Un ressort-
lame force ce dernier
à s’engager dans les 
dents de la roue à rochet 
r1, du deuxième manchon. 
La chaîne sans fin, portant le 
poids moteur, engrène avec les dents de la reue R2 qui se


 
 p.89
 
trouve placée entre le contrepoids et le poids. Enfin la roue a rochet r2 ne peut tourner que dans un sens, le cliquet c2, appelé *cliquet de retenue*, empêchant tout déplacement en Sens contraire.

Le fonctionnement est des "plus simples. Pendant la

![image](https://github.com/jumpjack/heliostat/assets/1620953/627eae4f-601e-4918-9b2f-7a2bb9da3694)


(Fig. 24.)

descente du poids moteur, la roue R2 ne peut se déplacer 
et obéir à la traction du poids, par suite de l’action du
cliquet de retenue qui cale la roue r2. Pour remonter le
poids moteur, il suffit d’appuyer sur la pédale de façon à
vaincre l’opposition du ressort à boudin; le bout de chaîne
qui engrène avec les dents de la roue R1, étant sollicité

p.90
de haut en baB, forcera la roue à tourner dams le sens
indiqué par la flèche. Mais la roue est solidaire de l’index
I; celui-ci, au moyen de son cliquet, entraîne la roue r4, et par suite, les deux autres roues R2 et r2 solidaires également
du même manchon. La roue R2, portant la chaîne 
sans fin, tourne dans le même sens que R1, et une partie 
de la chaîne placée du côté du poids moteur passe du côté 
du contre-poids, ce qui a pour résultat de faire remonter 
le poids moteur et descendre le contrepoids.

Lorsqu’on lâche la pédale, elle revient, à sa position
de repos sous la traction du ressort à boudin b; la roue R1 
et l’index I se déplacent en sens inverse de la flèche pour 
revenir à leur position primitive. Mais ce mouvement 
rétrograde ne pourra être communiqué au deuxième manchon. 
En effet, par suite de sa direction, le cliquet c1 
glisse sur le dos des dents de la roue à rochet sans pouvoir
s’arcbouter entre elles pour les entraîner ; d’autre part, le 
cliquet c2 s’oppose à un retour en arrière du manchon ; la
montée du poids obtenue par la manœuvre de la chaîne reste donc acquise.

On voit, par l’examen de la figure 24, que le poids 
moteur pendant cette opération, n’a pas cessé d’agir sur
le maître-mobile M et que, par conséquent, le mouvement de rotation n’a pas été troublé.

On remarquera que, en raison du jeu des cliquets, les 
deux parties du remontoir ne sont solidaires que pour les 
déplacements d’avant en arrière de la figure.

L’ensemble de l’engrenage et du remontoir prend le 
nom de socle-moteur à poids. Il est surmonté d’une platine 
en laiton portant un axe recevant le mouvement du cinquième mobile du socle.

La roue dentée de ce dernier mobile n’est pas calée 
à demeure sur l’axe ; elle n’y est fixée que par 4 vis (fig. 23)
pénétrant dans une plate-forme solidaire de i’axe. Par


p.91

suite de cette disposition, le même socle-moteur peut 
servir aussi bien pour le traducteur que pour le distribu-
teur ; il suffit de changer la platine supérieure et la roue
dentée du cinquième mobile dont le nombre de dents
diffère, selon qu’il s’agit de l’un ou de l’autre de ces appareils.

A titre de renseignements nous donnons le nombre de 
dents des pignons et des roues du socle-moteur du 
distributeur :

1er mobile : pignon ", roue 55;
2e mobile : pignon 22, roue 90;
3e mobile : pignon 20, roue 110;
4e mobile : pignon 19, roue 110;
5* mobile : pignon 18, roue 105;
6e mobile : pignon 21, roue 12;

Pour le traducteur, la roue du 5e mobile possède 100
dents et engrène avec la roue du 6e axe qui en possède 35. 
Le pignon de ce dernier mobile est muni de 12 dents.

Le 6e axe tourne à la plus grande vitesse dont le système 
est susceptible, il est pourvu en conséquence d’un organe
régulation qui diffère suivant qu’il s’agit du distribuer 
ou du traducteur : nous en étudierons plus loin les types.

Remontoirs automatiques. — Dans le but de rendre
moins pénible le service, et pour éviter la manœuvre fré-
quenment renouvelée de la pédale, l’Administration a eu 
recours à l’emploi de remontoirs automatiques mûs par 
moteur électrique, hydraulique, suivant les cas. Nous ne 
décrirons que le type employé au Poste central télégraphique 
de Paris.

Si l’on considère que le fonctionnement du remontoir 
consiste qu’à faire passer la ohaîne du côté du poids 
moteur au côté du contrepoids, on verra que le même


p.92

résultat peut être atteint en tirant la chaîne, de haut en 
bas, du côté du contrepoids. Cette fonction s’accomplit 
au moyen d’un pignon p, dépendant d’un axe terminé à 
l’autre extrémité par une roue R (fig. 25) è dents obliques.
Cette roue reçoit le mouvement d’un autre axe horizontal
placé perpendiculairement au premier, et muni d’une 
vis sans fin V.

(Fig. 25.)

Ce dernier axe est mû lui-même par le moteur M, au 
moyen d’une courroie de transmission agissant sur une 
poulie P. Un doigt en acier poli d, sous l’actien d’un
ressort à boudin, force la chaîne à engrener avec le pignon p.
Pour permettre l’emploi du remontoir à pédale, dans le 
cas où la force motrice viendrait à manquer et rendrait
inutilisable le remontoir automatique, la roue R est montée 
à frottement doux sur l’axe du pignon p. Elle ne communique 
son mouvement à ce dernier que par l’intermédiaire 
d’un cliquet c (fig. 26), fixé derrière la roue et venant
  
  p.93
  
s'engager, sous l’action du ressort, dans l’entaille d’un épau-
tanent e de l’axe.

Sans cette disposition, la chaîne, arrêtée par le pignon p,ne pourrait descendre sous
le contre-poids lorsque l’on 
fait usage de la pédale. En 
effet, le pignon, n’étant 
pas solidaire de la roue R,
peut tourner librement 
sous le poids de la chaîne 
amenée sur lui par le jeu
du remontoir à pédale. Sa 
Présence ne pourrait être
une gêne que dans le cas 
ou, par suite d’un défaut
de graissage, il ne pour-
rait tourner facilement. Il 
suffirait alors de décro-
cher le ressort à boudin 
du doigt d’appui, de façon 
à laisser à la chaîne un 
espace assez large pour lui permettre de descendre sans 
tucher aux dents du pignon.  
  
  
  ------------
