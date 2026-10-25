import { Request, Response } from 'express';
import Article from '../models/Article';
import Book from '../models/Book';
import Product from '../models/Product';
import Video from '../models/Video';

export const getMedia = async (_req: Request, res: Response) => {
  try {
    const [articles, books, products, videos] = await Promise.all([
      Article.find({ image: { $ne: '' } }).select('title image updatedAt'),
      Book.find({ coverImage: { $ne: '' } }).select('title coverImage updatedAt'),
      Product.find({}).select('name category image images updatedAt'),
      Video.find({ thumbnail: { $ne: '' } }).select('title thumbnail updatedAt'),
    ]);
    const brand = [
      { id: 'brand-logo', title: 'Isoko y’Ubworozi logo', url: process.env.BRAND_LOGO_URL || 'https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png', type: 'brand', source: 'Brand kit' },
      { id: 'brand-banner', title: 'Isoko y’Ubworozi banner', url: process.env.BRAND_BANNER_URL || 'https://res.cloudinary.com/dydg39ukk/image/upload/v1788949829/isoko-yubworozi-banner_txy0cd.png', type: 'brand', source: 'Brand kit' },
    ];
    res.json([
      ...brand,
      ...articles.map((item) => ({ id: `article-${item.id}`, title: item.title, url: item.image, type: 'image', source: 'Article', usageHref: `/admin/articles`, updatedAt: item.updatedAt })),
      ...books.map((item) => ({ id: `book-${item.id}`, title: item.title, url: item.coverImage, type: 'image', source: 'Book cover', usageHref: `/admin/books`, updatedAt: item.updatedAt })),
      ...products.flatMap((item) => {
        const images = item.images?.length ? item.images : [item.image];
        return images.filter(Boolean).map((url, index) => ({
          id: `product-${item.id}-${index}`,
          title: item.name?.rw || item.name?.en || 'Product image',
          url,
          type: 'image',
          source: `Eguriro · ${item.category}`,
          usageHref: `/admin/products#${item.id}`,
          updatedAt: item.updatedAt,
        }));
      }),
      ...videos.map((item) => ({ id: `video-${item.id}`, title: item.title, url: item.thumbnail, type: 'image', source: 'YouTube', usageHref: `/admin/videos`, updatedAt: item.updatedAt })),
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media library', error });
  }
};
