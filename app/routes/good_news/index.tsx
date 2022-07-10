import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { truncate } from "lodash";
import { sql } from "~/db.server";

type GoodNews = {
  id: string;
  title: string;
  content: string;
  source: string;
};

async function getLoaderData({ page, media }: { page: number; media: string }) {
  const whereMedia = (media: string) =>
    media ? sql`WHERE posts.media = ${media}` : sql``;
  const goodNews = await sql<GoodNews[]>`
    SELECT
      good_news.id,
      good_news.title,
      good_news.source,
      posts.content
    FROM good_news 
    JOIN posts ON good_news.post_id = posts.id 
    ${whereMedia(media)}
    ORDER BY good_news.id DESC
    LIMIT 10 OFFSET ${(page - 1) * 10}
  `;
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT count(media) from good_news 
      JOIN (
        SELECT id, media
        FROM posts
        ${whereMedia(media)}
      ) posts 
      ON posts.id = good_news.post_id
  `;
  return { goodNews, count, page, media };
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const media = url.searchParams.get("media") ?? "";
  return json(await getLoaderData({ page: parseInt(page), media }));
};

export default function Index() {
  const {
    goodNews,
    count,
    page: currentPage,
  } = useLoaderData<{
    goodNews: GoodNews[];
    count: number;
    page: number;
  }>();
  const location = useLocation();

  const searchQuery = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", `${page}`);
    return searchParams;
  };

  return (
    <div>
      {goodNews.map((news) => (
        <div key={news.id} className="news">
          <h2>
            <Link to={`/good_news/${news.id}`}>{news.title}</Link>
          </h2>
          <p className="excerpt">
            {truncate(news.content ?? "", { length: 100 })}
          </p>
          <p className="meta">{news.source && `${news.source}推薦`}</p>
        </div>
      ))}

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
  );
}
