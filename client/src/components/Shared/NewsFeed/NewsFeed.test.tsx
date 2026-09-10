import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import { NewsFeed, NewsItem } from './NewsFeed';

const newsItem: NewsItem = {
  id: 'example',
  title: 'Example news',
  date: '2026-09-10',
  body: (
    <p>
      A <strong>formatted</strong> update with an{' '}
      <Link to="/downloads">internal link</Link> and an{' '}
      <a href="https://example.com">external link</a>.
    </p>
  ),
};

describe('NewsFeed', () => {
  test('renders semantic news content and TSX links', () => {
    render(
      <MemoryRouter>
        <NewsFeed items={[newsItem]} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Latest news' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Example news' })).toBeTruthy();
    expect(screen.getByText('formatted').tagName).toBe('STRONG');
    expect(
      screen.getByRole('link', { name: 'internal link' }).getAttribute('href')
    ).toBe('/downloads');
    expect(
      screen.getByRole('link', { name: 'external link' }).getAttribute('href')
    ).toBe('https://example.com');
    expect(
      screen.getByText('September 10, 2026').getAttribute('datetime')
    ).toBe('2026-09-10');
  });

  test('toggles older posts while keeping posts sorted newest-first', () => {
    const items: NewsItem[] = [
      { id: 'oldest', title: 'Oldest', date: '2026-09-07', body: null },
      { id: 'beta', title: 'Newest beta', date: '2026-09-10', body: null },
      { id: 'middle', title: 'Middle', date: '2026-09-09', body: null },
      { id: 'alpha', title: 'Newest alpha', date: '2026-09-10', body: null },
    ];

    render(
      <MemoryRouter>
        <NewsFeed items={items} />
      </MemoryRouter>
    );

    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Newest alpha', 'Newest beta', 'Middle']);

    const showOlderButton = screen.getByRole('button', {
      name: 'Show older news',
    });
    expect(showOlderButton.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(showOlderButton);

    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Newest alpha', 'Newest beta', 'Middle', 'Oldest']);

    const hideOlderButton = screen.getByRole('button', {
      name: 'Hide older news',
    });
    expect(hideOlderButton.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(hideOlderButton);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  test('renders nothing when there are no news items', () => {
    render(
      <MemoryRouter>
        <NewsFeed items={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('heading', { name: 'Latest news' })).toBeNull();
  });
});
