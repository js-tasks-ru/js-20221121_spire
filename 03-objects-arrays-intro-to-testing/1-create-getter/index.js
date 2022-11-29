/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    const arrOfParams = path.split('.').reverse();
    let sizeOfParams = arrOfParams.length;

    return function foo(obj) {
        if (Object.keys(obj).length === 0) {
            return
        }

        if (sizeOfParams === 1) {
            const target = arrOfParams[0]
            return obj[target]
        }

        const prevParam = arrOfParams[--sizeOfParams]
        return foo(obj[prevParam])
    }
}
