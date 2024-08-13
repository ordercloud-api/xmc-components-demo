const basePalette = {
  colors: {
    gray: {
      50: '#f7f7f7',
      100: '#ededed',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#0a0a0a',
    },
    blackAlpha: {
      50: 'rgba(0,0,0, 0.03)',
      100: 'rgba(0,0,0,0.07)',
      200: 'rgba(0,0,0,0.10)',
      300: 'rgba(0,0,0,0.17)',
      400: 'rgba(0,0,0,0.36)',
      450: 'rgba(0,0,0,0.42)', // for 3.1 contrast against white
      500: 'rgba(0,0,0,0.55)',
      600: 'rgba(0,0,0,0.68)',
      700: 'rgba(0,0,0,0.75)',
      800: 'rgba(0,0,0,0.85)',
      900: 'rgba(0,0,0,0.96)',
    },
    whiteAlpha: {
      50: 'rgba(255,255,255, 0.03)',
      100: 'rgba(255,255,255,0.07)',
      200: 'rgba(255,255,255,0.10)',
      300: 'rgba(255,255,255,0.17)',
      400: 'rgba(255,255,255,0.36)',
      500: 'rgba(255,255,255,0.55)',
      600: 'rgba(255,255,255,0.68)',
      700: 'rgba(255,255,255,0.75)',
      800: 'rgba(255,255,255,0.85)',
      900: 'rgba(255,255,255,0.96)',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fdb8b8',
      300: '#f87171',
      400: '#ef4444',
      500: '#dc2626',
      600: '#b91c1c',
      700: '#991b1b',
      800: '#7f1d1d',
      900: '#450a0a',
    },
    orange: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fddd6c',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#d97706',
      600: '#b45309',
      700: '#92300e',
      800: '#78350f',
      900: '#451a03',
    },
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fee869',
      300: '#facc15',
      400: '#eab308',
      500: '#ca8a04',
      600: '#a16207',
      700: '#854d0e',
      800: '#713f12',
      900: '#421506',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#a1f3be',
      300: '#4ade80',
      400: '#22c55e',
      500: '#16a34a',
      600: '#15803d',
      700: '#166534',
      800: '#14532d',
      900: '#052e16',
    },
    teal: {
      50: '#d7ede9',
      100: '#bce1db',
      200: '#a1d5cc',
      300: '#78c3b6',
      400: '#70bdaf',
      500: '#65b5a6',
      600: '#5bae9e',
      700: '#48a18e',
      800: '#388f7b',
      900: '#21745f',
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#86eefb',
      300: '#22d3ee',
      400: '#06b6d4',
      500: '#0891b2',
      600: '#0e7490',
      700: '#155e75',
      800: '#164e63',
      900: '#083344',
    },
    blue: {
      50: '#e9ecfa',
      100: '#c9d0f3',
      200: '#a5b0ec',
      300: '#8090e4',
      400: '#6579de',
      500: '#4a61d8',
      600: '#4359d4',
      700: '#3245c8',
      800: '#2233bf',
      900: '#1420a9',
    },
    purple: {
      50: '#f3f3ff',
      100: '#e9e9fe',
      200: '#c5c6fd',
      300: '#918bfa',
      400: '#6c5cf6',
      500: '#5548d9',
      600: '#4a28d9',
      700: '#3d21b6',
      800: '#341d95',
      900: '#1d1065',
    },
    pink: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f3befd',
      300: '#e879f9',
      400: '#d946ef',
      500: '#c026d3',
      600: '#a21caf',
      700: '#86198f',
      800: '#701a75',
      900: '#4a044e',
    },
  },
}

const colors = {
  primary: basePalette.colors.blue,
  danger: basePalette.colors.red,
  warning: basePalette.colors.orange,
  success: basePalette.colors.teal,
  info: basePalette.colors.purple,
  ...basePalette.colors,
}

export default colors
