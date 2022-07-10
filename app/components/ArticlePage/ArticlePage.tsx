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
        <p>
          你可以從以下幾種來源獲得我們的最新消息。訊息同步，不過Twitter會比其他多一些廢話跟閒聊。
        </p>
        <ul>
          <li>
            <a href="http://blog.newsrumble.tw">Blog</a>
          </li>
          <li>
            <a href="http://twitter.com/newsrumble">Twitter</a>
          </li>
          <li>
            <a href="http://www.facebook.com/pages/News-Rumble/147660275258168">
              Facebook
            </a>
          </li>
        </ul>
        <br />
        <h2>徵求新聞</h2>
        <p>目前News Rumble專注在收集兩種新聞：</p>
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
