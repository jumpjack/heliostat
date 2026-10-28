{
  "title": "Test Geneva Drive + Blu 80 + Conica 25",
  "variants": {},
  "consts": {
    "module": 1
  },
  "controls": [],
  "axes": [
    {
      "id": "axis_Crank",
      "name": "Asse Motore",
      "dir": [
        1,
        0,
        0
      ],
      "view": [
        1,
        0,
        0
      ],
      "ref": [
        0,
        0,
        -1
      ],
      "place": {
        "at": [
          0,
          0,
          0
        ]
      },
      "color": "#ffaa00",
      "parts": [
        {
          "shape": "cylinder",
          "r": 5,
          "w": [
            -10,
            10
          ]
        }
      ]
    },
    {
      "id": "axis_Cross",
      "name": "Asse Croce",
      "dir": [
        1,
        0,
        0
      ],
      "view": [
        1,
        0,
        0
      ],
      "ref": [
        0,
        0,
        -1
      ],
      "place": {
        "at": [
          0,
          100.0,
          0
        ]
      },
      "color": "#00ff00",
      "parts": [
        {
          "shape": "cylinder",
          "r": 5,
          "w": [
            -10,
            10
          ]
        }
      ]
    },
    {
      "id": "axis_Pin",
      "name": "Perno",
      "dir": [
        1,
        0,
        0
      ],
      "view": [
        1,
        0,
        0
      ],
      "place": {
        "at": [
          0,
          43,
          0
        ]
      },
      "carrier": "axis_Crank",
      "rest": "carrier",
      "color": "#ff0000",
      "parts": [
        {
          "shape": "cylinder",
          "r": 3,
          "w": [
            -15,
            15
          ]
        }
      ]
    },
    {
      "id": "axis_Slot",
      "name": "Slot",
      "dir": [
        0,
        -1,
        0
      ],
      "view": [
        1,
        0,
        0
      ],
      "place": {
        "at": [
          0,
          100.0,
          0
        ]
      },
      "carrier": "axis_Cross",
      "color": "#5555ff",
      "parts": []
    },
    {
      "id": "axis_1",
      "name": "Asse Blu",
      "dir": [
        1,
        0,
        0
      ],
      "view": [
        1,
        0,
        0
      ],
      "ref": [
        0,
        0,
        -1
      ],
      "place": {
        "at": [
          0,
          -100,
          0
        ]
      },
      "color": "#4444ff",
      "parts": [
        {
          "shape": "cylinder",
          "r": 4,
          "w": [
            -30,
            80
          ]
        }
      ]
    },
    {
      "id": "axis_Bevel",
      "name": "Asse Conico Uscita",
      "dir": [
        0,
        0,
        -1
      ],
      "view": [
        0,
        0,
        1
      ],
      "ref": [
        1,
        0,
        0
      ],
      "place": {
        "byApex": "gear_Bevel1"
      },
      "color": "#00aaff",
      "parts": [
        {
          "shape": "cylinder",
          "r": 4,
          "w": [
            10,
            50
          ]
        }
      ]
    }
  ],
  "gears": [
    {
      "id": "gear_pin_holder",
      "name": "Portapin",
      "type": "spur",
      "axis": "axis_Crank",
      "teeth": 120,
      "module": "module",
      "w": [
        15,
        20
      ],
      "color": "#00ff00"
    },
     {
      "id": "gear_Crank",
      "name": "Manovella",
      "type": "spur",
      "axis": "axis_Crank",
      "teeth": 88,
      "module": "module",
      "w": [
        -5,
        5
      ],
      "color": "#999999",
"degStart"
:
210,
"degEnd"
:
330,
    },
    {
      "id": "gear_Cross",
      "name": "Croce di Malta",
      "type": "maltese",
      "axis": "axis_Cross",
      "slots": 7,
      "module": "module",
      "w": [
        -5,
        5
      ],
      "color": "#888888",
      "slotWidth": 7
    },
    {
      "id": "gear_1",
      "name": "Blu 80",
      "type": "spur",
      "axis": "axis_1",
      "teeth": 80,
      "module": "module",
      "meshWith": "gear_pin_holder",
      "w": [
        15,
        20
      ],
      "color": "#0000ff"
    },
    {
      "id": "gear_Bevel1",
      "name": "Conico 25 su Blu",
      "type": "bevel",
      "axis": "axis_1",
      "teeth": 25,
      "module": "module",
      "meshWith": "gear_Bevel2",
      "apexW": -40,
      "side": 1,
      "color": "#0000ff"
    },
    {
      "id": "gear_Bevel2",
      "name": "Conico 25 uscita",
      "type": "bevel",
      "axis": "axis_Bevel",
      "teeth": 25,
      "module": "module",
      "meshWith": "gear_Bevel1",
      "apexW": 0,
      "side": 1,
      "color": "#00aaff"
    }
  ],
  "links": [
    {
      "type": "geneva",
      "driver": "gear_Crank",
      "driven": "gear_Cross",
      "pinAxis": "axis_Pin",
      "slotAxis": "axis_Slot",
      "slots": 7
    }
  ],
  "inputs": [
    {
      "id": "mainInput",
      "axis": "axis_Crank",
      "label": "Motore"
    }
  ],
  "groups": [],
  "views": [
    {
      "id": "all",
      "label": "Insieme",
      "auto": true,
      "alpha": "pi/2+0.7",
      "beta": 1.1,
      "scale": 1.1
    }
  ],
  "checks": [],
  "ratios": [],
  "notes": []
}