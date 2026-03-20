const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Custom brand colors
        brand: {
          primary: '#f6005d',
          'primary-hover': '#ff3f4b',
          'primary-active': '#e6004c',
          'primary-soft': '#ff5c6a',
          'primary-soft-light': '#ff7a85',
        },
        accentCustom: {
          DEFAULT: '#c9184a',
          hover: '#a4133c',
          soft: '#ff8fa3',
        },
        app: {
          background: '#080c1a',
          surface: '#0c111f',
          'surface-alt': '#11172a',
          'surface-deep': '#151a29',
          'surface-elevated': '#161c33',
          black: '#000000',
        },
        textCustom: {
          primary: '#ffffff',
          secondary: '#b2b7c6',
          muted: '#8f95a6',
          disabled: '#6b7082',
        },
        borderCustom: {
          DEFAULT: '#4a4f5e',
          strong: '#363a45',
        },
        surface: {
          light: '#ffffff',
          'light-alt': '#f2f4f8',
          'light-muted': '#e6e9f0',
        },
        feedback: {
          danger: '#f6005d',
          'danger-soft': '#ff7a85',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
