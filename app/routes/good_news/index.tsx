import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { truncate } from "lodash";
import { db } from "~/db.server";
import { mediaPrefix } from "~/modules/text";
import { Cache_Control, cacheControl } from "~/modules/response";

type GoodNews = {
  id: string;
  title: string;
  content: string;
  source: string;
};
type MediaCount = {
  media: string;
  count: number;
};

function getLoaderData({ page, media }: { page: number; media: string }) {
  const whereClause = media ? "WHERE posts.media = ?" : "";
  const params: any[] = media ? [media] : [];

  const goodNews = db
    .prepare(
      `SELECT
        good_news.id,
        good_news.title,
        good_news.source,
        posts.content
      FROM good_news
      JOIN posts ON good_news.post_id = posts.id
      ${whereClause}
      ORDER BY good_news.id DESC
      LIMIT 10 OFFSET ?`
    )
    .all(...params, (page - 1) * 10) as GoodNews[];

  const countResult = db
    .prepare(
      `SELECT count(media) as count FROM good_news
      JOIN (
        SELECT id, media FROM posts ${whereClause}
      ) posts ON posts.id = good_news.post_id`
    )
    .get(...params) as { count: number };

  const mediaCounts = db
    .prepare(
      `SELECT media, count(1) as count
      FROM good_news
      JOIN posts ON good_news.post_id = posts.id
      GROUP BY posts.media
      ORDER BY count(1) DESC`
    )
    .all() as MediaCount[];

  return { goodNews, count: countResult.count, page, media, mediaCounts };
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const media = url.searchParams.get("media") ?? "";
  return json(
    getLoaderData({ page: parseInt(page), media }),
    cacheControl()
  );
};

export function headers() {
  return {
    "Cache-Control": Cache_Control,
  };
}

export default function Index() {
  const {
    goodNews,
    count,
    page: currentPage,
    media,
    mediaCounts,
  } = useLoaderData<{
    goodNews: GoodNews[];
    count: number;
    page: number;
    media: string;
    mediaCounts: MediaCount[];
  }>();
  const location = useLocation();

  const searchQuery = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", `${page}`);
    return searchParams;
  };

  return (
    <div>
      <header className="page-header">
        <h1>{mediaPrefix(media)}優質新聞</h1>
        <p>讓人幸福的好新聞～</p>
      </header>
      <div className="grid-7-3">
        <div>
          <section className="news-list">
            {goodNews.map((news) => (
              <div key={news.id} className="news">
                <h2>
                  <Link to={`/good_news/${news.id}`}>{news.title}</Link>
                </h2>
                <p className="news-excerpt">
                  {truncate(news.content ?? "", { length: 100 })}
                </p>
                <p className="news-meta">
                  {news.source && `${news.source}推薦`}
                </p>
              </div>
            ))}
          </section>
          <nav className="pagination">
            {Array(Math.ceil(count / 10))
              .fill(0)
              .map((_, i) => i + 1)
              .map((p) => (
                <Link
                  key={p}
                  to={`/good_news?${searchQuery(p).toString()}`}
                  className={currentPage === p ? "current" : ""}
                >
                  {p}
                </Link>
              ))}
          </nav>
        </div>

        <div className="page-sider">
          <p>
            中華民國第12任總統馬英九於97年5月20日就職，參選期間以「振興臺灣經濟、找回核心價值」為訴求，獲得廣大選民迴響，終以765萬張選票（得票率58.5％）贏得總統選舉，促成臺灣二次政黨輪替。
          </p>
          <p>～中華民國總統府</p>

          <h2>媒體</h2>
          <ul>
            {mediaCounts.map((mediaCount) => (
              <li key={mediaCount.media}>
                <Link to={`/good_news?media=${mediaCount.media}`}>
                  {mediaCount.media}（{mediaCount.count}）
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
