import { MemoizedChartItem } from '@components/ChartItem';
import Play50Button from '@components/Play50Button';
import RankHeader, { RankHeaderStyle } from '@components/RankHeader';
import SearchBox from '@components/SearchBox';
import DefaultLayout from '@layouts/DefaultLayout';
import { Outlet, useMatches } from '@remix-run/react';
import type { RankLoaderData } from '@utils/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useForceUpdate from '~/hooks/useForceUpdate';

export const links = () => [
  {
    rel: 'stylesheet',
    href: RankHeaderStyle,
  }
];

const RankParent = () => {
  const { name, title, ranks, chartData } = useMatches()[2].data as RankLoaderData;

  const throttle = useRef<NodeJS.Timeout | null>(null);
  const lastOffset = useRef(0);

  const [headerRect, setHeaderRect] = useState<DOMRect | null>(null);
  const [keyword, setKeyword] = useState('');
  const [isCollapse, setIsCollapse] = useState(false);

  const getHeaderRect = useCallback((div: HTMLDivElement) => {
    if (div && !headerRect) {
      setHeaderRect(div.getBoundingClientRect());
    }
  }, [!!headerRect]);

  const onScroll: React.UIEventHandler<'div'> = useCallback((event) => {
      const target = event.target as HTMLDivElement;

      const top = target.scrollTop;

      setIsCollapse(top > lastOffset.current);
      lastOffset.current = top;
  }, [headerRect]);

  const onKeyword: React.FormEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.currentTarget;

    if (throttle.current) clearTimeout(throttle.current);
    throttle.current = setTimeout(() => {
      setKeyword(value);
    }, 500);
  }, [throttle]);

  const filteredRanks = useMemo(
    () => ranks.ranking
      .map((it, i) => ({ ...it, rank: i + 1 }))
      .filter((it) => it.title.toLowerCase().includes(keyword.toLowerCase())
        || it.artist.toLowerCase().includes(keyword.toLowerCase())),
    [ranks.ranking, keyword],
  );

  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={'h-full'}
      >
        <Outlet />

        <Virtuoso
          style={{ height: '100%', willChange: 'transform' }}
          className={'z-0 '}
          data={filteredRanks}
          overscan={3}
          components={{
            Footer: () => <p />,
            Header: () => <div style={{ height: headerRect?.height }} />,
          }}
          onScroll={onScroll}
          computeItemKey={(_, item) => item?.videoIds[0] ?? 'header'}
          itemContent={(index, item) => {
            let changeRank: number | 'new' = 0;
            if (!chartData || !name || chartData[item.artist][item.title].previousRank[name] === 0) changeRank = 'new';
            else changeRank = chartData[item.artist][item.title].previousRank[name] - item.rank;

            return (
              <div className={'z-[-1] px-4 md:px-14 box-border'}>
                <MemoizedChartItem
                  id={item.videoIds[0]}
                  rank={item.rank}
                  rankChange={changeRank}
                  title={item.title}
                  artist={item.artist}
                  count={item.count}
                />
              </div>
            );
          }}
        />
        <RankHeader
          ref={getHeaderRect}
          title={title}
          rankings={ranks.ranking}
          timestamp={ranks.timestamp}
          collapsed={isCollapse}
          onKeyword={onKeyword}
        />
      </motion.div>
    </DefaultLayout>
  );
};

export default RankParent;
