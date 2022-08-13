import { Link } from "@remix-run/react";

import styles from "./styles.css";
import logo from "./logo.png";

export const links = () => [{ rel: "stylesheet", href: styles }];

export default function Header() {
  return (
    <header id="header">
      <h1>
        <a href="/">
          <img src={logo} alt="正直好新聞" />
        </a>
      </h1>
      <nav>
        <ul id="menu">
          <li>
            <Link to="/honest_news">正直新聞</Link>
          </li>
          <li>
            <Link to="/good_news">優質新聞</Link>
          </li>
          <li>
            <Link to="/thanks">感謝推薦</Link>
          </li>
          <li>
            <Link to="/about">關於本站</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
