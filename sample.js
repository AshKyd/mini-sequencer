// Here are some instruments configured as jsfxr strings.
// You can make new instruments with this tool:
// http://www.superflashbros.net/as3sfxr/
function makeJSFXRAudio(initArray){
    return jsfxr(initArray);
}
var instruments = {
    cymbal: makeJSFXRAudio([3,,0.1787,,0.1095,0.502,,,,,,,,0.2868,,,,,1,,,0.1,,0.5]),
    drum: makeJSFXRAudio([3,,0.1787,,0.1095,0.17,,-0.58,,,,,,0.2868,,,,,1,,,0.1,,0.5]),
    bass: makeJSFXRAudio([0,,0.1897,0.2618,1,0.12,,0.02,,,,,,0.4812,-0.1783,,,,1,,,0.132,,0.5]),
    wave: makeJSFXRAudio([0,0,0.037985307862982154,0.5060126532800495,0.4385391124524176,0.5989582167007029,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0.4])
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
    ['drumloop', 'wave'],
    [{n:'wave',p:1.06}],
    [{n:'wave',p:1.12}],
    [{n:'wave',p:1.18}],
    ['drumloop',{n:'wave',p:1.24}],
    [{n:'wave',p:1.3}],
    [{n:'wave',p:1.36}],
    [{n:'wave',p:1.42}],
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
    instruments: instruments, // The Audio elements
    loops: loops, // Loops
    song: song, // The actual song
    loop: true, // Loop over and over
    buffer: 1.4, // seconds buffer. ~min Chrome lets us have in a background tab
    onComplete: function(){
        // Call me every time the song ends
        console.log('Song looping');
    }
});

// Start the loops playing after 2 seconds.
window.setTimeout(function(){
    console.log('starting');
    s.play();
}, 1000);

document.querySelector('button').onclick = function(){
    s.stop();
};
