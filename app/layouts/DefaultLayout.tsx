import Aside from '@components/Aside';
import Footer from '@components/Footer';
import MobileHeader from '@components/MobileHeader';

import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import MusicPlayerBar from '@components/MusicPlayerBar';
import type { MusicInfo } from '~/hooks/usePlayList';
import { PlayListContext } from '~/hooks/usePlayList';

interface Props {
  children?: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playList, setPlayList] = useState<MusicInfo[]>([]);

  return (
    <>
      {!isMobile && <Aside/>}
      {isMobile && <MobileHeader/>}
      <main className='h-full md:w-5/6 overflow-y-auto relative'>
        <PlayListContext.Provider value={{
          playList,
          setPlayList,
          currentIndex,
          setCurrentIndex,
        }}>
          {children}
          {playList.length !== 0 && <MusicPlayerBar/>}
        </PlayListContext.Provider>
      </main>
      <Footer/>
    </>
  );
};

export default DefaultLayout;
