import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Article {
  title: string;
  slug: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

const api =
  process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';
const site =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://isokoyubworozi.vercel.app';

const plain = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function getArticle(slug: string) {
  try {
    const response = await fetch(
      `${api}/articles/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;
    return response.json() as Promise<Article>;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article not found' };

  const description = plain(article.content).slice(0, 160);
  return {
    title: article.title,
    description,
    keywords: [
      article.title,
      article.category,
      "ubworozi bw'inkoko",
      'poultry farming',
      'élevage de poulets',
      "ubuzima bw'inkoko",
    ],
    alternates: { canonical: `${site}/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      url: `${site}/blog/${article.slug}`,
      title: article.title,
      description,
      images: [article.image],
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const articleUrl = `${site}/blog/${article.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: plain(article.content).slice(0, 200),
    image: [article.image],
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: "Isoko y'Ubworozi",
      url: site,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    url: articleUrl,
    inLanguage: 'rw',
  };

  return (
    <main id="main-content">
      <Navbar />
      <article className="bg-white pb-20 pt-32">
        <div className="mx-auto max-w-3xl px-5">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-isoko-primary"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            Back to articles
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-isoko-light px-3 py-1 font-extrabold text-isoko-primary">
              {article.category}
            </span>
            <time className="text-slate-500">
              {new Date(article.createdAt).toLocaleDateString('rw-RW', {
                dateStyle: 'long',
              })}
            </time>
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-isoko-dark sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            By <strong className="text-isoko-primary">{article.author}</strong>
          </p>
          {article.image && (
            <div className="relative mt-9 aspect-[16/9] overflow-hidden rounded-2xl bg-isoko-light">
              <Image
                fill
                priority
                sizes="(max-width:768px) 100vw,768px"
                src={article.image}
                alt={article.title}
                className="object-cover"
              />
            </div>
          )}
          <div
            className="article-content mt-10 text-base leading-8 text-slate-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Footer />
    </main>
  );
}
