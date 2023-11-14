export type LeaderboardCategories = 'points' | 'timing';

export interface PointParams {
  page: number;
  currentMonth: number;
  leaderboard: string;
}

export interface TimingParams extends PointParams {
  track: string;
  car?: string;
  stage: string;
}

export type TimingParamsWithoutPage = Omit<TimingParams, 'page'>;

export type UrlParams = PointParams | TimingParams;

export interface Point {
  rank: number;
  name: string;
  points: number;
}

export type PointEntries = Point[];

export interface Timing {
  rank: number;
  date: string;
  name: string;
  car: string;
  time: string;
}

export type TimingEntries = Timing[];
