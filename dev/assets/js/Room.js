/**
 * Main controller for the game Room
 */
class Room {
  constructor (output) {
    // Try to get output element
    this._$output = document.querySelector(output)
    if (!this._$output) { // Handle error
      console.error(`Room: Can't find ${output}, please check that value`)
    } else { // Success
      if (Modernizr.webgl) { // If webgl
        // Create context
        this.initContext()

        // Events listener
        this.initListener()

        // Init skybox
        this.initSky()

        // Go to the first room
        this.getNextRoom()

        // Fps meter (require stats.min.js)
        /* this._stats = new Stats()
        this._$output.appendChild(this._stats.dom) */

        // Loop
        this.loop()

        // Load medias
        this.load()
      } else { // If no webgl
        this._$output.querySelector(".start").classList.remove("loading")
        this._$output.querySelector(".startButton").innerHTML = `Sorry you browser doesn't support webGL D:<br>
        <a href="https://www.mozilla.org/fr/firefox/" target="_blank" rel="noopener">Download Firefox here.</a>`
      }
    }
  }

  // Load ressources before game start
  load () {
    // Load sound
    this._audioPath = "assets/audio/" // Main theme
    this._theme = "the_stanley_parable_exploring_stanley.mp3" // Main theme
    this._sounds = { // Other sounds
      click: false
    }
    this._timeout = 10000
    this._loaded = false
    let loading = 0
    let elements = 1

    for (const key in this._sounds) { elements++ }
    // Theme
    this._theme = new Pizzicato.Sound({
      source: "file",
      options: {
        path: `${this._audioPath}${this._theme}`,
        loop: true,
        attack: 5
      }
    }, () => { // Once ready
      loading++
      if (loading >= elements) {
        this._loaded = true
        this.isLoaded()
      }
    })

    // Other sounds, actually one
    for (const sound in this._sounds) {
      this._sounds[sound] = new Pizzicato.Sound({
        source: "file",
        options: {
          path: `${this._audioPath}${sound}.mp3`
        }
      }, () => { // Once ready
        loading++
        this._sounds[sound].volume = 0.3
        if (loading >= elements) {
          this._loaded = true
          this.isLoaded()
        }
      })
    }

    // If timeout
    setTimeout(() => {
      if (this._timeout) {
        this._timeout = false
        console.warn("Room: Loader timeout, sounds will be played once ready.")
        this._$output.classList.remove("preload")
        this._$screen["start"].classList.remove("loading")
        this._$buttons["start"].innerText = "Start"
        this._$buttons["start"].addEventListener("mouseup", () => {
          this._playing = true
          this._nextRoom = 0
          this._textMemory = {}
          this.updateText("intro", this._rooms[this._nextRoom])
          if (this._loaded) { this.tryPlayTheme() } // Playsound once ready if timeout and player not already playing
        })
      }
    }, this._timeout)
  }

  isLoaded () {
    if (this._timeout) {
      this._timeout = false
      this._$output.classList.remove("preload")
      this._$screen["start"].classList.remove("loading")
      this._$buttons["start"].innerText = "Start"
      this._$buttons["start"].addEventListener("mouseup", () => {
        this._playing = true
        this._nextRoom = 0
        this._textMemory = {}
        this.updateText("intro", this._rooms[this._nextRoom])
        this.tryPlayTheme() // Play sounds if loaded fast enough
      })
    } else if (this._playing) { // Play sounds once ready if timeout and player already playing
      this.tryPlayTheme()
    }
  }

  // Try to play theme sound
  tryPlayTheme () {
    // Deal with chrome autoplay policy
    if (!this._theme.play()) {
      document.addEventListener("mouseup", () => {
        Pizzicato.context.resume().then(() => {
          this._theme.play()
        })
      }, {once: true})
    }
  }

  // Create default context
  initContext () {

    // Game state
    this._playing = false
    this._loaded = false

    // General DOM
    this._$output = this._$output
    this._$canvas = this._$output.querySelector("canvas")
    this._$HUD = this._$output.querySelector(".HUDContainer")

    // Screen DOM
    this._$screen = {
      all: this._$HUD.querySelectorAll(".screen"),
      start: this._$HUD.querySelector(".screen.start"),
      choice: this._$HUD.querySelector(".screen.choice"),
      bubble: this._$HUD.querySelector(".screen.bubble"),
      intro: this._$HUD.querySelector(".screen.intro"),
      end: this._$HUD.querySelector(".screen.end")
    }

    // Text output DOM
    this._$text = {
      choiceH: this._$screen["choice"].querySelector("h2"),
      bubble: this._$screen["bubble"],
      introH: this._$screen["intro"].querySelector("h2"),
      introD: this._$screen["intro"].querySelector(".desc"),
      endH: this._$screen["end"].querySelector("h2"),
      endD: this._$screen["end"].querySelector(".desc"),
    }

    // Buttons DOM
    this._$buttons = {
      start: this._$screen["start"].querySelector(".startButton"),
      choiceS: this._$screen["choice"].querySelector(".stayButton"),
      choiceN: this._$screen["choice"].querySelector(".nextButton"),
      intro: this._$screen["intro"].querySelector(".nextButton"),
      end: this._$screen["end"].querySelector(".menuButton")
    }

    // Options DOM
    this._$options = this._$output.querySelector(".options")
    this._$fps = this._$options.querySelector(".fps")
    this._$mute = this._$options.querySelector(".mute")

    // GLOBAL
    this._w = this._$output.offsetWidth
    this._h = this._$output.offsetHeight

    // VIEW
    this._cAngle = 70 // Camera angle
    this._scene = new THREE.Scene() // Init scene
    this._camera = new Utils3.Camera( // Init camera
      this._scene,
      this._cAngle,
      this._w,
      this._h,
      1.5
    )
    this._renderer = new Utils3.Renderer({ // Init renderer
      canvas: this._$canvas,
      width: this._w,
      height: this._h,
      scene: this._scene,
      camera: this._camera
    })
    this._shader = true
    this._composer = new Utils3.Composer({ // Init composer
      renderer: this._renderer,
      scene: this._scene,
      camera: this._camera,
      bloom: this._shader,
      film: this._shader,
      bleach: this._shader,
      vignette: this._shader,
      outline: this._shader
    })
    this._raycaster = new THREE.Raycaster( // Init raycaster :pew: :pew:
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

    // STATIC VAR
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
    this._birthYear = Math.floor(Math.random() * 15) + 1985

    // ENV
    this._speed = 0.05
    this._dayDuration = 120000
    this._fixedTime = false
    this._gamma = 0.075
    this._roomLength = 5
    this._roomDepth = 5

    // ROOM GESTION
    this._nextRoom = 0
    this._currentRoom = false
    this._rooms = [
      {
        scene: () => new RoomHospital(this),
        intro: `Birth - ${this.getMonth()} ${this.getDay()}, ${this._birthYear}`,
        desc: "It was here that I was born in a small suburban hospital. My parents were neither too rich nor too poor. My future seemed safe.",
        cameraOffset: 0,
        getNextRoom: () => 1
      },
      {
        scene: () => new RoomChild(this),
        intro: `Childhood - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 6 + Math.floor(Math.random() * 4)}`,
        desc: "I was enjoying my childhood. My parents were loving me and spent a lot of time with me doing activities of all kinds.",
        cameraOffset: -Math.PI / 2,
        getNextRoom: () => 2
      },
      {
        scene: () => new RoomStudent(this),
        intro: `Studies - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 18 + Math.floor(Math.random() * 4)}`,
        desc: "The studies were difficult but necessary. I did my best to secure my future adult life and helped my father a lot since my mother died of a rare disease when I was 17 years old.",
        cameraOffset: -Math.PI / 2,
        getNextRoom: () => 3
      },
      {
        scene: () => new RoomSquat(this),
        intro: `Squating - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 22 + Math.floor(Math.random() * 4)}`,
        desc: "My father had ended his life and I had not passed my studies. I lived by sharing a room in the flat of Milan. It was not great but life went on anyway.",
        cameraOffset: 0,
        getNextRoom: () => {
          let interact = 0
          for (const text in this._textMemory) { interact += this._textMemory[text] }
          if (
            interact <= 16 &&
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
        intro: `Incarceration - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 26 + Math.floor(Math.random() * 4)}`,
        desc: "Vico's plan was to rob a liquor store. Everything went well but the police ended up to find both of us back.",
        cameraOffset: 0,
        getNextRoom: () => -1
      },
      {
        scene: () => new RoomBridge(this),
        intro: `Homeless - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 26 + Math.floor(Math.random() * 4)}`,
        desc: "I didn't managed to get back on rail, find a job, etc. I ran out of money and was obliged to live on the street, so i found a place under a bridge where i was able to hide myself from wind and survive in this harsh world.",
        cameraOffset: 0,
        getNextRoom: () => -1
      },
      {
        scene: () => new RoomLight(this),
        intro: `Light - ${Date.now()}`,
        desc: "I did not want to explore interesting things, so i ended up being in this room.",
        cameraOffset: Math.PI,
        getNextRoom: () => -1
      }
    ]

    // TEXT
    this._canAnswer = false
    this._currentText = false
    this._actionText = false
    this._textMemory = {}
    // Light line
    this._lightMessage = [
      "You're seriously thinking that there's something meaningful to say about this light? Just get to the next room.",
      "Again nothing here... what did you expect?",
      "Come on, that's the third time you try to check the light, everything is right, no worries. But maybe the next one will contains something more interesting, who knows?",
      "Disappointed?"
    ]
    // End message
    this._endMessage = {
      bridge : {
        intro: `End - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 32 + Math.floor(Math.random() * 4)}`,
        desc: "To survive in the street I had to wander in places little and not very well attended around the city. On day I had a bad encounter with wild dogs, I escaped but I was injured. The days passed, gradually I felt my energy leaving my body, hope with it. I died as a result of an infection."
      },
      jail : {
        intro: `End - ${this.getMonth()} ${this.getDay()}, ${this._birthYear + 32 + Math.floor(Math.random() * 4)}`,
        desc: "Even if thieves were not the worst, I did not really have any friends in prison. But one day, a guy decided to push me to the end, talking about my parents. I could not hold myself and went to fight with him, the other inmates taking advantage to join the party. I then received an improvised knife in the chest, leaving me lifeless on the floor of the yard."
      },
      light : {
        intro: `End - ${Date.now() * Math.PI}`,
        desc: ".-..-. .... --- .-- / -- .- -. -.-- / -- . -. / ..-. .-.. --- -.-. -.- / - --- / - .... . / .-.. .. --. .... - / -. --- - / - --- / ... . . / -... . - - . .-. --..-- / -... ..- - / - --- / ... .... .. -. . / -... . - - . .-. .-.-.- .-..-. -....- ..-. .-. .. . -.. .-. .. -.-. .... / -. .. . - --.. ... -.-. .... ."
      }
    }
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
    document.addEventListener("keydown", (e) => { this._input[e.code] = true })
    document.addEventListener("keyup", (e) => { this._input[e.code] = false })

    // Mouse events
    this._$output.addEventListener("mousedown", () => {
      this._mouse.clicked = true
      this._mouseUpdate = true
      if (this._loaded) {
        this._sounds["click"].play()
      }
    })
    this._$output.addEventListener("mouseup", () => {
      this._mouse.clicked = false
    })

    // Buttons
    this._$buttons["choiceS"].addEventListener("mouseup", () => {
      this.updateText()
    })
    this._$buttons["choiceN"].addEventListener("mouseup", () => {
      this.getNextRoom()
      if (this._nextRoom == -1) {
        let endMessage = {
          intro: "Error",
          desc: "Error"
        }
        if (this._textMemory["bDoor"]) {
          endMessage = this._endMessage["bridge"]
        } else if (this._textMemory["jDoor"]) {
          endMessage = this._endMessage["jail"]
        } else if (this._textMemory["lDoor"]) {
          endMessage = this._endMessage["light"]
        }
        this.updateText("end", endMessage)
      } else {
        this.updateText("intro", this._rooms[this._nextRoom])
      }
    })
    this._$buttons["intro"].addEventListener("mouseup", () => {
      this._cameraYOffset = this._rooms[this._nextRoom].cameraOffset
      this._currentRoom = this._rooms[this._nextRoom].scene()
      this.updateText()
    })
    this._$buttons["end"].addEventListener("mouseup", () => {
      this._theme.stop()
      this.updateText("start")
    })

    // Options
    this._$mute.addEventListener("mousedown", (e) => { e.stopPropagation() })
    this._$mute.addEventListener("mouseup", (e) => {
      e.stopPropagation()
      if (this._$mute.classList.contains("muted")) {
        this._$mute.classList.remove("muted")
        Pizzicato.volume = 1
      } else {
        this._$mute.classList.add("muted")
        Pizzicato.volume = 0
      }
    })
    this._$fps.addEventListener("mousedown", (e) => { e.stopPropagation() })
    this._$fps.addEventListener("mouseup", (e) => {
      e.stopPropagation()
      if (this._$fps.classList.contains("active")) {
        this._$fps.classList.remove("active")
        this._shader = true
        this._gamma = 0.075
      } else {
        this._$fps.classList.add("active")
        this._shader = false
        this._gamma = 0.2
      }
      this._composer.updatePass({
        bloom: this._shader,
        film: this._shader,
        bleach: this._shader
      })
      if (this._currentRoom) {
        this._currentRoom._ambient.intensity = this._gamma
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

  // Load next room
  getNextRoom () {
    if (this._currentRoom) {
      this._nextRoom = this._rooms[this._nextRoom].getNextRoom()
      this._currentRoom.remove()
      this._currentRoom = null
    } else {
      this._nextRoom = 0
    }
  }

  // Object mouse selector to check intersection
  objectSelector () {
    this._raycaster.setFromCamera(
      {x: this._mouse.x * 2, y: this._mouse.y * 2},
      this._camera.get()
    )

    const intersections = this._raycaster.intersectObjects([this._scene], true)

    // If object3D is allowed to display something
    if (
      intersections.length > 0 &&
      intersections[0].object.parent &&
      intersections[0].object.parent.text != undefined
    ) {
      const action = intersections[0].object.parent.textAction
      const text = intersections[0].object.parent.text
      if (this._mouse.clicked && (!this._actionText || this._actionText == "bubble")) {
        this._textMemory[intersections[0].object.parent.textKey] = true
        this.updateText(action, text)
      }
      this._composer.outlineSelect([intersections[0].object.parent])
    } else {
      if (this._actionText == "bubble") {
        this.updateText()
      }
      this._composer.outlineSelect()
    }
  }

  // Update text
  updateText (action = false, text = "") {
    // Remove everything
    for (let i = 0; i < this._$screen["all"].length; i++) {
      this._$screen["all"][i].classList.remove("active", "select")
    }
    this._$HUD.classList.remove("active", "dark", "darker")

    if (action) {
      if (this._actionText != action || action != "bubble") {
        if (this._actionText == "choice") {
          setTimeout(() => {
            this._actionText = action
          }, 500)
        } else {
          this._actionText = action
        }

        this._$screen[action].classList.add("active")
        setTimeout(() => {
          for (let i = 0; i < this._$screen["all"].length; i++) {
            this._$screen["all"][i].classList.remove("select")
          }
          this._$screen[action].classList.add("select")
        }, this._$screen[action].classList.contains("fast") ? 500 : 1000)

        // Start case
        if (action == "start") {
          this._$HUD.classList.add("active", "darker")
          this._$options.classList.remove("active")
        } else {
          this._$options.classList.add("active")
        }

        // Choice case
        if (action == "choice") {
          this._$text["choiceH"].innerText = text
          this._$HUD.classList.add("active", "dark")
        }

        // Intro case
        if (action == "bubble") {
          this._$text["bubble"].innerText = text
          this._$HUD.classList.add("active")
        }

        // Intro case
        if (action == "intro") {
          this._$text["introH"].innerText = text.intro
          this._$text["introD"].innerText = text.desc
          this._$HUD.classList.add("active", "darker")
        }

        // End case
        if (action == "end") {
          this._$text["endH"].innerText = text.intro
          this._$text["endD"].innerText = text.desc
          this._$HUD.classList.add("active", "darker")
        }
      } else {
        this._actionText = false
      }
    } else {
      this._actionText = false
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
    this.updateSky()
    this._composer.render()
    //this._stats.update() // Stats
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
    if (this._input["KeyA"] || this._input["ArrowLeft"]) { // if left
      x -= Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }

    if (this._input["KeyD"] || this._input["ArrowRight"]) { // if right
      x += Math.sin(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
      z += Math.cos(this._camera.get("angle", true).y + Math.PI / 2) * this._speed
    }

    if (this._input["KeyW"] || this._input["ArrowUp"]) { // if up
      x -= Math.sin(this._camera.get("angle", true).y) * this._speed
      z -= Math.cos(this._camera.get("angle", true).y) * this._speed
    }

    if (this._input["KeyS"] || this._input["ArrowDown"]) { // if down
      x += Math.sin(this._camera.get("angle", true).y) * this._speed
      z += Math.cos(this._camera.get("angle", true).y) * this._speed
    }

    if (x != 0 || z != 0) {
      const pos = this._camera.get("pos", true)
      if (pos.x + x > this._roomLength / 2 * 0.9) { x = this._roomLength / 2 * 0.9 - pos.x }
      if (pos.x + x < -this._roomLength / 2 * 0.9) { x = - this._roomLength / 2 * 0.9 - pos.x }
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

  // Update skybox according to a specified time or currentgame time
  updateSky (time = this.currentTime()) {
    const angle = 2 * Math.PI * time - 0.5
    const horizon = this._skyDistance * Math.cos(angle)
    const altitude = this._skyDistance * Math.sin(angle)
    this._sky.material.uniforms.sunPosition.value = {x: horizon, y: altitude, z: -500}
  }

  // Return a random month
  getMonth () {
    return this._months[Math.floor(Math.random() * 12)]
  }

  // Return a random day
  getDay () {
    return Math.floor(Math.random() * 28) + 1
  }

  // Return current game time based on timestamp
  currentTime () {
    return this._fixedTime ? this._fixedTime : Math.round((Math.sin(Date.now() % this._dayDuration / this._dayDuration * Math.PI - Math.PI / 2) + 1) / 2 * 1000) / 1000
  }
}
