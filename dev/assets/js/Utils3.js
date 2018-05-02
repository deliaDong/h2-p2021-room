const Utils3 = (function () {

  const u = {}

  /**
   * Camera class
   */
  u.Camera = class {
    constructor (scene, angle, width, height) {
      this._camera = new THREE.PerspectiveCamera(angle, width / height)
      this._camera.position.z = 3
      this._camera.lookAt(new THREE.Vector3())

      scene.add(this._camera)
    }

    updateSize (width, height) {
      this._camera.aspect = width / height
      this._camera.updateProjectionMatrix()
    }

    get () {
      return this._camera
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
      color = "#454545"
    } = {}) {

      this._renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: antialias
      })

      this._renderer.setClearColor(new THREE.Color(color))
      this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
    constructor ({renderer, scene, camera} = {}) {
      this._composer = () => console.info("Not init with this.updatePass()")
      
      this._renderer = renderer.get()
      this._scene = scene
      this._camera = camera.get()
      
      this._renderPass = new THREE.RenderPass(this._scene, this._camera)

      this._filmPass = new THREE.FilmPass(1, 0.01, 1000, false)
      this._filmPass.uniforms["time"].value = 10
      console.log(this._filmPass.uniforms)

      this._bloomPass = new THREE.BloomPass(0.5)

      this._bleachPass = new THREE.ShaderPass(THREE.BleachBypassShader)
      this._bleachPass.uniforms["opacity"].value = 0.9
      
      this._vignettePass = new THREE.ShaderPass(THREE.VignetteShader)
      this._vignettePass.uniforms["offset"].value = 0.8
      this._vignettePass.uniforms["darkness"].value = 2

      this._hBlurPass = new THREE.ShaderPass(THREE.HorizontalBlurShader)
      this._vBlurPass = new THREE.ShaderPass(THREE.VerticalBlurShader)
      this._hBlurPass.uniforms['h'].value = 1 / 700
      this._vBlurPass.uniforms['v'].value = 1 / 700

      this._dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8)
      //this._dotScreenPass.uniforms['scale'].value = 2

      this._copyPass = new THREE.ShaderPass(THREE.CopyShader)
      this.updatePass()
    }
    
    // Update pass according to options
    updatePass () {
      this._composer = new THREE.EffectComposer(this._renderer)
      this._composer.addPass(this._renderPass)
      //this._composer.addPass(this._hBlurPass)
      //this._composer.addPass(this._vBlurPass)
      //this._composer.addPass(this._bloomPass)
      this._composer.addPass(this._filmPass)
      this._composer.addPass(this._bleachPass)
      //this._composer.addPass(this._dotScreenPass)
      this._composer.addPass(this._vignettePass)
      this._composer.addPass(this._copyPass)
      this._copyPass.renderToScreen = true
    }

    updateSize (width, height) {
      this._composer.setSize(width, height)
    }

    render () {
      this._composer.render()
    }
  }

  return u

}());