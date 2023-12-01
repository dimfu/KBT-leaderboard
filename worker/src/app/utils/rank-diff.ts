import { IndividualRank, RankDiff, TrackNames } from "../../types";

function leaderHaveChanged(leader: IndividualRank) {
  return leader.before !== leader.after
}

function rankDiff({ before, after }: RankDiff) {
  let result: IndividualRank[] = [];
  const uniqueEntries = new Map<string, IndividualRank>()

  before.forEach(({ name, car, rank }) => {
    const key = `${name}-${car}`
    uniqueEntries.set(key, {
      name,
      before: rank
    })
  })

  after.forEach(({ name, car, rank }) => {
    const key = `${name}-${car}`
    const existingEntry = uniqueEntries.get(key)

    if (existingEntry) {
      existingEntry.after = rank
      uniqueEntries.set(key, existingEntry)
    } else {
      uniqueEntries.set(key, {
        name,
        after: rank,
        before: rank
      })
    }
  });

  result = Array.from(uniqueEntries.values())
  return result;
}

function handleRankDiff(rankings: RankDiff, track: TrackNames) {
  const diffedRankings = rankDiff({ before: rankings.before, after: rankings.after })
  const currentLeader = diffedRankings[0]
  
  if (leaderHaveChanged(currentLeader)) {
    return `${currentLeader.name} is the current leader on ${track}`
  }

  return undefined
}

export { rankDiff, leaderHaveChanged, handleRankDiff }