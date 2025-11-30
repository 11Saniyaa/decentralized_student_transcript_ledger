import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'

const API_URL = 'http://localhost:5001'

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

interface Student {
  _id: string
  studentName: string
  studentPRN: string
  email: string
  department: string
  year: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [studentPRN, setStudentPRN] = useState<string>('')

  useEffect(() => {
    // Get PRN from URL query or sessionStorage
    const prnFromUrl = router.query.prn as string
    const prnFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('studentPRN') : null
    const prn = prnFromUrl || prnFromStorage || ''

    if (!prn) {
      // No PRN found, redirect to login
      router.push('/login/student')
      return
    }

    setStudentPRN(prn)
    fetchStudentData(prn)
  }, [router.query])

  const fetchStudentData = async (prn: string) => {
    try {
      setLoading(true)
      // Fetch student info and their transcripts
      const [studentRes, transcriptsRes] = await Promise.all([
        axios.get(`${API_URL}/api/students/${prn}`).catch(() => ({ data: null })),
        axios.get(`${API_URL}/api/transcripts/${prn}`)
      ])

      if (studentRes.data) {
        setStudent(studentRes.data)
      }

      // Only show transcripts for this student's PRN
      const studentTranscripts = transcriptsRes.data.filter((t: Transcript) => t.studentPRN === prn)
      setTranscripts(studentTranscripts)
      setError(null)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`Student with PRN "${prn}" not found. Please check your PRN.`)
      } else {
        setError('Failed to fetch your transcripts')
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const getEtherscanUrl = (txHash: string) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`
  }

  return (
    <>
      <Head>
        <title>Student Dashboard - Transcript Ledger</title>
      </Head>
      <main className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          padding: '20px',
          background: '#1a1f3a',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2a2f4a'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#e0e0e0', marginBottom: '10px' }}>
              My Transcripts
            </h1>
            {student && (
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                <strong style={{ color: '#cbd5e1' }}>{student.studentName}</strong> ({student.studentPRN}) - {student.department}, Year {student.year}
              </p>
            )}
            {studentPRN && !student && (
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                PRN: <strong style={{ color: '#cbd5e1' }}>{studentPRN}</strong>
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('studentPRN')
                  sessionStorage.removeItem('studentLoggedIn')
                }
                router.push('/login/student')
              }}
              className="btn btn-secondary"
              style={{ fontSize: '14px', padding: '10px 20px' }}
            >
              Switch Student
            </button>
            <Link href="/" className="btn btn-secondary" style={{ fontSize: '14px', padding: '10px 20px' }}>
              Home
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading your transcripts...</div>
        ) : error ? (
          <div className="card">
            <div className="alert alert-error">{error}</div>
            <div style={{ marginTop: '20px' }}>
              <Link href="/login/student" className="btn btn-primary">
                Enter Different PRN
              </Link>
            </div>
          </div>
        ) : transcripts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '20px',
              color: '#2563eb',
              fontWeight: 'bold',
              letterSpacing: '4px'
            }}>N/A</div>
            <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#e0e0e0' }}>No Transcripts Found</h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '16px' }}>
              {student 
                ? `No transcripts have been uploaded for ${student.studentName} (${student.studentPRN}) yet.`
                : `No transcripts found for PRN: ${studentPRN}`
              }
            </p>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Please contact your institution to upload your transcripts.
            </p>
          </div>
        ) : (
          <>
            <div className="card" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #2563eb'
            }}>
              <h2 style={{ color: '#e0e0e0', fontSize: '24px', marginBottom: '10px' }}>My Transcripts</h2>
              <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
                You have <strong style={{ color: '#cbd5e1' }}>{transcripts.length}</strong> transcript{transcripts.length !== 1 ? 's' : ''} on record
              </p>
            </div>

            {transcripts.map((transcript) => (
              <div key={transcript._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3>{transcript.docName}</h3>
                    <p style={{ color: '#666', marginTop: '5px' }}>
                      <strong>Document:</strong> {transcript.docName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <a
                        href={transcript.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '10px 20px' }}
                      >
                        View PDF
                          </a>
                          <a
                            href={transcript.ipfsUrl}
                            download
                            className="btn"
                            style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', textDecoration: 'none' }}
                          >
                            Download
                          </a>
                        </div>
                        {transcript.txHash && (
                          <a
                            href={getEtherscanUrl(transcript.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '12px', color: '#3b82f6' }}
                          >
                            View on Etherscan
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <p><strong>Upload Date:</strong> {new Date(transcript.uploadDate).toLocaleString()}</p>
                  {transcript.metadata.gpa && <p><strong>GPA:</strong> {transcript.metadata.gpa}</p>}
                  {transcript.metadata.degree && <p><strong>Degree:</strong> {transcript.metadata.degree}</p>}
                  {transcript.metadata.semester && <p><strong>Semester:</strong> {transcript.metadata.semester}</p>}
                  {transcript.txHash && (
                    <p>
                      <strong>Transaction Hash:</strong>{' '}
                      <a
                        href={getEtherscanUrl(transcript.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0070f3' }}
                      >
                        {transcript.txHash}
                      </a>
                    </p>
                  )}
                  {transcript.blockNumber > 0 && (
                    <p><strong>Block Number:</strong> {transcript.blockNumber}</p>
                  )}
                </div>

                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Preview:</h4>
                  <iframe
                    src={transcript.ipfsUrl}
                    width="100%"
                    height="600px"
                    style={{ border: '1px solid #ddd', borderRadius: '5px' }}
                    title={transcript.docName}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </>
  )
}
