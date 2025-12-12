import { useState } from 'react'

function GoalSetter({ currentGoal, onSetGoal }) {
  const [isEditing, setIsEditing] = useState(false)
  const [goalValue, setGoalValue] = useState(currentGoal)

  const handleSubmit = (e) => {
    e.preventDefault()
    const newGoal = parseInt(goalValue, 10)
    if (newGoal > 0) {
      onSetGoal(newGoal)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <form className="goal-setter editing" onSubmit={handleSubmit}>
        <input
          type="number"
          value={goalValue}
          onChange={(e) => setGoalValue(e.target.value)}
          min="500"
          max="10000"
          autoFocus
        />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
      </form>
    )
  }

  return (
    <div className="goal-setter">
      <span>Daily Goal: {currentGoal} kcal</span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  )
}

export default GoalSetter
