import { Cache_Control } from "~/modules/response";


import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { renderNewsContent } from "~/modules/news.server";
import { formatDate } from "~/modules/date";

type GoodNews = {
  id: string;
  title: string;
  content: string;
  formatedContent: string;
  source: string;
  post_title: string;
  media: string;
  date: string;
  reporter: string;
  photographer: string;
  meta: string;
};

async function getLoaderData(db: D1Database, { id }: { id: string }) {
  const goodNews = await db
    .prepare(
      `SELECT
        good_news.id,
        good_news.title,
        good_news.source,
        posts.title as post_title,
        posts.content,
        posts.media,
        posts.date,
        posts.reporter,
        posts.photographer,
        posts.meta
      FROM good_news
      JOIN posts ON good_news.post_id = posts.id
      WHERE good_news.id = ?`
    )
    .bind(id)
    .first<GoodNews>();
  if (!goodNews) throw new Response("Not Found", { status: 404 });
  goodNews.formatedContent = renderNewsContent(goodNews.content);
  return goodNews;
}

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  return getLoaderData(context.cloudflare.env.DB, { id: params.news ?? "" });
};

export function headers() {
  return {
    "Cache-Control": Cache_Control,
  };
}

export default function Show() {
  const goodNews = useLoaderData<GoodNews>();

  return (
    <article className="article good-news">
      <header className="page-header">
        <h1>{goodNews.title}</h1>
        <p className="new-meta"></p>
      </header>
      <article>
        <h2>{goodNews.post_title}</h2>
        <cite>
          {[
            formatDate(goodNews.date),
            goodNews.media,
            goodNews.reporter,
            goodNews.photographer,
            goodNews.meta,
          ]
            .filter((i) => i)
            .join("／")}
        </cite>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: goodNews.formatedContent }}
        ></div>
      </article>
    </article>
  );
}
