import { Link } from "@remix-run/react";
import ArticlePage from "~/components/ArticlePage";

export default function Contact() {
  return (
    <ArticlePage
      header={
        <>
          <h1>提供新聞</h1>
          <p className="meta">有問必答 有信必回</p>
        </>
      }
    >
      <p>
        歡迎各位網友來信提供新聞，或是給本站建議，但是如果條件不符或是政治話題請恕無法刊登。
      </p>
      <p>來信請直接寄至 hello@newsrumble.tw，並請註明要匿名或是署名提供。</p>

      <hr />
      <div className="thanks">
        <p>
          我們的 <Link to="/honest_news">正直新聞</Link>{" "}
          全靠網友們的熱心推薦，在此特別感謝。
        </p>
      </div>

      <hr />
      <div className="thanks">
        <p>
          我們的 <Link to="/good_news">優質新聞</Link>{" "}
          全靠網友們的熱心推薦，在此特別感謝。
        </p>
      </div>
    </ArticlePage>
  );
}
