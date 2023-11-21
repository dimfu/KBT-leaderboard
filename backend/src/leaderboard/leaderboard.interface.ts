import { Subscriber } from 'rxjs';

export type LeaderboardCategories = 'points' | 'timing';

export interface PointParams {
  page?: number;
  currentMonth: number;
  leaderboard: string;
}

export interface TimingParams extends PointParams {
  track: string;
  car?: string;
  stage: string;
}

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

export interface ProcessNextPage<T extends any[]> {
  currentMonth: number;
  params: TimingParams | PointParams;
  category: LeaderboardCategories;
  entries: T;
  isNotEmpty: boolean;
  observer: Subscriber<T>;
  currentPage: number;
}

export interface LeaderboardConfig {
  pointsUrl: string;
  timingUrl: string;
  leaderboardList: string[];
  timingTracks: {
    region: string;
    tracks: {
      track: string;
      stage: string[];
    }[];
  }[];
}
