class RoomBridge {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._roomLength = 5
    this._ctx._roomDepth = 5
    this._ctx._fixedTime = 0.5

    this.initGeometry()
    this.initMaterial()

    this.createLight()
    this.createRoomShape()

    this.loop()
    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: 1, y: 0, z: 2.2}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneGeometry(50, 5, 1, 1)
    this._g.wall = new THREE.BoxGeometry(50, 3, 0.2)
    this._g.roofLight = new THREE.SphereGeometry(0.2, 8, 8)
    this._g.roofLightH = new THREE.CylinderGeometry(0.225, 0.225, 0.05, 13)
    this._g.door = new THREE.BoxGeometry(1.2, 2.2, 0.1)
    this._g.doorF = new THREE.BoxGeometry(1.4, 2.3, 0.05)
    this._g.doorH = new THREE.BoxGeometry(0.05, 0.3, 0.05)
    this._g.bridgeP = new THREE.BoxGeometry(1.5, 10, 3)
    this._g.bridgePAlt = new THREE.BoxGeometry(1, 1, 50)
    this._g.bridgeL1 = new THREE.BoxGeometry(1, 1, 5)
    this._g.bridgeL2 = new THREE.BoxGeometry(0.75, 5, 0.75)
    this._g.bridgeL3 = new THREE.BoxGeometry(8, 0.2, 0.5)
    this._g.road = new THREE.PlaneGeometry(8, 50, 1, 1)

  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Common
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.black = new THREE.MeshStandardMaterial({color: 0x393939, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.rod = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.5, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0x727270, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0x927f70, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.glassB = new THREE.MeshStandardMaterial({color: 0x8f351f, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f1e5, metalness: 0, roughness: 1, opacity: 0.8, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0x324937, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0x8f8f8f, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.bridgeP = new THREE.MeshStandardMaterial({color: 0xfffedb, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bridgeL = new THREE.MeshStandardMaterial({color: 0xf9493d, flatShading: true, metalness: 0, roughness: 0.7})

  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2

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
        geometry = new THREE.PlaneGeometry(0.1 + Math.random() * 0.5, 0.1 + Math.random() * 0.5, 1, 1)
      } else {
        geometry = new THREE.CircleGeometry(0.1 + Math.random() * 0.2, Math.floor(Math.random() * 4) + 5)
      }
      const material = Utils3.randomColorMaterial({saturation: 50, lightness: 25 + Math.floor(Math.random() * 25)})
      this._wall.push(this.craft(geometry, material, this._graffitiHolder))
      this._wall[this._wall.length - 1].position.set(moistureDistance + 0.00001 * i, Math.random() * 2.6 + 0.2, Math.random() * 2 + 1)
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

  // Shape template
  createShapeShape () {
    this._shapeShape = new THREE.Object3D()
    this._shapeShape.textKey = "bShape"
    this._shapeShape.text = "Go further?"
    this._shapeShape.textAction = "bubble"

    this._shapeStructure = []
    this._shapeStructure.push(this.craft("shapeStructureB", "shapeStructure", this._shapeShape))
    this._shapeStructure[this._shapeStructure.length - 1].position.set(0, 0, 0)

    this._shapeShape.position.set(0, 0, 0)

    this._meshHolder.add(this._shapeShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0x111111)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xd9c726, 0.7, 10)
    this._point.position.set(1, 2.4, 1.5)
    this._lights.add(this._point)

    this._meshHolder.add(this._lights)

    // Fog
    this._ctx._scene.fog = new THREE.FogExp2(0xefd1b5, 0.04)
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
