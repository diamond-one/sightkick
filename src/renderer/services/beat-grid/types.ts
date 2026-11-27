import { ParsedChart } from '../../../chart-parser/types';

export interface Beat {
  timeSeconds: number;
  startTick: number;
  endTick: number;
  isDownbeat: boolean;
  isCompound: boolean;
}

export interface CountInInfo {
  beats: number;
  beatDurationSeconds: number;
  isCompound: boolean;
}

export type TimingChart = Pick<ParsedChart, 'resolution' | 'tempos'>;
