import ChartItem from '@components/ChartItem';
import Play50Button from '@components/Play50Button';
import RankHeader from '@components/RankHeader';
import SmallHeader from '@components/SmallHeader';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ChartDataResponse, RankResponse } from '@utils/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface LoaderData {
  ranks: RankResponse
  chartData: ChartDataResponse
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/hourly'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const HourlyRank = () => {
  const { ranks, chartData } = useLoaderData<LoaderData>();
  const buttonsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (buttonsRef.current) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          headerRef.current?.classList.toggle('hidden', entry.isIntersecting);
          headerRef.current?.classList.toggle('flex', !entry.isIntersecting);
        });
      });

      io.observe(buttonsRef.current);
    }
  }, []);

  const button1to50 = (
    <Play50Button
      key='play1to50'
      start={1}
      end={50}
      list={ranks.ranking.slice(0, 50).map((value) => value.videoIds[0])}
    />
  );

  const button51to100 = (
    <Play50Button
      key='play51to100'
      start={51}
      end={100}
      list={ranks.ranking.slice(50, 100).map((value) => value.videoIds[0])}
    />
  );

  return (
    <>
      <SmallHeader ref={headerRef} title='매시간 차트' buttons={[button1to50, button51to100]} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='px-4 py-14 md:p-14'
      >
        <RankHeader title='매시간 차트' updateDate={dayjs(ranks.timestamp * 1000)} />

        <div ref={buttonsRef} className='mt-5 flex gap-3'>
          {button1to50}
          {button51to100}
        </div>

        <span className='h-4 w-full bg-neutral-600 py-3' aria-hidden='true' />

        <ul className='mt-5 space-y-3'>
          {ranks.ranking.map((item, index) => (
            <li key={item.videoIds[0]}>
              <ChartItem
                id={item.videoIds[0]}
                rank={index + 1}
                rankChange={chartData[item.artist][item.title].previousRank.hourly - (index + 1)}
                title={item.title}
                artist={item.artist}
                count={item.count}
              />
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default HourlyRank;
