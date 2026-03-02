import resetStyle from "./reset.css?url";
import baseStyle from "./base.css?url";
import articleStyle from "./article.css?url";
import pageStyle from "./page.css?url";
import newsStyle from "./news.css?url";
import layoutStyle from "./layout.css?url";
import gridStyle from "./grid.css?url";
import paginationStyle from "./pagination.css?url";

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
