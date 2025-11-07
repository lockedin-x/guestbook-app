/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { handle } from 'frog/next'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const GUEST_BOOK_ABI = [
  {
    "inputs": [],
    "name": "getAllMessages",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "message",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct GuestBook.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTodos",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "likes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct GuestBook.TodoItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = '0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42'

const publicClient = createPublicClient({
  chain: base,
  transport: http()
})

const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  title: 'Guest Book on Base',
})

app.frame('/', async (c) => {
  const { buttonValue, status } = c

  // Fetch messages and todos from the contract
  let messages = []
  let todos = []
  let messageCount = 0
  let todoCount = 0
  let completedTodoCount = 0

  try {
    messages = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'getAllMessages',
    })
    messageCount = messages.length

    todos = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: GUEST_BOOK_ABI,
      functionName: 'getAllTodos',
    })
    todoCount = todos.length
    completedTodoCount = todos.filter(t => t.completed).length
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // Handle different views based on button clicks
  if (buttonValue === 'view_messages') {
    const latestMessages = messages.slice(-3).reverse()

    return c.res({
      image: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '60px',
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '30px' }}>
            📖 Latest Messages
          </h1>
          {latestMessages.length === 0 ? (
            <p style={{ fontSize: '32px' }}>No messages yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              {latestMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {msg.name}
                  </p>
                  <p style={{ fontSize: '18px', opacity: 0.9 }}>
                    {msg.message.length > 100 ? msg.message.slice(0, 100) + '...' : msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '20px', marginTop: '30px', opacity: 0.8 }}>
            Total Messages: {messageCount}
          </p>
        </div>
      ),
      intents: [
        <Button value="home">🏠 Home</Button>,
        <Button.Link href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
          📱 Open App
        </Button.Link>,
      ],
    })
  }

  if (buttonValue === 'view_todos') {
    const latestTodos = todos.slice(-3).reverse()

    return c.res({
      image: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '60px',
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '30px' }}>
            ✅ Latest Todos
          </h1>
          {latestTodos.length === 0 ? (
            <p style={{ fontSize: '32px' }}>No todos yet. Create one!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              {latestTodos.map((todo, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {todo.completed ? '✅' : '⬜'} {todo.title}
                  </p>
                  <p style={{ fontSize: '18px', opacity: 0.9 }}>
                    ❤️ {todo.likes.toString()} likes
                  </p>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '20px', marginTop: '30px', opacity: 0.8 }}>
            {completedTodoCount}/{todoCount} completed
          </p>
        </div>
      ),
      intents: [
        <Button value="home">🏠 Home</Button>,
        <Button.Link href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
          📱 Open App
        </Button.Link>,
      ],
    })
  }

  // Default home view
  return c.res({
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
          color: 'white',
          fontFamily: 'system-ui',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px' }}>
          📖 Guest Book
        </h1>
        <p style={{ fontSize: '36px', marginBottom: '40px', opacity: 0.9 }}>
          on Base Network
        </p>
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '30px',
            padding: '40px 60px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '56px', fontWeight: 'bold' }}>{messageCount}</p>
            <p style={{ fontSize: '24px', opacity: 0.9 }}>Messages</p>
          </div>
          <div
            style={{
              width: '2px',
              background: 'rgba(255,255,255,0.3)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '56px', fontWeight: 'bold' }}>{todoCount}</p>
            <p style={{ fontSize: '24px', opacity: 0.9 }}>Todos</p>
          </div>
          <div
            style={{
              width: '2px',
              background: 'rgba(255,255,255,0.3)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '56px', fontWeight: 'bold' }}>{completedTodoCount}</p>
            <p style={{ fontSize: '24px', opacity: 0.9 }}>Completed</p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value="view_messages">📬 Messages</Button>,
      <Button value="view_todos">✅ Todos</Button>,
      <Button.Link href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
        📱 Open App
      </Button.Link>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
