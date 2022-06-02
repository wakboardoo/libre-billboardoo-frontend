import SummaryRank from '@components/SummaryRank';
import DefaultLayout from '@layouts/DefaultLayout';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { RankResponse } from '@utils/types';
import { motion } from 'framer-motion';

interface LoaderData {
  twentyFourHours: RankResponse
  hourly: RankResponse
  daily: RankResponse
  weekly: RankResponse
  monthly: RankResponse
  yearly: RankResponse
  allTime: RankResponse
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const [twentyFourHours, hourly, daily, weekly, monthly, yearly, allTime] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/24hours'),
    fetch('https://chart.zvz.be/api/rank/hourly'),
    fetch('https://chart.zvz.be/api/rank/daily'),
    fetch('https://chart.zvz.be/api/rank/weekly'),
    fetch('https://chart.zvz.be/api/rank/monthly'),
    fetch('https://chart.zvz.be/api/rank/yearly'),
    fetch('https://chart.zvz.be/api/rank/all-time'),
  ]);

  return {
    twentyFourHours: await twentyFourHours.json(),
    hourly: await hourly.json(),
    daily: await daily.json(),
    weekly: await weekly.json(),
    monthly: await monthly.json(),
    yearly: await yearly.json(),
    allTime: await allTime.json(),
  };
};


export default function Index() {
  const { twentyFourHours, hourly, daily, weekly, monthly, yearly, allTime } = useLoaderData<LoaderData>();
  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='px-4 py-14 md:p-14'
      >
        <ul className='space-y-10'>
          <li><SummaryRank title='24시간 차트' href='/rank/24hours' ranks={twentyFourHours.ranking} /></li>
          <li><SummaryRank title='매시간 차트' href='/rank/hourly' ranks={hourly.ranking} /></li>
          <li><SummaryRank title='일간 차트' href='/rank/daily' ranks={daily.ranking} /></li>
          <li><SummaryRank title='주간 차트' href='/rank/weekly' ranks={weekly.ranking} /></li>
          <li><SummaryRank title='월간 차트' href='/rank/monthly' ranks={monthly.ranking} /></li>
          <li><SummaryRank title='연간 차트' href='/rank/yearly' ranks={yearly.ranking} /></li>
          <li><SummaryRank title='누적 차트' href='/rank/all-time' ranks={allTime.ranking} /></li>
        </ul>
      </motion.div>
    </DefaultLayout>
  );
}
