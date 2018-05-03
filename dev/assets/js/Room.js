class Room {
  constructor (output) {    
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

    // Go to the first room
    this.getNextRoom()

    this._stats = new Stats()
    this._$output.appendChild(this._stats.dom)

    // Loop
    this.loop()
  }

  // Create default context
  initContext () {
    // DOM
    this._$output = this._$output
    this._$canvas = this._$output.querySelector("canvas")
    this._$HUD = this._$output.querySelector(".HUDContainer")
    this._$textOutput = this._$HUD.querySelector(".textOutput")
    this._$choice = this._$HUD.querySelector(".choice")
    this._$desc = this._$HUD.querySelector(".desc")
    this._$next = this._$HUD.querySelector(".next")
    this._$date = this._$HUD.querySelector(".date")
    this._$positive = this._$choice.querySelector(".yes")
    this._$negative = this._$choice.querySelector(".no")

    // GLOBAL
    this._w = this._$output.offsetWidth
    this._h = this._$output.offsetHeight

    // VIEW
    this._cAngle = 70 // Camera angle
    this._scene = new THREE.Scene()
    this._camera = new Utils3.Camera(
      this._scene,
      this._cAngle,
      this._w,
      this._h,
      1.5
    )
    this._renderer = new Utils3.Renderer({
      canvas: this._$canvas,
      width: this._w,
      height: this._h,
      scene: this._scene,
      camera: this._camera
    })
    this._shader = true
    this._composer = new Utils3.Composer({
      renderer: this._renderer,
      scene: this._scene,
      camera: this._camera,
      bloom: this._shader,
      film: this._shader,
      bleach: this._shader,
      vignette: this._shader
    })
    this._raycaster = new THREE.Raycaster(
      THREE.Vector3(0, 0, 0),
      THREE.Vector3(0, 0, 0),
      0,
      2
    )

    // CTRL
    this._cameraYOffset = 0 // Y angle offset
    this._mouse = {x: 0, y: 0, clicked: false}
    this._mouseUpdate = false
    this._input = {}
    this._keyboard = {
      qwerty: "wasd",
      azerty: "zqsd"
    }
    this._keyBoardType = "azerty"

    // EXP VAR
    this._months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
    this._getMonths = () => this._months[Math.floor(Math.random() * 12)]
    this._getDay = () => Math.floor(Math.random() * 28) + 1
    this._birthYear = Math.floor(Math.random() * 15) + 1985
    
    // ENV
    this._speed = 0.05
    this._dayDuration = 120000
    this._currentTime = () => {
      return (Math.sin(Date.now() % this._dayDuration / this._dayDuration * Math.PI - Math.PI / 2) + 1) / 2
    }
    this._roomLenght = 5
    this._roomDepth = 5
    this._nextRoom = 0
    this._currentRoom = false
    this._rooms = [
      {
        scene: () => new RoomHospital(this),
        intro: `Birth - ${this._getMonths()} ${this._getDay()}, ${this._birthYear}`,
        desc: "Here i was born.",
        nextRoomIndex: 1
      },
      {
        scene: () => new RoomChild(this),
        intro: `Childhood - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 8}`,
        desc: "I was enjoying my childhood.",
        nextRoomIndex: 0
      }
    ]

    // TXT
    this._currentText = false
    this._actionText = false
  }

  // Init events listener
  initListener () {
    window.addEventListener("resize", this.updateSize.bind(this))
    // Update mouse
    this._$output.addEventListener("mousemove", (e) => {
      this._mouse.x = Math.round((e.clientX / this._w - 0.5) * 100) / 100
      this._mouse.y = Math.round((e.clientY / this._h - 0.5) * 100) / -100
      this._mouseUpdate = true
    })
    // Update keyboard
    document.addEventListener("keydown", (e) => { this._input[e.key] = true })
    document.addEventListener("keyup", (e) => { this._input[e.key] = false })

    // Mouse
    this._$output.addEventListener("mousedown", () => {
      this._mouse.clicked = true
      this._mouseUpdate = true
    })
    this._$output.addEventListener("mouseup", () => {
      this._mouse.clicked = false
      //this._shader ? this._shader = false : this._shader = true
      this._composer.updatePass({
        bloom: this._shader,
        film: this._shader,
        bleach: this._shader,
        vignette: this._shader,
        outline: this._shader
      })
    })

    this._$positive.addEventListener("mouseup", () => { this.getNextRoom() })
    this._$negative.addEventListener("mouseup", () => { this.updateText() })
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

    this._scene.add(this._sky)
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
  
  // Load next room
  getNextRoom () {
    if (this._currentRoom) {
      this._currentRoom.remove()
      this._currentRoom = null
    }
    const nextRoom = this._rooms[this._nextRoom]
    this.updateText("intro", nextRoom.intro, nextRoom.desc)
    this._$next.addEventListener("mouseup", () => {
      this._currentRoom = nextRoom.scene()
      this._nextRoom = nextRoom.nextRoomIndex
      this.updateText()
    }, {once: true})
  }

  // Object mouse selector to check intersection
  objectSelector () {
    this._raycaster.setFromCamera(
      {x: this._mouse.x * 2, y: this._mouse.y * 2},
      this._camera.get()
    )

    const intersections = this._raycaster.intersectObjects([this._scene], true)

    if (
      intersections.length > 0 &&
      intersections[0].object.parent &&
      intersections[0].object.parent.text != undefined
    ) {
      const action = intersections[0].object.parent.textAction
      const text = intersections[0].object.parent.text
      if (this._mouse.clicked) {
        this.updateText(action, text)
      }
      this._composer.outlineSelect([intersections[0].object.parent])
    } else {
      if (this._actionText != "choice" && this._actionText != "intro" && this._actionText) {
        this.updateText()
      }
      this._composer.outlineSelect()
    }
  }

  // Update text
  updateText (action = false, text = "", subText = "") {
    if (action) {
      if (this._currentText != text) {
        if (this._actionText != "choice" && action != "intro") {
          this._currentText = text
          this._actionText = action
          this._$textOutput.innerText = this._currentText
          this._$textOutput.classList.remove("active")
          this._$HUD.classList.add("active")
          
          if (action == "choice") {
            this._$choice.classList.add("active")
            this._$HUD.classList.add("dark")
          }
        } else if (action == "intro") {
          console.log("intro")
          this._currentText = text
          this._actionText = action
          this._$textOutput.classList.add("active")
          this._$date.innerText = this._currentText
          
          this._$choice.classList.remove("active")
          this._$HUD.classList.add("darker")
          this._$desc.innerText = subText
          
          this._$date.classList.remove("active")
          this._$desc.classList.add("active")
          this._$next.classList.add("active")
        }
      }
    } else if (this._currentText) {
      this._currentText = false
      this._actionText = false
      this._$HUD.classList.remove("active", "dark", "darker")
      this._$choice.classList.remove("active")
      this._$desc.classList.remove("active")
      this._$next.classList.remove("active")
      this._$date.classList.add("active")
    }
  }
  
  // Handle resize
  updateSize () {
    this._w = this._$output.offsetWidth
    this._h = this._$output.offsetHeight
    
    this._camera.updateSize(this._w, this._h)
    this._renderer.updateSize(this._w, this._h)
    this._composer.updateSize(this._w, this._h)
  }
  
  // Main loop
  loop () {
    window.requestAnimationFrame(this.loop.bind(this))
    this.updateCamera()
    this.updateSky(this._currentTime())
    this._composer.render()
    this._stats.update() // Stats
  }
  
  // Update camera according to context and user input
  updateCamera () {
    
    // When mouse have moved
    if (this._mouseUpdate) {
      // Camera first person view
      this._camera.set(
        "angle",
        {
          x: Math.round(this._mouse.y * Math.PI / 2 * 1000) / 1000,
          y: 0,
          z: 0
        }
      )
      
      this.objectSelector()

      this._mouseUpdate = false
    }

    this._camera.set(
      "angle",
      {
        x: 0,
        y: Math.round((this._cameraYOffset - this._mouse.x * Math.PI / 2) * 1000) / 1000,
        z: 0
      },
      true
    )
    
    if (this._mouse.x > 0.45) {
      this._cameraYOffset -= Math.PI / 90
    }
    
    if (this._mouse.x < -0.45) {
      this._cameraYOffset += Math.PI / 90
    }
    
    // Movement
    let x = 0
    let z = 0
    if (this._input[this._keyboard[this._keyBoardType][1]]) { // if left
      x -= Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }
    
    if (this._input[this._keyboard[this._keyBoardType][3]]) { // if right
      x += Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z += Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }
    
    if (this._input[this._keyboard[this._keyBoardType][0]]) { // if up
      x -= Math.sin(this._camera.get("angle", true).y) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y) * this._speed
    }
    
    if (this._input[this._keyboard[this._keyBoardType][2]]) { // if down
      x += Math.sin(this._camera.get("angle", true).y) * this._speed
      z += Math.cos(this._camera.get("angle", true).y) * this._speed
    }

    if (x != 0 || z != 0) {
      const pos = this._camera.get("pos", true)
      if (pos.x + x > this._roomLenght / 2 * 0.9) { x = this._roomLenght / 2 * 0.9 - pos.x }
      if (pos.x + x < -this._roomLenght / 2 * 0.9) { x = - this._roomLenght / 2 * 0.9 - pos.x }
      if (pos.z + z > this._roomDepth / 2 * 0.9) { z = this._roomDepth / 2 * 0.9 - pos.z }
      if (pos.z + z < -this._roomDepth / 2 * 0.9) { z = - this._roomLenght / 2 * 0.9 - pos.z }
      this._camera.add(
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