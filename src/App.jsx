import './App.css'
import {isWalletInfoInjectable, isWalletInfoRemote, TonConnect} from '@tonconnect/sdk'
import {useCallback, useEffect, useState} from "react";

const connector = new TonConnect({
  manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json'
});

const getWalletId = (walletInfo) => walletInfo.name.toLowerCase().replace(' ', '-')

function App() {
  const [remoteWallets, setRemoteWallets] = useState([])
  const [injectableWallets, setInjectableWallets] = useState([])

  const [connected, setConnected] = useState(false)

  const [remoteConnectionLink, setRemoteConnectionLink] = useState('')

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const promise = connector.getWallets()
      .then(walletsInfo => {
        const remoteWallets = walletsInfo.filter(isWalletInfoRemote)
        const injectableWallets = walletsInfo.filter(isWalletInfoInjectable)

        setRemoteWallets(remoteWallets)
        setInjectableWallets(injectableWallets)
      })

    return () => promise.finally(() => {
    })
  }, [setRemoteWallets, setInjectableWallets])

  const restoreConnection = useCallback(async () => {
    await connector.restoreConnection()
      .then(() => {
        setConnected(connector.connected)
      })
  }, [setConnected])

  const disconnect = useCallback(async () => {
    await connector.disconnect()
      .then(() => {
        setConnected(connector.connected)
      })
  }, [setConnected])

  return (
    <>
      <div>
        <h1>{connected ? 'Connected' : 'Disconnected'}</h1>
      </div>

      <br/>

      <button disabled={connected} onClick={() => restoreConnection()}>Check Connection</button>
      <button disabled={!connected} onClick={() => disconnect()}>Disconnect</button>

      <br/>
      <br/>
      <hr/>
      <br/>

      <h2>Remote Wallets</h2>
      <div className={'grid'}>
        {remoteWallets.map((walletInfo) => {
          const walletId = getWalletId(walletInfo)
          return <button disabled={connected} key={walletId} onClick={() => {
            const universalLink = connector.connect({
              universalLink: walletInfo.universalLink,
              bridgeUrl: walletInfo.bridgeUrl
            });

            setRemoteConnectionLink(universalLink);
            setOpenDialog(true)
          }}>{walletInfo.name}</button>
        })}
      </div>

      <h2>Injectable Wallets</h2>
      <div className={'grid'}>
        {injectableWallets.map((walletInfo) => {
          const walletId = getWalletId(walletInfo)
          return <button disabled={connected} key={walletId} onClick={() => {
            connector.connect({
              jsBridgeKey: walletInfo.jsBridgeKey
            })
          }}>{walletInfo.name}</button>
        })}
      </div>

      {
        openDialog && <div style={{
          display: 'grid',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          maxWidth: '100vw',
          minWidth: 'fit-content',
          width: 'fit-content',
          minHeight: 'fit-content',
          backgroundColor: '#242424',
          border: '1px solid #fefefe',
          padding: '20px',
        }}>
          <a href={remoteConnectionLink}>{remoteConnectionLink}</a>

          <button style={{
            marginTop: '10px',
          }} onClick={() => {
            setOpenDialog(false)
            setRemoteConnectionLink('')
          }}>
            Close
          </button>
        </div>
      }
    </>
  )
}

export default App

/**
 * const { TonConnect, isWalletInfoRemote } = TonConnectSDK
 *
 *     let currentConnectedWallet = null
 *     let connector
 *
 *     let connectToWalletStatus = null
 *
 *     async function main() {
 *         connector = new TonConnect({
 *             manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json'
 *         });
 *
 *         connector.restoreConnection()
 *             .then(data => {
 *                 console.info('Connected', data)
 *             })
 *
 *         connectToWalletStatus.innerText = 'ready'
 *
 *         let walletsList = await connector.getWallets()
 *         walletsList = walletsList.filter(isWalletInfoRemote);
 *
 *         const walletConnectorContainer = document.getElementById('wallet-connector-container');
 *
 *         walletConnectorContainer.innerHTML = ''; // try to clear any orphan element
 *         walletsList.forEach((wallet) => {
 *             const walletConnectButton = buildWalletConnectButton(wallet, (walletInfo) => {
 *
 *                 connectToWalletStatus.innerText = 'connecting...'
 *
 *                 return connector.connect({
 *                     universalLink: walletInfo.universalLink,
 *                     bridgeUrl: walletInfo.bridgeUrl
 *                 })
 *             });
 *             walletConnectorContainer.appendChild(walletConnectButton);
 *         })
 *     }
 *
 *     function buildWalletConnectButton(wallet, connectionCallback) {
 *
 *         const button = document.createElement('button')
 *
 *         button.id = wallet.name.toLowerCase().replace(' ', '-')
 *         button.innerHTML = wallet.name
 *
 *         button.addEventListener('click', () => {
 *             console.info(`Connecting with (${wallet.name})`)
 *             connectionCallback(wallet)
 *         })
 *
 *         return button
 *     }
 *
 *     function getDetails() {
 *         const getConnectedWalletButton = document.getElementById('get-connected-wallet')
 *
 *         const info = document.querySelector('#connected-wallet-info')[0]
 *         console.info(connector)
 *
 *         getConnectedWalletButton.click(() => {
 *             connector.wallet()
 *                 .then((walletInfo) => {
 *                     info.innerHTML = walletInfo
 *                 })
 *         })
 *     }
 *
 *     document.addEventListener('DOMContentLoaded', () => {
 *         connectToWalletStatus = document.getElementById('connect-to-wallet-status')
 *         main()
 *         getDetails()
 *     })
 *
 * */