import type { Dayjs } from 'dayjs';

interface Props {
  title: string
  updateDate: Dayjs
}

const RankHeader = ({ title, updateDate }: Props) => {
  return (
    <>
      <h1 className='text-gray-50 text-4xl font-bold'>{title}</h1>
      <p className='text-gray-400 text-lg'>{updateDate.format('M월 D일 a h시')} 업데이트</p>
    </>
  );
};

export default RankHeader;