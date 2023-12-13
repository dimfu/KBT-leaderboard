import { Env, LeaderboardConfig, LeaderboardName, RankDiff, TimingEntries, TimingStorage, TrackNames } from "../../types"
import sendNotification from "../discord/webhook"
import fetchAll from "../fetchAll"
import { handleRankDiff } from "../utils/rank-diff"

function combineTrackWithData(url: string, data: TimingEntries) {
  const matchTrack = url.match(/\/([^/]+)\/?$/)
  // we are 100% sure this wont be undefined (surely it wont break!)
  const track = matchTrack![1] as TrackNames
  return { track, data }
}

async function updateDataAndNotify(
  env: Env,
  track: TrackNames,
  data: TimingEntries,
) {
  const { WEBHOOK_URL, TOUGE_UNION } = env
  let rankings: RankDiff
  const currentTrackData = await TOUGE_UNION.get(track)
  if (!currentTrackData) {
    rankings = {
      before: [] as TimingEntries,
      after: data
    }
    await TOUGE_UNION.put(track, JSON.stringify(rankings))
  } else {
    const parsedIncomingData: TimingStorage = JSON.parse(currentTrackData)
    rankings = {
      before: currentTrackData ? parsedIncomingData.after : [],
      after: data
    }
    await TOUGE_UNION.put(track, JSON.stringify(rankings))
  }

  const message = handleRankDiff(rankings, track)
  await sendNotification(WEBHOOK_URL, message)
}

export default async function getTimingRecords(
  env: Env,
  config: LeaderboardConfig<LeaderboardName[]>
) {
  let builtUrls: string[] = []
  let leaderboards = []

  for (const [name, tracks] of Object.entries(config.include)) {
    leaderboards.push({ name, tracks })
  }

  leaderboards.forEach(({ name, tracks }) => {
    const pointUrl = `${env.BACKEND_URL}/leaderboard/timing/${name}`
    tracks.forEach(track => {
      builtUrls.push(`${pointUrl}/${track}`)
    });
  });

  try {
    const result = await
      fetchAll<TimingEntries, ReturnType<typeof combineTrackWithData>>(builtUrls, combineTrackWithData)
    await Promise.all(result.map(async ({ track, data }) => {
      await updateDataAndNotify(env, track, data)
    }));
  } catch (err) {
    console.log(err)
  }
}
