import { PlayIcon } from '@heroicons/react/solid';

interface Props {
  start: number
  end: number
  list: string[]
}

const Play50Button = ({ start, end, list }: Props) => {
  return (
    <button
      className='h-12 flex gap-1 items-center bg-red-500 text-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border-box'
      onClick={() => {
        if (window) window.open(`https://www.youtube.com/watch_videos?video_ids=${list.join(',')}`, '_blank');
      }}
    >
      <PlayIcon className='w-5 h-5' />
      <b className='text-sm md:text-base'>{start}위 ~ {end}위 듣기</b>
    </button>
  );
};

export default Play50Button;
