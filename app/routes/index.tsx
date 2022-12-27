import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sql } from "~/db.server";
import { formatDate } from "~/modules/date";
import { Cache_Control, cacheControl } from "~/modules/response";

type HonestNews = {
  id: number;
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

async function getLoaderData() {
  const honestNews = await sql<HonestNews[]>`
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
      after_posts.content as after_post_content	
    FROM honest_news
    INNER JOIN (
      select *
      from posts
    ) before_posts on honest_news.before_id = before_posts.id
    INNER JOIN (
      select *
      from posts
    ) after_posts on honest_news.after_id = after_posts.id
    WHERE honest_news.id IN (121, 118, 117, 114, 105, 102, 99, 96, 88, 85, 78, 72, 61, 53, 47, 38, 15, 10, 8, 3)
    ORDER BY honest_news.id DESC
  `;

  return { honestNews };
}

type LoaderData = {
  honestNews: HonestNews[];
};

export const loader: LoaderFunction = async ({ request }) => {
  return json(await getLoaderData(), cacheControl());
};

export function headers() {
  return {
    "Cache-Control": Cache_Control,
  };
}

export default function Index() {
  const { honestNews } = useLoaderData<LoaderData>();
  const stars = [3, 10, 85, 102, 105];
  return (
    <div className="grid-5-5 news-cards">
      {honestNews.map((news) => (
        <div
          key={news.id}
          className={`news-card ${stars.includes(news.id) ? "star" : ""}`}
        >
          <a href={`/honest_news/${news.id}`}>
            <header>{news.before_post_media}</header>
            <div>
              <p>
                <b>{formatDate(news.before_post_date)}</b>／
                <span>{news.before_post_title}</span>
              </p>
              <p>
                <b>{formatDate(news.after_post_date)}</b>／
                <span>{news.after_post_title}</span>
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
