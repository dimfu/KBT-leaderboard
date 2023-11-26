import { Env, LeaderboardConfig, LeaderboardName, TimingEntries, TimingStorage } from "../types"
import sendNotification from "./discord/webhook"
import fetchAll from "./fetchAll"

function combineTrackWithData(url: string, data: TimingEntries) {
  const matchTrack = url.match(/\/([^/]+)\/?$/)
  const track = matchTrack ? matchTrack[1] : ''

  return { track, data }
}

async function updateDataAndNotify(
  env: Env,
  track: string,
  data: TimingEntries,
  message: string
) {
  const { WEBHOOK_URL, TOUGE_UNION } = env
  const currentTrackData = await TOUGE_UNION.get(track)
  if (!currentTrackData) {
    const createNew = {
      before: [],
      now: data
    }
    await TOUGE_UNION.put(track, JSON.stringify(createNew))
  } else {
    const parsedIncomingData: TimingStorage = JSON.parse(currentTrackData)
    const newData = {
      before: currentTrackData ? parsedIncomingData.now : null,
      now: data
    }
    await TOUGE_UNION.put(track, JSON.stringify(newData))
  }

  await sendNotification(WEBHOOK_URL, message)
}

export default async function getTimingRecords(
  env: Env,
  config: LeaderboardConfig<LeaderboardName[]>
) {
  const { BACKEND_URL, TOUGE_UNION } = env
  let builtUrls: string[] = []
  let leaderboards = []

  for (const [name, tracks] of Object.entries(config.include)) {
    leaderboards.push({ name, tracks })
  }

  leaderboards.forEach(({ name, tracks }) => {
    const pointUrl = `${BACKEND_URL}/leaderboard/timing/${name}`
    tracks.forEach(track => {
      builtUrls.push(`${pointUrl}/${track}`)
    });
  });

  try {
    const result = await
      fetchAll<TimingEntries, ReturnType<typeof combineTrackWithData>>(builtUrls, combineTrackWithData)
    await Promise.all(result.map(async ({ track, data }) => {
      const message = await TOUGE_UNION.get(track)
        ? `extracted ${track} with ${data.length} records`
        : `created new key for ${track} with ${data.length} records`

      await updateDataAndNotify(env, track, data, message)
    }));
  } catch (err) {
    console.log(err)
  }
}
