function Sequencer(opts){
    var _this = this;
    _this.opts = opts;
    _this.position = 0;
    _this.jsfxr  = opts.jsfxr || window.jsfxr;
    _this.initLoops();
}

Sequencer.prototype = {
    initLoops: function(){
        var _this = this;
        var song = _this.opts.song;
        var loops = _this.opts.loops;
        _this.opts.song = song.map(function(beat, i){
            var newBeat = [];
            beat.forEach(function(beat){
                var loop = _this.opts.loops[beat];
                if(_this.opts.instruments[beat]){
                    // return this beat
                    newBeat.push(beat);
                } else if(loop) {
                    // Merge the loop into the main song array.
                    newBeat = newBeat.concat(loop[0]);
                    for(var j=1; j<loop.length; j++){
                        song[i+j] = song[i+j].concat(loop[j]);
                    }
                } else {
                    console.error('Instrument or loop not found', beat);
                }
            });
            return newBeat;
        });
    },
    play: function(){
        var _this = this;
        var i;
        var instrument;
        _this.interval = setInterval(function(){
            var beat = _this.opts.song[_this.position];
            if(!beat){
                return _this.stop();
            }

            for(i=0; i<beat.length; i++){
                instrument = _this.opts.instruments[beat[i]];
                instrument.currentTime = 0;
                instrument.play();
            }

            if(++_this.position >= _this.opts.song.length){
                if(_this.opts.loop){
                    _this.position = 0;
                }
                if(_this.opts.onComplete){
                    _this.opts.onComplete();
                }
            }
        },_this.opts.loopSpeed);
        return _this;
    },
    stop: function(){
        var _this = this;
        if(_this.interval){
            clearInterval(_this.interval);
            _this.interval = false;
        }
        _this.position = 0;
        return _this;
    }
};

if(typeof module !== 'undefined'){
    module.exports = sequencer;
}
