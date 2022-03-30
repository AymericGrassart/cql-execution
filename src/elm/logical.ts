import { Expression } from './expression';
import { ThreeValuedLogic } from '../datatypes/datatypes';
import { Context } from '../runtime/context';

export class And extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    if (this.args == null || this.args.length !== 2) {
      throw new Error('Invalid arguments for And expression.');
    }
    return ThreeValuedLogic.andShortCircuit(this.args[0], this.args[1], ctx);
    // return ThreeValuedLogic.and(...this.execArgs(ctx));
  }
}

export class Or extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    return ThreeValuedLogic.or(...this.execArgs(ctx));
  }
}

export class Not extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    return ThreeValuedLogic.not(this.execArgs(ctx));
  }
}

export class Xor extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    return ThreeValuedLogic.xor(...this.execArgs(ctx));
  }
}

export class IsTrue extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    return true === this.execArgs(ctx);
  }
}

export class IsFalse extends Expression {
  constructor(json: any) {
    super(json);
  }

  exec(ctx: Context) {
    return false === this.execArgs(ctx);
  }
}
