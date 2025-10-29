'use client'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const metadata = {
  name: 'Guest Book',
  description: 'Leave your message on the blockchain',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://guestbook.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  },
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ 
      projectId, 
      metadata,
      showQrModal: false
    }),
    coinbaseWallet({
      appName: metadata.name
    })
  ],
})

// Only create modal on client side
let modalCreated = false

export function Web3ModalProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Create the modal only on client side after mount
    if (typeof window !== 'undefined' && projectId && !modalCreated) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: true,
      })
      console.log('🔑 WalletConnect Project ID:', projectId ? '✅ Loaded' : '❌ Missing')
      modalCreated = true
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}