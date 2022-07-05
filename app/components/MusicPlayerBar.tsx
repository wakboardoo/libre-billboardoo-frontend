import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
  VolumeMute,
  VolumeDown,
  Shuffle,
  Repeat,
  Link as LinkIcon,
  RepeatOne,
  VolumeOff,
  ArrowDropUpRounded,
} from '@mui/icons-material';
import useCurrentVideo from '~/hooks/useCurrentVideo';

const opts = {
  height: '75',
  width: '135',
  playerVars: {
    autoplay: 0,
    controls: 0,
  },
};

const MusicPlayerBar: React.FC = () => {
  const videoId = useCurrentVideo();

  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'NO_REPEAT' | 'REPEAT_ONE' | 'REPEAT_ALL'>('NO_REPEAT');
  const [isOpen, setOpen] = useState(false);

  const [timer, setTimer] = useState<any>();

  const PlayOrPause: SvgIconComponent = useMemo(() => isPlaying ? Pause : PlayArrow, [isPlaying]);

  const VolumeIcon: SvgIconComponent = useMemo(() => {
    if (isMuted) return VolumeOff;
    if (volume === 0) return VolumeMute;
    else if (volume < 50) return VolumeDown;
    else return VolumeUp;
  }, [isMuted, volume]);

  const RepeatIcon: SvgIconComponent = useMemo(() => repeatMode === 'REPEAT_ONE' ? RepeatOne : Repeat, [repeatMode]);

  const onReady = useCallback((event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target?.playVideo();
    setIsPlaying(true);
    setDuration(event.target?.getDuration());

    clearInterval(timer);
    setTimer(setInterval(() => {
      setCurrentTime(event.target?.getCurrentTime() ?? 0);
    }, 1000));
  }, [timer]);

  const onTogglePlay = useCallback(() => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);
  const onToggleMute = useCallback(() => setIsMuted(!isMuted), [isMuted]);
  const onToggleRepeat = useCallback(() => {
    if (repeatMode === 'NO_REPEAT') setRepeatMode('REPEAT_ALL');
    else if (repeatMode === 'REPEAT_ALL') setRepeatMode('REPEAT_ONE');
    else setRepeatMode('NO_REPEAT');
  }, [repeatMode]);
  const onToggleOpen = useCallback(() => setOpen(!isOpen), [isOpen]);

  const currentTimeText = useMemo(() => {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [currentTime]);

  const durationText = useMemo(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [duration]);

  const onSeek = useCallback((time: number) => {
    player?.seekTo(time);
  }, [player]);
  return (
    <div className={'fixed bottom-0 inset-x-0 bg-black flex flex-row'} style={{ height: 75 }}>
      <div>
        <div className={'absolute top-0 left-0'} style={{ width: 135, height: 75 }} onClick={onToggleOpen}/>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
      <div className={'flex flex-row w-full justify-between items-center px-3'}>
        <div className={'flex flex-row items-center justify-around mr-5'} style={{ width: 200 }}>
          <SkipPrevious className={'icon-enabled'}/> {/* TODO: Play list */}
          <PlayOrPause style={{ width: 35, height: 35 }} className={'icon-enabled'}
                       onClick={onTogglePlay}/>
          <SkipNext className={'icon-enabled'}/> {/* TODO: Play list */}
          <small className={'text-white'} style={{ width: 75 }}>
            {currentTimeText} / {durationText}
          </small>
        </div>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek}/>
        <div className={'flex flex-row justify-around items-center ml-5'} style={{ width: 160 }}>
          <VolumeIcon className={isMuted ? 'icon-disabled' : 'icon-enabled'}
                      onClick={onToggleMute}/>
          <RepeatIcon className={repeatMode === 'NO_REPEAT' ? 'icon-disabled' : 'icon-enabled'}
                      onClick={onToggleRepeat}/>
          <Shuffle className={'icon-disabled'}/>
          <a href={'https://youtu.be/' + videoId} target={'_blank'} rel={'noopener noreferrer'}>
            <LinkIcon className={'icon-disabled'}/>
          </a>
          <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
            <ArrowDropUpRounded className={isOpen ? 'icon-enabled' : 'icon-disabled'}
                                style={{ width: 35, height: 35 }}
                                onClick={onToggleOpen}/>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
