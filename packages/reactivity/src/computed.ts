import { isFunction } from "@vue/shared";
import { ReactiveEffect, activeEffect } from "./effect";
import { trackEffects, triggerEffects } from "./baseHandler";

class ComputedRefImpl {
  effect;
  _value;
  dep = new Set();
  _dirty = true;
  constructor(public getter, public setter) {
    //创建effect 因为计算属性 就是一个effect  会让getter中的属性收集该effect
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true; //让计算属性标记为脏值  每次值变都会重新计算
        triggerEffects(this.dep);
      }
    });
  }
  // 取值让getter执行 拿到返回值 ，作为计算属性的值
  get value() {
    if (activeEffect) {
      // value =>effect
      //track(对象,属性)
      trackEffects(this.dep);
    }
    // 多次取值 只走一次
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(val) {
    // 修改值 触发setter即可
    this.setter(val);
  }
}

export function computed(getterOrOption) {
  const isGetter = isFunction(getterOrOption);
  let getter;
  let setter;
  if (isGetter) {
    getter = getterOrOption;
    setter = () => {
      console.warn("conputed is readonly");
    };
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }
  return new ComputedRefImpl(getter, setter);
}
