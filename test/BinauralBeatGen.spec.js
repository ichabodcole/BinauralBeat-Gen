import { WaveTypes, BinauralBeatGen } from '../lib/BinauralBeatGen';

describe('BinauralBeat', function () {
    var ctx, bBeat, mediaElement, gainNode;

    mediaElement = document.createElement('audio');

    beforeAll(function () {
        ctx = allen.getAudioContext();
        ctx.createPeriodicWave = function () {
            return true;
        };
        gainNode = ctx.createGain();
    });

    beforeEach(function () {
        bBeat = new BinauralBeatGen(ctx);
    });

    describe('constructor', function () {
        it ('should return an instance of BinauralBeat', function () {
            expect(bBeat instanceof BinauralBeatGen).toBe(true);
        });
    });

    describe('properties', function () {
        it ('should have an input property which is an AudioNode', function () {
            expect(allen.isAudioNode(bBeat.input)).toEqual(true);
        }),
        it ('should have an output property which is an AudioNode', function () {
            expect(allen.isAudioNode(bBeat.output)).toEqual(true);
        }),
        it ('should have a pitch property with default set to 440', function () {
            expect(bBeat.pitch).toEqual(440);
        }),
        it ('should have a beatRate property with default set to 5', function () {
            expect(bBeat.beatRate).toEqual(5);
        }),
        it ('should have a waveType property with default set to "sine"', function () {
            expect(bBeat.waveType).toEqual('sine');
        }),
        it ('should have a compressNodes property with default set to false', function () {
            expect(bBeat.compressNodes).toEqual(false);
        });
    });

    describe('methods', function () {

        describe('getChannel', function () {
            it('should have a method getChannel', function () {
                expect(bBeat.getChannel).toBeDefined();
            }),
            it('should return and audio node', function (){
                var leftChannel = bBeat.getChannel(0);
                expect(allen.isAudioNode(leftChannel)).toEqual(true);
            });
        });

        describe('setPitch', function () {
            it ('should have a method setPitch', function () {
                expect(bBeat.setPitch).toBeDefined();
            });

            it ('should change the pitch value', function (){
                bBeat.setPitch(500);
                expect(bBeat.pitch).toEqual(500);
            });
        }),

        describe('setBeatRate', function () {
            it ('should have a method setBeatRate', function () {
                expect(bBeat.setBeatRate).toBeDefined();;
            });

            it ('should change the pitch value', function (){
                bBeat.setBeatRate(16);
                expect(bBeat.beatRate).toEqual(16);
            });
        }),

        describe('setWaveType', function () {
            it ('should have a method setWaveType', function () {
                expect(bBeat.setWaveType).toBeDefined();
            });

            it ('should change the waveType value', function (){
                bBeat.setWaveType(WaveTypes.SQUARE);
                expect(bBeat.waveType).toEqual(WaveTypes.SQUARE);
            });
        });

        describe('setPeriodicWave', function () {
            it ('should have a method setPeriodicWave', function () {
                expect(bBeat.setPeriodicWave).toBeDefined();
            }),
            it ('should take a PeriodicWave argument', function () {
                var real = new Float32Array(4096);
                var imag = new Float32Array(4096);
                var periodicWave = ctx.createPeriodicWave(real, imag);

                expect(setPeriodicWave).not.toThrow();

                function setPeriodicWave () {
                    bBeat.setPeriodicWave(periodicWave);
                }
            });
        }),

        describe('stop', function () {
            it ('should have a stop method', function () {
                expect(bBeat.stop).toBeDefined();
            });
        }),

        describe('start', function () {
            it ('should have a start method', function () {
                expect(bBeat.start).toBeDefined();
            });
        }),

        describe('connect', function () {
            it ('should have a method connect that takes an AudioNode', function () {
                expect(connect).not.toThrow();

                function connect () {
                    bBeat.connect(gainNode);
                }
            }),
            it ('should take a web audio component instance', function () {
                expect(connect).not.toThrow();

                function connect () {
                    bBeat.connect(new BinauralBeatGen(ctx));
                }
            });
        }),

        describe('disconnect', function () {
            it ('should have a method disconnect', function () {
                bBeat.connect(gainNode);

                expect(disconnect).not.toThrow();

                function disconnect (){
                    bBeat.disconnect();
                }
            });
        });
    });
});
