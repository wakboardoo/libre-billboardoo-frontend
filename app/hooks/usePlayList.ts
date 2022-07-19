import { createContext, useContext, useMemo } from 'react';

export interface MusicInfo {
  videoId: string;
  artist: string;
  title: string;
}

interface PlayList {
  getCurrentIndex(): number;

  setCurrentIndex(index: number): void;

  getCurrentMusic(): MusicInfo;

  getPlayList(): MusicInfo[];

  addMusic(music: MusicInfo): void;

  removeMusic(music: MusicInfo): void;

  setPlayList(playList: MusicInfo[]): void;

  clearPlayList(): void;

  shuffle(): void;

  next(moveFirst?: boolean): void;

  previous(): void;
}

export const PlayListContext = createContext<{
  playList: MusicInfo[];
  setPlayList: (playList: MusicInfo[]) => void;
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
}>({
      playList: [], setPlayList: () => {
      }, currentIndex: 0, setCurrentIndex: () => {
      },
    });

const usePlayList = (): PlayList => {
  const ctx = useContext(PlayListContext);

  return useMemo(() => ({
    getCurrentIndex() {
      return ctx.currentIndex;
    },
    setCurrentIndex(index: number) {
      ctx.setCurrentIndex(index);
    },
    getCurrentMusic(): MusicInfo {
      return ctx.playList[ctx.currentIndex];
    },
    getPlayList(): MusicInfo[] {
      return ctx.playList;
    },
    setPlayList(list: MusicInfo[]) {
      ctx.setPlayList(list);
    },
    addMusic(music: MusicInfo) {
      ctx.setPlayList([...ctx.playList, music]);
    },
    removeMusic(music: MusicInfo) {
      ctx.setPlayList(ctx.playList.filter(item => item.videoId !== music.videoId));
    },
    clearPlayList() {
      ctx.setPlayList([]);
    },
    shuffle() {
      const newPlayList = [...ctx.playList];
      for (let i = newPlayList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (i === ctx.currentIndex || j === ctx.currentIndex) continue;
        [newPlayList[i], newPlayList[j]] = [newPlayList[j], newPlayList[i]];
      }
      ctx.setPlayList(newPlayList);
    },
    next(moveFirst) {
      if (ctx.currentIndex < ctx.playList.length - 1) {
        ctx.setCurrentIndex(ctx.currentIndex + 1);
      } else if (moveFirst) {
        ctx.setCurrentIndex(0);
      }
    },
    previous() {
      if (ctx.currentIndex > 0) {
        ctx.setCurrentIndex(ctx.currentIndex - 1);
      }
    },
  }), [ctx]);
};

export default usePlayList;
