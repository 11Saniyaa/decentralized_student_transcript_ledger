import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { connectMetaMask, getWalletInfo, onAccountsChanged, onChainChanged, type WalletInfo } from '../../utils/metamask'
import { importHardhatAccount, getHardhatAccountInfo } from '../../utils/import-hardhat-account'
import { fundMyAccount } from '../../utils/fundAccount'

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
  const [showImportHelp, setShowImportHelp] = useState(false)
  const [funding, setFunding] = useState(false)

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

    // Listen for chain changes
    onChainChanged(() => {
      checkWalletConnection()
    })
  }, [router])

  const checkWalletConnection = async () => {
    try {
      const walletInfo = await getWalletInfo()
      if (walletInfo) {
        setWallet(walletInfo)
      } else {
        setWallet(null)
      }
    } catch (error) {
      console.error('Error checking wallet:', error)
      setWallet(null)
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
      if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient funds')) {
        setShowImportHelp(true)
        setMessage({ 
          type: 'error', 
          text: 'Insufficient ETH. Click "Import Hardhat Account" below to get test ETH.' 
        })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to connect wallet' })
      }
    } finally {
      setConnecting(false)
    }
  }

  const handleImportAccount = async () => {
    try {
      const result = await importHardhatAccount(0)
      if (result.success) {
        setMessage({ 
          type: 'info', 
          text: result.message 
        })
        // Show instructions
        alert(`Private key copied! Steps:\n\n1. Open MetaMask\n2. Click account icon (top right)\n3. Click "Import Account"\n4. Paste the private key\n5. Click "Import"\n6. Switch to imported account\n7. It has 10,000 ETH!`)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to get account info' })
    }
  }

  const handleFundAccount = async () => {
    if (!wallet) {
      setMessage({ type: 'error', text: 'Please connect MetaMask first' })
      return
    }

    setFunding(true)
    setMessage({ type: 'info', text: 'Requesting ETH from Hardhat...' })
    
    try {
      const result = await fundMyAccount('1.0')
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ Account funded! Received 1.0 ETH. Balance: ${result.balance} ETH. Transaction: ${result.txHash?.substring(0, 10)}...` 
        })
        // Refresh wallet info to show new balance
        setTimeout(async () => {
          const walletInfo = await getWalletInfo()
          if (walletInfo) {
            setWallet(walletInfo)
          }
        }, 2000)
      } else {
        const errorMsg = result.error || 'Failed to fund account'
        let detailedMsg = errorMsg
        if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('connect')) {
          detailedMsg = 'Cannot connect to Hardhat node. Make sure it is running: cd contract && npx hardhat node'
        }
        setMessage({ 
          type: 'error', 
          text: detailedMsg
        })
      }
    } catch (error: any) {
      console.error('Fund account error:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to fund account. Make sure Hardhat node is running on http://localhost:8545' 
      })
    } finally {
      setFunding(false)
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <p style={{ margin: 0, color: '#10b981' }}>
                    Wallet Connected: {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                  </p>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: wallet.chainId === 1337 || wallet.chainId === 11155111 ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}>
                    {wallet.chainId === 1337 ? 'Hardhat Local' : wallet.chainId === 11155111 ? 'Sepolia' : `Chain ${wallet.chainId}`}
                  </span>
                </div>
                {(wallet.chainId !== 1337 && wallet.chainId !== 11155111) && (
                  <p style={{ margin: 0, fontSize: '12px', color: '#fbbf24' }}>
                    ⚠️ Please switch to Hardhat Local (Chain ID: 1337) for transactions
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '10px', color: '#94a3b8' }}>
                  Connect your MetaMask wallet to register students
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConnectWallet}
                    disabled={connecting}
                  >
                    {connecting ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleImportAccount}
                    style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}
                  >
                    Import Hardhat Account
                  </button>
                </div>
                {wallet && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleFundAccount}
                      disabled={funding}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}
                    >
                      {funding ? 'Funding...' : '💰 Get Free ETH (1.0 ETH)'}
                    </button>
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                      Automatically fund your account with 1.0 ETH from Hardhat
                    </p>
                  </div>
                )}
                {showImportHelp && (
                  <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#1e3a8a', borderRadius: '6px', border: '1px solid #3b82f6' }}>
                    <p style={{ margin: '0 0 10px 0', color: '#93c5fd', fontSize: '14px' }}>
                      <strong>Need Test ETH?</strong> Import Hardhat Account #0 (has 10,000 ETH):
                    </p>
                    <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                      <p style={{ margin: '0 0 5px 0', color: '#cbd5e1', fontSize: '12px' }}>Private Key:</p>
                      <code style={{ color: '#10b981', fontSize: '11px', wordBreak: 'break-all' }}>
                        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
                      </code>
                    </div>
                    <ol style={{ margin: '0', paddingLeft: '20px', color: '#cbd5e1', fontSize: '12px' }}>
                      <li>Open MetaMask → Account icon → "Import Account"</li>
                      <li>Paste the private key above</li>
                      <li>Click "Import"</li>
                      <li>Switch to imported account (has 10,000 ETH!)</li>
                    </ol>
                  </div>
                )}
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
