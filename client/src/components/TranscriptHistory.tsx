import type { Transcript } from '../services/api'

type TranscriptHistoryProps = {
    history: Transcript[]
    onLoad: (item: Transcript) => void
    onDelete: (id: number) => void
    onRefresh: () => void
}

function TranscriptHistory({
    history,
    onLoad,
    onDelete,
    onRefresh,
}: TranscriptHistoryProps) {
    return (
        <section className="history">
            <div className="recorder-header">
                <div>
                    <h3>Saved transcripts</h3>
                    <p>Your saved transcription history.</p>
                </div>

                <button
                    className="secondary-button"
                    onClick={onRefresh}
                >
                    Refresh
                </button>
            </div>

            {history.length === 0 ? (
                <p className="placeholder">No saved transcripts yet.</p>
            ) : (
                <ul>
                    {history.map((item) => (
                        <li key={item.id}>
                            <div className="transcript-item-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() => onLoad(item)}
                                >
                                    {item.title}
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() => onDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </div>

                            <p>{new Date(item.createdAt).toLocaleString()}</p>

                            <p>
                                {item.content.length > 100
                                    ? `${item.content.slice(0, 100)}...`
                                    : item.content}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default TranscriptHistory
