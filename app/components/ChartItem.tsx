import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@heroicons/react/outline';
import { classNames } from '@utils/classNames';
import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  className?: string
  id: string
  rank: number
  rankChange: number | 'new'
  title: string
  artist: string
  count: number
  onClick?: () => void
}

const ChartItem = ({ className, id, rank, rankChange, title, artist, count, onClick }: Props) => {
  return (
    <div
      className={classNames('box-border group w-full flex justify-between items-center p-2 hover:bg-neutral-900 cursor-pointer gap-3', className ?? '')}
      onClick={onClick}
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
    </div>
  );
};

export const MemoizedChartItem = React.memo(ChartItem);

export default ChartItem;
