import { createContext, useContext, useState } from "react";
import { mumbaiNetwork } from "../constants";

interface CryptoContextType {
  account: String;
  network: String;
  isConnected: () => boolean;
  connect: () => void;
  disconect: () => void;
  currentNetwork: () => Promise<String>,
  switchNetwork: (chainId: string) => void;
}

const CryptoContext = createContext<CryptoContextType>({
  account: '',
  network: '',
  isConnected: () => false,
  connect: () => null,
  disconect: () => null,
  currentNetwork: () => Promise.resolve(''),
  switchNetwork: (chainId: string) => null,
})

export const CryptoProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [account, setAccount] = useState<String>('')
  const [network, setNetwork] = useState<String>('')

  const isConnected = () => {
    if (account !== '') return true
    return false
  }

  const connect = async () => {
    if(window.ethereum){
      window.ethereum.request({method:'eth_requestAccounts'})
        .then((res: Array<String>) => {
            if (res.length > 0) setAccount(res[0])
        })
    } else {
      alert("install metamask extension!!")
    }
  }

  const disconect = async () => {

  }

  const currentNetwork = async (): Promise<string> => {
    if(window.ethereum){
      const response = await window.ethereum.request({
        "method": "eth_chainId",
        "params": []
      });

      return response as String
    } else {
      console.log('No metamask installed!')
      return ''
    }
  }

  const switchNetwork = async (chainId: string) => {
    if(window.ethereum){
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      })

      setNetwork(chainId)
    } else {
      console.log('No metamask installed!')
    }
  }

  const addMatic = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [mumbaiNetwork]
    });
  }

  return (
    <CryptoContext.Provider
      value={{account, network, isConnected, connect, disconect, currentNetwork, switchNetwork}}
    >
      {children}
    </CryptoContext.Provider>
  )
}

export const useCrypto = () => {
  return useContext(CryptoContext)
}