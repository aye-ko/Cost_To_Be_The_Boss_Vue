<template>
    <div>
        <h2>Results</h2>
        <div>
            <label for="hourly-wage">Hourly Wage: </label>
            <input id="hourly-wage" type="number" v-model.number="hourlyWage" placeholder="Hourly Wage"/>
        </div>

        <div>
            <label for="monthly-overhead">Monthly Overhead: </label>
            <input id="monthly-overhead" type="number" v-model.number="monthlyOverhead" placeholder="Monthly Overhead"/>
        </div>

        <div>
            <label for="monthly-hours-worked">Monthly Hours Worked: </label>
            <input id="monthly-hours-worked" type="number" v-model.number="monthlyHoursWorked" placeholder="Monthly Hours Worked"/>
        </div>

        <h3>Recipes</h3>
        <ul>
            <li v-for="recipe in recipes" :key="recipe.id">
                <h4>{{ recipe.name }}</h4>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useGlobalStore } from '~/stores/global'
import { usePantryStore } from '~/stores/pantry'
import { useRecipesStore, type Recipe, type RecipeIngredient } from '~/stores/recipes'

const globalStore = useGlobalStore()
const pantryStore = usePantryStore()
const recipesStore = useRecipesStore()
const { recipes } = storeToRefs(recipesStore)

const { hourlyWage, monthlyOverhead, monthlyHoursWorked } = storeToRefs(globalStore)
// Save automatically when any of them change
watch([hourlyWage, monthlyOverhead, monthlyHoursWorked], () => {
    globalStore.saveToLocalStorage()  // requires exposing this in the store's return
})


</script>