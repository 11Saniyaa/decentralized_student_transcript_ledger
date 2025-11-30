import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { connectMetaMask, getWalletInfo, onAccountsChanged, onChainChanged, type WalletInfo } from '../../utils/metamask'
import { issueTranscriptOnChain, getContractAddress } from '../../utils/contract'
import { importHardhatAccount } from '../../utils/import-hardhat-account'
import { fundMyAccount } from '../../utils/fundAccount'

const API_URL = 'http://localhost:5001'

interface Student {
  _id: string
  studentName: string
  studentPRN: string
  email: string
  department: string
  year: string
}

interface Transcript {
  _id: string
  studentPRN: string
  studentName: string
  docName: string
  ipfsCid: string
  ipfsUrl: string
  uploadDate: string
  metadata: {
    gpa: string
    degree: string
    semester: string
  }
  txHash: string
  blockNumber: number
}

export default function CreateTranscript() {
  const router = useRouter()
  const [searchPRN, setSearchPRN] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [showImportHelp, setShowImportHelp] = useState(false)
  const [funding, setFunding] = useState(false)
  const [formData, setFormData] = useState({
    docName: '',
    gpa: '',
    degree: '',
    semester: '',
    uploaderInstitution: 'Institution',
  })
  const [file, setFile] = useState<File | null>(null)

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

    checkWalletConnection()
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

  const handleSearch = async () => {
    if (!searchPRN.trim()) {
      setMessage({ type: 'error', text: 'Please enter a PRN / Enrollment number to search' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const [studentRes, transcriptsRes] = await Promise.all([
        axios.get(`${API_URL}/api/students/${searchPRN}`),
        axios.get(`${API_URL}/api/transcripts/${searchPRN}`),
      ])

      setStudent(studentRes.data)
      setTranscripts(transcriptsRes.data)
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMessage({ type: 'error', text: `Student with PRN "${searchPRN}" not found. Please register the student first or check the PRN.` })
        setStudent(null)
        setTranscripts([])
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch student data. Make sure backend is running.' })
        console.error('Search error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!student) {
      setMessage({ type: 'error', text: 'Please search for a student first' })
      return
    }

    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' })
      return
    }

    if (!formData.docName) {
      setMessage({ type: 'error', text: 'Please enter a document name' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // First, upload to IPFS and get CID (via backend)
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('studentPRN', student.studentPRN)
      uploadData.append('docName', formData.docName)
      uploadData.append('gpa', formData.gpa)
      uploadData.append('degree', formData.degree)
      uploadData.append('semester', formData.semester)
      uploadData.append('uploaderInstitution', formData.uploaderInstitution)

      // Upload file to backend (gets IPFS CID)
      const uploadResponse = await axios.post(`${API_URL}/api/transcripts`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const transcript = uploadResponse.data.transcript
      const ipfsCid = transcript.ipfsCid

      // ALWAYS use MetaMask to generate transaction hash (if wallet is connected)
      let txHash = ''
      let blockNumber = 0
      
      if (wallet && wallet.isConnected) {
        try {
          const contractAddress = await getContractAddress()
          if (!contractAddress) {
            setMessage({ type: 'warning', text: '⚠️ Contract address not configured. Transcript uploaded but no blockchain hash generated.' })
          } else {
            setMessage({ type: 'info', text: '⏳ Generating transaction hash via MetaMask... Please confirm in MetaMask popup.' })
            
            // Call MetaMask transaction - user must approve in popup
            const txResult = await issueTranscriptOnChain(
              contractAddress,
              student.studentPRN,
              ipfsCid,
              formData.docName
            )
            
            txHash = txResult.txHash
            blockNumber = txResult.blockNumber
            
            // Update transcript with transaction hash
            await axios.put(`${API_URL}/api/transcripts/${transcript._id}`, {
              txHash,
              blockNumber
            })
            
            setMessage({ type: 'success', text: `✅ Transcript uploaded and verified on blockchain! Hash: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 6)}` })
          }
        } catch (error: any) {
          console.error('MetaMask transaction error:', error)
          
          // Provide helpful error messages
          let errorMsg = error.message || 'Unknown error'
          if (error.code === 4001 || error.message?.includes('user rejected') || error.message?.includes('not been authorized')) {
            errorMsg = 'Transaction was rejected in MetaMask. Please approve the transaction to generate a hash.'
          } else if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient funds')) {
            errorMsg = 'Insufficient ETH for gas fees. Click "Get Free ETH" button to fund your account, then try again.'
          } else if (error.message?.includes('already pending') || error.code === -32002) {
            errorMsg = 'A MetaMask request is already pending. Please check MetaMask and approve/reject it, then try uploading again.'
          } else if (error.message?.includes('network')) {
            errorMsg = 'Please switch MetaMask to Hardhat Local network (Chain ID: 1337)'
          } else if (error.message?.includes('not connected')) {
            errorMsg = 'Please connect MetaMask wallet first'
          } else if (error.message?.includes('transaction is already pending')) {
            errorMsg = 'Please wait for the current transaction to complete before uploading another transcript.'
          }
          
          setMessage({ type: 'warning', text: `⚠️ Transcript uploaded to IPFS, but blockchain hash generation failed: ${errorMsg}` })
        }
      } else {
        setMessage({ type: 'warning', text: '⚠️ Connect MetaMask and upload again to generate blockchain transaction hash.' })
      }

      // Refresh transcripts
      const transcriptsRes = await axios.get(`${API_URL}/api/transcripts/${student.studentPRN}`)
      setTranscripts(transcriptsRes.data)

      // Reset form
      setFormData({
        docName: '',
        gpa: '',
        degree: '',
        semester: '',
        uploaderInstitution: 'Institution',
      })
      setFile(null)
      if (e.target instanceof HTMLFormElement) {
        e.target.reset()
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to upload transcript',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create Transcript - Institution Dashboard</title>
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
                Create Transcript
              </h1>
              <Link href="/institution" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#e0e0e0' }}>Upload Student Transcript</h2>

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
                  Connect your MetaMask wallet to create transcripts
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

          <div className="form-group">
            <label>Search Student by PRN / Enrollment Number</label>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '10px' }}>
              Enter the student's PRN (Permanent Registration Number) or Enrollment number
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Enter Student PRN / Enrollment Number"
                value={searchPRN}
                onChange={(e) => setSearchPRN(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <Link href="/institution/students" style={{ fontSize: '14px', color: '#3b82f6', marginTop: '10px', display: 'block' }}>
              Or view all students to find PRN →
            </Link>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          {student && (
            <>
              <div className="card" style={{ marginTop: '20px', backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                <h3 style={{ color: '#e0e0e0' }}>Student Information</h3>
                <p style={{ color: '#cbd5e1' }}><strong style={{ color: '#e0e0e0' }}>Name:</strong> {student.studentName}</p>
                <p style={{ color: '#cbd5e1' }}><strong style={{ color: '#e0e0e0' }}>PRN:</strong> {student.studentPRN}</p>
                <p style={{ color: '#cbd5e1' }}><strong style={{ color: '#e0e0e0' }}>Email:</strong> {student.email}</p>
                <p style={{ color: '#cbd5e1' }}><strong style={{ color: '#e0e0e0' }}>Department:</strong> {student.department}</p>
                <p style={{ color: '#cbd5e1' }}><strong style={{ color: '#e0e0e0' }}>Year:</strong> {student.year}</p>
              </div>

              <div className="card" style={{ marginTop: '20px' }}>
                <h3>Upload New Transcript</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="file">PDF File *</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="docName">Document Name *</label>
                    <input
                      type="text"
                      id="docName"
                      name="docName"
                      value={formData.docName}
                      onChange={handleFormChange}
                      placeholder="e.g., Transcript_Semester1_2024.pdf"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gpa">GPA</label>
                    <input
                      type="text"
                      id="gpa"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleFormChange}
                      placeholder="e.g., 8.5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="degree">Degree</label>
                    <input
                      type="text"
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleFormChange}
                      placeholder="e.g., Bachelor of Technology"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="semester">Semester</label>
                    <input
                      type="text"
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleFormChange}
                      placeholder="e.g., Semester 1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                    style={{ width: '100%' }}
                  >
                    {uploading ? 'Uploading...' : 'Create Transcript'}
                  </button>
                </form>
              </div>

              {transcripts.length > 0 && (
                <div className="card" style={{ marginTop: '20px' }}>
                  <h3>Existing Transcripts ({transcripts.length})</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Upload Date</th>
                        <th>GPA</th>
                        <th>Actions</th>
                        <th>Transaction Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transcripts.map((transcript) => (
                        <tr key={transcript._id}>
                          <td>{transcript.docName}</td>
                          <td>{new Date(transcript.uploadDate).toLocaleDateString()}</td>
                          <td>{transcript.metadata.gpa || 'N/A'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <a
                                href={transcript.ipfsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ fontSize: '12px', padding: '6px 12px' }}
                              >
                                View
                              </a>
                              <a
                                href={transcript.ipfsUrl}
                                download
                                className="btn"
                                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#10b981', color: 'white', textDecoration: 'none' }}
                              >
                                Download
                              </a>
                            </div>
                          </td>
                          <td>
                            {transcript.txHash ? (
                              <a
                                href={`https://sepolia.etherscan.io/tx/${transcript.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#0070f3', fontSize: '12px' }}
                              >
                                {transcript.txHash.substring(0, 10)}...
                              </a>
                            ) : (
                              <span style={{ color: '#999' }}>Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
          </>
        )}
      </main>
    </>
  )
}
