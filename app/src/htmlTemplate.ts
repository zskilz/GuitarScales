let cache = new Map<string, string>()//tplt>()
let paramMatcher = /\${\s*(\w+)\s*}/g
let stringMatcher = /\${\s*\w+\s*}/g

type tValues = (object | string)[]
type tKeys = (string | number)[]

let tmplt = (strings: TemplateStringsArray | string[], ...keys: tKeys) => {
    return (function (...values: tValues) {
        //using last parameter as lookup dict
        let dict = (values[values.length - 1] || {}) as object;
        let result = [strings[0]];
        keys.forEach(function (key, i) {
            let value =
                Number.isInteger(key) ?
                    (values as string[])[key as keyof string[]]
                    : dict[key as keyof typeof dict];
            result.push(value as string, strings[i + 1]);
        });
        return result.join('');
    });
}

type tplt = ReturnType<typeof tmplt>

type tModelVal = string | boolean

interface tModel {
    [name: string | number]: tModelVal | tModel
}

interface tOptions {
    [name: string]: any // tModel
}
export interface tApp {
    options: tOptions,
    model: tModel,
    update: () => void
}
export type AppBinder = (el: HTMLElement) => tApp

const addOption = (sel: HTMLSelectElement, txt: string) => {
    let optT = document.createElement('option')
    optT.innerText = txt
    optT.value = txt
    sel.appendChild(optT)
}

const bindSelects = (wrapper: HTMLElement, app: tApp, model: tModel) => {
    let modelElements = wrapper.querySelectorAll('select[model]:not(z-repeat select[model])')

    modelElements.forEach(el => {
        let sel = el as HTMLSelectElement
            , options = app.options[sel.getAttribute('options') as keyof tOptions]
            , modelName = sel.getAttribute('model') as keyof tModel
        if (Array.isArray(options)) {
            options.forEach(txt => addOption(sel, txt))
        } else if (typeof options == 'object') {
            for (let txt in options) addOption(sel, txt)
        }
        sel.onchange = (e) => {
            let txt = (e.target as HTMLSelectElement).value as tModelVal
            model[modelName] = txt
            app.update()
        }

    })
}

/**
 * Async fetch of HTML template fragments from file server.
 * @param path - URL for .html containing <template>
 * @returns Document fragment renderer.
 */
export const getHTMLTemplateRenderer = async (path: string, appBinder: AppBinder) => {

    let _template = await getTemplate(path)
    if (!_template)
        throw ('Tempalte failed to load')
    let template = _template
    let templateW = document.createElement('div')
    let wrapper: HTMLDivElement, app: tApp


    const buildView = (...values: tValues) => {
        templateW.innerHTML = template//(...values) //templateStr.trim()

        let HTMLtemplate = templateW.querySelector('template')?.content
        if (!HTMLtemplate) throw ('No template rendered.')

        wrapper = document.createElement('div')

        wrapper.append(HTMLtemplate.cloneNode(true))

        app = api.app = appBinder(wrapper)

        return wrapper
    }

    let api = {
        app: undefined as tApp | undefined,
        buildView,
        bindEvents: () => bindSelects(wrapper, app, app.model)
    }
    return api
}

// -----------------------------------------------------------
// TODO: remove Awaited def when Typescript 4.5 is released...
type Awaited<T> = T extends PromiseLike<infer U> ? U : T
// -----------------------------------------------------------

type tHTMLTemplateRenderer = Awaited<ReturnType<typeof getHTMLTemplateRenderer>>

/**
 * Async fetch of HTML template fragments from file server.
 * @param path - URL for .html containing <template>
 * @returns String representing the raw template HTML.
 */
export const getTemplate = async (path: string) => {
    let template = cache.get(path)
    if (!template) {
        let templateStr = await fetch(path).then(response => response.text())

        if (!templateStr) throw ('Tempalte failed to load')

        template = templateStr

        cache.set(path, template)
    }
    return template
}


/**
 * Turn regular string into tagged template
 * @param templateStr - String to be turned into a tagged template
 * @returns 
 */
function templatify(templateStr: string) {
    //extract mappable keys.
    let keys = [...templateStr.matchAll(paramMatcher)].map(m => m[1])

    let strings = templateStr.split(stringMatcher);

    // make the template
    return tmplt(strings, ...keys)
}

class zElement extends HTMLElement {
    api?: tHTMLTemplateRenderer
}

customElements.define('z-repeat',
    class extends HTMLElement {
        parentHost: zElement
        rawTemplate: string
        template: tplt
        api: tHTMLTemplateRenderer
        model: tModel
        constructor() {
            super()
            this.attachShadow({ mode: 'open' })
            //only used inside custom elements
            let root = this.getRootNode() as ShadowRoot

            if (root.host) this.parentHost = root.host as zElement
            else throw ('Element initilialization failed. Can only be used inside a zEmelent')

            if (!this.parentHost.api) throw ('API not initialised.')

            this.api = this.parentHost.api
            this.rawTemplate = this.innerHTML
            this.template = templatify(this.rawTemplate)
            let modelKey = this.getAttribute('over')
            if (!modelKey) throw ('repeat needs "over" attribute')
            this.model = this.api.app!.options[modelKey]
            if (!this.model) throw (`Model "${modelKey}" not provided`)
        }
        connectedCallback() {
            if (this.shadowRoot && this.api.app) {
                for (let Ind in this.model) {
                    let context = { Ind, ...this.model[Ind] as tModel }
                    let wrapper = document.createElement('div')
                    let initStr = this.template(context)
                    wrapper.innerHTML = initStr
                    while (wrapper.children.length) {
                        let element = wrapper.children[0] as HTMLElement
                        this.shadowRoot.appendChild(element)
                        bindSelects(element, this.api.app, this.model[Ind] as tModel)
                    }
                }
            }
        }
    })

export function makeCustomElement(tagName: string, appBinder: AppBinder, templatePath: string) {

    let setupTemplates = async (self: zElement) => {
        let api = await getHTMLTemplateRenderer(templatePath, appBinder)
        self.api = api
        let view = api.buildView()
        self.shadowRoot!.append(view)
        api.bindEvents()
        api.app!.update()
    }

    class customElement extends zElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' })
        }
        connectedCallback() {
            setupTemplates(this)
        }
    }

    customElements.define(tagName, customElement)
}
