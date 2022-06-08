import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/hourly'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    title: '매시간 차트',
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const HourlyRank = () => {
  return (
    <></>
  );
};

export default HourlyRank;
