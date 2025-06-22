import { createTheme } from '@mui/material/styles'

const MUItheme = {
  typography: {
    fontFamily: ['IBMPlexSans', 'Exo 2', 'Roboto', 'sans-serif'].join(',')
  },
  palette: {
    primary: { main: '#5307AB' }
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 7,
          '&:hover': {
            backgroundColor: 'var(--icon-button-hover)'
          }
        }
      }
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 8 } } }
  }
}

export default createTheme(MUItheme)
