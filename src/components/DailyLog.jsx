function DailyLog({ entries, onRemoveEntry, dailyGoal }) {
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0)
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0)
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0)
  
  const progress = Math.min((totalCalories / dailyGoal) * 100, 100)
  const remaining = dailyGoal - totalCalories

  return (
    <div className="daily-log">
      <h2>Today's Log</h2>
      
      <div className="calorie-summary">
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${progress}%`,
              backgroundColor: remaining < 0 ? '#e74c3c' : '#27ae60'
            }}
          />
        </div>
        <div className="calorie-stats">
          <span className="consumed">{Math.round(totalCalories)} kcal consumed</span>
          <span className="remaining" style={{ color: remaining < 0 ? '#e74c3c' : '#27ae60' }}>
            {remaining > 0 ? `${Math.round(remaining)} kcal remaining` : `${Math.round(Math.abs(remaining))} kcal over`}
          </span>
        </div>
        <div className="macro-totals">
          <span>Protein: {Math.round(totalProtein)}g</span>
          <span>Carbs: {Math.round(totalCarbs)}g</span>
          <span>Fat: {Math.round(totalFat)}g</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="empty-log">No food logged yet. Search and add food above!</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id} className="entry-item">
              <div className="entry-info">
                <span className="entry-name">{entry.name}</span>
                <span className="entry-calories">{entry.calories} kcal</span>
              </div>
              <button 
                className="remove-button"
                onClick={() => onRemoveEntry(entry.id)}
                aria-label="Remove entry"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DailyLog
