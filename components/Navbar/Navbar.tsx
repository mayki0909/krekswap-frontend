import { mumbaiNetwork } from "../../constants"
import { useCrypto } from "../../providers/CryptoProvider"

export const Navbar = () => {
  const {connect, currentNetwork, switchNetwork, isConnected, account, network} = useCrypto()
  return (
    <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">KrekSwap</a>
        {isConnected() ? 
          <>
          {network === process.env.NEXT_PUBLIC_SUPPORTED_NETWORK ? 
            <img src={mumbaiNetwork.iconUrls} alt="Active network" />
          : 
            <button onClick={()=>switchNetwork('0x13881')}>
              Switch network
            </button>
          }
            <a className="navbar-toggler">{account}</a>
          </>
        :
          <button className="navbar-toggler" type="button" onClick={()=>connect()}>
            Connect
          </button>
        }
      </div>
    </nav>
  )
}