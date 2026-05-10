<template>
    <div>
        <h2>Recipes</h2>
        <p>Create the Recipes</p>
        <input type="text" v-model="newRecipeName" placeholder="Recipe Name" />
        <input type="number" v-model.number="newServingsPerBatch" min="1" placeholder="Servings per Batch" />
        
        <h3>Add an Ingredient</h3>
        <select v-model="newIngredientId">
            <option :value="null">-- Select an ingredient --</option>
            <option v-for="ingredient in pantryStore.ingredients" :key="ingredient.id" :value="ingredient.id">
                {{ ingredient.name }}
            </option>
        </select>
        <input type="number" v-model.number="newCookingQuantity" min="0" placeholder="Quantity" />
        <select v-model="newCookingUnit">
            <option value="">-- Select unit --</option>
            <option v-for="unit in units" :key="unit" :value="unit">
                {{ unit }}
            </option>
        </select>
        
        <button @click="addIngredientToRecipe">Add Ingredient</button>
        
        <h4>Recipe Ingredients</h4>
        <ul>
            <li v-for="ingredient in newRecipeIngredients" :key="ingredient.ingredientId">
                {{ pantryStore.ingredients.find(i => i.id === ingredient.ingredientId)?.name }} - {{ ingredient.quantity }} {{ ingredient.unit }}
            </li>
        </ul>
        
        <button @click="addRecipe">Add Recipe</button>
        <h4>Saved Recipes</h4>
        <p v-if="recipeStore.recipes.length===0">No recipes yet.</p>
        <ul v-else>
            <li v-for="recipe in recipeStore.recipes" :key="recipe.id">
                <!-- Edit Mode -->
                <template v-if="editingId === recipe.id && editDraft">
                    <input type="text" v-model="editDraft.name" />
                    <input type="number" v-model.number="editDraft.servingsPerBatch" min="1" />
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
    
                    
                </template>

                <!--Normal Mode-->
                <template v-else>
                    {{ recipe.name }} - {{ recipe.servingsPerBatch }} Servings per Batch
                    <button @click="startEdit(recipe)">Edit</button>
                    <button @click="confirmDelete(recipe.id)">Delete</button>
                </template>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePantryStore } from '~/stores/pantry'
import { useRecipesStore, type RecipeIngredient, type Recipe  } from '~/stores/recipes'


const recipeStore = useRecipesStore()
const pantryStore = usePantryStore()
const newRecipeName = ref('')
const newServingsPerBatch = ref(1)
const newRecipeIngredients= ref<RecipeIngredient[]>([])
const newIngredientId = ref<number | null>(null)
const newCookingQuantity = ref(1)
const newCookingUnit = ref('')
const units =  ['cup', 
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
const editDraft = ref<Recipe | null>(null)

const editSubFormIngredientId = ref<number | null>(null)
const editSubFormCookingQuantity = ref(1)
const editSubFormCookingUnit = ref('')

function resetForm() {
    newRecipeName.value = ''
    newServingsPerBatch.value = 1
    newRecipeIngredients.value = []
}

function resetSubForm() {
    newIngredientId.value = null
    newCookingQuantity.value = 1
    newCookingUnit.value = ''
}

function addRecipe() {
    // Validate 

    if (!newRecipeName.value.trim() || newServingsPerBatch.value < 1 || newRecipeIngredients.value.length === 0) {
        alert('Please enter a valid recipe name and at least 1 serving per batch before adding a recipe, and ensure at least one ingredient is added.')
        return
    }

    recipeStore.addRecipe(newRecipeName.value, newRecipeIngredients.value, newServingsPerBatch.value)
    resetForm()
}

function addIngredientToRecipe(){
    // Validate
    if (newIngredientId.value === null || newCookingQuantity.value <= 0 || !newCookingUnit.value) {
        alert('Please select an ingredient and enter valid quantity and unit before adding to recipe')
        return
    }

    // Push one ingredient onto newRecipeIngredients.value

    newRecipeIngredients.value.push({ ingredientId: newIngredientId.value, 
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

function startEdit(recipe:Recipe) {
    editingId.value = recipe.id
    editDraft.value = JSON.parse(JSON.stringify(recipe)) // Create a copy for editing    
}

function saveEdit(){
    if (editingId.value === null || !editDraft.value) return    
    recipeStore.updateRecipe(editingId.value, editDraft.value.name, editDraft.value.ingredients, editDraft.value.servingsPerBatch)

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


</script>
