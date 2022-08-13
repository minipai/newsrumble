import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { Header, Main, Footer } from "~/components";
import { links as headerLinks } from "~/components/Header";
import { links as mainLinks } from "~/components/Main";
import { links as footerLinks } from "~/components/Footer";
import baseStyle from "./styles/base.css";
import typographyStyle from "./styles/typography.css";
import pageStyle from "./styles/page.css";
import newsStyle from "./styles/news.css";
import layoutStyle from "./styles/layout.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "News Rumble",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: baseStyle,
    },
    {
      rel: "stylesheet",
      href: typographyStyle,
    },
    {
      rel: "stylesheet",
      href: pageStyle,
    },
    {
      rel: "stylesheet",
      href: newsStyle,
    },
    {
      rel: "stylesheet",
      href: layoutStyle,
    },
    ...headerLinks(),
    ...mainLinks(),
    ...footerLinks(),
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="site-layout">
          <Header />
          <Main>
            <Outlet />
          </Main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
