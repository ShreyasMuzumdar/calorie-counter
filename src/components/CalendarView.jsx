import { useState } from 'react'

function CalendarView({ foodLog, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()
      const log = foodLog[dateString]
      const totalCalories = log ? log.entries.reduce((sum, e) => sum + e.calories, 0) : 0
      const goal = log ? log.goal : 2000
      const percentage = Math.min((totalCalories / goal) * 100, 100)
      
      let statusColor = '#eee'
      if (totalCalories > 0) {
        if (totalCalories > goal) statusColor = '#FF6B6B' // Over
        else if (totalCalories > goal * 0.9) statusColor = '#2ECC71' // Good
        else statusColor = '#F1C40F' // Under
      }

      days.push(
        <div 
          key={i} 
          className="calendar-day"
          onClick={() => onSelectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
        >
          <span className="day-number">{i}</span>
          {totalCalories > 0 && (
            <div className="day-stats">
              <div className="mini-progress" style={{ background: statusColor, width: '100%' }}></div>
              <span className="cal-text">{Math.round(totalCalories)}</span>
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        {renderCalendarDays()}
      </div>
      <div className="calendar-legend">
        <div className="legend-item"><span className="dot green"></span>On Track</div>
        <div className="legend-item"><span className="dot yellow"></span>Under</div>
        <div className="legend-item"><span className="dot red"></span>Over</div>
      </div>
    </div>
  )
}

export default CalendarView
