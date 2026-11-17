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
