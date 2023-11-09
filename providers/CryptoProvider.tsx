import { createContext, useContext, useEffect, useState } from "react";
import { mumbaiNetwork } from "../constants";
import { Swap } from "../contracts/types/Swap";
import { Swap_factory } from "../contracts/Swap_factory";
import { JsonRpcProvider, ethers } from "ethers";

interface CryptoContextType {
  account: String;
  network: String;
  isConnected: () => boolean;
  connect: () => void;
  disconect: () => void;
  currentNetwork: () => Promise<String>,
  switchNetwork: (chainId: string) => void,

  allSupportedTokens: () => Promise<string[]>,
  allTokens: () => Promise<string[]>,
  allSupportedBalances: () => Promise<string[]>,
  tokenIsSupported: (token: string) => Promise<boolean>,
  tokenIsActive: (token: string) => Promise<boolean>,
  tokenBalance: (token: string) => Promise<any>,
  addToken: (token: string) => void,
  removeToken: (token: string) => void,
}

const CryptoContext = createContext<CryptoContextType>({
  account: '',
  network: '',
  isConnected: () => false,
  connect: () => null,
  disconect: () => null,
  currentNetwork: () => Promise.resolve(''),
  switchNetwork: (chainId: string) => null,

  allSupportedTokens: () => Promise.resolve([]),
  allTokens: () => Promise.resolve([]),
  allSupportedBalances: () => Promise.resolve([]),
  tokenIsSupported: (token: string) => Promise.resolve(false),
  tokenIsActive: (token: string) => Promise.resolve(false),
  tokenBalance: (token: string) => Promise.resolve({}),
  addToken: (token: string) => null,
  removeToken: (token: string) => null,
})

export const CryptoProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [account, setAccount] = useState<String>('')
  const [network, setNetwork] = useState<String>('')
  const [swapContract, setSwapContract] = useState<Swap>();
  const [provider, setProvider] = useState<JsonRpcProvider>(new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC));

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) setAccount(accounts[0])
  }

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


  const connectToSwapContract = async () => {
    const signer = await provider.getSigner()
    const contract: Swap = Swap_factory.connect(process.env.NEXT_PUBLIC_SWAP_CONTRACT!, signer)
    setSwapContract(contract)
  }

  const checkContractInit = () => {
    if (!swapContract) {
      console.error('Not connected to contract')
      return []
    }
  }

  const allTokens = async (): Promise<string[]> => {
    checkContractInit()
    const tokens = await swapContract!.allTokens()
    console.log(tokens)
    return tokens
  }
  
  const allSupportedTokens = async (): Promise<string[]> => {
    checkContractInit()
    const tokens = await swapContract!.allSupported()
    console.log(tokens)
    return tokens
  }

  const allSupportedBalances = async () => {
    checkContractInit()
    const supportedBalances = await swapContract!.allSupportedBalances()
    console.log(supportedBalances)
    return []
  }

  const tokenIsSupported = async (token: string) => {
    checkContractInit()
    return swapContract!.isSupported(token)
  }

  const tokenIsActive = async (token: string) => {
    checkContractInit()
    return swapContract!.isActive(token)
  }

  const tokenBalance = async (token: string) =>{
    checkContractInit()
    const balance = await swapContract!.tokenBalance(token)
    console.log(balance)
    return balance
  }

  // ONLY OWNER - PAYABLE
  const addToken = async (token: string) => {
    checkContractInit()
    await swapContract!.addToken(token)
  }

  // ONLY OWNER - PAYABLE
  const removeToken = async (token: string) => {
    checkContractInit()
    await swapContract!.addToken(token)
  }

  useEffect(() => {
    if (isConnected()) {
      connectToSwapContract()
    }
  },[isConnected()])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // TODO popup with button to switch back network
      window.ethereum.on('chainChanged', (chainId: string) => window.location.reload());
    }
  }, [])

  return (
    <CryptoContext.Provider
      value={{account, network, isConnected, connect, disconect, currentNetwork, switchNetwork, allSupportedTokens, allTokens, allSupportedBalances, tokenIsSupported, tokenIsActive, tokenBalance, addToken, removeToken}}
    >
      {children}
    </CryptoContext.Provider>
  )
}

export const useCrypto = () => {
  return useContext(CryptoContext)
}