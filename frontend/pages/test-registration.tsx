// Simple test page to verify registration works
import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function TestRegistration() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    setLoading(true)
    setResult(null)

    const testData = {
      studentName: "Test Student",
      studentPRN: "PRN_TEST_" + Date.now(),
      email: "test@test.com",
      department: "CSE",
      year: "2024"
    }

    try {
      console.log('Sending request to:', `${API_URL}/api/students`)
      console.log('Data:', testData)
      
      const response = await axios.post(`${API_URL}/api/students`, testData)
      
      console.log('Response:', response)
      setResult({
        success: true,
        status: response.status,
        data: response.data
      })
    } catch (error: any) {
      console.error('Error:', error)
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request ? 'Request made but no response' : null
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Registration Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testRegistration} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>
      </div>

      {result && (
        <div style={{
          padding: '20px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h2>{result.success ? '✅ Success!' : '❌ Error'}</h2>
          
          {result.success ? (
            <div>
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Message:</strong> {result.data.message}</p>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {result.error}</p>
              {result.status && <p><strong>Status Code:</strong> {result.status}</p>}
              {result.response && (
                <div>
                  <p><strong>Server Response:</strong></p>
                  <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                </div>
              )}
              {result.request && <p><strong>Note:</strong> {result.request}</p>}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
        <h3>📝 Test Details</h3>
        <p><strong>API URL:</strong> {API_URL}/api/students</p>
        <p><strong>Method:</strong> POST</p>
        <p><strong>Expected Status:</strong> 201 (Created)</p>
      </div>
    </div>
  )
}

