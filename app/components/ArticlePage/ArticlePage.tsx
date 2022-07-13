type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function ArticlePage({ header, children }: Props) {
  return (
    <article className="pages">
      <div className="grid-100">
        <header className="page-header">{header}</header>
      </div>
      <div className="content grid-70">{children}</div>
      <div className="sider grid-30">
        <h2>最新消息</h2>
        <p>本站已經進入封存狀態，不再更新內容。</p>
        <br />

        <h2>新聞分類</h2>
        <p>News Rumble專注在收集兩種新聞：</p>
        <ul>
          <li>
            <strong>正直新聞</strong>：報導馬上後政府施政表現良好的新聞
          </li>
          <li>
            <strong>優質新聞</strong>：報導馬英九總統優秀人格特質的新聞
          </li>
        </ul>
      </div>
      <div className="clear"></div>
    </article>
  );
}
