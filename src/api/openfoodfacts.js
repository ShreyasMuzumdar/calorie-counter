const BASE_URL = 'https://api.nal.usda.gov/fdc/v1'
const API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'

export async function searchFood(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=20&dataType=Survey%20%28FNDDS%29,Foundation,SR%20Legacy,Branded`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch food data')
    }
    
    const data = await response.json()
    
    return data.foods
      .filter(food => food.description)
      .map(food => {
        const nutrients = food.foodNutrients || []
        
        const getCalories = () => {
          const calNutrient = nutrients.find(n => 
            n.nutrientName === 'Energy' || 
            n.nutrientId === 1008
          )
          return Math.round(calNutrient?.value || 0)
        }
        
        const getProtein = () => {
          const nutrient = nutrients.find(n => 
            n.nutrientName === 'Protein' || 
            n.nutrientId === 1003
          )
          return Math.round((nutrient?.value || 0) * 10) / 10
        }
        
        const getCarbs = () => {
          const nutrient = nutrients.find(n => 
            n.nutrientName === 'Carbohydrate, by difference' || 
            n.nutrientId === 1005
          )
          return Math.round((nutrient?.value || 0) * 10) / 10
        }
        
        const getFat = () => {
          const nutrient = nutrients.find(n => 
            n.nutrientName === 'Total lipid (fat)' || 
            n.nutrientId === 1004
          )
          return Math.round((nutrient?.value || 0) * 10) / 10
        }

        return {
          code: food.fdcId.toString(),
          name: food.description,
          brand: food.brandOwner || food.brandName || null,
          image: null, // USDA doesn't provide images
          servingSize: food.servingSize ? `${food.servingSize}${food.servingSizeUnit || 'g'}` : '100g',
          calories: getCalories(),
          protein: getProtein(),
          carbs: getCarbs(),
          fat: getFat(),
        }
      })
      .filter(food => food.calories > 0)
  } catch (error) {
    console.error('Error searching food:', error)
    throw error
  }
}

export async function getFoodById(fdcId) {
  try {
    const response = await fetch(
      `${BASE_URL}/food/${fdcId}?api_key=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }
    
    const food = await response.json()
    const nutrients = food.foodNutrients || []
    
    const getCalories = () => {
      const calNutrient = nutrients.find(n => 
        n.nutrient?.name === 'Energy' || 
        n.nutrient?.id === 1008
      )
      return Math.round(calNutrient?.amount || 0)
    }
    
    const getProtein = () => {
      const nutrient = nutrients.find(n => 
        n.nutrient?.name === 'Protein' || 
        n.nutrient?.id === 1003
      )
      return Math.round((nutrient?.amount || 0) * 10) / 10
    }
    
    const getCarbs = () => {
      const nutrient = nutrients.find(n => 
        n.nutrient?.name === 'Carbohydrate, by difference' || 
        n.nutrient?.id === 1005
      )
      return Math.round((nutrient?.amount || 0) * 10) / 10
    }
    
    const getFat = () => {
      const nutrient = nutrients.find(n => 
        n.nutrient?.name === 'Total lipid (fat)' || 
        n.nutrient?.id === 1004
      )
      return Math.round((nutrient?.amount || 0) * 10) / 10
    }
    
    return {
      code: food.fdcId.toString(),
      name: food.description,
      brand: food.brandOwner || food.brandName || null,
      image: null,
      servingSize: food.servingSize ? `${food.servingSize}${food.servingSizeUnit || 'g'}` : '100g',
      calories: getCalories(),
      protein: getProtein(),
      carbs: getCarbs(),
      fat: getFat(),
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}
