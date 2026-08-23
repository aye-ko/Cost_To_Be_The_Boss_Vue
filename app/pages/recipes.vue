<template>
    <div>
        <h2>Recipes</h2>
        <p>Create the Recipes</p>
        <div>
            <label for="recipe-name">Recipe Name: </label>
            <input id="recipe-name" type="text" v-model="recipeStore.draftRecipeName" placeholder="Recipe Name" />
        </div>
        <div>
            <label for="servings-per-batch">Servings per Batch: </label>
            <input id = "servings-per-batch" type="number" v-model.number="recipeStore.draftRecipeServingsPerBatch" min="1" placeholder="Servings per Batch" />
        </div>
        <div>
            <label for="hours-per-batch">Hours per Batch: </label>
            <input id = "hours-per-batch" type="number" v-model.number="recipeStore.draftRecipeHoursPerBatch" min="0" placeholder="Hours per Batch" />
        </div>
        <div>
            <label for="profit-margin">Profit Margin: </label>
            <input id= "profit-margin" type="number" v-model.number="recipeStore.draftRecipeProfitMargin" min="0" max="1" step="0.01" placeholder="Profit Margin (e.g. 0.30 for 30%)" />    
        </div>

        <div>
            <label for="batches-per-month">Batches per Month: </label>
            <input id= "batches-per-month" type="number" v-model.number="recipeStore.draftRecipeHoursPerBatch" min="1" placeholder="Batches per Month" />
        </div>
        
        <h3>Add an Ingredient</h3>
        <div>
            <label for="ingredient-name">Ingredient Name: </label>
            <select v-model="newIngredientId">
                <option :value="null">-- Select an ingredient --</option>
                <option v-for="ingredient in pantryStore.ingredients" :key="ingredient.id" :value="ingredient.id">
                    {{ ingredient.name }}
                </option>
            </select>
        </div>
        
        <div>
            <label for="quantity">Quantity: </label>
            <input type="number" v-model.number="newCookingQuantity" placeholder="Quantity" />
        <select v-model="newCookingUnit">
            <option value="">-- Select unit --</option>
            <option v-for="unit in allowedUnits" :key="unit" :value="unit">
                {{ unit }}
            </option>
        </select>

        </div>
        
        
        <button @click="addIngredientToRecipe">Add Ingredient</button>
        
        <h4>Recipe Ingredients</h4>

        <!-- add delete ingredient button and  edit button let it persist through refresh-->
        <ul>
            <li v-for="(ingredient,index) in recipeStore.draftRecipeIngredients" :key="index">
                <template v-if="editingIngredientIndex === index">
                    <!-- Edit Mode -->
                    <!-- Ingredient select -->
                    <select v-model="editingIngredientDraft.ingredientId">
                        <option :value="null">-- Select an ingredient --</option>
                        <option v-for="ingredient in pantryStore.ingredients" :key="ingredient.id" :value="ingredient.id">
                            {{ ingredient.name }}
                        </option>
                    </select>
                    <!-- quantity number input -->
                    <input type="number" v-model.number="editingIngredientDraft.quantity" placeholder="Quantity" />
                    <!-- unit select over editAllowedUnit -->
                    <select v-model="editingIngredientDraft.unit">
                        <option value="">-- Select unit --</option>  
                        <option v-for="unit in editAllowedUnits" :key="unit" :value="unit">
                            {{ unit }}
                        </option>
                    </select>
                    <button @click = "cancelIngredientEdit"> Cancel</button>
                    <button @click = "saveIngredientEdit"> Save</button>
                </template>
                <template v-else>
                    {{ pantryStore.ingredients.find(i => i.id === ingredient.ingredientId)?.name }} - {{ ingredient.quantity }} {{ ingredient.unit }}
                    <button @click="editRecipeIngredient(index)">Edit</button>
                    <button @click="removeRecipeIngredient(index)">Delete</button>
                </template>
            </li>
        </ul>
        
        <div>
            <button @click="addRecipe">Add Recipe</button>   
        </div>

        <div>
            <button @click="confirmClearDraft">Clear Draft</button>
        </div>

        <h4>Saved Recipes</h4>
        <p v-if="recipeStore.recipes.length===0">No recipes yet.</p>
        <ul v-else>
            <li v-for="recipe in recipeStore.recipes" :key="recipe.id">
                <!-- Edit Mode -->
                <template v-if="editingId === recipe.id && editDraft">
                    <div>
                        <label for="edit-name">Recipe Name: </label>
                        <input type="text" v-model="editDraft.name" />
                    </div>
                    <div>
                        <label for="edit-servings-per-batch">Servings per Batch: </label>
                        <input type="number" v-model.number="editDraft.servingsPerBatch" min="1" />
                    </div>
                    <div>
                        <label for="edit-hours">Hours per Batch: </label>
                        <input type="number" v-model.number="editDraft.hoursPerBatch" min="0" />
                    </div>
                    <div>
                        <label for="edit-profit-margin">Profit Margin: </label>
                        <input type="number" v-model.number="editDraft.profitMargin" min="0" max="1" step="0.01" />
                    </div>
                    <div>
                        <label for="edit-batches-per-month">Batches per Month: </label>
                        <input type="number" v-model.number="editDraft.batchesPerMonth" min="1" placeholder="1"/>
                    </div>
                    
                    <button @click="saveEdit">Save</button>
                    <button @click="cancelEdit">Cancel</button>
                    
                    <!--List ingredients and edit them as well-->
                    <h5>Ingredients</h5>
                    <ul>
                        <li v-for="(ingredient, index) in editDraft.ingredients" :key="ingredient.ingredientId">
                            {{ pantryStore.ingredients.find(i => i.id === ingredient.ingredientId)?.name }} - {{ ingredient.quantity }} {{ ingredient.unit }} <button @click="removeIngredientFromRecipeDraft(index)">Delete</button>
                        </li>
                    </ul>
                    <!--add ingredient sub form -->
                    
                    <select v-model="editSubFormIngredientId">
                        <option :value="null">-- Select an ingredient --</option>
                        <option v-for="ingredient in pantryStore.ingredients" :key="ingredient.id" :value="ingredient.id">
                            {{ ingredient.name }}
                        </option>               
                    </select>
                    <input type="number" v-model.number="editSubFormCookingQuantity" min="0" placeholder="Quantity" />
                    <select v-model="editSubFormCookingUnit">
                        <option value="">-- Select unit --</option>
                        <option v-for="unit in units" :key="unit" :value="unit">
                            {{ unit }}
                        </option>
                    </select>
                    <button @click="addIngredientToEditDraft">Add Ingredient</button>

                    <div>
                        <button @click="saveEdit">Save</button>
                        <button @click="cancelEdit">Cancel</button>
                    </div>

                </template>
                

                <!--Normal Mode-->
                <template v-else>
                    {{ recipe.name }} - {{ recipe.servingsPerBatch }} Servings per Batch, {{ recipe.hoursPerBatch }} Hours per Batch, {{ (recipe.profitMargin * 100).toFixed(0) }}% Profit Margin, {{ recipe.batchesPerMonth }} Batches per Month
                    <button @click="startEdit(recipe)">Edit</button>
                    <button @click="confirmDelete(recipe.id)">Delete</button>
                </template>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePantryStore } from '~/stores/pantry'
import { useRecipesStore, type RecipeIngredient, type Recipe  } from '~/stores/recipes'
import { unitKind } from '~/utils/conversion'
import  densities  from '~/data/densities.json'
import { units } from '~/utils/units'

const recipeStore = useRecipesStore()
const pantryStore = usePantryStore()
const newIngredientId = ref<number | null>(null)

const newCookingQuantity = ref(1)
const newCookingUnit = ref('')

const editingId = ref<number|null>(null)
const editDraft = ref<Recipe | null>(null)

const editSubFormIngredientId = ref<number | null>(null)
const editSubFormCookingQuantity = ref(1)
const editSubFormCookingUnit = ref('')

const allowedUnits = computed(() => unitForIngredient(newIngredientId.value))

const editingIngredientIndex = ref<number | null>(null)
const editingIngredientDraft = ref({
    ingredientId: null as number | null,
    quantity: 1,
    unit: ''
})
const editAllowedUnits = computed(() => unitForIngredient(editingIngredientDraft.value.ingredientId))

function editRecipeIngredient(index: number) {
    const ingredient =  recipeStore.draftRecipeIngredients[index]
    if(!ingredient) return
    editingIngredientIndex.value = index
    editingIngredientDraft.value = { ...ingredient }
}

function cancelIngredientEdit() {
    editingIngredientIndex.value = null
    editingIngredientDraft.value = {
        ingredientId: null,
        quantity: 1,
        unit: ''
    }
}

function saveIngredientEdit() {
    const draft = editingIngredientDraft.value

    if (editingIngredientIndex.value === null) return

    if (draft.ingredientId === null || draft.quantity <= 0 || !draft.unit) {
        alert('Please select an ingredient and enter valid quantity and unit before saving the edit')
        return
    }

    recipeStore.draftRecipeIngredients[editingIngredientIndex.value] = { 
        ingredientId: draft.ingredientId, 
        quantity: draft.quantity, 
        unit: draft.unit 
    }

    cancelIngredientEdit()

}

// a function to replace the steps in allowedUnits so I can reuse it in editing
function unitForIngredient(id: (number | null)): string[] { 
    if (!id) return units
    const idName = pantryStore.ingredients.find( i => i.id === id )
    if (!idName){return units}

    if (unitKind(idName.unit) === 'count') return units.filter(u => unitKind(u) === 'count')
    const isInFAO = densities.some(d => d.name === idName.name)
    if (isInFAO) {return units}
    const targetKind = unitKind(idName.unit)
    return units.filter(u => unitKind(u) === targetKind)
}

function resetForm() {
    recipeStore.draftRecipeName = ''
    recipeStore.draftRecipeServingsPerBatch= 1
    recipeStore.draftRecipeIngredients = []
    recipeStore.draftRecipeHoursPerBatch = 1
    recipeStore.draftRecipeProfitMargin = 0.30
    recipeStore.draftRecipeHoursPerBatch = 1
}

function resetSubForm() {
    newIngredientId.value = null
    newCookingQuantity.value = 1
    newCookingUnit.value = ''
}

function addRecipe() {
    // Validate 

    if (!recipeStore.draftRecipeName.trim() ||recipeStore.draftRecipeServingsPerBatch < 1 || recipeStore.draftRecipeIngredients.length === 0 || recipeStore.draftRecipeHoursPerBatch <=0 || recipeStore.draftRecipeProfitMargin < 0 || recipeStore.draftRecipeProfitMargin >= 1 || recipeStore.draftRecipeHoursPerBatch < 1) {
        alert('Please enter a valid recipe name and at least 1 serving per batch before adding a recipe, and ensure at least one ingredient is added.')
        return
    }

    recipeStore.addRecipe(recipeStore.draftRecipeName, recipeStore.draftRecipeIngredients, recipeStore.draftRecipeServingsPerBatch, recipeStore.draftRecipeHoursPerBatch, recipeStore.draftRecipeProfitMargin, recipeStore.draftRecipeHoursPerBatch)
    resetForm()
}

function addIngredientToRecipe(){
    // Validate
    if (newIngredientId.value === null || newCookingQuantity.value <= 0 || !newCookingUnit.value) {
        alert('Please select an ingredient and enter valid quantity and unit before adding to recipe')
        return
    }

    // Push one ingredient onto newRecipeIngredients.value

    recipeStore.draftRecipeIngredients.push({ ingredientId: newIngredientId.value, 
        quantity: newCookingQuantity.value, 
        unit: newCookingUnit.value 
    })

    // Reset only the three ingredient sub-form fields
    resetSubForm()

}

function confirmDelete(recipeId: number) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        recipeStore.removeRecipe(recipeId)
    }
}

function confirmClearDraft() {
    if (confirm('Are you sure you want to clear the draft recipe? This will remove all unsaved changes.')) {
        resetForm()
    }
}

function removeRecipeIngredient(index: number) {
    recipeStore.draftRecipeIngredients = recipeStore.draftRecipeIngredients.filter((item, i) => i !== index)
}

function startEdit(recipe:Recipe) {
    editingId.value = recipe.id
    editDraft.value = JSON.parse(JSON.stringify(recipe)) // Create a copy for editing    
}

function saveEdit(){

    if (editingId.value === null || !editDraft.value) return    

    // Validate with addRecipe rules - name, servings per batch, hours per batch, profit margin, and at least 1 ingredient
    if (!editDraft.value?.name.trim() || editDraft.value.servingsPerBatch < 1 || editDraft.value.ingredients.length === 0 || editDraft.value.hoursPerBatch <=0 || editDraft.value.profitMargin < 0 || editDraft.value.profitMargin >= 1 || editDraft.value.batchesPerMonth < 1) {
        alert('Please enter a valid recipe name and at least 1 serving per batch before saving the recipe, and ensure at least one ingredient is added and that batches per month is at least 1.')
        return
    }
    recipeStore.updateRecipe(editingId.value, editDraft.value.name, editDraft.value.ingredients, editDraft.value.servingsPerBatch, editDraft.value.hoursPerBatch, editDraft.value.profitMargin, editDraft.value.batchesPerMonth)

    // Reset editing state
    editingId.value = null
    editDraft.value = null
}

function cancelEdit() {
    editingId.value = null
    editDraft.value = null
}

function removeIngredientFromRecipeDraft(index: number) {
    if (editDraft.value !== null){
        editDraft.value.ingredients.splice(index, 1)
    }
}

function addIngredientToEditDraft(){
    // Validate
    if (editSubFormIngredientId.value === null || editSubFormCookingQuantity.value <= 0 || !editSubFormCookingUnit.value) {
        alert('Please select an ingredient and enter valid quantity and unit before adding to recipe')
        return
    }

    if (editDraft.value === null) return

    editDraft.value.ingredients.push({ 
        ingredientId: editSubFormIngredientId.value, 
        quantity: editSubFormCookingQuantity.value, 
        unit: editSubFormCookingUnit.value
    })
    
    resetEditSubForm()
}

function resetEditSubForm() {
    editSubFormIngredientId.value = null
    editSubFormCookingQuantity.value = 1
    editSubFormCookingUnit.value = ''
}   

// Fixing a bug where the Quantity unit does not reset when the ingredient is changed in the sub-form. This is because the allowedUnits computed property is not reactive to changes in newIngredientId. We can fix this by watching newIngredientId and resetting newCookingUnit when it changes.

watch(newIngredientId, () => {
    newCookingUnit.value = ''
})

watch(() => editingIngredientDraft.value.ingredientId, (newId, oldId) => {
    if (oldId !== null) {
        editingIngredientDraft.value.unit = ''
    }
})


</script>

<style scoped>
label {
    display: inline-block;
    width: 150px;
    margin-top: 10px;
}
</style>