export interface Mode {
  frequency: number;
  amplitude: number;
  toneWeight?: number;
}

export interface ClickSpec {
  modes: Mode[];
  attackGain: number;
  gain: number;
}

export type ClickAccent = 'downbeat' | 'beat' | 'subdivision';

export interface ClickBuffers {
  downbeat: AudioBuffer;
  beat: AudioBuffer;
  subdivision: AudioBuffer;
}
