import { defineStore } from 'pinia'
import { ref, onMounted, watch } from 'vue'

export interface RecipeIngredient {
    ingredientId: number,
    quantity: number,
    unit: string
}


export interface Recipe {
    id: number,
    name: string,
    servingsPerBatch: number,
    ingredients: RecipeIngredient[],
    hoursPerBatch: number,
    profitMargin: number
    batchesPerMonth: number
}


export const useRecipesStore = defineStore('recipes', () => {
    const recipes = ref<Recipe[]>([])
    const draftRecipeName = ref<string>('')
    const draftRecipeServingsPerBatch = ref<number>(1)
    const draftRecipeHoursPerBatch = ref<number>(1)
    const draftRecipeProfitMargin = ref<number>(0.30)
    const draftRecipeBatchesPerMonth = ref<number>(1)
    const draftRecipeIngredients = ref<RecipeIngredient[]>([])

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

    function loadDraftFromLocalStorage() {
        if (typeof window === 'undefined') {
            return null
        }
        const recipeDraft = localStorage.getItem('recipeDraft')
        if (recipeDraft === null) {
            return null
        } else {
            return JSON.parse(recipeDraft)
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
        
        const draftLoaded = loadDraftFromLocalStorage()
        if (draftLoaded) {
            draftRecipeName.value = draftLoaded.name ?? ''
            draftRecipeServingsPerBatch.value = draftLoaded.servingsPerBatch ?? 1
            draftRecipeHoursPerBatch.value = draftLoaded.hoursPerBatch ?? 1
            draftRecipeProfitMargin.value = draftLoaded.profitMargin ?? 0.30
            draftRecipeBatchesPerMonth.value = draftLoaded.batchesPerMonth ?? 1
            draftRecipeIngredients.value = draftLoaded.ingredients ?? []
        }
    })

    watch([
        draftRecipeName,
        draftRecipeServingsPerBatch,
        draftRecipeHoursPerBatch,
        draftRecipeProfitMargin,
        draftRecipeBatchesPerMonth,
        draftRecipeIngredients
    ],() => {
        if (typeof window === 'undefined') {
            return
        }
        
        
        localStorage.setItem('recipeDraft', JSON.stringify({
            name: draftRecipeName.value,
            servingsPerBatch: draftRecipeServingsPerBatch.value,
            hoursPerBatch: draftRecipeHoursPerBatch.value,
            profitMargin: draftRecipeProfitMargin.value,
            batchesPerMonth: draftRecipeBatchesPerMonth.value,
            ingredients: draftRecipeIngredients.value
            }))
        }

        , { deep: true }
    )

    function addRecipe(name: string, ingredients: RecipeIngredient[], servingsPerBatch: number, hoursPerBatch: number, profitMargin: number, batchesPerMonth: number) {
        recipes.value.push({
            id: Date.now() + Math.random(), // Simple unique ID
            name: name.trim(),
            servingsPerBatch: servingsPerBatch,
            ingredients: ingredients,
            profitMargin: profitMargin,
            hoursPerBatch: hoursPerBatch,
            batchesPerMonth: batchesPerMonth         
            })
        saveToLocalStorage()
    }

    function removeRecipe(id: number) {
        recipes.value = recipes.value.filter(recipe => recipe.id !== id)
        saveToLocalStorage()
    }

    function updateRecipe(id: number, name: string, ingredients: RecipeIngredient[], servingsPerBatch: number, hoursPerBatch: number, profitMargin: number, batchesPerMonth: number) {
        const index = recipes.value.findIndex(recipe => recipe.id === id)
        if (index !== -1) {
            recipes.value[index] = {
                id,
                name: name.trim(),
                servingsPerBatch: servingsPerBatch, // Update the servings per batch as well
                ingredients,
                profitMargin,
                hoursPerBatch,
                batchesPerMonth
            }
            saveToLocalStorage()
        }       
    }

    return {
        recipes,
        draftRecipeName,
        draftRecipeServingsPerBatch,
        draftRecipeHoursPerBatch,
        draftRecipeProfitMargin,
        draftRecipeBatchesPerMonth,
        draftRecipeIngredients,
        addRecipe,
        removeRecipe,
        updateRecipe
    }

})   