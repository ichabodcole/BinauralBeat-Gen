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
            expect(bBeat instanceof BinauralBeatGen).toEqual(true);
        });
    });

    describe('properties', function () {
        describe('input', function() {
            it ('should be an AudioNode', function () {
                expect(allen.isAudioNode(bBeat.input)).toEqual(true);
            });
        });

        describe('output', function() {
            it ('should be an AudioNode', function () {
                expect(allen.isAudioNode(bBeat.output)).toEqual(true);
            });
        });

        describe('model', function () {
            it('should return an object representing the current instances values', function() {
                var model = {
                    pitch: 580,
                    beatRate: 13,
                    waveType: WaveTypes.TRIANGLE
                };

                bBeat = new BinauralBeatGen(ctx);
                bBeat.beatRate = model.beatRate;
                bBeat.pitch = model.pitch;
                bBeat.waveType = model.waveType;

                expect(bBeat.model).toEqual(model);
            });
        })

        describe('pitch', function() {
            it ('should default set to 440', function () {
                expect(bBeat.pitch).toEqual(440);
            });

            it('should return the models pitch value', function() {
                expect(bBeat.pitch).toEqual(bBeat.model.pitch);
            });

            it('should set the pitch value', function() {
                bBeat.pitch = 225;
                expect(bBeat.pitch).toEqual(225);
            });
        });

        describe('beatRate', function() {
            it ('should default to 5', function () {
                expect(bBeat.beatRate).toEqual(5);
            });

            it ('should return the models beatRate value', function() {
                expect(bBeat.beatRate).toEqual(bBeat.model.beatRate);
            });

            it ('should set the beatRate value', function() {
                bBeat.beatRate = 12;
                expect(bBeat.beatRate).toEqual(12);
            });
        });

        describe('waveType', function() {
            it ('should default to "sine"', function () {
                expect(bBeat.waveType).toEqual(WaveTypes.SINE);
            });

            it ('should return the models waveType value', function() {
                expect(bBeat.waveType).toEqual(bBeat.model.waveType);
            });

            it ('should set the waveType value', function() {
                bBeat.waveType = WaveTypes.TRIANGLE
                expect(bBeat.waveType).toEqual(WaveTypes.TRIANGLE);
            });
        });

        describe('compressNodes', function() {
            it ('should default to false', function () {
                expect(bBeat.compressNodes).toEqual(false);
            });
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

        describe('setPeriodicWave', function () {
            it ('should have a method setPeriodicWave', function () {
                expect(bBeat.setPeriodicWave).toBeDefined();
            });

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
            });

            it ('should take a web audio component instance', function () {
                expect(connect).not.toThrow();

                function connect () {
                    bBeat.connect(new BinauralBeatGen(ctx));
                }
            });

            it('should call the outputs connect method', function( ){
                spyOn(bBeat.output, 'connect');
                bBeat.connect(gainNode);
                expect(bBeat.output.connect).toHaveBeenCalled();
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

            it('should call the outputs disconnect method', function( ){
                spyOn(bBeat.output, 'disconnect');
                bBeat.connect(gainNode);
                bBeat.disconnect();
                expect(bBeat.output.disconnect).toHaveBeenCalled();
            });
        });
    });
});
