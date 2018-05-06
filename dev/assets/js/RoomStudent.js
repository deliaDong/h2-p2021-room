class RoomStudent {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()
    
    // Window var
    this._angle = Math.PI / 4
    this._zOffset = Math.sin(this._angle) * 3 / 2
    this._ctx._roomLenght = 10
    this._ctx._roomDepth = 10

    this.initGeometry()
    this.initMaterial()
    
    this.createLight()
    this.createRoomShape()
    this.createBedShape()
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

  }
  
  // Init all needed material
  initMaterial () {
    this._m = {}
    
    // Color
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})

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
    this._m.matress = this.randomColorMaterial({lightness: 70})

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
    if (this._ctx._textMemory["hLight"] && this._ctx._textMemory["cLight"]) {
      this._roofLightHolder.text = "Come on, that's the third time you try to check the light, everything is right, no worries. But maybe the next one will contains something more interesting, who knows?"
    } else if (this._ctx._textMemory["hLight"] || this._ctx._textMemory["cLight"]) {
      this._roofLightHolder.text = "Again nothing here... what did you expect?"
    } else {
      this._roofLightHolder.text = "You're seriously thinking that there's something meaningful to say about this light? Just get to the next room."
    }
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

    this._bedShape.position.set(1.4 * 0, 0, -1.2 - this._zOffset)

    this._meshHolder.add(this._bedShape)
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
    if (typeof(material) == "string") {
      child = new THREE.Mesh(this._g[geometry], this._m[material])
    } else {
      child = new THREE.Mesh(this._g[geometry], material)
    }
    parent.add(child)
    return child
  }

  // Return a material with a random color
  randomColorMaterial ({
    saturation = 100,
    lightness = 50,
    metalness = 0.1,
    roughness = 0.7
  } = {}) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${Math.floor(Math.random() * 360)}, ${saturation}%, ${lightness}%)`),
      flatShading: true,
      metalness: metalness,
      roughness: roughness
    })
  }

  remove () {
    this._ctx._scene.remove(this._meshHolder)
  }
}