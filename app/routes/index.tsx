import React from 'react';
import SummaryRank from '@components/SummaryRank';
import DefaultLayout from '@layouts/DefaultLayout';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import type { Ranking } from '@utils/types';

interface LoaderData {
  twentyFourHours: Ranking[]
  hourly: Ranking[]
  daily: Ranking[]
  weekly: Ranking[]
  monthly: Ranking[]
  yearly: Ranking[]
  allTime: Ranking[]
  new: Ranking[]
  festival: Ranking[]
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return (await fetch('https://chart.zvz.be/api/rank/summary')).json();
};


export default function Index() {
  const loaderData = useLoaderData<LoaderData>();
  const { hourly, twentyFourHours, daily, weekly, monthly, yearly, allTime } = loaderData;
  const newRank = loaderData.new;
  const festivalRank = loaderData.festival;

  return <DefaultLayout>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-4 md:p-14'
    >
      <ul className='space-y-10'>
        {
          (() => {
            if (newRank && newRank.length !== 0) {
              return <li><SummaryRank title='신곡 차트' href='/rank/new' ranks={newRank} /></li>;
            }
          })()
        }
        {
          (() => {
            if (festivalRank && festivalRank.length !== 0) {
              return <li><SummaryRank title='고멤가요제 차트' href='/rank/festival' ranks={festivalRank} /></li>;
            }
          })()
        }
        <li><SummaryRank title='24시간 차트' href='/rank/24hours' ranks={twentyFourHours} /></li>
        <li><SummaryRank title='매시간 차트' href='/rank/hourly' ranks={hourly} /></li>
        <li><SummaryRank title='일간 차트' href='/rank/daily' ranks={daily} /></li>
        <li><SummaryRank title='주간 차트' href='/rank/weekly' ranks={weekly} /></li>
        <li><SummaryRank title='월간 차트' href='/rank/monthly' ranks={monthly} /></li>
        <li><SummaryRank title='연간 차트' href='/rank/yearly' ranks={yearly} /></li>
        <li><SummaryRank title='누적 차트' href='/rank/all-time' ranks={allTime} /></li>
        <li/>
      </ul>
    </motion.div>
  </DefaultLayout>;
}
