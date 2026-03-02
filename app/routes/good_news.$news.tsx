import { Cache_Control } from "~/modules/response";


import { useLoaderData } from "react-router";
import { micromark } from "micromark";
import { db } from "~/db.server";
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

function getLoaderData({ id }: { id: string }) {
  const goodNews = db
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
    .get(id) as GoodNews;
  goodNews.formatedContent = micromark(goodNews.content);
  return goodNews;
}

export const loader = async ({ params }) => {
  return getLoaderData({ id: params.news ?? "" });
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
