import { leaderboards } from "./constants";

export interface Env {
	channelIds: string[]
	TOUGE_UNION: KVNamespace;
	WEBHOOK_URL: string
	BACKEND_URL: string
}

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
export type TimingStorage = {
	now: TimingEntries
	before: TimingEntries
}

export type LeaderboardName = typeof leaderboards[number]["name"]
export type LeaderboardConfig<T extends LeaderboardName[]> = {
	include: {
		[K in T[number]]?: Extract<typeof leaderboards[number], { name: K }>['tracks'][number][]
	}
}
export type TrackNames = typeof leaderboards[number]['tracks'][number]

export interface RankDiff {
  before: TimingEntries
  after: TimingEntries
}

export interface IndividualRank {
	name: string
	before: number
	after?: number
}