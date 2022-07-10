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
      href: "https://cdnjs.cloudflare.com/ajax/libs/unsemantic/1.2.3/unsemantic-grid-responsive.min.css",
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
        <Header />
        <Main>
          <Outlet />
        </Main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
