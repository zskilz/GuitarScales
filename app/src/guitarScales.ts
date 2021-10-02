import { App, tGuitarScales } from "./app.js"

class GuitarScales extends HTMLElement {
  app: tGuitarScales
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    let wrapper = document.createElement('div')
      , canvas = document.createElement('canvas')
    this.app = App(canvas)
    wrapper.append(canvas)
    this.shadowRoot?.append(wrapper)
  }
}

customElements.define('guitar-scales', GuitarScales)