function FoodList({ foods, onAddFood, isLoading }) {
  if (isLoading) {
    return (
      <div className="food-list">
        <h2>Searching...</h2>
        <div className="food-items">
          {[1, 2, 3].map((i) => (
            <div key={i} className="food-item skeleton">
              <div className="food-info">
                <div className="skeleton-image"></div>
                <div className="food-details">
                  <div className="skeleton-text title"></div>
                  <div className="skeleton-text subtitle"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!foods || foods.length === 0) {
    return null
  }

  return (
    <div className="food-list">
      <h2>Search Results</h2>
      <div className="food-items">
        {foods.map((food) => (
          <div key={food.code} className="food-item">
            <div className="food-info">
              <div className="food-icon">🍽️</div>
              <div className="food-details">
                <h3>{food.name}</h3>
                <p className="brand">{food.brand || 'Generic'}</p>
                <div className="nutrition">
                  <span className="calories">{food.calories} kcal</span>
                  <span className="serving">per {food.servingSize || '100g'}</span>
                </div>
                <div className="macros">
                  <span>P: {food.protein}g</span>
                  <span>C: {food.carbs}g</span>
                  <span>F: {food.fat}g</span>
                </div>
              </div>
            </div>
            <button 
              className="add-button"
              onClick={() => onAddFood(food)}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodList
