import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { connectMetaMask, getWalletAddress, onAccountsChanged, type WalletInfo } from '../../utils/metamask'

const API_URL = 'http://localhost:5001'

export default function RegisterStudent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studentName: '',
    studentPRN: '',
    email: '',
    department: '',
    year: '',
    dob: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if institution is logged in
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('institutionLoggedIn')
      if (loggedIn !== 'true') {
        router.push('/login/institution')
        return
      }
      setAuthenticated(true)
    }

    // Check if wallet is already connected
    checkWalletConnection()

    // Listen for account changes
    onAccountsChanged((accounts) => {
      if (accounts.length > 0) {
        checkWalletConnection()
      } else {
        setWallet(null)
      }
    })
  }, [router])

  const checkWalletConnection = async () => {
    try {
      const address = await getWalletAddress()
      if (address) {
        setWallet({
          address,
          chainId: 0,
          isConnected: true,
        })
      }
    } catch (error) {
      console.error('Error checking wallet:', error)
    }
  }

  const handleConnectWallet = async () => {
    setConnecting(true)
    setMessage(null)
    try {
      const walletInfo = await connectMetaMask()
      setWallet(walletInfo)
      setMessage({ type: 'success', text: 'Wallet connected successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to connect wallet' })
    } finally {
      setConnecting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Use hardcoded URL to ensure it works
    const apiUrl = 'http://localhost:5001/api/students'
    
    console.log('Submitting to:', apiUrl)
    console.log('Data:', formData)

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      })
      
      console.log('Success response:', response)
      setMessage({ type: 'success', text: 'Student registered successfully!' })
      setFormData({
        studentName: '',
        studentPRN: '',
        email: '',
        department: '',
        year: '',
        dob: '',
      })
    } catch (error: any) {
      console.error('Registration error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      })
      
      let errorMessage = 'Failed to register student'
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.error || error.response.data?.details || errorMessage
        if (error.response.data?.details) {
          errorMessage += ': ' + error.response.data.details
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:5001'
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage
      }
      
      setMessage({
        type: 'error',
        text: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register Student - Institution Dashboard</title>
      </Head>
      <main className="container">
        {!authenticated ? (
          <div className="loading">Checking authentication...</div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              background: '#1a1f3a',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              border: '1px solid #2a2f4a'
            }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#e0e0e0', margin: 0 }}>
                Register New Student
              </h1>
              <Link href="/institution" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#e0e0e0' }}>Student Registration Form</h2>

          {/* MetaMask Wallet Connection */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
            {wallet ? (
              <div>
                <p style={{ margin: 0, color: '#10b981' }}>
                  Wallet Connected: {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '10px', color: '#94a3b8' }}>
                  Connect your MetaMask wallet to register students
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConnectWallet}
                  disabled={connecting}
                >
                  {connecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentName">Student Name *</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentPRN">Student PRN *</label>
              <input
                type="text"
                id="studentPRN"
                name="studentPRN"
                value={formData.studentPRN}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Registering...' : 'Register Student'}
            </button>
            </form>
          </div>
          </>
        )}
      </main>
    </>
  )
}
