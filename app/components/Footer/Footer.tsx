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
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <a href="http://twitter.com/newsrumble">Twitter</a>
            </li>
            <li>
              <a href="http://www.facebook.com/pages/newsrumble">Facebook</a>
            </li>
            <li>
              <a href="http://blog.newsrumble.tw">Blog</a>（
              <a href="http://feeds.feedburner.com/newsrumble">RSS</a>）
            </li>
          </ul>
          <p className="copy">
            Copyleft 2011 News Rumble!, All Wrongs Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
