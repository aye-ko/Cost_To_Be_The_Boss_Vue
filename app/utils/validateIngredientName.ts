export function validateIngredientName(name: string): boolean {
    const trimmed = name.trim()
    if (!trimmed) return false                    // empty or whitespace-only

    const allowed = /^[A-Za-z0-9 ,().:'\/-]+$/                    // ← your one blank
    if (!allowed.test(trimmed)) return false      // any character outside the set

    if (!/[a-zA-Z]/.test(trimmed)) return false   // must contain a letter

    return true
}