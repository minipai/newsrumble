import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { micromark } from "micromark";
import { sql } from "~/db.server";
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

async function getLoaderData({ id }: { id: string }) {
  const [goodNews] = await sql<GoodNews[]>`
      SELECT
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
      WHERE good_news.id = ${id}
    `;
  goodNews.formatedContent = micromark(goodNews.content);
  return goodNews;
}

export const loader: LoaderFunction = async ({ params }) => {
  return json(await getLoaderData({ id: params.news ?? "" }));
};

export default function Show() {
  const goodNews = useLoaderData<GoodNews>();

  return (
    <article className="article honest-news">
      <header className="page-header">
        <h1>{goodNews.title}</h1>
        <p className="new-meta"></p>
      </header>
      <div className="post">
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
      </div>
    </article>
  );
}
