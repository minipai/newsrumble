import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sql } from "~/db.server";
import { mediaPrefix } from "~/modules/text";

type MediaCount = {
  media: string;
  count: number;
};

async function getLoaderData() {
  const mediaCount = await sql<MediaCount[]>`
    SELECT media, count(1) 
    FROM good_news 
    JOIN posts on good_news.post_id = posts.id 
    GROUP BY posts.media
    ORDER BY count(1) DESC
  `;

  return mediaCount;
}

export const loader: LoaderFunction = async () => {
  return json<MediaCount[]>(await getLoaderData());
};

export default function Index() {
  const mediaCounts = useLoaderData<MediaCount[]>();
  const location = useLocation();
  const media = new URLSearchParams(location.search).get("media") ?? "";

  return (
    <div>
      <header className="page-header">
        <h1>{mediaPrefix(media)}優質新聞</h1>
        <p>讓人幸福的好新聞～</p>
      </header>
      <div className="grid-7-3">
        <section className="news-list">
          <Outlet />
        </section>
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
