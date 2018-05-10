class RoomJail {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._roomLenght = 2.8
    this._ctx._roomDepth = 5
    this._ctx._fixedTime = false

    this.initGeometry()
    this.initMaterial()

    this.createLight()
    this.createRoomShape()
    this.createBedShape()
    this.createWardrobeShape()
    this.createToiletShape()
    this.createSinkShape()

    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: 0, y: 0, z: 2.2}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneGeometry(3, 5, 1, 1)
    this._g.roomAlt = new THREE.PlaneGeometry(3, 10, 1, 1)
    this._g.carpet = new THREE.BoxGeometry(3, 0.05, 2)
    this._g.wall = new THREE.BoxGeometry(5, 3, 0.2)
    this._g.wallAlt = new THREE.BoxGeometry(10, 3, 0.2)
    this._g.wallB = new THREE.BoxGeometry(3, 1.2, 0.2)
    this._g.wallS = new THREE.BoxGeometry(1, 1.8, 0.2)
    this._g.wallT = new THREE.BoxGeometry(1, 0.2, 0.2)
    this._g.windowRod = new THREE.BoxGeometry(0.05, 1.6, 0.05)
    this._g.roofLight = new THREE.SphereGeometry(0.2, 8, 8)
    this._g.wallDS = new THREE.BoxGeometry(0.9, 2.2, 0.2)
    this._g.wallDT = new THREE.BoxGeometry(3, 0.8, 0.2)
    this._g.doorRod = new THREE.BoxGeometry(0.05, 2.2, 0.05)
    this._g.doorRodAlt = new THREE.BoxGeometry(0.05, 1, 0.05)
    this._g.doorVRod = new THREE.BoxGeometry(1.2, 0.05, 0.05)
    this._g.doorP = new THREE.BoxGeometry(0.5, 0.05, 0.2)
    this._g.doorL = new THREE.BoxGeometry(0.2, 0.2, 0.1)

    // Bed
    this._g.bedL = new THREE.BoxGeometry(0.05, 0.7, 0.05)
    this._g.bedT = new THREE.BoxGeometry(1.1, 0.05, 0.05)
    this._g.bedB = new THREE.BoxGeometry(1.15, 0.05, 2.15)
    this._g.matress = new THREE.BoxGeometry(1.1, 0.2, 2.1)

    // Wardrobe
    this._g.wardrobe = new THREE.BoxGeometry(0.3, 0.05, 1)
    this._g.wardrobeH = new THREE.BoxGeometry(0.05, 0.3, 0.05)

    // Toilet
    this._g.toiletB = new THREE.BoxGeometry(0.2, 0.25, 0.5)
    this._g.toiletS = new THREE.BoxGeometry(0.3, 0.25, 0.05)
    this._g.toiletSAlt = new THREE.BoxGeometry(0.2, 0.25, 0.05)
    this._g.toiletR = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 7)
    this._g.toiletD1 = new THREE.PlaneGeometry(0.4, 0.4, 1, 1)
    this._g.toiletD2 = new THREE.PlaneGeometry(0.175, 0.325, 1, 1)
    this._g.toiletH = new THREE.CircleGeometry(0.05, 8)

    // Sink
    this._g.sinkB = new THREE.BoxGeometry(0.05, 0.2, 0.4)
    this._g.sinkS = new THREE.BoxGeometry(0.05, 0.15, 0.3)
    this._g.sinkD = new THREE.PlaneGeometry(0.3, 0.3, 1, 1)
    this._g.sinkH = new THREE.CircleGeometry(0.03, 8)
    this._g.sinkT = new THREE.BoxGeometry(0.15, 0.025, 0.05)

  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Common
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.black = new THREE.MeshStandardMaterial({color: 0x393939, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.rod = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.5, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0x47403b, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.roof = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading: true, metalness: 0.5, roughness: 1})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0.1, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f188, metalness: 0, roughness: 1, opacity: 0.5, transparent: true})

    // Bed
    this._m.matress = new THREE.MeshStandardMaterial({color: 0x9a8b67, flatShading: true, metalness: 0, roughness: 0.5})

    // Wardrobe
    this._m.wardrobe = new THREE.MeshStandardMaterial({color: 0x545142, flatShading: true, metalness: 0, roughness: 0.7})

    // Toilet
    this._m.toilet = new THREE.MeshStandardMaterial({color: 0xfef7b5, flatShading: true, metalness: 0.2, roughness: 0.7})

    // Sink
    this._m.sink = this._m.toilet

  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2
    this._roof = this.craft("room", "roof", this._roomShape)
    this._roof.rotation.x = Math.PI / 2
    this._roof.position.y = 3

    this._roofLightHolder = new THREE.Object3D()

    this._roofLightHolder.textKey = "jLight"
    this._roofLightHolder.text = "Too high."
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = this.craft("roofLight", "roofLight", this._roofLightHolder)
    this._roofLight.position.y = 3.1

    this._roomShape.add(this._roofLightHolder)

    // Building walls
    this._wall = []
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(1.6, 1.5, 0)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(-1.6, 1.5, 0)
    this._wall[this._wall.length - 1].rotation.y = - Math.PI / 2
    // Door wall
    this._wall.push(this.craft("wallDS", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(1.05, 1.1, 2.6)
    this._wall.push(this.craft("wallDS", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(-1.05, 1.1, 2.6)
    this._wall.push(this.craft("wallDT", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 2.6, 2.6)

    // Building window
    this._window = new THREE.Object3D()
    this._wall.push(this.craft("wallB", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 0.6, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(1, 2.1, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(-1, 2.1, 0)
    this._wall.push(this.craft("wallT", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.9, 0)
    this._wall.push(this.craft("windowRod", "rod", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2, 0)
    this._wall.push(this.craft("windowRod", "rod", this._window))
    this._wall[this._wall.length - 1].position.set(0.2, 2, 0)
    this._wall.push(this.craft("windowRod", "rod", this._window))
    this._wall[this._wall.length - 1].position.set(-0.2, 2, 0)
    this._wall.push(this.craft("windowRod", "rod", this._window))
    this._wall[this._wall.length - 1].position.set(0.4, 2, 0)
    this._wall.push(this.craft("windowRod", "rod", this._window))
    this._wall[this._wall.length - 1].position.set(-0.4, 2, 0)


    this._window.position.z = -2.6
    this._roomShape.add(this._window)

    // Door
    this._door = new THREE.Object3D()
    this._door.textKey = "jDoor"
    this._door.text = "Go further?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("doorRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.5, 1.1, 0)
    this._doorPart.push(this.craft("doorRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0.5, 1.1, 0)
    this._doorPart.push(this.craft("doorRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.3, 1.1, 0)
    this._doorPart.push(this.craft("doorRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0.3, 1.1, 0)
    this._doorPart.push(this.craft("doorRodAlt", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.1, 0.5, 0)
    this._doorPart.push(this.craft("doorRodAlt", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0.1, 0.5, 0)
    this._doorPart.push(this.craft("doorRodAlt", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.1, 1.7, 0)
    this._doorPart.push(this.craft("doorRodAlt", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0.1, 1.7, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.025, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 2.175, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.4, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.8, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.975, 0)
    this._doorPart.push(this.craft("doorVRod", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.225, 0)
    this._doorPart.push(this.craft("doorP", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.975, 0)
    this._doorPart.push(this.craft("doorL", "rod", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0.4, 1.1, 0)

    this._door.position.set(0, 0, 2.6)
    this._roomShape.add(this._door)

    // Exterior
    this._wall.push(this.craft("roomAlt", "floor", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 0, 4)
    this._wall[this._wall.length - 1].rotation.set(- Math.PI / 2, 0, Math.PI / 2)
    this._wall.push(this.craft("roomAlt", "roof", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 3, 4)
    this._wall[this._wall.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 2)
    this._wall.push(this.craft("wallAlt", "wall", this._roomShape))
    this._wall[this._wall.length - 1].position.set(0, 1.5, 4.5)
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].rotation.y = Math.PI / 2
    this._wall[this._wall.length - 1].position.set(5.1, 1.5, 5)
    this._wall.push(this.craft("wall", "wall", this._roomShape))
    this._wall[this._wall.length - 1].rotation.y = Math.PI / 2
    this._wall[this._wall.length - 1].position.set(-5.1, 1.5, 5)

    this._meshHolder.add(this._roomShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()
    this._bedShape.textKey = "jBed"
    this._bedShape.text = "A matress on a metal frame, they call that a bed. At least it's more like a bed than Milan's sofa."
    this._bedShape.textAction = "bubble"

    this._bedStructure = []
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.575, 0.35, 1.075)
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.575, 0.35, 1.075)
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.575, 0.35, -1.075)
    this._bedStructure.push(this.craft("bedL", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.575, 0.35, -1.075)
    this._bedStructure.push(this.craft("bedT", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.675, -1.075)
    this._bedStructure.push(this.craft("bedT", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.675, 1.075)
    this._bedStructure.push(this.craft("bedB", "rod", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.35, 0)
    this._bedStructure.push(this.craft("matress", "matress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.45, 0)

    this._bedShape.position.set(0.8, 0, -1.3)

    this._meshHolder.add(this._bedShape)
  }

  createWardrobeShape () {
    this._wardrobeShape = new THREE.Object3D()
    this._wardrobeShape.textKey = "jWardrobe"
    if (this._ctx._textMemory["sqWardrobe"]) {
      this._wardrobeShape.text = "Mom wouldn't have been proud of me..."
    } else {
      this._wardrobeShape.text = "A small shelf to store my stuff, wait, i do not own anything now."
    }
    this._wardrobeShape.textAction = "bubble"

    this._wardrobeStructure = []
    this._wardrobeStructure.push(this.craft("wardrobe", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0, 0)
    this._wardrobeStructure.push(this.craft("wardrobeH", "rod", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.05, -0.1, 0.4)
    this._wardrobeStructure[this._wardrobeStructure.length - 1].rotation.z = -Math.PI / 4
    this._wardrobeStructure.push(this.craft("wardrobeH", "rod", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.05, -0.1, -0.4)
    this._wardrobeStructure[this._wardrobeStructure.length - 1].rotation.z = -Math.PI / 4

    this._wardrobeShape.position.set(-1.35, 1.7, 0.5)

    this._meshHolder.add(this._wardrobeShape)
  }

  createToiletShape () {
    this._toiletShape = new THREE.Object3D()
    this._toiletShape.textKey = "jToilet"
    this._toiletShape.text = "Those toilets are making a watery noise all the time, unbearable while trying to sleep."
    this._toiletShape.textAction = "bubble"

    this._toiletStructure = []
    this._toiletStructure.push(this.craft("toiletB", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.1, 0, 0)
    this._toiletStructure.push(this.craft("toiletR", "rod", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.1, 0.125, 0.2)
    this._toiletStructure.push(this.craft("toiletR", "rod", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.1, 0.125, -0.2)
    this._toiletStructure.push(this.craft("toiletS", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.35, 0, -0.225)
    this._toiletStructure.push(this.craft("toiletSAlt", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.575, 0, -0.175)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.y = Math.PI / 6
    this._toiletStructure.push(this.craft("toiletS", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.35, 0, 0.225)
    this._toiletStructure.push(this.craft("toiletSAlt", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.575, 0, 0.175)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.y = -Math.PI / 6
    this._toiletStructure.push(this.craft("toiletS", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.65, 0, 0)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.y = Math.PI / 2
    this._toiletStructure.push(this.craft("toiletD1", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.35, -0.1, 0)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.set(-Math.PI / 2, 0, 0)
    this._toiletStructure.push(this.craft("toiletD2", "toilet", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.55, -0.1, 0)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.set(-Math.PI / 2, 0, 0)
    this._toiletStructure.push(this.craft("toiletH", "black", this._toiletShape))
    this._toiletStructure[this._toiletStructure.length - 1].position.set(-0.5, -0.09, 0)
    this._toiletStructure[this._toiletStructure.length - 1].rotation.set(-Math.PI / 2, 0, 0)

    this._toiletShape.position.set(1.5, 0.4, 0.8)

    this._meshHolder.add(this._toiletShape)
  }

  createSinkShape () {
    this._sinkShape = new THREE.Object3D()
    this._sinkShape.textKey = "jSink"
    this._sinkShape.text = "Better use this to wash myself than the public shower..."
    this._sinkShape.textAction = "bubble"

    this._sinkStructure = []
    this._sinkStructure.push(this.craft("sinkB", "sink", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.025, 0.025, 0)
    this._sinkStructure.push(this.craft("sinkS", "sink", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.175, 0, 0.15)
    this._sinkStructure[this._sinkStructure.length - 1].rotation.y = Math.PI / 2 - Math.PI / 16
    this._sinkStructure.push(this.craft("sinkS", "sink", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.175, 0, -0.15)
    this._sinkStructure[this._sinkStructure.length - 1].rotation.y = Math.PI / 2 + Math.PI / 16
    this._sinkStructure.push(this.craft("sinkS", "sink", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.31, 0, 0)
    this._sinkStructure.push(this.craft("sinkD", "sink", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.175, -0.075, 0)
    this._sinkStructure[this._sinkStructure.length - 1].rotation.x = -Math.PI / 2
    this._sinkStructure.push(this.craft("sinkH", "black", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.15, -0.07, 0)
    this._sinkStructure[this._sinkStructure.length - 1].rotation.x = -Math.PI / 2
    this._sinkStructure.push(this.craft("sinkT", "rod", this._sinkShape))
    this._sinkStructure[this._sinkStructure.length - 1].position.set(-0.1, 0.12, 0)
    this._sinkStructure[this._sinkStructure.length - 1].rotation.z = -Math.PI / 16

    this._sinkShape.position.set(1.5, 1, 1.8)

    this._meshHolder.add(this._sinkShape)
  }

  // Shape template
  createShapeShape () {
    this._shapeShape = new THREE.Object3D()
    this._shapeShape.textKey = "jShape"
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

    this._point = new THREE.PointLight(0xffffff, 0.5, 10)
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

  remove () {
    this._ctx._scene.remove(this._meshHolder)
  }
}
