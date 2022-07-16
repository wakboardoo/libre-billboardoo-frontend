import { MemoizedChartItem } from '@components/ChartItem';
import RankHeader, { RankHeaderStyle } from '@components/RankHeader';
import DefaultLayout from '@layouts/DefaultLayout';
import { Outlet, useMatches } from '@remix-run/react';
import type { Ranking, RankLoaderData } from '@utils/types';
import { motion } from 'framer-motion';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import MusicPlayerBar from '@components/MusicPlayerBar';
import type { MusicInfo } from '~/hooks/usePlayList';
import { PlayListContext } from '~/hooks/usePlayList';

export const links = () => [
  {
    rel: 'stylesheet',
    href: RankHeaderStyle,
  },
];

const RankParent = () => {
  const { name, title, ranks, chartData } = useMatches()[2].data as RankLoaderData;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playList, setPlayList] = useState<MusicInfo[]>([]);

  const throttle = useRef<NodeJS.Timeout | null>(null);
  const lastOffset = useRef(0);

  const [headerRect, setHeaderRect] = useState<DOMRect | null>(null);
  const [keyword, setKeyword] = useState('');
  const [isCollapse, setIsCollapse] = useState(false);

  const getHeaderRect = useCallback((div: HTMLDivElement) => {
    if (div && !headerRect) {
      setHeaderRect(div.getBoundingClientRect());
    }
  }, [headerRect]);

  const onScroll: React.UIEventHandler<'div'> = useCallback((event) => {
    const target = event.target as HTMLDivElement;

    const top = target.scrollTop;
    const collapsed = top > lastOffset.current;

    if (!collapsed || top > (headerRect?.height ?? 0) / 2) {
      setIsCollapse(top > lastOffset.current);
    } else if (isCollapse) {
      setIsCollapse(false);
    }

    lastOffset.current = top;
  }, [headerRect, isCollapse]);

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

  const onClickItem = useCallback((item: Ranking) => {
    const info = {
      videoId: item.videoIds[0],
      title: item.title,
      artist: item.artist,
    };

    const list = filteredRanks
      .filter((it) => it.videoIds[0] !== info.videoId)
      .map((it) => ({ title: it.title, artist: it.artist, videoId: it.videoIds[0] }));

    setPlayList([info, ...list]);
    setCurrentIndex(0);
  }, [filteredRanks]);

  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={'h-full'}
      >
        <RankHeader
          ref={getHeaderRect}
          title={title}
          rankings={ranks.ranking}
          timestamp={ranks.timestamp}
          collapsed={isCollapse}
          onKeyword={onKeyword}
        />
        <Outlet/>
        <Virtuoso
          style={{ height: '100%', willChange: 'transform' }}
          className={'z-0 '}
          data={filteredRanks}
          overscan={3}
          components={{
            Footer: () => <div style={{ paddingBottom: 75 }}>
              <li>
                <a
                  href='https://docs.google.com/spreadsheets/d/1n8bRCE_OBUOND4pfhlqwEBMR6qifVLyWk5YrHclRWfY'
                  target={'_blank'}
                  rel={'noopener noreferrer'}>
                  <div className='px-4 md:px-14 font-semibold text-gray-50'>데이터 수정 요청</div>
                </a>
              </li>
            </div>,
            Header: () => <div style={{ height: headerRect?.height }}/>,
          }}
          onScroll={onScroll}
          computeItemKey={(_, item) => item?.videoIds[0] ?? 'header'}
          itemContent={(index, item) => {
            let changeRank: number | 'new';
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
                  onClick={() => onClickItem(item)}
                />
              </div>
            );
          }}
        />
      </motion.div>
      <PlayListContext.Provider value={{
        playList,
        setPlayList,
        currentIndex,
        setCurrentIndex,
      }}>
        {playList.length !== 0 && <MusicPlayerBar/>}
      </PlayListContext.Provider>
    </DefaultLayout>
  );
};

export default RankParent;
