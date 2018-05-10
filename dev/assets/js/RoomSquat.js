class RoomSquat {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._roomLength = 5
    this._ctx._roomDepth = 5
    this._ctx._fixedTime = false

    this.initGeometry()
    this.initMaterial()

    this.createLight()
    this.createRoomShape()
    this.createBedShape()
    this.createTableShape()
    this.createTVShape()
    this.createKitchenShape()
    this.createWardrobeShape()

    this.loop()
    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: 1, y: 0, z: 2.2}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneGeometry(5, 5, 1, 1)
    this._g.carpet = new THREE.BoxGeometry(3, 0.05, 2)
    this._g.wall = new THREE.BoxGeometry(5, 3, 0.2)
    this._g.wallB = new THREE.BoxGeometry(5, 1.2, 0.2)
    this._g.wallS = new THREE.BoxGeometry(1.5, 1.8, 0.2)
    this._g.wallT = new THREE.BoxGeometry(2, 0.2, 0.2)
    this._g.glass = new THREE.BoxGeometry(2, 1, 0.1)
    this._g.glassB = new THREE.BoxGeometry(2, 0.1, 0.15)
    this._g.roofLight = new THREE.CylinderGeometry(0.075, 0.075, 0.15, 7)
    this._g.roofLightH = new THREE.BoxGeometry(0.05, 0.4, 0.05)
    this._g.door = new THREE.BoxGeometry(1.2, 2.2, 0.1)
    this._g.doorH = new THREE.BoxGeometry(0.2, 0.1, 0.05)
    this._g.paper = new THREE.PlaneGeometry(0.15, 0.15, 1, 1)

    // Bed
    this._g.bedL = new THREE.BoxGeometry(0.05, 0.1, 0.75)
    this._g.bedS = new THREE.BoxGeometry(0.15, 0.6, 0.8)
    this._g.bedB = new THREE.BoxGeometry(1.7, 0.2, 0.8)
    this._g.bedR = new THREE.BoxGeometry(1.7, 0.6, 0.1)
    this._g.bedM = new THREE.BoxGeometry(0.825, 0.2, 0.6)

    // Table
    this._g.tableL = new THREE.BoxGeometry(0.05, 0.5, 0.05)
    this._g.tableT = new THREE.BoxGeometry(1.5, 0.05, 0.75)
    this._g.remote = new THREE.BoxGeometry(0.1, 0.05, 0.25)
    this._g.can1 = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 6)
    this._g.can2 = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6)
    this._g.halfPaper = new THREE.PlaneGeometry(0.1485, 0.21, 1, 1)

    // TV
    this._g.TVF = new THREE.BoxGeometry(1.8, 1, 0.05)
    this._g.TVB = new THREE.BoxGeometry(1.6, 0.8, 0.1)
    this._g.TVS = new THREE.PlaneGeometry(1.7, 0.9, 1, 1)

    // Kitchen
    this._g.kitchen = new THREE.BoxGeometry(1.65, 0.7, 0.85)
    this._g.kitchenD = new THREE.BoxGeometry(0.7, 0.6, 0.1)
    this._g.kitchenH = new THREE.BoxGeometry(0.05, 0.2, 0.1)
    this._g.kitchenT = new THREE.BoxGeometry(0.8, 0.3, 0.8)
    this._g.kitchenS = new THREE.BoxGeometry(0.8, 0.3, 0.1)
    this._g.kitchenSAlt = new THREE.BoxGeometry(0.1, 0.3, 0.6)
    this._g.kitchenSB = new THREE.PlaneGeometry(0.6, 0.6, 1, 1)
    this._g.kitchenST = new THREE.BoxGeometry(0.05, 0.025, 0.5)
    this._g.kitchenSH = new THREE.BoxGeometry(0.05, 0.025, 0.15)
    this._g.microwave = new THREE.BoxGeometry(0.6, 0.3, 0.4)
    this._g.microwaveG = new THREE.BoxGeometry(0.4, 0.25, 0.05)
    this._g.microwaveC = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 7)

    // Wardrobe
    this._g.wardrobe = new THREE.BoxGeometry(0.4, 0.05, 1.5)
    this._g.wardrobeH = new THREE.BoxGeometry(0.05, 0.3, 0.05)

  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Common
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.black = new THREE.MeshStandardMaterial({color: 0x393939, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.rod = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.5, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0x3d3845, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.roof = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading: true, metalness: 0.5, roughness: 1})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xa13c23, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.glassB = new THREE.MeshStandardMaterial({color: 0x8f351f, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f1e5, metalness: 0, roughness: 1, opacity: 0.8, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0x8f352c, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0x341b16, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Bed
    this._m.bed = new THREE.MeshStandardMaterial({color: 0x2b4207, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Table

    // TV
    this._m.TV = new THREE.MeshStandardMaterial({color: 0x494949, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.TVS = new THREE.MeshStandardMaterial({color: 0x898989, flatShading: true, metalness: 0.1, roughness: 0.5})

    // Kitchen
    this._m.kitchen = new THREE.MeshStandardMaterial({color: 0x7e330c, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.kitchenAlt = new THREE.MeshStandardMaterial({color: 0xbd4c12, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.kitchenS = new THREE.MeshStandardMaterial({color: 0xa17842, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.microwave = Utils3.randomColorMaterial({lightness: 40, saturation: 50})

    // Wardrobe
    this._m.wardrobe = new THREE.MeshStandardMaterial({color: 0x543926, flatShading: true, metalness: 0, roughness: 0.7})

  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2
    this._roof = this.craft("room", "roof", this._roomShape)
    this._roof.rotation.x = Math.PI / 2
    this._roof.position.y = 3
    this._carpet = this.craft("carpet", Utils3.randomColorMaterial({lightness: 30, saturation: 40}), this._roomShape)
    this._carpet.rotation.y = -Math.PI / 8
    this._carpet.position.set(-0.25, 0, 0.5)

    this._roofLightHolder = new THREE.Object3D()
    this._roofLightHolder.textKey = "sqLight"
    let lightNum = 0
    if (this._ctx._textMemory["hLight"]) { lightNum++ }
    if (this._ctx._textMemory["cLight"]) { lightNum++ }
    if (this._ctx._textMemory["sLight"]) { lightNum++ }
    this._roofLightHolder.text = this._ctx._lightMessage[lightNum]
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = this.craft("roofLight", "roofLight", this._roofLightHolder)
    this._roofLight.position.y = 2.52
    this._roofLightH = this.craft("roofLightH", "rod", this._roofLightHolder)
    this._roofLightH.position.y = 2.8

    this._roomShape.add(this._roofLightHolder)

    // Building walls
    this._wall = []
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(2.6, 1.5, 0)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(-2.6, 1.5, 0)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 1.5, 2.6)

    // Moisted left wall
    this._moistureHolder = new THREE.Object3D()
    this._moistureHolder.textKey = "sqMoisture"
    this._moistureHolder.text = "This wall was full of mold, that can be considered as art at this point..."
    this._moistureHolder.textAction = "bubble"
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.PlaneGeometry(0.1 + Math.random() * 0.4, 0.1 + Math.random() * 0.4, 1, 1)
      const material = Utils3.randomColorMaterial({hue: 10, saturation: 50, lightness: 25 + Math.floor(Math.random() * 25)})
      this._wall.push(this.craft(geometry, material, this._moistureHolder))
      this._wall[this._wall.length - 1].position.set(0.00001 * i, Math.random() * 3, Math.random() * 5 - 2.5)
      this._wall[this._wall.length - 1].rotation.y = Math.PI / 2
    }
    this._moistureHolder.position.set(-2.49, 0, 0)
    this._roomShape.add(this._moistureHolder)

    // Building window
    this._window = new THREE.Object3D()
    this._wall.push(this.craft("wallB", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 0.6, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(1.75, 2.1, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(-1.75, 2.1, 0)
    this._wall.push(this.craft("wallT", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.9, 0)
    this._wall.push(this.craft("glass", "glass", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.3, 0)
    this._wall.push(this.craft("glassB", "glassB", this._window))
    this._wall[this._wall.length - 1].position.set(0, 1.75, 0)
    this._wall.push(this.craft("glassB", "glassB", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.05, 0)

    this._window.position.z = -2.6
    this._roomShape.add(this._window)

    // Door
    this._door = new THREE.Object3D()
    this._door.textKey = "sqDoor"
    this._door.text = "Go further?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.1, 0)
    this._doorPart.push(this.craft("doorH", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.15, -0.05)
    this._doorPart[this._doorPart.length - 1].rotation.z = -Math.PI / 16

    if (this._ctx._textMemory["sMessage"]) {
      // Vico's tree alt
      this._messageHolder = new THREE.Object3D()
      this._messageHolder.textKey = "sqMessage"
      this._messageHolder.text = "Vico asked me to meet him tonight! He can probably help me to get back on rail."
      this._messageHolder.textAction = "bubble"
      this._doorPart.push(this.craft("paper", Utils3.randomColorMaterial({lightness: 70}), this._messageHolder))
      this._doorPart[this._doorPart.length - 1].position.set(0, 1.5, -0.051)
      this._doorPart[this._doorPart.length - 1].rotation.set(Math.PI, 0, Math.random() * 0.5 - 0.25 + Math.PI / 2)
      this._door.add(this._messageHolder)
    }

    this._door.position.set(1, 0, 2.5)
    this._roomShape.add(this._door)

    this._meshHolder.add(this._roomShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()
    this._bedShape.textKey = "sqBed"
    this._bedShape.text = "I used to sleep in this sofa made with old spring."
    this._bedShape.textAction = "bubble"

    this._bedStructure = []
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.9, 0.05, 0)
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.9, 0.05, 0)
    this._bedStructure.push(this.craft("bedB", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.2, 0)
    this._bedStructure.push(this.craft("bedR", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.5, -0.4)
    this._bedStructure[this._bedStructure.length - 1].rotation.x = -Math.PI / 16
    this._bedStructure.push(this.craft("bedS", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.925, 0.4, 0)
    this._bedStructure.push(this.craft("bedS", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.925, 0.4, 0)
    this._bedStructure.push(this.craft("bedM", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.42, 0.4, 0.125)
    this._bedStructure.push(this.craft("bedM", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.42, 0.4, 0.125)
    this._bedStructure.push(this.craft("bedM", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.42, 0.7, -0.3)
    this._bedStructure[this._bedStructure.length - 1].rotation.x = Math.PI / 2.5
    this._bedStructure.push(this.craft("bedM", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.42, 0.7, -0.3)
    this._bedStructure[this._bedStructure.length - 1].rotation.x = Math.PI / 2.5

    this._bedShape.position.set(-0.75, 0, -1.5)
    this._bedShape.rotation.y = -Math.PI / 16

    this._meshHolder.add(this._bedShape)
  }

  createTableShape () {
    this._tableShape = new THREE.Object3D()
    this._tableShape.textKey = "sqTable"
    this._tableShape.text = "A table where you can eat, but also a nightstand, amazing uh?"
    this._tableShape.textAction = "bubble"

    this._tableStructure = []
    this._tableStructure.push(this.craft("tableL", "rod", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(0.65, 0.25, 0.275)
    this._tableStructure.push(this.craft("tableL", "rod", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(-0.65, 0.25, 0.275)
    this._tableStructure.push(this.craft("tableL", "rod", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(0.65, 0.25, -0.275)
    this._tableStructure.push(this.craft("tableL", "rod", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(-0.65, 0.25, -0.275)
    this._tableStructure.push(this.craft("tableT", "glass", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(0, 0.525, 0)
    this._tableStructure.push(this.craft("tableT", "glass", this._tableShape))
    this._tableStructure[this._tableStructure.length - 1].position.set(0, 0.25, 0)

    if (!this._ctx._textMemory["sMessage"]) {
      // Vico's tree alt
      this._messageHolder = new THREE.Object3D()
      this._messageHolder.textKey = "sqMessage"
      this._messageHolder.text = "Hey but that's Vico's phone number! He can probably help me to get back on rail."
      this._messageHolder.textAction = "bubble"
      this._tableStructure.push(this.craft("halfPaper", "white", this._messageHolder))
      this._tableStructure[this._tableStructure.length - 1].position.set(Math.random() - 0.5, 0.2751, -0.3)
      this._tableStructure[this._tableStructure.length - 1].rotation.set(-Math.PI / 2, 0, Math.random())
      this._tableShape.add(this._messageHolder)
    }

    // Items
    this._tableItems = []
    this._tableItems.push(this.craft("remote", "black", this._tableShape))
    this._tableItems[this._tableItems.length - 1].position.y = 0.575
    this._tableItems[this._tableItems.length - 1].rotation.y = Math.random() - 0.5
    this._tableItems.push(this.craft("can1", Utils3.randomColorMaterial(), this._tableShape))
    this._tableItems[this._tableItems.length - 1].position.y = 0.6325
    this._tableItems.push(this.craft("can1", Utils3.randomColorMaterial(), this._tableShape))
    this._tableItems[this._tableItems.length - 1].position.y = 0.6325
    this._tableItems.push(this.craft("can2", Utils3.randomColorMaterial(), this._tableShape))
    this._tableItems[this._tableItems.length - 1].position.y = 0.65

    for (let i = 0; this._tableItems.length; i++) {
      const offset = -0.45 + 0.3 * i
      const item = this._tableItems.splice(Math.floor(Math.random() * this._tableItems.length), 1)[0]
      item.position.x = offset + Math.random() * 0.2 - 0.1
      item.position.z = Math.random() * 0.6 - 0.3
    }

    this._tableShape.position.set(-0.75, 0, 0.75)
    this._tableShape.rotation.y = Math.PI / 16

    this._meshHolder.add(this._tableShape)
  }

  createTVShape () {
    this._TVShape = new THREE.Object3D()
    this._TVShape.textKey = "sqTV"
    this._TVShape.text = "A big flat screen TV, probably the most fancy thing that i owned at this period of my life haha."
    this._TVShape.textAction = "bubble"

    this._TVStructure = []
    this._TVStructure.push(this.craft("TVF", "TV", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(0, 0, -0.025)
    this._TVStructure.push(this.craft("TVB", "TV", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(0, 0, 0.05)
    this._TVStructure.push(this.craft("TVS", "TVS", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(0, 0, -0.0501)
    this._TVStructure[this._TVStructure.length - 1].rotation.y = Math.PI

    this._TVShape.position.set(-1, 1.5, 2.4)

    this._meshHolder.add(this._TVShape)
  }

  createKitchenShape () {
    this._kitchenShape = new THREE.Object3D()
    this._kitchenShape.textKey = "sqKitchen"
    this._kitchenShape.text = "A sink and a microwave, you need nothing more to be a real chef."
    this._kitchenShape.textAction = "bubble"

    // Bottom
    this._kitchenStructure = []
    this._kitchenStructure.push(this.craft("kitchen", "kitchen", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0, 0.35, 0)
    this._kitchenStructure.push(this.craft("kitchenD", "kitchenAlt", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.4, 0.35, 0.4)
    this._kitchenStructure.push(this.craft("kitchenH", "kitchen", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.15, 0.35, 0.45)
    this._kitchenStructure.push(this.craft("kitchenD", "kitchenAlt", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.4, 0.35, 0.4)
    this._kitchenStructure.push(this.craft("kitchenH", "kitchen", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.15, 0.35, 0.45)

    // Sink
    this._kitchenStructure.push(this.craft("kitchenT", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.4, 0.85, 0)
    this._kitchenStructure.push(this.craft("kitchenSB", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.4, 0.71, 0)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.x = -Math.PI / 2
    this._kitchenStructure.push(this.craft("kitchenS", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.4, 0.85, 0.35)
    this._kitchenStructure.push(this.craft("kitchenS", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.4, 0.85, -0.35)
    this._kitchenStructure.push(this.craft("kitchenSAlt", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.05, 0.85, 0)
    this._kitchenStructure.push(this.craft("kitchenSAlt", "kitchenS", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.75, 0.85, 0)
    this._kitchenStructure.push(this.craft("kitchenST", "rod", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.2, 1.06, -0.1)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.set(-Math.PI / 12 , Math.PI / 8, Math.PI / 24)
    this._kitchenStructure.push(this.craft("kitchenSH", "rod", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(0.05, 1.005, -0.2)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.x = -Math.PI / 16

    // Microwave
    this._kitchenStructure.push(this.craft("microwave", "microwave", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.4, 1.15, -0.1)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.y = Math.PI / 8
    this._kitchenStructure.push(this.craft("microwaveG", "glass", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.4, 1.15, 0.11)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.y = Math.PI / 8
    this._kitchenStructure.push(this.craft("microwaveC", "black", this._kitchenShape))
    this._kitchenStructure[this._kitchenStructure.length - 1].position.set(-0.15, 1.2, -0.025)
    this._kitchenStructure[this._kitchenStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 8)

    this._kitchenShape.rotation.y = -Math.PI / 2
    this._kitchenShape.position.set(2, 0, -1.6)

    this._meshHolder.add(this._kitchenShape)
  }

  createWardrobeShape () {
    this._wardrobeShape = new THREE.Object3D()
    this._wardrobeShape.textKey = "sqWardrobe"
    if (this._ctx._textMemory["sWardrobe"]) {
      this._wardrobeShape.text = "Being a wardrobe magician wasn't that fun now."
    } else {
      this._wardrobeShape.text = "Some planks and here you go, a wardrobe!"
    }
    this._wardrobeShape.textAction = "bubble"

    this._wardrobeStructure = []
    for (let i = 0; i < 3; i++) {
      const yOffset = 1 + i * 0.5
      this._wardrobeStructure.push(this.craft("wardrobe", "wardrobe", this._wardrobeShape))
      this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, yOffset, 0)
      this._wardrobeStructure.push(this.craft("wardrobeH", "rod", this._wardrobeShape))
      this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0.1, yOffset - 0.1, 0.7)
      this._wardrobeStructure[this._wardrobeStructure.length - 1].rotation.z = Math.PI / 4
      this._wardrobeStructure.push(this.craft("wardrobeH", "rod", this._wardrobeShape))
      this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0.1, yOffset - 0.1, -0.7)
      this._wardrobeStructure[this._wardrobeStructure.length - 1].rotation.z = Math.PI / 4

      const clothesSlots = [
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2)
      ]
      for (let i = 0; i < clothesSlots.length; i++) {
        if (clothesSlots[i]) {
          const zOffset = i * 0.4 + Math.floor(Math.random()) * 0.1
          const height = Math.floor(Math.random() * 3 + 1) * 0.05
          const geometry = new THREE.BoxGeometry(
            Math.floor(Math.random() * 3) * 0.05 + 0.2,
            height,
            Math.floor(Math.random() * 3) * 0.05 + 0.2
          )
          const material = Utils3.randomColorMaterial({lightness: 40, saturation: 30})
          this._wardrobeStructure.push(this.craft(geometry, material, this._wardrobeShape))
          this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, yOffset + 0.025 + height / 2, -0.6 + zOffset)
        }
      }
    }

    this._wardrobeShape.position.set(2.3, 0, 1)

    this._meshHolder.add(this._wardrobeShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0x111111)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xd9c726, 0.7, 10)
    this._point.position.y = 2.4
    this._lights.add(this._point)

    this._meshHolder.add(this._lights)
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
    this._kill = true
  }
}
