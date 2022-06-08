import type { LoaderFunction } from '@remix-run/node';
import type { RankLoaderData } from '@utils/types';

export const loader: LoaderFunction = async (): Promise<RankLoaderData> => {
  return {
    title: '신곡 차트',
    ranks: await (await fetch('https://chart.zvz.be/api/rank/new')).json(),
  };
};

const NewestRank = () => {
  return (
    <></>
  );
};

export default NewestRank;
