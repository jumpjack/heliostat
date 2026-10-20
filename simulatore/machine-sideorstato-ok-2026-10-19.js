/*
  Campi nuovi/rilevanti per la cinematica:
   • asse  "rest": "carrier"  → se nessun altro vincolo ne determina la velocità, l'asse non gira rispetto al suo carrier
                                (senza questo campo, un asse non vincolato resta fermo rispetto al mondo, come prima).
   • meshWith può essere una stringa oppure {id:"..."}; basta dichiarare la coppia una sola volta (i doppioni sono ignorati).
   • Velocità: ogni asse ha una velocità w = componente, lungo il proprio asse, della velocità angolare assoluta.
     La velocità relativa al carrier è calcolata correttamente anche quando l'asse è perpendicolare al carrier.
*/
var MACHINE = {
  "title": "Orologeria completa – Fig. 1 + Fig. 2",
  "show": [
    {"gear": "gear_A", "label": "Motore a contrappeso (A)"},
    {"gear": "gear_L", "label": "Alette regolatore (L = 2592*A)"},
    {"gear": "gear_M", "label": "Pignone di uscita regolatore (M = 36*A)"},
    {"gear": "gear_N", "label": "Portasatelliti inferiore (10/9 XX'inf)"},
    {"axis": "axis_XXp", "label": "XX' inferiore (= XX'sup * 100/9 * K)"},
    {"gear": "gear_S", "label": "Pianeta S finale inferiore (orario + AR)"},
    {"gear": "gear_Q", "label": "Correzione Ascensione Retta"},
    {"gear": "gear_K_worm", "label": "Asse K_a_a1 superiore (XX'inf / K)"},
    {"axis": "axis_XXp_upper", "label": "Asse orario superiore (XX'inf * 9/100  / K"},
    {"gear": "gear_A_upper", "label": "Ruota A superiore"},
    {"gear": "gear_A1_upper", "label": "Ruota A1 superiore"},
    {"gear": "gear_B_upper", "label": "Uscita B differenziale (declinazione)"}
  ],
  "variants": {
    "input": {
      "label": "Ingresso dell'asse c",
      "active": "bevel",
      "options": {
        "spur": "Ruote gemelle R–R′ e asse a",
        "bevel": "Coppia conica R–R′ con asta lunga e snodo S"
      }
    }
  },
  "controls": [
    {"id": "zR","hidden": true, "label": "Denti di R e R′","variantKey": "input","step": 1,"ranges": {"spur": {"min": 50,"max": 100,"value": 60},"bevel": {"min": 20,"max": 60,"value": 30}}},
    {"id": "mR","hidden": true, "label": "Modulo di R e R′ (mm)","variantKey": "input","step": 0.1,"ranges": {"spur": {"min": 1,"max": 3,"value": 2},"bevel": {"min": 1,"max": 3,"value": 2}}},
    {"id": "latitude","label": "Latitudine (°)","step": 1,"ranges": {"all": {"min": -90,"max": 90,"value": 42}}}
  ],
  "consts": {
    "bExt": 350,"module": 1,"face": 8,"gap": 7,"faceN": 12,"drumD": 60,"drumLen": 105,"drumR": "drumD/2","k0": 0.7,
    "yW0": 6,"yW1": "yW0+face","yA0": "yW1+drumLen","yA1": "yA0+face","yD0": "yA1+gap","yD1": "yD0+face",
    "yApex": "yD1+10-k0*gears.gear_G.pr",
    "zH0": "gears.gear_F.pr+4+8","zH1": "zH0+face","zK0": "zH1+30","zK1": "zK0+face","zReg": "zK1+40",
    "shift": 80,"uV": 0,"uS": 48,"uN": 92,"uQ": "uN+faceN+36","uR": "uQ+44",
    "yM0": "-(shift+uN+faceN)","yM1": "-(shift+uN)",
    "e": "gears.gear_P.pr+gears.gear_Q.pr",
    "mOS": "e*2/(gears.gear_O.z+gears.gear_S.z)",
    "vlen": 400,"hlen": 100,"rodLen": 280,"jointArm": 40,
    "phiB": "-pi/2-0.5","bend": "25*pi/180",
    "d1x": "-sin(phiB)","d1z": "cos(phiB)","d2x": "-sin(phiB+bend)","d2z": "cos(phiB+bend)",
    "lj": "gears.gear_R.pr+4+jointArm",
    "fork_length" : 200,
    "initialDecli" : 0,
    "initialDecliDeg" : 0,
    "XXp_axis_rotation" : 135,
    "alpha" : 30,
    "XXp_offset" : 135,
    "len_coda_specchio" : 400,
    "groundRefZ" : -200,
    "spess_specchio" : 4,
    "largh_specchio" : 300,
    "U2_apexW" : "gears.gear_G_upper.pr + 60 + vlen",
"ljU"    : "100",
"bendU"  : "25*pi/180",
"dU2x"   : "cos(bendU)",
"dU2z"   : "-sin(bendU)",
"rodLenU": 400

  },
  "axes": [
    {"id": "axis_1B","name": "Asse 1 – tamburo","dir": [0,1,0],"ref": [1,0,0],"view": [0,-1,0],"viewLabel": "da davanti","color": "#a98a3c","hold": true,"place": {"at": [0,0,0]},"parts": [
      {"shape": "cylinder","r": 5,"w": [-22,"yA1+4"],"n": 24},
      {"shape": "cylinder","r": 2.5,"w": ["yW1+1","yA0"],"at": ["drumR",0],"n": 16,"color": "marker"},
      {"shape": "cylinder","r": 4,"w": ["yW0-.4","yW1+.4"],"at": [".55*gears.gear_W.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_1A","name": "Asse 1 – ruota A","dir": [0,1,0],"ref": [1,0,0],"view": [0,-1,0],"viewLabel": "da davanti","color": "#d2ac52","place": {"at": [0,0,0]},"parts": [
      {"shape": "cylinder","r": 9,"w": ["yA0-1","yA1+1"],"n": 24},
      {"shape": "cylinder","r": 4,"w": ["yA0-.4","yA1+.4"],"at": [".6*gears.gear_A.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_b","name": "Asse del pignone di carica","dir": [0,1,0],"ref": [1,0,0],"view": [0,-1,0],"viewLabel": "da davanti","color": "#9aa4ae","place": {"byMesh": "gear_b","dir": ["cos(-40*pi/180)",0,"sin(-40*pi/180)"]},"parts": [
      {"shape": "cylinder","r": 3,"w": [-22,"yW1-2"],"n": 16},
      {"shape": "box","w": [-34,-21],"half": [4,4]}
    ]},
    {"id": "axis_2CD","name": "Asse 2","dir": [0,1,0],"ref": [1,0,0],"view": [0,-1,0],"viewLabel": "da davanti","color": "#b08a45","place": {"byMesh": "gear_C","dir": [1,0,0]},"parts": [
      {"shape": "cylinder","r": 5,"w": ["yA0-4","yD1+2"],"n": 24},
      {"shape": "cylinder","r": 3.5,"w": ["yA0-9","yD1+4"],"n": 16},
      {"shape": "cylinder","r": 4,"w": ["yD0-.4","yD1+.4"],"at": [".6*gears.gear_D.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_3EF","name": "Asse 3","dir": [0,1,0],"ref": [1,0,0],"view": [0,-1,0],"viewLabel": "da davanti","color": "#d9782e","hold": true,"place": {"byMesh": "gear_E","dir": [1,0,0]},"parts": [
      {"shape": "cylinder","r": 6,"w": ["yD1-.6","yApex+1.15*k0*gears.gear_G.pr"],"n": 24},
      {"shape": "cylinder","r": 3.5,"w": ["-(uN+24+shift)","yApex+gears.gear_G.pr"],"n": 16},
      {"shape": "cylinder","r": 15,"w": ["-(uN-18+shift)","-(uN-34+shift)"],"n": 32},
      {"shape": "cylinder","r": 3,"w": ["yApex+k0*gears.gear_G.pr-.6","yApex+k0*gears.gear_G.pr+.5"],"at": [".5*gears.gear_F.pr",0],"n": 16,"color": "marker"},
      {"shape": "cylinder","r": 1.8,"w": ["yM0-.4","yM1+.4"],"at": [6,0],"n": 12,"color": "marker"},
      {"shape": "box","w": ["-(uN-22+shift)","-(uN-30+shift)"],"at": [0,-12],"half": [3,3],"color": "marker"}
    ]},
    {"id": "axis_3GH","name": "Asse 4","dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dall'alto","color": "#3f74b8","place": {"byApex": "gear_F"},"parts": [
      {"shape": "cylinder","r": 4,"w": ["gears.gear_F.pr+3","zH1+10"],"n": 16},
      {"shape": "cylinder","r": 7,"w": ["zH0-6","zH1+6"],"n": 24},
      {"shape": "cylinder","r": 4,"w": ["zH0-.4","zH1+.4"],"at": [".6*gears.gear_H.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_5JK","name": "Asse 5","dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dall'alto","color": "#5f9a4a","place": {"byMesh": "gear_J","dir": [-1,0,0]},"parts": [
      {"shape": "cylinder","r": 3,"w": ["zH0-8","zK1+8"],"n": 16},
      {"shape": "cylinder","r": 4,"w": ["zK0-.4","zK1+.4"],"at": [".6*gears.gear_K.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_6L","name": "Asse 6 – regolatore","dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dall'alto","color": "#8f5a9b","place": {"byMesh": "gear_L","dir": [-1,0,0]},"parts": [
      {"shape": "cylinder","r": 3,"w": ["zK0-8","zReg+22"],"n": 16},
      {"shape": "cylinder","r": 6,"w": ["zReg","zReg+20"],"n": 24},
      {"shape": "prism","poly": [[0,"zReg+18"],[-34,"zReg+64"],[-14,"zReg+76"]],"y": [-1,1],"color": "#b98cc4"},
      {"shape": "prism","poly": [[0,"zReg+18"],[34,"zReg+64"],[14,"zReg+76"]],"y": [-1,1],"color": "#b98cc4"}
    ]},

{"id": "axis_XXp",
 "name": "Asse orario inferiore XX' (uscita AR, solidale a gear_S e gear_V)",
 "dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti",
 "color": "#d2ac52","group": "fig2",
 "carrier": "axis_XXp_idle",
 "place": {"coaxial": "axis_XXp_idle"},
 "parts": [
   // pezzi che prima erano su axis_btSV (tubo di uscita + marker S + marker V)
   {"shape": "cylinder","r": 6.5,"w": ["shift+uV+face-2-bExt","shift+uN-1"],"n": 24},
   {"shape": "cylinder","r": 3.5,"w": ["shift+uS-.4","shift+uS+face+.4"],"at": [".6*gears.gear_S.pr",0],"n": 16,"color": "marker"},
   {"shape": "cylinder","r": 3.5,"w": ["shift+uV+face+3.6-bExt","shift+uV+face+4.4-bExt"],"at": [".5*gears.gear_V.pr",0],"n": 12,"color": "marker"}
 ]},


{"id": "axis_XXp_idle",
 "name": "Portasatelliti inferiore XX' (folle)",
 "dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti",
 "color": "#d2ac52","group": "fig2",
 "place": {"byMesh": "gear_N","dir": [0,0,1]},
 "rotate": {"around": "axis_3EF","deg": "alpha"},
 "parts": [
   {"shape": "cylinder","r": 9,"w": ["shift+uN-2","shift+uN+faceN+2"],"at": ["-e",0],"n": 24},
   {"shape": "cylinder","r": 3.5,"w": ["shift+uN-.4","shift+uN+faceN+.4"],"at": [".8*gears.gear_N.pr",0],"n": 16,"color": "marker"},
   {"shape": "box","w": ["shift+uN+faceN","shift+uN+faceN+12"],"at": ["e",0],"half": [10,12],"color": "#6b7280"},
   {"shape": "cylinder","r": 3,"w": ["shift+uV-34","shift+uR+face+20"],"n": 20,"variant": {"input": "spur"}},
   {"shape": "cylinder","r": 3,"w": ["shift+uV-34","shift+uR+6"],"n": 20,"variant": {"input": "bevel"}}
 ]},


{"id": "axis_YYp","name": "Asse satellite inferiore","dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti","color": "#9aa4ae","group": "fig2","carrier": "axis_XXp_idle","place": {"byMesh": "gear_P","dir": [0,0,-1]},"parts": [
  {"shape": "cylinder","r": 3.5,"w": ["shift+uS-10","shift+uQ+face+4"],"n": 20},
  {"shape": "cylinder","r": 3.5,"w": ["shift+uQ-.4","shift+uQ+face+.4"],"at": [".6*gears.gear_P.pr",0],"n": 16,"color": "marker"}
]},

{"id": "axis_cQR",
 "name": "Tubo ingresso AR",
 "dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti","color": "#5f9a4a","group": "fig2",
 "carrier": "axis_XXp_idle",
 "place": {"coaxial": "axis_XXp_idle"},
 "parts": [
   {"shape": "cylinder","r": 6.5,"w": ["shift+uN+faceN+1","shift+uR+face+8"],"n": 24,"variant": {"input": "spur"}},
   {"shape": "cylinder","r": 3.5,"w": ["shift+uR-.4","shift+uR+face+.4"],"at": [".6*gears.gear_R.pr",0],"n": 16,"color": "marker","variant": {"input": "spur"}},
   {"shape": "cylinder","r": 6.5,"w": ["shift+uN+faceN+1","shift+uR-2"],"n": 24,"variant": {"input": "bevel"}},
   {"shape": "cylinder","r": 3.5,"w": ["shift+uR-4.4","shift+uR-3.6"],"at": [".5*gears.gear_R.pr",0],"n": 12,"color": "marker","variant": {"input": "bevel"}}
 ]},

//     {"id": "axis_btSV","name": "Tubo uscita AR","dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti","color": "#3f74b8","group": "fig2",
//     "carrier": "axis_XXp",
//     "place": {"coaxial": "axis_XXp"},"parts": [
//       {"shape": "cylinder","r": 6.5,"w": ["shift+uV+face-2-bExt","shift+uN-1"],"n": 24},
//       {"shape": "cylinder","r": 3.5,"w": ["shift+uS-.4","shift+uS+face+.4"],"at": [".6*gears.gear_S.pr",0],"n": 16,"color": "marker"},
//       {"shape": "cylinder","r": 3.5,"w": ["shift+uV+face+3.6-bExt","shift+uV+face+4.4-bExt"],"at": [".5*gears.gear_V.pr",0],"n": 12,"color": "marker"}
//     ]},


    {"id": "axis_vs","name": "Albero verticale (V2, V3)","dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dall'alto","color": "#c7864a",
    "group": "fig2","place": {"byApex": "gear_V"},
    "rotate": {"around": "axis_XXp","deg": "-alpha"},
    "parts": [
      {"shape": "cylinder","r": 4,"w": ["gears.gear_V2.pr+3","vlen-gears.gear_V3.pr-3"],"n": 20},
      {"shape": "cylinder","r": 3.5,"w": ["gears.gear_V2.pr+3.6","gears.gear_V2.pr+4.4"],"at": [".5*gears.gear_V2.pr",0],"n": 12,"color": "marker"}
    ]},
    {"id": "axis_worm","name": "Albero orizzontale (V4 e vite)","dir": [-1,0,0],"ref": [0,0,1],"view": [-1,0,0],"viewLabel": "dall'estremità libera, guardando verso la coppia conica","color": "#4a9bc7","group": "fig2","place": {"byApex": "gear_V3"},
    "rotate": {"around": "axis_vs","deg": -90},"parts": [
      {"shape": "cylinder","r": 4,"w": ["gears.gear_V4.pr+3","hlen"],"n": 20},
      {"shape": "box","w": ["hlen","hlen+14"],"half": [6,6]},
      {"shape": "cylinder","r": 3.5,"w": ["gears.gear_V4.pr+3.6","gears.gear_V4.pr+4.4"],"at": [".5*gears.gear_V4.pr",0],"n": 12,"color": "marker"}
    ]},
    {"id": "axis_K_a_a1","name": "Asse della ruota della vite (AR)","dir": [0,1,0],"ref": [0,0,1],"view": [0,1,0],"viewLabel": "da davanti",
    "color": "#c9a45a","group": "upper","place": {"byMesh": "gear_K_worm","dir": [0,0,1]},
    "rotate": {"around": "axis_worm","deg": "latitude"},
    "parts": [
      {"shape": "cylinder","r": 3,"w": [-20,"300"],"n": 16}
    ]},
    {"id": "axis_a","name": "Asse a (chiave AR)","dir": [0,-1,0],"ref": [0,0,1],"view": [0,-1,0],"viewLabel": "da davanti","color": "#2fa39a","group": "fig2","variant": {"input": "spur"},"place": {"byMesh": "gear_Rp","dir": ["-sin(110*pi/180)",0,"cos(110*pi/180)"]},"parts": [
      {"shape": "cylinder","r": 4,"w": ["shift+uV-46","shift+uR+face+46"],"n": 20},
//       {"shape": "box","w": ["shift+uV-60","shift+uV-46"],"half": [5,5]},
//       {"shape": "box","w": ["shift+uR+face+46","shift+uR+face+60"],"half": [5,5]},
      {"shape": "cylinder","r": 3.5,"w": ["shift+uR-.4","shift+uR+face+.4"],"at": [".6*gears.gear_R.pr",0],"n": 16,"color": "marker"}
    ]},
    {"id": "axis_a","name": "Asse di R′","dir": ["d1x",0,"d1z"],"view": ["d1x",0,"d1z"],"viewLabel": "dall'esterno, guardando verso R","color": "#2fa39a","group": "fig2",
    "variant": {"input": "bevel"},"place": {"byApex": "gear_R"},
    "rotate": {"around": "axis_cQR","deg": -30},
    "parts": [
      {"shape": "cylinder","r": 4,"w": ["gears.gear_R.pr+3","lj-20"],"n": 20},
    ]},
    {"id": "axis_Q_AR_input","name": "Asta lunga","dir": ["d2x",0,"d2z"],"view": ["d2x",0,"d2z"],"viewLabel": "dall'estremità libera, guardando verso lo snodo","color": "#9aa4ae","group": "upper","variant": {"input": "bevel"},"place": {"offset": {"from": "axis_a","by": ["lj*d1x",0,"lj*d1z"]}},"parts": [
      {"shape": "cylinder","r": 4,"w": [20,"rodLen"],"n": 20},
    ]},

    {
      "id": "axis_XXp_upper",
      "name": "Asse superiore parallelo a K_a_a1 – portasatelliti superiore (solidale con A1_upper)",
      "dir": [0,1,0], "ref": [0,0,1], "view": [0,-1,0], "viewLabel": "da davanti", "color": "#c9a45a", "group": "upper",
      "place": { "byMesh": "gear_A_upper", "dir": [1,0,0] },
        "rotate": [{"around": "axis_K_a_a1","deg": "XXp_axis_rotation"}, {"around": "self","deg": "XXp_offset"}],
      "parts": [
        // {"shape": "cylinder", "r": 9, "w": ["50-5","58+2"], "at": ["-(gears.gear_b_upper.pr + gears.gear_B_upper.pr)",0], "n": 24, "color" : "#000000"}, /* buco portasatelliti, in toria in sync con YYp */
        {"shape": "cylinder", "r": 3.5, "w": ["150-2","158+2"], "at": [".8*gears.gear_A_upper.pr",0], "n": 16, "color": "#ffffff"}, /* marker di XXp_upper, su gear_A1 */
        {"shape": "box", "w": ["58","58+12"], "at": ["e",0], "half": [10,12], "color": "#6b7280"}, /* contrappeso dei satelliti */
        {"shape": "box", "w": ["-250","-240"], "at": [0,0], "half": [5,20], "color": "#ffffff"}, /* barra traversa */
        {"shape": "box", "w": ["-360","-250"], "at": [0,-18], "half": [5,2], "color": "#ffffff"}, /* asta lunga */
        {"shape": "box", "w": ["-300","-250"], "at": [0,18], "half": [5,2], "color": "#ffffff"} /* asta lunga */
      ]
    },

    {
      "id": "axis_Decli",
      "name": "Asse ruota declinazione",
      "dir": [1,0,0], "ref":  [0, "cos(initialDecli)", "sin(initialDecli)"], "view": [-1,0,0], "viewLabel": "da davanti", "color": "#aaaa44", "group": "declinazione",
      "carrier": "axis_XXp_upper",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_XXp_upper", "by": [0, -350, 0]}},
      "parts": [
        {"shape": "cylinder", "r": 3, "w": [-20,20], "n": 20},

      ]
    },

    {
      "id": "axis_Decli_pinion",
      "name": "Asse pignone declinazione",
      "dir": [-1,0,0], "ref": [0,1,0], "view": [1,0,0], "viewLabel": "da davanti", "color": "#aaaa44", "group": "declinazione",
      "carrier": "axis_XXp_upper",
      "place": {"offset": {"from": "axis_XXp_upper", "by": [0, -262, 0]}},
      "parts": [
        {"shape": "cylinder", "r": 1, "w": [-20,20], "n": 20}
      ]
    },




    {
      "id": "axis_YYp_upper",
      "name": "Asse satellite superiore",
      "dir": [0,1,0],
      "ref": [0,0,1],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#9aa4ae",
      "group": "upper",
      "carrier": "axis_A_idle_upper",
      "place": {
        "byMesh": "gear_b_upper",
        "dir": [0,0,-1]
      },
      "parts": [
        {"shape": "cylinder", "r": 3.5, "w": [0,110], "n": 20}, /* asse YY' superiore */
        {"shape": "cylinder", "r": 0.5, "w": [-1, 11], "at": [".6*gears.gear_b_upper.pr",0], "n": 16, "color": "#0000ff"}, /* marker satellite gear_b */
        {"shape": "cylinder", "r": 3.5, "w": ["100-.4","110+.4"], "at": [".6*gears.gear_c_upper.pr",0], "n": 16, "color": "#ff0000"}, /* marker satellite gear_c */
        {"shape": "box","w": ["20","22"],"half": [0.5,12], "color" : "#0000ff"}, /* marker */
        {"shape": "box","w": ["80","82"],"half": [0.5,12], "color" : "#0000ff"}, /* marker */
      ]
    },
    {
      "id": "axis_C_D_upper",
      "compare": ["axis_XXp_upper"],
      "name": "Tubo C_D upper libero",
      "place": {"coaxial": "axis_XXp_upper"},
      "dir": [0,1,0],
      "ref": [0,0,1],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#00ff00",
      "group": "upper",
      "parts": [
        {"shape": "cylinder", "r": 6.5, "w": [95,135], "n": 24, "color": "#000000"},  /* tubo portante di C */
        {"shape": "cylinder", "r": 3.5, "w": ["100-.4","110+.4"], "at": [".6*gears.gear_C_upper.pr",0], "n": 16, "color": "#0000ff"} /* marker di gear_C */
      ]
    },
    {
      "id": "axis_B_bevel_upper",
      "compare": ["axis_XXp_upper"],
      "name": "Tubo uscita da B_upper a B_bevel",
      "place": {"coaxial": "axis_XXp_upper"},
      "dir": [0,1,0],
      "ref": [0,0,1],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#ffffff",
      "group": "upper",
      "parts": [
        {"shape": "cylinder", "r": 6.5, "w": [-235,25], "n": 24},   /* tubo B-bevelB */
        {"shape": "cylinder", "r": 3.5, "w": ["0-.4","10+.4"], "at": [".6*gears.gear_B_upper.pr",0], "n": 16, "color": "marker"},   /* marker B */
        {"shape": "cylinder", "r": 3.5, "w": ["-235-.4","-225+.4"], "at": [".5*gears.gear_B_bevel_upper.pr",0], "n": 12, "color": "marker"}   /* marker bevel */
      ]
    },

    {
      "id": "axis_A_idle_upper",
      "name": "Tubo su cui A_upper è libero di girare (folle su XXp_upper)",
      "compare": ["axis_XXp_upper"],
      "place": {"coaxial": "axis_XXp_upper"},
      "dir": [0,1,0],
      "ref": [0,0,1],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#ffff00",
      "group": "upper",
      "parts": [
        {"shape": "cylinder", "r": 6.5, "w": [40,70], "n": 24},   /* tubo */
      ]
    },



    {"id": "axis_decli_tuning",
    "compare": ["axis_XXp_upper"],
    "name": "Asse di regolazione declinazione",
    "dir": [0,1,0],"ref": [0,0,1],"view": [0,1,0],"viewLabel": "da davanti","color": "#d98c3a",
    "group": "upper",
    "rest": "world",
    "rotate": [ {"around": "axis_XXp_upper","deg": "-XXp_offset"}],
    "place": {"byMesh": "gear_E_upper","dir": [0,0,1]},"parts": [
      {"shape": "cylinder","r": 3.5,"w": [-23,130],"n": 20},
      {"shape": "cylinder","r": 3.5,"w": ["110-.4","118+.4"],"at": [".6*gears.gear_E_upper.pr",0],"n": 16,"color": "marker"},
      {"shape": "cylinder","r": 3.5,"w": ["-55","-15"],"at": [".5*gears.gear_F_upper.pr",0],"n": 12,"color": "marker"}
    ]},

    {"id": "axis_decli_tuning_vert",
    "name": "Asse di uscita coppia conica di regolazione (verticale)",
    "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],
    "viewLabel": "dall'alto","color": "#d98c3a","group": "upper",
    "rest": "carrier",
    "place": {"byApex": "gear_F_upper"},
    "forceDir": [0,0,-1],
    "rotate": {"around": "axis_decli_tuning","deg": "XXp_axis_rotation-90"},
    "parts": [
      {"shape": "cylinder","r": 3.5,"w": ["gears.gear_G_upper.pr+3","gears.gear_G_upper.pr+60 + vlen"],"n": 20},
      {"shape": "cylinder","r": 3.5,"w": ["gears.gear_G_upper.pr+23","gears.gear_G_upper.pr"],"at": [".5*gears.gear_G_upper.pr",0],"n": 16,"color": "#0000ff"},
      {"shape": "cylinder","r": 3.5,"w": ["gears.gear_U2.pr + vlen + 35 ","gears.gear_U2.pr  + vlen + 47 "],"at": [".5*gears.gear_U2.pr",0],"n": 16,"color": "#000000"}
    ]},



    {
      "id": "axis_forcella",
      "name": "Asse perpendicolare ad axis_Decli nell'intersezione con XXp_upper",
      "dir": [0,0,1],
      "ref": [1,0,0],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#66ccaa",
      "group": "declinazione",
      "carrier": "axis_Decli",
      "rest": "carrier",
      "spinPerpTo": {"axis": "axis_barilotto_right", "line": "axis_coda_specchio"},
      "place": {"coaxial": "axis_Decli"},
      "parts": [
        {"shape": "cylinder", "r": 2, "w": ["-fork_length+50", 0], "n": 16},
         {"shape": "box", "w": ["-fork_length+50","-fork_length-20"], "at": [20,0], "half": [5,10], "color": "#ff0000"},
         {"shape": "box", "w": ["-fork_length+50","-fork_length-20"], "at": [-20,0], "half": [5,10], "color": "#ff0000"},
         {"shape": "box", "w": ["-fork_length+50","-fork_length+40"], "at": [0,0], "half": [15,10], "color": "#ff0000"},

      ]
    },


    {
      "id": "axis_barilotto_left",
      "name": "Asse barilotto",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,0,1], "viewLabel": "laterale", "color": "#444444", "group": "declinazione",
      "carrier": "axis_forcella",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_forcella", "by": [0, 0, "-fork_length"]}},
      /*"rotate": {"around": "axis_Decli","deg": "initialDecliDeg"},*/
      "parts": [
        {"shape": "cylinder", "r": 2, "w": [-20,-10], "n": 24, "color": "#ff8800"}
      ]
    },
    {
      "id": "axis_barilotto_right",
      "name": "Asse barilotto",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,0,1], "viewLabel": "laterale", "color": "#444444", "group": "declinazione",
      "carrier": "axis_forcella",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_forcella", "by": [0, 0, "-fork_length"]}},
      /*"rotate": {"around": "axis_Decli","deg": "initialDecliDeg"},*/
      "parts": [
        {"shape": "cylinder", "r": 2, "w": [20,10], "n": 24, "color": "#ff8800"}
      ]
    },




    /* ===== SPECCHIO, passo 1: tubo (per ora fermo rispetto al barilotto) e coda ===== */
    {"id": "axis_tubo","name": "Tubo guida della coda: coassiale alla coda, origine in B", "alignWith" : "axis_coda_specchio",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,1,0],"viewLabel": "frontale tubo","color": "#8888ff","group": "declinazione",
     "carrier": "axis_barilotto_right","rest": "carrier",
     "place": {"coaxial": "axis_barilotto_right"},
     "parts": [
       /*{"shape": "cylinder","r": 10,"w": [-20,20],"n": 24},*/
       {"shape": "box", "w": ["-30","30"], "at": [0,0], "half": [-10,5], "color": "#4444ff"}
     ]},


    /* La coda è una retta: ogni frame passa per l'origine di axis_tubo e per il centro fisso dello specchio. */
{"id": "axis_coda_specchio",
 "name": "Coda dello specchio: origine nel punto fisso, passa sempre per axis_tubo (ci scorre dentro)",
 "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#ff0000","group": "declinazione",
 "place": {"at": [0,0,0]},
 "through": [["axes.axis_Decli.ox+fork_length","axes.axis_Decli.oy","axes.axis_Decli.oz"], "axis_tubo"],
 "refFrom": "axis_vert",
      "parts": [
       {"shape": "cylinder","r": 2.5,"w": [0,"len_coda_specchio"],"n": 16},
{"shape": "box", "w": ["-5","-2"], "at": [0,0], "half": ["-largh_specchio/2","largh_specchio/2 - 10"], "color": "#4444ff"}
     ]},

    {"id": "axis_direzione_riflesso",
     "name": "asse di appoggio per direzione riflesso",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#000000","group": "",
     "place": {"at": [0,0,0]},
     "through": [["axes.axis_Decli.ox","axes.axis_Decli.oy","axes.axis_Decli.oz"], "axis_mirror_center"],
     "refFrom": "axis_vert",
      "parts": [
      /* {"shape": "cylinder","r": 2.5,"w": [0,"len_coda_specchio"],"n": 16},*/ /* solo di supporto allo script per costruire raggio riflesso) */
     ]},

    /* Centro fisso dello specchio nel mondo: X=axis_Decli.ox+fork_length, Y=axis_Decli.oy, Z=axis_Decli.oz. */
    {"id": "axis_mirror_center","name": "Asse orizzontale dello specchio, perpendicolare e solidale alla coda",
     "dir": [1,0,0],"ref": [0,0,1],"view": [0,1,0],"viewLabel": "dall'alto","color": "#d4262e","group": "declinazione",
     "perpendicularTo": {"line": "axis_coda_specchio", "reference": "axis_vert_tubo", "refFrom": "axis_coda_specchio"},
     "carrier": "axis_vert",
     "place": {"at": ["axes.axis_Decli.ox+fork_length","axes.axis_Decli.oy","axes.axis_Decli.oz"]},
     "parts": [
       /*{"shape": "cylinder","r": 3,"w": [-116,116],"n": 16,"color": "marker"},*/
       {"shape": "box", "w": ["-largh_specchio/2","largh_specchio/2"], "at": [0,0], "half": ["-spess_specchio/2","spess_specchio/2"], "color": "#aaaaff"}, // ortogonale
     ]},

    {"id": "axis_vert","name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#00ff00","group": "declinazione",
     "place": {"at": ["axes.axis_Decli.ox + fork_length","axes.axis_Decli.oy","groundRefZ"]},
     "carrier": "axis_vert_tubo",
"spinAlignTo": {
  "target": "axis_mirror_center",
  "sourceVector": "yv",
  "targetVector": "dir",
  "mode": "parallel"
},
     "parts": [
       {"shape": "cylinder","r": 20,"w": [0,"axes.axis_Decli.oz - (largh_specchio/2 + 10) - groundRefZ"],"n": 16},
         {"shape": "box", "w": ["axes.axis_Decli.oz- (largh_specchio/2 + 5) - groundRefZ","axes.axis_Decli.oz + (largh_specchio/2) - groundRefZ"], "at": [0,"largh_specchio/2"], "half": [10,5], "color": "#00ff00"}, // fork1
         {"shape": "box", "w": ["axes.axis_Decli.oz- (largh_specchio/2 + 5) - groundRefZ","axes.axis_Decli.oz + (largh_specchio/2) - groundRefZ"], "at": [0,"-largh_specchio/2"], "half": [10,5], "color": "#00ff00"}, // fork2
         {"shape": "box", "w": ["axes.axis_Decli.oz- (largh_specchio/2 + 10) - groundRefZ","axes.axis_Decli.oz- (largh_specchio/2 + 5) - groundRefZ"], "at": [0,0], "half": [10,"-largh_specchio/2 - 5"], "color": "#ffff00"}, // ortogonale

     ]},
    {"id": "axis_vert_tubo","name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#0000ff","group": "declinazione",
     "place": {"at": ["axes.axis_Decli.ox + fork_length","axes.axis_Decli.oy","groundRefZ"]},
     "parts": [
       {"shape": "cylinder","r": 25,"w": [0,20],"n": 16},

     ]},

{
  "id": "axis_U_decli_horiz",
  "name": "Asse U – prolungamento orizzontale in cima a axis_decli_tuning_vert",
  "dir": [1,0,0], "ref": [0,0,1], "view": [0,1,0], "viewLabel": "da davanti",
  "color": "#d98c3a", "group": "upper",
  "place": {"at": ["axes.axis_decli_tuning_vert.ox",
                   "axes.axis_decli_tuning_vert.oy",
                   "axes.axis_decli_tuning_vert.oz - U2_apexW"]},
"parts": [
  {"shape": "cylinder", "r": 3.5, "w": [3, "ljU-20"], "n": 20},
  {"shape": "cylinder", "r": 3.5, "w": [10, 24.4], "at": [".5*gears.gear_U3.pr", 0], "n": 12, "color": "marker"}
]
},

{
  "id": "axis_U_asta_manuale",
  "name": "Asta lunga U (dal giunto verso terra)",
  "dir": ["dU2x", 0, "dU2z"],
  "view": ["dU2x", 0, "dU2z"],
  "viewLabel": "dall'estremità libera, guardando verso lo snodo",
  "color": "#9aa4ae",
  "group": "upper",
  "place": {"at": [
  "axes.axis_U_decli_horiz.ox + ljU*axes.axis_U_decli_horiz.dx",
  "axes.axis_U_decli_horiz.oy + ljU*axes.axis_U_decli_horiz.dy",
  "axes.axis_U_decli_horiz.oz + ljU*axes.axis_U_decli_horiz.dz"
]},
  "parts": [
//     {"shape": "box", "w": [14, 20], "half": [11, 11]},
//     {"shape": "box", "w": [-5, 14], "at": [0,  14.5], "half": [7, 2.5]},
//     {"shape": "box", "w": [-5, 14], "at": [0, -14.5], "half": [7, 2.5]},
//     {"shape": "box", "w": ["rodLenU", "rodLenU+14"], "half": [6, 6]},
    {"shape": "cylinder", "r": 3.5, "w": [20, "rodLenU"], "n": 20},
  ]
}

  ],
  "gears": [
    {"id": "gear_B","name": "Tamburo","axis": "axis_1B","type": "cylinder","r": "drumR","w": ["yW1+.5","yA0+1"],"n": 64},
    {"id": "gear_W","name": "Ruota di carica","axis": "axis_1B","teeth": 60,"module": "module","w": ["yW0","yW1"],"note": "assunta"},
    {"id": "gear_A","name": "Ruota del tamburo","axis": "axis_1A","teeth": 150,"module": "module","w": ["yA0","yA1"]},
    {"id": "gear_b","name": "Pignone di carica","axis": "axis_b","teeth": 18,"module": "module","w": ["yW0","yW1"],"meshWith": "gear_W","note": "assunto"},
    {"id": "gear_C","name": "Pignone","axis": "axis_2CD","teeth": 25,"module": "module","w": ["yA0","yA1"],"meshWith": "gear_A"},
    {"id": "gear_D","name": "Ruota","axis": "axis_2CD","teeth": 156,"module": "module","w": ["yD0","yD1"],"note": "Uscita oraria inferio nel testo"},
    {"id": "gear_E","name": "Pignone","axis": "axis_3EF","teeth": 26,"module": "module","w": ["yD0","yD1"],"meshWith": "gear_D"},
    {"id": "gear_F","name": "Ruota conica","axis": "axis_3EF","type": "bevel","teeth": 200,"module": "module","apexW": "yApex","side": 1,"plate": {"k": 0.88,"from": -0.4,"to": 4,"n": 64},"note": "in presa con G"},
    {"id": "gear_M","name": "Uscita differenziale inferiore","axis": "axis_3EF","teeth": 25,"module": "module","w": ["yM0","yM1"],"note": "in presa con N"},
    {"id": "gear_G","name": "Pignone conico","axis": "axis_3GH","type": "bevel","teeth": 50,"module": "module","apexW": 0,"side": 1,"plate": {"k": 0.85,"from": -1,"to": 4,"n": 32},"meshWith": "gear_F","note": "in presa con F"},
    {"id": "gear_H","name": "Ruota","axis": "axis_3GH","teeth": 170,"module": "module","w": ["zH0","zH1"]},
    {"id": "gear_J","name": "Pignone","axis": "axis_5JK","teeth": 34,"module": "module","w": ["zH0","zH1"],"meshWith": "gear_H"},
    {"id": "gear_K","name": "Ruota","axis": "axis_5JK","teeth": 234,"module": "module","w": ["zK0","zK1"]},
    {"id": "gear_L","name": "Pignone del regolatore ad alette","axis": "axis_6L","teeth": 65,"module": "module","w": ["zK0","zK1"],"meshWith": "gear_K"},

{"id": "gear_Q","name": "Pianeta di ingresso AR","axis": "axis_cQR","teeth": 31,"module": "module","w": ["shift+uQ","shift+uQ+face"]},

{"id": "gear_P","name": "Satellite grande di ingresso AR","axis": "axis_YYp","teeth": 62,"module": "module","w": ["shift+uQ","shift+uQ+face"],"meshWith": "gear_Q"},

{"id": "gear_N","name": "Ruota portasatelliti","axis": "axis_XXp_idle","teeth": 204,"module": "module","w": ["shift+uN","shift+uN+faceN"],"meshWith": "gear_M"},

{"id": "gear_O","name": "Satellite piccolo di uscita AR","axis": "axis_YYp","teeth": 16,"module": "mOS","w": ["shift+uS","shift+uS+face"],"meshWith": "gear_S"},

{"id": "gear_S","name": "Pianeta di uscita AR","axis": "axis_XXp","teeth": 80,"module": "mOS","w": ["shift+uS","shift+uS+face"]},

{"id": "gear_V","name": "Ruota conica di uscita AR","axis": "axis_XXp","type": "bevel","teeth": 66,"module": "module","apexW": "shift+uV+face-gears.gear_V.pr-bExt","side": 1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48}},

    {"id": "gear_V2","name": "Ruota conica in basso","axis": "axis_vs","type": "bevel","teeth": 66,"module": "module","apexW": 0,"side": 1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},"meshWith": "gear_V","note": "dati assunti"},
    {"id": "gear_V3","name": "Ruota conica in alto","axis": "axis_vs","type": "bevel","teeth": 40,"module": "module","apexW": "vlen","side": -1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},"note": "dati assunti"},
    {"id": "gear_V4","name": "Ruota conica per worm","axis": "axis_worm","type": "bevel","teeth": 40,"module": "module","apexW": 0,"side": 1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},"meshWith": "gear_V3","note": "dati assunti"},
    {"id": "gear_Worm","label": "worm","name": "Vite senza fine (1 principio, passo destro)","axis": "axis_worm","type": "worm","module": "module","q": 12,"starts": 1,"hand": 1,"w": ["hlen-50","hlen-10"],"note": "dati assunti"},
    {"id": "gear_K_worm","label": "gear di worm","name": "Ruota della vite","axis": "axis_K_a_a1","type": "wormwheel","teeth": 36,"module": "module","meshWith": "gear_Worm","note": "dati assunti"},

    {"id": "gear_R","label": "R","name": "Input AR spur 1","axis": "axis_cQR","teeth": "zR","module": "mR","w": ["shift+uR","shift+uR+face"],"variant": {"input": "spur"}},
    {"id": "gear_Rp","label": "R′","name": "Input AR spur 2","axis": "axis_a","teeth": "zR","module": "mR","w": ["shift+uR","shift+uR+face"],"meshWith": "gear_R","variant": {"input": "spur"}},
    {"id": "gear_R","label": "R","name": "Input AR bevel 1","axis": "axis_cQR","type": "bevel","teeth": "zR","module": "mR","apexW": "shift+uR+gears.gear_R.pr","side": -1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},"variant": {"input": "bevel"}},
    {"id": "gear_Rp","label": "R′","name": "Input AR bevel 2","axis": "axis_a","type": "bevel","teeth": "zR","module": "mR","apexW": 0,"side": 1,"plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},"meshWith": "gear_R","variant": {"input": "bevel"}},

    {"id": "gear_a","name": "Pignone a su worm (20 denti)","axis": "axis_K_a_a1","teeth": 20,"module": "module","w": [50,58]},
    {"id": "gear_a1","name": "Pignone a1 su worm (18 denti)","axis": "axis_K_a_a1","teeth": 18,"module": "module","w": [150,158]},

    {"id": "gear_A_upper",
        "name": "Ruota A_upper – FOLLE su XXp_upper, prende moto da gear_a (20/200)",
      "axis": "axis_A_idle_upper",
      "teeth": 200,
      "module": "module","w": [50,58],"meshWith": "gear_a"
    },

    {"id": "gear_A1_upper",
    "name": "Ruota A1_upper – SOLIDALE con XXp_upper, prende moto da gear_a1 (18/200)",
    "axis": "axis_XXp_upper","teeth": 200,"module": "module","w": [150,158],
    "meshWith": "gear_a1"},

    {"id": "gear_b_upper","name": "Satellite b 8 denti - SINISTRA","axis": "axis_YYp_upper","teeth": 8,"module": 1,"w": [0,10],"meshWith": "gear_B_upper"},
    {"id": "gear_B_upper","name": "Pianeta B 40 denti - SINISTRA","axis": "axis_B_bevel_upper","teeth": 40,"module": 1,"w": [0,10]},
    {"id": "gear_B_bevel_upper","name": "Conica B_bevel -100mm da B in X+","axis": "axis_B_bevel_upper","type": "bevel","teeth": 66,"module": 1,"apexW": "-295+gears.gear_B_bevel_upper.pr","side": 1,"plate": {"k": 0.85,"from": 3,"to": 0,"n": 48},"meshWith": "gear_U_bevel_decli"},
    {"id": "gear_c_upper","name": "Satellite c 32 denti - DESTRA","axis": "axis_YYp_upper","teeth": 32,"module": 1,"w": [100,110],"meshWith": "gear_C_upper"},
    {"id": "gear_C_upper","name": "Pianeta C 16 denti - DESTRA","axis": "axis_C_D_upper","teeth": 16,"module": 1,"w": [100,110]},

    {"id": "gear_D_upper","label": "D_upper","name": "D_upper solidale a C_upper (ingresso declinazione)",
     "axis": "axis_C_D_upper","teeth": 160,"module": 1,"w": [117,123]},

    {"id": "gear_U_bevel_decli","name": "Conica gemella B_bevel (pignone di declinazione)","axis": "axis_Decli_pinion","type": "bevel","teeth": 66,"module": 1,"apexW": "0",
    "side": -1,"plate": {"k": 0.85, "from": 3, "to": 0, "n": 48}},

    {"id": "gear_I_pinion_decli","name": "Pignone declinazione (16 denti)","axis": "axis_Decli_pinion","teeth": 16,"module": 1,"w": [-15,15]},

    {"id": "gear_H__decli","name": "Semiruota di declinazione (160 denti)","axis": "axis_Decli","teeth": 160,"module": 1,"w": [-15,-10],"meshWith": "gear_I_pinion_decli",
     "degStart": -95, "degEnd": 120 }
     ,

    {"id": "gear_E_upper","label": "gear_E_upper","name": "Ruota di regolazione declinazione (80 denti)","axis": "axis_decli_tuning","teeth": 60,"module": 1,"w": [115,125],
    "meshWith": "gear_D_upper"},


    {
      "id": "gear_F_upper","name": "Conico di regolazione (40 denti) su decli_tuning",
      "axis": "axis_decli_tuning",
      "type": "bevel","teeth": 40,"module": 1,"apexW": "-15+gears.gear_F_upper.pr","side": -1,
      "plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48},
      "meshWith": "gear_G_upper"
    },


    {
    "id": "gear_G_upper",
    "name": "Conico di uscita (40 denti)",
    "axis": "axis_decli_tuning_vert",
    "type": "bevel",
    "teeth": 40,"module": 1,"apexW": 0,"side": 1,
    "plate": {"k": 0.85,"from": -0.4,"to": 4,"n": 48}
    },

{
  "id": "gear_U2",
  "label": "U2",
  "name": "Conica di rinvio in cima a axis_decli_tuning_vert (40 denti)",
  "axis": "axis_decli_tuning_vert",
  "type": "bevel",
  "teeth": 40, "module": 1,
  "apexW": "U2_apexW",
  "side": -1,
  "plate": {"k": 0.85, "from": -0.4, "to": 4, "n": 48},
  "meshWith": "gear_U3"
},
{
  "id": "gear_U3",
  "label": "U3",
  "name": "Conica gemella su axis_U_decli_horiz (30 denti)",
  "axis": "axis_U_decli_horiz",
  "type": "bevel",
  "teeth": 40, "module": 1,
  "apexW": 0,
  "side": 1,
  "plate": {"k": 0.85, "from": -0.4, "to": 4, "n": 48}
},

  ],
  "links": [
    {"type": "ratchet","driver": "axis_1B","driven": "axis_1A","sign": 1,"messages": {"drives": "Il tamburo trascina A tramite il nottolino: si muove tutta la catena, M e N compresi.","winding": "Caricamento: gira solo il tamburo B (la fune si avvolge). Il nottolino scatta e il resto della catena resta fermo.","freewheel": "Il nottolino scorre a vuoto: il tamburo B resta fermo mentre la catena gira.","blocks": "Verso opposto: il nottolino blocca e A trascina il tamburo (la fune si avvolge)."}},
    {"type": "brake","axis": "axis_3EF","group": "fig2","label": "Freno u inserito (blocca l'asse 3: ferma E, M, N e la catena)","shoe": {"at": ["axes.axis_3EF.ox","-(shift+uN-26)",-15],"size": [16,24,6],"released": [0,0,-6]},"message": "Freno u inserito: asse 3, M e N bloccati."},
    {"type": "rope","axis": "axis_1B","at": ["drumR+2.05","(yW1+yA0)/2",0],"radius": "drumR","len0": 90,"min": 30,"max": 500},
    {"type": "hooke",
      "input": "axis_a",
      "output": "axis_Q_AR_input","group": "fig2",
      "variant": {"input": "bevel"},
      "arm": {"r": 2.3,"len": 13},
      "message": "Snodo S ({beta|0}°): l'asta gira regolare, R′ no; la sua velocità oscilla tra {lo|3}× e {hi|3}× quella dell'asta, due volte per giro.",
      "axis1side" : 2,
      "axis2side" : 1,
      "axis1rotate" : true,
      "leaderAxis" : 1
    },
    {"type": "brake","axis": "axis_decli_tuning_vert","group": "upper","label": "Freno sull'asse axis_decli_tuning_vert (blocca G_upper, F_upper e la catena collegata)","shoe": {"at": ["axes.axis_decli_tuning_vert.ox+3.5+4","axes.axis_decli_tuning_vert.oy","axes.axis_decli_tuning_vert.oz+50"],"size": [8,16,24],"released": [10,0,0]},"message": "Freno su axis_decli_tuning_vert inserito: asse bloccato."},
{"type": "hooke", "input": "axis_U_decli_horiz", "output": "axis_U_asta_manuale", "group": "upper",
 "arm": {"r": 2.3, "len": 13},
 "axis1side": 2,
 "axis2side": 1,
 "axis1Rotate": false,
 "message": "Snodo di input da asta manuale di regolazione declinazione"}
  ],
  "inputs": [
    {"id": "key","label": "Chiave AR (asse a)","axis": "axis_a","variant": {"input": "spur"},"hint": "A chiave rilasciata il suo peso tiene fermo l'asse c."},
    {"id": "key","label": "Chiave AR (asta lunga)","axis": "axis_Q_AR_input","variant": {"input": "bevel"},"hint": "Asta manuale per variazione Ascensione Retta"}
  ],
  "groups": [
{"id": "fig2","label": "Mostra la parte Fig. 2","visible": true},
{"id": "upper","label": "siderostato","visible": true}
  ],
  "views": [
    {"id": "all","label": "Insieme","auto": true,"alpha": "pi/2-0.7","beta": 1.1,"scale": 1.1},
    {"id": "front","label": "Fig. 1 (da davanti)","target": [100,60,60],"alpha": "pi/2","beta": "pi/2","radius": 900},
    {"id": "side","label": "Fig. 2 (da sinistra)","target": ["axes.axis_3EF.ox","-(shift+110)",100],"alpha": "pi","beta": "pi/2","radius": 760}
  ],
  "checks": [
    {"type": "axisClearsGear","axis": "axis_a","shaftR": 4,"gear": "gear_N","min": 2,"variant": {"input": "spur"},"text": "Asse a a {dist|1} mm dall'asse principale ({zR|0} denti × modulo {mR|1}). ","ok": "Libero da N (gioco {gap|1} mm).","bad": "Interferisce con N: mancano {miss|1} mm. Aumenta denti o modulo."},
    {"type": "info","variant": {"input": "bevel"},"text": "Coppia conica: R e R′ da {zR|0} denti, modulo {mR|1} (Ø {gears.gear_R.d|1} mm), assi a 90° con apice sull'asse principale. Sta davanti a N e l'asta parte da lì: nessuna interferenza. Snodo S di {bend*180/pi|0}°."}
  ],
/*  "differential": {"out": "axis_btSV","ins": ["axis_XXp","axis_cQR"],"text": "Fig. 2: w_S = {a|3} · w_N + {b|3} · w_c."},*/
  "ratios": [{"from": "axis_1A","to": "axis_6L","text": "Un giro di A fa {r|1} giri di L."}],
  "notes": ["Ø primitivo = denti × modulo ({module|1} mm). P–Q e M–N a modulo {module|1}, O–S a modulo {mOS|5}: i satelliti hanno un solo asse, a {e|1} mm da Q e da S.","La bussola di N è resa come manicotto. Dati assunti: ruota di carica, pignone b, denti di V2, V3, V4; regolatore e fune semplificati."]
};