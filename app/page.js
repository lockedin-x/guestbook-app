'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { GUEST_BOOK_ABI, CONTRACT_ADDRESS } from './contracts/GuestBook'
import { formatDistanceToNow } from 'date-fns'

export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  const { address, isConnected } = useAccount()
  
  // Only use Web3Modal after component mounts
  let open = () => {}
  try {
    const modal = useWeb3Modal()
    open = modal.open
  } catch (e) {
    console.log('Web3Modal not ready yet')
  }

  const { data: messages, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GUEST_BOOK_ABI,
    functionName: 'getAllMessages',
  })

  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setName('')
      setMessage('')
      setTimeout(() => refetch(), 2000)
    }
  }, [isSuccess, refetch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !message) {
      alert('Please fill in both fields')
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'postMessage',
      args: [name, message],
    })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6 mt-8">
          <div className="text-center">
            <h1 className="text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-transparent bg-clip-text">
              📖 Guest Book
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Leave your message on the <span className="font-semibold text-purple-600">blockchain</span> forever
            </p>
            <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
              <span className="animate-pulse mr-2">🟢</span> Live on Base Network
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {!isConnected ? (
              <button
                onClick={() => open()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🔗 Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-2xl font-semibold">
                  <span className="mr-2">✅</span>
                  <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
                <button
                  onClick={() => open()}
                  className="text-purple-600 hover:text-purple-800 font-semibold underline"
                >
                  Switch Wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">✍️</span>
              <h2 className="text-3xl font-bold text-gray-800">Leave Your Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="w-full px-5 py-4 border-3 border-gray-200 rounded-xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  placeholder="What would you like to say?..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={5}
                  className="w-full px-5 py-4 border-3 border-gray-200 rounded-xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none resize-none transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">{message.length}/500 characters</p>
              </div>
              
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending && '📤 Sending Transaction...'}
                {isConfirming && '⏳ Confirming on Blockchain...'}
                {!isPending && !isConfirming && '📝 Post Message to Blockchain'}
              </button>
            </form>

            {isSuccess && (
              <div className="mt-6 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="font-bold text-green-800 text-lg">Message Posted Successfully!</p>
                    <p className="text-green-700 text-sm">Your message is now on the blockchain forever</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💬</span>
              <h2 className="text-3xl font-bold text-gray-800">Messages</h2>
            </div>
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold">
              {messages?.length || 0} {messages?.length === 1 ? 'Message' : 'Messages'}
            </div>
          </div>
          
          {!messages || messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">📭</div>
              <p className="text-xl text-gray-500 mb-2">No messages yet</p>
              <p className="text-gray-400">Be the first to leave a message!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...messages].reverse().map((msg, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl border-l-4 border-purple-500 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👤</span>
                      <span className="font-bold text-purple-700 text-xl">{msg.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                      ⏰ {formatDistanceToNow(new Date(Number(msg.timestamp) * 1000), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 text-lg leading-relaxed mb-3 pl-9">
                    {msg.message}
                  </p>
                  
                  <div className="flex items-center gap-2 pl-9">
                    <span className="text-xs text-gray-400">From:</span>
                    <code className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-mono">
                      {msg.sender.slice(0, 8)}...{msg.sender.slice(-6)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center py-8 text-white/80">
          <p className="text-sm">
            Built with ❤️ on Base • Powered by WalletConnect
          </p>
          <a 
            href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-white underline mt-2 inline-block"
          >
            View Contract on BaseScan →
          </a>
        </div>
      </div>
    </div>
  )
}