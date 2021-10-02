


export const noteNames = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    , handedness = ['left', 'right']
export type tNoteNames = typeof noteNames[number]
export type tTunings = keyof typeof tunings
export type tScales = keyof typeof commonScales
export type tSettings = {
    tuning: tTunings,
    handedness: typeof handedness[number],
    baseNote?: number,
    tuningBase: tNoteNames,
    flip: boolean
}
export type tScale = {
    baseNote: string,
    scale: tScales,
    hide?: boolean
}

export type tPreset = tScale[]

export type tPresets = {
    [name: string]: tPreset
}


/*
   generates a pythagorean note scale.
   Params:
     count is the fool (defaults to 5 itterations)
     interval is the dashing rogue (defaults to 7 semitones)
     shift is the heroine. (defaults to 0 base shift)
 */


export const scaleGen = (count = 5, interval = 7, shift = 0) => {

    shift = shift > 0 ? (shift % 12) : 12 + (shift % 12)

    let base = Array(12).fill(0)

    for (var _i = 0; _i < count; _i++) {
        var pos = (_i * interval) % 12;
        base[pos] = 1;
    }
    var _base = base.splice(shift);
    base = _base.concat(base);
    return base;
},
    mix = (...args: number[][]) => {
        var result: number[] = [];
        return args.reduce((m, arr) => {
            arr.reduce((m, v, j) => {
                m[j] = m[j] | v
                return m
            }, m)
            return m
        }, result)
    },
    swap = (scale: number[], notePosTuple: number[]) => {
        return scale.map((v, i) => {
            let ind = notePosTuple.indexOf(i)
            return ind == -1 ? v : scale[notePosTuple[ind ? 0 : 1]]
        });
    },
    commonScales = {
        MajorPentatonic: scaleGen(5),
        MinorPentatonic: scaleGen(5, 7, -3),
        Pythag: scaleGen(7),
        Major: scaleGen(7, 7, 7),
        NaturalMinor: scaleGen(7, 7, 4),
        Dorian: scaleGen(7, 7, -3),
        Mixolydian: scaleGen(7, 7, 2),
        HarmonicMinor: swap(scaleGen(7, 7, 4), [11, 10])
    },
    tunings = {
        Standard: [5, 10, 15, 19, 24],
        Dropped: [7, 12, 17, 21, 26],
        Major: [4, 7, 12, 19, 24],
        Equal7: [7, 14, 21, 28, 35],
        Equal5: [5, 10, 15, 20, 25],
        Equal3: [3, 6, 9, 12, 15],
        Equal2: [2, 4, 6, 8, 10],

    }
export let offset = 10
