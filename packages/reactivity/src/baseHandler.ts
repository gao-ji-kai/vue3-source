import { reactive } from "./reactive";
import { activeEffect } from "./effect";
import { isObject } from "@vue/shared";

// 加标识
export const enum ReactiveFlags {
  "IS_REACTIVE" = "v_isReactive",
}

// 响应式对象的核心逻辑
export const mutableHandlers = {
  //原始对象  属性  代理对象
  get(target, key, recevier) {
    //target是原始对象 就是index.html中的{ name: "gaoter", age: 18 }
    // console.log("属性在哪个effect中使用了");
    // return target[key];
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, key);
    let result = Reflect.get(target, key, recevier);
    if (isObject(result)) {
      // 如果取到了是一个对象  则需要继续将这个对象作为代理对象
      return reactive(result);
    }
    return result;
  },
  set(target, key, value, recevier) {
    let oldValue = target[key]; //拿到老值
    let flag = Reflect.set(target, key, value, recevier);
    if (value !== oldValue) {
      // 新值和老值比较 如果不一样 就触发更新
      trigger(target, key, value, oldValue);
    }
    return flag;
  },
  // has deleteProperty
};

// Map1={({ name: "gaoter", age: 18 }):Map2}
// Map2={name:set()}

//  { name: "gaoter", age: 18 }  -> name =>[effect,effect]

const targetMap = new WeakMap();
function track(target, key) {
  //当前属性是在effect中使用的  我才收集  否则 不收集
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    trackEffects(dep); //收集到set中
  }
}

//  { name: "gaoter", age: 18 }  -> name =>[effect,effect]
function trigger(target, key, value, oldValue) {
  // 找到effect执行即可
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  triggerEffects(effects);
}

export function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); //这里让effect也记录一下 有哪些属性
  }
}

export function triggerEffects(effects) {
  if (effects) {
    effects = [...effects]; //vue2中的是数组，先拷贝再删除
    effects.forEach((effect) => {
      // 如果当前执行的和现在要执行的  是同一个 我就屏蔽掉
      if (activeEffect !== effect) {
        if (effect.scheduler) {
          //如果effect上有scheduler 应该执行的就是scheduler方法
          effect.scheduler();
        } else {
          effect.run(); //里面有删除+添加的逻辑
        }
      }
    });
  }
}
