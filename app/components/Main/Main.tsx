import styles from "./styles.css?url";

export const links = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Props) {
  return <div id="main">{children}</div>;
}
