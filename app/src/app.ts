import { noteNames, tPreset, tPresets, tScale, tScales, tSettings } from "./musicHelpers.js"
import { neckDrawer } from "./neckDrawer.js"


export const App = (canvas: HTMLCanvasElement) => {


    let presets: tPresets = {
        blank: [],
        beeBopExample: [{ "baseNote": "E", "scale": "Major" }, { "baseNote": "B", "scale": "MinorPentatonic" }],
        equivalence: [{ "baseNote": "C", "scale": "Pythag" }, { "baseNote": "G", "scale": "Major" }, { "baseNote": "A", "scale": "Dorian" }, { "baseNote": "D", "scale": "Mixolydian" }],
        majorAsThreePentatonics: [{ "baseNote": "E", "scale": "MajorPentatonic" }, { "baseNote": "A", "scale": "MajorPentatonic" }, { "baseNote": "B", "scale": "MajorPentatonic" }, { "baseNote": "E", "scale": "Major", "hide": true }],
        whiteStripes: [{ "baseNote": "E", "scale": "Major" }, { "baseNote": "A", "scale": "Major" }, { "baseNote": "B", "scale": "Major" }],
        nirvana: [{ "baseNote": "E", "scale": "MajorPentatonic" }, { "baseNote": "C", "scale": "MajorPentatonic" }]
    }

        , currentScales: tPreset = [
            { baseNote: "E", scale: "MinorPentatonic" }
        ]

        , setScales = (preset: tPreset) => {
            currentScales = Object.assign({}, preset);
        }

        , transpose = (n: number) => {
            currentScales.forEach(scale => {
                var currInd = noteNames.indexOf(scale.baseNote);
                currInd = (currInd + n) % 12;
                currInd = currInd >= 0 ? currInd : (12 + currInd);
                scale.baseNote = noteNames[currInd];
            });
        }

        , addScale = () => {
            if (currentScales.length < 4)
                currentScales.push({ baseNote: "E", scale: "MajorPentatonic" })
        }

        , removeScale = (scale: tScale) => {
            currentScales.splice(currentScales.indexOf(scale), 1);
        }
        , settings: tSettings = {
            tuningBase: "E",
            tuning: "Standard",
            handedness: "right",
            flip: false
        }


        , neck = neckDrawer(canvas)
        , updateScales = () => {
            neck(currentScales, settings);
        }

    return {
        presets,
        currentScales,
        setScales,
        updateScales,
        transpose,
        addScale,
        removeScale,
        settings
    }

};

export type tGuitarScales = ReturnType<typeof App>

