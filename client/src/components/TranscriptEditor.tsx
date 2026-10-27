type TranscriptEditorProps = {
    transcript: string
    title: string
    setTitle: (value: string) => void
    isRecording: boolean
    recordingStatus: string
    error: string
    message: string
    isSaving: boolean
    editingId: number | null
    onToggleRecording: () => void
    onClear: () => void
    onSave: () => void
    onUpdate: () => void
    onCancelEditing: () => void
}

function TranscriptEditor({
    transcript,
    title,
    setTitle,
    isRecording,
    recordingStatus,
    error,
    message,
    isSaving,
    editingId,
    onToggleRecording,
    onClear,
    onSave,
    onUpdate,
    onCancelEditing,
}: TranscriptEditorProps) {
    return (
        <section className="recorder">
            <div className="recorder-header">
                <div>
                    <h3>Live transcription</h3>
                    <p>Speak and watch your words appear here.</p>
                </div>

                <span className={`status ${isRecording ? 'active' : ''}`}>
                    <span className="status-dot" />
                    {isRecording ? 'Recording' : recordingStatus}
                </span>
            </div>

            <label htmlFor="transcript-title">Transcript title</label>
            <input
                id="transcript-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a title"
                maxLength={150}
            />

            <div className="transcript-area" aria-live="polite">
                {transcript ? (
                    <p>{transcript}</p>
                ) : (
                    <p className="placeholder">
                        Your transcription will appear here...
                    </p>
                )}
            </div>

            <div className="recorder-actions">
                <button
                    className={`record-button ${isRecording ? 'recording' : ''}`}
                    onClick={onToggleRecording}
                    disabled={
                        recordingStatus === 'Connecting to Gemini...' ||
                        recordingStatus === 'Getting secure token...'
                    }
                >
                    {isRecording ? 'Stop recording' : 'Start recording'}
                </button>

                <button
                    className="secondary-button"
                    onClick={onClear}
                    disabled={!transcript}
                >
                    Clear text
                </button>

                <button
                    className="secondary-button"
                    onClick={editingId !== null ? onUpdate : onSave}
                    disabled={!transcript.trim() || isSaving || isRecording}
                >
                    {isSaving
                        ? editingId !== null
                            ? 'Updating...'
                            : 'Saving...'
                        : editingId !== null
                            ? 'Update transcript'
                            : 'Save transcript'}
                </button>

                {editingId !== null && (
                    <button
                        className="secondary-button"
                        onClick={onCancelEditing}
                        disabled={isSaving}
                    >
                        Cancel editing
                    </button>
                )}
            </div>

            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}

            <p className="hint">{recordingStatus}</p>
        </section>
    )
}

export default TranscriptEditor
