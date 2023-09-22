import { isObject } from "@vue/shared";
import { createVNode, isVNode } from "./createVNode";

// 第一个参数是类型  第二个参数可能是属性 也可能是儿子元素  第三个参数 一定是儿子元素
export function h(type, propsOrChildren?, children?) {
  // 用户使用的创建虚拟DOM的方法 createElement  只是个上层封装的方法

  const len = arguments.length;
  if (len === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      // h("div", h("span"));
      if (isVNode(propsOrChildren)) {
        // createVNode 要求孩子不是文本就是一个数组
        return createVNode(type, null, [propsOrChildren]);
      }
      // h("div",{style:{color:'black'}})
      return createVNode(type, propsOrChildren);
    } else {
      // h("div",'hello');
      // h("div", [h("span"), h("span")]);
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (len > 3) {
      //  h("div",{},h('span'),h('span'),h('span'),h('span'))
      children = Array.from(arguments).slice(2);
    } else {
      //  h("div", {}, h("span"));
      if (len == 3 && isVNode(children)) {
        children = [children];
      }
    }
    // const VDom = h("div",{},[h('span'),h('span')]);
    // const VDom = h("div",{},'hello')
    return createVNode(type, propsOrChildren, children);
  }
}
// 有以下情况

/**
    const VDom = h("div",h('span'));  孩子放children中
    const VDom = h("div",'hello');  
    const VDom = h("div",{style:{color:'black'}});// 属性放props中
    const VDom = h("div", [h("span"), h("span")]);
    const VDom = h("div",h('span'),h('span')); 错误写法 会把第二个参数当成属性
    const VDom = h("div",{},[h('span'),h('span')]); // 一个属性 两个儿子
    const VDom = h("div",{},h('span'),h('span')); // 一个属性 两个儿子
 */
