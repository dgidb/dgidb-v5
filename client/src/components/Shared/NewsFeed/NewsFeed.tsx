import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import './NewsFeed.scss';
import { Box } from '@mui/material';
import { ExternalLink } from '../common/ExternalLink';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  body: React.ReactNode;
}

interface NewsFeedProps {
  items?: NewsItem[];
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const newsItems: NewsItem[] = [
  {
    id: '5-0-13-released',
    title: 'DGIdb 5.0.13 released',
    date: '2026-09-12',
    body: (
      <>
        <p>
          Version 5.0.13 of DGIdb is now live, introducing three new interaction
          sources (MOAlmanac, Drug Repurposing Hub, and PRISM Repurposing Study)
          and adding a number of internal maintenance fixes. A new data release
          (<code>2026-09</code>) is also included, and can be accessed on the{' '}
          <Link to="/downloads">Downloads</Link> page.
        </p>
      </>
    ),
  },

  {
    id: 'mcp-paper-published',
    title: 'DGIdb MCP manuscript published',
    date: '2026-08-26',
    body: (
      <>
        <p>
          Our manuscript describing our Model Context Protocol (MCP) server for
          DGIdb is now{' '}
          <ExternalLink href="https://academic.oup.com/bioinformatics/article/42/9/btag632/8768654#573833832">
            published at Bioinformatics
          </ExternalLink>
          ! We introduce the server and describe example pipelines for drug
          candidate selection and gene targeting evidence retrieval.
        </p>
        <p>
          See the{' '}
          <ExternalLink href="https://github.com/dgidb/dgidb-mcp-server">
            GitHub repository
          </ExternalLink>{' '}
          for instructional material on how to plug DGIdb into your own
          artificial intelligence workflows.
        </p>
      </>
    ),
  },
];

export const NewsFeed: React.FC<NewsFeedProps> = ({ items = newsItems }) => {
  const [showAllNews, setShowAllNews] = useState(false);
  const sortedNewsItems = [...items].sort(
    (left, right) =>
      right.date.localeCompare(left.date) || left.id.localeCompare(right.id)
  );
  const hasOlderNews = sortedNewsItems.length > 3;
  const visibleNewsItems = showAllNews
    ? sortedNewsItems
    : sortedNewsItems.slice(0, 3);

  if (visibleNewsItems.length === 0) {
    return null;
  }

  return (
    <section className="news-feed" aria-labelledby="news-feed-heading">
      <h2 id="news-feed-heading">Latest news</h2>
      <div id="news-feed-items">
        {visibleNewsItems.map((item) => (
          <article className="news-item" key={item.id}>
            <Box>
              <h3>{item.title}</h3>
              <time dateTime={item.date}>
                {dateFormatter.format(new Date(`${item.date}T00:00:00Z`))}
              </time>
            </Box>
            <div className="news-item-body">{item.body}</div>
          </article>
        ))}
      </div>
      {hasOlderNews && (
        <Button
          className="news-feed-toggle"
          variant="outlined"
          aria-controls="news-feed-items"
          aria-expanded={showAllNews}
          onClick={() => setShowAllNews((isShowingAll) => !isShowingAll)}
        >
          {showAllNews ? 'Hide older news' : 'Show older news'}
        </Button>
      )}
    </section>
  );
};
