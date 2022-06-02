import { Disclosure } from '@headlessui/react';
import { MenuIcon, TrendingUpIcon, XIcon } from '@heroicons/react/outline';
import { Link } from '@remix-run/react';
import { classNames } from '@utils/classNames';
import links from '@utils/links';

const MobileHeader = () => {
  return (
    <Disclosure as='header'>
      {({ open, close }) => (
        <>
          <div className='flex justify-between items-center p-4'>
            <Link to='/'>
              <h1 className='flex flex-row font-semibold text-gray-50 text-2xl'>
                Billboardoo
              </h1>
            </Link>
            <Disclosure.Button>
              {open ? (
                <XIcon className='text-gray-50 w-8 h-8' />
              ) : (
                <MenuIcon className='text-gray-50 w-8 h-8' />
              )}
            </Disclosure.Button>
          </div>
          <Disclosure.Panel className='bg-black absolute w-full'>
            <div className="pt-0 pb-4 px-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={classNames(
                    location.pathname.startsWith(link.href) ? 'text-red-500' : 'text-gray-300 hover:text-gray-50',
                    'flex items-center group font-light',
                    'text-xl tracking-tight',
                  )}
                  onClick={() => close()}
                >
                  <TrendingUpIcon
                    className={classNames(
                      location.pathname.startsWith(link.href) ? 'text-red-500' : 'text-gray-300 group-hover:text-gray-50',
                      'w-5 h-5 mr-2',
                    )}
                  />
                  {link.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default MobileHeader;