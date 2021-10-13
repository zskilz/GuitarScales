

/** Classical semi-tone names */
export const noteNames =
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"] as const,
    /** Order of sting widths */
    handedness = ['right', 'left'] as const

//--------------------------------
// Types
//--------------------------------
export type tNoteNames = typeof noteNames[number]
export type tTunings = keyof typeof tunings
export type tScales = keyof typeof commonScales

// export type tSettingVal = string | boolean

// interface tSetting {
//     [settingName: string]: tSettingVal
// }

// /**
//  * General settings
//  * 
//  * @param tuning: Tuning {@link tTunings}
//  * @param handedness 'right' or 'left'. Denotes how the guitar is strung. Lefthanded or Righthanded.
//  * @param baseNote: a offset for SciNotes Array... 'A' through 'G#', denoting musical key or root.
//  * @param tuningBase: as baseNote, denotes note the guitar's fattest string is tuned to. Default is 'E'
//  * @param flip: weither to turn around the fretboard image.
//  */
// export interface tSettings extends tSetting {
//     tuning: tTunings,
//     handedness: typeof handedness[number],
//     baseNote?: tNoteNames,
//     tuningBase: tNoteNames,
//     flip: boolean
// }

export type tScale = ReturnType<typeof Scale>

export type tPreset = tScale[]

export type tPresets = {
    [name: string]: tPreset
}

interface FixedLengthArray<L extends number, T> extends Array<T> {
    length: L
}

type tNotePosTuple = [number, number]

export type tRawScale = FixedLengthArray<12, boolean>

/**
 * Scale Object Factory
 * @param baseNote The base note
 * @param scale Which scale
 * @param hide Optional for hiding
 * @returns Constructed object
 */
export const Scale = (baseNote: tNoteNames, scale: tScales, hide?: boolean) => {
    return { baseNote, scale, hide }
}

/** 
 * Generates scales using circle-of-fiths technique (Pythagorean construction)
 *
 * @param count itterations (defaults to 5 itterations)
 * @param interval semitone skip interval (defaults to 7 semitones)
 * @param shift how much to shift the pattern by (defaults to 0 base shift)
 * @returns Array of length 12 with bools representing a musical scale.
 */
const scaleGen = (count = 5, interval = 7, shift = 0): tRawScale => {

    let base: tRawScale = Array(12).fill(false) as tRawScale

    for (let pos, _i = 0; _i < count; _i++) {
        pos = (_i * interval) % 12;
        base[pos] = true;
    }

    shift = shift > 0 ? (shift % 12) : 12 + (shift % 12)
    let _base = base.splice(shift);
    base = _base.concat(base) as tRawScale;

    return base;
},

    mix = (...args: tRawScale[]) =>
        args.reduce((m, arr) =>
            arr.reduce((m, v, j) => {
                m[j] = m[j] || v
                return m
            }, m), []) as tRawScale,

    swap = (scale: tRawScale, notePosTuple: tNotePosTuple) =>
        scale.map((v, i) => {
            let ind = notePosTuple.indexOf(i)
            return ind == -1 ? v : scale[notePosTuple[ind ? 0 : 1]]
        }) as tRawScale



export const commonScales = {
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
