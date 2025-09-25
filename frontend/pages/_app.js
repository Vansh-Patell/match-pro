import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastContainer } from '../components/Toast'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  )
}