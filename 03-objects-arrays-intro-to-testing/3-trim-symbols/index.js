/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0) return '';
    if (!size) return string;

    const arrFromString = string.split('')
    const result = [];

    result.push(arrFromString[0])
    let numOfRepeat = 1;

    for (let i = 1; i < arrFromString.length; i++) {
        const currentItem = arrFromString[i];
        const prevItem = arrFromString[i - 1];

        const same = (currentItem === prevItem);

        if (same && numOfRepeat < size) {
            result.push(currentItem);
            numOfRepeat++
        }

        if (!same) {
            result.push(currentItem);
            numOfRepeat = 1
        }
    }
    return result.join('')
}