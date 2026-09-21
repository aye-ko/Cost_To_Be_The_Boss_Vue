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
    const ingredients = ref<Ingredient[]>([])


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



    onMounted(() => {
        const loaded = loadFromLocalStorage()
        if (loaded) {
            ingredients.value = loaded
        }
    })


    function addIngredient(name: string, quantity: number, unit: string, cost: number): number {
    const id = Date.now() + Math.random()
    ingredients.value.push({ id, name: name.trim(), quantity, unit, cost })
    saveToLocalStorage()
    return id
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