import Aside from '@components/Aside';
import Footer from '@components/Footer';
import MobileHeader from '@components/MobileHeader';

import React from 'react';
import { useMediaQuery } from 'react-responsive';

interface Props {
  children?: React.ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  return (
    <>
      {!isMobile && <Aside />}
      {isMobile && <MobileHeader />}
      <main className='flex-1 h-full md:w-5/6 overflow-y-auto'>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
