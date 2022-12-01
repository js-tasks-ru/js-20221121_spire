/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    if (!arr) return []

    const result = [];

    arr.map(item => {
        if (!result.includes(item)) {
            result.push(item)
        }
    })

    return result
}
