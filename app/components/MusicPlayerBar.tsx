import React, { useCallback, useEffect, useMemo } from 'react';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import YouTube from 'react-youtube';
import ProgressBar from '@components/ProgressBar';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeMute, VolumeDown, Shuffle, Repeat, Link,
} from '@mui/icons-material';

const opts = {
  height: '75',
  width: '133.33',
  playerVars: {
    autoplay: 0,
  },
};

const IconStyle = { color: '#fff' };

const MusicPlayerBar: React.FC = () => {
  const [videoId, setVideoId] = React.useState('h5yU8WZsB9g');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [player, setPlayer] = React.useState<YouTubePlayer>();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(100);

  const PlayOrPause: SvgIconComponent = useMemo(() => isPlaying ? Pause : PlayArrow, [isPlaying]);

  const VolumeIcon: SvgIconComponent = useMemo(() => {
    if (volume === 0) {
      return VolumeMute;
    } else if (volume < 50) {
      return VolumeDown;
    } else {
      return VolumeUp;
    }
  }, [volume]);

  const onReady = useCallback((event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.playVideo();
  }, []);

  const onTogglePlay = useCallback(() => setIsPlaying(!isPlaying), [isPlaying, player]);

  const onSeek = useCallback((time: number) => {
    player?.seekTo(time);
  }, [player]);

  useEffect(() => {
    if (isPlaying) {
      player?.playVideo();
    } else {
      player?.pauseVideo();
    }
  }, [isPlaying]);

  return (
    <div className={'fixed bottom-0 inset-x-0 bg-black flex flex-row'} style={{ height: 75 }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className={'flex flex-row w-full justify-between items-center px-3'}>
        <div className={'flex flex-row'}>
          <SkipPrevious style={IconStyle}/> {/* TODO: Play list */}
          <PlayOrPause style={IconStyle} onClick={onTogglePlay}/>
          <SkipNext style={{ color: 'white' }}/> {/* TODO: Play list */}
        </div>
        <div>
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek}/>
        </div>
        <div>
          <VolumeIcon style={IconStyle}/>
          <Repeat style={IconStyle}/>
          <Shuffle style={IconStyle}/>
          <Link style={IconStyle}/>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
