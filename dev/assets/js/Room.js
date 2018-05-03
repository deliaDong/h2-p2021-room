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
    })
    this.init() // Dont wait if outside sound
  }

  // Init everything
  init () {
    // Create context
    this.initContext()

    // Events listener
    this.initListener()
    
    // Init skybox
    this.initSky()

    // Init curosr
    this.initCursor()

    // Init game room gestion
    this.roomGestion()

    this._stats = new Stats()
    this._ctx.$output.appendChild(this._stats.dom)

    // Loop
    this.loop()
  }

  // Create default context
  initContext () {
    this._ctx = {}

    // DOM
    this._ctx.$output = this._$output
    this._ctx.$canvas = this._ctx.$output.querySelector("canvas")
    this._ctx.$HUD = this._ctx.$output.querySelector(".HUDContainer")
    this._ctx.$textOutput = this._ctx.$HUD.querySelector(".textOutput")

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
    this._ctx.raycaster = new THREE.Raycaster(
      THREE.Vector3(0, 0, 0),
      THREE.Vector3(0, 0, 0),
      0,
      2
    )

    // CTRL
    this._ctx.cameraYOffset = 0 // Y angle offset
    this._ctx.mouse = {x: 0, y: 0, clicked: false}
    this._ctx.mouseUpdate = false
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

    // TXT
    this._ctx.currentText = false
  }

  // Init events listener
  initListener () {
    window.addEventListener("resize", this.updateSize.bind(this))
    // Update mouse
    this._ctx.$output.addEventListener("mousemove", (e) => {
      this._ctx.mouse.x = Math.round((e.clientX / this._ctx.w - 0.5) * 100) / 100
      this._ctx.mouse.y = Math.round((e.clientY / this._ctx.h - 0.5) * 100) / -100
      this._ctx.mouseUpdate = true
    })
    // Update keyboard
    document.addEventListener("keydown", (e) => { this._ctx.input[e.key] = true })
    document.addEventListener("keyup", (e) => { this._ctx.input[e.key] = false })

    // Mouse
    this._ctx.$output.addEventListener("mousedown", () => {
      this._ctx.mouse.clicked = true
      this._ctx.mouseUpdate = true
    })
    this._ctx.$output.addEventListener("mouseup", () => {
      this._ctx.mouse.clicked = false
      //this._shader ? this._shader = false : this._shader = true
      this._ctx.composer.updatePass({
        bloom: this._shader,
        film: this._shader,
        bleach: this._shader,
        vignette: this._shader,
        outline: this._shader
      })
    })
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

  // Init cursor using Cursor.js
  initCursor () {
    new Cursor ([
      {
        el : "div",
        css : `
          width: 8px;
          height: 8px;
          margin-left: -4px;
          margin-top: -4px;
          border-radius: 50%;
          background: #dedede;
          transition: background .9s ease;
        `,
        activeCSS : `
          background: #ce4444;
          transition: background .3s ease;
        `,
        easing : 1
      },
      {
        el : "div",
        css : `
          width: 16px;
          height: 16px;
          margin-left: -8px;
          margin-top: -8px;
          border-radius: 50%;
          border: 1px solid #dedede;
          opacity: .6;
          transition: opacity .9s ease;
        `,
        activeCSS : `
          opacity: .2;
          transition: opacity .3s ease;
        `,
        easing : 0.8
      }
    ])
  }

  // Used for gestion of different room
  roomGestion () {
    this._currentRoom = new RoomHospital(this._ctx)
  }

  // Object mouse selector to check intersection
  objectSelector () {
    this._ctx.raycaster.setFromCamera(
      {x: this._ctx.mouse.x * 2, y: this._ctx.mouse.y * 2},
      this._ctx.camera.get()
    )

    const intersections = this._ctx.raycaster.intersectObjects([this._ctx.scene], true)

    if (
      intersections.length > 0 &&
      intersections[0].object.parent &&
      intersections[0].object.parent.text != undefined
    ) {
      const action = intersections[0].object.parent.textAction
      const text = intersections[0].object.parent.text
      if (this._ctx.mouse.clicked) {
        this.updateText(action, text)
      }
      this._ctx.composer.outlineSelect([intersections[0].object.parent])
    } else {
      this.updateText()
      this._ctx.composer.outlineSelect()
    }
  }

  // Update text
  updateText (action = false, text = "") {
    if (action) {
      if (this._ctx.currentText != text) {
        this._ctx.currentText = text
        
        this._ctx.$textOutput.innerText = this._ctx.currentText
        this._ctx.$HUD.classList.add("active")
      }
    } else if (this._ctx.currentText) {
      this._ctx.currentText = false
      this._ctx.$HUD.classList.remove("active")
    }
  }
  
  // Handle resize
  updateSize () {
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
    this._stats.update() // Stats
  }
  
  // Update camera according to context and user input
  updateCamera () {
    
    // When mouse have moved
    if (this._ctx.mouseUpdate) {
      // Camera first person view
      this._ctx.camera.set(
        "angle",
        {
          x: Math.round(this._ctx.mouse.y * Math.PI / 2 * 1000) / 1000,
          y: 0,
          z: 0
        }
      )
      
      this.objectSelector()

      this._ctx.mouseUpdate = false
    }

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