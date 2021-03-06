/**
 * Each RoomNAME.js are just meant to create the 3D room and some management methods related to it (loop, etc.)
 */
class RoomHospital {
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
    this.createTreeShape()
    this.createTVShape()
    this.createChairShape()
    this.createBedShape()
    this.createBBedShape()
    this._ctx._scene.add(this._meshHolder)

    // Placing camera
    this._ctx._camera.set("pos", {x: -0.5, y: 0, z: 2.2}, true)
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    // Room
    this._g.room = new THREE.PlaneBufferGeometry(5, 5, 1, 1)
    this._g.wall = new THREE.BoxBufferGeometry(5, 3, 0.2)
    this._g.wallB = new THREE.BoxBufferGeometry(5, 1, 0.2)
    this._g.wallS = new THREE.BoxBufferGeometry(1, 2, 0.2)
    this._g.wallT = new THREE.BoxBufferGeometry(3, 0.2, 0.2)
    this._g.glass = new THREE.BoxBufferGeometry(3, 1.8, 0.1)
    this._g.roofLight = new THREE.BoxBufferGeometry(1, 0.05, 1)
    this._g.door = new THREE.BoxBufferGeometry(1.2, 1.9, 0.1)
    this._g.doorB = new THREE.BoxBufferGeometry(1.2, 0.3, 0.1)
    this._g.doorH = new THREE.BoxBufferGeometry(0.2, 0.3, 0.05)

    // Bed
    this._g.bedWheel = new THREE.BoxBufferGeometry(0.3, 0.2, 1.4)
    this._g.bedStructureB = new THREE.BoxBufferGeometry(2.4, 0.1, 1.4)
    this._g.bedStructureF = new THREE.BoxBufferGeometry(0.1, 0.7, 1.4)
    this._g.bedStructureR = new THREE.BoxBufferGeometry(0.1, 1, 1.4)
    this._g.bedStructureS1 = new THREE.BoxBufferGeometry(1.2, 0.3, 0.05)
    this._g.bedStructureS2 = new THREE.BoxBufferGeometry(0.8, 0.3, 0.05)
    this._g.bedStructureM1 = new THREE.BoxBufferGeometry(1.6, 0.3, 1.2)
    this._g.bedStructureM2 = new THREE.BoxBufferGeometry(0.8, 0.3, 1.2)
    this._g.bedStructureP = new THREE.BoxBufferGeometry(0.6, 0.1, 1)
    this._g.bedStructureH1 = new THREE.BoxBufferGeometry(0.1, 2.3, 0.1)
    this._g.bedStructureH2 = new THREE.BoxBufferGeometry(0.8, 0.05, 0.05)
    this._g.bedBlood1 = new THREE.BoxBufferGeometry(0.2, 0.3, 0.025)
    this._g.bedBlood2 = new THREE.PlaneBufferGeometry(0.18, 0.28)

    // Chair
    this._g.chairStructureP1 = new THREE.BoxBufferGeometry(0.05, 0.8, 0.05)
    this._g.chairStructureP2 = new THREE.BoxBufferGeometry(0.05, 1.1, 0.05)
    this._g.chairStructureB = new THREE.BoxBufferGeometry(0.7, 0.05, 0.7)
    this._g.chairStructureS = new THREE.BoxBufferGeometry(0.7, 0.05, 0.05)
    this._g.chairStructureM1 = new THREE.BoxBufferGeometry(0.7, 0.05, 0.6)
    this._g.chairStructureM2 = new THREE.BoxBufferGeometry(0.05, 0.3, 0.6)

    // TV
    this._g.TVStructureF = new THREE.BoxBufferGeometry(0.1, 0.55, 0.9)
    this._g.TVStructureS = new THREE.BoxBufferGeometry(0.05, 0.5, 0.85)
    this._g.TVStructureH = new THREE.BoxBufferGeometry(0.3, 0.2, 0.2)

    // Tree
    this._g.treeP = new THREE.CylinderBufferGeometry(0.25, 0.3, 0.5, 6)
    this._g.treeB = new THREE.CylinderBufferGeometry(0.05, 0.05, 1, 9)
    this._g.treeL1 = new THREE.SphereBufferGeometry(0.3, 12, 12)
    this._g.treeL2 = new THREE.SphereBufferGeometry(0.2, 8, 8)

    // Baby bed
    this._g.bBedW = new THREE.BoxBufferGeometry(0.8, 0.1, 0.1)
    this._g.bBedB1 = new THREE.BoxBufferGeometry(0.8, 0.05, 1.2)
    this._g.bBedB2 = new THREE.BoxBufferGeometry(0.8, 0.05, 0.9)
    this._g.bBedB3 = new THREE.BoxBufferGeometry(0.8, 0.05, 1.1)
    this._g.bBedS1 = new THREE.BoxBufferGeometry(0.05, 0.3, 1.1)
    this._g.bBedS2 = new THREE.BoxBufferGeometry(0.8, 0.3, 0.05)
    this._g.bBedM = new THREE.BoxBufferGeometry(0.8, 0.1, 1.1)
    this._g.bBedP = new THREE.BoxBufferGeometry(0.6, 0.05, 0.2)

  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0xf7e8cb, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.roof = new THREE.MeshStandardMaterial({color: 0x89cfd1, flatShading: true, metalness: 0, roughness: 0.8})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f1e5, metalness: 0, roughness: 1, opacity: 0.8, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0xb25f40, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0xfefefe, flatShading: true, metalness: 0.4, roughness: 0})

    // Bed
    this._m.bedWheel = new THREE.MeshStandardMaterial({color: 0x787878, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.bedStructure = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0.2, roughness: 0.5})
    this._m.bedMattress = new THREE.MeshStandardMaterial({color: 0xa3d8dc, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bedPillow = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bedBlood = new THREE.MeshStandardMaterial({color: 0xfd0e1e, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Chair
    this._m.chairStructure = new THREE.MeshStandardMaterial({color: 0xd7b27f, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.chairMattress = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0, roughness: 0.7})

    // TV
    this._m.TVStructure = new THREE.MeshStandardMaterial({color: 0x494949, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.TVScreen = new THREE.MeshStandardMaterial({color: 0x898989, flatShading: true, metalness: 0.1, roughness: 0.5})

    // Tree
    this._m.treeP = new THREE.MeshStandardMaterial({color: 0xf6424b, flatShading: true, metalness: 0.1, roughness: 0.7})
    this._m.treeB = new THREE.MeshStandardMaterial({color: 0x623410, flatShading: true, metalness: 0, roughness: 1})
    this._m.treeL = new THREE.MeshStandardMaterial({color: 0x56c344, flatShading: true, metalness: 0, roughness: 1})

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
    this._roofLightHolder.textKey = "hLight"
    this._roofLightHolder.text = this._ctx._lightMessage[0]
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = this.craft("roofLight", "roofLight", this._roofLightHolder)
    this._roofLight.position.y = 3

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

    // Building window
    this._window = new THREE.Object3D()
    this._wall.push(this.craft("wallB", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 0.5, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(2, 2, 0)
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(-2, 2, 0)
    this._wall.push(this.craft("wallT", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.9, 0)
    this._wall.push(this.craft("glass", "glass", this._window))
    this._wall[this._wall.length - 1].position.set(0, 1.9, 0)

    this._window.position.z = -2.6
    this._roomShape.add(this._window)

    // Door
    this._door = new THREE.Object3D()
    this._door.textKey = "hDoor"
    this._door.text = "Go further?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.25, 0)
    this._doorPart.push(this.craft("doorB", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.15, 0)
    this._doorPart.push(this.craft("doorH", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.1, -0.05)

    this._door.position.set(-0.5, 0, 2.5)
    this._roomShape.add(this._door)

    this._meshHolder.add(this._roomShape)
  }

  createBBedShape () {
    this._bBedShape = new THREE.Object3D()
    this._bBedShape.textKey = "hBBed"
    this._bBedShape.text = "I was sleeping here after i was born..."
    this._bBedShape.textAction = "bubble"

    // Holder
    this._bBedStructure = []
    this._bBedStructure.push(this.craft("bBedW", "bedWheel", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.05, 0.5)
    this._bBedStructure.push(this.craft("bBedW", "bedWheel", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.05, -0.5)
    this._bBedStructure.push(this.craft("bBedB1", "bedStructure", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.125, 0)
    this._bBedStructure.push(this.craft("bBedB2", "bedStructure", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.5, -0.3)
    this._bBedStructure[this._bBedStructure.length - 1].rotation.x = -Math.PI / 3
    this._bBedStructure.push(this.craft("bBedB3", "bedStructure", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.9, 0)

    // Glass border
    this._bBedStructure.push(this.craft("bBedS1", "glass", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0.4, 1.025, 0)
    this._bBedStructure[this._bBedStructure.length - 1].rotation.z = -Math.PI / 16
    this._bBedStructure.push(this.craft("bBedS1", "glass", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(-0.4, 1.025, 0)
    this._bBedStructure[this._bBedStructure.length - 1].rotation.z = Math.PI / 16
    this._bBedStructure.push(this.craft("bBedS2", "glass", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 1.025, 0.55)
    this._bBedStructure[this._bBedStructure.length - 1].rotation.x = Math.PI / 16
    this._bBedStructure.push(this.craft("bBedS2", "glass", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 1.025, -0.55)
    this._bBedStructure[this._bBedStructure.length - 1].rotation.x = -Math.PI / 16

    // Mattress
    this._bBedStructure.push(this.craft("bBedM", "bedMattress", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 0.975, 0)
    this._bBedStructure.push(this.craft("bBedP", "bedPillow", this._bBedShape))
    this._bBedStructure[this._bBedStructure.length - 1].position.set(0, 1.025, -0.4)

    this._bBedShape.position.set(-2, 0, -0.7)

    this._meshHolder.add(this._bBedShape)
  }

  createTreeShape () {
    this._treeShape = new THREE.Object3D()
    this._treeShape.textKey = "hTree"
    this._treeShape.text = "Just a potted tree, what did you expect? It could have been anything else that i would not have remembered it."
    this._treeShape.textAction = "bubble"

    this._treeStructure = []
    this._treeStructure.push(this.craft("treeP", "treeP", this._treeShape))
    this._treeStructure[this._treeStructure.length - 1].rotation.x = Math.PI
    this._treeStructure[this._treeStructure.length - 1].position.set(0, 0.25, 0)
    this._treeStructure.push(this.craft("treeB", "treeB", this._treeShape))
    this._treeStructure[this._treeStructure.length - 1].rotation.set(-Math.PI / 32, Math.PI / 8, Math.PI / 48)
    this._treeStructure[this._treeStructure.length - 1].position.set(-0.05, 1, -0.05)
    this._treeStructure.push(this.craft("treeL1", "treeL", this._treeShape))
    this._treeStructure[this._treeStructure.length - 1].position.set(0, 0.9, 0)
    this._treeStructure.push(this.craft("treeL2", "treeL", this._treeShape))
    this._treeStructure[this._treeStructure.length - 1].position.set(-0.1, 1.5, -0.1)

    this._treeShape.position.set(-2, 0, 2)

    this._meshHolder.add(this._treeShape)
  }

  createTVShape () {
    this._TVShape = new THREE.Object3D()
    this._TVShape.textKey = "hTV"
    this._TVShape.text = "A TV, like in every hospital's bedrooms."
    this._TVShape.textAction = "bubble"

    this._TVStructure = []
    this._TVStructure.push(this.craft("TVStructureF", "TVStructure", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].rotation.y = Math.PI / 16
    this._TVStructure[this._TVStructure.length - 1].rotation.z = -Math.PI / 16
    this._TVStructure.push(this.craft("TVStructureS", "TVScreen", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(0.05, 0, 0)
    this._TVStructure[this._TVStructure.length - 1].rotation.y = Math.PI / 16
    this._TVStructure[this._TVStructure.length - 1].rotation.z = -Math.PI / 16
    this._TVStructure.push(this.craft("TVStructureH", "TVStructure", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(-0.15, 0, 0)

    this._TVShape.position.set(-2.2, 2.3, 1.2)

    this._meshHolder.add(this._TVShape)
  }

  createChairShape () {
    this._chairShape = new THREE.Object3D()
    this._chairShape.textKey = "hChair"
    this._chairShape.text = "Dad was watching over me and my mom."
    this._chairShape.textAction = "bubble"

    this._chairStructure = []
    this._chairStructure.push(this.craft("chairStructureP2", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.325, 0.55, 0.325)
    this._chairStructure.push(this.craft("chairStructureP1", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.325, 0.4, 0.325)
    this._chairStructure.push(this.craft("chairStructureP2", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.325, 0.55, -0.325)
    this._chairStructure.push(this.craft("chairStructureP1", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.325, 0.4, -0.325)
    this._chairStructure.push(this.craft("chairStructureB", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.5, 0)
    this._chairStructure.push(this.craft("chairStructureS", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.775, -0.325)
    this._chairStructure.push(this.craft("chairStructureS", "chairStructure", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0, 0.775, 0.325)
    this._chairStructure.push(this.craft("chairStructureM1", "chairMattress", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.0125, 0.55, 0)
    this._chairStructure.push(this.craft("chairStructureM2", "chairMattress", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.325, 0.925, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.z = -Math.PI / 32

    this._chairShape.position.set(1.7, 0, 1.4)
    this._chairShape.rotation.y = -Math.PI / 8

    this._meshHolder.add(this._chairShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()
    this._bedShape.textKey = "hBed"
    this._bedShape.text = "Mom was having some rest here after my birth."
    this._bedShape.textAction = "bubble"

    // Wheel
    this._bedWheels = []
    this._bedWheels.push(this.craft("bedWheel", "bedWheel", this._bedShape))
    this._bedWheels[this._bedWheels.length - 1].position.set(0.9, 0, 0)
    this._bedWheels.push(this.craft("bedWheel", "bedWheel", this._bedShape))
    this._bedWheels[this._bedWheels.length - 1].position.set(-0.9, 0, 0)

    // Holder
    this._bedStructure = []
    this._bedStructure.push(this.craft("bedStructureB", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.15, 0)
    this._bedStructure.push(this.craft("bedStructureF", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-1.15, 0.5, 0)
    this._bedStructure.push(this.craft("bedStructureR", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(1.15, 0.65, 0)

    // Bottom part
    this._bedStructure.push(this.craft("bedStructureS1", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.60, 0.65)
    this._bedStructure.push(this.craft("bedStructureS1", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.60, -0.65)
    this._bedStructure.push(this.craft("bedStructureM1", "bedMattress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.55, 0)

    // Top part
    this._bedStructure.push(this.craft("bedStructureS2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.9, 0.65)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureS2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.9, -0.65)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureM2", "bedMattress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.8, 0)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureP", "bedPillow", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.65, 0.925, 0)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5

    this._bedStructure.push(this.craft("bedStructureH1", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.5, 1.05, -1)
    this._bedStructure.push(this.craft("bedStructureH2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.5, 2.075, -1)
    this._bedStructure.push(this.craft("bedStructureH2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.5, 2.075, -1)
    this._bedStructure[this._bedStructure.length - 1].rotation.y = Math.PI / 2
    this._bedStructure.push(this.craft("bedBlood1", "bedPillow", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.15, 1.885, -1)
    this._bedStructure[this._bedStructure.length - 1].rotation.y = -Math.PI / 8
    this._bedStructure.push(this.craft("bedBlood2", "bedBlood", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.145, 1.885, -0.985)
    this._bedStructure[this._bedStructure.length - 1].rotation.y = -Math.PI / 8

    this._bedShape.position.set(1.2, 0.1, -1)

    this._meshHolder.add(this._bedShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0xffffff, this._ctx._gamma)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xa9c1af, 0.5, 10)
    this._point.position.y = 2.75
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
