import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import FoodList from './components/FoodList'
import DailyLog from './components/DailyLog'
import GoalSetter from './components/GoalSetter'
import CalendarView from './components/CalendarView'
import { searchFood } from './api/openfoodfacts'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Main data structure: { "Date String": { entries: [], goal: 2000 } }
  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem('foodLog')
    return saved ? JSON.parse(saved) : {}
  })

  const dateKey = selectedDate.toDateString()
  const currentDayLog = foodLog[dateKey] || { entries: [], goal: 2000 }

  // Save to localStorage whenever foodLog changes
  useEffect(() => {
    localStorage.setItem('foodLog', JSON.stringify(foodLog))
  }, [foodLog])

  const updateDayLog = (updates) => {
    setFoodLog(prev => ({
      ...prev,
      [dateKey]: {
        ...currentDayLog,
        ...updates
      }
    }))
  }

  const handleSearch = async (query) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = await searchFood(query)
      setSearchResults(results)
      if (results.length === 0) {
        setError('No food found. Try a different search term.')
      }
    } catch (err) {
      setError('Failed to search. Please try again.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFood = (food) => {
    const entry = {
      ...food,
      id: Date.now(),
      addedAt: new Date().toISOString()
    }
    updateDayLog({ entries: [...currentDayLog.entries, entry] })
  }

  const handleRemoveEntry = (id) => {
    updateDayLog({ entries: currentDayLog.entries.filter(entry => entry.id !== id) })
  }

  const handleSetGoal = (newGoal) => {
    updateDayLog({ goal: newGoal })
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setCurrentView('dashboard')
  }

  const isToday = dateKey === new Date().toDateString()

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-area">
            <span className="logo-icon">🥗</span>
            <h1>NutriTrack</h1>
          </div>
          <nav className="nav-menu">
            <button 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <span className="icon">📊</span> Dashboard
            </button>
            <button 
              className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
              onClick={() => setCurrentView('calendar')}
            >
              <span className="icon">📅</span> Calendar
            </button>
          </nav>
        </div>
        <div className="header-right">
          <GoalSetter currentGoal={currentDayLog.goal} onSetGoal={handleSetGoal} />
          <div className="user-profile">
            <div className="avatar">👤</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-header">
          <div className="date-display">
            <h2>{isToday ? 'Today' : selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            {!isToday && (
              <button className="back-today" onClick={() => setSelectedDate(new Date())}>
                Back to Today
              </button>
            )}
          </div>
        </div>

        {currentView === 'calendar' ? (
          <CalendarView foodLog={foodLog} onSelectDate={handleDateSelect} />
        ) : (
          <div className="dashboard-grid">
            <div className="left-column">
              <div className="hero-search">
                <h1>What are you eating?</h1>
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                {error && <p className="error-message">{error}</p>}
              </div>
              
              <div className="food-results-area">
                <FoodList foods={searchResults} onAddFood={handleAddFood} isLoading={isLoading} />
                {searchResults.length === 0 && !isLoading && (
                  <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <p>Search for food to add to your log</p>
                  </div>
                )}
              </div>
            </div>

            <div className="right-column">
              <DailyLog 
                entries={currentDayLog.entries} 
                onRemoveEntry={handleRemoveEntry}
                dailyGoal={currentDayLog.goal}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
