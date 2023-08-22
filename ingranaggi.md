# Appunti su ingranaggi

## Dimensionamento degli ingranaggi

- Per calcolare il modulo di un ingranaggio conoscendo diametro esterno e numero di denti: m = AD/(N+2)  (N = numero denti) (solo per angolo di 20°?)
- Per calcolare a occhio le dimensioni di un ingranaggio:
   - un dente è alto 2,25 volte il modulo
   - il diametro esterno vale AD = m * (N+2), cioè all'incirca m volte il numero di denti
- L'angolo di pressione usato è praticamente sempre 20°
- Più è grande il modulo, più è robusto l'ingranaggio
- Per "diametro (di riferimento)" si intende quello della Circonferenza Primitiva (pitch circle, Pitch Circle Diameter, PCD), non la distanza tra gli estremi di due ingranaggi opposti, che invece vale PCD + 2*m
- Per accoppiarsi, due ingranaggi devono avere obbligatoriamente stesso modulo

## Montaggio

- Distanza assi = Interasse = somma dei raggi delle 2 circonferenze primitive (Rp1 + Rp2 = (PD1 + PD2) /2)

## Confronto terminologia italiana/inglese

![image](https://github.com/jumpjack/heliostat/assets/1620953/522e44b2-b60e-4378-b441-adfee8d7489d)

- Modulo = form  (= Dp/N = diametro di pitch / numero di denti)
- Passo = Pitch   (= pigreco * modulo) (due ruote coniugate, per ingranare, devono avere lo stesso passo)
- Addendum = addendum (estensione del dente oltre la primitiva) (= _ad_ = modulo)
- Dedendum = dedendum (estensione del dente sotto la primitiva) (= _de_ = 1.25 * modulo)
- Circonferenza radice =  root circle   o   dedendum circle  (circonferenza base meno il gioco?)
- Circonferenza base = base circle     (il diametro della circonferenza di base è determinato dall'angolo di pressione)
- Circonferenza primitiva = pitch circle  (= circonferenza teorica di contatto in assenza di denti = circonferenza di riferimento per l'accoppiamento)  (PD = m * z)
- Circonferenza di testa = Circonferenza esterna = outside circle = addendum circle (Rtot = R + ad = R + m) (AD = PD + 2*m) (circonferenza del disco iniziale ("blank") da cui viene ricavato per "scavo" l'ingranaggio)
- Diametro esterno = outside circle diameter = addendum circle diameter = addendum diameter (AD = PD + 2*m)
- Gioco = clearance  (= _gi_)
- Altezza totale dente = ad + de (= 2,25 * modulo)  (= distanza tra diametro esterno e diametro base)
- Altezza profilo attivo = ad + de - gi (= altezza totale meno il gioco)
- Interasse = centre to centre distance = Distance between centers (= distanza tra i centri delle primitive, o somma dei raggi delle primitive)  (= (PD1 + PD2 )/2 )
- Retta di azione o di pressione (generatrice) = Line of action
- Angolo di pressione = pressure angle (angolo tra reta di pressione e tangente delle circonferenze primitive)
- Larghezza = face width (=spessore)
- Costa = face
- Fianco = flank
- Raggio di raccordo al piede = fillet radius (=m/3)
- Evolvente = Involute
- Ruote dentate cilindriche = spur gears
- Ruote dentate cilindriche ad evolvente = spur gears with involute
- Rapporto di trasmissione = transmission ratio  (dipende esclusivamente dai raggi di base)
- Cremagliera e pignone = Rack and pinion
- Dentiera o cremagliera = Rack
- Ingranaggio conico = Bevel gear
- Vano = width of space
- Segmento di contatto = line of contact
- Arco di azione = arc of action
- Disco iniziale = blank (quello da cui viene "scavato" l'ingranaggio, quindi il suo diametro è uguale al diametro esterno dell'ingranaggio finito)

## Siti

### Vendita

- [Norelem.it](https://www.norelem.it/it/it/Prodotti/THE-BIG-GREEN-BOOK/norelem-muove-Sistemi-e-componenti-per-la-costruzione-di-macchine-e-impianti/22000-Trasmissioni-meccaniche/Ingranaggi-Cremagliere-Ruote-coniche/22402-Ruote-dentate-frontali-in-plastica-modulo-3-stampate-a-iniezione-dentatura-diritta-angolo-di-pressione-20%C2%B0.html)

### Modellazione

- [GearGenerator](https://geargenerator.com/#200,200,100,6,1,3,0,4,1,8,2,4,27,-90,0,0,0,0,0,0,16,4,4,27,-60,0,0,0,0,1,1,12,1,12,20,-60,0,0,0,0,2,0,60,5,12,20,0,1,0,0,0,0,0,3,-515) (DXF, SVG)
- [EvolventDesign](https://evolventdesign.com/pages/spur-gear-generator) (DXF, SVG)
- [WoodGears](https://woodgears.ca/gear_cutting/template.html) (per stampa su carta...)
- [STLgears](https://www.stlgears.com/generators/3dprint) (STL)
- [me-bac.com](http://www.me-bac.com/index.php?task=gear (DXF))

# Riferimenti:
- http://www.diim.unict.it/users/rsinatra/corsi/allegati_modellistica/10%20-%20Ruote%20dentate%20(gears).pdf
- https://sites.unipa.it//giovanni.petrucci/Disp/Ruote.pdf
- https://www.rcet.org.in/uploads/academics/rohini_82445618687.pdf
- https://www.stlgears.com/generators/3dprint
