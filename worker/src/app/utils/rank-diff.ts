import { IndividualRank, RankDiff, TrackNames } from "../../types";

function leaderHaveChanged(leader: IndividualRank, isNewData: boolean) {
  if (isNewData) {
    return true
  }
  return leader.before !== leader.after
}

function rankDiff({ before, after }: RankDiff) {
  const uniqueEntries = new Map<string, IndividualRank>()

  before.forEach((entry) => {
    const key = `${entry.name}-${entry.car}`
    uniqueEntries.set(key, {
      ...entry,
      before: entry.rank
    })
  })

  after.forEach((entry) => {
    const key = `${entry.name}-${entry.car}`
    const existingEntry = uniqueEntries.get(key)

    if (existingEntry) {
      existingEntry.rank = entry.rank
      existingEntry.after = entry.rank
      uniqueEntries.set(key, existingEntry)
    } else {
      uniqueEntries.set(key, {
        ...entry,
        after: entry.rank,
        before: entry.rank
      })
    }
  });

  const diffedRankings = Array.from(uniqueEntries.values())
  return diffedRankings.sort((a, b) => a.rank - b.rank)
}

function handleRankDiff(rankings: RankDiff, track: TrackNames) {
  const diffedRankings = rankDiff({ before: rankings.before, after: rankings.after })
  const currentLeader = diffedRankings[0]
  const isNewKey = rankings.before.length === 0
  
  if (leaderHaveChanged(currentLeader, isNewKey)) {
    return `${currentLeader.name} is the current leader on ${track} with a time of ${currentLeader.time}`
  }

  return undefined
}

export { rankDiff, leaderHaveChanged, handleRankDiff }