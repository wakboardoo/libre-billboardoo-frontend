import { classNames } from '@utils/classNames';
import type { ChangeEventHandler } from 'react';

interface Props {
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const SearchBox = ({ onChange }: Props) => {
  return (
    <input
      type='search'
      name='search'
      onChange={onChange}
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