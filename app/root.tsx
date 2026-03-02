import type { MetaFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import Header, { links as headerLinks } from "~/components/Header/Header";
import Main, { links as mainLinks } from "~/components/Main/Main";
import Footer, { links as footerLinks } from "~/components/Footer/Footer";
import { links as stylesLinks } from "./styles/index.js";

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "News Rumble" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];

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
      </body>
    </html>
  );
}
