import { Link } from "@remix-run/react";

import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container grid-container">
        <div className="grid-100">
          <ul className="foot-links">
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
          <p className="copy">
            Copyleft {new Date().getFullYear()} News Rumble!, All Wrongs
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
