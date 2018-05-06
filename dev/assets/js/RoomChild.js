class RoomChild {
  constructor (ctx) {
    this._ctx = ctx

    this._meshHolder = new THREE.Object3D()
    
    // Window var
    this._angle = Math.PI / 4
    this._zOffset = Math.sin(this._angle) * 3 / 2
    this._ctx._roomLenght = 5
    this._ctx._roomDepth = 5

    this.initGeometry()
    this.initMaterial()
    
    this.createLight()
    this.createRoomShape()
    this.createBedShape()
    this.createNightstandShape()
    this.createDeskShape()
    this.createWardrobeShape()
    this.createToysShape()
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
    this._g.roofLight = new THREE.BoxGeometry(0.6, 0.05, 0.6)
    this._g.door = new THREE.BoxGeometry(1.2, 2.2, 0.1)
    this._g.doorH = new THREE.BoxGeometry(0.2, 0.1, 0.05)
    
    // Bed
    this._g.bedF = new THREE.BoxGeometry(1.4, 0.7, 0.1)
    this._g.bedR = new THREE.BoxGeometry(1.4, 0.9, 0.1)
    this._g.bedB = new THREE.BoxGeometry(1.4, 0.1, 2.2)
    this._g.bedM1 = new THREE.BoxGeometry(1.2, 0.2, 2.2)
    this._g.bedM2 = new THREE.BoxGeometry(1.3, 0.25, 1.9)
    this._g.bedP = new THREE.BoxGeometry(0.8, 0.2, 0.5)
    
    // Nightstand
    this._g.nightstandS = new THREE.BoxGeometry(0.8, 0.7, 0.7)
    this._g.nightstandD = new THREE.BoxGeometry(0.7, 0.25, 0.6)
    this._g.nightstandH = new THREE.BoxGeometry(0.2, 0.05, 0.1)
    
    // Desk
    this._g.deskT = new THREE.BoxGeometry(0.8, 0.1, 1.8)
    this._g.deskL = new THREE.BoxGeometry(0.8, 0.9, 0.1)
    this._g.book1 = new THREE.BoxGeometry(0.125, 0.2, 0.1)
    this._g.book2 = new THREE.BoxGeometry(0.15, 0.25, 0.1)
    this._g.book3 = new THREE.BoxGeometry(0.2, 0.3, 0.1)
    this._g.paper = new THREE.PlaneGeometry(0.297, 0.21, 1, 1)
    
    // Chair
    this._g.chairB = new THREE.BoxGeometry(0.6, 0.05, 0.6)
    this._g.chairL1 = new THREE.BoxGeometry(0.05, 0.5, 0.05)
    this._g.chairL2 = new THREE.BoxGeometry(0.05, 1.1, 0.05)
    this._g.chairT = new THREE.BoxGeometry(0.05, 0.05, 0.5)
    
    // Wardrobe
    this._g.wardrobeS = new THREE.BoxGeometry(0.6, 2.1, 1.6)
    this._g.wardrobeL = new THREE.BoxGeometry(0.6, 0.1, 0.1)
    this._g.wardrobeD = new THREE.BoxGeometry(0.1, 1.8, 0.7)
    this._g.wardrobeH = new THREE.BoxGeometry(0.1, 0.2, 0.05)
    
    // Toys
    this._g.carpet = new THREE.PlaneGeometry(3, 3, 1, 1)
    this._g.boxB = new THREE.BoxGeometry(1.2, 0.1, 0.7)
    this._g.boxT = new THREE.BoxGeometry(1.2, 0.05, 0.7)
    this._g.boxS = new THREE.BoxGeometry(0.1, 0.5, 0.7)
    this._g.boxI = new THREE.BoxGeometry(1, 0.5, 0.6)

    this._g.torus1 = new THREE.TorusGeometry(0.075, 0.025, 6, 12)
    this._g.torus2 = new THREE.TorusGeometry(0.1, 0.03, 6, 12)
    this._g.torus3 = new THREE.TorusGeometry(0.075, 0.03, 6, 12)
    this._g.torus4 = new THREE.TorusGeometry(0.1, 0.04, 6, 12)
    this._g.cube = new THREE.BoxGeometry(0.1, 0.1, 0.1)
    this._g.sphere = new THREE.SphereGeometry(0.1, 5, 5)
    this._g.torusKnot = new THREE.TorusKnotGeometry(0.075, 0.02, 32, 12)

    // Canvas
    this._g.canvas = new THREE.BoxGeometry(1.4, 1, 0.1)
    this._g.canvasI = new THREE.PlaneGeometry(1.3, 0.9, 1, 1)
    this._g.canvasD1 = new THREE.PlaneGeometry(0.1, 0.4, 1, 1)
    this._g.canvasD2 = new THREE.PlaneGeometry(0.1, 0.2, 1, 1)
    this._g.canvasD3 = new THREE.PlaneGeometry(0.1, 0.3, 1, 1)
  }
  
  // Init all needed material
  initMaterial () {
    this._m = {}
    
    // Color
    this._m.white = new THREE.MeshStandardMaterial({color: 0xdedede, flatShading: true, metalness: 0, roughness: 0.5})

    // Room
    this._m.floor = new THREE.MeshStandardMaterial({color: 0xd3b287, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.wall = new THREE.MeshStandardMaterial({color: 0xf7f1e5, flatShading: true, metalness: 0.1, roughness: 0.7})
    this._m.wallAlt = new THREE.MeshStandardMaterial({color: 0xfecb9c, flatShading: true, metalness: 0, roughness: 0.8})
    this._m.glass = new THREE.MeshStandardMaterial({color: 0xc3f0e0, metalness: 0.1, roughness: 0.5, opacity: 0.2, transparent: true})
    this._m.roofLight = new THREE.MeshStandardMaterial({color: 0xedce59, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.door1 = new THREE.MeshStandardMaterial({color: 0x906947, flatShading: true, metalness: 0.1, roughness: 1})
    this._m.door2 = new THREE.MeshStandardMaterial({color: 0xa07957, flatShading: true, metalness: 0.4, roughness: 0})
    
    // Bed
    this._m.bed = new THREE.MeshStandardMaterial({color: 0xb2572d, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.bedM1 = new THREE.MeshStandardMaterial({color: 0xf8f1e9, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bedM2 = new THREE.MeshStandardMaterial({color: 0xd88178, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.bedP = new THREE.MeshStandardMaterial({color: 0xffcccc, flatShading: true, metalness: 0, roughness: 0.7})
    
    // Nightstand
    this._m.nightstandS = new THREE.MeshStandardMaterial({color: 0xffe2c3, flatShading: true, metalness: 0.1, roughness: 0.5})
    this._m.nightstandD = new THREE.MeshStandardMaterial({color: 0xe2874e, flatShading: true, metalness: 0.1, roughness: 0.5})
    
    // Desk
    this._m.desk = new THREE.MeshStandardMaterial({color: 0xffb177, flatShading: true, metalness: 0.1, roughness: 0.5})
    
    // Chair
    this._m.chair = new THREE.MeshStandardMaterial({color: 0xa14c00, flatShading: true, metalness: 0.1, roughness: 0.5})
    
    // Wardrobe
    this._m.wardrobe = new THREE.MeshStandardMaterial({color: 0xa64e38, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.wardrobeD = new THREE.MeshStandardMaterial({color: 0xd96649, flatShading: true, metalness: 0, roughness: 0.7})
    this._m.wardrobeH = new THREE.MeshStandardMaterial({color: 0xffe2c3, flatShading: true, metalness: 0, roughness: 0.7})
    
    // Toys
    this._m.carpet = new THREE.MeshStandardMaterial({color: 0xcc9923, flatShading: true, metalness: 0, roughness: 0.8})
    this._m.box = new THREE.MeshStandardMaterial({color: 0xe4ac72, flatShading: true, metalness: 0.1, roughness: 0.6})
    this._m.boxI = new THREE.MeshStandardMaterial({color: 0x3e736f, flatShading: true, metalness: 0.1, roughness: 0.6})
    this._m.torusKnot = new THREE.MeshStandardMaterial({color: 0xed0707, flatShading: true, metalness: 0.1, roughness: 0.7})

    // Frame
    this._m.canvas = new THREE.MeshStandardMaterial({color: 0x8f4b17, flatShading: true, metalness: 0.1, roughness: 0.8})
    
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
    this._roofLightHolder.textKey = "cLight"
    let lightNum = 0
    if (this._ctx._textMemory["hLight"]) { lightNum++ }
    this._roofLightHolder.text = this._ctx._lightMessage[lightNum]
    this._roofLightHolder.textAction = "bubble"

    this._roofLight = []
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0, 0, 0.2)
    this._roofLight[this._roofLight.length - 1].rotation.x = Math.PI / 8
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(-0.2, 0, 0)
    this._roofLight[this._roofLight.length - 1].rotation.z = Math.PI / 8
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0, 0, -0.2)
    this._roofLight[this._roofLight.length - 1].rotation.x = -Math.PI / 8
    this._roofLight.push(this.craft("roofLight", "roofLight", this._roofLightHolder))
    this._roofLight[this._roofLight.length - 1].position.set(0.2, 0, 0)
    this._roofLight[this._roofLight.length - 1].rotation.z = -Math.PI / 8

    this._roofLightHolder.position.y = 3
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
    this._door.textKey = "cDoor"
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
    this._bedShape.textKey = "cBed"
    this._bedShape.text = "My red bed! It was so comfy."
    this._bedShape.textAction = "bubble"

    this._bedStructure = []
    this._bedStructure.push(this.craft("bedF", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.35, 1.15)
    this._bedStructure.push(this.craft("bedR", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.45, -1.15)
    this._bedStructure.push(this.craft("bedB", "bed", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.25, 0)
    this._bedStructure.push(this.craft("bedM1", "bedM1", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.4, 0)
    this._bedStructure.push(this.craft("bedM2", "bedM2", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.45, 0.15)
    this._bedStructure.push(this.craft("bedP", "bedP", this._bedShape))
    this._bedStructure[this._bedStructure.length - 1].position.set(0, 0.6, -0.8)
    this._bedStructure[this._bedStructure.length - 1].rotation.x = Math.PI / 12

    this._bedShape.position.set(-0.8, 0, -1.1 - this._zOffset)

    this._meshHolder.add(this._bedShape)
  }

  createNightstandShape () {
    this._nightstandShape = new THREE.Object3D()
    this._nightstandShape.textKey = "cNightstand"
    this._nightstandShape.text = "I used to hide my favorite toys in my nightstand."
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
    this._nightstandStructure.push(this.craft("book3", this.randomColorMaterial(), this._nightstandShape))
    this._nightstandStructure[this._nightstandStructure.length - 1].position.set(Math.random() * 0.2 - 0.1, 0.75, Math.random() * 0.2 - 0.1)
    this._nightstandStructure[this._nightstandStructure.length - 1].rotation.set(Math.PI / 2, 0, Math.PI / 16)


    this._nightstandShape.position.set(-2, 0, -1.95 - this._zOffset)

    this._meshHolder.add(this._nightstandShape)
  }

  createDeskShape () {
    this._deskShape = new THREE.Object3D()
    this._deskShape.textKey = "cDesk"
    this._deskShape.text = "I had to do some homework on this table, but when I did not have any, I drew knights and dragons!"
    this._deskShape.textAction = "bubble"

    // Table
    this._deskStructure = []
    this._deskStructure.push(this.craft("deskT", "desk", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 0.95, 0)
    this._deskStructure.push(this.craft("deskL", "desk", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 0.45, 0.85)
    this._deskStructure.push(this.craft("deskL", "desk", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0, 0.45, -0.85)

    // Stuff
    this._deskStructure.push(this.craft("book1", this.randomColorMaterial(), this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.3, 1.1, 0.25)
    this._deskStructure.push(this.craft("book2", this.randomColorMaterial(), this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.3, 1.125, 0.45)
    this._deskStructure.push(this.craft("book3", this.randomColorMaterial(), this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.3, 1.15, 0.35)
    this._deskStructure.push(this.craft("book2", this.randomColorMaterial(), this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(0.3, 1.125, -0.25)

    this._deskStructure.push(this.craft("paper", "white", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.1, 1.0001, Math.random() - 0.5)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(-Math.PI / 2, 0, Math.PI / 16)
    this._deskStructure.push(this.craft("paper", "white", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.1, 1.0001, Math.random() - 0.5)
    this._deskStructure[this._deskStructure.length - 1].rotation.set(-Math.PI / 2, 0, -Math.PI / 8)

    // Chair
    this._deskStructure.push(this.craft("chairL1", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.025, 0.25, 0.275)
    this._deskStructure.push(this.craft("chairL2", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.575, 0.55, 0.275)
    this._deskStructure.push(this.craft("chairL1", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.025, 0.25, -0.275)
    this._deskStructure.push(this.craft("chairL2", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.575, 0.55, -0.275)
    this._deskStructure.push(this.craft("chairB", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.3, 0.525, 0)
    this._deskStructure.push(this.craft("chairT", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.575, 1.05, 0)
    this._deskStructure.push(this.craft("chairT", "chair", this._deskShape))
    this._deskStructure[this._deskStructure.length - 1].position.set(-0.575, 0.85, 0)


    // Chair

    this._deskShape.position.set(2.05, 0, -1.5)

    this._meshHolder.add(this._deskShape)
  }

  createWardrobeShape () {
    this._wardrobeShape = new THREE.Object3D()
    this._wardrobeShape.textKey = "cWardrobe"
    this._wardrobeShape.text = "You know my mom was a magician? She was able to make appear the clothes that I wore everyday out of this wardrobe!"
    this._wardrobeShape.textAction = "bubble"

    this._wardrobeStructure = []
    this._wardrobeStructure.push(this.craft("wardrobeS", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 1.15, 0)
    this._wardrobeStructure.push(this.craft("wardrobeL", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0.05, -0.7)
    this._wardrobeStructure.push(this.craft("wardrobeL", "wardrobe", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(0, 0.05, 0.7)
    this._wardrobeStructure.push(this.craft("wardrobeD", "wardrobeD", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.3, 1.25, 0.4)
    this._wardrobeStructure.push(this.craft("wardrobeH", "wardrobeH", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.325, 1.25, 0.1)
    this._wardrobeStructure.push(this.craft("wardrobeD", "wardrobeD", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.3, 1.25, -0.4)
    this._wardrobeStructure.push(this.craft("wardrobeH", "wardrobeH", this._wardrobeShape))
    this._wardrobeStructure[this._wardrobeStructure.length - 1].position.set(-0.325, 1.25, -0.1)

    this._wardrobeShape.position.set(2.15, 0, 1)

    this._meshHolder.add(this._wardrobeShape)
  }

  createToysShape () {
    this._toysShape = new THREE.Object3D()
    this._toysShape.textKey = "cToys"
    this._toysShape.text = "I had a lot of toys and I collected those torus shaped. I even had the special edition: the torus knot one, it was my favorite!"
    this._toysShape.textAction = "bubble"

    this._toysStructure = []
    this._toysStructure.push(this.craft("carpet", "carpet", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0, 0.0001, 0)
    this._toysStructure[this._toysStructure.length - 1].rotation.x = - Math.PI / 2
    this._toysStructure.push(this.craft("boxB", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.2, 0.05, 1.2)
    this._toysStructure.push(this.craft("boxS", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(-0.35, 0.35, 1.2)
    this._toysStructure.push(this.craft("boxS", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.2, 0.35, 1.2)
    this._toysStructure.push(this.craft("boxS", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.75, 0.35, 1.2)
    this._toysStructure.push(this.craft("boxT", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.2, 0.625, 1.2)
    this._toysStructure.push(this.craft("boxT", "box", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.2, 0.66, 1.2)
    this._toysStructure[this._toysStructure.length - 1].rotation.x = Math.PI / 16
    this._toysStructure.push(this.craft("boxI", "boxI", this._toysShape))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.2, 0.35, 1.2)

    // Adding toys
    const toys = ["torus1", "torus2", "torus3", "torus4", "cube", "sphere"]
    const pos = [
      {x: -0.6, z: 0.4},
      {x: -0.8, z: -0.6},
      {x: -0.3, z: -0.2},
      {x: 0.2, z: 0.1},
      {x: 0.6, z: -0.7},
      {x: 0.5, z: -0.2}
    ]
    while (pos.length) {
      const shape = toys.shift()
      const toyPos = pos.splice(Math.floor(Math.random() * pos.length), 1)[0]
      const x = toyPos.x + (Math.random() * 0.2 - 0.1)
      const z = toyPos.z + (Math.random() * 0.2 - 0.1)
      this._toysStructure.push(this.craft(shape, this.randomColorMaterial({lightness: 60}), this._toysShape))
      this._toysStructure[this._toysStructure.length - 1].position.set(x, 0.05, z)
      this._toysStructure[this._toysStructure.length - 1].rotation.x = Math.PI / 2
    }

    // Torus knot one
    this._torusKnotHolder = new THREE.Object3D()
    this._torusKnotHolder.textKey = "cTorusKnot"
    this._torusKnotHolder.text = "You found it haha! This was my special edition torus knot."
    this._torusKnotHolder.textAction = "bubble"
    this._toysStructure.push(this.craft("torusKnot", "torusKnot", this._torusKnotHolder))
    this._toysStructure[this._toysStructure.length - 1].position.set(0.6 + (Math.random() * 0.2 - 0.1), 0.1, 0.2 + (Math.random() * 0.2 - 0.1))
    this._toysStructure[this._toysStructure.length - 1].rotation.x = Math.PI / 2
    this._toysShape.add(this._torusKnotHolder)

    this._toysShape.position.set(0, 0, 1)

    this._meshHolder.add(this._toysShape)
  }

  createCanvasShape () {
    this._canvasShape = new THREE.Object3D()
    this._canvasShape.textKey = "cCanvas"
    this._canvasShape.text = "Dad, mom and me. (Enjoy the abstract art of a child)"
    this._canvasShape.textAction = "bubble"

    this._canvasStructure = []
    this._canvasStructure.push(this.craft("canvas", "canvas", this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(0, 0.5, 0)
    this._canvasStructure.push(this.craft("canvasI", this.randomColorMaterial({lightness: 80}), this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(0, 0.5, -0.0501)
    this._canvasStructure[this._canvasStructure.length - 1].rotation.y = Math.PI
    this._canvasStructure.push(this.craft("canvasD1", this.randomColorMaterial(), this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(0.3, 0.4, -0.0502)
    this._canvasStructure[this._canvasStructure.length - 1].rotation.y = Math.PI
    this._canvasStructure.push(this.craft("canvasD2", this.randomColorMaterial(), this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(0, 0.3, -0.0502)
    this._canvasStructure[this._canvasStructure.length - 1].rotation.y = Math.PI
    this._canvasStructure.push(this.craft("canvasD3", this.randomColorMaterial(), this._canvasShape))
    this._canvasStructure[this._canvasStructure.length - 1].position.set(-0.3, 0.35, -0.0502)
    this._canvasStructure[this._canvasStructure.length - 1].rotation.y = Math.PI

    this._canvasShape.position.set(-0.3, 1.3, 2.5)

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