import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Props) {
  return (
    <div id="main">
      <div className="container">
        {children}
        <hr />
      </div>
    </div>
  );
}
