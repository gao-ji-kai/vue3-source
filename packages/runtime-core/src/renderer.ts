import { ShapeFlags } from "@vue/shared";
// 用户自己传选项  然后调render方法
// 此方法并不关心options是谁提供的 所以 应该在runtime-core中
export function createRenderer(options) {
  let {
    // 插入节点
    insert: hostInsert,
    // 删除节点
    remove: hostRemove,
    // 创建标签
    createElement: hostCreateElement,
    // 创建文本节点
    createText: hostCreateText,
    //设置节点文本内容
    setText: hostSetText,
    //设置元素的文本
    setElementText: hostSetElementText,
    // 获取父节点
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = options;
  // 挂载所有子节点 自检不一定是元素，还可能是组件
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      // 递归调用patch方法 创建元素
      patch(null, children[i], container);
    }
  };

  // 初始化
  const mountElement = (vnode, container) => {
    const { type, props, ShapeFlag, children } = vnode;
    // 先创建父元素
    let el = (vnode.el = hostCreateElement(type));
    // 给父元素增加添属性
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    // 区分子节点类型 挂载子节点
    if (ShapeFlags.ARRAY_CHILDREN && ShapeFlag) {
      mountChildren(children, el);
    } else {
      hostSetElementText(el, children);
    }
    hostInsert(el, container); // 将元素插入到父级中
  };
  // 更新逻辑
  const patchElement = (n1, n2, container) => {};

  //每次更新 都会重新执行patch方法
  const patch = (n1, n2, container) => {
    if (n1 == null) {
      // 初始化逻辑
      mountElement(n2, container);
    } else {
      // 更新逻辑
      patchElement(n1, n2, container);
    }
  };
  return {
    render(vnode, container) {
      // 根据vnode和容器   通过vnode创建真实dom插入到容器中

      if (vnode == null) {
        // 执行卸载逻辑
      } else {
        const preVnode = container._vnode || null; // 上一次vnode
        const nextVnode = vnode; //下一次vnode

        patch(preVnode, nextVnode, container);
        container._vnode = vnode; //第一次渲染的虚拟节点
      }
    },
  };
}
