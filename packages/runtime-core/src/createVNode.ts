import { ShapeFlags, isString } from "@vue/shared";

export function createVNode(type, props, children) {
  // 很像react.creatElement这个方法

  // 如果类型是字符串 那么就是一个元素
  const shapFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  const vnode = {
    shapFlag,
    type,
    props,
    key: props && props.key,
    el: null, // 每个虚拟节点 都对应一个真实节点  用来存放真实节点的，后续更新时，会产生新的虚拟节点，比较差异，更新真实dom
    children,
    };
    
  if (children) {
    let type = 0;
    // 判断孩子节点是不是数组
    if (Array.isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else {
      type = ShapeFlags.TEXT_CHILDREN;
    }
    vnode.shapFlag |= type;
  }
  return vnode;
}

// 创建元素时  需判断类型 根据类型不同 createElement() children.forEach(child=>createElement(child))
// 只是文本的话  createElement。innerHTML=children
