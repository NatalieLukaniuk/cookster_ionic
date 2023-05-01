export const areObjectsEqual = (obj1: Object, obj2: Object) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const areArraysEqual = (arr1: Array<any>, arr2: Array<any>) => (arr1.length == arr2.length) && arr1.every(function(element, index) {
  return element === arr2[index]; 
});