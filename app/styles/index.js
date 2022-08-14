import resetStyle from "./reset.css";
import baseStyle from "./base.css";
import typographyStyle from "./typography.css";
import pageStyle from "./page.css";
import newsStyle from "./news.css";
import layoutStyle from "./layout.css";

const styles = [
  resetStyle,
  baseStyle,
  typographyStyle,
  pageStyle,
  newsStyle,
  layoutStyle,
];

export const links = () =>
  styles.map((style) => ({
    rel: "stylesheet",
    href: style,
  }));
