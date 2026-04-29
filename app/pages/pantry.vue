<template>
    <div>
        <h2>Pantry</h2>
        <p>Add Ingredients to Pantry.</p>
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
                <tr v-for="ingredient in ingredients" :key="ingredient.name">
                    <td>{{ ingredient.name }}</td>
                    <td>{{ ingredient.quantity }}</td>
                    <td>{{ ingredient.unit }}</td>
                    <td>{{ ingredient.cost.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>   
const ingredients = [
    {name: 'Flour', quantity: 5, unit: 'lbs', cost: 2.50},
    {name: 'Sugar', quantity: 3, unit: 'lbs', cost: 1.80},
    {name: 'Butter', quantity: 2, unit: 'lbs', cost: 3.00},
    {name: 'Eggs', quantity: 12, unit: 'each', cost: 2.00}
    ];
</script>

<style>

</style>

