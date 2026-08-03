import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DECISION: converted from the "cookies and cream" amber/cream
        // palette to pure black-and-white/grayscale. bg tokens had a barely
        // perceptible warm cast (R slightly > G > B, e.g. #121110) from the
        // original palette — neutralized to true R=G=B grays so nothing in
        // the base surface colors carries hue, not just the text/accent
        // tokens. accent used to be amber (#F5A623) for CTAs/badges/borders
        // sitewide (including non-homepage pages: refund-policy, campaigns/
        // maxxd, Nav) — now a neutral white-based scale so every consumer of
        // `accent` cascades to grayscale automatically.
        bg: {
          DEFAULT: '#121212',
          card: '#1C1C1C',
          elevated: '#242424',
          subtle: '#0F0F0F',
        },
        accent: {
          DEFAULT: '#FFFFFF',
          light: '#F5F5F5',
          dim: 'rgba(255,255,255,0.12)',
          mid: 'rgba(255,255,255,0.2)',
          glow: 'rgba(255,255,255,0.3)',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#A3A3A3',
          dim: '#6B6B6B',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          accent: 'rgba(255,255,255,0.2)',
        },
        green: '#4ade80',
        red: '#f87171',

        // Mentorship theme (green)
        m: {
          bg: '#0a0a0a',
          card: '#111111',
          elevated: '#1a1a1a',
          subtle: '#0e0e0e',
          accent: '#5cff7e',
          'accent-dim': 'rgba(92,255,126,0.08)',
          'accent-mid': 'rgba(92,255,126,0.15)',
          'accent-glow': 'rgba(92,255,126,0.4)',
          cyan: '#5ce1ff',
          peach: '#ff9f68',
          text: '#f5f5f5',
          'text-secondary': '#9ca3af',
          'text-dim': '#555',
          border: 'rgba(255,255,255,0.06)',
          'border-accent': 'rgba(92,255,126,0.15)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // One-shot entrance for the hero phone mockup: one full 360° spin
        // (not a small wobble — rotate(360deg) is a complete revolution that
        // lands back at visually 0deg) while scaling up from half-size and
        // fading in over the first 20%, decelerating into its resting
        // position via the easing curve on the animation itself rather than
        // extra keyframe stops. Runs on a separate wrapper from `float`
        // (continuous vertical bob) since two animations on the same element
        // both targeting `transform` would clobber each other, not compose.
        phoneEntrance: {
          '0%': { transform: 'rotate(0deg) scale(0.5) translateY(-20px)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'rotate(360deg) scale(1) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-up-delay-1': 'fadeUp 0.7s ease 0.1s both',
        'fade-up-delay-2': 'fadeUp 0.7s ease 0.2s both',
        'fade-up-delay-3': 'fadeUp 0.7s ease 0.3s both',
        'fade-up-delay-4': 'fadeUp 0.7s ease 0.4s both',
        'fade-down': 'fadeDown 0.6s ease',
        pulse: 'pulse 2s ease infinite',
        // 35s → 60s and 70s → 120s: both read as too fast to actually track
        // a given logo/card as it passed — ~1.7x slower on both.
        scroll: 'scroll 60s linear infinite',
        // Same keyframe as `scroll`, slower — the video showcase row has much
        // wider/taller cards than the logo strip and reads as frantic at 35s.
        'scroll-slow': 'scroll 120s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'phone-entrance': 'phoneEntrance 1s linear both',
      },
    },
  },
  plugins: [],
};
export default config;
