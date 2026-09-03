import { Product, Collection, Banner, Showroom, Review } from '../../types';
import {
  MOCK_PRODUCTS,
  MOCK_COLLECTIONS,
  MOCK_BANNERS,
  MOCK_SHOWROOMS,
  MOCK_REVIEWS,
} from '../mock/data';

export interface ProductFilterOptions {
  category?: string;
  query?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'popular' | 'price_low' | 'price_high' | 'newest';
}

export class ProductService {
  async getProducts(options?: ProductFilterOptions): Promise<Product[]> {
    let items = [...MOCK_PRODUCTS];

    if (options?.category && options.category !== 'All' && options.category !== 'all') {
      const catLower = options.category.toLowerCase();
      items = items.filter(
        (p) =>
          p.category.toLowerCase().includes(catLower) ||
          p.tags.some((t) => t.toLowerCase().includes(catLower))
      );
    }

    if (options?.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (options?.isBestSeller) {
      items = items.filter((p) => p.isBestSeller);
    }

    if (options?.isNew) {
      items = items.filter((p) => p.isNew);
    }

    if (options?.sort) {
      switch (options.sort) {
        case 'price_low':
          items.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          items.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'popular':
        default:
          items.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    return items;
  }

  async getProductById(id: string): Promise<Product | null> {
    const found = MOCK_PRODUCTS.find((p) => p.id === id);
    return found || null;
  }

  async getCollections(): Promise<Collection[]> {
    return MOCK_COLLECTIONS;
  }

  async getBanners(): Promise<Banner[]> {
    return MOCK_BANNERS;
  }

  async getShowrooms(): Promise<Showroom[]> {
    return MOCK_SHOWROOMS;
  }

  async getReviews(productId: string): Promise<Review[]> {
    const matched = MOCK_REVIEWS.filter((r) => r.productId === productId);
    if (matched.length > 0) return matched;
    
    // Default reviews fallback
    return [
      {
        id: `rev-${productId}-1`,
        productId,
        author: 'Verified Customer',
        rating: 5,
        date: 'Recent',
        comment: 'Alhamdulillah, premium fabric and finishing. Highly satisfied with One Ummah BD quality.',
        verified: true,
      },
    ];
  }

  async getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
    return MOCK_PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.tags.some((t) => product.tags.includes(t)))
    ).slice(0, limit);
  }
}

export const productService = new ProductService();
