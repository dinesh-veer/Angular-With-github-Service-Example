import { PaginationLinks } from '../models/pagination.model';

export function parseLinkHeader(header: string | null | undefined): PaginationLinks {
  const links: PaginationLinks = {};
  if (!header) {
    return links;
  }

  const parts = header.split(',');
  for (const part of parts) {
    const section = part.split(';');
    if (section.length !== 2) {
      continue;
    }

    const urlMatch = section[0].match(/<(.+)>/);
    const relMatch = section[1].match(/rel="?([^"]+)"?/);

    if (urlMatch && relMatch) {
      const urlStr = urlMatch[1].trim();
      const rel = relMatch[1].trim();

      try {
        const url = new URL(urlStr);
        const pageParam = url.searchParams.get('page');
        if (pageParam) {
          const pageNum = parseInt(pageParam, 10);
          if (!isNaN(pageNum)) {
            if (rel === 'next') links.next = pageNum;
            else if (rel === 'prev') links.prev = pageNum;
            else if (rel === 'first') links.first = pageNum;
            else if (rel === 'last') links.last = pageNum;
          }
        }
      } catch {
        // Ignore malformed URL
      }
    }
  }

  return links;
}

