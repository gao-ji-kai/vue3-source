import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandlers } from "./baseHandler";
export function reactive(target) {
  return createReactiveObject(target);
}
//reactiveMap 的作用是建立一个映射表 防止一个对象被多次代理  如果一个对象多次代理，返回的永远是用一个代理对象
const reactiveMap = new WeakMap(); //WeakMap 可以防止内存泄漏 reactiveMap  第一个值只能是对象

function createReactiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  //防止同一个对象被代理多次，返回的永远是同一个代理对象
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  //返回的是代理对象
  const proxy = new Proxy(target, mutableHandlers);
  // 代理前  代理后做一个映射表
  // 如果用同一个代理对象做代理，直接返回上一次的代理结果

  /*
    以前的解决办法是 
        代理前 -> 代理后  然后再用  代理后->代理前  进行反向查找
    现在更好的解决方法是
      加表示  因为被代理过得对象  被劫持后会增添了 get和set方法
*/

  reactiveMap.set(target, proxy);
  return proxy;
}

export function isReactive(source) {
  return !!(source && source[ReactiveFlags.IS_REACTIVE]);
}



export function toReactive(source) {
  return isObject(source) ? reactive(source) : source;
}