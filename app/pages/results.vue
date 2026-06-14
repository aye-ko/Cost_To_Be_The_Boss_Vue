<template>
    <div>
        <h2>Results</h2>
        <div>
            <label for="revenue-goal">Monthly Revenue Goal: </label>
            <input id="revenue-goal" type="number" v-model.number="revenueGoal" min="1" placeholder="Monthly Revenue Goal"/>
        </div>

        <div>
            <label for="hourly-wage">Hourly Wage: </label>
            <input id="hourly-wage" type="number" v-model.number="hourlyWage" min="0" placeholder="Hourly Wage"/>
        </div>

        <div>
            <label for="monthly-overhead">Monthly Overhead: </label>
            <input id="monthly-overhead" type="number" v-model.number="monthlyOverhead" min="0" placeholder="Monthly Overhead"/>
        </div>

        <div>
            <label for="monthly-hours-worked">Monthly Hours Worked: </label>
            <input id="monthly-hours-worked" type="number" v-model.number="monthlyHoursWorked" min="0" placeholder="Monthly Hours Worked"/>
        </div>

        <h3>Recipes</h3>
        <ul>
            <li v-for="item in pricedRecipes" :key="item.recipe.id">
                <h4>{{ item.recipe.name }}</h4>

                <p v-if="item.result.ok">
                    Batch Cost: {{ item.result.batchPrice.toFixed(2) }} |
                    Cost per Serving: {{ item.result.servingPrice.toFixed(2) }}
                </p>
                <p v-else>
                    Error: {{ item.result.error }}
                </p>
            </li>
        </ul>

        <p v-if="isLoading">Running simulation...</p>
        <p v-if="!isLoading && simulationResult">Success Probability: {{ (simulationResult.successProbability * 100).toFixed(2) }}%</p>
        <p v-if="!isLoading && simulationResult">Best Case Monthly Revenue: {{ simulationResult.bestCase.toFixed(2) }}</p>
        <p v-if="!isLoading && simulationResult">Worst Case Monthly Revenue: {{ simulationResult.worstCase.toFixed(2) }}</p>
        <p v-if="!isLoading && simulationResult">Realistic Monthly Revenue Range  : {{ simulationResult.realisticRange[0].toFixed(2) }} - {{ simulationResult.realisticRange[1].toFixed(2) }}</p>
        <p v-if="simulationError">Error: {{ simulationError }}</p>

        <button @click="runSimulation" :disabled="!canSimulate || isLoading">
            {{ isLoading ? 'Running Simulation...' : 'Run Simulation' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch, computed } from 'vue'
import { useGlobalStore } from '~/stores/global'
import { usePantryStore } from '~/stores/pantry'
import { useRecipesStore, type Recipe, type RecipeIngredient } from '~/stores/recipes'
import { priceRecipe } from '~/utils/pricing'

interface SimulationResponse {
    successProbability: number
    bestCase: number
    worstCase: number
    realisticRange: [number, number]
}
const revenueGoal = ref<number | null>(null)
const simulationResult = ref<SimulationResponse | null>(null)
const isLoading = ref(false)
const simulationError = ref('')

const globalStore = useGlobalStore()
const pantryStore = usePantryStore()
const recipesStore = useRecipesStore()
const { recipes } = storeToRefs(recipesStore)
const { ingredients: pantry } = storeToRefs(pantryStore)


const { hourlyWage, monthlyOverhead, monthlyHoursWorked } = storeToRefs(globalStore)
// Save automatically when any of them change
watch([hourlyWage, monthlyOverhead, monthlyHoursWorked], () => {
    globalStore.saveToLocalStorage()  // requires exposing this in the store's return
})
const pricedRecipes = computed(() =>
    recipes.value.map(recipe => ({
        recipe,
        result: priceRecipe(recipe, pantry.value, hourlyWage.value, monthlyOverhead.value, monthlyHoursWorked.value)
    }))
)

const canSimulate = computed(() => {
    return revenueGoal.value !== null &&
            revenueGoal.value > 0 &&
            recipes.value.length > 0 &&
            hourlyWage.value !== null &&
            monthlyOverhead.value !== null &&
            monthlyHoursWorked.value !== null &&
            hourlyWage.value > 0 &&
            monthlyOverhead.value > 0 &&
            monthlyHoursWorked.value > 0 &&
            pricedRecipes.value.every(item => item.result.ok)
}) //  Every business has an overhead, even home bakers have to pay for their light bill and pay themselves

const requestBody = computed(() => {
    return{
        recipes: pricedRecipes.value
    .filter(item => item.result.ok)
    .map(item => {
        if (!item.result.ok) throw new Error('unreachable')  // narrows type
        return {
            name: item.recipe.name,
            servingPrice: item.result.servingPrice,
            servingsPerBatch: item.recipe.servingsPerBatch,
            batchesPerMonth: item.recipe.batchesPerMonth,
        }
    }),
        revenueGoal: revenueGoal.value
    }
})

async function runSimulation() {
    if (!canSimulate.value) {
        simulationError.value = 'Please ensure all inputs are valid and all recipes are priced successfully.'
        return
    }

    simulationError.value = '';simulationResult.value = null

    isLoading.value = true

    try {
        const response = await fetch('https://cost-to-be-the-boss-api.onrender.com/simulate',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody.value)
        })

        if (!response.ok) {
            throw new Error(`Server returned: ${response.status}`)
        }

        const data = await response.json()
        simulationResult.value = data
    } catch (error) {
        simulationError.value = error instanceof Error ? error.message : 'Unknown error'
    } finally {
        isLoading.value = false
    }
}
</script>