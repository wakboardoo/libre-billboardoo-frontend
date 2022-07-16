import { useContext, createContext } from 'react';
import type { Ranking } from '@utils/types';

const CurrentVideoContext = createContext<Ranking | undefined>(undefined);

const useCurrentVideo = () => {
  return useContext(CurrentVideoContext);
};

export const CurrentVideoProvider = CurrentVideoContext.Provider;
export default useCurrentVideo;
