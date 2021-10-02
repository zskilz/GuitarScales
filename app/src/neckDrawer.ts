import { commonScales, noteNames, tPreset, tSettings, tunings } from "./musicHelpers.js";


/**
       *
       * Draws a 6-string guitar's fretboard with musical scales highlighted.
       *
       * e: a element to contain canvas.
       * scale: Array of 12 binary ints(1 or 0), denotes a which notes are present in the musical scale
       * tuning: Array of 5 values denoting the offset from the tuningBase. excludes the tuningBase
       * handedness: String, 'right' or 'left'. Denotes how the guitar is strung. Lefthanded or Righthanded.
       * baseNote: int, a offset for SciNotes Array... 'A' through 'G#', denoting musical key or root.
       * tuningBase: int, as baseNote, denotes note the guitar's fattest string is tuned to. Default is 'E'
       * flip: boolean, weither to turn around the fretboard image.
       */
export const neckDrawer = (e: HTMLCanvasElement, scales: tPreset, settings: tSettings) => {
    //settings.tuning, settings.handed, settings.tuningBase, settings.flip

    let w = 540,
        h = 100,
        max = Math.pow(2, (18 / 12)),
        l = w / (max - 1),
        offset = 10,
        markWidth = 8;
    e.width = w + offset * 2;
    e.height = h + offset * 2;

    const cnxt = e.getContext('2d');
    if (!cnxt) throw ('Canvas not supported');

    if (settings.handedness != 'right') {

        cnxt.scale(1, -1);
        cnxt.translate(0, -(h + offset * 2));
    }
    if (settings.flip) {
        cnxt.scale(-1, -1);
        cnxt.translate(-(w + offset * 2), -(h + offset * 2));
    }

    const _drawFrets = function () {

        for (var x, i = 0; i < 18; i++) {
            x = max * l - Math.pow(2, ((18 - i) / 12)) * l;
            cnxt.fillRect(x + offset, offset, i == 12 ? 2 : 1, h);
        }
        cnxt.fillRect(offset / 2, offset, 1, h);

    }
        , _drawStrings = function () {

            for (var d, y, i = 0; i < 6; i++) {
                y = h * (i / 5) + offset;
                d = ((i / 5) + 0.2) * 2;

                cnxt.fillRect(offset, y, w, d);

            }
        }
        , _drawPos = function (scaleInd: number) {

            var scale = scales[scaleInd];
            if (scale.hide) return;
            for (var r, y, t, i = 0; i < 6; i++) {
                r = (i / 5);

                y = h * r;
                if ((5 - i) > 0) {
                    t = tunings[settings.tuning][(5 - i) - 1];
                }
                else {
                    t = 0;
                }
                for (var n, x, j = 0; j < 18; j++) {
                    n = (j + t - noteNames.indexOf(scale.baseNote) + noteNames.indexOf(settings.tuningBase)) % 12;
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
        }

        , scaleColors = ['rgba(0,0,0,0.5)', 'rgba(200,0,0,0.5)', 'rgba(0,200,0,0.5)', 'rgba(0,0,200,0.5)']
    return {
        draw: () => {

            _drawFrets();
            _drawStrings();
            scales.forEach((_, i) => {
                cnxt.strokeStyle = (scaleColors[i % 4]);
                cnxt.fillStyle = (scaleColors[i % 4]);
                _drawPos(i);
            })
        }
    }

}


