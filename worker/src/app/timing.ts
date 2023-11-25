import { Env, LeaderboardConfig, LeaderboardName } from "../types"
import fetchAll from "./fetchAll"

function combineTrackWithData(url: string, data: string[]) {
  const matchTrack = url.match(/\/([^/]+)\/?$/)
  const track = matchTrack ? matchTrack[1] : ''

  return { track, data }
}

export default async function getTimingRecords(
  env: Env,
  config: LeaderboardConfig<LeaderboardName[]>
) {
  const url = env.BACKEND_URL
  let builtUrls: string[] = []
  let leaderboards = []

  for (const [name, tracks] of Object.entries(config.include)) {
    leaderboards.push({ name, tracks })
  }

  leaderboards.forEach(({ name, tracks }) => {
    const pointUrl = `${url}/leaderboard/timing/${name}`
    tracks.forEach(track => {
      builtUrls.push(`${pointUrl}/${track}`)
    });
  });

  try {
    const result = await fetchAll(builtUrls, combineTrackWithData)
    await Promise.all(result.map(async ({ track, data }) => {
      const dataBefore = await env.TOUGE_UNION.get(track)
      const newData = {
        before: dataBefore ? JSON.parse(dataBefore).now : null,
        now: data
      }
      await env.TOUGE_UNION.put(track, JSON.stringify(newData))
      console.log(`extracted ${track} data with ${data.length} records`)
    }));
  } catch (err) {
    console.log(err)
  }
}
