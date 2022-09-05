import React from 'react';
import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/24hours'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    name: 'twentyFourHours',
    title: '24시간 차트',
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const TwentyFourHoursRank = () => {
  return (
    <></>
  );
};

export default TwentyFourHoursRank;
