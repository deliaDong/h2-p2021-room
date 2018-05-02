class RoomHospital {
  constructor (ctx) {
    this._ctx = ctx

    this._mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(.7, .2, 100, 8),
      new THREE.MeshStandardMaterial({ color: 0xff0000, flatShading: true})
    )
    this._mesh.position.y = 1.2
    this._ctx.scene.add(this._mesh)

    this._hospital = new THREE.Object3D()

    this.initMaterial()
    this.initGeometry()
    
    this.createLight()
    this.createRoomShape()
    this._ctx.scene.add(this._hospital)
  }

  // Init all needed material
  initMaterial () {
    this._m = {}

    this._m.floor = new THREE.MeshStandardMaterial({
      color: 0xf7e8cb,
      flatShading: true,
      metalness: 0.5,
      roughness: 0.5
    })

    this._m.roof = new THREE.MeshStandardMaterial({
      color: 0x89cfd1,
      flatShading: true,
      metalness: 0.1,
      roughness: 0.5
    })

    this._m.wall = new THREE.MeshStandardMaterial({
      color: 0xf7f1e5,
      flatShading: true,
      metalness: 0.1,
      roughness: 0.5
    })

    this._m.glass = new THREE.MeshStandardMaterial({
      color: 0xc3f0e0,
      metalness: 0.1,
      roughness: 0.5,
      opacity: 0.2,
      transparent: true
    })
  }

  // Init all needed geometry
  initGeometry() {
    this._g = {}

    this._g.room = new THREE.PlaneGeometry(5, 5, 1, 1)
    this._g.wall = new THREE.BoxGeometry(5, 3, 0.2)
    this._g.wallB = new THREE.BoxGeometry(5, 1, 0.2)
    this._g.wallS = new THREE.BoxGeometry(1, 2, 0.2)
    this._g.wallT = new THREE.BoxGeometry(3, 0.2, 0.2)
    this._g.glass = new THREE.BoxGeometry(3, 1.8, 0.1)
  }

  // Create global room shape
  createRoomShape () {
    this._roomShape = new THREE.Object3D()

    this._floor = this.craft("room", "floor", this._roomShape)
    this._floor.rotation.x = - Math.PI / 2

    this._roof = this.craft("room", "roof", this._roomShape)
    this._roof.rotation.x = Math.PI / 2
    this._roof.position.y = 3
    
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
    this._wall[this._wall.length - 1].position.set(0, 0.5, -2.6)
    
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(2, 2, -2.6)
    
    this._wall.push(this.craft("wallS", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(-2, 2, -2.6)
    
    this._wall.push(this.craft("wallT", "wall", this._window))
    this._wall[this._wall.length - 1].position.set(0, 2.9, -2.6)

    this._wall.push(this.craft("glass", "glass", this._window))
    this._wall[this._wall.length - 1].position.set(0, 1.9, -2.6)

    this._roomShape.add(this._window)
    this._hospital.add(this._roomShape)
  }

  // Create lighting
  createLight () {
    this._lights = new THREE.Object3D()

    this._ambient = new THREE.AmbientLight(0x111111)
    this._lights.add(this._ambient)

    this._point = new THREE.PointLight(0xa9c1af, 1, 10)
    this._point.position.y = 2.9
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