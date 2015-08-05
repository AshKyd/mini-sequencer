function base64ToArrayBuffer(base64) {
    var binary_string = atob(base64.substr(base64.indexOf(',')+1));
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function Sequencer(opts){
    var _this = this;
    var position = 0;
    var loop = 0;
    var ctx = new (window.AudioContext || webkitAudioContext)();
    _this.buffer = opts.buffer || 0.2;
    _this.loopSpeed = opts.loopSpeed;

    var instruments, song, startTime;

    this.initLoops = function(opts){
        instruments = {};
        Object.keys(opts.instruments).forEach(function(key){
            ctx.decodeAudioData(base64ToArrayBuffer(opts.instruments[key]), function(buffer){
                console.log('Setting', key, buffer);
                instruments[key] = buffer;
            });
        });
        // init loops
        song = opts.song;
        song = song.map(function(beat, i){
            var newBeat = [];
            beat.forEach(function(beat){
                var loop = opts.loops[beat];
                if(opts.instruments[beat.n || beat]){
                    // return this beat
                    newBeat.push(beat);
                } else if(loop) {
                    // Merge the loop into the main song array.
                    newBeat = newBeat.concat(loop[0]);
                    for(var j=1; j<loop.length; j++){
                        song[i+j] = song[i+j].concat(loop[j]);
                    }
                } else {
                    // console.error('Instrument or loop not found', beat);
                }
            });
            return newBeat;
        });
    };

    this.initLoops(opts);

    function playSound(instrument, time){
        var source = ctx.createBufferSource(); // creates a sound source
        var buffer = instruments[instrument.n || instrument];
        source.playbackRate.value = instrument.p || 1;
        source.buffer = buffer;                // tell the source which sound to play
        source.connect(ctx.destination);       // connect the source to the context's destination (the speakers)

        var start = time || 0;
        source.start(start);
    }

    this.play = function(){
        var _this = this;
        var i;
        var instrument;
        _this.interval = setInterval(function(){
            if(!startTime){
                startTime = ctx.currentTime;
            }

            // Go through the next 100 beats or until we fill the buffer.
            for(var j=0; j<100; j++){
                // Pick this one.
                var beat = song[position];

                // Wrap our loop around/finish it up.
                if(position >= song.length){
                    if(opts.loop){
                        position = 0;
                        loop++;
                    } else {
                        _this.stop();
                    }
                    if(opts.onComplete){
                        opts.onComplete();
                    }
                    continue;
                }

                // The point at which this set of sounds is to be played.
                // Based on start time, position in song, and number of loops.
                var playAt = startTime + (_this.loopSpeed*position + song.length*loop*_this.loopSpeed)/1000;

                // If the buffer is more than 1.4 seconds, stop populating it.
                if(playAt > ctx.currentTime + _this.buffer){
                    console.log('Buffer full');
                    break;
                }

                // Loop through all instruments in this beat & queue them.
                for(i=0; i<beat.length; i++){
                    playSound(beat[i], playAt);
                }
                position++;
            }
        }, this.buffer*500);
        return _this;
    };

    this.stop = function(){
        var _this = this;
        if(_this.interval){
            clearInterval(_this.interval);
            _this.interval = false;
        }
        position = 0;
        return _this;
    };
}

if(typeof module !== 'undefined'){
    module.exports = Sequencer;
}
