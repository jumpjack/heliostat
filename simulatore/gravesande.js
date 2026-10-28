{
  "title": "Gravesande heliostat",
  "variants": {
    "support": {
      "label": "Supporto su axis_C_Mirror",
      "options": { "posizionatore": "Posizionatore", "specchio": "Specchio" },
      "active": "specchio"
    }
  },
  "show": [
  ],
  "consts": { "module": 1, "lungh" : 35, "altezzaBaseP"  : 100 , "altezzaSupportoPosizionatore": 200, "lunghezzaLancetta" : 100, "xclock" : 180, "lunghezzaCoda": 200},
  "controls": [
    { "id": "latitudine", "label": "Latitudine", "step": 1, "ranges": { "all": { "min": 0, "max": 90, "value": 42 } } },
    { "id": "barra_len", "label": "Lunghezza barra YZ (declinazione)", "step": 2, "ranges": { "all": { "min": 60, "max": 300, "value": 100 } } },
    { "id": "tilt", "label": "Altezza target", "step": 1, "ranges": { "all": { "min": -90, "max": 90, "value": 0 } } },
    { "id": "azimuth", "label": "Azimuth target", "step": 1, "ranges": { "all": { "min": -180, "max": 180, "value": -90 } } },
    { "id": "clock_h", "label": "Altezza orologio", "step": 1, "ranges": { "all": { "min": 200, "max": 300, "value": 270 } } },
    { "id": "altezzaAsseForcella", "label": "Altezza tubo guida", "step": 1, "ranges": { "all": { "min": 5, "max": 35, "value": 20 } } },
    { "id": "xmirror", "label": "Posizione X specchio", "step": 1, "ranges": { "all": { "min": -500, "max": 500, "value": 80 } } },
    { "id": "ymirror", "label": "Posizione Y specchio", "step": 1, "ranges": { "all": { "min": -500, "max": 500, "value": -54 } } }
  ],
  "axes": [
    {
      "id": "axis_C_Mirror", // perno verticale interno di supporto a specchio o a posizionatore
      "dir": [0,0,1], "view": [0,0,1], "ref": [1,0,0],
      "place": { "at": ["xmirror", "ymirror", "altezzaBaseP"] },
      "color": "#ffff00",
      "parts": [{"shape": "cylinder","r": 5,"w": [0, "altezzaSupportoPosizionatore/2"],"n": 6}]
    },
    {
      "id": "axis_P_MirrorBase",
      "dir": [0,0,1], "view": [0,0,1], "ref": [1,0,0],
      "place": { "at": ["xmirror", "ymirror", 0] },
      "color": "#8888ff",
      "parts": [{"shape": "cylinder","r": 15,"w": [0, "altezzaBaseP"],"n": 6}]
    },
    
// Gruppo posizionatore    
    {
      "id": "axis_x_Barra_Setup", // asse orizzontale di rotazione della barra
      "variant": { "support": "posizionatore" },
      "carrier": "axis_C_Mirror", "rest": "carrier",
      "dir": [1,0,0], "view": [0,0,1], "ref": [0,0,1],
      "place": { "at": ["xmirror", "ymirror","altezzaSupportoPosizionatore + altezzaBaseP"] },
      "rotate": [{ "around": "axis_C_Mirror", "deg": "azimuth" }],
      "color": "#ffaa00",
      "parts": [/*{"shape": "cylinder","r": 5,"w": [-60, 60],"n": 12}*/]
    },
    {
      "id": "axis_Y_Z_Barra",
      "variant": { "support": "posizionatore" },
      "carrier": "axis_x_Barra_Setup",
      "dir": [0,1,0], "view": [0,0,1], "ref": [0,0,1],
      "place": { "at": ["xmirror", "ymirror","altezzaSupportoPosizionatore + altezzaBaseP"] },
      "rotate": [{ "around": "axis_x_Barra_Setup", "deg": "tilt" }],
      "color": "#aaaaaa",
      "parts": [{"shape": "cylinder","r": 2,"w": ["-barra_len", 200],"n": 6}]
    },
    {
      "id": "axis_C_X_supporto_posizionatore",
      "variant": { "support": "posizionatore" },
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,0,1],
      "place": { "at": ["xmirror", "ymirror", "altezzaBaseP"] },
      "rotate": [{ "around": "axis_C_Mirror", "deg": "azimuth" }],
      "color": "#4444ff",
      "parts": [
        { "shape": "cylinder", "r": 8, "w": [0, "altezzaSupportoPosizionatore"], "at": [0, 0], "n": 6 },
      ]
    },

// gruppo specchio
    {
      "id": "axis_C_A_A_Fork",
      "variant": { "support": "specchio" },
      "carrier": "axis_C_Mirror",
      "rest": "carrier",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,0,1],
      "place": { "at": ["xmirror", "ymirror", "altezzaBaseP + altezzaSupportoPosizionatore/2"] },
      "spinPerpTo": { "axis": "axis_a_a_Mirror_Elev", "line": "axis_D_E_coda_specchio" },
      "color": "#ffaa00",
      "parts": [
        { "shape": "box", "at": [-38, 0], "w": [5, 110], "half": [2, 14]},// braccio 1
        { "shape": "box", "at": [38, 0], "w": [5, 110], "half": [2, 14] },// braccio 2
        { "shape": "cylinder", "r": 6, "w": [0, "-altezzaSupportoPosizionatore/2"], "at": [0, 0], "n": 12 }, // cilindro di supporto
        { "shape": "box", "w": [0, 5], "half": [40, 14] }, // base suppoto bracci
      ]
    },
    {
      "id": "axis_a_a_Mirror_Elev",
      "variant": { "support": "specchio" },
      "carrier": "axis_C_A_A_Fork",
      "rest": "carrier",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,0,1],
      "place": { "at": ["xmirror", "ymirror","altezzaSupportoPosizionatore + altezzaBaseP"] },
      "color": "#aaaaff",
      "parts": [
      { "shape": "cylinder", "r": 2, "w": [-40, -30], "n": 12 },
      { "shape": "cylinder", "r": 2, "w": [40, 30], "n": 12 }
      ]
    },




    {
      "id": "axis_F_G_clock",
      "name": "Asse orario",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
      "place": { "at": ["xclock", 0, 0] },
      "color": "#c9a45a",
      "parts": [
        { "shape": "cylinder", "r": 12, "w": [0, "clock_h"], "at": [0,0], "n": 4 },
        { "shape": "box", "w": [0, 6], "at": [0,0], "half": [22, 40] }
      ]
    },
    {
      "id": "axis_clock_lat",
      "name": "Asse latitudine",
      "carrier": "axis_F_G_clock",
      "rest": "carrier",
      "dir": [1,0,0], "ref": [0,0,1], "view": [0,1,0],
      "place": { "at": ["xclock", 0, "clock_h"] },
      "color": "#ffaa00",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [-32, 32], "at": [0,0], "n": 16 }
      ]
    },
    {
      "id": "axis_clock_box",
      "name": "Rettangolo latitudine",
      "carrier": "axis_clock_lat",
      "rest": "carrier",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
      "place": { "at": ["xclock", 0, "clock_h"] },
      "rotate": [{ "around": "axis_clock_lat", "deg": "latitudine" }],
      "color": "#66ccff",
      "parts": [
        { "shape": "box", "w": [-20, 20], "at": [0,0], "half": [28, 45] },
        { "shape": "cylinder", "r": 17, "w": [20, 24], "at": [0, 30], "n": 32, "color": "#e8e0c0" },
        { "shape": "cylinder", "r": 25, "w": [20, 24], "at": [0, -22], "n": 48, "color": "#e8e0c0" }
      ]
    },
    {
      "id": "axis_clock_N",
      "name": "Asse N",
      "carrier": "axis_clock_box",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
      "place": { "at": ["xclock", -22, "clock_h+24"] },
      "color": "#ff4444",
      "parts": [
        { "shape": "cylinder", "r": 1.5, "w": [0, "lungh"], "at": [0,0], "n": 12 }
      ]
    },
    {
      "id": "axis_N_O_lancetta",
      "name": "Lancetta N-O",
      "carrier": "axis_clock_N",
      "rest": "carrier",
      "dir": [0,1,0], "ref": [1,0,0], "view": [0,0,1],
      "place": { "at": ["xclock", -22, "clock_h+24"] },
      "color": "#d0c090",
      "parts": [
        { "shape": "box", "w": [0, "-lunghezzaLancetta"], "at": [0,0], "half": [4, 1] }
      ]
    },

//////////////




{
  "id": "axis_clock_N_tip",
  "name": "Punta N - segue latitudine",
  "carrier": "axis_clock_N",
  "rest": "carrier",
  "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
  "place": { "offset": { "from": "axis_clock_N", "by": [0, 0, "lungh"] } },
  "color": "#ff0000",
  "parts": []
},
{
  "id": "axis_direzione_riflesso",
  "name": "riflesso: centro specchio -> punta N",
  "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
  "place": { "at": [0,0,0] },
  "through": ["axis_clock_N_tip", ["xmirror", "ymirror","altezzaSupportoPosizionatore + altezzaBaseP"] ],
  "refFrom": "axis_C_Mirror",
  "color": "#000000",
  "parts": []
},



///////////////

{
      "id": "axis_O_forcella_pilota", // Asse verticale della forcella-pilota, all'estremità O della lancetta ON
      "name": "Asse O forcella pilota",
      "carrier": "axis_N_O_lancetta",
      "rest": "carrier",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
      "place": { "at": ["xclock", "-lunghezzaLancetta", "clock_h+24"] },
      "color": "#ffff00",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [0, 12], "at": [0,0], "n": 16 }
      ]
    },
    {
      "id": "axis_r_rp_forcella_pilota", // Asse di supporto del tubo-guida
       "variant": { "support": "specchio" },
      "color" : "#0000ff",
      "carrier": "axis_T_forcella_pilota",
      "rest": "carrier",
      "dir": [1,0,0], "ref": [0,1,0], "view": [0,0,1],
      "place": { "at": ["xclock", "-lunghezzaLancetta", "clock_h + 36 + altezzaAsseForcella"] },
      "parts": [
        { "shape": "cylinder", "r": 1, "w": [-15, 15], "at": [0,0], "n": 6 }
      ]

    },

{
  "id": "axis_direzione_sole_decli",
  "variant": { "support": "specchio" },
  "name": "da punta N a centro tubo",
  "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
  "place": { "at": [0,0,0] },
  "through": ["axis_clock_N_tip", "axis_R_tubo_pilota" ],
  "refFrom": "axis_C_Mirror",
  "color": "#000000",
  "parts": []
},

{
  "id": "axis_D_E_coda_specchio",
"variant": { "support": "specchio" },
  "dir": [0,1,0], "ref": [0,0,1], "view": [1,0,0],
  "place": { "at": [0,0,"altezzaSupportoPosizionatore + altezzaBaseP"] },
  "through": [["xmirror", "ymirror","altezzaSupportoPosizionatore + altezzaBaseP"] , "axis_R_tubo_pilota"],
  "refFrom": "axis_C_Mirror",
  "color": "#999999",
  "parts": [
  { "shape": "cylinder", "r": 2, "w": [0, "lunghezzaCoda"], "n": 6 }, // coda
{ "shape": "box", "w": [-1, 1], "half": [25, 30] } // specchio
  ]
},



{
  "id": "axis_R_tubo_pilota",
  "variant": { "support": "specchio" },
  "carrier": "axis_r_rp_forcella_pilota",
  "rest": "carrier",
  "dir": [0,1,0], "ref": [0,0,1], "view": [1,0,0],
  "alignWith": "axis_D_E_coda_specchio",
  "place": { "coaxial": "axis_r_rp_forcella_pilota" },
  "color": "#c9a45a",
  "parts": [{ "shape": "cylinder", "r": 6, "w": [-10, 10], "n": 6 }]
},


    {
      "id": "axis_T_forcella_pilota",
  "variant": { "support": "specchio" },
      "name": "Forcella T",
      "carrier": "axis_O_forcella_pilota",
      "dir": [0,0,1], "ref": [1,0,0], "view": [0,1,0],
      "place": { "at": ["xclock", "-lunghezzaLancetta", "clock_h+36"] },
      "spinPerpTo": { "axis": "axis_r_rp_forcella_pilota", "line": "axis_D_E_coda_specchio" },
      "color": "#aa0000",
      "parts": [
        { "shape": "box", "w": [0, 3], "half": [12, 4] }, // base
        { "shape": "box", "w": [3, 40], "half": [2, 4], "at": [-10, 0] }, // braccio
        { "shape": "box", "w": [3, 40], "half": [2, 4], "at": [10, 0] } // braccio
      ]
    }
  ],
  "gears": [
    { "id": "gear_N", "type": "spur", "axis": "axis_clock_N", "teeth": 20, "module": "module", "w": [0, 5], "color": "#cccccc" },
  ],
  "links": [], "inputs": [], "groups": [],
  "views": [{ "id": "setup","label": "setup","auto": true,"alpha": "pi/2+0.7","beta": 1.1,"scale": 1.1 }],
  "checks": [], "ratios": [], "notes": []
}