import { PlayIcon } from '@heroicons/react/solid';

interface Props {
  start: number
  end: number
  list: string[]
}

const Play50Button = ({ start, end, list }: Props) => {
  return (
    <button
      className='flex items-center bg-red-500 text-gray-50 rounded-lg md:rounded-xl p-2 md:p-3'
      onClick={() => {
        if (window) window.open(`https://www.youtube.com/watch_videos?video_ids=${list.join(',')}`, '_blank');
      }}
    >
      <PlayIcon className='w-3 h-3 md:w-5 md:h-5' />
      <b className='text-sm md:text-base'>{start}위 ~ {end}위 듣기</b>
    </button>
  );
};

export default Play50Button;
