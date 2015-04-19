'use strict';

import { WaveTypes } from './constants';

class BinauralBeatGen {

    constructor (ctx,  options={}) {
        this.__leftChannel   = ctx.createOscillator();
        this.__rightChannel  = ctx.createOscillator();
        this.__channelMerger = ctx.createChannelMerger();
        this.__compressor    = ctx.createDynamicsCompressor();

        this.input  = ctx.createGain();
        this.output = ctx.createGain();

        this.__model = {};

        // Defaults
        this.pitch         = options.pitch || 440;
        this.beatRate      = options.beatRate || 5;
        this.waveType      = options.waveType || WaveTypes.SINE;
        this.compressNodes = options.compressNodes || false;
        this.started       = false;

        // setup functions
        this.__routeNodes();
    }

    start () {
        if (this.started === false) {
            this.__startOscillators();
            this.started = true;
        }
        this.__connectOscillators();
    }

    stop () {
        this.__disconnectOscillators();
    }

    connect (dest) {
        this.output.connect(dest.input ? dest.input : dest);
    }

    disconnect () {
        this.output.disconnect();
    }

    getChannel (channel) {
        if (channel === 0) {
            return this.__leftChannel;
        } else if (channel === 1) {
            return this.__rightChannel;
        }
    }

    // Getters and Setters
    get model() {
        return this.__model;
    }

    set pitch (pitchFreq) {
        this.__model.pitch = pitchFreq;
        this.__updateBinauralFrequencies();
    }

    get pitch() {
        return this.__model.pitch;
    }

    set beatRate (beatRate) {
        this.__model.beatRate = beatRate;
        this.__updateBinauralFrequencies();
    }

    get beatRate() {
        return this.__model.beatRate;
    }

    set waveType (waveType) {
        this.__model.waveType = waveType;
        this.__leftChannel.type = this.__rightChannel.type = waveType;
    }

    get waveType() {
        return this.__model.waveType;
    }

    setPeriodicWave (periodicWave) {
        this.__leftChannel.setPeriodicWave(periodicWave);
        this.__rightChannel.setPeriodicWave(periodicWave);
    }

    // Private methods

    // Setup Audio Routing
    __routeNodes () {
        // This can be helpful when passing other audio signals through this node
        if (this.compressNodes) {
            this.input.connect(this.__compressor);
            this.__channelMerger.connect(this.__compressor);
            this.__compressor.connect(this.output);
        } else {
            this.input.connect(this.output);
            this.__channelMerger.connect(this.output);
        }
    }

    __startOscillators () {
        this.__leftChannel.start(0);
        this.__rightChannel.start(0);
    }

    __connectOscillators () {
        this.__leftChannel.connect(this.__channelMerger, 0, 0);
        this.__rightChannel.connect(this.__channelMerger, 0, 1);
    }

    __disconnectOscillators () {
        this.__leftChannel.disconnect();
        this.__rightChannel.disconnect();
    }

    __updateBinauralFrequencies() {
        if(this.beatRate != null && this.pitch != null) {
            this.__leftChannel.frequency.value  = this.__getChannelFrequency(0);
            this.__rightChannel.frequency.value = this.__getChannelFrequency(1);
        }
    }

    __getChannelFrequency (channelNum) {
        var channelFrequency, frequencyOffset;

        frequencyOffset = this.beatRate / 2;

        if (channelNum === 0) {
            channelFrequency = this.pitch - frequencyOffset;
        } else {
            channelFrequency = this.pitch + frequencyOffset;
        }

        return channelFrequency;
    }
}

export {
    WaveTypes,
    BinauralBeatGen
};

export default BinauralBeatGen;
