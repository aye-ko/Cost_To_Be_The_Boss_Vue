import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export interface RecipeIngredient {
    ingredientId: number,
    quantity: number,
    unit: string
}

export interface Recipe {
    id: number,
    name: string,
    servingsPerBatch: number,
    ingredients: RecipeIngredient[]
}

export const useRecipesStore = defineStore('recipes', () => {
    const recipes = ref<Recipe[]>([])

    function loadFromLocalStorage() {
        if (typeof window === 'undefined') {
            return null
        }
        const storedRecipes = localStorage.getItem('recipes')
        if (storedRecipes === null) {
            return null
        } else {
            return JSON.parse(storedRecipes)
        }   
    }

    function saveToLocalStorage() {
        if (typeof window === 'undefined') {
            return
        }
        localStorage.setItem('recipes', JSON.stringify(recipes.value))
    }   

    onMounted(() => {
        const loaded = loadFromLocalStorage()   
        if (loaded) {
            recipes.value = loaded
        }                       
    })

    function addRecipe(name: string, ingredients: RecipeIngredient[], servingsPerBatch: number) {
        recipes.value.push({
            id: Date.now() + Math.random(), // Simple unique ID
            name: name.trim(),
            servingsPerBatch: servingsPerBatch,
            ingredients: ingredients
            })
        saveToLocalStorage()
    }

    function removeRecipe(id: number) {
        recipes.value = recipes.value.filter(recipe => recipe.id !== id)
        saveToLocalStorage()
    }

    function updateRecipe(id: number, name: string, ingredients: RecipeIngredient[], servingsPerBatch: number) {
        const index = recipes.value.findIndex(recipe => recipe.id === id)
        if (index !== -1) {
            recipes.value[index] = {
                id,
                name: name.trim(),
                servingsPerBatch: servingsPerBatch, // Update the servings per batch as well
                ingredients
            }
            saveToLocalStorage()
        }       
    }

    return {
        recipes,
        addRecipe,
        removeRecipe,
        updateRecipe
    }

})   