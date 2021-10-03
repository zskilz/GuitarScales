import { App } from "./app.js"

let templateCache: DocumentFragment

let setup = async (self: HTMLElement) => {
  if (!templateCache) {
    let templateStr = await fetch('../guitarScales.html').then(response => response.text())

    let templateW = document.createElement('div')

    templateW.innerHTML = templateStr.trim()

    let template = templateW.querySelector('template')?.content

    if (!template) throw ("Tempalte not supported")
    templateCache = template
  }

  let wrapper = document.createElement('div')

  wrapper.append(templateCache.cloneNode(true))
  let canvas = wrapper.querySelector('.theCanvas') as HTMLCanvasElement
    , app = App(canvas)
    , modelElements = wrapper.querySelectorAll('[model]')


  modelElements.forEach(el => {
    let modelName = el.getAttribute('model')
    if (el.tagName === 'SELECT') {
      (el as HTMLSelectElement).addEventListener('change', (e) => {

        debugger;
        console.log(modelName, e);
      })
    }
  })


  self.attachShadow({ mode: 'open' }).append(wrapper)
  app.updateScales()
}


customElements.define('guitar-scales',
  class GuitarScales extends HTMLElement {
    constructor() {
      super()
      setup(this)
    }
  }
)