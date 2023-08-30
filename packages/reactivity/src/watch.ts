import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
import { isFunction, isObject } from "@vue/shared";

// 对象的深拷贝 {...source} 浅拷贝
function traverse(source, seen = new Set()) {
  // 不是对象 就return source
  if (!isObject(source)) {
    return source;
  }
  // 如果被缓存了 也返回
  if (seen.has(source)) {
    return source;
  }
  // 如果没有 就添加
  seen.add(source);
  for (let k in source) {
    //访问对象中的所有属性
    traverse(source[k], seen);
  }
  return source;
}

function doWatch(source, cb, options) {
  let getter;
  //先判断数据是否是响应式的  然后判断是否为函数 如果是函数 那么就全部收集
  if (isReactive(source)) {
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  let clean;
  const onCleanup = (fn) => {
    clean = fn;
  };
  const job = () => {
    if (cb) {
      if (clean) clean();
      const newValue = effect.run();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  // 创建响应式的effect
  const effect = new ReactiveEffect(getter, job);

  if (options.immediate || null) {
    job();
  }
  oldValue = effect.run();
}

// watchEffect 无第二个参数
export function watchEffect(effect, options: any = {}) {
  doWatch(effect, null, options); // =>effect
}

export function watch(source, cb, options: any = {}) {
  return doWatch(source, cb, options);
}
