const Snap = require('snapsvg');

/**
 * These refer to the default settings
 * of the viewer. The User can 
 * overwrite them in the render 
 * method
 */
const defaults = {
    width: 500,
    height: 500,
    strings: ['G', 'C', 'E', 'A'],
    strokeWidth: 5,
    strokeStyle: '#000',
    fretEnumeration: 4,
    fontFamily: 'Gill Sans',
    fontSize: '36px'
};


/**
 * This function draws the fret number(s) on the board
 */
const drawFretNum = function(elem, s) {
    for(let i = 0; i < s.numStrings + 1; i++) {
        const fretNum = i + s.offset;
        if (fretNum % s.fretEnumeration === 0) {
            const fretHeight = s.spacing * s.numStrings;
            const fret = elem.text(s.spacing * i + s.spacing / 2, fretHeight + s.spacing / 1.25, fretNum);
            fret.attr({
                'font-family': 'Gill Sans',
                'font-size': '36px'
            });
        }
    }
};


/**
 * This function draws a note on the given instrument
 */
const drawNote = function(elem, note, instrument, s) {
    const noteX = (note.fret - s.offset) * s.spacing + (s.spacing / 2) + (s.strokeWidth / 2);
    const noteY = note.string * s.spacing;
    const circ = elem.circle(noteX, noteY, s.spacing / 4);
    if (note.fret === 0) {
        circ.attr({
            fill: 'none'
        });
    } else {
        circ.attr({
            fill: s.strokeStyle
        });
    }
};


/**
 * This function draws a chord on the given instrument
 */
const drawChord = function(elem, chord, instrument, s) {
    for (let i = 0; i < chord.notes.length; i++) {
        drawNote(elem, chord.notes[i], instrument, s);
    }
};


/**
 * This function draws the board according to 
 * the provided settings
 */
const drawBoard = function(elem, instrument, s) {
    // draw the strings
    for (let i = 0; i < s.numStrings; i++) {
        const stringHeight = s.start + (i * s.spacing);
        const note = elem.text(s.spacing / 2, stringHeight + 12, instrument.strings[i]);
        note.attr({
            'font-family': 'Gill Sans',
            'font-size': '36px'
        });
        const string = elem.rect(s.spacing, stringHeight, s.width, s.strokeWidth);
        string.attr({
            fill: s.strokeStyle,
        });
    }
    // draw the frets
    for (let i = 0; i < s.numStrings + 2; i++) {
        const fretOffset = s.spacing + i * s.spacing;
        const fretHeightStart = s.spacing * 1;
        const fretHeightEnd = s.spacing * (s.numStrings - 1);
        const fret = elem.rect(fretOffset, fretHeightStart, s.strokeWidth, fretHeightEnd);
        fret.attr({
            fill: s.strokeStyle,
        });
    }
    drawFretNum(elem, s);
};


/**
 * Use the instrument, chord, and other settings to
 * create the settings for the object
 */
const initialize = function(instrument, chord, s) {
    let initial = {};
    let settings = s || {};

    initial.fretEnumeration = settings.fretEnumeration ? settings.fretEnumeration : defaults.fretEnumeration; 
    initial.numStrings = instrument.strings.length || defaults.numStrings;
    initial.height = settings.height ? settings.height - (settings.height / 6) : defaults.height - (defaults.height / 6);
    initial.width = settings.width ? settings.width - (settings.width / 6) : defaults.width - (defaults.width / 6);
    initial.strokeWidth = settings.strokeWidth ? settings.strokeWidth : defaults.strokeWidth;
    initial.strokeStyle = settings.strokeStyle ? settings.strokeStyle : defaults.strokeStyle;
    initial.spacing = (initial.height - initial.strokeWidth) / (initial.numStrings + 1);
    initial.start = initial.spacing;

    let furthestChord = 0;
    for (let i = 0; i < chord.notes.length; i++) {
        if (chord.notes[i].fret > furthestChord) {
            furthestChord = chord.notes[i].fret;
        } 
    }
    let numFrets = initial.numStrings + 1;
    initial.offset = furthestChord - numFrets;
    if (initial.offset < 0) {
        initial.offset = 0;
    }

    return initial;
};
  
  
/**
 * Given an SVG element, an instrument, and a chord,
 * this function renders a chord on it. The user can also
 * optionally define some settings that alter the appearance
 */
const render = function (elem, instrument, chord, settings) {
    const initialSettings = initialize(instrument, chord, settings);
    let svg = Snap(elem);
    drawBoard(svg, instrument, initialSettings);
    drawChord(svg, chord, instrument, initialSettings);
};


export { render };


// /**
//  * This is our Renderer. The Renderer 
//  * takes in a 
//  */
// const Renderer = function() {

//   /**
//    * Given a DOM element, render the 
//    * chord into that element
//    */
//   const render = function() {
//     let $elem = $(this);
//     let $svg = $('<svg width="500" height="500"></svg>');
//     const svg = Snap($svg.get(0));
//     $elem.append($svg);
//     const chord = $elem.data('chord');

//     const settings = initialize(ukulele, DChord, { 
//       fretEnumeration: 2 
//     });

//     drawBoard(svg, ukulele, settings)
//     // drawNote(svg, 'C', ukulele, settings);
//     drawChord(svg, DChord, ukulele, settings);
//   }

//   return {
//     render: render
//   };
// };