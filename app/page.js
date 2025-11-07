'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { GUEST_BOOK_ABI, CONTRACT_ADDRESS } from './contracts/GuestBook'
import { formatDistanceToNow } from 'date-fns'
import { parseEther } from 'viem'
import { useFarcaster, SignInButton } from './context/FarcasterProvider'
import { getWarpcastShareUrl, getMessageShareText, getTodoShareText } from './utils/farcaster'

export default function Home() {
  // Guestbook state
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  // Todo state
  const [todoTitle, setTodoTitle] = useState('')
  const [todoDescription, setTodoDescription] = useState('')
  const [todoView, setTodoView] = useState('all') // 'all' or 'mine'
  const [mounted, setMounted] = useState(false)

  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { farcasterUser, isAuthenticated: isFarcasterConnected, signOut: farcasterSignOut } = useFarcaster()

  // Guestbook contract reads
  const { data: messages, refetch: refetchMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GUEST_BOOK_ABI,
    functionName: 'getAllMessages',
  })

  // Todo contract reads
  const { data: allTodos, refetch: refetchAllTodos } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GUEST_BOOK_ABI,
    functionName: 'getAllTodos',
  })

  const { data: userTodos, refetch: refetchUserTodos } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GUEST_BOOK_ABI,
    functionName: 'getUserTodos',
    args: address ? [address] : undefined,
  })

  const { data: todoFee } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GUEST_BOOK_ABI,
    functionName: 'todoCreationFee',
  })

  // Contract writes
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
      setTodoTitle('')
      setTodoDescription('')
      setTimeout(() => {
        refetchMessages()
        refetchAllTodos()
        refetchUserTodos()
      }, 2000)
    }
  }, [isSuccess, refetchMessages, refetchAllTodos, refetchUserTodos])

  // Guestbook handlers
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

  // Todo handlers
  const handleCreateTodo = async (e) => {
    e.preventDefault()

    if (!todoTitle) {
      alert('Please enter a title')
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'createTodo',
      args: [todoTitle, todoDescription],
      value: todoFee,
    })
  }

  const handleToggleTodo = (todoId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'toggleTodoComplete',
      args: [todoId],
    })
  }

  const handleDeleteTodo = (todoId) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: GUEST_BOOK_ABI,
        functionName: 'deleteTodo',
        args: [todoId],
      })
    }
  }

  const handleLikeTodo = (todoId) => {
    // Toggle like - the contract will handle the logic
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'likeTodo',
      args: [todoId],
    })
  }

  const todosToDisplay = todoView === 'all' ? allTodos : userTodos

  // Farcaster share handlers
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

  const handleShareMessage = (message) => {
    const shareText = getMessageShareText(message, appUrl)
    const shareUrl = getWarpcastShareUrl(shareText)
    window.open(shareUrl, '_blank')
  }

  const handleShareTodo = (todo) => {
    const shareText = getTodoShareText(todo, appUrl)
    const shareUrl = getWarpcastShareUrl(shareText)
    window.open(shareUrl, '_blank')
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

          <div className="mt-8 flex flex-col items-center gap-6">
            {/* Wallet Connection */}
            <div className="flex justify-center gap-4">
              {!isConnected ? (
                <button
                  onClick={() => open?.()}
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
                    onClick={() => open?.()}
                    className="text-purple-600 hover:text-purple-800 font-semibold underline"
                  >
                    Switch Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Farcaster Connection */}
            <div className="flex flex-col items-center gap-3 border-t pt-6 w-full max-w-md">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <svg className="w-5 h-5" viewBox="0 0 1000 1000" fill="currentColor">
                  <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
                  <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                  <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"/>
                </svg>
                <span className="font-bold">Connect with Farcaster</span>
              </div>
              {!isFarcasterConnected ? (
                <SignInButton />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 bg-purple-100 text-purple-800 px-6 py-3 rounded-2xl">
                    {farcasterUser?.pfpUrl && (
                      <img
                        src={farcasterUser.pfpUrl}
                        alt={farcasterUser.username}
                        className="w-10 h-10 rounded-full border-2 border-purple-400"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold">@{farcasterUser?.username}</span>
                      {farcasterUser?.displayName && (
                        <span className="text-sm text-purple-600">{farcasterUser.displayName}</span>
                      )}
                    </div>
                  </div>
                  {farcasterUser?.bio && (
                    <p className="text-sm text-gray-600 text-center max-w-md italic">
                      "{farcasterUser.bio}"
                    </p>
                  )}
                  <button
                    onClick={farcasterSignOut}
                    className="text-purple-600 hover:text-purple-800 font-semibold underline text-sm"
                  >
                    Sign Out of Farcaster
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isConnected && (
          <>
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

          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">✅</span>
              <h2 className="text-3xl font-bold text-gray-800">Community Todo List</h2>
            </div>

            <form onSubmit={handleCreateTodo} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Todo Title
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?..."
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  maxLength={100}
                  className="w-full px-5 py-4 border-3 border-gray-200 rounded-xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add more details..."
                  value={todoDescription}
                  onChange={(e) => setTodoDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full px-5 py-4 border-3 border-gray-200 rounded-xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none resize-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Creation fee: <span className="font-bold text-purple-600">{todoFee ? `${Number(todoFee) / 1e18} ETH` : 'Loading...'}</span>
                </p>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending && '📤 Sending...'}
                  {isConfirming && '⏳ Confirming...'}
                  {!isPending && !isConfirming && '➕ Create Todo'}
                </button>
              </div>
            </form>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTodoView('all')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  todoView === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🌍 All Todos ({allTodos?.length || 0})
              </button>
              <button
                onClick={() => setTodoView('mine')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  todoView === 'mine'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                👤 My Todos ({userTodos?.length || 0})
              </button>
            </div>

            {!todosToDisplay || todosToDisplay.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">📝</div>
                <p className="text-xl text-gray-500 mb-2">No todos yet</p>
                <p className="text-gray-400">Be the first to create a todo!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...todosToDisplay].reverse().map((todo, index) => {
                  const isOwner = address && todo.creator.toLowerCase() === address.toLowerCase()

                  return (
                    <div
                      key={todo.id.toString()}
                      className={`group p-6 rounded-2xl border-l-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ${
                        todo.completed
                          ? 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-500 opacity-75'
                          : 'bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 border-purple-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {isOwner && (
                            <button
                              onClick={() => handleToggleTodo(todo.id)}
                              className="mt-1 text-2xl hover:scale-125 transition-transform"
                            >
                              {todo.completed ? '✅' : '⬜'}
                            </button>
                          )}
                          {!isOwner && (
                            <span className="mt-1 text-2xl">
                              {todo.completed ? '✅' : '⬜'}
                            </span>
                          )}
                          <div className="flex-1">
                            <h3 className={`font-bold text-xl mb-2 ${todo.completed ? 'line-through text-gray-500' : 'text-purple-700'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-gray-700 mb-3 ${todo.completed ? 'line-through' : ''}`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">By:</span>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-mono">
                                  {todo.creator.slice(0, 6)}...{todo.creator.slice(-4)}
                                </code>
                                {isOwner && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                ⏰ {formatDistanceToNow(new Date(Number(todo.timestamp) * 1000), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleLikeTodo(todo.id)}
                            className="flex items-center gap-1 bg-white px-3 py-2 rounded-full hover:bg-pink-100 transition-colors"
                          >
                            <span className="text-lg">❤️</span>
                            <span className="font-bold text-pink-600">{todo.likes.toString()}</span>
                          </button>
                          <button
                            onClick={() => handleShareTodo(todo)}
                            className="bg-purple-100 text-purple-600 px-3 py-2 rounded-full hover:bg-purple-200 transition-colors font-bold text-sm"
                            title="Share to Warpcast"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 1000 1000" fill="currentColor">
                              <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
                              <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                              <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"/>
                            </svg>
                          </button>
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="bg-red-100 text-red-600 px-3 py-2 rounded-full hover:bg-red-200 transition-colors font-bold text-sm"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
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

                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">From:</span>
                      <code className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-mono">
                        {msg.sender.slice(0, 8)}...{msg.sender.slice(-6)}
                      </code>
                    </div>
                    <button
                      onClick={() => handleShareMessage(msg)}
                      className="bg-purple-100 text-purple-600 px-3 py-2 rounded-full hover:bg-purple-200 transition-colors font-bold text-sm flex items-center gap-2"
                      title="Share to Warpcast"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 1000 1000" fill="currentColor">
                        <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
                        <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                        <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"/>
                      </svg>
                      <span className="hidden sm:inline">Share</span>
                    </button>
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