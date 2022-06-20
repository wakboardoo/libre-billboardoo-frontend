import Aside from '@components/Aside';
import Footer from '@components/Footer';
import MobileHeader from '@components/MobileHeader';

import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DefaultLayout = ({ children }: React.PropsWithChildren<never>) => {
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  return (
    <>
      {!isMobile && <Aside />}
      {isMobile && <MobileHeader />}
      <main className='h-full md:w-5/6 overflow-y-auto relative'>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
