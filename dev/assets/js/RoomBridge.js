class RoomBridge {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._roomLength = 5
    this._ctx._roomDepth = 5
    this._ctx._fixedTime = 0.9

    this.initGeometry()
    this.initMaterial()

    this.createLight()
    this.createRoomShape()
    this.createBedShape()
    this.createNightstandShape()
    this.createBinShape()
    this.createTrolleyShape()

    this.loop()
    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: -1, y: 0, z: 2.2}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneBufferGeometry(50, 5, 1, 1)
    this._g.water = new THREE.CircleBufferGeometry(30, 100)
    this._g.wall = new THREE.BoxBufferGeometry(50, 3, 0.2)
    this._g.roofLight = new THREE.SphereBufferGeometry(0.2, 8, 8)
    this._g.roofLightH = new THREE.CylinderBufferGeometry(0.225, 0.225, 0.05, 13)
    this._g.door = new THREE.BoxBufferGeometry(1.2, 2.2, 0.1)
    this._g.doorF = new THREE.BoxBufferGeometry(1.4, 2.3, 0.05)
    this._g.doorH = new THREE.BoxBufferGeometry(0.05, 0.3, 0.05)
    this._g.bridgeP = new THREE.BoxBufferGeometry(1.5, 10, 3)
    this._g.bridgePAlt = new THREE.BoxBufferGeometry(1, 1, 50)
    this._g.bridgeL1 = new THREE.BoxBufferGeometry(1, 1, 5)
    this._g.bridgeL2 = new THREE.BoxBufferGeometry(0.75, 5, 0.75)
    this._g.bridgeL3 = new THREE.BoxBufferGeometry(8, 0.2, 0.5)
    this._g.road = new THREE.PlaneBufferGeometry(8, 100, 1, 1)

    // Bed
    this._g.mattress = new THREE.BoxBufferGeometry(1.2, 0.2, 0.425)

    // Nightstand
    this._g.nightstand = new THREE.BoxBufferGeometry(0.5, 0.025, 0.5)
    this._g.nightstandH = new THREE.BoxBufferGeometry(0.5, 0.25, 0.025)
    this._g.beerB = new THREE.CylinderBufferGeometry(0.05, 0.05, 0.2, 9)
    this._g.beerT = new THREE.CylinderBufferGeometry(0.02, 0.025, 0.1, 8)
    this._g.torusKnot = new THREE.TorusKnotBufferGeometry(0.075, 0.02, 32, 12)

    // Bin
    this._g.bin = new THREE.BoxBufferGeometry(1, 0.9, 1.6)
    this._g.binAlt = new THREE.BoxBufferGeometry(1.2, 0.4, 1.6)
    this._g.binL = new THREE.BoxBufferGeometry(1, 0.1, 0.1)
    this._g.binF = new THREE.BoxBufferGeometry(0.05, 0.9, 0.05)
    this._g.binT = new THREE.BoxBufferGeometry(1.2, 0.05, 0.85)
    this._g.binTAlt = new THREE.BoxBufferGeometry(1.2, 0.05, 0.05)

    // Trolley
    this._g.trolleyS1= new THREE.BoxBufferGeometry(0.9, 0.05, 0.05)
    this._g.trolleyS2= new THREE.BoxBufferGeometry(0.05, 0.3, 0.05)
    this._g.trolleyS3= new THREE.BoxBufferGeometry(0.05, 0.425, 0.05)
    this._g.trolleyS4= new THREE.BoxBufferGeometry(0.05, 0.25, 0.05)
    this._g.trolleyS5= new THREE.BoxBufferGeometry(1, 0.05, 0.05)
    this._g.trolleyS6= new THREE.BoxBufferGeometry(0.2, 0.05, 0.05)

    this._g.trolleyF1= new THREE.BoxBufferGeometry(0.05, 0.05, 0.4)

    this._g.trolleyB1= new THREE.BoxBufferGeometry(0.05, 0.05, 0.5)
    this._g.trolleyB2= new THREE.BoxBufferGeometry(0.05, 0.05, 0.61)

    this._g.trolleyG1= new THREE.PlaneBufferGeometry(0.9, 0.5, 1, 1)
    this._g.trolleyG2= new THREE.PlaneBufferGeometry(0.4, 0.25, 1, 1)
    this._g.trolleyG3= new THREE.PlaneBufferGeometry(0.5, 0.4, 1, 1)
    this._g.trolleyG4= new THREE.PlaneBufferGeometry(0.875, 0.275, 1, 1)
    this._g.trolleyG5= new THREE.PlaneBufferGeometry(0.925, 0.1, 1, 1)

    this._g.trolleyW = new THREE.CylinderBufferGeometry(0.05, 0.05, 0.05, 7)
  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Common
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.black = new THREE.MeshStandardMaterial({color: 0x393939, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.rod = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.5, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0x505050, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.water = new THREE.MeshStandardMaterial({color: 0x43f0e0, metalness: 0.5, roughness: 0.5, opacity: 0.8, transparent: true})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0x927f70, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f1e5, metalness: 0, roughness: 1, opacity: 0.8, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0x324937, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0x8f8f8f, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.bridgeP = new THREE.MeshStandardMaterial({color: 0xfffedb, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bridgeL = new THREE.MeshStandardMaterial({color: 0xf9493d, flatShading: true, metalness: 0, roughness: 0.7})

    // Bed
    this._m.mattress = new THREE.MeshStandardMaterial({color: 0x55637e, flatShading: true, metalness: 0, roughness: 1})

    // Nightstand
    this._m.cardboard = new THREE.MeshStandardMaterial({color: 0xb88d6b, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.torusKnot = new THREE.MeshStandardMaterial({color: 0xed0707, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Bin
    this._m.bin = new THREE.MeshStandardMaterial({color: 0x4a5640, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.binT = new THREE.MeshStandardMaterial({color: 0x374851, flatShading: true, metalness: 0.3, roughness: 0.7})

    // Trolley
    this._m.trolley = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.trolleyG = new THREE.MeshStandardMaterial({color: 0xdedede, metalness: 0.1, roughness: 0.5, opacity: 0.5, transparent: true, side: THREE.DoubleSide})

  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    // Floor
    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2

    // River
    this._water = this.craft("water", "water", this._roomShape)
    this._water.position.y = -1
    this._water.rotation.x = - Math.PI / 2


    // Light
    this._roofLightHolder = new THREE.Object3D()
    this._roofLightHolder.textKey = "bLight"
    this._roofLightHolder.text = "An hazardous electrical light."
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = this.craft("roofLight", "roofLight", this._roofLightHolder)
    this._roofLightH1 = this.craft("roofLightH", "rod", this._roofLightHolder)
    this._roofLightH2 = this.craft("roofLightH", "rod", this._roofLightHolder)
    this._roofLightH2.rotation.z = Math.PI / 2
    this._roofLightH3 = this.craft("roofLightH", "rod", this._roofLightHolder)
    this._roofLightH3.position.z = -0.05
    this._roofLightH3.rotation.x = Math.PI / 2

    this._roofLightHolder.position.set(1, 2.4, 2.55)

    this._roomShape.add(this._roofLightHolder)

    // Building walls
    this._wall = []
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 1.5, 2.6)
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 4, 3.7)
    this._wall[this._wall.length - 1].rotation.x = Math.PI / 4

    // Graffiti wall
    this._graffitiHolder = new THREE.Object3D()
    this._graffitiHolder.textKey = "bGraffiti"
    this._graffitiHolder.text = "A graffiti, the street way of doing art, this one is a little faded."
    this._graffitiHolder.textAction = "bubble"
    const moistureDistance = -2.49
    for (let i = 0; i < 25; i++) {
      let geometry
      if (Math.floor(Math.random() * 2)) {
        geometry = new THREE.PlaneBufferGeometry(0.1 + Math.random() * 0.5, 0.1 + Math.random() * 0.5, 1, 1)
      } else {
        geometry = new THREE.CircleBufferGeometry(0.1 + Math.random() * 0.2, Math.floor(Math.random() * 4) + 5)
      }
      const material = Utils3.randomColorMaterial({saturation: 50, lightness: 25 + Math.floor(Math.random() * 25)})
      this._wall.push(this.craft(geometry, material, this._graffitiHolder))
      this._wall[this._wall.length - 1].position.set(moistureDistance + 0.00001 * i, Math.random() * 2.5 + 0.2, Math.random() * 2 + 1)
      this._wall[this._wall.length - 1].rotation.y = Math.PI / 2
    }
    this._graffitiHolder.rotation.y = Math.PI / 2
    this._roomShape.add(this._graffitiHolder)

    // Door
    this._door = new THREE.Object3D()
    this._door.textKey = "bDoor"
    this._door.text = "Go further?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.1, 0)
    this._doorPart.push(this.craft("doorF", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.15, 0)
    this._doorPart.push(this.craft("doorH", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.2, -0.05)
    this._doorPart[this._doorPart.length - 1].rotation.z = -Math.PI / 32

    this._door.position.set(-1, 0, 2.5)
    this._roomShape.add(this._door)

    // Bridge

    // start:bridgeHolder
    this._bridgeHolder1 = new THREE.Object3D()

    // start:bridgeLeg1
    this._bridgeLeg1 = new THREE.Object3D()

    this._wall.push(this.craft("bridgeP", "bridgeP", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 5, 0)
    this._wall.push(this.craft("bridgeL1", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 1.5, -3)
    this._wall[this._wall.length - 1].rotation.x = -4 * Math.PI / 6
    this._wall.push(this.craft("bridgeL1", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 5.3, -5.9125)
    this._wall[this._wall.length - 1].rotation.x = -4.5 * Math.PI / 6
    this._wall.push(this.craft("bridgeL1", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 8.125, -9.6125)
    this._wall[this._wall.length - 1].rotation.x = -5 * Math.PI / 6
    this._wall.push(this.craft("bridgePAlt", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 8.5, 0)
    this._wall.push(this.craft("bridgeL2", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 6, -4)
    this._wall.push(this.craft("bridgeL2", "bridgeL", this._bridgeLeg1))
    this._wall[this._wall.length - 1].position.set(0, 9, -7.5)

    this._bridgeLeg1.position.x = 3.5
    // end:bridgeLeg1

    this._bridgeLeg2 = this._bridgeLeg1.clone()
    this._bridgeLeg2.position.x = -3.5

    this._bridgeHolder1.add(this._bridgeLeg1)
    this._bridgeHolder1.add(this._bridgeLeg2)

    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 1.5, -3)
    this._wall[this._wall.length - 1].rotation.set(-4 * Math.PI / 6, Math.PI / 6, 0)
    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 1.5, -3)
    this._wall[this._wall.length - 1].rotation.set(-4 * Math.PI / 6, -Math.PI / 6, 0)
    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 5.3, -5.9125)
    this._wall[this._wall.length - 1].rotation.set(-4.5 * Math.PI / 6, Math.PI / 6, 0)
    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 5.3, -5.9125)
    this._wall[this._wall.length - 1].rotation.set(-4.5 * Math.PI / 6, -Math.PI / 6, 0)
    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 8.125, -9.6125)
    this._wall[this._wall.length - 1].rotation.set(-5 * Math.PI / 6, Math.PI / 6, 0)
    this._wall.push(this.craft("bridgeL3", "bridgeL", this._bridgeHolder1))
    this._wall[this._wall.length - 1].position.set(0, 8.125, -9.6125)
    this._wall[this._wall.length - 1].rotation.set(-5 * Math.PI / 6, -Math.PI / 6, 0)
    // end:BridgeHolder

    this._bridgeHolder2 = this._bridgeHolder1.clone()
    this._bridgeHolder2.position.z = -23
    this._bridgeHolder2.rotation.y = Math.PI

    this._roomShape.add(this._bridgeHolder1)
    this._roomShape.add(this._bridgeHolder2)

    this._wall.push(this.craft("road", "black", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 8.5, 0)
    this._wall[this._wall.length - 1].rotation.x = Math.PI / 2

    this._meshHolder.add(this._roomShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()
    this._bedShape.textKey = "bBed"
    this._bedShape.text = "An old mattress on the ground, not even a frame to hold it."
    this._bedShape.textAction = "bubble"

    this._bedStructure = []
    for (let i = 0; i < 5; i++) {
      this._bedStructure.push(this.craft("mattress", "mattress", this._bedShape))
      this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.1, i * 0.4 - 0.2 * 5)
      if (this._bedStructure[this._bedStructure.length - 2] && this._bedStructure[this._bedStructure.length - 2].rotation.x > 0) {
        this._bedStructure[this._bedStructure.length - 1].rotation.x = - Math.random() * 0.1
      } else {
        this._bedStructure[this._bedStructure.length - 1].rotation.x = Math.random() * 0.1
      }
    }

    this._bedShape.position.set(1.9, 0, 0)
    this._bedShape.rotation.y = -Math.PI / 16

    this._meshHolder.add(this._bedShape)
  }

  createNightstandShape () {
    this._nightstandShape = new THREE.Object3D()
    this._nightstandShape.textKey = "bNightstand"
    this._nightstandShape.text = "A wet cardboard to hide the few precious thing that i own."
    this._nightstandShape.textAction = "bubble"

    this._nightstandStructure = []
    this._nightstandStructure.push(this.craft("nightstand", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, -0.2375, 0)
    this._nightstandStructure.push(this.craft("nightstand", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.2375, 0)
    this._nightstandStructure.push(this.craft("nightstand", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0, 0.2375)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.x = Math.PI / 2
    this._nightstandStructure.push(this.craft("nightstand", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0, -0.2375)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.x = Math.PI / 2
    this._nightstandStructure.push(this.craft("nightstand", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0.2375, 0, 0)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.z = Math.PI / 2
    this._nightstandStructure.push(this.craft("nightstandH", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(-0.36, 0, -0.1775)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.set(0, Math.PI / 6, Math.PI / 2)
    this._nightstandStructure.push(this.craft("nightstandH", "cardboard", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(-0.6, -0.2375, 0.2)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 12)

    if (this._ctx._textMemory["cTorusKnot"] || this._ctx._textMemory["sTorusKnot"]) {
      // Torus knot one
      this._torusKnotHolder = new THREE.Object3D()
      this._torusKnotHolder.textKey = "bTorusKnot"
      this._torusKnotHolder.text = "My last precious thing: the special edition torus knot."
      this._torusKnotHolder.textAction = "bubble"
      this._nightstandStructure.push(this.craft("torusKnot", "torusKnot", this._torusKnotHolder))
      this._nightstandStructure[this._nightstandStructure.length - 1].position.set(-0.2, -0.15, 0)
      this._nightstandStructure[this._nightstandStructure.length - 1].rotation.x = Math.PI / 2
      this._nightstandShape.add(this._torusKnotHolder)
    }

    const beerPos = [
      {x: 0, y: 0.25, z: 0},
      {x: -0.5, y: -0.25, z: 0.5},
      {x: -0.7, y: -0.25, z: 0.7},
      {x: -0.7, y: -0.25, z: -0.7},
      {x: 0.7, y: -0.25, z: -0.7},
    ]
    while (beerPos.length) {
      let offset = beerPos.pop()
      let beerM = Utils3.randomColorMaterial({opacity: 0.8, lightness: 30})
      let x = Math.random() * 0.3 - 0.15
      let z = Math.random() * 0.3 - 0.15
      this._nightstandStructure.push(this.craft("beerB", beerM, this._nightstandShape))
      this._nightstandStructure[this._nightstandStructure.length - 1].position.set(offset.x + x, offset.y + 0.1, offset.z + z)
      this._nightstandStructure.push(this.craft("beerT", beerM, this._nightstandShape))
      this._nightstandStructure[this._nightstandStructure.length - 1].position.set(offset.x + x, offset.y + 0.25, offset.z + z)
    }

    this._nightstandShape.position.set(1, 0.25, -1)
    this._nightstandShape.rotation.y = Math.PI / 12

    this._meshHolder.add(this._nightstandShape)
  }

  createBinShape () {
    this._binShape = new THREE.Object3D()
    this._binShape.textKey = "bBin"
    this._binShape.text = "What interesting thing can i say about a trash bin..."
    this._binShape.textAction = "bubble"

    this._binStructure = []
    this._binStructure.push(this.craft("bin", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 0.55, 0)
    this._binStructure.push(this.craft("binL", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 0.05, 0.7)
    this._binStructure.push(this.craft("binL", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 0.05, 0)
    this._binStructure.push(this.craft("binL", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 0.05, -0.7)
    this._binStructure.push(this.craft("binF", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0.5, 0.55, 0.4)
    this._binStructure.push(this.craft("binF", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0.5, 0.55, -0.4)
    this._binStructure.push(this.craft("binAlt", "bin", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(-0.15, 0.975, 0)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binT", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.175, 0.4375)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binTAlt", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.2, 0.6)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binTAlt", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.2, 0.3)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binT", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.175, -0.4375)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binTAlt", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.2, -0.6)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12
    this._binStructure.push(this.craft("binTAlt", "binT", this._binShape))
    this._binStructure[this._binStructure.length - 1].position.set(0, 1.2, -0.3)
    this._binStructure[this._binStructure.length - 1].rotation.z = -Math.PI / 12

    this._binShape.position.set(-2.25, 0, 0.3)

    this._meshHolder.add(this._binShape)
  }

  createTrolleyShape () {
    this._trolleyShape = new THREE.Object3D()
    this._trolleyShape.textKey = "bTrolley"
    this._trolleyShape.text = "I found this trolley near a dump. Much useful to carry things around."
    this._trolleyShape.textAction = "bubble"

    // Frame
    this._trolleyStructure = []
    // Right side
    this._trolleyStructure.push(this.craft("trolleyS1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0, 0.125, 0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.y = Math.PI / 48
    this._trolleyStructure.push(this.craft("trolleyS2", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.375, 0.275, 0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, -Math.PI / 8)
    this._trolleyStructure.push(this.craft("trolleyS1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.05, 0.425, 0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, Math.PI / 48)
    this._trolleyStructure.push(this.craft("trolleyS3", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.425, 0.575, 0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, Math.PI / 16)
    this._trolleyStructure.push(this.craft("trolleyS4", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.475, 0.575, 0.22)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, 0)
    this._trolleyStructure.push(this.craft("trolleyS5", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0, 0.7625, 0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, -Math.PI / 38)
    this._trolleyStructure.push(this.craft("trolleyS6", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.55, 0.825, 0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, 0, -Math.PI / 8)

    // Left side
    this._trolleyStructure.push(this.craft("trolleyS1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0, 0.125, -0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.y = -Math.PI / 48
    this._trolleyStructure.push(this.craft("trolleyS2", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.375, 0.275, -0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, -Math.PI / 8)
    this._trolleyStructure.push(this.craft("trolleyS1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.05, 0.425, -0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, Math.PI / 48)
    this._trolleyStructure.push(this.craft("trolleyS3", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.425, 0.575, -0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, Math.PI / 16)
    this._trolleyStructure.push(this.craft("trolleyS4", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.475, 0.575, -0.22)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, 0)
    this._trolleyStructure.push(this.craft("trolleyS5", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0, 0.7625, -0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, -Math.PI / 38)
    this._trolleyStructure.push(this.craft("trolleyS6", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.55, 0.825, -0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, 0, -Math.PI / 8)

    // Front and rear
    this._trolleyStructure.push(this.craft("trolleyF1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.425, 0.125, 0)
    this._trolleyStructure.push(this.craft("trolleyB1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.375, 0.4, 0)
    this._trolleyStructure.push(this.craft("trolleyF1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.475, 0.45, 0)
    this._trolleyStructure.push(this.craft("trolleyF1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.475, 0.725, 0)
    this._trolleyStructure.push(this.craft("trolleyB1", "trolley", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.475, 0.8, 0)
    this._trolleyStructure.push(this.craft("trolleyB2", Utils3.randomColorMaterial({lightness: 40}), this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.625, 0.8625, 0)

    // Grid
    this._trolleyStructure.push(this.craft("trolleyG1", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.05, 0.425, 0)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, Math.PI / 48, 0)
    this._trolleyStructure.push(this.craft("trolleyG2", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.475, 0.575, 0)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 2, 0)
    this._trolleyStructure.push(this.craft("trolleyG3", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.425, 0.575, 0)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, Math.PI / 16 + Math.PI / 2, Math.PI / 2)
    this._trolleyStructure.push(this.craft("trolleyG4", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.025, 0.575, 0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, Math.PI / 48)
    this._trolleyStructure.push(this.craft("trolleyG5", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.0125, 0.7, 0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, Math.PI / 48, -Math.PI / 48)
    this._trolleyStructure.push(this.craft("trolleyG4", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.025, 0.575, -0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, Math.PI / 48)
    this._trolleyStructure.push(this.craft("trolleyG5", "trolleyG", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.0125, 0.7, -0.25)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(0, -Math.PI / 48, -Math.PI / 48)

    // Wheels
    this._trolleyStructure.push(this.craft("trolleyW", "black", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.425, 0.05, 0.225)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 8)
    this._trolleyStructure.push(this.craft("trolleyW", "black", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(0.425, 0.05, -0.225)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 8)
    this._trolleyStructure.push(this.craft("trolleyW", "black", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.425, 0.05, 0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 8)
    this._trolleyStructure.push(this.craft("trolleyW", "black", this._trolleyShape))
    this._trolleyStructure[this._trolleyStructure.length - 1].position.set(-0.425, 0.05, -0.275)
    this._trolleyStructure[this._trolleyStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 8)

    this._trolleyShape.position.set(-0.75, 0, -1)
    this._trolleyShape.rotation.y = Math.PI / 3

    this._meshHolder.add(this._trolleyShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0xffffff, this._ctx._gamma)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xd9c726, 0.7, 20)
    this._point.position.set(1, 2.4, 1.5)
    this._lights.add(this._point)

    this._meshHolder.add(this._lights)

    // Fog
    this._ctx._scene.fog = new THREE.FogExp2(0x000000, 0.04)
  }

  // Allow to craft thing easily
  craft (geometry, material, parent) {
    let child
    const trueGeometry = typeof(geometry) == "string" ? this._g[geometry] : geometry
    const trueMaterial = typeof(material) == "string" ? this._m[material] : material
    child = new THREE.Mesh(trueGeometry, trueMaterial)
    parent.add(child)
    return child
  }

  loop () {
    if (!this._kill) { window.requestAnimationFrame(this.loop.bind(this)) }
    const flash = Math.random() < 0.95 ? 1 : 0.8
    const intensity = 0.7 * flash - Math.sin(Date.now() / 500) * 0.025
    this._point.intensity = intensity
  }

  remove () {
    this._ctx._scene.remove(this._meshHolder)
    this._ctx._scene.fog = false
    this._kill = true
  }
}
