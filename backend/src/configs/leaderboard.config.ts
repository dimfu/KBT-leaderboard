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
  }),
);
