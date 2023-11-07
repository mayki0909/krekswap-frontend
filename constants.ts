export const metadataIndex = {
  url: `${process.env.NEXT_PUBLIC_APP_LINK}`,
  title: 'Krekswap - Web3 Project',
  description: 'Krekswap is Solidity project created with a desire to learn more about Web3.',
  image: `${process.env.NEXT_PUBLIC_APP_LINK}/metadata/index.jpg`
}

export const mumbaiNetwork = {
  chainId: "0x13881", //0x13881
  chainName: "Mumbai",
  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
  iconUrls: [`${process.env.NEXT_PUBLIC_APP_LINK}/images/matic.png`],
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  },
  blockExplorerUrls: ["https://mumbai.polygonscan.com"]
}