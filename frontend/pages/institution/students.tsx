import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'

const API_URL = 'http://localhost:5001'

interface Student {
  _id: string
  studentName: string
  studentPRN: string
  email: string
  department: string
  year: string
  dob: string
  createdAt: string
}

interface Transcript {
  _id: string
  studentPRN: string
  docName: string
  uploadDate: string
  txHash: string
  ipfsUrl: string
}

export default function ViewStudents() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
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
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [studentsRes, transcriptsRes] = await Promise.all([
        axios.get(`${API_URL}/api/students`),
        axios.get(`${API_URL}/api/transcripts`)
      ])
      setStudents(studentsRes.data)
      setTranscripts(transcriptsRes.data)
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTranscriptCount = (prn: string) => {
    return transcripts.filter(t => t.studentPRN === prn).length
  }

  const getLatestTranscript = (prn: string) => {
    const studentTranscripts = transcripts
      .filter(t => t.studentPRN === prn)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    return studentTranscripts[0] || null
  }

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase()
    return (
      student.studentName.toLowerCase().includes(searchLower) ||
      student.studentPRN.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.department.toLowerCase().includes(searchLower) ||
      student.year.toLowerCase().includes(searchLower)
    )
  })

  return (
    <>
      <Head>
        <title>View Students - Institution Dashboard</title>
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
                Registered Students
              </h1>
              <Link href="/institution" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', color: '#e0e0e0' }}>Student Directory</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search by name, PRN, email, department, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '2px solid #334155',
                  borderRadius: '8px',
                  width: '300px',
                  background: '#0f172a',
                  color: '#e0e0e0'
                }}
              />
              <button
                onClick={fetchData}
                className="btn btn-primary"
                style={{ padding: '8px 15px' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading students...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              {searchTerm ? (
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>No students found matching "{searchTerm}"</p>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>No students registered yet.</p>
              )}
            </div>
          ) : (
            <>
              <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '15px' }}>
                Total: <strong style={{ color: '#e0e0e0' }}>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''}
                {searchTerm && ` (filtered from ${students.length} total)`}
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>PRN / Enrollment</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Transcripts</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Latest Transcript</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const transcriptCount = getTranscriptCount(student.studentPRN)
                      const latestTranscript = getLatestTranscript(student.studentPRN)
                      const studentTranscripts = transcripts.filter(t => t.studentPRN === student.studentPRN)
                      
                      return (
                        <tr key={student._id}>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>{student.studentName}</td>
                          <td style={{ padding: '12px', fontFamily: 'monospace', color: '#cbd5e1' }}>{student.studentPRN}</td>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>{student.email}</td>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>{student.department}</td>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>{student.year}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              backgroundColor: transcriptCount > 0 ? '#064e3b' : '#7f1d1d',
                              color: transcriptCount > 0 ? '#6ee7b7' : '#fca5a5',
                              fontWeight: 'bold',
                              border: `1px solid ${transcriptCount > 0 ? '#10b981' : '#ef4444'}`
                            }}>
                              {transcriptCount}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {latestTranscript ? (
                              <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#e0e0e0' }}>{latestTranscript.docName}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                                  {new Date(latestTranscript.uploadDate).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  <a
                                    href={latestTranscript.ipfsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: '12px',
                                      color: '#0070f3',
                                      textDecoration: 'none',
                                      padding: '4px 8px',
                                      border: '1px solid #0070f3',
                                      borderRadius: '4px',
                                      display: 'inline-block'
                                    }}
                                  >
                                    View PDF
                                      </a>
                                      <a
                                        href={latestTranscript.ipfsUrl}
                                        download
                                        style={{
                                          fontSize: '12px',
                                          color: '#10b981',
                                          textDecoration: 'none',
                                          padding: '4px 8px',
                                          border: '1px solid #10b981',
                                          borderRadius: '4px',
                                          display: 'inline-block'
                                        }}
                                      >
                                        Download
                                  </a>
                                  {transcriptCount > 1 && (
                                    <span style={{ fontSize: '11px', color: '#666', padding: '4px 8px' }}>
                                      +{transcriptCount - 1} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#999' }}>No transcripts</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {transcriptCount > 0 ? (
                              <div>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  backgroundColor: '#d1ecf1',
                                  color: '#0c5460',
                                  fontSize: '12px',
                                  display: 'inline-block',
                                  marginBottom: '5px'
                                }}>
                                  {latestTranscript?.txHash ? 'Verified' : 'Uploaded'}
                                </span>
                                {studentTranscripts.length > 0 && (
                                  <div style={{ marginTop: '5px' }}>
                                    <button
                                      onClick={() => {
                                        const modal = document.getElementById(`modal-${student._id}`)
                                        if (modal) modal.style.display = 'block'
                                      }}
                                      style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      View All ({transcriptCount})
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                backgroundColor: '#fff3cd',
                                color: '#856404',
                                fontSize: '12px'
                              }}>
                                No Transcripts
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Modal for viewing all transcripts */}
        {students.map((student) => {
          const studentTranscripts = transcripts.filter(t => t.studentPRN === student.studentPRN)
          if (studentTranscripts.length === 0) return null
          
          return (
            <div
              key={`modal-${student._id}`}
              id={`modal-${student._id}`}
              style={{
                display: 'none',
                position: 'fixed',
                zIndex: 1000,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                overflow: 'auto'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  const modal = document.getElementById(`modal-${student._id}`)
                  if (modal) modal.style.display = 'none'
                }
              }}
            >
              <div style={{
                backgroundColor: '#fff',
                margin: '50px auto',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Transcripts for {student.studentName} ({student.studentPRN})</h2>
                  <button
                    onClick={() => {
                      const modal = document.getElementById(`modal-${student._id}`)
                      if (modal) modal.style.display = 'none'
                    }}
                    style={{
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    ×
                  </button>
                </div>
                
                {studentTranscripts.map((transcript) => (
                  <div key={transcript._id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{transcript.docName}</h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                          Uploaded: {new Date(transcript.uploadDate).toLocaleString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a
                          href={transcript.ipfsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '14px', padding: '8px 15px' }}
                        >
                          View PDF
                        </a>
                        <a
                          href={transcript.ipfsUrl}
                          download
                          className="btn"
                          style={{ fontSize: '14px', padding: '8px 15px', backgroundColor: '#10b981', color: 'white' }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                    {transcript.txHash && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <p style={{ margin: 0, fontSize: '12px' }}>
                          <strong>Verified on Blockchain:</strong>{' '}
                          <a
                            href={`https://sepolia.etherscan.io/tx/${transcript.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0070f3' }}
                          >
                            {transcript.txHash.substring(0, 10)}...{transcript.txHash.substring(transcript.txHash.length - 8)}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
          </>
        )}
      </main>
    </>
  )
}

