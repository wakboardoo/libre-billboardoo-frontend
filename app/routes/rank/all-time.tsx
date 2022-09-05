import React from 'react';
import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/all-time'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    name: 'allTime',
    title: '누적 차트',
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const AllTimeRank = () => {
  return (
    <></>
  );
};

export default AllTimeRank;
