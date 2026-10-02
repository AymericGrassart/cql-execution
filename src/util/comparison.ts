import { Uncertainty } from '../datatypes/datatypes';

// Performance optimization: Cache Intl.Collator for locale-insensitive string equivalence comparisons
const enCollator = new Intl.Collator('en', { sensitivity: 'base' });

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

export function equivalent(a: any, b: any): any {
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }

  // Fast path: string primitives comparison
  if (typeof a === 'string' && typeof b === 'string') {
    if (a === b) {
      return true;
    }
    // String equivalence is case- and locale insensitive, ignoring whitespace differences
    const normA = a.replace(/\s/g, ' ');
    const normB = b.replace(/\s/g, ' ');
    return enCollator.compare(normA, normB) === 0;
  }

  // Fast path: primitive numbers or booleans
  if (typeof a === typeof b && (typeof a === 'number' || typeof a === 'boolean')) {
    return a === b;
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

  const [aClass, bClass] = getClassOfObjects(a, b);

  switch (aClass) {
    case '[object Array]':
      return compareEveryItemInArrays(a, b, equivalent);
    case '[object Object]':
      return compareObjects(a, b, equivalent);
    case '[object String]':
      if (bClass === '[object String]') {
        const normA = a.replace(/\s/g, ' ');
        const normB = b.replace(/\s/g, ' ');
        return enCollator.compare(normA, normB) === 0;
      }
      break;
  }

  return equals(a, b);
}

function isCode(object: any) {
  return object.hasMatch && typeof object.hasMatch === 'function';
}

function codesAreEquivalent(code1: any, code2: any) {
  return code1.hasMatch(code2);
}

function getClassOfObjects(object1: any, object2: any) {
  return [Object.prototype.toString.call(object1), Object.prototype.toString.call(object2)];
}

function compareEveryItemInArrays(array1: any[], array2: any[], comparisonFunction: any) {
  return (
    array1.length === array2.length &&
    array1.every((item, i) => comparisonFunction(item, array2[i]))
  );
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
  const aKeys = getKeysFromObject(a).sort();
  const bKeys = getKeysFromObject(b).sort();
  // Array.every() will only return true or false, so set a flag for if we should return null
  let shouldReturnNull = false;
  // Check if both arrays of keys are the same length and key names match
  if (aKeys.length === bKeys.length && aKeys.every((value, index) => value === bKeys[index])) {
    finalComparisonResult = aKeys.every(key => {
      // if both are null we should return true to satisfy ignoring empty values in tuples
      if (a[key] == null && b[key] == null) {
        return true;
      }
      const comparisonResult = comparisonFunction(a[key], b[key]);
      if (comparisonResult === null) {
        shouldReturnNull = true;
      }
      return comparisonResult;
    });
  } else {
    finalComparisonResult = false;
  }

  if (shouldReturnNull) {
    return null;
  }
  return finalComparisonResult;
}

function getKeysFromObject(object: any) {
  return Object.keys(object).filter(k => !isFunction(object[k]));
}

function isFunction(input: any) {
  return typeof input === 'function';
}

export function equals(a: any, b: any) {
  // Handle null cases first: spec says if either is null, return null
  if (a == null || b == null) {
    return null;
  }

  // Early fast path for primitives (strings, numbers, booleans)
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA === typeB && (typeA === 'number' || typeA === 'boolean' || typeA === 'string')) {
    return a === b;
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

  // Return false if they are instances of different classes
  const [aClass, bClass] = getClassOfObjects(a, b);
  if (aClass !== bClass) {
    return false;
  }

  switch (aClass) {
    case '[object Date]':
      // Compare the ms since epoch
      return a.getTime() === b.getTime();
    case '[object RegExp]':
      // Compare the components of the regular expression
      return ['source', 'global', 'ignoreCase', 'multiline'].every(p => a[p] === b[p]);
    case '[object Array]':
      if (
        a.indexOf(null) >= 0 ||
        a.indexOf(undefined) >= 0 ||
        b.indexOf(null) >= 0 ||
        b.indexOf(undefined) >= 0
      ) {
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
