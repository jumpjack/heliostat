/*
  Campi nuovi/rilevanti per la cinematica:
   • asse  "rest": "carrier"  → se nessun altro vincolo ne determina la velocità, l'asse non gira rispetto al suo carrier
                                (senza questo campo, un asse non vincolato resta fermo rispetto al mondo, come prima).
   • meshWith può essere una stringa oppure {id:"..."}; basta dichiarare la coppia una sola volta (i doppioni sono ignorati).
   • Velocità: ogni asse ha una velocità w = componente, lungo il proprio asse, della velocità angolare assoluta.
     La velocità relativa al carrier è calcolata correttamente anche quando l'asse è perpendicolare al carrier.
*/
var MACHINE = {
  "title": "Eliostato 'primo modello'",
  "show": [

  ],
  "variants": {
    "mirror_drive": {
      "label": "Coda secondaria",
      "active": "originale",
      "options": {
        "originale": "Originale (coda oltre la forcella, solo giorno)",
        "alternativa": "Alternativa (Coda prima della forcella (=h24))",
        "alternativa2": "Seconda Alternativa (Barilotto con buco quadrato su coda quadrata (=h24))",
      }
    }
  },
  "controls": [
    {"id": "fork_length","label": "Lunghezza forcella guida","step": 1,"ranges": {"all": {"min": 0,"max": 350,"value": 200}}},
    {"id": "latitude","label": "Latitudine strumento (°)","step": 1,"ranges": {"all": {"min": -90,"max": 90,"value": 42}}},
    {"id": "latitudePlanet","label": "Latitudine assoluta pianeta (°)","step": 1,"ranges": {"all": {"min": -90,"max": 90,"value": 42}}},
    {"id": "rotazione","label": "Rotazione (°)","step": 1,"ranges": {"all": {"min": 0,"max": 360,"value": 0}}},
    {"id": "mainAxisAlt","label": "Altezza da terra","step": 1,"ranges": {"all": {"min": 0,"max": 800,"value": 300}}},
    {"id": "declination","label": "Declinazione","step": 1,"ranges": {"all": {"min": -24,"max": 24,"value": 0}}},
    {"id": "azimuth","label": "Azimuth del bersaglio(°)","step": 1,"ranges": {"all": {"min": -90,"max": 90,"value": 0}}},
    {"id": "altitude","label": "Altezza del bersaglio (°)","step": 1,"ranges": {"all": {"min": 0,"max": 90,"value": 0}}},
    
  ],
  "consts": {
        "initialDecli" : 0,
        "fork_length" : 180,
        "groundRefZ" : -200,
        "len_coda_specchio" : 280,
        "largh_specchio" : 120,
        "alt_specchio" : 240,
        "spess_specchio" : 5,
        "module" : 1,
        "mainAxisLength" : 250,
        "mainAxisAlt" : 300,
        "mainAxisOffset" : 0,
        "azimuth" : 30,
        "azimuthBasementHeight" : 20,
        "azimuthBarHeight" : 5,
        "azimuthAxisLength" : 80,
        "altezza_forcella_specchio" : 210,
        "offset_specchio" : -50,
        "lunghezza_coda_secondaria" : 650,
        "rotazione" : 0,
        "latitudePlanet": 42,

  },
  "axes": [



    {
      "id": "axis_X",
      "name": "Asse X mondo",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,-1,0], "viewLabel": "da davanti",
      "place": { "at" : [0,0,0 ] },
      "color": "#ff0000",
      "parts": [
        {"shape": "cylinder", "r":2, "w": ["-100","100"], "at": [0,0], "n": 16},

      ]
    },


    {
      "id": "axis_North_South",
      "name": "Asse polare pianeta",
      "dir": [0,1,0], "ref": [0,0,1], "view": [0,-1,0], "viewLabel": "da davanti", "color": "#c9a45a",
      "place": { "at" : [0,0,0 ] },
      "color": "#ffffff",
        "rotate": [{"around": "axis_X","deg": "latitudePlanet"}],
      "parts": [
        {"shape": "cylinder", "r": 10, "w": ["-300","300"], "at": [0,0], "n": 16},

      ]
    },



    {"id": "axis_system",
     "name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta",
     "color": "#000000",
     "place": {"at": [0,0,0]},
         "parts": [
           /* {"shape": "cylinder","r": 20,"w": [0,200],"n": 16},*/
    ]},




    {
      "id": "axis_Latitude",
      "name": "Asse per rotazione secondo latitudine",
      "dir": [1,0,0], "ref":  [0, 0, 100], "view": [1,0,0],
      "color": "#555555",
      "group": "",

      "place": {"at": [0, "-mainAxisOffset","mainAxisAlt+200"]},
      "parts": [
        /*{"shape": "cylinder", "r": 3, "w": [-200,200], "n": 20},*/

      ]
    },

    {
      "id": "axis_XXp_drum",
      "name": "Asse orario",
      "dir": [0,1,0], "ref": [0,0,1], "view": [0,-1,0], "viewLabel": "da davanti", "color": "#c9a45a", "group": "",
      "place": { "at" : [0,"-mainAxisOffset","mainAxisAlt" ] },
        "rotate": [{"around": "axis_Latitude","deg": "-latitude"},{"around": "axis_system","deg": "rotazione"}],
      "parts": [
        {"shape": "cylinder", "r": 70, "w": ["0","mainAxisLength/2"], "at": [0,0], "n": 64, "color": "#aaaaff"},
        {"shape": "cylinder", "r": 15, "w": ["0","mainAxisLength-10"], "at": [0,0], "n": 16, "color": "#aaaaff"}, // tubos upporto disco di lettura AR
        {"shape": "cylinder", "r": 35, "w": ["mainAxisLength-10","mainAxisLength-5"], "at": [0,0], "n": 16, "color": "#aaaaff"}, // disco di lettura AR
      ]
    },

    {
      "id": "axis_XXp",
      "name": "Asse orario",
      "dir": [0,1,0], "ref": [0,0,1], "view": [0,-1,0], "viewLabel": "da davanti", "color": "#c9a45a", "group": "",
      "place": { "at" : [0,"-mainAxisOffset","mainAxisAlt" ] },
      "color": "#ff0000",
        "rotate": [{"around": "axis_Latitude","deg": "-latitude"},{"around": "axis_system","deg": "rotazione"}],
      "parts": [
        {"shape": "cylinder", "r": 3.5, "w": ["0","mainAxisLength"], "at": [0,0], "n": 16},
        {"shape": "box", "w": ["mainAxisLength", "mainAxisLength+120"], "at": [0,20], "half": [10,5]},
        {"shape": "box", "w": ["mainAxisLength", "mainAxisLength+5"], "at": [0,0], "half": [10,15]},
      ]
    },

    {
      "id": "axis_Decli",
      "name": "Asse ruota declinazione",
      "dir": [-1,0,0],
      "ref":  [0, "cos(initialDecli*3.14/180)", "sin(initialDecli*3.14/180)"],
      "view": [-1,0,0],
      "viewLabel": "da davanti", 
      "rotate": [{"around": "self","deg": "declination"}],
      "color": "#aaaa44",
      "group": "",
      "carrier": "axis_XXp",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_XXp", "by": [0, 350, 0]}},
      "parts": [
        {"shape": "cylinder", "r": 3, "w": [-20,20], "n": 20},

      ]
    },



    {
      "id": "axis_forcella",
      "name": "Asse perpendicolare ad axis_Decli nell'intersezione con XXp_upper",
      "dir": [0,0,1],
      "ref": [1,0,0],
      "view": [0,1,0],
      "viewLabel": "da davanti",
      "color": "#66ccaa",
      "group": "",
      "carrier": "axis_Decli",

      "rest": "carrier",
      "spinPerpTo": {"axis": "axis_perno_barilotto_guida", "line": "axis_coda_specchio"},
      "place": {"coaxial": "axis_Decli"},
      "parts": [
        {"shape": "cylinder", "r": 2, "w": ["-fork_length+50", "2*fork_length+30"], "n": 16,  "variant": {"mirror_drive": "originale"}},
        {"shape": "cylinder", "r": 2, "w": ["-fork_length+50", "fork_length"], "n": 16,  "variant": {"mirror_drive": "alternativa"}},
        {"shape": "cylinder", "r": 2, "w": ["-fork_length+50", "0"], "n": 16,  "variant": {"mirror_drive": "alternativa2"}},
         {"shape": "box", "w": ["-fork_length+50","-fork_length-20"], "at": [20,0], "half": [5,10], "color": "#ff0000"},
         {"shape": "box", "w": ["-fork_length+50","-fork_length-20"], "at": [-20,0], "half": [5,10], "color": "#ff0000"},
         {"shape": "box", "w": ["-fork_length+50","-fork_length+40"], "at": [0,0], "half": [15,10], "color": "#ff0000"},

      ]
    },


    {
      "id": "axis_perno_barilotto_guida",
      "name": "Asse barilotto",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,0,1], "viewLabel": "laterale", "color": "#444444", "group": "",
      "carrier": "axis_forcella",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_forcella", "by": [0, 0, "-fork_length"]}},
      /*"rotate": {"around": "axis_Decli","deg": "initialDecliDeg"},*/
      "parts": [
        {"shape": "cylinder", "r": 2, "w": [20,10], "n": 24, "color": "#ff8800"}
      ]
    },




    {"id": "axis_barilotto_forcella_driver","name": "Tubo guida della coda: coassiale alla coda, origine in B", "alignWith" : "axis_coda_specchio",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,1,0],"viewLabel": "frontale tubo",
     "color": "#0000ff",
     "group": "",
     "carrier": "axis_perno_barilotto_guida",
     "rest": "carrier",
     "place": {"coaxial": "axis_perno_barilotto_guida"},
     "parts": [
       {"shape": "cylinder","r": 10,"w": [-20,20],"n": 24, "variant": {"mirror_drive": "originale"}},
       {"shape": "cylinder","r": 10,"w": [-20,20],"n": 24, "variant": {"mirror_drive": "alternativa"}},
       {"shape": "box", "w": ["-30","30"], "at": [0,0], "half": [-10,20], "variant": {"mirror_drive": "alternativa2"}}
     ]},


     
//       "spinAlignTo": {
//         "target": "axis_mirror_center",
//         "sourceVector": "yv",
//         "targetVector": "dir",
//         "mode": "parallel"
//       },


    {"id": "axis_direzione_riflesso",
     "name": "asse di appoggio per direzione riflesso",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#000000","group": "",
     "place": {"at": [0,0,0]},
     "through": [["axes.axis_Decli.ox","axes.axis_Decli.oy","axes.axis_Decli.oz"], "axis_mirror_center"],
     "refFrom": "axis_vert",
      "parts": [
      /* {"shape": "cylinder","r": 2.5,"w": [0,"len_coda_specchio"],"n": 16},*/ /* solo di supporto allo script per costruire raggio riflesso) */
     ]},


    {"id": "axis_coda_specchio", /* verde */
     "name": "Coda dello specchio: origine nel punto fisso, passa sempre per axis_barilotto_forcella_driver (ci scorre dentro)",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#33ff33",
     "group": "group_supporto",
     "place": {"at": [0,0,0]},
     "through": [
                    "axis_mirror_center",
                    "axis_barilotto_forcella_driver"
                    ],
     "refFrom": "axis_vert",
          "parts": [
           {"shape": "cylinder","r": 5,"w": [0,"len_coda_specchio"],"n": 16,"variant": {"mirror_drive": "originale"}}, // coda
           {"shape": "cylinder","r": "largh_specchio/3","w": ["-23","10"],"n": 16}, // supporto specchio su assi
     ]},




    {"id": "axis_mirror_center","name": "Asse orizzontale dello specchio, perpendicolare e solidale alla coda",
     "dir": [1,0,0],"ref": [0,0,1],"view": [0,1,0],"viewLabel": "dall'alto",
     "color": "#ff0000",
     "group": "",
     "rotate" : [{"around": "axis_system","deg": "rotazione"}],
     "perpendicularTo": {"line": "axis_coda_specchio", "reference": "axis_barilotto_forcella_specchio", "refFrom": "axis_coda_specchio"},
     "carrier": "axis_vert",
"place": {"at": [
  "axes.axis_Decli.ox + sin((azimuth+rotazione)*pi/180) * cos(altitude*pi/180) * fork_length",
  "axes.axis_Decli.oy + cos((azimuth+rotazione)*pi/180) * cos(altitude*pi/180) * fork_length",
  "axes.axis_Decli.oz + sin(altitude*pi/180) * fork_length"
]},
     "parts": [
       {"shape": "cylinder","r": 3,"w": [-70,-50],"n": 16,"color": "marker"},
       {"shape": "cylinder","r": 3,"w": [70,50],"n": 16,"color": "marker"},
       {
       "shape": "box",
       "w": [35,"largh_specchio/2-10"],
       "at": [0,0],
       "half": ["-spess_specchio","spess_specchio"],
       "color": "#ff0000"
       },
       {
       "shape": "box",
       "w": ["-largh_specchio/2+10",-35],
       "at": [0,0],
       "half": ["-spess_specchio","spess_specchio"],
       "color": "#ff0000"
       },

     ]},



    {"id": "axis_specchio_rotante", /* celeste */
     "name": "Asse dello specchio, coincidente con la coda ma libero di ruotare su sè stesso",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#aaaaff","group": "",
     "place": {"at": [0,0,0]},
     "group" : "group_specchio",
     "rotate" : [{"around": "axis_system","deg": "rotazione"}],
     "through": [
                    "axis_mirror_center",
                    "axis_barilotto_forcella_driver"
                    ],
     "refFrom": "axis_blu",
     "parts": [
      {"shape": "cylinder","r": "largh_specchio/3 -10","w": ["-30","5"],"n": 16}, // base cilindrica rotante dello specchio */
      {"shape": "box", "w": ["-35","-30"], "at": [0,0], "half": ["100","50"]}, // specchio rettangolare */
           {"shape": "cylinder","r": 5,"w": [-20,15],"n": 16,"variant": {"mirror_drive": "alternativa"}}, // coda alternativa dello specchio - cilindretto */
           {"shape": "box", "w": ["15","35"], "at": [0,0], "half": ["10","2.5"],"variant": {"mirror_drive": "alternativa"}}, // coda alternativa dello specchio - parte guidata */
           {"shape": "cylinder","r": 5,"w": [35,"len_coda_specchio"],"n": 16,"variant": {"mirror_drive": "alternativa"}}, // coda alternativa dello specchio - resto della coda*/

           {"shape": "cylinder","r": 5,"w": [-20,15],"n": 16,"variant": {"mirror_drive": "alternativa2"}}, // coda alternativa dello specchio - cilindretto */
           {"shape": "box", "w": ["15","len_coda_specchio"], "at": [0,0], "half": ["8","2.5"],"variant": {"mirror_drive": "alternativa2"}}, // coda alternativa dello specchio - parte guidata */
    ]},





{"id": "axis_blu", "name": "Asse-guida parallelo allo specchio", /* blu */
 "dir": [1,0,0], "ref": [0,0,1], "view": [0,1,0], "viewLabel": "dall'alto",
 "color": "#2288ff",
  "group" : "group_specchio",
 "place": {"at": ["axes.axis_mirror_center.ox","axes.axis_mirror_center.oy","axes.axis_mirror_center.oz"]},
 "rotate" : [{"around": "axis_system","deg": "rotazione"}],

 "parts": [
 //{"shape": "cylinder", "r": 2, "w": [0, "2*fork_length"], "n": 16},
  {"shape": "box", "w": ["lunghezza_coda_secondaria","90"], "at": [-35,15], "half": ["2","5"], "color": "#0000ff", "variant": {"mirror_drive": "originale"}},
  {"shape": "box", "w": ["lunghezza_coda_secondaria","90"], "at": [-35,-10], "half": ["2","5"], "color": "#0000ff", "variant": {"mirror_drive": "originale"}},
  {"shape": "box", "w": ["350","-20"], "at": [25,-7.5], "half": ["2","5"], "color": "#0000ff", "variant": {"mirror_drive": "alternativa"}},
  {"shape": "box", "w": ["350","-20"], "at": [25,7.5], "half": ["2","5"], "color": "#0000ff", "variant": {"mirror_drive": "alternativa"}},
 ]
 },



{"id": "axis_centro_specchio_fisico", 
 "name": "Centro effettivo dello specchio (posizione fisica reale)",
 "dir": [1,0,0], 
 "ref": [0,0,1],
     "rotate" : [{"around": "axis_system","deg": "rotazione"}],

 "place": {
   "at": [
     "axes.axis_mirror_center.ox+ axes.axis_coda_specchio.dx * offset_specchio",
     "axes.axis_mirror_center.oy + axes.axis_coda_specchio.dy * offset_specchio",
     "axes.axis_mirror_center.oz+ axes.axis_coda_specchio.dz * offset_specchio"
   ]
 },
 "through": [
   [
     "axes.axis_mirror_center.ox + axes.axis_coda_specchio.dx * offset_specchio",
     "axes.axis_mirror_center.oy + axes.axis_coda_specchio.dy * offset_specchio",
     "axes.axis_mirror_center.oz + axes.axis_coda_specchio.dz * offset_specchio"
   ],
   [
     "axes.axis_mirror_center.ox + axes.axis_coda_specchio.dx * (offset_specchio + 100)",
     "axes.axis_mirror_center.oy + axes.axis_coda_specchio.dy * (offset_specchio + 100)",
     "axes.axis_mirror_center.oz + axes.axis_coda_specchio.dz * (offset_specchio + 100)"
   ]
 ],
 "parts": []
}, 



    {"id": "axis_azimuth","name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#aaaaff","group": "",
     "place": {"at": ["axes.axis_Decli.ox","axes.axis_Decli.oy","0"]},
     "rotate": [{"around": "self","deg": "azimuth"},{"around": "axis_system","deg": "rotazione"}],
     "parts": [
       {"shape": "cylinder","r": 5,   "w": [0,"azimuthAxisLength"], "n": 16}, // asse
       {"shape": "cylinder","r": 50, "w": [10,"10+azimuthBasementHeight"], "n": 32}, // basamento
       {"shape": "box", "w": ["10","10 + azimuthBarHeight"], "at": [0,"fork_length/2"], "half": [45,"fork_length/2 + 50"]}, // barra inferiore porta-forcella
       {"shape": "box", "w": ["15","30 + azimuthBarHeight"], "at": [-40,"fork_length/2+60"], "half": [5,"fork_length/2 -10"]}, // bainario 1 lato
       {"shape": "box", "w": ["30","35 + azimuthBarHeight"], "at": [-35,"fork_length/2+60"], "half": [10,"fork_length/2 -10"]}, // bainario 1 sopra
       {"shape": "box", "w": ["15","30 + azimuthBarHeight"], "at": [40,"fork_length/2+60"], "half": [5,"fork_length/2 -10"]}, // bainario 2 lato
       {"shape": "box", "w": ["30","35 + azimuthBarHeight"], "at": [35,"fork_length/2+60"], "half": [10,"fork_length/2 -10"]}, // bainario 2 sopra
     ]},


//////////////////

      {
        "id": "axis_forcella_altitude",
        "name": "Forcella di altezza",
        "dir": [0,-1,0], "ref": [1,0,0], "view": [0,1,0], "viewLabel": "da davanti",
        "color": "#ffffff", "group": "",
        "carrier": "axis_azimuth",
        "rest": "carrier",
        "place": {"at": ["axes.axis_azimuth.ox", "axes.axis_azimuth.oy", "60"]},
        "rotate": {"around": "axis_Altitude", "deg": "altitude"},
        "parts": [
          {"shape": "box", "w": ["20","-fork_length-20"], "at": [-30,0], "half": [5,10], "color": "#ff0000"}
        ]
      },


    {
      "id": "axis_perno_barilotto_forcella_specchio",
      "name": "Asse barilotto altezza",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,0,1], "viewLabel": "laterale",
      "color": "#444444", "group": "",
      "carrier": "axis_forcella_altitude",
      "rest": "carrier",
      "place": {"offset": {"from": "axis_forcella_altitude", "by": [0, "fork_length", 0]}},
      "parts": [
        {"shape": "cylinder", "r": 2, "w": [40,-40], "n": 24, "color": "#ffffff"}
      ]
    },



////////////////


    {
      "id": "axis_Altitude",
      "name": "Asse puntamento verticale target",
      "dir": [1,0,0],
      "view": [-1,0,0],
      "viewLabel": "da davanti",
      "color": "#000000",
      "group": "",
      "carrier": "axis_azimuth",
      "rest": "carrier",
      "place": {"at": ["axes.axis_Decli.ox","axes.axis_Decli.oy","60"]},
      "rotate": {"around": "self","deg": "altitude"},
      "parts": [
        {"shape": "cylinder", "r": 3, "w": [-30,30], "n": 20},
      ]
    },

    {"id": "axis_vert_sled","name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta","color": "#ff0000","group": "",
     "carrier": "axis_azimuth",
     "rest": "carrier",
     "place": {"at": ["axes.axis_barilotto_forcella_specchio.ox",
                      "axes.axis_barilotto_forcella_specchio.oy",
                      "azimuthBasementHeight + azimuthBarHeight"]},
     "parts": [
       {"shape": "box", "w": ["-10","azimuthBarHeight"], "at": [0,0], "half": [35,40]},
     ]},


    {
      "id": "axis_barilotto_forcella_specchio", "name": "",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,0,1], "viewLabel": "dalla punta",
      "color": "#0000ff", "group": "",
      "carrier": "axis_perno_barilotto_forcella_specchio",
      "rest": "carrier",
      "place": {"coaxial": "axis_perno_barilotto_forcella_specchio"},
      "forceDir": [0,0,1],
      "parts": [
        {"shape": "cylinder", "r": 25, "w": ["-30","30"], "n": 16}
      ]
    },

    {"id": "axis_vert_int",
     "name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta",
     "color": "#aaffaa","group": "",
     "place": {"at": ["axes.axis_barilotto_forcella_specchio.ox",
                      "axes.axis_barilotto_forcella_specchio.oy",
                      "0"]},
      "spinAlignTo": {
        "target": "axis_mirror_center",
        "sourceVector": "yv",
        "targetVector": "dir",
        "mode": "parallel"
      },
         "parts": [
             {
             "shape": "cylinder",
             "r": 15,
             "w": [20,"axes.axis_Decli.oz-altezza_forcella_specchio-5"],
             "n": 32,

             },
    ]},

    {"id": "axis_vert",
     "name": "",
     "dir": [0,0,1],"ref": [1,0,0],"view": [0,0,1],"viewLabel": "dalla punta",
     "color": "#00ff00","group": "",
        "group" : "forcella_verticale",
     "place": {"at": ["axes.axis_barilotto_forcella_specchio.ox",
                      "axes.axis_barilotto_forcella_specchio.oy",
                      "axes.axis_barilotto_forcella_specchio.oz -30"]},

      "spinAlignTo": {
        "target": "axis_mirror_center",
        "sourceVector": "yv",
        "targetVector": "dir",
        "mode": "parallel"
      },

         "parts": [
            {"shape": "cylinder","r": 20,"w": [0,"axes.axis_Decli.oz-altezza_forcella_specchio-5"],"n": 16},
             {"shape": "box", "w": ["axes.axis_Decli.oz-altezza_forcella_specchio","axes.axis_Decli.oz-20"], "at": [0,"largh_specchio/2"], "half": [10,5], "color": "#00ff00"}, // fork1
             {"shape": "box", "w": ["axes.axis_Decli.oz-altezza_forcella_specchio","axes.axis_Decli.oz-20"], "at": [0,"-largh_specchio/2"], "half": [10,5], "color": "#00ff00"}, // fork2
             {"shape": "box", "w": ["axes.axis_Decli.oz-altezza_forcella_specchio-5", "axes.axis_Decli.oz-altezza_forcella_specchio"], "at": [0,0], "half": [10,"-largh_specchio/2 - 5"], "color": "#ffff00"}, // ortogonale

    ]},



          
  ],
  "gears": [
    {"id": "gear_A1_upper",
    "name": "Ruota A1_upper – SOLIDALE con XXp_upper, prende moto da gear_a1 (18/200)",
    "axis": "axis_XXp","teeth": 200,"module": "module","w": [-20,-12],

    },

  
    {"id": "gear_H__decli","name": "Semiruota di declinazione (160 denti)","axis": "axis_Decli","teeth": 160,"module": 1,"w": [-15,-10],
//     "meshWith": "gear_I_pinion_decli",
     "degStart": 90, "degEnd": 270 }
     ,


  ],
  "links": [
    {"type": "rail", "guide": "axis_blu", "slider": "axis_forcella",
   "perpendicularTo": "axis_coda_specchio", "marker": false}
  ],

  "inputs": [
  ],

  "groups": [
    {"id": "group_specchio",    "label": "Specchio","visible": true},
    {"id": "group_supporto",    "label": "Porta-specchio","visible": true},
    {"id": "forcella_verticale",    "label": "Forcella verticale","visible": true},
  ],

  "views": [
    {"id": "all","label": "Insieme","auto": true,"alpha": "pi/2-0.7","beta": 1.1,"scale": 1.1},
    {"id": "front","label": "Fig. 1 (da davanti)","target": [100,60,60],"alpha": "pi/2","beta": "pi/2","radius": 900},
    {"id": "side","label": "Fig. 2 (da sinistra)","target": ["axes.axis_3EF.ox","-(shift+110)",100],"alpha": "pi","beta": "pi/2","radius": 760}
  ],

  "checks": [  ],

  "ratios": [],

  "notes": []
};