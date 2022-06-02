import { Link } from '@remix-run/react';
import { ChevronRightIcon } from '@heroicons/react/solid';

const MobileHeader = () => {
  return (
    <header className='block md:hidden'>
      <Link to='/'>
        <h1 className='flex flex-row font-semibold text-gray-50 text-2xl p-4'>
          Billboardoo
          <ChevronRightIcon className='w-8' />
        </h1>
      </Link>
    </header>
  );
};

export default MobileHeader;