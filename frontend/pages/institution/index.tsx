import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function InstitutionDashboard() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if logged in
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('institutionLoggedIn')
      const user = sessionStorage.getItem('institutionUsername')
      
      if (!loggedIn || loggedIn !== 'true') {
        router.push('/login/institution')
        return
      }
      
      setUsername(user || 'Institution')
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('institutionLoggedIn')
      sessionStorage.removeItem('institutionUsername')
    }
    router.push('/login/institution')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Institution Dashboard - Transcript Ledger</title>
      </Head>
      <main className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          padding: '20px',
          background: '#1a1f3a',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2a2f4a'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#e0e0e0',
              marginBottom: '5px'
            }}>
              Institution Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Welcome, <strong style={{ color: '#cbd5e1' }}>{username}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ fontSize: '14px', padding: '10px 20px' }}
            >
              Logout
            </button>
            <Link href="/" className="btn btn-secondary" style={{ fontSize: '14px', padding: '10px 20px' }}>
              Home
            </Link>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px' 
        }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #2563eb',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px',
              color: '#2563eb',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>REG</div>
            <h2 style={{ color: '#e0e0e0', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>
              Register Student
            </h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '15px' }}>
              Register a new student in the system
            </p>
            <Link href="/institution/register" className="btn btn-primary" style={{
              display: 'inline-block',
              textDecoration: 'none'
            }}>
              Go to Register Student →
            </Link>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #2563eb',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px',
              color: '#2563eb',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>VIEW</div>
            <h2 style={{ color: '#e0e0e0', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>
              View All Students
            </h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '15px' }}>
              View all registered students, search by enrollment, and check transcript status
            </p>
            <Link href="/institution/students" className="btn btn-primary" style={{
              display: 'inline-block',
              textDecoration: 'none'
            }}>
              View Students →
            </Link>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #2563eb',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px',
              color: '#2563eb',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>UPL</div>
            <h2 style={{ color: '#e0e0e0', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>
              Create Transcript
            </h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '15px' }}>
              Upload and issue a transcript for a student
            </p>
            <Link href="/institution/create-transcript" className="btn btn-primary" style={{
              display: 'inline-block',
              textDecoration: 'none'
            }}>
              Go to Create Transcript →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
