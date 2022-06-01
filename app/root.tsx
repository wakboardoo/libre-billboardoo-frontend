import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import globalCss from '@styles/global.css';
import appCss from '@styles/app.css';
import pretendardCss from 'node_modules/pretendard/dist/web/static/pretendard.css';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Billboardoo',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalCss },
    { rel: 'stylesheet', href: appCss },
    { rel: 'stylesheet', href: pretendardCss },
  ];
};

export default function App() {
  return (
    <html lang='ko' className='h-full'>
      <head>
        <Meta />
        <Links />
        <title>Billboardoo</title>
      </head>
      <body className='h-full bg-black flex'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
