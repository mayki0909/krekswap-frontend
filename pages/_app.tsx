import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { CryptoProvider } from '../providers/CryptoProvider'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <CryptoProvider>
      <Component {...pageProps}/>
    </CryptoProvider>
  )
}

export default MyApp
