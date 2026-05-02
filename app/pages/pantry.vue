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
                <tr v-for="ingredient in pantry.ingredients" :key="ingredient.id">
                    <!-- TODO: Remove ID column before deployment, just for testing purposes right now -->
                    <td>{{ ingredient.id  }}</td>
                    <td v-if="editingId === ingredient.id">
                        <input type="text" v-model="editDraft.name" />
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
    </div>
</template>


<script setup>   
import { ref } from 'vue'
import { usePantryStore } from '~/stores/pantry'

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

const editingId = ref(null)
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

    pantry.addIngredient(newName.value, newQuantity.value, newUnit.value, newCost.value)
    resetForm()
}


function removeIngredient(idToRemove) {
    pantry.removeIngredient(idToRemove)
    }

function editIngredient(ingredient) {
    editingId.value = ingredient.id
    editDraft.value = { ...ingredient }  // Create a copy for editing    
}

function saveEdit(){
    if (!editDraft.value.name.trim()|| !editDraft.value.unit || editDraft.value.quantity <= 0 || editDraft.value.cost <= 0) {
        alert('Please fill in all fields with valid values before saving')
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

<style>

</style>

