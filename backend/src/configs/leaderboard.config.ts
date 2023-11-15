import { registerAs } from '@nestjs/config';

export default registerAs(
  'leaderboard',
  (): Record<string, any> => ({
    pointsUrl: `${process.env.TU_URL}/timing/points?page={page}&month={month}&leaderboard={leaderboard}`,
    timingUrl: `${process.env.TU_URL}/timing?leaderboard={leaderboard}&track={track}&car={car}&month={month}&stage={stage}&page={page}`,
    leaderboardList: [
      'All',
      'Gunma',
      'Ibaraki',
      'Kanagawa',
      'Saitama',
      'Shizuoka',
      'Tochigi',
    ],
    timingTracks: [
      {
        Gunma: [
          { track: 'pk_akina', stage: ['Akina Downhill', 'Akina Uphill'] },
          { track: 'ek_akagi', stage: ['Akagi Downhill', 'Akagi Uphill'] },
          { track: 'ek_myogi', stage: ['Myogi Downhill', 'Myogi Uphill'] },
          { track: 'pk_usui_pass', stage: ['Usui Downhill', 'Usui Uphill'] },
        ],
        Ibaraki: [
          {
            track: 'ek_tsukuba_fruits_line',
            stage: ['Tsukuba Inbound', 'Tsukuba Outbound'],
          },
          {
            track: 'ek_tsukuba_fruits_line_snow',
            stage: ['Snow Tsukuba Inbound', 'Snow Tsukuba Outbound'],
          },
        ],
        Kanagawa: [
          {
            track: 'ek_tsubaki_line',
            stage: ['Tsubaki Downhill', 'Tsubaki Uphill'],
          },
          {
            track: 'ek_nanamagari',
            stage: ['Nanamagari Downhill', 'Nanamagari Uphill'],
          },
          {
            track: 'hakoneTurnpike_wmmt5',
            stage: ['Turnpike Downhill', 'Turnpike Uphill'],
          },
        ],
        Saitama: [
          {
            track: 'ek_tsuchisaka',
            stage: ['Tsuchisaka Inbound', 'Tsuchisaka Outbound'],
          },
          {
            track: 'rtp_maze_pass',
            stage: ['Maze Downhill', 'Maze Uphill'],
          },
          {
            track: 'ek_sadamine',
            stage: ['Sadamine Uphill', 'Sadamine Downhill'],
          },
          {
            // fav touge ever!! if u disagree fuck you
            track: 'shomaru',
            stage: ['Shomaru Outbound', 'Shomaru Inbound'],
          },
        ],
        Shizuoka: [
          { track: 'ek_nagao', stage: ['Nagao Downhill', 'Nagao Uphill'] },
        ],
        Tochigi: [
          {
            track: 'ek_happogahara',
            stage: ['Happogahara Inbound', 'Happogahara Outbound'],
          },
          {
            track: 'ek_momiji',
            stage: ['Momiji Downhill', 'Momiji Uphill'],
          },
          {
            track: 'ek_irohazaka',
            stage: ['Irohazaka Downhill'],
          },
          {
            track: 'rbms_enna',
            stage: ['Enna Skyline Downhill', 'Enna Skyline Uphill'],
          },
        ],
      },
    ],
  }),
);
