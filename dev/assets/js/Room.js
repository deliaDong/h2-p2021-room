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
    const geometry = new THREE.TorusKnotGeometry(3, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this._torusKnot = new THREE.Mesh(geometry, material);

    this._ctx.scene.add(this._torusKnot);
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
    this._torusKnot.rotation.y += 0.01
    //this._ctx.renderer.render()
    this._ctx.composer.render()
  }
}