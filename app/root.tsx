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
import { links as stylesLinks } from "./styles";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "News Rumble",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [...stylesLinks(), ...headerLinks(), ...mainLinks(), ...footerLinks()];
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
