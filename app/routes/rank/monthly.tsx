import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/monthly'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    title: '월간 차트',
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const MonthlyRank = () => {
  return (
    <></>
  );
};

export default MonthlyRank;
