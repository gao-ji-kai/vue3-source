// style
function patchStyle(el, preValue, nextValue) {
  //情况一 之前之后什么都没有
  // 情况二  之前什么都没有 之后有了 我们需要把之后的值全部给之前
  const style = el["style"];
  if (nextValue) {
    // 用新的样式替代老的
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
  }
  if (preValue) {
    for (let key in preValue) {
      if (nextValue[key] == null) {
        style[key] = null;
      }
    }
  }
}

// class
function patchClass(el, nextValue) {
  // class:'abc' 新的 class:'abc,bcd'
  if (nextValue == null) {
    el.removeAttribute("class");
  } else {
    el.className = nextValue;
  }
}
function createInvoker(val) {
  const invoker = (e) => invoker.val(e);
  invoker.val = val;
  return invoker;
}

// 事件  对于事件而言 我们并不关心之前的  只关系最新的结果
function patchEvent(el, eventName, nextValue) {
  // click:a   后来 click:b
  /*
    通过一个自定义的变量，绑定这个变量 后续更改变量对应的值
    click:customEvent ->a 
  */
  const invokers = el._vei || (el._vei = {});
  const exists = invokers[eventName];

  if (exists && nextValue) {
    exists.val = nextValue; //换绑事件
  } else {
    const name = eventName.slice(2).toLowerCase();
    if (nextValue) {
      const invoker = (invokers[eventName] = createInvoker(nextValue));
      el.addEventListener(name, invoker);
    } else if (exists) {
      el.removeEventListener(name, exists);
      invokers[eventName] = null;
    }
  }
}

function patchAttr(el, key, nextValue) {
  if (nextValue == null) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(nextValue);
  }
}

// 创建调用器
export function patchProp(el, key, preValue, nextValue) {
  // 属性的初始化和更新  对于初始化 preValue:null

  // 设置样式  {style:{color:red}} ->el.style[key]=value
  if (key === "style") {
    return patchStyle(el, preValue, nextValue);
  } else if (key === "class") {
    // 设置类型 {class:'abc'} ->el.className(class,'abc')
    return patchClass(el, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    // 设置事件名  onClick -> addEventListener()
    return patchEvent(el, key, nextValue);
  } else {
    return patchAttr(el, key, nextValue);
  }
}
