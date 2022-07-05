import { useContext, createContext } from 'react';

const CurrentVideoContext = createContext<string | undefined>(undefined);

const useCurrentVideo = () => {
  return useContext(CurrentVideoContext);
};

export const CurrentVideoProvider = CurrentVideoContext.Provider;
export default useCurrentVideo;
