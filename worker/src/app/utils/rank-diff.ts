import { IndividualRank, RankDiff } from "../../types";

function leaderHaveChanged(rankings: IndividualRank[]) {
  return rankings[0].before !== rankings[0].after
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

export { rankDiff, leaderHaveChanged }