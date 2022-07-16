import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import YouTube from 'react-youtube';
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
import Marquee from 'react-fast-marquee';

const opts = {
  height: '0',
  width: '0',
  playerVars: {
    autoplay: 0,
    controls: 0,
  },
};

const MusicPlayerBar: React.FC = () => {
  const videoInfo = useCurrentVideo();

  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'NO_REPEAT' | 'REPEAT_ONE' | 'REPEAT_ALL'>('NO_REPEAT');
  const [isOpen, setOpen] = useState(false);

  const [timer, setTimer] = useState<any>();

  const percent = useMemo(() => (currentTime / duration) * 100, [currentTime, duration]);

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

    event.target?.setVolume(volume);
    if (isMuted) {
      event.target?.mute();
    } else {
      event.target?.unMute();
    }

    clearInterval(timer);
    setTimer(setInterval(() => {
      setCurrentTime(event.target?.getCurrentTime() ?? 0);
    }, 100));
  }, [isMuted, volume, timer]);

  const onTogglePlay = useCallback(() => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);
  const onToggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (isMuted) {
      player?.unMute();
    } else {
      player?.mute();
    }
  }, [player, isMuted]);
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

  const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.valueAsNumber;
    player?.seekTo(time);
  }, [player]);

  const onChangeVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
    player?.setVolume(e.target.valueAsNumber);
  }, [player]);

  return (
    <div className={'fixed bottom-0 inset-x-0 bg-black flex flex-row h-20'}>
      <div onClick={onToggleOpen}>
        <YouTube
          videoId={videoInfo?.videoIds[0]}
          opts={opts}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <img
          src={`https://i.ytimg.com/vi/${videoInfo?.videoIds[0]}/hqdefault.jpg`}
          alt={`${videoInfo?.artist} ${videoInfo?.title} 썸네일`}
          loading='lazy'
          decoding='async'
          className='aspect-video object-cover object-center h-full'
        />
      </div>

      <div className={'flex flex-col justify-center items-center w-32'} onClick={onToggleOpen} style={{ minWidth: '8rem' }}>
        <Marquee gradient={false}>
          <div className={'flex flex-col justify-center items-center mx-2'}>
            <p className={'text-white text-sm'}>{videoInfo?.title}</p>
            <span className={'text-gray-400 text-xs text-center'}>{videoInfo?.artist}</span>
          </div>
        </Marquee>
      </div>

      <div className={'flex flex-row w-full justify-between items-center'}>
        <div className={'flex flex-row items-center justify-around'} style={{ width: 200 }}>
          <SkipPrevious className={'icon-enabled'}/> {/* TODO: Play list */}
          <PlayOrPause style={{ width: '2.25rem', height: '2.25rem' }} className={'icon-enabled'}
                       onClick={onTogglePlay}/>
          <SkipNext className={'icon-enabled'}/> {/* TODO: Play list */}
          <small className={'text-white'} style={{ width: 75 }}>
            {currentTimeText} / {durationText}
          </small>
        </div>

        <div className={'flex-1 flex items-center'}>
          <input
            className={'w-full progress'}
            type={'range'}
            min={0}
            max={duration}
            value={currentTime}
            onChange={onSeek}
            style={{ background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${percent}%, #606060 ${percent}%, #606060 100%)` }}
          />
        </div>

        <div className={'flex flex-row justify-around items-center ml-5'} style={{ width: 300 }}>
          <input
            className={'volume'}
            type={'range'} min={0} max={100} value={isMuted ? 0 : volume}
            onChange={onChangeVolume}
            style={{ background: `linear-gradient(to right, #FFF 0%, #FFF ${isMuted ? '0' : volume}%, #606060 ${isMuted ? '0' : volume}%, #606060 100%)` }}
          />
          <VolumeIcon className={isMuted ? 'icon-disabled' : 'icon-enabled'}
                      onClick={onToggleMute}/>
          <RepeatIcon className={repeatMode === 'NO_REPEAT' ? 'icon-disabled' : 'icon-enabled'}
                      onClick={onToggleRepeat}/>
          <Shuffle className={'icon-disabled'}/>
          <a href={'https://youtu.be/' + videoInfo?.videoIds[0]} target={'_blank'}
             rel={'noopener noreferrer'}>
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
