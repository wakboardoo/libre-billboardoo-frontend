import DefaultLayout from '@layouts/DefaultLayout';
import { Outlet } from '@remix-run/react';
import { motion } from 'framer-motion';


const RankParent = () => {
  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='h-full'
      >
        <Outlet />
      </motion.div>
    </DefaultLayout>
  );
};

export default RankParent;
