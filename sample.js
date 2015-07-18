// Here are some instruments configured as jsfxr strings.
// You can make new instruments with this tool:
// http://www.superflashbros.net/as3sfxr/
function makeJSFXRAudio(initArray){
    var a = new Audio();
    a.src = jsfxr(initArray);
    return a;
}
var instruments = {
    cymbal: makeJSFXRAudio([3,,0.1787,,0.1095,0.502,,,,,,,,0.2868,,,,,1,,,0.1,,0.5]),
    drum: makeJSFXRAudio([3,,0.1787,,0.1095,0.17,,-0.58,,,,,,0.2868,,,,,1,,,0.1,,0.5]),
    bass: makeJSFXRAudio([0,,0.1897,0.2618,1,0.12,,0.02,,,,,,0.4812,-0.1783,,,,1,,,0.132,,0.5])
};

// Milliseconds per beat.
var loopSpeed = 200;

// Predefined loops. Saves duplication in the song.
var loops = {
    drumloop: [
        ['drum'],
        ['drum'],
        ['drum', 'cymbal'],
        ['drum'],
    ]
};

// The song! Put instruments/loops in here.
var song = [
    ['drumloop'],
    [],
    [],
    [],
    ['drumloop'],
    [],
    [],
    [],
    ['drumloop', 'bass'],
    [],
    [],
    [],
    ['drumloop', 'bass'],
    [],
    [],
    [],
];

// Fire up a sequencer with all of the above
var s = new Sequencer({
    loopSpeed: loopSpeed, // milliseconds per beat
    instruments: instruments,
    loops: loops,
    song: song,
    jsfxr: jsfxr,
    loop: true,
    onComplete: function(){
        console.log('Song looping');
    }
});

// Start the loops playing after 2 seconds.
window.setTimeout(function(){
    console.log('starting');
    s.play();
}, 2000);
