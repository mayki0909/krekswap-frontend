import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

import { Layout } from '../components/Layouts' 
import { metadataIndex } from '../constants'
import { useCrypto } from '../providers/CryptoProvider'
import { Swap_factory } from '../contracts/Swap_factory'
import { ethers } from 'ethers'
import { Swap } from '../contracts/types/Swap'

const Home: NextPage = () => {
  const {connect, isConnected, account, allSupportedTokens, allTokens, 
         allSupportedBalances, tokenIsSupported, tokenIsActive, tokenBalance, 
         addToken, removeToken} = useCrypto()
  const token1 = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const token2 = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

  return (
    <Layout metadata={metadataIndex}>
      {isConnected() ? <>
        <h1>SWAP {process.env.NEXT_PUBLIC_SWAP_CONTRACT}</h1>
        <button onClick={()=>allTokens()}>All tokens</button>
        <button onClick={()=>allSupportedTokens()}>All supported tokens</button>
        <button onClick={()=>allSupportedBalances()}>All supported tokens</button>
        <button onClick={()=>tokenIsSupported(token1)}>Token1 is supported?</button>
        <button onClick={()=>tokenIsActive(token1)}>Token1 is active?</button>
        <button onClick={()=>tokenBalance(token1)}>Token1 balance</button>

        
        <h3>OWNER ONLY</h3>
        <button onClick={()=>addToken(token1)}>Add token 1</button>
        <button onClick={()=>addToken(token2)}>Add token 2</button>
        
        <button onClick={()=>removeToken(token1)}>Remove token 1</button>
        <button onClick={()=>removeToken(token2)}>Remove token 2</button>
      </> : <p>Please connect</p>}
    </Layout>
  )
}

export default Home