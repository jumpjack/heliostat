1) ![image](https://github.com/jumpjack/heliostat/assets/1620953/6f445de9-fc84-4f1b-860d-8ed773a73b0c)

Il cubetto a sinistra, che serve a contenere il **cuscinetto lineare** da 6 mm, sembra andare bene (ancora da provare)

Tempo di stampa: 45 minuti a 0.3

La **forcella** a destra non va bene:
- l'alleggerimento è sbagliato, ovviamente la parte orizzontale collassa
- la forcella è troppo corta: deve essere molto lunga, per permettere le posizioni più estreme dello specchio
- è inutilmente larga, quindi ci vuole più tempo a stamparla; provo a farla a filo col cubetto

Tempo di stampa: 1:50m a 0.4

  
Nuovo test di stampa:

![image](https://github.com/jumpjack/heliostat/assets/1620953/1694ba30-d72d-469c-8e43-408ce19939a1)

Tempo previsto: 2h 13m

Note:

- da stampare con supporti!
- Però forse i bracci si possono fare anche più stretti, se reggono lo sforzo di rotazione, allora il supporto non servirebbe
- i due buchi rettangolari intorno al buco da 11mm devono essere verticali
- i buchi da 11 mm vengono troppo stretti stampati a filo, bisogna limare parecchio
- il palo di alluminio da 6 mm preso da Leroy Marlin entra un po' a forza nel buco da 6mm, quindi va bene perchè deve essere fisso; ma una barra filettata da 6mm invece è un po' più stretta e ci sciacqua, mentre entra bene nel cuscinetto lineare, dove invece la barra di alluminio non entra.

------------

Dopo aver stampato quasi tutto... risulta tutto troppo enorme e pesante per essere sorretto dal meccanismo del timer! Ma questo spiega un altro dettaglio del progetto originale di Foucault:

![image](https://github.com/jumpjack/heliostat/assets/1620953/04ad34be-1eed-441f-8e42-629e7c856624)

Il supporto indicato dalla freccia, oltre a servire a distanziare lo specchio dall'orologio per permettere il libero movimento della coda dello specchio, serve anche ad accollarsi tutto il peso del meccanismo della forcella, che così non deve gravare sull'orologio, che quindi deve solo occuparsi di far girare tutto, senza dover sostenere il peso di niente.

----

Nuovo test di stampa dell'ingranaggio di declinazione a 1/3 (anzi, 0.30) delle dimensioni: sembra un po' troppo piccolo, e staccandolo dal piatto ancora caldo si piega.

Raddoppio allora le dimensioni, che quindi sono 0.30 * 2 = 0.6: sembrano dimensioni accettabili, anche per il pignone; dimensioni finali:

![image](https://github.com/jumpjack/heliostat/assets/1620953/3b82fe67-a0f1-4a17-8f19-a39c2fdcb152)


![image](https://github.com/jumpjack/heliostat/assets/1620953/58dffb6d-84f0-46b7-b55d-5221d543131f)

Notare che i buchi degli ingranaggi, per essere a incastro, non devono essere più larhi di 4.20, mentre i buchi del supporto devono essere almeno 4.40 per permettere la rotazione del perno:

![image](https://github.com/jumpjack/heliostat/assets/1620953/34b41b05-1464-4f2e-9597-434e00229c05)


C'è però un altro problema: non ho previsto un sistema di fissaggio stabile al perno! Il foro degli ingranaggi deve avere una tacca che si innesta sul perno, per evitare che ruoti liberamente! E poi dovrò intaccare il perno stesso in modo da permettere l'incastro.

C'è inoltre il problema del "gioco": il perno di ottone da 4mm che sto usando "balla" molto nella sua sede, quindi dovrò allungare la sede stessa  in modo da ridurre il gioco; inizialmente avevo pensato di usare i cuscinetti, ma è proprio per poter usare i cuscinetti che tutto il meccanismo è venuto enorme!

Proverò quindi ad allargare il supporto in questo modo, allungando così le sedi dei perni:

![image](https://github.com/jumpjack/heliostat/assets/1620953/26e62ed8-b33d-42b2-accf-1d8fa55f2810)


Un altro problema è che il pignone è troppo vicino al supporto, lo tocca e si blocca, quindi devo distanziarlo:

![image](https://github.com/jumpjack/heliostat/assets/1620953/89d4f06b-0534-4fd3-8677-8858e87e852b)


Diciamo che insomma dovrei riprogettare completamente il supporto, facendolo diventare così, ed eventualmente ristampo anche il pignone un po' più sottile, sempre per evitare che sbatta contro il supporto:

![image](https://github.com/jumpjack/heliostat/assets/1620953/625a27e4-c40e-4fed-8158-e7d2bce91286)

Oppure, per limitare tempo di stampa e costo del materiale, potrei provare a utilizzare comunque i cuscinetti:

![image](https://github.com/jumpjack/heliostat/assets/1620953/2343f5d9-04c1-4e78-b3d9-7fcc340ff022)

Provo 2  misure per i diametri dei buchi per valutare in quale buco il cuscinetto si incastra meglio, senza forzarlo ma allo stesso tempo senza che abbia gioco.



