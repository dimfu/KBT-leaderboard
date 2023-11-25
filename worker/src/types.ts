import { leaderboards } from "./constants";

export interface Env {
	TOUGE_UNION: KVNamespace;
	BACKEND_URL: string
}

export type LeaderboardName = typeof leaderboards[number]["name"]
export type LeaderboardConfig<T extends LeaderboardName[]> = {
	include: {
		[K in T[number]]?: Extract<typeof leaderboards[number], { name: K }>['tracks'][number][]
	}
}