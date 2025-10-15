import { useState } from 'react';
import { Upload, FileAudio, Loader2, Mic, Zap, CheckCircle } from 'lucide-react';

export default function AudioSummarizer() {
  const [file, setFile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processAudio = async () => {
    if (!file) {
      setError('Please select an audio file');
      return;
    }
    if (!apiKey) {
      setError('Please enter your Google AI Studio API key');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const base64Audio = await fileToBase64(file);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Please transcribe this audio file and provide: 1) A full transcript, 2) A brief summary, 3) Any action items or key points mentioned. Format your response clearly with these three sections."
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Audio
                  }
                }
              ]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed. Check your API key.');
      }

      const data = await response.json();
      const fullText = data.candidates[0]?.content?.parts[0]?.text || '';

      const summaryMatch = fullText.match(/summary:?\s*(.*?)(?=action items|key points|transcript|$)/is);
      const actionMatch = fullText.match(/(?:action items|key points):?\s*(.*?)(?=transcript|$)/is);
      const transcriptMatch = fullText.match(/transcript:?\s*(.*?)$/is);

      const summary = summaryMatch ? summaryMatch[1].trim() : fullText.substring(0, 500);
      const actionItems = actionMatch ? actionMatch[1].trim() : 'No specific action items detected';
      const transcript = transcriptMatch ? transcriptMatch[1].trim() : fullText;

      setResult({
        transcript: transcript || fullText,
        summary: summary.substring(0, 500) + (summary.length > 500 ? '...' : ''),
        actionItems: actionItems
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Mic size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a202c' }}>Audio Intelligence Platform</h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#718096' }}>Powered by Google AI</p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Zap size={20} color="#667eea" />
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Configuration</h2>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                  API Credentials
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Google AI Studio API key"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#718096' }}>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                    Get free API key →
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                  Audio Source
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{
                  display: 'block',
                  padding: '2rem',
                  border: '2px dashed #cbd5e0',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#f7fafc'
                }}>
                  {file ? (
                    <div>
                      <CheckCircle size={32} color="#48bb78" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>Click to change file</div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={40} color="#667eea" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Upload Audio File</div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>MP3, WAV, M4A supported</div>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={processAudio}
                disabled={loading || !file || !apiKey}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: loading || !file || !apiKey ? '#cbd5e0' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading || !file || !apiKey ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Analyze Audio</span>
                  </>
                )}
              </button>

              {loading && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#edf2f7', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }}>
                  Analysis in progress. This may take 30-60 seconds.
                </div>
              )}

              {error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fed7d7', borderRadius: '8px', fontSize: '0.875rem', color: '#c53030' }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Features</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Advanced speech recognition', 'Automatic action item extraction', 'Full transcript generation', 'Enterprise-grade accuracy'].map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    <CheckCircle size={16} color="#48bb78" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            {!result && !loading && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <FileAudio size={64} color="#cbd5e0" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Ready to Analyze</h3>
                <p style={{ margin: 0, color: '#718096' }}>Upload an audio file and enter your API key to begin analysis</p>
              </div>
            )}

            {result && (
              <>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Summary</h2>
                  <div style={{ lineHeight: '1.6', color: '#2d3748' }}>{result.summary}</div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Action Items & Highlights</h2>
                  <div style={{ lineHeight: '1.8', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{result.actionItems}</div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Full Transcript</h2>
                  <div style={{ lineHeight: '1.8', color: '#2d3748', maxHeight: '600px', overflowY: 'auto' }}>
                    {result.transcript}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>Audio Intelligence Platform • Enterprise-grade transcription and analysis</p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}