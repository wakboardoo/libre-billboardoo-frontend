import { PlayIcon } from '@heroicons/react/solid'

interface Props {
  start: number
  end: number
  list: string[]
}

const Play50Button = ({ start, end, list }: Props) => {
  return (
    <button
      className='flex items-center bg-red-500 text-gray-50 rounded-xl p-3'
      onClick={() => {
        if (window) window.open(`https://www.youtube.com/watch_videos?video_ids=${list.join(',')}`, '_blank')
      }}
    >
      <PlayIcon className='w-5 h-5' />
      TOP {start} ~ {end} 듣기
    </button>
  )
}

export default Play50Button
