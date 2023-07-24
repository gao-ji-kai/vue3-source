import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
import { isFunction, isObject } from "@vue/shared";

function traverse(source, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (seen.has(source)) {
    return source;
  }
  seen.add(source);
  for (let k in source) {
    //访问对象中的所有属性
    traverse(source[k], seen);
  }
  return source;
}

export function watch(source, cb, options: any = {}) {
  let getter;
  //先判断数据是否是响应式的  然后判断是否为函数 如果是函数 那么就全部收集
  if (isReactive(source)) {
    getter = () => source;
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  const job = () => {
    const newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  };
  const effect = new ReactiveEffect(getter, job);

  if (options.immediate) {
    job();
  }
  oldValue = effect.run();
}
