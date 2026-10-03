import { Uncertainty } from '../datatypes/datatypes';

// Cached Object.prototype.toString to avoid creating object literals `{}` on every call
const objectToString = Object.prototype.toString;

function areNumbers(a: any, b: any) {
  return typeof a === 'number' && typeof b === 'number';
}

function areStrings(a: any, b: any) {
  return typeof a === 'string' && typeof b === 'string';
}

function areDateTimesOrQuantities(a: any, b: any) {
  return (
    (a && a.isDateTime && b && b.isDateTime) ||
    (a && a.isDate && b && b.isDate) ||
    (a && a.isQuantity && b && b.isQuantity)
  );
}

function isUncertainty(x: any) {
  return x instanceof Uncertainty;
}

export function lessThan(a: any, b: any, precision?: any) {
  if (areNumbers(a, b) || areStrings(a, b)) {
    return a < b;
  } else if (areDateTimesOrQuantities(a, b)) {
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
  if (areNumbers(a, b) || areStrings(a, b)) {
    return a <= b;
  } else if (areDateTimesOrQuantities(a, b)) {
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
  if (areNumbers(a, b) || areStrings(a, b)) {
    return a > b;
  } else if (areDateTimesOrQuantities(a, b)) {
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
  if (areNumbers(a, b) || areStrings(a, b)) {
    return a >= b;
  } else if (areDateTimesOrQuantities(a, b)) {
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

  const aClass = objectToString.call(a);
  const bClass = objectToString.call(b);

  switch (aClass) {
    case '[object Array]':
      return compareEveryItemInArrays(a, b, equivalent);
    case '[object Object]':
      return compareObjects(a, b, equivalent);
    case '[object String]':
      // Make sure b is also a string
      if (bClass === '[object String]') {
        // String equivalence is case- and locale insensitive
        a = a.replace(/\s/g, ' ');
        b = b.replace(/\s/g, ' ');
        return a.localeCompare(b, 'en', { sensitivity: 'base' }) === 0;
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

// Performance optimization: Avoid allocating array and closures per comparison
function compareEveryItemInArrays(array1: any[], array2: any[], comparisonFunction: any) {
  if (array1.length !== array2.length) {
    return false;
  }
  let shouldReturnNull = false;
  for (let i = 0; i < array1.length; i++) {
    const comparisonResult = comparisonFunction(array1[i], array2[i]);
    if (comparisonResult === null) {
      shouldReturnNull = true;
    } else if (!comparisonResult) {
      return false;
    }
  }
  return shouldReturnNull ? null : true;
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

// Performance optimization: Fast iterative key and value comparison without .every() callback allocations
function deepCompareKeysAndValues(a: any, b: any, comparisonFunction: any) {
  const aKeys = getKeysFromObject(a);
  const bKeys = getKeysFromObject(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  // Deterministically sort keys to ensure property insertion order does not affect 3-valued comparison logic
  aKeys.sort();
  bKeys.sort();
  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) {
      return false;
    }
  }

  let shouldReturnNull = false;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    // if both are null we should return true to satisfy ignoring empty values in tuples
    if (a[key] == null && b[key] == null) {
      continue;
    }
    const comparisonResult = comparisonFunction(a[key], b[key]);
    if (comparisonResult === null) {
      shouldReturnNull = true;
      break;
    } else if (!comparisonResult) {
      return false;
    }
  }

  if (shouldReturnNull) {
    return null;
  }
  return true;
}

// Performance optimization: Avoid .filter() callback allocation and isFunction overhead
function getKeysFromObject(object: any) {
  const keys = Object.keys(object);
  const result: string[] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof object[key] !== 'function') {
      result.push(key);
    }
  }
  return result;
}

export function equals(a: any, b: any) {
  // Handle null cases first: spec says if either is null, return null
  if (a == null || b == null) {
    return null;
  }

  // If one is a Quantity, use the Quantity equals function
  if (a && a.isQuantity) {
    return a.equals(b);
  }

  // If one is a Ratio, use the ratio equals function
  if (a && a.isRatio) {
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

  // Return true if the objects are primitives and are strictly equal
  if (
    (typeof a === typeof b && typeof a === 'string') ||
    typeof a === 'number' ||
    typeof a === 'boolean'
  ) {
    return a === b;
  }

  // Return false if they are instances of different classes
  const aClass = objectToString.call(a);
  const bClass = objectToString.call(b);
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
