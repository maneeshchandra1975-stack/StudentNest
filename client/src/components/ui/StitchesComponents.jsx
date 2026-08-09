import { styled } from '../../styles/stitches.config';

// ── Stitches Button Component ──────────────────────────────────
export const StitchesButton = styled('button', {
  fontFamily: '$sans',
  fontSize: '14px',
  fontWeight: '700',
  borderRadius: '$md',
  padding: '12px 20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  outline: 'none',

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
        color: '#020617',
        boxShadow: '$emeraldGlow',

        '&:hover:not(:disabled)': {
          transform: 'translateY(-1px) scale(1.01)',
          boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.35)',
        },
        '&:active:not(:disabled)': {
          transform: 'translateY(0) scale(0.99)',
        },
      },
      outline: {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: '$slate300',

        '&:hover:not(:disabled)': {
          borderColor: '$emerald500',
          color: '$emerald400',
          background: 'rgba(16, 185, 129, 0.1)',
        },
      },
      danger: {
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '$red500',

        '&:hover:not(:disabled)': {
          background: 'rgba(239, 68, 68, 0.25)',
          transform: 'scale(1.02)',
        },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
});

// ── Stitches Card Component ────────────────────────────────────
export const StitchesCard = styled('div', {
  glassCard: true,
  borderRadius: '$xl',
  padding: '$6',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  variants: {
    interactive: {
      true: {
        '&:hover': {
          borderColor: '$glassHoverBorder',
          transform: 'translateY(-3px)',
          boxShadow: '$cardHover',
        },
      },
    },
  },
});

// ── Stitches Badge Component ───────────────────────────────────
export const StitchesBadge = styled('span', {
  fontFamily: '$sans',
  fontSize: '11px',
  fontWeight: '600',
  borderRadius: '$full',
  padding: '4px 10px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',

  variants: {
    variant: {
      success: {
        background: 'rgba(16, 185, 129, 0.12)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '$emerald400',
      },
      info: {
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: '$indigo500',
      },
      warning: {
        background: 'rgba(251, 191, 36, 0.12)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        color: '$amber400',
      },
    },
  },

  defaultVariants: {
    variant: 'success',
  },
});
