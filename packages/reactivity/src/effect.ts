import { recordEffectScope } from "./effectScope";

export let activeEffect = undefined;

function cleanupEffect(effect) {
  //set() 属性中还有effect
  //找到deps中的 set  清理掉effect才可以
  let deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    //effect.deps =[new Set(),new Set(),new Set()];
    deps[i].delete(effect); // 数组里 删除掉set中的effect
  }
  effect.deps.length = 0;
}

export class ReactiveEffect {
  parent = undefined;
  active = true;
  //this.scheduler
  constructor(public fn, public scheduler?) {
    recordEffectScope(this)
  } //构造函数中 只执行一次  用户传进来个函数
  deps = []; //effect中要记录哪些属性是在effect中调用的
  run() {
    // 当运行的时候，我们需要将属性和对应的effect关联起来
    //利用js是单线程的特性，显挂载全局，再取值  把effect放到全局上
    if (this.active) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      //将activeEffect 放到全局上
      activeEffect = this;
      cleanupEffect(this);
      return this.fn(); // 这里会触发get属性   依赖收集  调用用户函数的时候发生取值操作
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
  stop() {
    if (!this.active) {
      this.active = false;
      cleanupEffect(this);
    }
  }
}

//只要属性一变  我就要做依赖收集  这里面就取决于属性和effect之间是什么样的关系 1:1 1:n n:n  依赖收集

export function effect(fn, options: any = {}) {
  //将用户的函数拿到  变成一个响应式函数   也就是  数据一遍 它就更新
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // 默认让用户的函数执行一次
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;

  /*
       effect(() => {//effect1.parent=null activeEffect=effect1
        state.name; 
        effect(() => {// effect2.parent = activeEffect
          //activeEffect=effect2
          state.age; // 收集栈中的最后一个
        }); // activeEffect=effect2.parent
        state.address; // 收集的是?
      });
      
      */

  /*
        实现方式一   弄个栈结构   每次都收集栈的最后一个  收集完成后再进行pop
        实现方式二  弄一个树结构  查找父节点的方式   执行最后一步的时候 还原一下
         effect1.parent=null activeEffect=effect1 -> effect2.parent = activeEffect  activeEffect=effect2  ->  activeEffect=effect2.parent
      */
}
