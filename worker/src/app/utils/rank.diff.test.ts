import { IndividualRank } from "../../types"
import { leaderHaveChanged, rankDiff } from "./rank-diff"

const before = [{ "rank": 1, "date": "2023/10/07 03:53", "name": "PM ~ DraKKar", "car": "jvs_mitsubishi_evo6_tme", "time": "03:22.941" }, { "rank": 2, "date": "2023/10/07 02:19", "name": "Sniperin", "car": "jvs_mitsubishi_evo6_tme", "time": "03:23.251" }, { "rank": 3, "date": "2023/11/10 11:11", "name": "xyu", "car": "jvs_mitsubishi_evo6_tme", "time": "03:23.279" }]
const after = [{ "rank": 1, "date": "2023/10/07 02:19", "name": "Sniperin", "car": "jvs_mitsubishi_evo6_tme", "time": "03:23.251" }, { "rank": 2, "date": "2023/10/07 03:53", "name": "PM ~ DraKKar", "car": "jvs_mitsubishi_evo6_tme", "time": "03:22.941" }, { "rank": 3, "date": "2023/11/10 11:11", "name": "xyu", "car": "jvs_mitsubishi_evo6_tme", "time": "03:23.279" }, { "rank": 4, "date": "2023/09/30 02:01", "name": "PM ~ DraKKar", "car": "j8_honda_nsx_tuned", "time": "03:25.012" }]

describe('leaderboard rankings', () => {
  test('should show rank before and after', () => {
    const result = rankDiff({ before, after })
    expect(result).toEqual([
      expect.objectContaining({ name: 'PM ~ DraKKar', before: 1, after: 2 }),
      expect.objectContaining({ name: 'Sniperin', before: 2, after: 1 }),
      expect.objectContaining({ name: 'xyu', before: 3, after: 3 }),
      expect.objectContaining({ name: 'PM ~ DraKKar', before: 4, after: 4 }),
    ])
  })

  test('should return false when leader is still first', () => {
    const result: IndividualRank = { name: 'john doe', before: 1, after: 1 }
    expect(leaderHaveChanged(result)).toBeFalsy()
  })

  test('should return true when leader is taken over', () => {
    const result: IndividualRank = { name: 'john doe', before: 1, after: 2 }
    expect(leaderHaveChanged(result)).toBeTruthy()
  })
})