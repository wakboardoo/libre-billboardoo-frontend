import { classNames } from '@utils/classNames';
import type { ChangeEventHandler, HTMLProps } from 'react';

const SearchBox = (props: HTMLProps<HTMLInputElement>) => {
  return (
    <input
      {...props}
      type='search'
      name='search'
      placeholder='노래 제목 혹은 아티스트 이름'
      className={
        classNames(
          'w-full shadow-sm rounded-xl px-3 py-2',
          'bg-black text-white border-gray-400 focus:border-red-500 focus:ring-red-500',
        )}
    />
  );
};

export default SearchBox;