import { tSettings } from "./app.js";
import { commonScales, noteNames, tNoteNames, tPreset, tScale, tTunings, tunings } from "./musicHelpers.js";

/**
 * Neck Drawing Function Type
 * @param scales Array of 12 binary ints(1 or 0), denotes a which notes are present in the musical scale
 * @param settings Settings of type : {@link tSettings}
 */
type tDrawneck =
    (scales: tPreset, settings: tSettings) => void

/**
 * Constructs a drawer function
 * @param e Canvas Element
 * @returns draw function of type: {@link tDrawneck}
 */
export const neckDrawer = (e: HTMLCanvasElement): tDrawneck => {

    let w = 540,
        h = 100,
        max = Math.pow(2, (18 / 12)),
        l = w / (max - 1),
        offset = 10,
        markWidth = 8
    e.width = w + offset * 2
    e.height = h + offset * 2

    const cnxt = e.getContext('2d');
    if (!cnxt) throw ('Canvas not supported');

    const _drawFrets = function () {

        for (let x, i = 0; i < 18; i++) {
            x = max * l - Math.pow(2, ((18 - i) / 12)) * l
            cnxt.fillRect(x + offset, offset, i == 12 ? 2 : 1, h)
        }
        cnxt.fillRect(offset / 2, offset, 1, h)

    },
        _drawStrings = function () {

            for (let d, y, i = 0; i < 6; i++) {
                y = h * (i / 5) + offset
                d = ((i / 5) + 0.2) * 2

                cnxt.fillRect(offset, y, w, d)

            }
        },
        _drawPos = function (scale: tScale, settings: tSettings) {
            if (scale.hide) return;
            for (let r, y, t, i = 0; i < 6; i++) {
                r = (i / 5)

                y = h * r
                if ((5 - i) > 0) {
                    t = tunings[settings.tuning as tTunings][(5 - i) - 1]
                }
                else {
                    t = 0;
                }
                for (let n, x, j = 0; j < 18; j++) {
                    n = (j + t - noteNames.indexOf(scale.baseNote) + noteNames.indexOf(settings.tuningBase as tNoteNames)) % 12;
                    n = (n < 0 ? 12 + n : n);
                    if (commonScales[scale.scale][n]) {
                        x = max * l - Math.pow(2, ((18 - j) / 12)) * l;
                        cnxt.beginPath();
                        cnxt.arc(offset + x, offset + y, markWidth / 2, 0, 2 * Math.PI);
                        cnxt.stroke();
                        if (n === 0)
                            cnxt.fill();
                    }
                }
            }
        },
        scaleColors = ['rgba(0,0,0,0.5)', 'rgba(200,0,0,0.5)', 'rgba(0,200,0,0.5)', 'rgba(0,0,200,0.5)']

    return (scales: tPreset, settings: tSettings) => {
        cnxt.fillStyle = 'white'
        cnxt.clearRect(0, 0, e.width, e.height)
        cnxt.resetTransform()

        if (settings.handedness != 'right') {
            cnxt.scale(1, -1)
            cnxt.translate(0, -(h + offset * 2))
        }
        if (settings.flip) {
            cnxt.scale(-1, -1)
            cnxt.translate(-(w + offset * 2), -(h + offset * 2))
        }

        cnxt.fillStyle = 'black'

        _drawFrets()
        _drawStrings()
        scales.forEach((scale, i) => {
            cnxt.strokeStyle = (scaleColors[i % 4])
            cnxt.fillStyle = (scaleColors[i % 4])
            _drawPos(scale, settings)
        })
    }
}


