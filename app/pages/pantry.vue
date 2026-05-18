<template>
    <div>
        <h2>Pantry</h2>
        <p>Add Ingredients to Pantry.</p>
        <div>
            <label for="ingredient-name">Ingredient Name: </label>
            <input id="ingredient-name" type="text" v-model="newName" list="fao-options" placeholder="Ingredient Name" />
        </div>

        <div>
            <label for="ingredient-quantity">Quantity: </label>
            <input id="ingredient-quantity" type="number" step="0.1" v-model.number="newQuantity" placeholder="Quantity" />
        </div>

        <div>
            <label for="ingredient-unit">Unit of Measurement: </label>
            <select v-model="newUnit">
                <option value="" disabled>Select a Unit of Measurement</option>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
            </select>
        </div>

        <div>
            <label for="ingredient-cost">Cost: </label>
            <input id="ingredient-cost" type="number" step="0.01" v-model.number="newCost" placeholder="Cost" />
        </div>

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
                <tr v-for="ingredient in pantry.ingredients" :key="ingredient.id">

                    <td v-if="editingId === ingredient.id">
                        <input type="text" v-model="editDraft.name" list="fao-options"/>
                    </td>
                    <td v-else>{{ ingredient.name }}</td>

                    <td v-if="editingId === ingredient.id">
                        <input type="number" step="0.1" v-model.number="editDraft.quantity" />
                    </td>
                    <td v-else>{{ ingredient.quantity }}</td>

                    <td v-if="editingId === ingredient.id">
                        <select v-model="editDraft.unit">
                            <option value="" disabled>Select a Unit of Measurement</option>
                            <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                        </select>
                    </td>
                    <td v-else>{{ ingredient.unit }}</td>

                    <td v-if="editingId === ingredient.id">
                        <input type="number" step="0.01" v-model.number="editDraft.cost" />
                    </td>
                    <td v-else>{{ ingredient.cost.toFixed(2) }}</td>

                    <td v-if="editingId === ingredient.id">
                        <button @click="saveEdit">Save</button>
                        <button @click="cancelEdit">Cancel</button>
                    </td>
                    <td v-else>
                        <button @click="editIngredient(ingredient)">Edit</button>
                        <button @click="removeIngredient(ingredient.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <datalist id="fao-options">
            <option v-for="d in densities" :value="d.name" :key="d.name"></option>
        </datalist>
    </div>
    

</template>


<script setup lang="ts">   
import { ref } from 'vue'
import { usePantryStore } from '~/stores/pantry'
import type { Ingredient } from '~/stores/pantry'
import densities from '~/data/densities.json'

const pantry = usePantryStore()
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

const editingId = ref<number|null>(null)
const editDraft = ref({ name: '', quantity: 0, unit: '', cost: 0 })

function resetForm() {
  // Reset
    newName.value = ''
    newQuantity.value = 0
    newUnit.value = ''
    newCost.value = 0
}

function addIngredient() {
  // Validate
    if (!newName.value.trim() || !newUnit.value || newQuantity.value <= 0 || newCost.value <= 0) {
    alert('Please fill in all fields with valid values before adding')
    return
    }
    const isInFAO = densities.some(d => d.name === newName.value)
    if (!isInFAO) {
        alert('Ingredient must be selected from the FAO list')
        return
    }

    pantry.addIngredient(newName.value, newQuantity.value, newUnit.value, newCost.value)
    resetForm()
}


function removeIngredient(idToRemove:number) {
    pantry.removeIngredient(idToRemove)
    }

function editIngredient(ingredient:Ingredient) {
    editingId.value = ingredient.id
    editDraft.value = { ...ingredient }  // Create a copy for editing    
}

function saveEdit(){
    if (editingId.value === null) return
    
    if (!editDraft.value.name.trim()|| !editDraft.value.unit || editDraft.value.quantity <= 0 || editDraft.value.cost <= 0) {
        alert('Please fill in all fields with valid values before saving')
        return
    }   
    const isInFAO = densities.some(d => d.name === editDraft.value.name)
    if (!isInFAO) {
        alert('Ingredient must be selected from the FAO list')
        return
    }

    pantry.updateIngredient(editingId.value, editDraft.value.name, editDraft.value.quantity, editDraft.value.unit, editDraft.value.cost)

    // Reset editing state
    editingId.value = null
    editDraft.value = { name: '', quantity: 0, unit: '', cost: 0 }
}

function cancelEdit() {
    editingId.value = null
    editDraft.value = { name: '', quantity: 0, unit: '', cost: 0 }
}
</script>

<style scoped>
label {
    display: inline-block;
    width: 150px;
    margin-top: 10px;
}

</style>

