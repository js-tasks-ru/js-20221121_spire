/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sortedArray = [...arr];

    return sortedArray.sort((firstStr, secondStr) => {
        let a = firstStr;
        let b = secondStr;
        if (param === 'desc') {
            a = secondStr;

            b = firstStr;
        }
        return a.localeCompare(b, ['ru-RU', 'en-US'], { caseFirst: 'upper' })
    })
}