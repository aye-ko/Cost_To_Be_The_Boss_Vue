<template>
    <div>
        <h3>Scaling Calculator</h3>
        <p>Calculate how much ingredients needed to feed x amount of customers</p>
    </div>

    <div>
        <select v-model="selectedRecipeId">
            <option :value="null"> Select a recipe </option>
            <option v-for="recipe in recipeStore.recipes" :key="recipe.id" :value="recipe.id">
                {{ recipe.name }}
            </option>
        </select>
    </div>

    <div>
        <label for="expected-customers">Expected customers: </label>
        <input id="expected-customers" type="number" v-model.number="numberOfCustomers" min="1" placeholder="Expected Number of Customers">
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecipesStore } from '~/stores/recipes'
import { scaleRecipe } from '~/utils/scaleRecipe'

const recipeStore = useRecipesStore()
const selectedRecipeId = ref<number | null>(null)
const numberOfCustomers = ref<number | null>(null)

function scaleCalculator () {
    if (numberOfCustomers.value != null && numberOfCustomers.value > 0 && selectedRecipeId.value !=null) {

        const recipe = recipeStore.recipes.find(r => r.id === selectedRecipeId.value)
        if(recipe != null){
            scaleRecipe(numberOfCustomers.value, recipe)
        }
    }
}


</script>