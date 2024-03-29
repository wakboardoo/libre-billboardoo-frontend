import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { YouTubeEvent } from 'react-youtube';
import YouTube from 'react-youtube';
import type { MusicInfo } from '~/hooks/usePlayList';
import usePlayList from '~/hooks/usePlayList';
import { Virtuoso } from 'react-virtuoso';
import { PlaylistRemove } from '@mui/icons-material';
import { useMediaQuery } from 'react-responsive';

interface ItemProps {
  item: MusicInfo;
  selected: boolean;
  onClick: () => void;
  onRemove: () => void;
}

const PlayListItem: React.FC<ItemProps> = ({ item, selected, onClick, onRemove }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const [isHover, setHover] = useState(false);

  const showRemove = useMemo(() => isMobile || isHover, [isMobile, isHover]);

  return (
    <div key={item.videoId}
         onClick={onClick}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
         style={{ borderBottom: '1px solid rgb(107 114 128)' }}
         className={'flex flex-row items-center h-16 border-b-gray-500 cursor-pointer px-4 '
           + (selected || isHover ? 'bg-gray-800 bg-opacity-70' : 'hover:bg-gray-800 hover:bg-opacity-70')}>
      <div className={'flex justify-center items-center h-10 aspect-square'}>
        <img
          src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
          alt={`${item.artist} ${item.title} 썸네일`}
          loading={'lazy'}
          decoding={'async'}
          className={'object-cover object-center h-10 aspect-square'}
        />
      </div>
      <div className={'flex-1 flex flex-col justify-center items-start ml-3'}>
        <p className={'text-white text-sm'}>{item.title}</p>
        <span className={'text-gray-400 text-xs text-center'}>{item.artist}</span>
      </div>
      {showRemove ? (
        <div className={'flex flex-row items-center justify-around'}>
          <PlaylistRemove data-value="remove" className={'icon-enabled w-6'} onClick={(event) => {
            onRemove();
            event.stopPropagation();
          }}/>
        </div>
      ) : null}
    </div>
  );
};

interface Props {
  isOpen: boolean;
  videoId: string;
  onReady: (event: YouTubeEvent) => void;
  onEnd: (event: YouTubeEvent) => void;
  onPlay: (event: YouTubeEvent) => void;
  onPause: (event: YouTubeEvent) => void;
  onClick: (event: React.MouseEvent) => void;
}

const PlayerPage: React.FC<Props> = ({
  isOpen, videoId,
  onReady, onEnd, onPlay, onPause, onClick,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const playlist = usePlayList();
  const playlistData = useMemo(() => playlist.getPlayList(), [playlist]);

  const innerWidth = window.innerWidth;

  const opts = {
    height: isMobile ? innerWidth * 0.5625 : 360,
    width: isMobile ? innerWidth : 640,
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  const stopPropagation = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <motion.div
      onClick={onClick}
      initial={{ top: '100%' }}
      animate={{ top: isOpen ? '0%' : '100%' }}
      className={
        'flex fixed left-0 bg-black bg-opacity-90 w-full h-full z-50 ' +
        (isMobile ? 'flex-col' : 'flex-row justify-center items-center')}>
      <div
        onClick={stopPropagation}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onEnd={onEnd}
          onPlay={onPlay}
          onPause={onPause}
        />
      </div>
      <div
        style={
          isMobile ? { width: '100%', height: `calc(100% - ${opts.height}px - 5rem)` } : { height: '70%', width: '40%', marginLeft: 48 }
        }
        onClick={stopPropagation}>
        <Virtuoso
          style={{ height: '100%', width: '100%' }}
          data={playlistData}
          itemContent={(index, item) => {
            const isCurrent = index === playlist.getCurrentIndex();

            return (
              <PlayListItem
                item={item}
                selected={isCurrent}
                onClick={() => playlist.setCurrentIndex(index)}
                onRemove={() => playlist.removeMusic(item)}
              />
            );
          }}>

        </Virtuoso>
      </div>
    </motion.div>
  );
};

export default PlayerPage;
