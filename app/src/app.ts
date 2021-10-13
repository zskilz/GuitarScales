import { AppBinder } from "./htmlTemplate.js";
import { commonScales, handedness, noteNames, Scale, tPreset, tPresets, tScale, tunings } from "./musicHelpers.js"
import { neckDrawer } from "./neckDrawer.js"

let presets: tPresets = {
    blank: [],
    beeBopExample: [Scale("E", "Major"), Scale("B", "MinorPentatonic")],
    equivalence: [Scale("C", "Pythag"), Scale("G", "Major"), Scale("A", "Dorian"), Scale("D", "Mixolydian")],
    majorAsThreePentatonics: [Scale("E", "MajorPentatonic"), Scale("A", "MajorPentatonic"), Scale("B", "MajorPentatonic"), Scale("E", "Major", true)],
    whiteStripes: [Scale("E", "Major"), Scale("A", "Major"), Scale("B", "Major")],
    nirvana: [Scale("E", "MajorPentatonic"), Scale("C", "MajorPentatonic")]
},
    currentScales: tPreset = [
        Scale("E", "MinorPentatonic")
    ],
    setScales = (preset: tPreset) => {
        currentScales = Object.assign({}, preset);
    },
    transpose = (n: number) => {
        currentScales.forEach(scale => {
            var currInd = noteNames.indexOf(scale.baseNote);
            currInd = (currInd + n) % 12;
            currInd = currInd >= 0 ? currInd : (12 + currInd);
            scale.baseNote = noteNames[currInd];
        });
    },
    addScale = () => {
        if (currentScales.length < 4)
            currentScales.push(Scale("E", "MajorPentatonic"))
    },
    removeScale = (scale: tScale) => {
        currentScales.splice(currentScales.indexOf(scale), 1);
    },
    model = {
        tuningBase: "E",
        tuning: "Standard",
        handedness: "right",
        flip: false
    }

const options = {
    presets,
    currentScales,
    noteNames,
    handedness,
    commonScales,
    tunings
}

export type tOptionsKey = keyof typeof options

export const App:AppBinder = (wrapper: HTMLElement) => {


    let canvas = wrapper.querySelector('.theCanvas') as HTMLCanvasElement,
        drawNeck = neckDrawer(canvas)

    let app = {
        actions: {
            setScales,
            transpose,
            addScale,
            removeScale
        },
        model,
        options,
        update: () => {
            drawNeck(currentScales, app.model);
        }
    }
    return app
};

export type tGuitarScales = ReturnType<typeof App>
export type tSettings = typeof model