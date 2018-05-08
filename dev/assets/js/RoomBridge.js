class RoomBridge {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()

    // Room var
    this._ctx._roomLenght = 5
    this._ctx._roomDepth = 5

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
    this._roofLightHolder.textKey = "bLight"
    let lightNum = 0
    if (this._ctx._textMemory["hLight"]) { lightNum++ }
    if (this._ctx._textMemory["cLight"]) { lightNum++ }
    if (this._ctx._textMemory["sLight"]) { lightNum++ }
    if (this._ctx._textMemory["sqLight"]) { lightNum++ }
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
    this._moistureHolder.textKey = "bMoisture"
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
    this._door.textKey = "bDoor"
    this._door.text = "Go further?"
    this._door.textAction = "choice"

    this._doorPart = []
    this._doorPart.push(this.craft("door", "door1", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(0, 1.1, 0)
    this._doorPart.push(this.craft("doorH", "door2", this._door))
    this._doorPart[this._doorPart.length - 1].position.set(-0.4, 1.15, -0.05)
    this._doorPart[this._doorPart.length - 1].rotation.z = -Math.PI / 16

    this._door.position.set(1, 0, 2.5)
    this._roomShape.add(this._door)

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
