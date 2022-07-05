import React, { useMemo } from 'react';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<Props> = ({ currentTime, onSeek, duration }) => {
  const percent = useMemo(() =>  (currentTime / duration) * 100, [currentTime, duration]);

  return (
    <div className={'flex-1 flex items-center'}>
      <div className={'rounded bg-gray-500 w-full h-1 flex flex-row'}>
        <div className={'rounded bg-red-600 h-full'} style={{ width: `${percent}%`, transition: 'width 1s' }}/>
      </div>
    </div>
  );
};

export default ProgressBar;
