import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@heroicons/react/24/outline';
import { classNames } from '@utils/classNames';
import { motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { PlaylistAdd } from '@mui/icons-material';
import usePlayList from '~/hooks/usePlayList';

interface Props {
  className?: string
  id: string
  rank: number
  rankChange: number | 'new'
  title: string
  artist: string
  count: number
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const ChartItem = ({ className, id, rank, rankChange, title, artist, count, onClick }: Props) => {
  const playlist = usePlayList();

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const onAddClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    playlist.addMusic({
      videoId: id,
      title,
      artist,
    });
  }, [playlist, id, title, artist]);

  return (
    <div
      className={classNames('box-border group w-full flex justify-between items-center p-2 hover:bg-neutral-900 cursor-pointer gap-3', className ?? '')}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex items-center gap-3'>
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={`${artist} ${title} 썸네일`}
          loading='lazy'
          decoding='async'
          className='aspect-video object-cover object-center w-14 md:w-20'
        />

        <div className='flex flex-col md:flex-row justify-center items-center md:gap-3'>
          <span className='w-6 md:w-8 text-gray-50 font-bold text-center'>{rank}</span>

          {rankChange === 'new' && (
            <motion.span
              className='w-4 text-center text-red-500 font-medium text-sm'
              animate={{
                opacity: ['0%', '100%'],
                x: ['-50%', '0%'],
              }}
            >
              N
            </motion.span>
          )}
          {rankChange > 0 && (
            <span className='flex gap-1 md:flex-col text-center text-green-500 font-medium text-sm'>
              <motion.div
                animate={{
                  opacity: ['100%', '0%', '0%', '100%'],
                  y: ['0%', '-50%', '50%', '0%'],
                }}
                transition={{ repeat: 1, delay: 0.5 }}
              >
                <ChevronUpIcon className='h-4 w-4' />
              </motion.div>
              {rankChange}
            </span>
          )}
          {rankChange === 0 && <MinusIcon className='h-4 w-4 text-gray-400' />}
          {rankChange < 0 && (
            <span className='flex gap-1 flex-row-reverse md:flex-col items-center text-center text-red-500 font-medium text-sm'>
              {Math.abs(rankChange as number)}
              <motion.div
                animate={{
                  opacity: ['100%', '0%', '0%', '100%'],
                  y: ['0%', '50%', '-50%', '0%'],
                }}
                transition={{ repeat: 1, delay: 0.5 }}
              >
                <ChevronDownIcon className='h-4 w-4' />
              </motion.div>
            </span>
          )}
        </div>
      </div>

      <div className='flex w-auto max-w-[50%] md:max-w-none flex-col truncate'>
        <span className='text-gray-50 font-normal truncate'>{title}</span>
        <span className='text-gray-400 font-normal text-sm'>{count.toLocaleString('ko-KR')}회</span>
      </div>

      <span className='flex-1 text-right text-gray-400 font-normal truncate'>{artist}</span>

      { isHover ? (
        <div className={'flex flex-row items-center justify-around'}>
          <PlaylistAdd data-value="remove" className={'icon-enabled'} onClick={onAddClick}/>
        </div>
      ) : null }
    </div>
  );
};

export const MemoizedChartItem = React.memo(ChartItem);

export default ChartItem;
