import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Primary Emerald Palette
      emerald50: '#ecfdf5',
      emerald100: '#d1fae5',
      emerald400: '#34d399',
      emerald500: '#10b981',
      emerald600: '#059669',

      // Dark Slate Base
      slate950: '#020617',
      slate900: '#0f172a',
      slate800: '#1e293b',
      slate700: '#334155',
      slate400: '#94a3b8',
      slate300: '#cbd5e1',
      white: '#ffffff',

      // Accents
      teal400: '#2dd4bf',
      cyan400: '#22d3ee',
      indigo500: '#6366f1',
      amber400: '#fbbf24',
      red500: '#ef4444',

      // Glass Backgrounds
      glassBg: 'rgba(15, 23, 42, 0.75)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
      glassHoverBorder: 'rgba(16, 185, 129, 0.35)',
      inputBg: 'rgba(2, 6, 23, 0.85)',
    },

    fonts: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      heading: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },

    radii: {
      xs: '6px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      full: '9999px',
    },

    shadows: {
      glass: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      emeraldGlow: '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
      cardHover: '0 20px 35px -10px rgba(16, 185, 129, 0.15)',
    },

    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
    },
  },

  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
  },

  utils: {
    px: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    mx: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    glassCard: () => ({
      backgroundColor: '$glassBg',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid $glassBorder',
      boxShadow: '$glass',
    }),
  },
});
