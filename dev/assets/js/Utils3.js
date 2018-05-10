const Utils3 = (function () {

  const u = {}

  /**
   * Camera class
   */
  u.Camera = class {
    constructor (scene, angle, width, height, cameraHeight = 0) {
      this._camera = new THREE.PerspectiveCamera(angle, width / height)
      this._camera.lookAt(new THREE.Vector3())

      this._camera.position.y = cameraHeight

      this._holder = new THREE.Object3D()
      this._holder.add(this._camera)
      scene.add(this._holder)
    }

    updateSize (width, height) {
      this._camera.aspect = width / height
      this._camera.updateProjectionMatrix()
    }

    get (param, holder = false) {
      if (param == "angle") {
        return holder ? this._holder.rotation : this._camera.rotation
      } else if (param == "pos") {
        return holder ? this._holder.position : this._camera.position
      } else {
        return holder ? this._holder : this._camera
      }
    }

    set (param, value, holder = false) {
      if (value && param) {
        if (param == "angle") {
          if (holder) {
            this._holder.rotation.x = value.x
            this._holder.rotation.y = value.y
            this._holder.rotation.z = value.z
            return this._holder.rotation
          } else {
            this._camera.rotation.x = value.x
            this._camera.rotation.y = value.y
            this._camera.rotation.z = value.z
            return this._camera.rotation
          }
        } else if (param == "pos") {
          if (holder) {
            this._holder.position.x = value.x
            this._holder.position.y = value.y
            this._holder.position.z = value.z
            return this._holder.position
          } else {
            this._camera.position.x = value.x
            this._camera.position.y = value.y
            this._camera.position.z = value.z
            return this._camera.position
          }
        } else {
          console.error("Camera.set used with wrong param name (angle|pos)")
        }
      } else {
        console.error("Camera.set used with wrong params")
      }
    }

    add (param, value, holder = false) {
      if (value && param) {
        if (param == "angle") {
          if (holder) {
            this._holder.rotation.x += value.x
            this._holder.rotation.y += value.y
            this._holder.rotation.z += value.z
            return this._holder.rotation
          } else {
            this._camera.rotation.x += value.x
            this._camera.rotation.y += value.y
            this._camera.rotation.z += value.z
            return this._camera.rotation
          }
        } else if (param == "pos") {
          if (holder) {
            this._holder.position.x += value.x
            this._holder.position.y += value.y
            this._holder.position.z += value.z
            return this._holder.position
          } else {
            this._camera.position.x += value.x
            this._camera.position.y += value.y
            this._camera.position.z += value.z
            return this._camera.position
          }
        } else {
          console.error("Camera.add used with wrong param name (angle|pos)")
        }
      } else {
        console.error("Camera.add used with wrong params")
      }
    }

  }

  /**
   * Renderer class
   */
  u.Renderer = class {
    constructor ({
      canvas,
      width,
      height,
      scene,
      camera,
      antialias = false,
      shadow = false,
      color = "#1a2c41"
    } = {}) {

      this._renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: antialias
      })

      this._renderer.setClearColor(new THREE.Color(color))
      this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      this._renderer.setSize(width, height)
      this._renderer.shadowMap.enabled = shadow

      this._scene = scene
      this._camera = camera.get()
    }

    updateSize (width, height) {
      this._renderer.setSize (width, height)
    }

    render () {
      this._renderer.render(this._scene, this._camera)
    }

    get () {
      return this._renderer
    }
  }

  /**
   * Composer class
   */
  u.Composer = class {
    constructor ({
      renderer,
      scene,
      camera,
      bloom = false,
      blur = false,
      film = false,
      bleach = false,
      dotScreen = false,
      vignette = false,
      outline = false
    } = {}) {
      this._composer = () => console.info("Not init with this.updatePass()")

      this._renderer = renderer.get()
      this._scene = scene
      this._camera = camera.get()

      this._config = {
        bloom: bloom,
        blur: blur,
        film: film,
        bleach: bleach,
        dotScreen: dotScreen,
        vignette: vignette,
        outline: outline
      }

      // Basic render
      this._renderPass = new THREE.RenderPass(this._scene, this._camera)

      // TV effect
      this._filmPass = new THREE.FilmPass(0.5, 0.05, 1000, false)
      // Bloom effect
      this._bloomPass = new THREE.BloomBlendPass(8, 1, new THREE.Vector2(1024, 1024))

      // Bleach effect
      this._bleachPass = new THREE.ShaderPass(THREE.BleachBypassShader)

      // Vignette effect
      this._vignettePass = new THREE.ShaderPass(THREE.VignetteShader)
      this._vignettePass.uniforms["offset"].value = 0.6
      this._vignettePass.uniforms["darkness"].value = 2

      // Blur effect
      this._hBlurPass = new THREE.ShaderPass(THREE.HorizontalBlurShader)
      this._vBlurPass = new THREE.ShaderPass(THREE.VerticalBlurShader)
      this._hBlurPass.uniforms['h'].value = 1 / 700
      this._vBlurPass.uniforms['v'].value = 1 / 700

      // Dot screen effect
      this._dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8)

      // Outline Pass
      this._outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this._scene,
        this._camera
      )
      this._outlinePass.pulsePeriod = 5

      // CopyPass
      this._copyPass = new THREE.ShaderPass(THREE.CopyShader)
      this._copyPass.renderToScreen = true

      this.updatePass()
    }

    // Update pass according to options
    updatePass ({
      bloom,
      blur,
      film,
      bleach,
      dotScreen,
      vignette,
      outline
    } = {}) {
      if (bloom != undefined) { this._config.bloom = bloom}
      if (blur != undefined) { this._config.blur = blur}
      if (film != undefined) { this._config.film = film}
      if (bleach != undefined) { this._config.bleach = bleach}
      if (dotScreen != undefined) { this._config.dotScreen = dotScreen}
      if (vignette != undefined) { this._config.vignette = vignette}
      if (outline != undefined) { this._config.outline = outline}

      this._composer = new THREE.EffectComposer(this._renderer)
      this._composer.addPass(this._renderPass)

      if (this._config.blur) {
        this._composer.addPass(this._hBlurPass)
        this._composer.addPass(this._vBlurPass)
      }

      if (this._config.bloom) { this._composer.addPass(this._bloomPass) }
      if (this._config.film) { this._composer.addPass(this._filmPass) }
      if (this._config.bleach) { this._composer.addPass(this._bleachPass) }
      if (this._config.dotScreen) { this._composer.addPass(this._dotScreenPass) }
      if (this._config.vignette) { this._composer.addPass(this._vignettePass) }
      if (this._config.outline) { this._composer.addPass(this._outlinePass) }

      this._composer.addPass(this._copyPass)
    }

    updateSize (width, height) {
      this._composer.setSize(width, height)
      // Updating vector bases pass
      this._outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(width, height),
        this._scene,
        this._camera
      )
      this._outlinePass.pulsePeriod = 5
      this.updatePass()
    }

    outlineSelect (array = []) {
      this._outlinePass.selectedObjects = array
    }

    render () {
      this._composer.render()
    }
  }

  /**
   * Craft
   */

  /**
   * Random color material
   */
  u.randomColorMaterial = ({
    hue = Math.floor(Math.random() * 360),
    saturation = 100,
    lightness = 50,
    metalness = 0.1,
    roughness = 0.7,
    opacity = 1
  } = {}) => {

    let transparent = false
    if (opacity < 1) {
      transparent = true
    }

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`),
      flatShading: true,
      metalness: metalness,
      roughness: roughness,
      opacity: opacity,
      transparent: transparent
    })
  }

  return u

}());
