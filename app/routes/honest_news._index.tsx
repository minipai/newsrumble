import { Cache_Control } from "~/modules/response";

import { Link, useLocation } from "react-router";

import { useLoaderData } from "react-router";
import { db } from "~/db.server";
import { formatDate } from "~/modules/date";
import { mediaPrefix } from "~/modules/text";

type MediaCount = {
  media: string;
  count: number;
};

type HonestNews = {
  id: string;
  title: string;
  source: string;
  before_post_date: string;
  before_post_title: string;
  before_post_media: string;
  before_post_reporter: string;
  before_post_photographer: string;
  before_post_meta: string;
  before_post_content: string;
  after_post_date: string;
  after_post_title: string;
  after_post_media: string;
  after_post_reporter: string;
  after_post_photographer: string;
  after_post_meta: string;
  after_post_content: string;
};

function getLoaderData({ page, media }: { page: number; media: string }) {
  const mediaCounts = db
    .prepare(
      `SELECT media, count(1) as count
      FROM honest_news
      JOIN posts ON honest_news.before_id = posts.id
      GROUP BY posts.media
      ORDER BY count(1) DESC`
    )
    .all() as MediaCount[];

  const whereClause = media ? "WHERE posts.media = ?" : "";
  const params: any[] = media ? [media] : [];

  const honestNews = db
    .prepare(
      `SELECT
        honest_news.id,
        honest_news.title,
        honest_news.source,
        before_posts.date as before_post_date,
        before_posts.title as before_post_title,
        before_posts.media as before_post_media,
        before_posts.reporter as before_post_reporter,
        before_posts.photographer as before_post_photographer,
        before_posts.meta as before_post_meta,
        before_posts.content as before_post_content,
        after_posts.date as after_post_date,
        after_posts.title as after_post_title,
        after_posts.media as after_post_media,
        after_posts.reporter as after_post_reporter,
        after_posts.photographer as after_post_photographer,
        after_posts.meta as after_post_meta,
        after_posts.content as after_post_content
      FROM honest_news
      INNER JOIN (
        SELECT * FROM posts ${whereClause}
      ) before_posts ON honest_news.before_id = before_posts.id
      INNER JOIN (
        SELECT * FROM posts ${whereClause}
      ) after_posts ON honest_news.after_id = after_posts.id
      ORDER BY honest_news.id DESC
      LIMIT 10 OFFSET ?`
    )
    .all(...params, ...params, (page - 1) * 10) as HonestNews[];

  const countResult = db
    .prepare(
      `SELECT count(media) as count
      FROM honest_news
      JOIN (
        SELECT id, media FROM posts ${whereClause}
      ) posts ON posts.id = honest_news.before_id`
    )
    .get(...params) as { count: number };

  return { honestNews, count: countResult.count, media, mediaCounts, page };
}

type LoaderData = {
  honestNews: HonestNews[];
  count: number;
  media: string;
  mediaCounts: MediaCount[];
  page: number;
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const media = url.searchParams.get("media") ?? "";
  return getLoaderData({ page: parseInt(page), media });
};

export function headers() {
  return {
    "Cache-Control": Cache_Control,
  };
}

export default function Index() {
  const {
    media,
    mediaCounts,
    honestNews,
    count,
    page: currentPage,
  } = useLoaderData<LoaderData>();
  const location = useLocation();

  const searchQuery = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", `${page}`);
    return searchParams;
  };

  return (
    <div>
      <header className="page-header">
        <h1>{mediaPrefix(media)}正直新聞</h1>
        <p>台灣變好 新聞報導！</p>
      </header>
      <div className="grid-7-3">
        <section className="news-list">
          {honestNews.map((news) => (
            <div key={news.id} className="news">
              <h2>
                <Link to={`/honest_news/${news.id}`}>{news.title}</Link>
              </h2>
              <p className="news-excerpt">
                {formatDate(news.before_post_date)} ／ {news.before_post_media}{" "}
                ／ {news.before_post_title}
              </p>
              <p className="news-excerpt">
                {formatDate(news.after_post_date)} ／ {news.after_post_media} ／{" "}
                {news.after_post_title}
              </p>
              <p className="meta">{news.source ? `${news.source}推薦` : ""}</p>
            </div>
          ))}

          <nav className="pagination">
            {Array(Math.ceil(count / 10))
              .fill(0)
              .map((_, i) => i + 1)
              .map((p) => (
                <Link
                  key={p}
                  to={`/honest_news?${searchQuery(p).toString()}`}
                  className={currentPage === p ? "current" : ""}
                >
                  {p}
                </Link>
              ))}
          </nav>
        </section>
        <div className="page-sider">
          <p>
            馬總統英九先生上任後，台灣真的變好了。看看各大媒體報導，與阿扁貪腐執政時期這麼強烈的對比，我們相信投給馬英九先生是正確的選擇。
          </p>

          <h2>媒體</h2>
          <ul>
            {mediaCounts.map((mediaCount) => (
              <li key={mediaCount.media}>
                <Link to={`/honest_news?media=${mediaCount.media}`}>
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
