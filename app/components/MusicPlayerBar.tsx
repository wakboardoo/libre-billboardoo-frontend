import React, { useCallback } from 'react';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import YouTube from 'react-youtube';
import ProgressBar from '@components/ProgressBar';

const opts = {
  height: '75',
  width: '133.33',
  playerVars: {
    autoplay: 0,
  },
};

const MusicPlayerBar: React.FC = () => {
  const [videoId, setVideoId] = React.useState('h5yU8WZsB9g');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [player, setPlayer] = React.useState<YouTubePlayer>();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const onReady = useCallback((event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.playVideo();
  }, []);

  const onTogglePlay = useCallback(() => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);

  const onSeek = useCallback((time: number) => {
    player?.seekTo(time);
  }, [player]);

  return (
    <div className={'fixed bottom-0 inset-x-0 bg-black flex flex-row'} style={{ height: 75 }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className={'flex flex-row'}>
        <SkipPrevious fill={'white'} /> {/* TODO: Play list */}
        {
          isPlaying ?
            <Pause fill={'white'} onClick={onTogglePlay}/> :
            <PlayArrow fill={'white'} onClick={onTogglePlay}/>
        }
        <SkipNext fill={'white'} /> {/* TODO: Play list */}
      </div>
      <div>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />
      </div>
    </div>
  );
};

export default MusicPlayerBar;
