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

    this._ctx.$output = $output
    this._ctx.$canvas = $output.querySelector("canvas")

    this._ctx.w = this._ctx.$output.offsetWidth
    this._ctx.h = this._ctx.$output.offsetHeight

    this._ctx.cAngle = 70 // Camera angle

    this._ctx.scene = new THREE.Scene()
    this._ctx.camera = new Utils3.Camera(this._ctx.scene, this._ctx.cAngle, this._ctx.w, this._ctx.h)
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
      camera: this._ctx.camera
    })
  }
  
  // Init everything
  init () {
    window.addEventListener("resize", this.sizeUpdate.bind(this))
    
    this.torus()
    this.loop()
  }
  
  torus () {
    this._mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(.7, .2, 100, 8),
      new THREE.MeshPhongMaterial({ color: 0xff0000, flatShading: true})
    )
    this._ctx.scene.add(this._mesh)
    
    this._floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0x00ff00})
    )
    this._floor.rotation.x = -Math.PI * 0.5
    this._floor.position.y = -1.2
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
    //this._ctx.composer.updateSize(this._ctx.w, this._ctx.h)
  }
  
  loop () {
    window.requestAnimationFrame(this.loop.bind(this))
    this._mesh.rotation.y += 0.01
    this._ctx.composer.render()
  }
}