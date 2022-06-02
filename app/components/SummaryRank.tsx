import { ChevronRightIcon } from '@heroicons/react/outline';
import { Link } from '@remix-run/react';
import type { Ranking } from '@utils/types';

interface Props {
  title: string
  href: string
  ranks: Ranking[]
}

const SummaryRank = ({ title, href, ranks }: Props) => {
  return (
    <>
      <h1 className='text-gray-50 text-4xl font-bold'>
        <Link to={href} className='flex items-center gap-2'>
          {title}
          <ChevronRightIcon className='w-8 h-8' />
        </Link>
      </h1>
      <div className='grid grid-cols-2 space-y-3 mt-3'>
        {ranks.slice(0, 10).map((rank, index) => (
          <div key={rank.videoIds[0]} className='flex items-center gap-3 hover:bg-neutral-900 cursor-pointer'
            onClick={() => {
              if (window) window.open(`https://www.youtube.com/watch?v=${rank.videoIds[0]}`, '_blank')?.focus();
            }}
          >
            <img
              src={`https://i.ytimg.com/vi/${rank.videoIds[0]}/hqdefault.jpg`}
              alt={`${rank.artist} ${rank.title} 썸네일`}
              loading='lazy'
              decoding='async'
              className='aspect-video object-cover object-center w-14 md:w-20'
            />

            <span className='w-6 md:w-8 text-gray-50 font-bold text-center'>{index + 1}</span>
            
            <div className='flex flex-col'>
              <span className='text-gray-50 font-normal truncate'>{rank.title}</span>
              <span className='text-gray-400 font-normal text-sm'>{rank.artist}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SummaryRank;