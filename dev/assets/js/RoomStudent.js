class RoomStudent {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._fixedTime = false
    this._ctx._roomLength = 5
    this._ctx._roomDepth = 5
    // Window var
    this._angle = Math.PI / 4
    this._zOffset = Math.sin(this._angle) * 3 / 2

    this.initGeometry()
    this.initMaterial()

    this.createLight()
    this.createRoomShape()
    this.createBedShape()
    this.createNightstandShape()
    this.createWardrobeShape()
    this.createDeskShape()
    this.createChairShape()
    this.createCanvasShape()
    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: -2, y: 0, z: 1.5}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneGeometry(5, 7, 1, 1)
    this._g.wall = new THREE.BoxGeometry(5, 3, 0.2)
    this._g.bWall = new THREE.BoxGeometry(6, 9, 0.2)
    this._g.wallB = new THREE.BoxGeometry(5, 0.6, 0.2)
    this._g.wallS = new THREE.BoxGeometry(1, 1.8, 0.2)
    this._g.wallT = new THREE.BoxGeometry(5, 1, 0.2)
    this._g.glass = new THREE.BoxGeometry(3, 1.8, 0.1)
    this._g.roofLight = new THREE.BoxGeometry(0.6, 0.3, 0.05)
    this._g.door = new THREE.BoxGeometry(1.2, 2.2, 0.1)
    this._g.doorH = new THREE.BoxGeometry(0.2, 0.1, 0.05)

    // Bed
    this._g.bedB = new THREE.BoxGeometry(1.9, 0.25, 2.3)
    this._g.bedT = new THREE.BoxGeometry(2, 0.1, 2.4)
    this._g.bedM1 = new THREE.BoxGeometry(1.8, 0.2, 2.2)
    this._g.bedM2 = new THREE.BoxGeometry(1.9125, 0.25, 1.8)
    this._g.bedP = new THREE.BoxGeometry(0.8, 0.2, 0.5)

    // Nightstand
    this._g.nightstandS = new THREE.BoxGeometry(0.8, 0.7, 0.7)
    this._g.nightstandD = new THREE.BoxGeometry(0.7, 0.25, 0.6)
    this._g.nightstandH = new THREE.BoxGeometry(0.2, 0.05, 0.1)
    this._g.picture = new THREE.BoxGeometry(0.2, 0.25, 0.05)
    this._g.pictureH = new THREE.BoxGeometry(0.05, 0.15, 0.05)
    this._g.pictureF = new THREE.PlaneGeometry(0.15, 0.2, 1, 1)

    // Wardrobe
    this._g.wardrobeL = new THREE.BoxGeometry(0.6, 1.1, 1.5)
    this._g.wardrobeLD = new THREE.BoxGeometry(0.1, 0.45, 1.4)
    this._g.wardrobeLH = new THREE.BoxGeometry(0.1, 0.05, 0.2)
    this._g.wardrobeR = new THREE.BoxGeometry(0.6, 2.2, 0.1)
    this._g.wardrobeRH = new THREE.BoxGeometry(0.55, 0.05, 1.3)
    this._g.wardrobeRR = new THREE.BoxGeometry(0.05, 0.05, 1.3)
    this._g.wardrobeRT = new THREE.BoxGeometry(0.6, 0.1, 1.3)
    this._g.wardrobeRC1 = new THREE.BoxGeometry(0.3, 1, 0.05)
    this._g.wardrobeRC2 = new THREE.BoxGeometry(0.4, 0.8, 0.05)
    this._g.wardrobeRC3 = new THREE.BoxGeometry(0.5, 0.6, 0.05)
    this._g.torusKnot = new THREE.TorusKnotGeometry(0.075, 0.02, 32, 12)

    // Desk
    this._g.deskL = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 5)
    this._g.deskT = new THREE.BoxGeometry(2, 0.05, 0.8)
    this._g.screenB = new THREE.BoxGeometry(0.2, 0.05, 0.1)
    this._g.screenP = new THREE.BoxGeometry(0.05, 0.2, 0.05)
    this._g.screen = new THREE.BoxGeometry(0.6, 0.35, 0.05)
    this._g.screenF = new THREE.PlaneGeometry(0.55, 0.3, 1, 1)
    this._g.keyboard = new THREE.BoxGeometry(0.575, 0.05, 0.2)
    this._g.keyboardK1 = new THREE.BoxGeometry(0.35, 0.05, 0.15)
    this._g.keyboardK2 = new THREE.BoxGeometry(0.15, 0.05, 0.15)
    this._g.mouse = new THREE.BoxGeometry(0.075, 0.05, 0.1)
    this._g.case = new THREE.BoxGeometry(0.3, 0.6, 0.7)

    // Chair
    this._g.chairL = new THREE.BoxGeometry(0.7, 0.05, 0.05)
    this._g.chairW = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 7)
    this._g.chairP = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 5)
    this._g.chairB = new THREE.BoxGeometry(0.5, 0.15, 0.5)
    this._g.chairBAlt = new THREE.BoxGeometry(0.5, 0.15, 0.3)
    this._g.chairF = new THREE.BoxGeometry(0.5, 0.1, 0.1)

    // Canvas
    this._g.canvas = new THREE.BoxGeometry(0.05, 1, 1.8)

  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Common
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.black = new THREE.MeshStandardMaterial({color: 0x393939, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.rod = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.5, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0xbf9978, flatShading: true, metalness: 0.1, roughness: 0.7})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0.1, roughness: 0.7})
    this._m.wallAlt = new THREE.MeshStandardMaterial({color: 0xbfecee, flatShading: true, metalness: 0, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0x8fede9, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0xbebebe, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0x9e9e9e, flatShading: true, metalness: 0.4, roughness: 0.5})

    // Bed
    this._m.bed = new THREE.MeshStandardMaterial({color: 0xfd8250, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.bedAlt = new THREE.MeshStandardMaterial({color: 0xed7240, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.matress = Utils3.randomColorMaterial({lightness: 70})

    // Nightstand
    this._m.nightstandS = new THREE.MeshStandardMaterial({color: 0xffe2c3, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.nightstandD = new THREE.MeshStandardMaterial({color: 0xe2874e, flatShading: true, metalness: 0.1, roughness: 0.5})

    // Wardrobe
    this._m.wardrobe = new THREE.MeshStandardMaterial({color: 0xba8340, flatShading: true, metalness: 0.1, roughness: 0.7})
    this._m.wardrobeD = new THREE.MeshStandardMaterial({color: 0xf7ae55, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.torusKnot = new THREE.MeshStandardMaterial({color: 0xed0707, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Desk
    this._m.deskT = new THREE.MeshStandardMaterial({color: 0xa7473b, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.screen = new THREE.MeshStandardMaterial({color: 0x494949, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.keyboard = new THREE.MeshStandardMaterial({color: 0x898989, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.case = new THREE.MeshStandardMaterial({color: 0xd60606, flatShading: true, metalness: 0.1, roughness: 0.7})
  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2
    this._floor.position.z = - this._zOffset / 2
    this._roof = this.craft("room", "wall", this._roomShape)
    this._roof.rotation.x = Math.PI / 2
    this._roof.position.set(0, 3, 0.7 + this._zOffset)

    this._roofLightHolder = new THREE.Object3D()
    this._roofLightHolder.textKey = "sLight"
    let lightNum = 0
    if (this._ctx._textMemory["hLight"]) { lightNum++ }
    if (this._ctx._textMemory["cLight"]) { lightNum++ }
    this._roofLightHolder.text = this._ctx._lightMessage[lightNum]
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = []
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0, 0, 0.2)
    this._roofLight[this._roofLight.length - 1].rotation.x = -Math.PI / 3
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(-0.2, 0, 0)
    this._roofLight[this._roofLight.length - 1].rotation.set(Math.PI / 2, Math.PI / 6, Math.PI / 2)
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0, 0, -0.2)
    this._roofLight[this._roofLight.length - 1].rotation.x = Math.PI / 3
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0.2, 0, 0)
    this._roofLight[this._roofLight.length - 1].rotation.set(Math.PI / 2, -Math.PI / 6, Math.PI / 2)

    this._roofLightHolder.position.y = 2.9
    this._roomShape.add(this._roofLightHolder)

    // Building walls
    this._wall = []
    this._wall.push(this.craft("bWall", "wallAlt", this._roomShape))
    this._wall[this._wall.length - 1].position.set(2.6, 1.5, this._zOffset)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    this._wall[this._wall.length - 1].rotation.x = this._angle
    this._wall.push(this.craft("bWall", "wallAlt", this._roomShape))
    this._wall[this._wall.length - 1].position.set(-2.6, 1.5, this._zOffset)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    this._wall[this._wall.length - 1].rotation.x = this._angle
    this._wall.push(this.craft("wall", "wallAlt", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 1.5, 2.6)
    this._wall.push(this.craft("wallT", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 0.5, -2.6 - this._zOffset)

    // Building window
    this._window = new THREE.Object3D()
    this._wall.push(this.craft("wallB", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 0.3, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(2, 1.5, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(-2, 1.5, 0)
    this._wall.push(this.craft("wallB", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.7, 0)
    this._wall.push(this.craft("glass", "glass", this._window))
    this._wall[this._wall.length - 1].position.set(0, 1.5, 0)

    this._window.position.set(0, 3.1 - Math.cos(this._angle) * 3, -2.6 - this._zOffset)
    this._window.rotation.x = this._angle
    this._roomShape.add(this._window)

    // Door
    this._door = new THREE.Object3D()
    this._door.textKey = "sDoor"
    this._door.text = "Go further ?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.1, 0)
    this._doorPart.push(this.craft("doorH", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.15, -0.05)

    this._door.rotation.y = -Math.PI / 2
    this._door.position.set(-2.5, 0, 1.5)
    this._roomShape.add(this._door)

    this._meshHolder.add(this._roomShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()
    this._bedShape.textKey = "sBed"
    this._bedShape.text = "I went for a wider bed, so i was able to enjoy better nights, especially after watching streamings."
    this._bedShape.textAction = "bubble"

    this._bedStructure = []
    this._bedStructure.push(this.craft("bedB", "bedAlt", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.125, 0)
    this._bedStructure.push(this.craft("bedT", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.3, 0)
    this._bedStructure.push(this.craft("bedM1", "white", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.45, 0)
    this._bedStructure.push(this.craft("bedM2", "matress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.475, 0.25)
    this._bedStructure.push(this.craft("bedP", "white", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.525, -0.8)
    this._bedStructure[this._bedStructure.length - 1].rotation.x = Math.PI / 16

    this._bedShape.position.set(0, 0, -1.2 - this._zOffset)

    this._meshHolder.add(this._bedShape)
  }

  createNightstandShape () {
    this._nightstandShape = new THREE.Object3D()
    this._nightstandShape.textKey = "sNightstand"
    this._nightstandShape.text = "Still using the same nightstand that i used during my childhood, impressively durable."
    this._nightstandShape.textAction = "bubble"

    this._nightstandStructure = []
    this._nightstandStructure.push(this.craft("nightstandS", "nightstandS", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.35, 0)
    this._nightstandStructure.push(this.craft("nightstandD", "nightstandD", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.175, 0.1)
    this._nightstandStructure.push(this.craft("nightstandH", "nightstandS", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.25, 0.375)
    this._nightstandStructure.push(this.craft("nightstandD", "nightstandD", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.525, 0.1)
    this._nightstandStructure.push(this.craft("nightstandH", "nightstandS", this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(0, 0.6, 0.375)

    this._picture = new THREE.Object3D()
    this._picture.textKey = "sPicture"
    this._picture.text = "A picture of Agathe and me at the park."
    this._picture.textAction = "bubble"
    let x = Math.random() * 0.2 - 0.1
    let z = Math.random() * 0.2 - 0.1
    this._nightstandStructure.push(this.craft("picture", "bedAlt", this._picture))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(x, 0.825, z)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.set(-Math.PI / 16, 0, 0)
    this._nightstandStructure.push(this.craft("pictureH", "bedAlt", this._picture))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(x, 0.775, z - 0.05)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.x = Math.PI / 8
    this._nightstandStructure.push(this.craft("pictureF", Utils3.randomColorMaterial(), this._picture))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(x, 0.825, z + 0.026)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.set(-Math.PI / 16, 0, 0)

    this._picture.rotation.y = Math.PI / 4
    this._nightstandShape.add(this._picture)

    this._nightstandShape.position.set(-1.7, 0, -1.95 - this._zOffset)

    this._meshHolder.add(this._nightstandShape)
  }

  createWardrobeShape () {
    this._wardrobeShape = new THREE.Object3D()
    this._wardrobeShape.textKey = "sWardrobe"
    if (this._ctx._textMemory["cWardrobe"]) {
      this._wardrobeShape.text = "I'm finally a magician too, just like mom was during my childhood."
    } else {
      this._wardrobeShape.text = "Just a wardrobe, it remember something to me but don't know what..."
    }
    this._wardrobeShape.textAction = "bubble"

    this._wardrobeStructure = []
    // Left part
    this._wardrobeStructure.push(this.craft("wardrobeL", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0.55, -0.75)
    this._wardrobeStructure.push(this.craft("wardrobeLD", "wardrobeD", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.3, 0.825, -0.75)
    this._wardrobeStructure.push(this.craft("wardrobeLH", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.35, 0.925, -0.75)
    this._wardrobeStructure.push(this.craft("wardrobeLD", "wardrobeD", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.3, 0.275, -0.75)
    this._wardrobeStructure.push(this.craft("wardrobeLH", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.35, 0.375, -0.75)
    // Right part
    this._wardrobeStructure.push(this.craft("wardrobeR", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.1, 0.05)
    this._wardrobeStructure.push(this.craft("wardrobeR", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.1, 1.45)
    this._wardrobeStructure.push(this.craft("wardrobeRT", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 2.15, 0.75)
    // Bottom plate
    this._wardrobeStructure.push(this.craft("wardrobeRH", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0.1, 0.75)
    // Rod
    this._wardrobeStructure.push(this.craft("wardrobeRR", "rod", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.2, 0.75)
    // Medium plate
    this._wardrobeStructure.push(this.craft("wardrobeRH", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.35, 0.75)
    // Top Plate
    this._wardrobeStructure.push(this.craft("wardrobeRH", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.75, 0.75)

    // Clothes
    const clothesNumber = Math.floor(Math.random() * 5) + 2
    for (let i = 0; i < clothesNumber; i++) {
      const zOffset = Math.floor(Math.random() * 3) + 1
      this._wardrobeStructure.push(this.craft(`wardrobeRC${zOffset}`, Utils3.randomColorMaterial({lightness: 70}), this._wardrobeShape))
      this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0.65 + zOffset * 0.1, 0.35 + 0.15 * i + Math.random() * 0.1)
    }

    // Torus knot one
    this._torusKnotHolder = new THREE.Object3D()
    this._torusKnotHolder.textKey = "sTorusKnot"
    this._torusKnotHolder.text = "I still took care of my special edition torus knot."
    this._torusKnotHolder.textAction = "bubble"
    this._wardrobeStructure.push(this.craft("torusKnot", "torusKnot", this._torusKnotHolder))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.15, -1.3)
    this._wardrobeStructure[this._wardrobeStructure.length - 1].rotation.x = Math.PI / 2
    this._wardrobeShape.add(this._torusKnotHolder)

    this._wardrobeShape.position.set(2.1, 0, -0.5)

    this._meshHolder.add(this._wardrobeShape)
  }

  createDeskShape () {
    this._deskShape = new THREE.Object3D()
    this._deskShape.textKey = "sDesk"
    this._deskShape.text = "I've done so much work on this desk..."
    this._deskShape.textAction = "bubble"

    // Desk
    this._deskStructure = []
    this._deskStructure.push(this.craft("deskL", "rod", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.8, 0.4, 0.3)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = -Math.PI / 12
    this._deskStructure.push(this.craft("deskL", "rod", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.8, 0.4, 0.3)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = -Math.PI / 12
    this._deskStructure.push(this.craft("deskL", "rod", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.8, 0.4, -0.3)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = Math.PI / 12
    this._deskStructure.push(this.craft("deskL", "rod", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.8, 0.4, -0.3)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = Math.PI / 12
    this._deskStructure.push(this.craft("deskT", "deskT", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 0.9, 0)

    // Screen 1
    this._deskStructure.push(this.craft("screenB", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.575, 0.95, 0.1)
    this._deskStructure[this._deskStructure.length - 1].rotation.y = Math.PI / 8
    this._deskStructure.push(this.craft("screenP", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.6, 1.05, 0.15)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = -Math.PI / 16
    this._deskStructure.push(this.craft("screen", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.6, 1.275, 0.12)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(Math.PI, -Math.PI / 8, 0)

    // Vico's tree part 1
    this._messageHolder = new THREE.Object3D()
    this._messageHolder.textKey = "sMessage"
    this._messageHolder.text = "There is a message from Vico that reminds me that if I have a problem I can count on him, Vico is really a cool guy."
    this._messageHolder.textAction = "bubble"

    this._deskStructure.push(this.craft("screenF", "white", this._messageHolder))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.6, 1.28, 0.0925)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(Math.PI, -Math.PI / 8, 0)

    this._deskShape.add(this._messageHolder)
    // Screen 2
    this._deskStructure.push(this.craft("screenB", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 0.95, 0.225)
    this._deskStructure.push(this.craft("screenP", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 1.05, 0.275)
    this._deskStructure[this._deskStructure.length - 1].rotation.x = -Math.PI / 16
    this._deskStructure.push(this.craft("screen", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 1.275, 0.2475)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(Math.PI, 0, 0)
    this._deskStructure.push(this.craft("screenF", "white", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 1.28, 0.22)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(Math.PI, 0, 0)

    // PC
    this._deskStructure.push(this.craft("keyboard", "screen", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.1125, 0.925, -0.1)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(0, Math.PI / 16, 0)
    this._deskStructure.push(this.craft("keyboardK1", "keyboard", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.2, 0.95, -0.125)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(0, Math.PI / 16, 0)
    this._deskStructure.push(this.craft("keyboardK2", "keyboard", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.075, 0.95, -0.07)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(0, Math.PI / 16, 0)
    this._deskStructure.push(this.craft("mouse", "keyboard", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.4, 0.95, -0.07)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(0, -Math.PI / 16, 0)
    this._deskStructure.push(this.craft("case", "case", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.55, 0.3, 0)

    this._deskShape.position.set(0, 0, 2)

    this._meshHolder.add(this._deskShape)
  }

  createChairShape () {
    this._chairShape = new THREE.Object3D()
    this._chairShape.textKey = "sChair"
    this._chairShape.text = "Dad gifted me this chair from his work. It's so good to work on it (and to move in all my room around while sitting on also)."
    this._chairShape.textAction = "bubble"

    this._chairStructure = []
    // Leg
    this._chairStructure.push(this.craft("chairL", "rod", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.175, 0)
    this._chairStructure.push(this.craft("chairL", "rod", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.175, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.y = Math.PI / 3
    this._chairStructure.push(this.craft("chairL", "rod", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.175, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.y = -Math.PI / 3
    // Wheel
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.35, 0.1, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.35, 0.1, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.35 * Math.cos(Math.PI / 3), 0.1, -0.35 * Math.sin(Math.PI / 3))
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.35 * Math.cos(Math.PI / 3), 0.1, 0.35 * Math.sin(Math.PI / 3))
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.35 * Math.cos(-Math.PI / 3), 0.1, 0.35 * Math.sin(-Math.PI / 3))
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    this._chairStructure.push(this.craft("chairW", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.35 * Math.cos(-Math.PI / 3), 0.1, -0.35 * Math.sin(-Math.PI / 3))
    this._chairStructure[this._chairStructure.length - 1].rotation.set(Math.PI / 2, 0, -Math.PI / 3)
    // Seat
    this._chairStructure.push(this.craft("chairP", "rod", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.375, 0)
    this._chairStructure.push(this.craft("chairB", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.6, 0)
    this._chairStructure.push(this.craft("chairF", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.6, 0.25)
    this._chairStructure[this._chairStructure.length - 1].rotation.x = Math.PI / 4
    this._chairStructure.push(this.craft("chairB", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.85, -0.25)
    this._chairStructure[this._chairStructure.length - 1].rotation.x = -Math.PI / 12 + Math.PI / 2
    this._chairStructure.push(this.craft("chairBAlt", "black", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 1.2, -0.3)
    this._chairStructure[this._chairStructure.length - 1].rotation.x = Math.PI / 2

    this._chairShape.position.set(-0.2, 0, 1.2)
    this._chairShape.rotation.y = -Math.PI / 8

    this._meshHolder.add(this._chairShape)
  }

  createCanvasShape () {
    this._canvasShape = new THREE.Object3D()
    this._canvasShape.textKey = "sCanvas"
    this._canvasShape.text = "A New York painting, i wasn't an original person."
    this._canvasShape.textAction = "bubble"

    this._canvasStructure = []
    this._canvasStructure.push(this.craft("canvas", "white", this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(-2.45, 1.5, -0.5)

    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.PlaneGeometry(0.1 + Math.random() * 0.1, 0.2 + Math.random() * 0.4, 1, 1)
      const material = Utils3.randomColorMaterial({saturation: 0, lightness: 25 + Math.floor(Math.random() * 50)})
      this._canvasStructure.push(this.craft(geometry, material, this._canvasShape))
      this._canvasStructure[this._canvasStructure.length - 1].position.set(-2.42 + 0.00001 * i, 1.3 + Math.random() * 0.3, -0.5 + 1.6 * Math.random() - 0.8)
      this._canvasStructure[this._canvasStructure.length - 1].rotation.y = Math.PI / 2
    }

    this._canvasShape.position.set(0, 0, 0)

    this._meshHolder.add(this._canvasShape)
  }

  // Shape template
  createShapeShape () {
    this._shapeShape = new THREE.Object3D()
    this._shapeShape.textKey = "sShape"
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

    this._point = new THREE.PointLight(0xa9c1af, 0.5, 10)
    this._point.position.y = 2.5
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

  remove () {
    this._ctx._scene.remove(this._meshHolder)
  }
}
