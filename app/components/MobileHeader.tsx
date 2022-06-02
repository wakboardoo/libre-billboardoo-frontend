import { Disclosure, Transition } from '@headlessui/react';
import { TrendingUpIcon } from '@heroicons/react/outline';
import Hamburger from 'hamburger-react';
import { Link } from '@remix-run/react';
import { classNames } from '@utils/classNames';
import links from '@utils/links';

const MobileHeader = () => {
  return (
    <Disclosure as='header'>
      {({ open, close }) => (
        <>
          <div className='flex justify-between items-center pl-4 pr-2 py-2'>
            <Link to='/'>
              <h1 className='flex flex-row font-semibold text-gray-50 text-2xl'>
                Billboardoo
              </h1>
            </Link>
            <Disclosure.Button>
              <Hamburger size={24} rounded color='white' toggled={open}/>
            </Disclosure.Button>
          </div>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
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
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default MobileHeader;