import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

// Global store for hourlyWage, monthlyOverhead, and monthlyHoursWorked

export const useGlobalStore = defineStore('global', () => {
    const hourlyWage = ref<number | null>(null)
    const monthlyOverhead = ref<number| null>(null)
    const monthlyHoursWorked = ref<number  | null>(null) 
    function loadFromLocalStorage() {
    if (typeof window === 'undefined') return null
    
    const storedHourlyWage = localStorage.getItem('global-hourlyWage')
    const storedMonthlyOverhead = localStorage.getItem('global-monthlyOverhead')
    const storedMonthlyHoursWorked = localStorage.getItem('global-monthlyHoursWorked')
    
    return {
        hourlyWage: storedHourlyWage !== null ? JSON.parse(storedHourlyWage) : null,
        monthlyOverhead: storedMonthlyOverhead !== null ? JSON.parse(storedMonthlyOverhead) : null,
        monthlyHoursWorked: storedMonthlyHoursWorked !== null ? JSON.parse(storedMonthlyHoursWorked) : null,
    }
}

    function saveToLocalStorage() {
        if (typeof window === 'undefined') {
            return
        }
        localStorage.setItem('global-hourlyWage', JSON.stringify(hourlyWage.value))
        localStorage.setItem('global-monthlyOverhead', JSON.stringify(monthlyOverhead.value))
        localStorage.setItem('global-monthlyHoursWorked', JSON.stringify(monthlyHoursWorked.value))
    }   

    onMounted(() => {
        const loaded = loadFromLocalStorage()       
        if (loaded) {
            hourlyWage.value = loaded.hourlyWage
            monthlyOverhead.value = loaded.monthlyOverhead
            monthlyHoursWorked.value = loaded.monthlyHoursWorked
        }
    })

    function updateHourlyWage(newWage: number) {
        hourlyWage.value = newWage
        saveToLocalStorage()
    }
    function updateMonthlyOverhead(newOverhead: number) {
        monthlyOverhead.value = newOverhead
        saveToLocalStorage()
    }
    function updateMonthlyHoursWorked(newHours: number) {
        monthlyHoursWorked.value = newHours
        saveToLocalStorage()
    }

    return {
        hourlyWage,
        monthlyOverhead,
        monthlyHoursWorked,
        updateHourlyWage,
        updateMonthlyOverhead,
        updateMonthlyHoursWorked,    
    }
})