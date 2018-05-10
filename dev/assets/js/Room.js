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

  // Load ressources before game start
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
      // Deal with chrome autoplay policy
      if (!this._theme.play()) {
        document.addEventListener("mouseup", () => {
          Pizzicato.context.resume().then(() => {
            this._theme.play()
          })
        }, {once: true})
      }
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
    this._$mute = this._$output.querySelector(".mute")

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

    // CONTROL
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

    // ROOM GESTION
    this._nextRoom = 6
    this._currentRoom = false
    this._rooms = [
      {
        scene: () => new RoomHospital(this),
        intro: `Birth - ${this._getMonths()} ${this._getDay()}, ${this._birthYear}`,
        desc: "It was here that I was born in a small suburban hospital. My parents were neither too rich nor too poor. My future seemed safe.",
        cameraOffset: 0,
        getNextRoom: () => 1
      },
      {
        scene: () => new RoomChild(this),
        intro: `Childhood - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 8}`,
        desc: "I was enjoying my childhood. My parents were loving me and spent a lot of time with me doing activities of all kinds.",
        cameraOffset: -Math.PI / 2,
        getNextRoom: () => 2
      },
      {
        scene: () => new RoomStudent(this),
        intro: `Studies - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 19}`,
        desc: "The studies were difficult but necessary. I did my best to secure my future adult life and helped my father a lot since my mother died of a rare disease when I was 18 years old.",
        cameraOffset: -Math.PI / 2,
        getNextRoom: () => 3
      },
      {
        scene: () => new RoomSquat(this),
        intro: `Squating - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 24}`,
        desc: "My father had ended his life and I had not passed my studies. I lived by sharing a room in the flat of Milan. It was not great but life went on anyway.",
        cameraOffset: 0,
        getNextRoom: () => {
          if (
            this._textMemory["hLight"] &&
            this._textMemory["cLight"] &&
            this._textMemory["sLight"] &&
            this._textMemory["sqLight"]
          ) {
            return 6
          } else {
            return this._textMemory["sqMessage"] ? 4 : 5
          }
        }
      },
      {
        scene: () => new RoomJail(this),
        intro: `Incarceration - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 28}`,
        desc: "Vico's plan was to rob a liquor store. Everything went well but the police ended up to find both of us back.",
        cameraOffset: 0,
        getNextRoom: () => 0
      },
      {
        scene: () => new RoomBridge(this),
        intro: `Homeless - ${this._getMonths()} ${this._getDay()}, ${this._birthYear + 28}`,
        desc: "I didn't managed to get back on rail, find a job, etc. I ran out of money and was obliged to live on the street.",
        cameraOffset: 0,
        getNextRoom: () => 0
      },
      {
        scene: () => new RoomLight(this),
        intro: `Light - ${Date.now()}`,
        desc: "I did not want explore interesting things, so i ended up being in this room.",
        cameraOffset: 0,
        getNextRoom: () => 0
      }
    ]

    // TEXT
    this._canAnswer = false
    this._currentText = false
    this._actionText = false
    this._textMemory = {}
    this._lightMessage = [
      "You're seriously thinking that there's something meaningful to say about this light? Just get to the next room.",
      "Again nothing here... what did you expect?",
      "Come on, that's the third time you try to check the light, everything is right, no worries. But maybe the next one will contains something more interesting, who knows?",
      "Disappointed?"
    ]
  }

  // Init events listener
  initListener () {
    // Resize handling
    window.addEventListener("resize", this.updateSize.bind(this))

    // Player control
    this._$output.addEventListener("mousemove", (e) => {
      this._mouse.x = Math.round((e.clientX / this._w - 0.5) * 100) / 100
      this._mouse.y = Math.round((e.clientY / this._h - 0.5) * 100) / -100
      this._mouseUpdate = true
    })
    document.addEventListener("keydown", (e) => { this._input[e.key] = true })
    document.addEventListener("keyup", (e) => { this._input[e.key] = false })

    // Mouse events
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

    // Button
    this._$positive.addEventListener("mouseup", () => {
      if (this._canAnswer) {
        this._canAnswer = false
        this.getNextRoom()
      }
    })
    this._$negative.addEventListener("mouseup", () => {
      if (this._canAnswer) {
        this._canAnswer = false
        this.updateText()
      }
    })
    this._$mute.addEventListener("mousedown", (e) => {
      e.stopPropagation()
      if (this._$mute.classList.contains("muted")) {
        this._$mute.classList.remove("muted")
        this._theme.volume = 1
      } else {
        this._$mute.classList.add("muted")
        this._theme.volume = 0
      }
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
      this._nextRoom = this._rooms[this._nextRoom].getNextRoom()
      this._currentRoom.remove()
      this._currentRoom = null
    }
    const nextRoom = this._rooms[this._nextRoom]
    this.updateText("intro", nextRoom.intro, nextRoom.desc)
    //this._$next.addEventListener("mouseup", () => {
      this._cameraYOffset = nextRoom.cameraOffset
      this._currentRoom = nextRoom.scene()
      this.updateText()
    //}, {once: true})
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
        this._textMemory[intersections[0].object.parent.textKey] = true
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
            setTimeout(() => { this._canAnswer = true }, 450);
          }
        } else if (action == "intro") {
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
    if (this._input[this._keyboard[this._keyBoardType][1]] || this._input["ArrowLeft"]) { // if left
      x -= Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }

    if (this._input[this._keyboard[this._keyBoardType][3]] || this._input["ArrowRight"]) { // if right
      x += Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z += Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }

    if (this._input[this._keyboard[this._keyBoardType][0]] || this._input["ArrowUp"]) { // if up
      x -= Math.sin(this._camera.get("angle", true).y) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y) * this._speed
    }

    if (this._input[this._keyboard[this._keyBoardType][2]] || this._input["ArrowDown"]) { // if down
      x += Math.sin(this._camera.get("angle", true).y) * this._speed
      z += Math.cos(this._camera.get("angle", true).y) * this._speed
    }

    if (x != 0 || z != 0) {
      const pos = this._camera.get("pos", true)
      if (pos.x + x > this._roomLenght / 2 * 0.9) { x = this._roomLenght / 2 * 0.9 - pos.x }
      if (pos.x + x < -this._roomLenght / 2 * 0.9) { x = - this._roomLenght / 2 * 0.9 - pos.x }
      if (pos.z + z > this._roomDepth / 2 * 0.9) { z = this._roomDepth / 2 * 0.9 - pos.z }
      if (pos.z + z < -this._roomDepth / 2 * 0.9) { z = - this._roomDepth / 2 * 0.9 - pos.z }
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
