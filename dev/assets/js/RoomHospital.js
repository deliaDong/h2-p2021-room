class RoomHospital {
  constructor (ctx) {
    this._ctx = ctx

    this._mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(.7, .2, 100, 8),
      new THREE.MeshStandardMaterial({ color: 0xff0000, flatShading: true})
    )

    this._hospital = new THREE.Object3D()

    this.initGeometry()
    this.initMaterial()
    
    this.createLight()
    this.createRoomShape()
    this.createTVShape()
    this.createChairShape()
    this.createBedShape()
    this._ctx.scene.add(this._hospital)

    // Placing camera
    this._ctx.camera.set("pos", {x: -0.5, y: 0, z: 2.2}, true)
  }
  
  // Init all needed geometry
  initGeometry() {
    this._g = {}
    
    // Room
    this._g.room = new THREE.PlaneGeometry(5, 5, 1, 1)
    this._g.wall = new THREE.BoxGeometry(5, 3, 0.2)
    this._g.wallB = new THREE.BoxGeometry(5, 1, 0.2)
    this._g.wallS = new THREE.BoxGeometry(1, 2, 0.2)
    this._g.wallT = new THREE.BoxGeometry(3, 0.2, 0.2)
    this._g.glass = new THREE.BoxGeometry(3, 1.8, 0.1)
    this._g.roofLight = new THREE.BoxGeometry(1, 0.05, 1)
    this._g.door = new THREE.BoxGeometry(1.2, 1.9, 0.1)
    this._g.doorB = new THREE.BoxGeometry(1.2, 0.3, 0.1)
    this._g.doorH = new THREE.BoxGeometry(0.2, 0.3, 0.05)
    
    // Bed
    this._g.bedWheel = new THREE.BoxGeometry(0.3, 0.2, 1.4)
    this._g.bedStructureB = new THREE.BoxGeometry(2.4, 0.1, 1.4)
    this._g.bedStructureF = new THREE.BoxGeometry(0.1, 0.7, 1.4)
    this._g.bedStructureR = new THREE.BoxGeometry(0.1, 1, 1.4)
    this._g.bedStructureS1 = new THREE.BoxGeometry(1.2, 0.3, 0.05)
    this._g.bedStructureS2 = new THREE.BoxGeometry(0.8, 0.3, 0.05)
    this._g.bedStructureM1 = new THREE.BoxGeometry(1.6, 0.3, 1.2)
    this._g.bedStructureM2 = new THREE.BoxGeometry(0.8, 0.3, 1.2)
    this._g.bedStructureP = new THREE.BoxGeometry(0.6, 0.1, 1)

    // Chair
    this._g.chairStructureP1 = new THREE.BoxGeometry(0.05, 0.8, 0.05)
    this._g.chairStructureP2 = new THREE.BoxGeometry(0.05, 1.1, 0.05)
    this._g.chairStructureB = new THREE.BoxGeometry(0.7, 0.05, 0.7)
    this._g.chairStructureS = new THREE.BoxGeometry(0.7, 0.05, 0.05)
    this._g.chairStructureM1 = new THREE.BoxGeometry(0.7, 0.05, 0.6)
    this._g.chairStructureM2 = new THREE.BoxGeometry(0.05, 0.3, 0.6)
    
    // TV
    this._g.TVStructureF = new THREE.BoxGeometry(0.1, 0.55, 0.9)
    this._g.TVStructureS = new THREE.BoxGeometry(0.05, 0.5, 0.85)
    this._g.TVStructureH = new THREE.BoxGeometry(0.5, 0.2, 0.2)
  }
  
  // Init all needed material
  initMaterial () {
    this._m = {}

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0xf7e8cb, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.roof = new THREE.MeshStandardMaterial({color: 0x89cfd1, flatShading: true, metalness: 0, roughness: 0.8})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xf7f1e5, metalness: 0, roughness: 1, opacity: 0.8, transparent: true})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0xb25f40, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0xfefefe, flatShading: true, metalness: 0.4, roughness: 0})
    
    // Bed
    this._m.bedWheel = new THREE.MeshStandardMaterial({color: 0x787878, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.bedStructure = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0.2, roughness: 0.5})
    this._m.bedMatress = new THREE.MeshStandardMaterial({color: 0xa3d8dc, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bedPillow = new THREE.MeshStandardMaterial({color: 0xcecece, flatShading: true, metalness: 0, roughness: 0.7})

    // Chair
    this._m.chairStructure = new THREE.MeshStandardMaterial({color: 0xd7b27f, flatShading: true, metalness: 0, roughness: 0.5})
    this._m.chairMatress = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0, roughness: 0.7})
    
    // TV
    this._m.TVStructure = new THREE.MeshStandardMaterial({color: 0x494949, flatShading: true, metalness: 0.5, roughness: 0.5})
    this._m.TVScreen = new THREE.MeshStandardMaterial({color: 0x898989, flatShading: true, metalness: 0.1, roughness: 0.5})
  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2
    this._roof = this.craft("room", "roof", this._roomShape)
    this._roof.rotation.x = Math.PI / 2
    this._roof.position.y = 3
    this._roofLight = this.craft("roofLight", "roofLight", this._roomShape)
    this._roofLight.position.y = 3
    
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
    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.25, 0)
    this._doorPart.push(this.craft("doorB", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 0.15, 0)
    this._doorPart.push(this.craft("doorH", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.1, -0.05)

    this._door.position.set(-0.5, 0, 2.5)
    this._roomShape.add(this._door)

    this._hospital.add(this._roomShape)
  }

  // Shape template
  createShapeShape () {
    this._shapeShape = new THREE.Object3D()

    this._shapeShape.position.set(0, 0, 0)

    this._hospital.add(this._shapeShape)
  }

  // Shape template
  createTVShape () {
    this._TVShape = new THREE.Object3D()

    this._TVStructure = []
    this._TVStructure.push(this.craft("TVStructureF", "TVStructure", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].rotation.y = Math.PI / 16
    this._TVStructure[this._TVStructure.length - 1].rotation.z = -Math.PI / 16
    this._TVStructure.push(this.craft("TVStructureS", "TVScreen", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(0.05, 0, 0)
    this._TVStructure[this._TVStructure.length - 1].rotation.y = Math.PI / 16
    this._TVStructure[this._TVStructure.length - 1].rotation.z = -Math.PI / 16
    this._TVStructure.push(this.craft("TVStructureH", "TVStructure", this._TVShape))
    this._TVStructure[this._TVStructure.length - 1].position.set(-0.25, 0, 0)

    this._TVShape.position.set(-2.2, 2.3, 1.2)

    this._hospital.add(this._TVShape)
  }

  createChairShape () {
    this._chairShape = new THREE.Object3D()

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
    this._chairStructure.push(this.craft("chairStructureM1", "chairMatress", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(-0.0125, 0.55, 0)
    this._chairStructure.push(this.craft("chairStructureM2", "chairMatress", this._chairShape))
    this._chairStructure[this._chairStructure.length - 1].position.set(0.325, 0.925, 0)
    this._chairStructure[this._chairStructure.length - 1].rotation.z = -Math.PI / 32

    this._chairShape.position.set(1.7, 0, 1.4)
    this._chairShape.rotation.y = -Math.PI / 8

    this._hospital.add(this._chairShape)
  }

  createBedShape () {
    this._bedShape = new THREE.Object3D()

    this._bedWheels = []
    this._bedWheels.push(this.craft("bedWheel", "bedWheel", this._bedShape))
    this._bedWheels[this._bedWheels.length - 1].position.set(0.9, 0, 0)
    this._bedWheels.push(this.craft("bedWheel", "bedWheel", this._bedShape))
    this._bedWheels[this._bedWheels.length - 1].position.set(-0.9, 0, 0)

    this._bedStructure = []
    this._bedStructure.push(this.craft("bedStructureB", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.15, 0)
    this._bedStructure.push(this.craft("bedStructureF", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-1.15, 0.5, 0)
    this._bedStructure.push(this.craft("bedStructureR", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(1.15, 0.65, 0)

    this._bedStructure.push(this.craft("bedStructureS1", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.60, 0.65)
    this._bedStructure.push(this.craft("bedStructureS1", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.60, -0.65)
    this._bedStructure.push(this.craft("bedStructureM1", "bedMatress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(-0.3, 0.55, 0)

    this._bedStructure.push(this.craft("bedStructureS2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.9, 0.65)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureS2", "bedStructure", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.9, -0.65)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureM2", "bedMatress", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.7, 0.8, 0)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5
    this._bedStructure.push(this.craft("bedStructureP", "bedPillow", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0.65, 0.925, 0)
    this._bedStructure[this._bedStructure.length - 1].rotation.z = Math.PI / 5

    this._bedShape.position.set(1.2, 0.1, -1)

    this._hospital.add(this._bedShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0x111111)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xa9c1af, 0.5, 10)
    this._point.position.y = 2.75
    this._lights.add(this._point)

    this._hospital.add(this._lights)
  }

  // Allow to craft thing easily
  craft (geometry, material, parent) {
    const child = new THREE.Mesh(this._g[geometry], this._m[material])
    parent.add(child)
    return child
  }

  remove () {
    this._ctx.scene.remove(this._hospital)
  }
}