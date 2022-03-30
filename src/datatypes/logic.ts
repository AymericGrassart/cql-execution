import { Context, Expression } from "../cql";

export class ThreeValuedLogic {
  static andShortCircuit(left: Expression, right: Expression, ctx: Context): (boolean | null) {
    const leftEval = left.execute(ctx);
    if (leftEval == false) {
      return false;
    } else {
      const rightEval = right.execute(ctx);
      if (rightEval == false) {
        return false;
      } else if (rightEval == null || leftEval == null) {
        return null;
      } else {
        return true;
      }
    }
  }

  static and(...val: (boolean | null)[]) {
    if (val.includes(false)) {
      return false;
    } else if (val.includes(null)) {
      return null;
    } else {
      return true;
    }
  }

  static or(...val: (boolean | null)[]) {
    if (val.includes(true)) {
      return true;
    } else if (val.includes(null)) {
      return null;
    } else {
      return false;
    }
  }

  static xor(...val: (boolean | null)[]) {
    if (val.includes(null)) {
      return null;
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return val.reduce((a, b) => (!a ^ !b) === 1);
    }
  }

  static not(val: boolean | null) {
    if (val != null) {
      return !val;
    } else {
      return null;
    }
  }
}
