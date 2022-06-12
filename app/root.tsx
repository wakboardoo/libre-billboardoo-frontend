import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
} from '@remix-run/react';
import globalCss from '@styles/global.css';
import appCss from '@styles/app.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import React, { useState } from 'react';

dayjs.locale('ko');
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Billboardoo',
  viewport: 'width=device-width,initial-scale=1',
});
export const links: LinksFunction = () => {
  return [
    { rel: 'icon', href: '/icons/favicon.ico', type: 'image/png' },
    { rel: 'stylesheet', href: globalCss },
    { rel: 'stylesheet', href: appCss },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css',
      crossOrigin: 'anonymous',
    },
  ];
};

export default function App() {
  const location = useLocation();
  const matches = useMatches();

  const [isMount, setMount] = useState(true);
  React.useEffect(() => {
    const mounted = isMount;
    setMount(false);
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'REMIX_NAVIGATION',
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMIX_NAVIGATION',
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener('controllerchange', listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            'controllerchange',
            listener,
          );
        };
      }
    }
  }, [isMount, location, matches]);

  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="manifest" href="/resources/manifest.json" />
        <Meta />
        <Links />
        <title>Billboardoo</title>
      </head> 
      <body className="h-full bg-black flex flex-col md:flex-row">
         
        <Outlet /> <ScrollRestoration /> <Scripts /> <LiveReload /> 
      </body> 
    </html>
  );
}
