import { Uncertainty } from '../datatypes/datatypes';

const enCollator = new Intl.Collator('en', { sensitivity: 'base' });

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
  if (a && a.isQuantity) {
    return a.equals(b);
  }

  // Use overloaded 'equivalent' function if it is available
  if (typeof a.equivalent === 'function') {
    return a.equivalent(b);
  }

  if (typeof a === 'string' && typeof b === 'string') {
    if (a === b) {
      return true;
    }
    a = a.replace(/\s/g, ' ');
    b = b.replace(/\s/g, ' ');
    return enCollator.compare(a, b) === 0;
  }

  const aClass = getClassOfObject(a);
  const bClass = getClassOfObject(b);

  switch (aClass) {
    case '[object Array]':
      if (bClass === '[object Array]') {
        return compareEveryItemInArrays(a, b, equivalent);
      }
      break;
    case '[object Object]':
      if (bClass === '[object Object]') {
        return compareObjects(a, b, equivalent);
      }
      break;
    case '[object String]':
      if (bClass === '[object String]') {
        if (a === b) {
          return true;
        }
        a = a.replace(/\s/g, ' ');
        b = b.replace(/\s/g, ' ');
        return enCollator.compare(a, b) === 0;
      }
      break;
  }

  return equals(a, b);
}

function isCode(object: any) {
  return object != null && typeof object.hasMatch === 'function';
}

function codesAreEquivalent(code1: any, code2: any) {
  return code1.hasMatch(code2);
}

function getClassOfObject(object: any) {
  return Object.prototype.toString.call(object);
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
  const aKeys = getKeysFromObject(a);
  const bKeys = getKeysFromObject(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  aKeys.sort();
  bKeys.sort();

  // Array.every() will only return true or false, so set a flag for if we should return null
  let shouldReturnNull = false;
  // Check if both arrays of keys match
  if (aKeys.every((value, index) => value === bKeys[index])) {
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
  const keys = Object.keys(object);
  const result: string[] = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (typeof object[k] !== 'function') {
      result.push(k);
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

  const typeA = typeof a;
  const typeB = typeof b;

  // Return true if the objects are primitives and are strictly equal
  if (typeA === typeB && (typeA === 'string' || typeA === 'number' || typeA === 'boolean')) {
    return a === b;
  }

  // If one is a primitive string/number/boolean and the other is not or of different primitive type
  if (
    typeA === 'string' ||
    typeA === 'number' ||
    typeA === 'boolean' ||
    typeB === 'string' ||
    typeB === 'number' ||
    typeB === 'boolean'
  ) {
    return false;
  }

  // Return false if they are instances of different classes
  const aClass = getClassOfObject(a);
  const bClass = getClassOfObject(b);
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
