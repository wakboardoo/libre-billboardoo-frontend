import React from 'react';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<Props> = ({ currentTime, onSeek, duration }) => {
  return (
    <div>
      <div>
      </div>
    </div>
  );
};

export default ProgressBar;
