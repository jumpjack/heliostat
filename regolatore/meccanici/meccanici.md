[La Lumière électrique -  1e série, vol. 9, n. 18-34, 1883 -  p.67](https://cnum.cnam.fr/pgi/fpage.php?P84.9/71/160/560/0/0)


REGOLATORI PURAMENTE MECCANICI 

([versione HTML](https://jumpjack.github.io/heliostat/regolatore/meccanici/meccanici.html))

I regolatori di cui ci occuperemo ora si basano su un'azione di regolazione, esercitata direttamente e meccanicamente sul motore stesso, sia a causa degli effetti della forza centrifuga, sia a causa delle reazioni esercitate su un mezzo gassoso o liquido.

I primi sono ben noti con il nome di regolatori a forza centrifuga, di cui il regolatore di Watt è la rappresentazione più semplice; i secondi sono conosciuti come regolatori ad alette. Non parliamo dei regolatori a volano basati sugli effetti dell'inerzia, poiché sono stati utilizzati, come si è visto, nei sistemi precedenti, e inoltre regolano solo grossolanamente il funzionamento delle macchine.

Il regolatore di Watt è composto, come si sa, da quattro barre articolate disposte a rombo (vedi fig. 15), di cui due articolate sull'asse del motore si estendono oltre la loro articolazione con le altre due, e portano due pesanti sfere che, ruotando, possono allontanarsi più o meno dall'asse del motore a causa della forza centrifuga, e quindi spingono o attraggono le altre due braccia che fanno salire o scendere un collare o manicotto al quale è adattata una barra che comanda il movimento della valvola di introduzione del vapore.

Per ogni velocità, la forma di questo moderatore è determinata e può essere calcolata matematicamente. Supponiamo, per semplicità, che la sfera sia ridotta a un punto materiale. Nella posizione di equilibrio, le due componenti perpendicolari a AC, fig. 16, devono essere in equilibrio, e quelle che corrispondono a questa direzione sono distrutte dalla resistenza del pendolo. Quindi, se rappresentiamo la forza centrifuga esercitata lungo CD con v^2/r e se la velocità di rotazione v è uguale a $(r * \omega)$, con $\$ l'angolo di rotazione :

1) $\frac{v^2}{r} * cos(\alpha) = r  {\omega}^2 * cos(\alpha)    =    g * cos(90°-\alpha) = g * sin(\alpha)$,

da cui

2) $r = \frac{g}{\omega^2} * tan(\alpha)$

Poiché $r = AD * tan(\alpha)$, si conclude che $AD = \frac{g}{\omega^2}$ . Quindi le sfere saranno posizionate sul punto C della linea CD determinata da questa equazione.

La lunghezza AD, per una data velocità, è facile da ottenere sperimentalmente. Sia t il tempo di una singola rivoluzione del regolatore alla velocità di regime che si vuole mantenere nella macchina, 2π il percorso coperto da un giro all'unità di distanza, $\frac{2π}{t} = \omega$.

Quindi:

3) $AD = \frac{g}{\omega^2} = \frac{g*t^2}{4{\pi}^2}$

da cui

4) $t = 2π\sqrt{\frac{AD}{g}}$ .


La durata di oscillazione di un pendolo semplice è data da:


5) $t =  π * \sqrt{\frac{l}{g}}$

Per trovare la lunghezza AD per il pendolo conico, basta appendere una palla di piombo a un filo e cercare la lunghezza per cui il periodo delle oscillazioni è la metà del periodo desiderato per una singola rivoluzione del pendolo conico. Chiamando l la lunghezza AC del pendolo conico, la formula sopra riportata si traduce in:

6) $t = 2π * \sqrt{\frac{l}{g}cos(\alpha)}$
​

Questo regolatore ha il grave difetto di non essere in grado di mantenere la velocità costante per una quantità di lavoro corrispondente alla nuova posizione del regolatore, poiché ogni posizione delle sfere corrisponde a una velocità differente. Ripristinando l'equilibrio dinamico, modifica la velocità, la cui costanza è di importanza capitale.

Si è cercato di ovviare a questo inconveniente disponendo le sfere in modi diversi, e tra le migliori soluzioni proposte, possiamo citare quella in cui il moderatore è 

![image](https://github.com/jumpjack/heliostat/assets/1620953/43cc3d66-221b-492b-9bf5-a95c1dd9871a)

parabolico, quella di M. Farcot in cui le braccia sono incrociate, e soprattutto quella di Foucault, che ha attirato maggiormente l'attenzione.

Sistema di M. Foucault
----------------------

In questo sistema, l'azione delle sfere dei regolatori precedenti è assistita da quella di contro-pesi, e sebbene questa idea fosse stata proposta molto tempo prima da M. Charbonnier e applicata da M. Farcot, è stato M. Foucault a dimostrare tutta l'importanza di questa combinazione.

Riprendiamo la formula (6):

7) $t = 2 * π \sqrt{\frac{l * cos(\alpha)}{g}}$
​ 
 
Se invece di un punto il pendolo porta una sfera su cui si può considerare la massa concentrata nel suo centro di gravità, la formula sarà [comunque] vera, e se P è il peso, esendo  P=Mg, diventa:

8) $t = 2 * π \sqrt{\frac{M * l * cos(\alpha)}{P}}$

​ 
Ora, se si fa entrare nella formula il peso p del manicotto, si vede facilmente, confrontando i momenti nei due casi, che per lo stesso valore di r, i rapporti dei quadrati delle velocità angolari sono tra loro come (P+p)/P , e di conseguenza i tempi sono in rapporto inverso delle radici quadrate di queste quantità, cioè:


9) $t = \sqrt{\frac{P}{P+p}} * 2 \pi * \sqrt{\frac{l * M * cos(\alpha)}{P}} = 2 \pi * \sqrt{\frac{M * l * cos(\alpha)}{P+p}}$


Se si osserva che in questa formula,  essendo cos(α) una variabile,  lo è anche  t, si vede che per rendere t costante, bisognerebbe far scomparire cos(α), introducendolo al denominatore della frazione sotto il radicale, cioè 

![image](https://github.com/jumpjack/heliostat/assets/1620953/31f6b711-5151-43c8-95e4-df9d941b6706)


sostituendo (P+p) con (P+p)cos(α). Questo termine corrisponde a un peso che si inclina sulla verticale; questo è il principio della soluzione proposta da M. Foucault.

Sia AO una barra (fig. 17), articolata all'estremità di una barra oscillante AS, l'estremità A di questa barra, per piccole variazioni, si muove lungo una linea sostanzialmente orizzontale, il punto O si muove lungo una linea verticale e trasmetterà al manicotto gli sforzi esercitati all'estremità A della barra AO dove si applica l'azione di una forza costante P+p. Questa forza, trasferita al punto O, può essere decomposta in due parti, una orizzontale e una verticale che gli è direttamente opposta e tende a sollevarlo. Questa forza verticale, nulla quando la barra è orizzontale, acquisisce, quando il manicotto si solleva o si abbassa, un valore positivo o negativo proporzionale al seno dell'angolo $\eta$ o allo spazio percorso dal manicotto. Quindi sarebbe necessario scrivere, nell'espressione del valore di t, anziché P+p, semplicemente 

10) $P + p(1−sin(\eta))$

ciò che rende isocrono, poiché è una funzione che varia come cosα.

Per ottenere la forza costante P+p, M. Foucault utilizza il braccio AS, che diventa il braccio superiore di un'asta piegata ASK oscillante intorno al punto S, e il cui altro braccio SK porta un contrappeso K uguale a P+p, e facendo uguali gli angoli delle linee SO e SK con AS. 

M. Sauter ha utilizzato per la prima volta 

![image](https://github.com/jumpjack/heliostat/assets/1620953/7b6c0b06-f6d4-4126-9146-4c4fa4b565f7)


il regolatore di M. Foucault per regolare il movimento di un faro lenticolare di primo ordine. In questo apparecchio, il lavoro motore può essere considerato costante, ma il lavoro resistente è ancora soggetto a variazioni a causa di leggere imperfezioni degli ingranaggi, dell'usura non uniforme dei rulli e di cause accidentali, e quando varia, l'eccesso o l'insufficienza del lavoro motore si traduce in un'accelerazione o un rallentamento del movimento. L'unico modo per eliminare queste irregolarità, poiché non si può agire direttamente né sul lavoro motore né sul lavoro resistente, è creare una resistenza supplementare e variabile, in grado, in un dato momento, di assorbire l'eccesso del lavoro motore e, quando necessario, diminuire al contrario per lasciare tutto il lavoro disponibile al profitto del lavoro utile che si vuole ottenere. Questa resistenza accessoria è prodotta dalle ali di un volano che gira a una velocità di 100 giri al minuto e può ricevere un'inclinazione variabile. Queste ali sono in relazione con i bracci di un pendolo di Watt. Quando, a causa dell'accelerazione della macchina, i bracci si alzano, le ali si aprono e il lavoro passivo aumenta; quando i bracci si abbassano, le ali si chiudono e il lavoro passivo diminuisce.
