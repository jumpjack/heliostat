{
  "title": "Test Geneva Drive (6 scanalature)",
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
          73,
          0
        ]
      },
      "carrier": "axis_Crank",
      "rest": "carrier",
      "color": "#ffff00",
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
      "color": "#a0a0a0",
      "parts": []
    }
  ],
  "gears": [
    {
      "id": "gear_Crank",
      "name": "Manovella",
      "type": "spur",
      "axis": "axis_Crank",
      "teeth": 40,
      "module": "module",
      "w": [
        -5,
        5
      ],
      "color": "#ffaa00"
    },
    {
      "id": "gear_Cross",
      "name": "Croce di Malta",
      "type": "maltese",
      "axis": "axis_Cross",
      "slots": 4,
      "module": "module",
      "w": [
        -5,
        5
      ],
      "color": "#00ff00",
      "slotWidth": 7
    }
  ],
  "links": [
    {
      "type": "geneva",
      "driver": "gear_Crank",
      "driven": "gear_Cross",
      "pinAxis": "axis_Pin",
      "slotAxis": "axis_Slot",
      "slots": 4
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
      "alpha": "pi/2-0.7",
      "beta": 1.1,
      "scale": 1.1
    }
  ],
  "checks": [],
  "ratios": [],
  "notes": []
}