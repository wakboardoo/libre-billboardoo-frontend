import ChartItem from '@components/ChartItem';
import Play50Button from '@components/Play50Button';
import RankHeader from '@components/RankHeader';
import SmallHeader from '@components/SmallHeader';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ChartDataResponse, RankResponse } from '@utils/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React from 'react';
import { useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface LoaderData {
  ranks: RankResponse
  chartData: ChartDataResponse
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/24hours'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ]);

  return {
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  };
};

const TwentyFourHoursRank = () => {
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
      end={Math.min(ranks.ranking.length, 50)}
      list={ranks.ranking.slice(0, Math.min(ranks.ranking.length, 50)).map((value) => value.videoIds[0])}
    />
  );

  const button51to100 = (
    <Play50Button
      key='play51to100'
      start={51}
      end={Math.min(ranks.ranking.length, 100)}
      list={ranks.ranking.slice(50, Math.min(ranks.ranking.length, 100)).map((value) => value.videoIds[0])}
    />
  );

  const getButtons = () => {
    if (ranks.ranking.length <= 50) {
      return [button1to50];
    } else {
      return [button1to50, button51to100];
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='h-full'
      >
        <Virtuoso
          style={{ height: '100%' }}
          data={ranks.ranking}
          components={{
            Scroller: React.forwardRef(({ style, ...props }, ref) => (
              <div ref={ref} style={{ ...style }} className='' {...props}>
                <SmallHeader ref={headerRef} title='24시간 차트' buttons={getButtons()} />
                {props.children}
              </div>
            )),
            List: React.forwardRef(({ style, children }, ref) => (
              <div ref={ref} style={{ ...style }} className='mx-4 md:m-14 space-y-3'>
                {children}
              </div>
            )),
            Header: () => (
              <div className='mx-4 md:m-14'>
                <RankHeader title='24시간 차트' updateDate={dayjs(ranks.timestamp * 1000)} />

                <div ref={buttonsRef} className='my-5 flex gap-3'>
                  {getButtons()}
                </div>
              </div>
            ),
          }}
          itemContent={(index, item) => (
            <ChartItem
              id={item.videoIds[0]}
              rank={index + 1}
              rankChange={chartData[item.artist][item.title].previousRank.twentyFourHours - (index + 1)}
              title={item.title}
              artist={item.artist}
              count={item.count}
            />
          )}
        />
      </motion.div>
    </>
  );
};

export default TwentyFourHoursRank;
