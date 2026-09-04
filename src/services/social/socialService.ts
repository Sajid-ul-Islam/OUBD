import { Linking, Alert } from 'react-native';

export interface SocialAccount {
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  handle: string;
  displayName: string;
  profileUrl: string;
  followersCount: string;
  verified: boolean;
}

export interface TaggedProductRef {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export interface SocialStory {
  id: string;
  title: string;
  thumbnail: string;
  badge?: string;
  hasUnseen: boolean;
  taggedProductId?: string;
}

export interface SocialReel {
  id: string;
  title: string;
  caption: string;
  thumbnailUrl: string;
  duration: string;
  viewsCount: string;
  likesCount: string;
  platform: 'instagram' | 'facebook';
  permalink: string;
  taggedProduct?: TaggedProductRef;
}

export interface SocialPost {
  id: string;
  caption: string;
  imageUrl: string;
  platform: 'instagram' | 'facebook';
  likesCount: string;
  commentsCount: string;
  publishedDate: string;
  permalink: string;
}

export const OFFICIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    platform: 'facebook',
    handle: 'oneummahbd',
    displayName: 'One Ummah BD',
    profileUrl: 'https://www.facebook.com/oneummahbd',
    followersCount: '485K Followers',
    verified: true,
  },
  {
    platform: 'instagram',
    handle: '@oneummahbd',
    displayName: 'One Ummah BD',
    profileUrl: 'https://www.instagram.com/oneummahbd/?hl=en',
    followersCount: '135K Followers',
    verified: true,
  },
];

const MOCK_STORIES: SocialStory[] = [
  {
    id: 's1',
    title: 'New Panjabi',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/product-name-oubd-4616376.webp?v=1786455128',
    badge: 'NEW',
    hasUnseen: true,
    taggedProductId: '8646731792463',
  },
  {
    id: 's2',
    title: 'Drop Shoulder',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/product-name-oubd-2010364.png?v=1786454948',
    badge: 'TRENDING',
    hasUnseen: true,
    taggedProductId: '8975892349007',
  },
  {
    id: 's3',
    title: 'Moroccan Thobe',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/product-name-oubd-6641047.webp?v=1786455068',
    hasUnseen: false,
    taggedProductId: '8652864094287',
  },
  {
    id: 's4',
    title: 'Denim Fit',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/MPfGeKmqbGOSFnYXG8BzPZ2u4EKHw64dWMLAJtZb.webp?v=1778559091',
    badge: 'RESTOCK',
    hasUnseen: true,
    taggedProductId: '8627094552655',
  },
  {
    id: 's5',
    title: 'Watermelon Cap',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/Docker_9.png?v=1788273133',
    hasUnseen: false,
    taggedProductId: '9016026005583',
  },
  {
    id: 's6',
    title: 'Sunnah Attar',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/mgclJCrnAKUXhvXvgpFvRA99YoMC6ctBazChJuMh.webp?v=1778558973',
    badge: 'FRIDAY',
    hasUnseen: true,
    taggedProductId: '8627090260047',
  },
];

const MOCK_REELS: SocialReel[] = [
  {
    id: 'r1',
    title: 'Styling the Egyptian Combed Cotton Panjabi',
    caption: 'Discover subtle hand-stitched collar details & effortless comfort for Jummah prayer. 100% fine combed cotton weave.',
    thumbnailUrl: 'https://oneummahbd.shop/cdn/shop/files/premium-panjabi-banner.png?v=1778589962&width=1920',
    duration: '0:34',
    viewsCount: '142K',
    likesCount: '8.9K',
    platform: 'instagram',
    permalink: 'https://www.instagram.com/oneummahbd/?hl=en',
    taggedProduct: {
      id: '8646731792463',
      title: 'MENS PREMIUM PANJABI',
      price: 2450,
      image: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/product-name-oubd-4616376.webp?v=1786455128',
      category: 'PANJABI',
    },
  },
  {
    id: 'r2',
    title: 'Dawah Series Streetwear: Worldly Life Drop',
    caption: '200+ GSM heavyweight drop shoulder cotton with reactive dyeing. A reminder to carry simplicity in faith.',
    thumbnailUrl: 'https://oneummahbd.shop/cdn/shop/files/Banner_v2_3.png?v=1778489445&width=1920',
    duration: '0:28',
    viewsCount: '98K',
    likesCount: '6.4K',
    platform: 'instagram',
    permalink: 'https://www.instagram.com/oneummahbd/?hl=en',
    taggedProduct: {
      id: '8975892349007',
      title: 'DROP SHOULDER BACK CANVAS - WORLDLY LIFE',
      price: 790,
      image: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/product-name-oubd-2010364.png?v=1786454948',
      category: 'T-Shirt',
    },
  },
  {
    id: 'r3',
    title: 'The Story Behind the Watermelon Docker Cap',
    caption: 'Insignia of resilience and identity since 1967. Tailored in breathable 100% cotton twill with an adjustable tactical strap.',
    thumbnailUrl: 'https://oneummahbd.shop/cdn/shop/files/visor-cap-banner.png?v=1778590026&width=1920',
    duration: '0:45',
    viewsCount: '215K',
    likesCount: '16.2K',
    platform: 'facebook',
    permalink: 'https://www.facebook.com/oneummahbd',
    taggedProduct: {
      id: '9016026005583',
      title: 'DOCKER CAP - WATERMELON',
      price: 360,
      image: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/Docker_9.png?v=1788273133',
      category: 'Docker Cap',
    },
  },
  {
    id: 'r4',
    title: 'Why Non-Alcoholic Attar Lasts 12+ Hours',
    caption: 'Pure concentrated perfume oil extracts vs diluted sprays. Learn the Sunnah pulse-point application ritual.',
    thumbnailUrl: 'https://oneummahbd.shop/cdn/shop/files/Banner_v2_2_3f7dbbed-1222-4aa7-a98b-da88de5f7e50.png?v=1778678354',
    duration: '0:52',
    viewsCount: '84K',
    likesCount: '5.1K',
    platform: 'instagram',
    permalink: 'https://www.instagram.com/oneummahbd/?hl=en',
    taggedProduct: {
      id: '8627090260047',
      title: 'COOL WATER CONCENTRATE',
      price: 250,
      image: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/mgclJCrnAKUXhvXvgpFvRA99YoMC6ctBazChJuMh.webp?v=1778558973',
      category: 'Perfume',
    },
  },
];

class SocialService {
  async getOfficialAccounts(): Promise<SocialAccount[]> {
    return OFFICIAL_SOCIAL_ACCOUNTS;
  }

  async getStories(): Promise<SocialStory[]> {
    return MOCK_STORIES;
  }

  async getReels(): Promise<SocialReel[]> {
    return MOCK_REELS;
  }

  async openSocialProfile(platform: 'facebook' | 'instagram'): Promise<void> {
    const account = OFFICIAL_SOCIAL_ACCOUNTS.find((a) => a.platform === platform);
    if (!account) return;

    try {
      const supported = await Linking.canOpenURL(account.profileUrl);
      if (supported) {
        await Linking.openURL(account.profileUrl);
      } else {
        await Linking.openURL(account.profileUrl);
      }
    } catch {
      Alert.alert(
        'Unable to open link',
        `Please visit ${account.displayName} on ${platform} at: ${account.profileUrl}`
      );
    }
  }

  async openExternalUrl(url: string): Promise<void> {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Link Error', `Could not open ${url}`);
    }
  }
}

export const socialService = new SocialService();
