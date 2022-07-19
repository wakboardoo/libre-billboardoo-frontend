import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { YouTubeEvent } from 'react-youtube';
import YouTube from 'react-youtube';
import usePlayList from '~/hooks/usePlayList';
import { Virtuoso } from 'react-virtuoso';


interface Props {
  isOpen: boolean;
  videoId: string;
  onReady: (event: YouTubeEvent) => void;
  onEnd: (event: YouTubeEvent) => void;
  onPlay: (event: YouTubeEvent) => void;
  onPause: (event: YouTubeEvent) => void;
}

const opts = {
  // height: '',
  // width: '0',
  playerVars: {
    autoplay: 0,
    controls: 0,
  },
};

const PlayerPage: React.FC<Props> = ({
  isOpen, videoId,
  onReady, onEnd, onPlay, onPause,
}) => {
  const playlist = usePlayList();
  const playlistData = useMemo(() => playlist.getPlayList(), [playlist]);

  useEffect(() => {
    console.log(playlistData);
  }, [playlistData]);

  return (
    <motion.div
      initial={{ top: '100%' }}
      animate={{ top: isOpen ? '0%' : '100%' }}
      className={'fixed left-0 flex flex-row justify-center items-center bg-black bg-opacity-90 w-full h-full z-10'}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onEnd={onEnd}
        onPlay={onPlay}
        onPause={onPause}
      />
      <Virtuoso
        style={{ height: '70%', width: '40%', marginLeft: 48 }}
        data={playlistData}
        itemContent={(index, item) => {
          const isCurrent = index === playlist.getCurrentIndex();

          const onClick = () => {
            playlist.setCurrentIndex(index);
          };

          return (
            <div key={item.videoId}
                 onClick={onClick}
                 style={{ borderBottom: '1px solid rgb(107 114 128)' }}
                 className={'flex flex-row items-center h-16 border-b-gray-500 cursor-pointer '
                   + (isCurrent ? 'bg-gray-800 bg-opacity-70' : 'hover:bg-gray-800 hover:bg-opacity-70')}>
              <div className={'flex justify-center items-center h-10 aspect-square ml-4'}>
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
            </div>
          );
        }}>

      </Virtuoso>
    </motion.div>
  );
};

export default PlayerPage;
