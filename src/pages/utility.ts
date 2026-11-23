export const debounce = (fn: (...args: any[]) => void, delay: number): (...args: any[]) => void => { //execute after calls have stopped for a specified period
    let timer: number | null = null;
    return (...args: any[]) => {
        if (timer !== null) clearTimeout(timer); // if have the timer , need to clear it every time to reset the delay
        timer = setTimeout(() => {
            fn(...args);
            timer = null; // after execute fn , the timer need to be set null;
        }, delay);
    }
}

export const throttle = (fn: (...args: any[]) => void, interval: number): (...args: any[]) => void => { //when trigger the fn frequently ,just allow the fn excute interval
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timer === null) { // do not excute fn when the timer exist  
            fn(...args);
            timer = setTimeout(() => { // the timeout just for resetting the timer 
                timer = null;
            }, interval);
        }
    }
}

export const deepClone = (obj: any): any => {  // keep clone nested obj
    let newOne;
    // estimate obj type
    if (Array.isArray(obj)) {
        newOne = [] as any[];
        for (const element of obj) { // recursive the element until do not have nested obj , save the clone element into new obj
            newOne.push(deepClone(element));
        }
    } else if (obj !== null && typeof obj === 'object') {
        newOne = {} as Record<string, any>;
        for (const key in obj) {
            if (!Object.hasOwn(obj, key)) continue;
            const element = obj[key];
            newOne[key] = deepClone(element);
        }
    } else {
        newOne = obj;
    }
    return newOne;
}

export const flatten = (arr: any[]): any[] => { // spread the nested array into sigle array
    let flattedArr: any[] = [];
    for (const element of arr) {
        if (Array.isArray(element)) { // the point is keep spread the deep array
            flattedArr.push(...flatten(element));
        } else {
            flattedArr.push(element);
        }
    }
    return flattedArr;
}

export const unique = (arr: any[]): any[] => { // remove repeat element in the array 
    const uniqueArr: any[] = [];
    for (const element of arr) {
        if (!uniqueArr.includes(element)) {  // use includes to estimate the element is repeat or not 
            uniqueArr.push(element);
        }
    }
    return uniqueArr;
}
interface Item { parentId: number | null, name: string, id: number };
interface TreeItem extends Item {
    children: Item[];
}
export const arrayToTree = (arr: Item[]): TreeItem[] => {
    const tree: TreeItem[] = [];
    for (const element of arr) {
        tree.push({ ...element, children: [] });
    }
    for (const element of tree) {  // bind the relation for every items , after finish the loop binding , the roots has all the nested items
        const parent = tree.find((item) => item.id === element.parentId);
        parent?.children.push(element);
    }
    return tree.filter((item) => item.parentId === null);
}

export const groupBy = (arr: Record<string, any>[], key: string): Record<string, Record<string, any>[]> => { // group array by a property
    const group: Record<string, Record<string, any>[]> = {};
    for (const element of arr) { // loop the array , use the property as the key to creat the group object
        const prop = element[key];
        if (!group[prop]) {
            group[prop] = [];
        }
        group[prop].push(element);
    }
    return group;
}

export const chunk1 = (arr: any[], size: number) => { // slice array into specific size array
    let box: any[] = [];
    const newList: any[][] = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (index % size === 0 && index !== 0) {
            newList.push(box);
            box = [];
        }
        box.push(element);
    }
    newList.push(box);
    return newList;
}

export const chunk2 = (arr: any[], size: number) => {
    const newList: any[][] = [];
    for (let index = 0; index < arr.length; index += size) {
        newList.push(arr.slice(index, index + size));
    }
}

export const myFind = (arr: any[], callback: (element: any, index: number) => boolean): any => { // find the first match element from array
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (callback(element, index)) return element;
    }
}

export const myMap = (arr: any[], callback: (element: any, index: number) => any): any[] => { // transforms array
    const newList: any[] = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        newList.push(callback(element, index));
    }
    return newList;
}

export const myFilter = (arr: any[], callback: (element: any, index: number) => boolean): any[] => { // filter array with condition , return array with match elements
    const filterList: any[] = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (callback(element, index)) filterList.push(element);
    }
    return filterList;
}

export const myReduce = (arr: any[], callback: (accumulator: any, currentValue: any, index: number) => any, initialVal: any): any => { // use the function result as the parameter to repeat excute the function
    let accumulator = initialVal;
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        accumulator = callback(accumulator, element, index);
    }
    return accumulator;
}

export const memoize = (callback: (...args: any[]) => any) => { // caches the funtion result and if next time call the fn with same args , will return the cache result
    const map = new Map();
    return (...args: any[]) => {
        const key = JSON.stringify(args);
        if (map.has(key)) {
            return map.get(key);
        }
        else {
            const result = callback(...args);
            map.set(key, result);
            return result
        }
    }
}

export const sleep = (time: number): Promise<void> => { //
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

export const retry = async (callback: (...args: any[]) => Promise<any>, times: number, ...args: any[]) => { // retry asyn request by specific times
    let err;
    for (let index = 0; index <= times; index++) {
        try { // when asyn error , catch error and excute again
            return await callback(...args);
        } catch (error) {
            err = error;
        }
    }
    return err;
}

export const promiseAll = <T>(arr: Promise<T>[]) => { //put several promises in, and excute them concurrence. after all finish return all the result by new one promise
    const resultList: any[] = [];
    let times = 0;
    return new Promise((resolve, reject) => { // A Promise can only settle once. Subsequent resolve/reject calls are ignored.
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            element.then((res) => {
                times++;
                resultList[index] = res;
                if (times === arr.length) resolve(resultList); // after all promise success , resolve the return promise.
            }).catch(reject);
        }
    })
}

export const promiseRace = <T>(arr: Promise<T>[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        for (const element of arr) {
            element.then(resolve).catch(reject); // A Promise can only settle once. Subsequent resolve/reject calls are ignored.
        }
    })
}

export const promiseAllSettled = <T>(arr: Promise<T>[]): Promise<PromiseSettledResult<T>[]> => { // return all promise result , include failure
    const resultList: PromiseSettledResult<T>[] = [];
    let times: number = 0;
    return new Promise((resolve) => {
        if (arr.length === 0) {
            resolve([]);
            return;
        }
        arr.forEach((element, index) => {
            element.then((value) => {
                resultList[index] = { 'status': 'fulfilled', 'value': value };
            }).catch((reason) => {
                resultList[index] = { 'status': 'rejected', 'reason': reason };
            }).finally(() => {
                times++;
                if (times === arr.length) resolve(resultList)
            })
        })
    })
}

export const promisePool = <T>(arr: (() => Promise<T>)[], limit: number): Promise<PromiseSettledResult<T>[]> => { // limit how many asyn excute at once
    const resultList: PromiseSettledResult<T>[] = [];
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < arr.length; i += limit) {
            const pool = arr.slice(i, i + limit); // slice the limit size asyn to excute
            let times = 0;
            await new Promise<void>((resolve1) => {
                pool.forEach((element, index) => {
                    element().then((value) => {
                        resultList[index + i] = { 'status': 'fulfilled', 'value': value };
                    }).catch((reason) => {
                        resultList[index + i] = { 'status': 'rejected', 'reason': reason };
                    }).finally(() => {
                        times++
                        if (times === pool.length) resolve1();
                    })
                });
            })
        }
        resolve(resultList);
    })
}

class EventEmitter {
    private event = new Map<string, Function>();
    on = (name: string, callback: (...args: any[]) => void) => {
        this.event.set(name, callback);
    }
    emit = (name: string, ...args: any[]) => {
        const fn = this.event.get(name);
        if (fn) {
            fn(...args);
        }
    }
    off = (name: string) => {
        this.event.delete(name);
    }
}

const once = (callback: (...args: any[]) => any) => {
    let firstTime = true;
    let result: any;
    return (...args: any[]) => {
        if (firstTime) {
            firstTime = false;
            result = callback(...args);
        }
        return result;
    }
}

const MyThrottle = (callback: (...args: any[]) => any, limit: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timer === null) {
            timer = setTimeout(() => {
                timer = null;
            }, limit);
            callback(...args);
        }
    }
}

const MyDebounce = (callback: (...args: any[]) => any, delay: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            callback(...args);
        }, delay);
    }
}

