import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
export interface Ingredient {
    id: number,
    name: string,
    quantity: number,
    unit: string,
    cost: number
}

export const usePantryStore = defineStore('pantry', () => {
    
    const seedData = [
        {id: 1, name: 'Flour', quantity: 5, unit: 'lbs', cost: 2.50},
        {id: 2, name: 'Sugar', quantity: 3, unit: 'lbs', cost: 1.80},
        {id: 3, name: 'Butter', quantity: 2, unit: 'lbs', cost: 3.00},
        {id: 4, name: 'Eggs', quantity: 12, unit: 'each', cost: 2.00}
        ];


    function loadFromLocalStorage() {
        if (typeof window === 'undefined') {
            return null
        }
        const storedIngredients = localStorage.getItem('pantry-ingredients')

        if (storedIngredients === null) {
            return null

        } else{
            return JSON.parse(storedIngredients)
        }
    }

    function saveToLocalStorage() {
        if (typeof window === 'undefined') {
            return
        }
        localStorage.setItem('pantry-ingredients', JSON.stringify(ingredients.value))
    }

    const ingredients = ref<Ingredient[]>([])

    onMounted(() => {
        const loaded = loadFromLocalStorage()
        if (loaded) {
            ingredients.value = loaded
        } else if (seedData.length > 0) {
            ingredients.value = [...seedData]
            saveToLocalStorage()
        }
    })


    function addIngredient(name:string, quantity: number, unit: string, cost: number) {
        // Add to the array
    ingredients.value.push({
        id: Date.now()+Math.random(),  // Simple unique ID
        name: name.trim(),  // .trim() removes leading/trailing spaces
        quantity: quantity,
        unit: unit,
        cost: cost
    })
    saveToLocalStorage()
}
    function removeIngredient(id:number) {
        // Remove from the array
    ingredients.value = ingredients.value.filter(ingredient => ingredient.id !== id)
    saveToLocalStorage()
}
    function updateIngredient(id:number, name:string, quantity:number, unit:string, cost:number) {
        // Update the ingredient in the array
    const index = ingredients.value.findIndex(ingredient => ingredient.id === id)
    if (index !== -1) {
        ingredients.value[index] = {
        id,
        name: name.trim(),
        quantity,
        unit,
        cost
        }
        saveToLocalStorage()
        }
    }

    return { 

        ingredients: ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient

    }
})