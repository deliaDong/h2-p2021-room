/**
 * Allow creating html based cursor to remplace default one, you can add as many cursor attachement you like to the argument array.
 * @param {array} props - an array containing all your cursor attachement that will follow your cursor.
 */
class Cursor {
  constructor(props) {
    this._props = props
    this._defaultCSS = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      will-change: transform;
      pointer-events: none;
    `
    // Init once
    this._init = false

    // Setting target
    this._target = {x: window.outerWidth / 2, y: window.outerHeight / 2}
    
    if (!Modernizr.touchevents) {
      document.addEventListener("mousemove", (e) => {
        if (!this._init) {
          this._init = true
          this.initCursor()
        }
        this._target.x = e.clientX
        this._target.y = e.clientY
      })
    }
  }

  // Init functions

  initCursor () {
    // Removing classic cursor
    document.styleSheets[document.styleSheets.length - 1].insertRule(`
    html, body, a, input, textarea{
      cursor: none !important;
    }
    `, 0)

    // Creating user custom cursor
    for (let i = 0; i < this._props.length; i++) {
      this._props[i].$ = document.createElement(this._props[i].el)
      document.querySelector("body").appendChild(this._props[i].$)
      // Applying general style
      document.styleSheets[document.styleSheets.length - 1].insertRule(`
      .cursorJS.cursorJS-${i}{
        ${this._defaultCSS}
        ${this._props[i].css}
      }
      `, 0)
      // Applying active style
      document.styleSheets[document.styleSheets.length - 1].insertRule(`
      .cursorJS.cursorJS-${i}.active{
        ${this._props[i].activeCSS}
      }
      `, 0)
      this._props[i].pos = {x: window.outerWidth / 2, y: window.outerHeight / 2}
      this._props[i].$.classList.add(`cursorJS`, `cursorJS-${i}`)
    }

    // Click event
    document.addEventListener("mousedown", () => {
      for (const prop of this._props) {
        prop.$.classList.add("active")
      }
    })
    
    document.addEventListener("mouseup", () => {
      for (const prop of this._props) {
        prop.$.classList.remove("active")
      }
    })

    // Updating cursor pos
    this.update()
  }

  // Update and event functions

  update () {
    window.requestAnimationFrame(this.update.bind(this))
    for (const prop of this._props) {
      prop.pos.x = prop.pos.x + (this._target.x - prop.pos.x) * prop.easing
      prop.pos.y = prop.pos.y + (this._target.y - prop.pos.y) * prop.easing
      prop.$.style.transform = `translate(${prop.pos.x}px, ${prop.pos.y}px)`
    }
  }
}