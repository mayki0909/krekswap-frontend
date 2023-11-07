import { NextPage } from 'next'
import React from 'react'

import { Layout } from '../components/Layouts' 
import { metadataIndex } from '../constants'
import { useCrypto } from '../providers/CryptoProvider'

const Home: NextPage = () => {
  const {connect, isConnected, account} = useCrypto()

  return (
    <Layout metadata={metadataIndex}>
      {isConnected() ? <>
        <h1>SWAP {process.env.NEXT_PUBLIC_SWAP_CONTRACT}</h1>
      </> : <p>Please connect</p>}
    </Layout>
  )
}

export default Home