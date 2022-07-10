import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Props) {
  return (
    <div id="main">
      <div className="container grid-container">
        {children}
        <div className="grid-100">
          <hr />
        </div>
        <section id="updates">
          <div className="latest-honet grid-50">
            <h2>
              正直新聞 <small>最新5則</small>
            </h2>
            <ul></ul>
          </div>
          <div className="latest-good grid-50">
            <h2>
              優質新聞 <small>最新5則</small>
            </h2>
            <ul></ul>
          </div>
          <div className="clear"></div>
        </section>
      </div>
    </div>
  );
}
