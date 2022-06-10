import { MemoizedChartItem } from '@components/ChartItem';
import Play50Button from '@components/Play50Button';
import SearchBox from '@components/SearchBox';
import DefaultLayout from '@layouts/DefaultLayout';
import { css, cx } from '@linaria/core';
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
    href: __linariaStyle,
  },
];

const headerStyle = css`
  --padding: 1rem;

  @media (min-width: 768px) {
    --padding: 3.5rem;
  }

  padding: calc((1 - var(--offset, 0)) * (var(--padding) - 1rem) + 1rem);
`;

const titleStyle = css`
  transform: scale(calc((1 - var(--offset, 0)) * 0.3 + 0.7));

  @media (max-width: 768px) {
    transform: translateY(calc(-100% * var(--offset, 0)));
    opacity: calc(100% - var(--offset, 0) * 100%);
  }
`;

const infoStyle = css`
  max-height: calc((1 - var(--offset, 0)) * var(--padding));
  transform: translateY(calc(var(--offset, 0) * -100%));
  opacity: calc(100% * (1 - var(--offset, 0)));
`;

const buttonLayoutStyle = css`
  --padding-top: 0.5rem;
  --first-offset: max(min(calc(var(--offset, 0) * 2), 1), 0);
  --second-offset: max(min(calc(max(var(--offset, 0) - 0.5) * 2), 1), 0);

  top: calc(var(--header-height) - var(--padding) + 0.5rem);
  transform:
    translateX(calc(var(--first-offset, 0) * (var(--header-width) - var(--button-width) - var(--padding) - 1rem)))
    translateY(calc(-1 * var(--second-offset, 0) * (var(--header-height) - var(--padding) - var(--padding-top) + 0.5rem)));

  @media (max-width: 768px) {
    --padding-top: 1rem;
  }
`;

const searchStyle = css`
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: calc(var(--padding, 3.5rem) * (1 - var(--offset, 0)));
    max-height: calc((1 - var(--offset, 0)) * 56px);
  }
`;

const RankParent = () => {
  const { name, title, ranks, chartData } = useMatches()[2].data as RankLoaderData;

  const headerRef = useRef<HTMLDivElement>();
  const buttonRef = useRef<HTMLDivElement>();
  const scrollerRef = useRef<HTMLElement>();
  const throttle = useRef<NodeJS.Timeout | null>(null);

  const [headerRect, setHeaderRect] = useState<DOMRect | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [keyword, setKeyword] = useState('');

  const button1to50 = useMemo(() => (
    <Play50Button
      key='play1to50'
      start={1}
      end={Math.min(ranks.ranking.length, 50)}
      list={ranks.ranking.slice(0, Math.min(ranks.ranking.length, 50)).map((value) => value.videoIds[0])}
    />
  ), [ranks.ranking]);

  const button51to100 = useMemo(() => (
    <Play50Button
      key='play51to100'
      start={51}
      end={Math.min(ranks.ranking.length, 100)}
      list={ranks.ranking.slice(50, Math.min(ranks.ranking.length, 100)).map((value) => value.videoIds[0])}
    />
  ), [ranks.ranking]);

  const getButtons = useCallback(() => {
    if (ranks.ranking.length <= 50) {
      return [button1to50];
    } else {
      return [button1to50, button51to100];
    }
  }, [ranks.ranking.length, button1to50, button51to100]);

  const getButtonRect = useCallback((div: HTMLDivElement | null) => {
    if (div) {
      buttonRef.current = div;

      const rect = div.getBoundingClientRect();
      if (rect.width > 0) setButtonRect(rect);
    }
  }, []);

  const getHeaderRect = useCallback((div: HTMLDivElement | null) => {
    if (div) {
      headerRef.current = div;

      const rect = div.getBoundingClientRect();
      if (rect.height > 0) setHeaderRect(rect);
    }
  }, []);

  const ignoreTime = useRef(0);
  const onScroll: React.UIEventHandler<'div'> = useCallback((event) => {
    if (headerRect && headerRef.current) {
      if (event.timeStamp - ignoreTime.current < 16) return;

      const target = event.target as HTMLDivElement;

      const top = target.scrollTop;
      const offset = Math.min(top / (headerRect.height - 16 * 3.5), 1);

      headerRef.current.style.setProperty('--offset', offset.toString());
      ignoreTime.current = event.timeStamp;
    }
  }, [headerRect]);

  const onScrollStateChanged = useCallback((isScrolling: boolean) => {
    if (!isScrolling) {
      if (scrollerRef.current && headerRect && headerRef.current) {
        const top = scrollerRef.current.scrollTop;
        const offset = Math.min(top / (headerRect.height - 16 * 3.5), 1);
  
        headerRef.current.style.setProperty('--offset', Math.round(offset).toString());
      } 
    }
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
      .filter((it) => it.title.toLowerCase().includes(keyword.toLowerCase())
        || it.artist.toLowerCase().includes(keyword.toLowerCase())
      ),
    [ranks.ranking, keyword],
  );

  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='h-full'
      >
        <Outlet />

        <div
          ref={getHeaderRect}
          style={{
            '--header-height': `${headerRect?.height ?? 0}px`,
            '--button-height': `${buttonRect?.height ?? 0}px`,
            '--header-width': `${headerRect?.width ?? 0}px`,
            '--button-width': `${buttonRect?.width ?? 0}px`,
          }}
          className={cx(
            'p-4 md:p-14 absolute top-0 left-0 right-0 z-50',
            'flex flex-col justify-start items-start',
            'bg-black/20 backdrop-blur-md box-border transition-all',
            headerStyle,
          )}
        >
          <h1
            className={cx(
              'text-gray-50 text-4xl font-bold transition-transform origin-left',
              titleStyle,
            )}
          >
            {title}
          </h1>
          <p
            className={cx(
              'text-gray-400 text-lg transition-all',
              infoStyle,
            )}
          >
            {dayjs(ranks.timestamp * 1000).format(`M월 D일 a h시`)} 업데이트
          </p>
          <div className={cx('w-full mt-3', searchStyle)}>
            <SearchBox
              onInput={onKeyword}
            />
          </div>
          <div
            ref={getButtonRect}
            className={cx(
              'flex gap-3 absolute left-4 md:left-14 transition-all',
              buttonLayoutStyle,
            )}
          >
            {getButtons()}
          </div>
        </div>

        <Virtuoso
          scrollerRef={(it) => scrollerRef.current = it as HTMLElement}
          style={{ height: '100%', willChange: 'transform' }}
          data={filteredRanks}
          overscan={3}
          components={{
            List: React.forwardRef(({ style, children }, ref) => (
              <div ref={ref} style={{ ...style }} className='m-4 md:m-14 space-y-3'>
                {children}
              </div>
            )),
            Header: () => <div className={'mb-8 md:mb-14'} style={{ height: headerRect?.height }} />,
            Footer: () => <br/>,
          }}
          onScroll={onScroll}
          isScrolling={onScrollStateChanged}
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
