import { classNames } from '@utils/classNames';
import React from 'react';
import { Link } from '@remix-run/react';

interface Props {
  title: string
  buttons: React.ReactNode[]
}

const SmallHeader = ({ title, buttons }: Props, ref: React.ForwardedRef<HTMLElement>) => {
  return (
    <header
      ref={ref}
      className={classNames(
        'hidden sticky top-0 z-50 justify-between items-center px-4 py-2 md:px-14 lg:py-4',
        'bg-black/20 backdrop-blur-md',
      )}
    >
      <Link to='/'>
        <h1 className='text-gray-50 text-base md:text-2xl font-bold'>
          {title}
        </h1>
      </Link>
      <div className='flex gap-3'>{buttons}</div>
    </header>
  );
};

const forwardRefSmallHeader = React.forwardRef(SmallHeader);

export default forwardRefSmallHeader;
