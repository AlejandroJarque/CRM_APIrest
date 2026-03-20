import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Router from './router'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App