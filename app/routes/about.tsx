import ArticlePage from "~/components/ArticlePage";

export default function About() {
  return (
    <ArticlePage
      header={
        <>
          <h1>關於本站</h1>
          <p className="meta">台灣變好 新聞報導！</p>
        </>
      }
    >
      <article className="article">
        <h2>架站緣起</h2>

        <p>
          一開始，網友mattel是在PTT上發表馬上前後新聞對照的文章。mattel發表的對照都非常好笑，可惜只能在PTT站內看到，所以News
          Rumble成立了，以左右並列的排版來呈現mattel的新聞對照，讓更多人能看到這麼有趣的笑話。後來，許多網友也將發現到的好笑新聞對照投稿給我們，眾多網友的貢獻慢慢形成了現在的內容。
        </p>

        <p>
          News
          Rumble的新聞為什麼好笑？楊照〈好笑的官式腦袋〉一文，裡面提到發生在南非的事情真是最好的解釋：
        </p>

        <blockquote>
          <p>
            那個時代，南非知名的喜劇演員Uys最常幹的事，就是在舞台上正經八百唸這些政府官方文件。完全不需添加任何其他內容，光是唸白人、黑人、中國人、印度人變來變去，就夠讓台下觀眾笑得人仰馬翻，Uys還會模仿政府官員的神態，故意大惑不解的問：「你們笑什麼呢？」台下觀眾笑得更厲害，幾乎連眼淚都快激出來了。
          </p>
          <p>
            <cite>楊照，〈好笑的官式腦袋〉</cite>
          </p>
        </blockquote>

        <p>
          News
          Rumble不也是幹一樣的事情？只要把新聞全文照登，就是一篇篇的笑話了（還是有上點色就是了），有的甚至不用對照，就是超好笑的笑話了。
        </p>
      </article>
    </ArticlePage>
  );
}
