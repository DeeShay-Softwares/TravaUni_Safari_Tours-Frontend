// src/theme/index.ts
export const colors = {
  wheat: {
    50: "rgb(251 245 233)",
    100: "rgb(247 235 212)",
    200: "rgb(239 216 169)",
    300: "rgb(231 196 126)",
    400: "rgb(223 176 83)",
    500: "rgb(215 157 40)",
    600: "rgb(172 125 32)",
    700: "rgb(129 94 24)",
    800: "rgb(86 63 16)",
    900: "rgb(43 31 8)",
    950: "rgb(30 22 6)"
  },
  darkKhakhi: {
    50: "rgb(244 243 240)",
    100: "rgb(234 231 225)",
    200: "rgb(213 207 195)",
    300: "rgb(192 183 165)",
    400: "rgb(170 159 136)",
    500: "rgb(149 135 106)",
    600: "rgb(119 108 85)",
    700: "rgb(90 81 63)",
    800: "rgb(60 54 42)",
    900: "rgb(30 27 21)",
    950: "rgb(21 19 15)"
  },
  bronze: {
    50: "rgb(251 242 234)",
    100: "rgb(247 230 212)",
    200: "rgb(239 204 169)",
    300: "rgb(231 179 126)",
    400: "rgb(222 153 84)",
    500: "rgb(214 128 41)",
    600: "rgb(171 102 33)",
    700: "rgb(129 77 24)",
    800: "rgb(86 51 16)",
    900: "rgb(43 26 8)",
    950: "rgb(30 18 6)"
  },
  oliveWood: {
    50: "rgb(246 246 238)",
    100: "rgb(236 238 221)",
    200: "rgb(217 221 187)",
    300: "rgb(199 204 153)",
    400: "rgb(180 187 119)",
    500: "rgb(161 170 85)",
    600: "rgb(129 136 68)",
    700: "rgb(97 102 51)",
    800: "rgb(64 68 34)",
    900: "rgb(32 34 17)",
    950: "rgb(23 24 12)"
  }
};

const typography = {
  fontFamily: {
    primary: `'Poppins', 'Inter', sans-serif`,
  },
  
  heroTitle: {
    fontSize: '55px',
    fontWeight: 700,
    lineHeight: '1.15',
    letterSpacing: '-0.5px',
    color: '#FFFFFF',
  },

  heroSubtitle: {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.85)',
  },

  sectionLabel: {
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: '#8A8A8A',
  },

  sectionTitle: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '1.3',
    color: '#111111',
  },

  bodyText: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.7',
    color: '#666666',
  },

  statNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#111111',
  },

  statLabel: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#777777',
  },

  inputText: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#222222',
  },

  buttonText: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
};

// Create MUI theme
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.oliveWood[500],
      light: colors.oliveWood[400],
      dark: colors.oliveWood[600],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.bronze[500],
      light: colors.bronze[400],
      dark: colors.bronze[600],
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.darkKhakhi[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.darkKhakhi[900],
      secondary: colors.darkKhakhi[700],
    },
  },
  typography: {
    fontFamily: typography.fontFamily.primary,
    h1: {
      fontSize: typography.heroTitle.fontSize,
      fontWeight: typography.heroTitle.fontWeight,
      lineHeight: typography.heroTitle.lineHeight,
      letterSpacing: typography.heroTitle.letterSpacing,
    },
    h2: {
      fontSize: typography.sectionTitle.fontSize,
      fontWeight: typography.sectionTitle.fontWeight,
      lineHeight: typography.sectionTitle.lineHeight,
    },
    h3: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: typography.bodyText.fontSize,
      lineHeight: typography.bodyText.lineHeight,
      fontWeight: typography.bodyText.fontWeight,
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.6,
    },
    button: {
      fontSize: typography.buttonText.fontSize,
      fontWeight: typography.buttonText.fontWeight,
      textTransform: 'none' as const,
    },
    caption: {
      fontSize: typography.statLabel.fontSize,
      color: typography.statLabel.color,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});