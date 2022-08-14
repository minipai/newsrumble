import resetStyle from "./reset.css";
import baseStyle from "./base.css";
import articleStyle from "./article.css";
import pageStyle from "./page.css";
import newsStyle from "./news.css";
import layoutStyle from "./layout.css";
import gridStyle from "./grid.css";
import paginationStyle from "./pagination.css";

const styles = [
  resetStyle,
  baseStyle,
  articleStyle,
  pageStyle,
  newsStyle,
  layoutStyle,
  gridStyle,
  paginationStyle,
];

export const links = () =>
  styles.map((style) => ({
    rel: "stylesheet",
    href: style,
  }));
