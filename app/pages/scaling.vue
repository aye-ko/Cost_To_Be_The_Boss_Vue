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

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecipesStore } from '~/stores/recipes'

const recipeStore = useRecipesStore()
const selectedRecipeId = ref<number | null>(null)

</script>