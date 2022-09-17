import React from 'react';
import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  return {
    title: '고멤가요제 차트',
    ranks: await (await fetch('https://chart.zvz.be/api/rank/festival')).json(),
  };
};

const FestivalRank = () => {
  return (
    <></>
  );
};

export default FestivalRank;
