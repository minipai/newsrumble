import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArticlePage from "~/components/ArticlePage";
import { sql } from "~/db.server";

type SourceCount = {
  source: string;
  count: number;
};

async function getLoaderData() {
  const sourceCount = async (news: string) =>
    await sql<SourceCount[]>`
      SELECT source, count(source) 
      FROM ${sql(news)}
      WHERE source <> '' 
      GROUP BY source 
      ORDER BY count DESC 
    `;
  const honestNews = await sourceCount("honest_news");
  const goodNews = await sourceCount("good_news");

  return { honestNews, goodNews };
}

type LoaderData = {
  honestNews: SourceCount[];
  goodNews: SourceCount[];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(await getLoaderData());
};

export default function Contact() {
  const { honestNews, goodNews } = useLoaderData<LoaderData>();

  return (
    <ArticlePage
      header={
        <>
          <h1>感謝推薦</h1>
          <p className="meta">網友們的熱心 特別感謝</p>
        </>
      }
    >
      <div className="article">
        <p>
          我們的<b>正直新聞</b>與<b>優質新聞</b>
          全靠網友們的熱心推薦，在此特別感謝。
        </p>
        <h2>正直新聞</h2>
        <ul className="thanks">
          {honestNews.map((sourceCount, i) => (
            <li key={sourceCount.source}>
              <div className="box">
                <span className="name">{sourceCount.source}</span>：
                <span className="count ">{sourceCount.count}篇</span>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <h2>優質新聞</h2>
        <ul className="thanks">
          {goodNews.map((sourceCount, i) => (
            <li key={sourceCount.source}>
              <div className="box">
                <span className="name">{sourceCount.source}</span>：
                <span className="count ">{sourceCount.count}篇</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ArticlePage>
  );
}
