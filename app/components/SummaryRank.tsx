import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@remix-run/react';
import type { Ranking } from '@utils/types';
import { PlayListContext } from '~/hooks/usePlayList';

interface Props {
  title: string
  href: string
  ranks: Ranking[]
}

const SummaryRank: React.FC<Props> = ({ title, href, ranks  }) => {
  // eslint-disable-next-line react/display-name
  const mapFunction = (offset: number) => (rank: Ranking, index: number) => (
    <PlayListContext.Consumer>
      {(ctx) => (
        <div key={rank.videoIds[0]}
             className='flex flex-1 w-72 md:w-[28rem] items-center gap-3 p-2 hover:bg-neutral-900 cursor-pointer'
             onClick={() => {
               const info = {
                 videoId: rank.videoIds[0],
                 title: rank.title,
                 artist: rank.artist,
               };

               const list = ranks
                 .filter((it) => it.videoIds[0] !== info.videoId)
                 .slice(0, 99)
                 .map((it) => ({ title: it.title, artist: it.artist, videoId: it.videoIds[0] }));

               ctx.setPlayList([info, ...list]);
               ctx.setCurrentIndex(0);
             }}
        >
          <img
            src={`https://i.ytimg.com/vi/${rank.videoIds[0]}/hqdefault.jpg`}
            alt={`${rank.artist} ${rank.title} 썸네일`}
            loading='lazy'
            decoding='async'
            className='aspect-video object-cover object-center w-16 md:w-20'
          />

          <span className='w-6 md:w-8 text-gray-50 font-bold text-center'>{index + offset}</span>

          <div className='flex flex-col w-1/2'>
            <span className='text-gray-50 font-normal truncate'>{rank.title}</span>
            <span className='text-gray-400 font-normal text-sm truncate'>{rank.artist}</span>
          </div>
        </div>
      )}
    </PlayListContext.Consumer>
  );

  return (
    <>
      <h1 className='w-fit group text-gray-50 text-4xl font-bold'>
        <Link to={href} className='flex items-center gap-1'>
          {title}
          <ChevronRightIcon className='w-8 h-8 text-gray-400 group-hover:text-gray-50'/>
        </Link>
      </h1>
      <div className='grid grid-flow-col no-scrollbar overflow-x-auto mt-3'>
        <div className='flex-row'>
          {(ranks ? ranks.slice(0, 5) : []).map(mapFunction(1))}
        </div>
        <div className='flex-row'>
          {(ranks ? ranks.slice(5, 10) : []).map(mapFunction(6))}
        </div>
      </div>
    </>
  );
};

export default SummaryRank;
