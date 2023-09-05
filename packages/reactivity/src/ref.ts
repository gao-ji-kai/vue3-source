import { trackEffects, triggerEffects } from "./baseHandler";
import { activeEffect } from "./effect";
import { toReactive } from "./reactive";

export function ref(value) {
  return new RefImpl(value);
}

// 很像 computed + watch
class RefImpl {
  _value;
  __v_isRef = true;
  //依赖收集
  dep = new Set();
  // 内部采用类的属性访问器 -> Object.defineProperty
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this.rawValue = newVal;
      this._value = toReactive(newVal);
      triggerEffects(this.dep);
    }
  }
}

// 本质就是ref代理的实现 像vue2中的_data
class ObjectRefImpl {
  __v_isRef = true;
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set value(val) {
    this.object[this.key] = val;
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  let res = {};
  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier);
      return r.__v_isRef ? r.value : r;
    },
    set(target, key, value, recevier) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}
