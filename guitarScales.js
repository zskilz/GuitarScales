var guitarScales = {
    html: '\
<div>\
    <header>\
        <h1>Guitar scales</h1>\
    </header>\
    <div id="baseNote">BaseNote/Key/Root:</div>\
    <div id="scale">Scale:</div>\
    <div id="handedness">Handedness:\
        <select id="handSelect">\
            <option>right</option>\
            <option>left</option>\
        </select>\
    </div>\
    <div id="tuning">Tuning:</div>\
    <div id="tuningBase">Tuning Base Note:</div>\
    <button id="flip">Flip</button>\
    <canvas id="diag1"></canvas>\
    <footer>\
        <p>&copy; Copyright by Petrus J. Pretorius. All rights reserved.</p>\
    </footer>\
</div>\
',
    init: function() {
        var SciNotes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

        var Scales = {
            MinorPentatonic: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            MajorPentatonic: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
            Major: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
            NaturalMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            HarmonicMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
            Dorian: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            Mixolydian: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        }
        //semitones from base note for each string...
        var Tunings = {
            Standard: [5, 10, 15, 19, 24],
            Major: [4, 7, 12, 19, 24],
            Equal7: [7, 14, 21, 28, 35],
            Equal5: [5, 10, 15, 20, 25],
            Equal3: [3, 6, 9, 12, 15],
            Equal2: [2, 4, 6, 8, 10],

        }
        var offset = 10;

        /**
         *
         * Draws a 6-string guitar's fretboard with musical scales highlighted.
         *
         * e: a element to contain canvas.
         * scale: Array of 12 binary ints(1 or 0), denotes a which notes are present in the musical scale
         * tuning: Array of 5 values denoting the offset from the tuningBase. excludes the tuninfBase
         * handed: String, 'right' or 'left'. Denotes how the guitar is strung. Lefthanded or Righthanded.
         * baseNote: int, a offset for SciNotes Array... 'A' through 'G#', denoting musical key or root.
         * tuningBase: int, as baseNote, denotes note the guitar's fattest string is tuned to. Default is 'E'
         * flip: boolean, weither to turn around the fretboard image.
         */
        var drawNeck = function(e, scale, tuning, handed, baseNote, tuningBase, flip) {

            e = e[0];
            var w = 540,
                h = 100,
                max = Math.pow(2, (18 / 12)),
                l = w / (max - 1),
                offset = 10,
                markWidth = 8;
            e.width = w + offset * 2;
            e.height = h + offset * 2;

            var cnxt = e.getContext('2d');

            if (handed != 'right') {

                cnxt.scale(1, - 1);
                cnxt.translate(0, - (h + offset * 2));
            }
            if (flip) {
                cnxt.scale(-1, - 1);
                cnxt.translate(-(w + offset * 2), - (h + offset * 2));
            }

            var _drawFrets = function(cnxt) {

                for (var x, i = 0; i < 18; i++) {
                    x = max * l - Math.pow(2, ((18 - i) / 12)) * l;
                    cnxt.fillRect(x + offset, offset, i == 12 ? 2 : 1, h);
                }
                cnxt.fillRect(offset / 2, offset, 1, h);

            }
            var _drawStrings = function(cnxt) {

                for (var d, y, i = 0; i < 6; i++) {
                    y = h * (i / 5) + offset;
                    d = ((i / 5) + 0.2) * 2;

                    cnxt.fillRect(offset, y, w, d);

                }
            }
            var _drawPos = function(cnxt) {
                for (var y, t, i = 0; i < 6; i++) {
                    r = (i / 5);

                    y = h * r;
                    if ((5 - i) > 0) {
                        t = tuning[(5 - i) - 1];
                    }
                    else {
                        t = 0;
                    }
                    for (var n, x, j = 0; j < 18; j++) {
                        n = (j + t - baseNote + tuningBase) % 12;
                        n = (n < 0 ? 12 + n : n);
                        if (scale[n]) {
                            x = max * l - Math.pow(2, ((18 - j) / 12)) * l;
                            cnxt.beginPath();
                            cnxt.arc(offset + x, offset + y, markWidth / 2, 0, 2 * Math.PI);
                            cnxt.stroke();
                        }
                    }
                }
            }
            _drawFrets(cnxt);
            _drawStrings(cnxt);
            _drawPos(cnxt);

        }
        //globals
        var flip = false,
            baseNote = 0,
            tuningBase = 7,
            scale = Scales.MinorPentatonic,
            tuning = Tunings.Standard,
            handedness = 'right';

        var updateScale = function() {
            //update using globals
            drawNeck($("#diag1"), scale, tuning, handedness, baseNote, tuningBase, flip);
        }
        
        // The "real" starting point...
        return function() {
            //add the html...
            $('body').append(guitarScales.html);

            //controls and handlers...
            var baseNoteSelect = $('<select id="baseNoteSelect"/>');
            for (var i = 0, sciNote; sciNote = SciNotes[i]; i++) {
                baseNoteSelect.append('<option>' + sciNote + '</option>');
            }
            $('#baseNote').append(baseNoteSelect);
            $('#baseNoteSelect').change(function() {
                baseNote = SciNotes.indexOf($(this).val());
                updateScale();
            });

            var tuningBaseNoteSelect = $('<select id="tuningBaseNoteSelect"/>');
            for (var i = 0, sciNote; sciNote = SciNotes[i]; i++) {
                tuningBaseNoteSelect.append('<option>' + sciNote + '</option>');
            }
            tuningBaseNoteSelect.val('E');
            //E is the default tuning on a guitar..
            $('#tuningBase').append(tuningBaseNoteSelect);
            $('#tuningBaseNoteSelect').change(function() {
                tuningBase = SciNotes.indexOf($(this).val());
                updateScale();
            });

            var scaleSelect = $('<select id="scaleSelect"/>');
            $.each(Scales, function(ind, row) {
                scaleSelect.append('<option>' + ind + '</option>');
            });

            $('#scale').append(scaleSelect);
            $('#scaleSelect').change(function() {
                scale = Scales[$(this).val()];
                updateScale();
            });

            var tuningSelect = $('<select id="tuningSelect"/>');
            $.each(Tunings, function(ind, row) {
                tuningSelect.append('<option>' + ind + '</option>');
            });

            $('#tuning').append(tuningSelect);
            $('#tuningSelect').change(function() {
                tuning = Tunings[$(this).val()];
                updateScale();
            });
            $('#handSelect').change(function() {
                handedness = $(this).val();
                updateScale();
            });

            $('#flip').click(function() {
                flip = !flip;
                updateScale();
            });
            //1st update.
            updateScale();
        }
        
    }
};