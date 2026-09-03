export const Colors = {
  // Brand Core
  primary: '#101828',         // Deep Charcoal
  primaryLight: '#1D2939',    // Secondary Charcoal for elevated elements
  accent: '#05AE7A',          // Dawah Emerald (Primary CTA & highlights)
  accentHover: '#048C62',
  accentSubtle: '#E6F7F1',     // Soft emerald tint for badges
  
  // Sale & Pricing
  sale: '#DB1215',            // Sunnah Ruby / Crimson (Sale price, discount)
  saleSubtle: '#FEE4E2',      // Soft red badge background
  warning: '#F79009',         // Amber / Star rating
  warningSubtle: '#FEF0C7',
  
  // Surfaces & Backgrounds
  background: '#FFFFFF',      // Main screen background
  surface: '#F8F9FA',         // Secondary surface (cards)
  surfaceVariant: '#F2F4F7',  // Inactive chips, form inputs
  warmSand: '#FBF7F0',        // Traditional warm cream
  
  // Typography
  textPrimary: '#101828',     // Headers, titles, primary labels
  textSecondary: '#475467',   // Body text, secondary info
  textMuted: '#98A2B3',       // Placeholders, disabled text
  textInverse: '#FFFFFF',     // Text on primary buttons
  
  // Borders & Dividers
  border: '#EAECF0',
  borderStrong: '#D0D5DD',
  
  // Semantic Status
  success: '#12B76A',
  error: '#F04438',
  info: '#0BA5EC',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Typography = {
  displayLg: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  displaySm: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: Colors.textMuted,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 14,
  },
};
