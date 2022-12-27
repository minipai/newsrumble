import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { micromark } from "micromark";
import { sql } from "~/db.server";
import { formatDate } from "~/modules/date";
import { Cache_Control, cacheControl } from "~/modules/response";

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
  before_highlight: string;
  formatedBeforePostContent: string;
  after_post_date: string;
  after_post_title: string;
  after_post_media: string;
  after_post_reporter: string;
  after_post_photographer: string;
  after_post_meta: string;
  after_post_content: string;
  after_highlight: string;
  formatedAfterPostContent: string;
};

async function getLoaderData({ id }: { id: string }) {
  const [honestNews] = await sql<HonestNews[]>`
      SELECT
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
        after_posts.content as after_post_content,
        honest_highlights.before as before_highlight,
        honest_highlights.after as after_highlight
      FROM honest_news
        INNER JOIN posts before_posts on honest_news.before_id = before_posts.id
        INNER JOIN posts after_posts on honest_news.after_id = after_posts.id
        INNER JOIN honest_highlights on honest_news.id = honest_highlights.news_id
      WHERE honest_news.id = ${id}
    `;

  honestNews.formatedBeforePostContent = micromark(
    honestNews.before_post_content
  ).replaceAll(
    new RegExp(
      `(${honestNews.before_highlight
        .split(/\r?\n/)
        .map((highlight) => `(${highlight})`)
        .join("|")})`,
      "gm"
    ),
    (text) => (text ? `<strong>${text}</strong>` : text)
  );
  honestNews.formatedAfterPostContent = micromark(
    honestNews.after_post_content
  ).replaceAll(
    new RegExp(
      `(${honestNews.after_highlight
        .split(/\r?\n/)
        .map((highlight) => (highlight ? `(${highlight})` : ""))
        .join("|")})`,
      "gm"
    ),
    (text) => (text ? `<strong>${text}</strong>` : text)
  );
  return honestNews;
}

export const loader: LoaderFunction = async ({ params }) => {
  return json(await getLoaderData({ id: params.news ?? "" }), cacheControl());
};

export function headers() {
  return {
    "Cache-Control": Cache_Control,
  };
}

export default function Show() {
  const honestNews = useLoaderData<HonestNews>();

  return (
    <article className="honest-news">
      <header className="page-header">
        <h1>{honestNews.title}</h1>
        <p className="news-meta">
          {honestNews.source ? `${honestNews.source}推薦` : ""}
        </p>
      </header>
      <div className="grid-5-5">
        <article className="news-before article">
          <h2>{honestNews.before_post_title}</h2>
          <cite>
            {[
              formatDate(honestNews.before_post_date),
              honestNews.before_post_media,
              honestNews.before_post_reporter,
              honestNews.before_post_photographer,
              honestNews.before_post_meta,
            ]
              .filter((i) => i)
              .join("／")}
          </cite>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: honestNews.formatedBeforePostContent,
            }}
          ></div>
        </article>

        <article className="news-after article">
          <h2>{honestNews.after_post_title}</h2>
          <cite>
            {[
              formatDate(honestNews.after_post_date),
              honestNews.after_post_media,
              honestNews.after_post_reporter,
              honestNews.after_post_photographer,
              honestNews.after_post_meta,
            ]
              .filter((i) => i)
              .join("／")}
          </cite>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: honestNews.formatedAfterPostContent,
            }}
          ></div>
        </article>
      </div>
    </article>
  );
}
