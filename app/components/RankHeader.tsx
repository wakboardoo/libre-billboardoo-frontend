import { css, cx } from "@linaria/core";
import { Ranking } from "@utils/types";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Play50Button from "./Play50Button";
import SearchBox from "./SearchBox";

export const RankHeaderStyle = __linariaStyle;
const headerStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    height: 100%;

    z-index: -1;
    pointer-events: auto;

    background: rgb(0 0 0 / 0.5);
    backdrop-filter: blur(12px);

    transition: all 0.35s cubic-bezier(0, 0.5, 0.5, 1);
  }

  @media (min-width: 767px) {
    &[data-animate="collapse"]::before {
      height: calc(3.5rem + 4rem);
    }
  }

  @media (max-width: 767px) {
    &[data-animate="collapse"]::before {
      height: calc(1rem + 4rem);
    }
  }
`;

const defaultTransition = {
  duration: 0.35,
  ease: [0, 0.5, 0.5, 1],
};

export interface RankHeaderProps {
  title: string;
  rankings: Ranking[];
  timestamp: number;

  collapsed?: boolean;
  onKeyword?: React.FormEventHandler<HTMLInputElement>;
}

const RankHeader = React.forwardRef<HTMLDivElement, RankHeaderProps>((
  {
    title,
    rankings,
    timestamp,
    collapsed,
    onKeyword,
  },
  fRef,
): JSX.Element => {
  const [titleHeight, setTitleHeight] = useState(0);
  const [searchHeight, setSearchHeight] = useState(0);

  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const padding = useMemo(() => {
    if (isMobile) return '1rem';
    return '3.5rem';
  }, [isMobile]);

  const getTitleHeight = useCallback((head: HTMLHeadingElement) => {
    if (!head) return;

    const rect = head.getBoundingClientRect();
    setTitleHeight(rect.height);
  }, []);

  const getSearchHeight = useCallback((div: HTMLDivElement) => {
    if (!div) return;

    const rect = div.getBoundingClientRect();
    setSearchHeight(rect.height);
  }, []);

  return (
    <motion.div
      ref={fRef}
      data-animate={collapsed ? 'collapse' : 'normal'}
      animate={collapsed ? 'collapse' : 'normal'}
      className={cx(
        'p-4 md:p-14 md:pb-4',
        'flex flex-col justify-start items-start gap-3',
        'box-border',
        headerStyle,
      )}
      variants={{
        collapse: {
          y: `-${padding}`,
        },
      }}
    >
      <motion.h1
        ref={getTitleHeight}
        className={cx(
          'text-gray-50 text-4xl font-bold',
        )}
        transition={defaultTransition}
        variants={{
          collapse: {
            originX: 0,
            scale: 0.7,
            y: '0.5rem',
            ...(isMobile
              ? {
                scale: 1,
                y: '-100%',
                opacity: 0,
              }
              : {}
            ),
          },
        }}
      >
        {title}
        <motion.p
          className={cx(
            'text-gray-400 text-lg font-normal',
          )}
          transition={defaultTransition}
          variants={{
            collapse: {
              opacity: 0,
              y: '-100%',
            },
          }}
        >
          {dayjs(timestamp * 1000).format(`M월 D일 a h시`)} 업데이트
        </motion.p>
      </motion.h1>
      <motion.div
        ref={getSearchHeight}
        className={cx('w-full pointer-events-auto')}
        transition={defaultTransition}
        variants={{
          collapse: {
            opacity: 0,
            y: '-100%',
          },
        }}
      >
        <SearchBox
          onInput={onKeyword}
        />
      </motion.div>
      <motion.div
        className={cx(
          'w-full flex flex-row justify-end items-center gap-3',
          'pointer-events-auto',
        )}
        transition={defaultTransition}
        variants={{
          collapse: {
            y: `calc(-1 * (0.75rem * 2 + ${titleHeight}px + ${searchHeight}px - 0.5rem))`,
          },
        }}
      >
        <Play50Button
          start={1}
          end={Math.min(rankings.length, 50)}
          list={rankings.slice(0, Math.min(rankings.length, 50)).map((value) => value.videoIds[0])}
        />
        {rankings.length > 50 && (
          <Play50Button
            key='play51to100'
            start={51}
            end={Math.min(rankings.length, 100)}
            list={rankings.slice(50, Math.min(rankings.length, 100)).map((value) => value.videoIds[0])}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

export default RankHeader;
