var MACHINE = {
  "title": "Antikythera",

  "variants": {},
  "consts": { "distance": 5, "pinPos": 5, "module": 1, "twins_teeth" : 60 },
  "controls": [],

  "axes": [
    {
      "id": "axis_E5",
      "name": "Asse di E5",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [-20, 0, 0] },
      "hold": true,
      "color": "#ffaa00",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [-3, 3] }
      ]
    },

    {
      "id": "axis_E5_tube",
      "name": "Asse di E5",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [-20, 0, 0] },
      "color": "#ffaa00",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [-3, 3] }
      ]
    },

    {
      "id": "axis_E6",
      "name": "Asse di E6",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [-20, 0, 0] },
 "rotate" : {"around" : "self", "deg" : -10},
      "color": "#ffaa00",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [-3, 3] }
      ]
    },

    {
      "id": "axis_E3",
      "name": "Asse del portasatelliti E3",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [-20, 0, 0] },
      "hold": true,
      "color": "#ffaaff",
      "parts": [
        { "shape": "cylinder", "r": 3, "w": [-5, 5] }
      ]
    },

    {
      "id": "axis_C1",
      "name": "Asse driver",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [0, 0, "twins_teeth"] },
      "carrier": "axis_E3",
      "color": "#0000ff",
      "parts": [
        //{ "shape": "cylinder", "r": 10, "w": [10, 15], "n" : 4},
        { "shape": "cylinder", "r": 10, "w": [-30, 10], "n" : 6}
      ]
    },

    {
      "id": "axis_C1_tube",
      "name": "Asse driver",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [0, 0, "twins_teeth"] },
      "carrier": "axis_E3",
      "color": "#ff0000",
      "parts": [
        { "shape": "cylinder", "r": 16, "w": [-10, 5] , "n" : 6}
      ]
    },


    {
      "id": "axis_C2",
      "name": "Asse condotto (supporto fermo)",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [15, "distance", "twins_teeth"] },
      "carrier": "axis_E3",
      "color": "#0000ff",
      "parts": [
        { "shape": "cylinder", "r": 2, "w": [-10, 40], "n": 6 }
      ],
    },

    {
      "id": "axis_C2_tube",
      "name": "Asse condotto (girevole)",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "ref": [0, 0, -1],
      "place": { "at": [15, "distance", "twins_teeth"] },
      "carrier": "axis_E3",
      "color": "#00ffff",
 //           "rotate" : {"around" : "self", "deg" : -10},
      "parts": [
        { "shape": "cylinder", "r": 5, "w": [0, 20], "n": 6 }
      ],
    },

    {
      "id": "axisPin",
      "name": "Perno sul bordo di gear_K1",
      "color": "#ff0000",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "place": { "at": [0, 0, 75] },
      "carrier": "axis_C1_tube",
      "rest": "carrier",
      "parts": [
        { "shape": "cylinder", "r": 2, "w": [-5, 28] }
      ]
    },

    {
      "id": "slaveRail",
      "name": "Binario solidale a gear_K2",
      "view": [1, 0, 0],
      "dir": [0, 0, 1],
      "place": { "at": [15, "distance", 50] },
      "carrier": "axis_C2_tube",
      "color": "#00ff00",
      "parts": [
        { "shape": "box", "half": [2, 8], "w": [20, 35], "at": [-5, -8] },
        { "shape": "box", "half": [2, 8], "w": [20, 35], "at": [5, -8] }

      ]
    },

    {
      "id": "refAxis",
      "name": "Riferimento verticale (fisso)",
      "dir": [1, 0, 0],
      "view": [1, 0, 0],
      "place": { "at": [0, 0, 0] },
      "through": [[0, 0, 0], [100, 0, 0]],
      "color": "#888888"
    }
  ],

  "gears": [
    {
      "id": "gearE3",
      "name": "Portasatelliti",
      "type": "spur",
      "axis": "axis_E3",
      "teeth": 220,
      "module": "module",
      "w": [-5, 5],
      "color": "#dddddd"
    },

    {
      "id": "gear_E5",
      "name": "motore",
      "type": "spur",
      "axis": "axis_E5",
      "teeth": "twins_teeth",
      "module": "module",
      "w": [10, 15],
      "color": "#ffffff"
    },

    {
      "id": "gear_E6",
      "name": "",
      "type": "spur",
      "axis": "axis_E5_tube",
      "teeth": "twins_teeth",
      "module": "module",
      "w": [40, 45],
      "color": "#8888ff",
      "meshWith": "gear_K2",
    },

    {
      "id": "gear_K1",
      "name": "Ruota conduttrice",
      "type": "spur",
      "axis": "axis_C1_tube",
      "teeth": "twins_teeth",
      "module": "module",
      "w": [-10, -5],
      "color": "#ff0000",
      "meshWith" : "gear_E5",
    },

    {
      "id": "gear_K2",
      "name": "Ruota condotta",
      "type": "spur",
      "axis": "axis_C2_tube",
      "teeth": "twins_teeth",
      "module": "module",
      "w": [5, 10],
      "color": "#00ff00",

    }
  ],

"links": [
  {
    "type": "pin_slot",
    "driver": "gear_K1",
    "driven": "gear_K2",
    "pinAxis": "axisPin",
    "slotAxis": "slaveRail"
  }
],

  "inputs": [
    {
      "id": "mainInput",
      "axis": "axis_C1",
      "label": "Velocità gear_K1"
    }
  ],

  "groups": [],

"views": [
  {
    "id": "all",
    "label": "Vista d'insieme",
    "auto": true,
    "alpha": "pi/2-0.7",
    "beta": 1.1,
    "scale": 1.1
  },
  {
    "id": "front",
    "label": "Vista frontale",
    "auto": false,
    "target": [0, 0, 0],
    "radius": 600,
    "alpha": "0",
    "beta": "pi/2"
  },
  {
    "id": "top",
    "label": "Vista dall'alto",
    "auto": false,
    "target": [0, 0, 0],
    "radius": 300,
    "alpha": "-pi/2",
    "beta": 0.01
  },
  {
    "id": "detail_K1",
    "label": "Dettaglio K1",
    "auto": false,
    "target": [0, 0, 50],
    "radius": 200,
    "alpha": "pi/2+0.3",
    "beta": 1.2
  }
],

  "checks": [],
  "ratios": [],

  "notes": [
    "axisPin: place.at=[0,0,25] rispetto ad axis_C1_tube=[0,0,50] → pin a [0,0,75], raggio 25 nel piano Y-Z (bordo primitivo di gear_K1, 50 denti × modulo 1 / 2). Con w=[-5,20] il pin si estende in X da -5 a +20, coprendo il bordo di K1 e raggiungendo il canale del binario. slaveRail: place.at=[15,0,50-distance]=[15,0,45], coincidente con axis_C2_tube → binario centrato sull'asse di gear_K2. Il binario resta figlio di axis_E3 (struttura fissa) perché il link rail ne impone la posa in coordinate mondiali; è axis_C2_tube che insegue il binario via spinAlignTo. Con axis_C2_tube senza spinAlignTo e axis_C2 senza spinAlignTo, cliccare gear_K2 ora la fa ruotare liberamente sul proprio asse (verifica del cuscinetto)."
  ]
};