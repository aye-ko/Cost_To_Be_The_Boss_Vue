<template>
    <div>
        <h2>Results</h2>
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
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch, computed } from 'vue'
import { useGlobalStore } from '~/stores/global'
import { usePantryStore } from '~/stores/pantry'
import { useRecipesStore, type Recipe, type RecipeIngredient } from '~/stores/recipes'
import { priceRecipe } from '~/utils/pricing'

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

</script>