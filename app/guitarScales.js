define(['app'], function(app) {
  
  app.directive('guitarScales', [ function() {
      
      function link(scope, element, attrs) {
        
        scope.presets = {
          blank : [],
          beeBopExample : [{"baseNote":"E","scale":"Major"},{"baseNote":"B","scale":"MinorPentatonic"}],
          equivalence: [{"baseNote":"C","scale":"Pythag"},{"baseNote":"G","scale":"Major"},{"baseNote":"A","scale":"Dorian"},{"baseNote":"D","scale":"Mixolydian"}],
          majorAsThreePentatonics : [{"baseNote":"E","scale":"MajorPentatonic"},{"baseNote":"A","scale":"MajorPentatonic"},{"baseNote":"B","scale":"MajorPentatonic"},{"baseNote":"E","scale":"Major","hide":true}],
          whiteStripes : [{"baseNote":"E","scale":"Major"},{"baseNote":"A","scale":"Major"},{"baseNote":"B","scale":"Major"}],
          nirvana : [{"baseNote":"E","scale":"MajorPentatonic"},{"baseNote":"C","scale":"MajorPentatonic"}]
        }

        scope.currentScales = [
          {baseNote: "E",scale: "MinorPentatonic"}
        ];

        scope.setScales = function(preset){
            scope.currentScales = angular.copy(preset);
        }

        scope.transpose = function(n){
            angular.forEach(scope.currentScales, function(scale) {
              var currInd = noteNames.indexOf(scale.baseNote);
              currInd = (currInd + n)%12;
              currInd = currInd>=0?currInd:(12+currInd);
              scale.baseNote = noteNames[currInd];
            });
        }
        
        scope.noteNames = noteNames;
        scope.tunings = tunings;
        scope.scales = commonScales;
        scope.scaleColors = scaleColors;
        

        scope.addScale = function(){
            if(scope.currentScales.length<4)
                scope.currentScales.push({baseNote: "E",scale: "MajorPentatonic"})
        }

        scope.removeScale = function(scale){
           scope.currentScales.splice(scope.currentScales.indexOf(scale),1); 
        }
        
        
        scope.tuningBase = "E";
        scope.tuning = "Standard";
        scope.handedness = "right";
        
        var _canvas = angular.element(element[0].querySelector('#theCanvas'))
        
        
        var updateScales = function() {
          //update using globals
          drawNeck(_canvas, 
          scope.currentScales, 
          {
            tuning: scope.tuning,
            handedness: scope.handedness,
            tuningBase: scope.tuningBase,
            flip: scope.flip
          });
        }
        
        scope.$watch(function() {
          updateScales();
          console.log("digest called");
        });

      }
      
      return {
        restrict: "E",
        templateUrl: "guitarScales.html",
        link: link
      };
    }]);
  
  
/*

"Private" Variables

*/

  var noteNames = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"], 
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
  drawNeck = function(e, scales, settings) {
    //settings.tuning, settings.handed, settings.tuningBase, settings.flip
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
    
    if (settings.handedness != 'right') {
      
      cnxt.scale(1, -1);
      cnxt.translate(0, -(h + offset * 2));
    }
    if (settings.flip) {
      cnxt.scale(-1, -1);
      cnxt.translate(-(w + offset * 2), -(h + offset * 2));
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
    var _drawPos = function(cnxt, scaleInd) {
      
      var scale = scales[scaleInd];
      if(scale.hide) return;
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

    _drawFrets(cnxt);
    _drawStrings(cnxt);
    for (var i in scales) {
       cnxt.strokeStyle=(scaleColors[i%4]);
       cnxt.fillStyle=(scaleColors[i%4]); 
      _drawPos(cnxt, i);
    }
  
  }, 
  scaleColors = ['rgba(0,0,0,0.5)','rgba(200,0,0,0.5)','rgba(0,200,0,0.5)','rgba(0,0,200,0.5)'],
  /*
    generates a pythagorean note scale.
    Params:
      count is the fool (defaults to 5 itterations)
      interval is the dashing rogue (defaults to 7 semitones)
      shift is the heroine. (defaults to 0 base shift)
  */
  
  
  scaleGen = function(count, interval, shift) {
    count = count ? count : 5;
    interval = interval ? interval : 7;
    shift = shift ? (
    shift > 0 ? (shift % 12) : 12 + (shift % 12)
    ) : 0;
    var base = Array.apply(0, Array(12)).map(function() {
      return 0
    });
    ;
    for (var _i = 0; _i < count; _i++) {
      var pos = (_i * interval) % 12;
      base[pos] = 1;
    }
    var _base = base.splice(shift);
    base = _base.concat(base);
    return base;
  }, 
  mix = function() {
    var result = [];
    for (var i in arguments) {
      var arr = arguments[i];
      for (var j in arr) {
        result[j] = result[j] | arr[j];
      }
    
    }
    
    return result;
  }, 
  swap = function(scale, notePosTuple) {
    var r = scale.map(function(i) {
      return i
    });
    var t = r[notePosTuple[0]];
    r[notePosTuple[0]] = r[notePosTuple[1]];
    r[notePosTuple[1]] = t;
    return r;
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
  
  }, 
  offset = 10;

})
