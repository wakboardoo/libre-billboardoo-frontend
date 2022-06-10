import { TrendingUpIcon } from '@heroicons/react/outline';
import { Link, useLocation } from '@remix-run/react';
import { classNames } from '@utils/classNames';
import links from '@utils/links';

const Aside = () => {
  const location = useLocation();

  return (
    <aside className='block w-1/5 lg:w-1/6 h-full bg-neutral-900 bg-opacity-60 overflow-y-auto z-100'>
      <div className='flex flex-col gap-5 p-5'>
        <Link to='/'>
          <h1 className='font-semibold text-gray-50 text-2xl'>Billboardoo</h1>
        </Link>
        <span className='h-px w-full bg-neutral-600' aria-hidden='true'/>
        <ul className='space-y-3'>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={classNames(
                  location.pathname.startsWith(link.href) ? 'text-red-500' : 'text-gray-300 hover:text-gray-50',
                  'flex items-center group font-light',
                  'md:text-lg lg:text-xl tracking-tight',
                )}
              >
                <TrendingUpIcon
                  className={classNames(
                    location.pathname.startsWith(link.href) ? 'text-red-500' : 'text-gray-300 group-hover:text-gray-50',
                    'w-5 h-5 mr-2',
                  )}
                />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
