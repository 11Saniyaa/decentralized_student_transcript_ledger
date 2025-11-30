import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Student Transcript Ledger - Blockchain-Based Academic Records</title>
        <meta name="description" content="Blockchain-based Student Transcript Ledger" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%'
        }}>
          {/* Logo/Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            borderRadius: '50%',
            margin: '0 auto 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            boxShadow: '0 20px 60px rgba(37, 99, 235, 0.4)',
            border: '3px solid #3b82f6'
          }}>
            TL
          </div>

          {/* Title */}
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800',
            marginBottom: '20px',
            color: 'white',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.2'
          }}>
            Student Transcript Ledger
          </h1>

          {/* Subtitle */}
          <p style={{ 
            fontSize: '1.4rem', 
            marginBottom: '60px', 
            color: '#cbd5e1',
            fontWeight: '300',
            textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)'
          }}>
            Blockchain-based transcript management system
            <br />
            <span style={{ fontSize: '1rem', opacity: 0.8, color: '#94a3b8' }}>
              Secure • Immutable • Decentralized
            </span>
          </p>

          {/* Login Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              className="btn btn-primary"
              onClick={() => router.push('/login/institution')}
              style={{ 
                padding: '18px 50px', 
                fontSize: '18px',
                minWidth: '220px',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)'
              }}
            >
              Institution Login
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/login/student')}
              style={{ 
                padding: '18px 50px', 
                fontSize: '18px',
                minWidth: '220px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}
            >
              Student Login
            </button>
          </div>

          {/* Features */}
          <div style={{
            marginTop: '80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            width: '100%'
          }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px 20px',
              border: '1px solid #334155'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '15px',
                color: '#2563eb',
                fontWeight: 'bold'
              }}>SEC</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Secure</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Blockchain-verified records
              </p>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px 20px',
              border: '1px solid #334155'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '15px',
                color: '#2563eb',
                fontWeight: 'bold'
              }}>IPFS</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>IPFS Storage</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Decentralized file storage
              </p>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px 20px',
              border: '1px solid #334155'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '15px',
                color: '#2563eb',
                fontWeight: 'bold'
              }}>VER</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Verified</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Immutable transaction history
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
