import { Uncertainty } from '../datatypes/datatypes';

function getClass(obj: any) {
  return Object.prototype.toString.call(obj);
}

function isUncertainty(x: any) {
  return x instanceof Uncertainty;
}

export function lessThan(a: any, b: any, precision?: any) {
  if (a == null || b == null) {
    return null;
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if ((typeA === 'number' && typeB === 'number') || (typeA === 'string' && typeB === 'string')) {
    return a < b;
  } else if (
    (a.isDateTime && b.isDateTime) ||
    (a.isDate && b.isDate) ||
    (a.isQuantity && b.isQuantity)
  ) {
    return a.before(b, precision);
  } else if (isUncertainty(a)) {
    return a.lessThan(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).lessThan(b);
  } else {
    return null;
  }
}

export function lessThanOrEquals(a: any, b: any, precision?: any) {
  if (a == null || b == null) {
    return null;
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if ((typeA === 'number' && typeB === 'number') || (typeA === 'string' && typeB === 'string')) {
    return a <= b;
  } else if (
    (a.isDateTime && b.isDateTime) ||
    (a.isDate && b.isDate) ||
    (a.isQuantity && b.isQuantity)
  ) {
    return a.sameOrBefore(b, precision);
  } else if (isUncertainty(a)) {
    return a.lessThanOrEquals(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).lessThanOrEquals(b);
  } else {
    return null;
  }
}

export function greaterThan(a: any, b: any, precision?: any) {
  if (a == null || b == null) {
    return null;
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if ((typeA === 'number' && typeB === 'number') || (typeA === 'string' && typeB === 'string')) {
    return a > b;
  } else if (
    (a.isDateTime && b.isDateTime) ||
    (a.isDate && b.isDate) ||
    (a.isQuantity && b.isQuantity)
  ) {
    return a.after(b, precision);
  } else if (isUncertainty(a)) {
    return a.greaterThan(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).greaterThan(b);
  } else {
    return null;
  }
}

export function greaterThanOrEquals(a: any, b: any, precision?: any) {
  if (a == null || b == null) {
    return null;
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if ((typeA === 'number' && typeB === 'number') || (typeA === 'string' && typeB === 'string')) {
    return a >= b;
  } else if (
    (a.isDateTime && b.isDateTime) ||
    (a.isDate && b.isDate) ||
    (a.isQuantity && b.isQuantity)
  ) {
    return a.sameOrAfter(b, precision);
  } else if (isUncertainty(a)) {
    return a.greaterThanOrEquals(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).greaterThanOrEquals(b);
  } else {
    return null;
  }
}

export function equivalent(a: any, b: any) {
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }

  // Fast path for string equivalence
  if (typeof a === 'string' && typeof b === 'string') {
    if (a === b) {
      return true;
    }
    // String equivalence is case- and locale insensitive, converting whitespace chars to spaces
    const normA = /\s/.test(a) ? a.replace(/\s/g, ' ') : a;
    const normB = /\s/.test(b) ? b.replace(/\s/g, ' ') : b;
    return normA.localeCompare(normB, 'en', { sensitivity: 'base' }) === 0;
  }

  if (isCode(a)) {
    return codesAreEquivalent(a, b);
  }

  // Quantity equivalence is the same as Quantity equality
  if (a.isQuantity) {
    return a.equals(b);
  }

  // Use overloaded 'equivalent' function if it is available
  if (typeof a.equivalent === 'function') {
    return a.equivalent(b);
  }

  const aClass = getClass(a);

  switch (aClass) {
    case '[object Array]':
      return compareEveryItemInArrays(a, b, equivalent);
    case '[object Object]':
      return compareObjects(a, b, equivalent);
  }

  return equals(a, b);
}

function isCode(object: any) {
  return object.hasMatch && typeof object.hasMatch === 'function';
}

function codesAreEquivalent(code1: any, code2: any) {
  return code1.hasMatch(code2);
}

function compareEveryItemInArrays(array1: any[], array2: any[], comparisonFunction: any) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    const res = comparisonFunction(array1[i], array2[i]);
    if (!res) {
      return res;
    }
  }
  return true;
}

function compareObjects(a: any, b: any, comparisonFunction: any) {
  if (!classesEqual(a, b)) {
    return false;
  }
  return deepCompareKeysAndValues(a, b, comparisonFunction);
}

function classesEqual(object1: any, object2: any) {
  return object2 instanceof object1.constructor && object1 instanceof object2.constructor;
}

function deepCompareKeysAndValues(a: any, b: any, comparisonFunction: any) {
  let finalComparisonResult;
  const aKeys = getKeysFromObject(a);
  const bKeys = getKeysFromObject(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  // Check if keys match in order (fast path for objects of identical structure)
  let keysMatchInOrder = true;
  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) {
      keysMatchInOrder = false;
      break;
    }
  }

  let orderedAKeys = aKeys;
  if (!keysMatchInOrder) {
    orderedAKeys = aKeys.slice().sort();
    const sortedBKeys = bKeys.slice().sort();
    for (let i = 0; i < orderedAKeys.length; i++) {
      if (orderedAKeys[i] !== sortedBKeys[i]) {
        return false;
      }
    }
  }

  let shouldReturnNull = false;
  finalComparisonResult = true;

  for (let i = 0; i < orderedAKeys.length; i++) {
    const key = orderedAKeys[i];
    if (a[key] == null && b[key] == null) {
      continue;
    }
    const comparisonResult = comparisonFunction(a[key], b[key]);
    if (comparisonResult === null) {
      shouldReturnNull = true;
    } else if (!comparisonResult) {
      finalComparisonResult = false;
      break;
    }
  }

  if (shouldReturnNull) {
    return null;
  }
  return finalComparisonResult;
}

function getKeysFromObject(object: any) {
  const keys = Object.keys(object);
  let hasFunc = false;
  for (let i = 0; i < keys.length; i++) {
    if (isFunction(object[keys[i]])) {
      hasFunc = true;
      break;
    }
  }
  if (!hasFunc) {
    return keys;
  }
  return keys.filter(k => !isFunction(object[k]));
}

function isFunction(input: any) {
  return typeof input === 'function';
}

function arrayContainsNullOrUndefined(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == null) {
      return true;
    }
  }
  return false;
}

export function equals(a: any, b: any) {
  // Handle null cases first: spec says if either is null, return null
  if (a == null || b == null) {
    return null;
  }

  // If one is a Quantity, use the Quantity equals function
  if (a.isQuantity) {
    return a.equals(b);
  }

  // If one is a Ratio, use the ratio equals function
  if (a.isRatio) {
    return a.equals(b);
  }

  // If one is an Uncertainty, convert the other to an Uncertainty
  if (a instanceof Uncertainty) {
    b = Uncertainty.from(b);
  } else if (b instanceof Uncertainty) {
    a = Uncertainty.from(a);
  }

  // Use overloaded 'equals' function if it is available
  if (typeof a.equals === 'function') {
    return a.equals(b);
  }

  // Return true if the objects are primitives (number, string, boolean) and strictly equal
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA === 'string' || typeA === 'number' || typeA === 'boolean') {
    if (typeA === typeB) {
      return a === b;
    }
    return false;
  }

  // Return false if they are instances of different classes
  const aClass = getClass(a);
  const bClass = getClass(b);
  if (aClass !== bClass) {
    return false;
  }

  switch (aClass) {
    case '[object Date]':
      // Compare the ms since epoch
      return a.getTime() === b.getTime();
    case '[object RegExp]':
      // Compare the components of the regular expression
      return (
        a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline
      );
    case '[object Array]':
      if (arrayContainsNullOrUndefined(a) || arrayContainsNullOrUndefined(b)) {
        return null;
      }
      return compareEveryItemInArrays(a, b, equals);
    case '[object Object]':
      return compareObjects(a, b, equals);
    case '[object Function]':
      return a.toString() === b.toString();
  }

  // If we made it this far, we can't handle it
  return false;
}
