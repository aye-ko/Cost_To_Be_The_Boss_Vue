<template>
    <div>
        <h2>Pantry</h2>
        <p>Add Ingredients to Pantry.</p>
        <input type="text" v-model="newName" placeholder="Ingredient Name" />
        <input type="number" step="0.1" v-model.number="newQuantity" placeholder="Quantity" />
        <select v-model="newUnit">
            <option value="" disabled>Select a Unit of Measurement</option>
            <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
        <input type="number" step="0.01" v-model.number="newCost" placeholder="Cost" />
        <button @click="addIngredient">Add Ingredient</button>
        
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ingredient in ingredients" :key="ingredient.id">
                    <!-- TODO: Remove ID column before deployment, just for testing purposes right now -->
                    <td>{{ ingredient.id  }}</td>
                    <td>{{ ingredient.name }}</td>
                    <td>{{ ingredient.quantity }}</td>
                    <td>{{ ingredient.unit }}</td>
                    <td>{{ ingredient.cost.toFixed(2) }}</td>
                    <td><button @click="removeIngredient(ingredient.id)">Delete</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup>   
import { ref } from 'vue'

const newName = ref('')
const newQuantity = ref(0)
const newUnit = ref('')
const newCost = ref(0)
const units = ['cup', 
    'tablespoon', 
    'teaspoon', 
    'ounce', 
    'pound', 
    'gram', 
    'milliliter', 
    'each', 
    'kilogram', 
    'gallon', 
    'liter'
]

const ingredients = ref([
    {id: 1, name: 'Flour', quantity: 5, unit: 'lbs', cost: 2.50},
    {id: 2, name: 'Sugar', quantity: 3, unit: 'lbs', cost: 1.80},
    {id: 3, name: 'Butter', quantity: 2, unit: 'lbs', cost: 3.00},
    {id: 4, name: 'Eggs', quantity: 12, unit: 'each', cost: 2.00}
    ]);

function addIngredient() {
  // Validate
    if (!newName.value.trim() || !newUnit.value || newQuantity.value <= 0 || newCost.value <= 0) {
    alert('Please fill in all fields with valid values before adding')
    return
    }

  // Add to the array
    ingredients.value.push({
        id: Date.now()+Math.random(),  // Simple unique ID
        name: newName.value.trim(),  // .trim() removes leading/trailing spaces
        quantity: newQuantity.value,
        unit: newUnit.value,
        cost: newCost.value
    })

  // Reset
    newName.value = ''
    newQuantity.value = 0
    newUnit.value = ''
    newCost.value = 0
}

function removeIngredient(idToRemove) {
    ingredients.value = ingredients.value.filter(ingredient => ingredient.id !== idToRemove)
    }
</script>

<style>

</style>

