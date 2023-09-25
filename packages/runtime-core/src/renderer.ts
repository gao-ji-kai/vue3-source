import { ShapeFlags } from "@vue/shared";
import { isSameVnode } from "./createVNode";
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
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      // 递归调用unmount方法 删除元素
      unmount(children[i]);
    }
  };

  // 卸载
  const unmount = (vnode) => {
    // 卸载卸载的可能不是元素
    hostRemove(vnode.el);
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

  const patchProps = (oldProps, newProps, el) => {
    for (let key in newProps) {
      //用新的生效
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    // 老的里面有 新的没有 删除老的
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const patchChildren = (n1, n2, el) => {
    // 比较两个前后节点的差异
    let c1 = n1.children; //老儿子
    let c2 = n2.children; //新儿子

    // 儿子之间的情况 文本 数组 空 9种
    // 情况一  文本 -> 数组  将文本删掉 换成数组
    // 情况二  文本 ->空  将清空文本
    // 情况三 文本 ->文本  用新文本 盖掉老的文本
    // 情况四  数组 -> 文本  移除数组 换成文本
    // 情况五  数组->数组  diff算法
    // 情况六  数组  -> 空
    // 情况七  空 -> 文本 更新文本
    // 情况八  空->数组  挂载数组
    // 情况九  空  -> 空 无需处理

    let preShapeFlag = n1.shapeFlag; //上一次的
    let shapeFlag = n2.shapeFlag; // 新的
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 新的是文本  老得是数组 移除老得 换新的
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      //新的是文本 老得是文本或者空  则直接采用新的
      if (c1 !== c2) {
        // 文本有变化 需更新文本
        hostSetElementText(el, c2);
      }
    } else {
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //diff 算法
        } else {
          //老得是数组 新的是空的情况
          unmountChildren(c1); // 需清空老得;
        }
      } else {
        // 上次是文本
        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, "");
        }
        // 本次如果是数组 则直接挂在就好
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el);
        }
      }
    }
  };
  // 更新逻辑
  const patchElement = (n1, n2, container) => {
    let el = (n2.el = n1.el);
    patchProps(n1.props || {}, n2.props || {}, el);
    patchChildren(n1.children, n2.children, el);
  };

  // 判断n1和n2是不是相同的节点  如果不是相同节点 直接删掉

  //每次更新 都会重新执行patch方法
  const patch = (n1, n2, container) => {
    if (n1 && !isSameVnode(n1, n2)) {
      //不是初始化 是更新逻辑
      unmount(n1);
      n1 = null; //删除之前的 继续走初始化阶段
    }
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
        unmount(container._vnode); //删掉容器上对应的dom元素
      } else {
        const preVnode = container._vnode || null; // 上一次vnode
        const nextVnode = vnode; //下一次vnode

        patch(preVnode, nextVnode, container);
        container._vnode = vnode; //第一次渲染的虚拟节点
      }
    },
  };
}
