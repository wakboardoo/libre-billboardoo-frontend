import { createContext, useContext, useMemo } from 'react';

export interface MusicInfo {
  videoId: string;
  artist: string;
  title: string;
}

interface PlayList {
  getCurrentIndex(): number;
  getCurrentMusic(): MusicInfo;

  getPlayList(): MusicInfo[];

  addMusic(music: MusicInfo): void;
  removeMusic(music: MusicInfo): void;
  clearPlayList(): void;
  shuffle(): void;

  next(): void;
  previous(): void;
}

export const PlayListContext = createContext<{
  playList: MusicInfo[];
  setPlayList: (playList: MusicInfo[]) => void;
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
}>({ playList: [], setPlayList: () => {}, currentIndex: 0, setCurrentIndex: () => {} });

const usePlayList = (): PlayList => {
  const {
    playList,
    setPlayList,
    currentIndex,
    setCurrentIndex,
  } = useContext(PlayListContext);

  return useMemo(() => ({
    getCurrentIndex() {
      return currentIndex;
    },
    getCurrentMusic(): MusicInfo {
      return playList[currentIndex];
    },
    getPlayList(): MusicInfo[] {
      return playList;
    },
    addMusic(music: MusicInfo) {
      setPlayList([...playList, music]);
    },
    removeMusic(music: MusicInfo) {
      setPlayList(playList.filter(item => item.videoId !== music.videoId));
    },
    clearPlayList() {
      setPlayList([]);
    },
    shuffle() {
      const newPlayList = [...playList];
      for (let i = newPlayList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPlayList[i], newPlayList[j]] = [newPlayList[j], newPlayList[i]];
      }
      setPlayList(newPlayList);
    },
    next() {
      if (currentIndex < playList.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    previous() {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
  }), [currentIndex, playList, setCurrentIndex, setPlayList]);
};

export default usePlayList;
