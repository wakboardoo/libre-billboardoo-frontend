import { MemoizedChartItem } from '@components/ChartItem';
import Play50Button from '@components/Play50Button';
import RankHeader from '@components/RankHeader';
import SmallHeader from '@components/SmallHeader';
import DefaultLayout from '@layouts/DefaultLayout';
import { Outlet, useMatches } from '@remix-run/react';
import type { RankLoaderData } from '@utils/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useCallback, useRef } from 'react';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

const RankParent = () => {
  const { name, title, ranks, chartData } = useMatches()[2].data as RankLoaderData;

  const ioRef = useRef<IntersectionObserver>();
  const buttonsRef = useRef<HTMLDivElement>();
  const headerRef = useRef<HTMLElement>();

  const updateIoRef = () => {
    if (ioRef.current) ioRef.current.disconnect();

    if (buttonsRef.current) {
      ioRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          headerRef.current?.classList.toggle('hidden', entry.isIntersecting);
          headerRef.current?.classList.toggle('flex', !entry.isIntersecting);
        });
      });

      ioRef.current.observe(buttonsRef.current);
    }
  };

  const buttonsCallback = useCallback((node: HTMLDivElement) => {
    buttonsRef.current = node;
    updateIoRef();
  }, []);
  
  const headerCallback = useCallback((node: HTMLElement) => {
    headerRef.current = node;
    updateIoRef();
  }, []);

  useEffect(() => {
    updateIoRef();
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
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='h-full'
      >
        <Outlet />
        <Virtuoso
          style={{ height: '100%', willChange: 'transform' }}
          data={ranks.ranking}
          components={{
            Scroller: React.forwardRef(({ style, ...props }, ref) => (
              <div ref={ref} style={{ ...style }} {...props}>
                <SmallHeader ref={headerCallback} title={title} buttons={getButtons()} />
                {props.children}
              </div>
            )),
            List: React.forwardRef(({ style, children }, ref) => (
              <div ref={ref} style={{ ...style }} className='m-4 md:m-14 space-y-3'>
                {children}
              </div>
            )),
            Header: () => (
              <div className='m-4 md:m-14'>
                <RankHeader title={title} updateDate={dayjs(ranks.timestamp * 1000)} />

                <div ref={buttonsCallback} className='my-5 flex gap-3'>
                  {getButtons()}
                </div>
              </div>
            ),
            Footer: () => <br/>,
          }}
          itemContent={(index, item) => (
            <MemoizedChartItem
              id={item.videoIds[0]}
              rank={index + 1}
              rankChange={chartData && name ? chartData[item.artist][item.title].previousRank[name] - (index + 1) : 'new'}
              title={item.title}
              artist={item.artist}
              count={item.count}
            />
          )}
        />
      </motion.div>
    </DefaultLayout>
  );
};

export default RankParent;
