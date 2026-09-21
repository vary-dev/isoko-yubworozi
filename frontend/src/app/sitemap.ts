import type { MetadataRoute } from 'next';

type Article = { slug: string; updatedAt?: string };
type Book = { _id: string; updatedAt?: string };

const productionSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://isokoyubworozi.vercel.app';
const productionApiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/videos',
    '/blog',
    '/books',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((path, index) => ({
    url: `${productionSiteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }));

  try {
    const [articleResponse, bookResponse] = await Promise.all([
      fetch(`${productionApiUrl}/articles`, { next: { revalidate: 900 } }),
      fetch(`${productionApiUrl}/books`, { next: { revalidate: 900 } }),
    ]);
    const articles: Article[] = articleResponse.ok ? await articleResponse.json() : [];
    const books: Book[] = bookResponse.ok ? await bookResponse.json() : [];

    return [
      ...staticPages,
      ...articles.map((article) => ({
        url: `${productionSiteUrl}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      })),
      ...books.map((book) => ({
        url: `${productionSiteUrl}/books/${book._id}`,
        lastModified: book.updatedAt ? new Date(book.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticPages;
  }
}
