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
      color = "#000000"
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
      
      this.updatePass()
    }
    
    // Update pass according to options
    updatePass () {
      this._composer = new THREE.EffectComposer(this._renderer)
      this._renderPass = new THREE.RenderPass(this._scene, this._camera)
      this._composer.addPass(this._renderPass)
      this._renderPass.renderToScreen = true
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