'use strict';

import { WaveTypes } from './constants';

class BinauralBeatGen {

    constructor (ctx,  options={}) {
        this.input  = ctx.createGain();
        this.output = ctx.createGain();

        // Defaults
        this.pitch         = options.pitch || 440;
        this.beatRate      = options.beats || 5;
        this.waveType      = options.waveType || WaveTypes.SINE;
        this.compressNodes = options.compressNodes || false;
        this.started       = false;

        // setup functions
        this.__createInternalNodes(ctx);
        this.__routeNodes();
        this.setPitch(this.pitch);
        this.setWaveType(this.waveType);
        }

    getChannel (channel) {
        if (channel === 0) {
            return this.leftChannel;
        } else if (channel === 1) {
            return this.rightChannel;
        }
    }

    setPitch (pitchFreq) {
        this.pitch = pitchFreq;
        this.leftChannel.frequency.value  = this.__getChannelFrequency(0);
        this.rightChannel.frequency.value = this.__getChannelFrequency(1);
    }

    setBeatRate (beatRate) {
        this.beatRate = beatRate;
        this.setPitch(this.pitch);
    }

    setWaveType (waveType) {
        this.waveType = waveType;
        this.leftChannel.type = this.rightChannel.type = this.waveType;
    }

    setPeriodicWave (periodicWave) {
        this.leftChannel.setPeriodicWave(periodicWave);
        this.rightChannel.setPeriodicWave(periodicWave);
    }

    start () {
        if (!this.started) {
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

    // Private methods
    __createInternalNodes (ctx) {
        this.leftChannel   = ctx.createOscillator();
        this.rightChannel  = ctx.createOscillator();
        this.channelMerger = ctx.createChannelMerger();
        this.compressor    = ctx.createDynamicsCompressor();
    }

    // Setup Audio Routing
    __routeNodes () {
        // This can be helpful when passing other audio signals through this node
        if (this.compressNodes) {
            this.input.connect(this.compressor);
            this.channelMerger.connect(this.compressor);
            this.compressor.connect(this.output);
        } else {
            this.input.connect(this.output);
            this.channelMerger.connect(this.output);
        }
    }

    __startOscillators () {
        this.leftChannel.start(0);
        this.rightChannel.start(0);
    }

    __connectOscillators () {
        this.leftChannel.connect(this.channelMerger, 0, 0);
        this.rightChannel.connect(this.channelMerger, 0, 1);
    }

    __disconnectOscillators () {
        this.leftChannel.disconnect();
        this.rightChannel.disconnect();
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
