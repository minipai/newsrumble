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
      </div>
    </div>
  );
}
