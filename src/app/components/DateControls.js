// components/DateControls.js
export default function DateControls({ 
  startDate, 
  endDate, 
  duration,
  onStartDateChange,
  onEndDateChange,
  onDurationChange,
  onStart,
  onStop
}) {
  return (
    <div className="date-controls">
      <div className="control-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="control-group">
        <label htmlFor="end-date">End Date</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="control-group">
        <label htmlFor="duration">Duration (seconds)</label>
        <input
          id="duration"
          type="number"
          min="1"
          max="600"
          value={duration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          className="number-input"
        />
      </div>

      <div className="button-group">
        <button onClick={onStart} className="play-button">
          ▶ Play
        </button>
        <button onClick={onStop} className="stop-button">
          ■ Stop
        </button>
      </div>
    </div>
  )
}