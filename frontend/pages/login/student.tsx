import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function StudentLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    prn: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.prn.trim()) {
      setError('Please enter your PRN / Enrollment Number')
      setLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError('Please enter your password')
      setLoading(false)
      return
    }

    // Store PRN in sessionStorage for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studentPRN', formData.prn.trim())
      sessionStorage.setItem('studentLoggedIn', 'true')
    }

    // Small delay for better UX
    setTimeout(() => {
      router.push(`/student?prn=${encodeURIComponent(formData.prn.trim())}`)
    }, 300)
  }

  return (
    <>
      <Head>
        <title>Student Login - Transcript Ledger</title>
      </Head>
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%'
        }}>
          <div className="card" style={{
            background: '#1a1f3a',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid #2a2f4a'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold',
                border: '2px solid #3b82f6'
              }}>
                STUD
              </div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#e0e0e0',
                marginBottom: '10px'
              }}>
                Student Login
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                View your transcripts and academic records
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="prn" style={{ 
                  fontWeight: '600', 
                  color: '#e0e0e0',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  PRN / Enrollment Number *
                </label>
                <input
                  type="text"
                  id="prn"
                  name="prn"
                  value={formData.prn}
                  onChange={handleChange}
                  placeholder="Enter your PRN"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #334155',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontFamily: 'monospace',
                    background: '#0f172a',
                    color: '#e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" style={{ 
                  fontWeight: '600', 
                  color: '#e0e0e0',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #334155',
                    borderRadius: '10px',
                    fontSize: '15px',
                    background: '#0f172a',
                    color: '#e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginTop: '10px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Logging in...' : 'View My Transcripts'}
              </button>
            </form>

            <div style={{ 
              marginTop: '25px', 
              paddingTop: '25px', 
              borderTop: '1px solid #334155',
              textAlign: 'center'
            }}>
              <Link href="/" style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ← Back to Home
              </Link>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: '#0f172a',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'center',
              border: '1px solid #1e293b'
            }}>
              <strong style={{ color: '#94a3b8' }}>Demo Mode:</strong> Enter your PRN and any password
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
