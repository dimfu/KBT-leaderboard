import { Env } from "../../types";
import getTimingRecords from "./timing-records";

export default async function scheduledTiming(event: ScheduledEvent, env: Env) {
  switch (event.cron) {
    case '*/10 * * * *':
      await getTimingRecords(env, {
        include: { Gunma: ['pk_akina', 'ek_akagi', 'pk_usui_pass', 'ek_myogi'] }
      })
      break;
    case '*/11 * * * *':
      await getTimingRecords(env, {
        include: { Ibaraki: ['ek_tsukuba_fruits_line', 'ek_tsukuba_fruits_line_snow'] }
      })
      break;
    case '*/12 * * * *':
      await getTimingRecords(env, {
        include: { Kanagawa: ['ek_nanamagari', 'ek_tsubaki_line', 'hakoneTurnpike_wmmt5'] }
      })
      break;
    case '*/13 * * * *':
      await getTimingRecords(env, {
        include: { Saitama: ['ek_sadamine', 'ek_tsuchisaka', 'rtp_maze_pass', 'shomaru'] }
      })
      break;
    case '*/14 * * * *':
      await getTimingRecords(env, {
        include: {
          Shizuoka: ['ek_nagao'],
          Tochigi: ['ek_happogahara', 'ek_irohazaka', 'ek_momiji', 'rbms_enna']
        }
      })
      break;
  }
}