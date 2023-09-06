export let activeEffectScope;

class EffectScope {
  effects = [];
  parent = null;
  scopes = []; //父亲用于存储儿子的effectScope
  constructor() {
    // 当我自己初始化的时候
    if (activeEffectScope) {
      activeEffectScope.scopes.push(this);
    }
  }
  run(fn) {
    try {
      this.parent = activeEffectScope;
      activeEffectScope = this;
      return fn();
    } finally {
      activeEffectScope = this.parent;
    }
  }
  stop() {
    // 让所有的effect停止收集
    for (let i = 0; i < this.effects.length; i++) {
      this.effects[i].stop();
      }
      // 停止儿子中的effect
    if (this.scopes.length) {
      for (let i = 0; i < this.scopes.length; i++) {
        this.scopes[i].stop();
      }
    }
  }
}
// 将effect放入到当前的作用域中
export function recordEffectScope(effect) {
  if (activeEffectScope) {
    activeEffectScope.effects.push(effect);
  }
}

export function effectScope() {
  return new EffectScope();
}
