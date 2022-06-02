import Aside from '@components/Aside';
import Footer from '@components/Footer';
import MobileHeader from '@components/MobileHeader';

import React from 'react';

interface Props {
  children?: React.ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <>
      <Aside />
      <main className='h-full md:w-5/6 overflow-y-auto'>
        <MobileHeader />
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
