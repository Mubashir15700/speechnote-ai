
import { useEffect, useRef, useState } from 'react'
import {
  checkApiHealth,
  getTranscripts,
  saveTranscript,
  updateTranscript,
  deleteTranscript,
  type Transcript,
} from './services/api'
import { connectToGeminiLive } from './services/geminiLive'
import Header from './components/Header'
import Hero from './components/Hero'
import TranscriptEditor from './components/TranscriptEditor'
import TranscriptHistory from './components/TranscriptHistory'
import './App.css'

function App() {
  const [transcript, setTranscript] = useState('')
  const [title, setTitle] = useState('Untitled transcript')
  const [isRecording, setIsRecording] = useState(false)
  const [apiStatus, setApiStatus] = useState('Checking backend...')
  const [recordingStatus, setRecordingStatus] = useState('Ready')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<Transcript[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const sessionRef = useRef<{ stop: () => void } | null>(null)

  async function loadHistory() {
    try {
      const transcripts = await getTranscripts()
      setHistory(transcripts)
    } catch {
      setError('Could not load transcript history.')
    }
  }

  useEffect(() => {
    checkApiHealth()
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('Backend connection failed'))

    getTranscripts()
      .then(setHistory)
      .catch(() => setError('Could not load transcript history.'))

    return () => {
      sessionRef.current?.stop()
      sessionRef.current = null
    }
  }, [])

  async function handleStartRecording() {
    setError('')
    setMessage('')
    setRecordingStatus('Connecting to Gemini...')

    try {
      const session = await connectToGeminiLive(
        (text) => {
          setTranscript((previous) => {
            if (!previous) return text
            return `${previous}${text.startsWith(' ') ? '' : ' '}${text}`
          })
        },
        (status) => {
          setRecordingStatus(status)

          if (
            status.startsWith('Gemini error:') ||
            status.startsWith('Microphone error:')
          ) {
            setError(status)
            setIsRecording(false)
          }

          if (status === 'Disconnected') {
            setIsRecording(false)
          }
        },
      )

      sessionRef.current = session
      setIsRecording(true)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not start recording'

      setError(message)
      setRecordingStatus('Unable to start')
      setIsRecording(false)
    }
  }

  function handleStopRecording() {
    sessionRef.current?.stop()
    sessionRef.current = null
    setIsRecording(false)
    setRecordingStatus('Ready')
  }

  async function handleSaveTranscript() {
    if (!transcript.trim()) return

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const saved = await saveTranscript({
        title: title.trim() || 'Untitled transcript',
        content: transcript.trim(),
        language: 'auto',
      })

      setHistory((previous) => [saved, ...previous])
      setMessage('Transcript saved successfully!')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save transcript.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTranscript(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transcript?',
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      await deleteTranscript(id)

      setHistory((previous) =>
        previous.filter((item) => item.id !== id),
      )

      setMessage('Transcript deleted successfully!')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete transcript.',
      )
    }
  }

  async function handleUpdateTranscript() {
    if (editingId === null || !transcript.trim()) return

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const updated = await updateTranscript(editingId, {
        title: title.trim() || 'Untitled transcript',
        content: transcript.trim(),
        language: 'auto',
      })

      setHistory((previous) =>
        previous.map((item) =>
          item.id === editingId ? updated : item,
        ),
      )

      setEditingId(null)
      setMessage('Transcript updated successfully!')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update transcript.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleLoadTranscript(item: Transcript) {
    if (isRecording) handleStopRecording()

    setEditingId(item.id)
    setTitle(item.title)
    setTranscript(item.content)
    setError('')
    setMessage(`Editing "${item.title}"`)
  }

  function handleClearTranscript() {
    setTranscript('')
    setTitle('Untitled transcript')
    setMessage('')
    setError('')
  }

  return (
    <main className="app">
      <Header />

      <Hero />

      <TranscriptEditor
        transcript={transcript}
        title={title}
        setTitle={setTitle}
        isRecording={isRecording}
        recordingStatus={recordingStatus}
        error={error}
        message={message}
        isSaving={isSaving}
        editingId={editingId}
        onToggleRecording={
          isRecording ? handleStopRecording : handleStartRecording
        }
        onClear={handleClearTranscript}
        onSave={handleSaveTranscript}
        onUpdate={handleUpdateTranscript}
        onCancelEditing={() => {
          setEditingId(null)
          setTitle('Untitled transcript')
          setTranscript('')
          setError('')
          setMessage('Editing cancelled.')
        }}
      />

      <TranscriptHistory
        history={history}
        onLoad={handleLoadTranscript}
        onDelete={handleDeleteTranscript}
        onRefresh={loadHistory}
      />

      <p className="api-status">Backend: {apiStatus}</p>

      <footer>
        SpeechNote AI · Built with React, TypeScript and Gemini
      </footer>
    </main>
  )
}

export default App
