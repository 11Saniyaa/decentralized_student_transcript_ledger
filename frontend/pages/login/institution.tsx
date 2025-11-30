import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function InstitutionLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: 'viit',
    password: 'viit'
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

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password')
      setLoading(false)
      return
    }

    // Mock authentication - in production, this would call an API
    // For now, accept any credentials (demo mode)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('institutionLoggedIn', 'true')
      sessionStorage.setItem('institutionUsername', formData.username)
    }

    // Small delay for better UX
    setTimeout(() => {
      router.push('/institution')
    }, 300)
  }

  return (
    <>
      <Head>
        <title>Institution Login - Transcript Ledger</title>
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
                INST
              </div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#e0e0e0',
                marginBottom: '10px'
              }}>
                Institution Login
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                Access your institution dashboard
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" style={{ 
                  fontWeight: '600', 
                  color: '#e0e0e0',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
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
                {loading ? 'Logging in...' : 'Login'}
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

          </div>
        </div>
      </main>
    </>
  )
}
