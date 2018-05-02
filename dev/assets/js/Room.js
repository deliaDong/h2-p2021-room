class Room {
  constructor (output) {
    // Properties init
    this._ctx = () => console.info("Not init with this.getContext($output)")
    
    // Try to get output element
    const $output = document.querySelector(output)
    if (!$output) { // Handle error
      console.error(`Room: Can't find ${output}, please check that value`)
    } else { // Success
      // Create context
      this.createContext($output)
      // Init everything once context ready
      this.init()
    }
  }

  // Create default context
  createContext ($output) {
    this._ctx = {}

    // DOM
    this._ctx.$output = $output
    this._ctx.$canvas = $output.querySelector("canvas")

    // GLOBAL
    this._ctx.w = this._ctx.$output.offsetWidth
    this._ctx.h = this._ctx.$output.offsetHeight

    // VIEW
    this._ctx.cAngle = 70 // Camera angle
    this._ctx.scene = new THREE.Scene()
    this._ctx.camera = new Utils3.Camera(
      this._ctx.scene,
      this._ctx.cAngle,
      this._ctx.w,
      this._ctx.h,
      3
    )
    this._ctx.renderer = new Utils3.Renderer({
      canvas: this._ctx.$canvas,
      width: this._ctx.w,
      height: this._ctx.h,
      scene: this._ctx.scene,
      camera: this._ctx.camera
    })
    this._ctx.composer = new Utils3.Composer({
      renderer: this._ctx.renderer,
      scene: this._ctx.scene,
      camera: this._ctx.camera,
      bloom: true,
      film: true,
      bleach: true,
      vignette: true
    })

    // CTRL
    this._ctx.cameraYOffset = 0 // Y angle offset
    this._ctx.speed = 0.05
    this._ctx.mouse = {x: 0, y: 0}
    this._ctx.input = {}
    this._ctx.keyboard = {
      qwerty: "wasd",
      azerty: "zqsd"
    }
    this._ctx.keyBoardType = "azerty"
  }
  
  // Init everything
  init () {
    window.addEventListener("resize", this.sizeUpdate.bind(this))
    // Update mouse
    this._ctx.$output.addEventListener("mousemove", (e) => {
      this._ctx.mouse.x = Math.round((e.clientX / this._ctx.w - 0.5) * 100) / 100
      this._ctx.mouse.y = Math.round((e.clientY / this._ctx.h - 0.5) * 100) / -100
    })
    // Update keyboard
    document.addEventListener("keydown", (e) => { this._ctx.input[e.key] = true })
    document.addEventListener("keyup", (e) => { this._ctx.input[e.key] = false })
    
    this.torus()
    this.loop()
  }
  
  torus () {
    this._mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(.7, .2, 100, 8),
      new THREE.MeshPhongMaterial({ color: 0xff0000, flatShading: true})
    )
    this._mesh.position.y = 1.2
    this._ctx.scene.add(this._mesh)
    
    this._floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0x00ff00})
    )
    this._floor.rotation.x = -Math.PI * 0.5
    this._ctx.scene.add(this._floor)
    
    const ambientLight = new THREE.AmbientLight(0x111111)
    this._ctx.scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
    sunLight.position.x = 1
    sunLight.position.y = 1
    sunLight.position.z = 1
    this._ctx.scene.add(sunLight)
  }
  
  // Handle resize
  sizeUpdate () {
    this._ctx.w = this._ctx.$output.offsetWidth
    this._ctx.h = this._ctx.$output.offsetHeight
    
    this._ctx.camera.updateSize(this._ctx.w, this._ctx.h)
    this._ctx.renderer.updateSize(this._ctx.w, this._ctx.h)
    this._ctx.composer.updateSize(this._ctx.w, this._ctx.h)
  }
  
  // Main loop
  loop () {
    window.requestAnimationFrame(this.loop.bind(this))
    this.updateCamera()
    this._mesh.rotation.y += 0.01
    this._ctx.composer.render()
  }

  // Update camera according to context
  updateCamera () {

    // Camera first person view
    this._ctx.camera.set(
      "angle",
      {
        x: Math.round(this._ctx.mouse.y * Math.PI / 2 * 1000) / 1000,
        y: 0,
        z: 0
      }
    )
    
    this._ctx.camera.set(
      "angle",
      {
        x: 0,
        y: Math.round((this._ctx.cameraYOffset - this._ctx.mouse.x * Math.PI / 2) * 1000) / 1000,
        z: 0
      },
      true
    )

    if (this._ctx.mouse.x > 0.45) {
      this._ctx.cameraYOffset -= Math.PI / 90
    }

    if (this._ctx.mouse.x < -0.45) {
      this._ctx.cameraYOffset += Math.PI / 90
    }

    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][1]]) { // if left
      this._ctx.camera.add(
        "pos",
        {
          x: -Math.sin(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed,
          y: 0,
          z: -Math.cos(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
        },
        true
      )
    }

    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][3]]) { // if right
      this._ctx.camera.add(
        "pos",
        {
          x: Math.sin(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed,
          y: 0,
          z: Math.cos(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
        },
        true
      )
    }

    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][0]]) { // if up
      this._ctx.camera.add(
        "pos",
        {
          x: -Math.sin(this._ctx.camera.get("angle", true).y) * this._ctx.speed,
          y: 0,
          z: -Math.cos(this._ctx.camera.get("angle", true).y) * this._ctx.speed
        },
        true
      )
    }

    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][2]]) { // if down
      this._ctx.camera.add(
        "pos",
        {
          x: Math.sin(this._ctx.camera.get("angle", true).y) * this._ctx.speed,
          y: 0,
          z: Math.cos(this._ctx.camera.get("angle", true).y) * this._ctx.speed
        },
        true
      )
    }


  }
}