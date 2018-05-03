class Room {
  constructor (output) {
    // Properties init
    this._ctx = () => console.info("Not init with this.getContext($output)")
    
    // Try to get output element
    this._$output = document.querySelector(output)
    if (!this._$output) { // Handle error
      console.error(`Room: Can't find ${output}, please check that value`)
    } else { // Success
      // Init everything once context ready
      this.load()
    }
  }

  load () {
    // Load sound
    this._theme = new Pizzicato.Sound({
      source: "file",
      options: {
        path: "assets/audio/the_stanley_parable_exploring_stanley.mp3",
        loop: true,
        attack: 5
      }
    }, () => {
      this._theme.play()
      this.init()
    })
  }

  // Init everything
  init () {
    // Create context
    this.createContext()

    // Events listener
    this.createListener()
    
    // Init skybox
    this.initSky()

    // Init game room gestion
    this.roomGestion()

    // Loop
    this.loop()
  }

  // Create default context
  createContext () {
    this._ctx = {}

    // DOM
    this._ctx.$output = this._$output
    this._ctx.$canvas = this._$output.querySelector("canvas")

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
      1.5
    )
    this._ctx.renderer = new Utils3.Renderer({
      canvas: this._ctx.$canvas,
      width: this._ctx.w,
      height: this._ctx.h,
      scene: this._ctx.scene,
      camera: this._ctx.camera
    })

    this._shader = true

    this._ctx.composer = new Utils3.Composer({
      renderer: this._ctx.renderer,
      scene: this._ctx.scene,
      camera: this._ctx.camera,
      bloom: this._shader,
      film: this._shader,
      bleach: this._shader,
      vignette: this._shader
    })

    // CTRL
    this._ctx.cameraYOffset = 0 // Y angle offset
    this._ctx.mouse = {x: 0, y: 0}
    this._ctx.input = {}
    this._ctx.keyboard = {
      qwerty: "wasd",
      azerty: "zqsd"
    }
    this._ctx.keyBoardType = "azerty"
    
    // ENV
    this._ctx.speed = 0.05
    this._ctx.dayDuration = 120000
    this._ctx.currentTime = () => {
      return (Math.sin(Date.now() % this._ctx.dayDuration / this._ctx.dayDuration * Math.PI - Math.PI / 2) + 1) / 2
    }
    this._ctx.roomLenght = 5
    this._ctx.roomDepth = 5
  }

  createListener () {
    window.addEventListener("resize", this.sizeUpdate.bind(this))
    // Update mouse
    this._ctx.$output.addEventListener("mousemove", (e) => {
      this._ctx.mouse.x = Math.round((e.clientX / this._ctx.w - 0.5) * 100) / 100
      this._ctx.mouse.y = Math.round((e.clientY / this._ctx.h - 0.5) * 100) / -100
    })
    // Update keyboard
    document.addEventListener("keydown", (e) => { this._ctx.input[e.key] = true })
    document.addEventListener("keyup", (e) => { this._ctx.input[e.key] = false })

    document.addEventListener("mouseup", () => {
      this._shader ? this._shader = false : this._shader = true
      this._ctx.composer.updatePass({
        bloom: this._shader,
        film: this._shader,
        bleach: this._shader,
        vignette: this._shader
      })
    })
  }
  
  // Used for gestion of different room
  roomGestion () {
    this._currentRoom = new RoomHospital(this._ctx)
  }

  // Init skybox
  initSky () {
    this._sky = new THREE.Sky()
    this._skyDistance = 1000
    this._sky.scale.setScalar(450)

    this._sky.material.uniforms.turbidity.value = 1 // 2.5
    this._sky.material.uniforms.rayleigh.value = 0.75 // 0.005
    this._sky.material.uniforms.mieCoefficient.value = 0.002 // 0.003
    this._sky.material.uniforms.mieDirectionalG.value = 0.8 // 0.665
    this._sky.material.uniforms.luminance.value = 1.1 // 1.1
    
    this.updateSky(0)

    this._ctx.scene.add(this._sky)
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
    this.updateSky(this._ctx.currentTime())
    this._ctx.composer.render()
  }
  
  // Update camera according to context and user input
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
    
    // Movement
    let x = 0
    let z = 0
    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][1]]) { // if left
      x -= Math.sin(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
      z -= Math.cos(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
    }
    
    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][3]]) { // if right
      x += Math.sin(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
      z += Math.cos(this._ctx.camera.get("angle", true).y + Math.PI / 2) * this._ctx.speed
    }
    
    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][0]]) { // if up
      x -= Math.sin(this._ctx.camera.get("angle", true).y) * this._ctx.speed
      z -= Math.cos(this._ctx.camera.get("angle", true).y) * this._ctx.speed
    }
    
    if (this._ctx.input[this._ctx.keyboard[this._ctx.keyBoardType][2]]) { // if down
      x += Math.sin(this._ctx.camera.get("angle", true).y) * this._ctx.speed
      z += Math.cos(this._ctx.camera.get("angle", true).y) * this._ctx.speed
    }

    if (x != 0 || z != 0) {
      const pos = this._ctx.camera.get("pos", true)
      if (pos.x + x > this._ctx.roomLenght / 2 * 0.9) { x = this._ctx.roomLenght / 2 * 0.9 - pos.x }
      if (pos.x + x < -this._ctx.roomLenght / 2 * 0.9) { x = - this._ctx.roomLenght / 2 * 0.9 - pos.x }
      if (pos.z + z > this._ctx.roomDepth / 2 * 0.9) { z = this._ctx.roomDepth / 2 * 0.9 - pos.z }
      if (pos.z + z < -this._ctx.roomDepth / 2 * 0.9) { z = - this._ctx.roomLenght / 2 * 0.9 - pos.z }
      this._ctx.camera.add(
        "pos",
        {
          x: x,
          y: 0,
          z: z
        },
        true
      )
    }
  }

  updateSky (time = 0) {
    const angle = 2 * Math.PI * time - 0.5
    const horizon = this._skyDistance * Math.cos(angle)
    const altitude = this._skyDistance * Math.sin(angle)
    /* const horizon = time * this._skyDistance * 2 - this._skyDistance
    const altitude = Math.sqrt(this._skyDistance ** 2 - horizon ** 2) */
    this._sky.material.uniforms.sunPosition.value = {x: horizon, y: altitude, z: -500}
  }
}