export const nodeOps = {
  // 插入节点
  insert(el, parent, anchor) {
    // <div id="app"><span></span></div>  anchor 参照物 就如同前面的例子 将span标签查到id='app标签中
    // 具备插入到某个元素前面,如果不传anchor 则直接appendChild元素
    return parent.insertBefore(el, anchor || null);
  },
  // 删除节点
  remove(el) {
    const parent = el.parentNode; //拿到该元素的父级元素
    // 如果有父节点 就删 根元素无父节点 删不了
    if (parent) {
      parent.removeChild(el);
    }
  },
  // 创建标签
  createElement(type) {
    return document.createElement(type);
  },
  // 创建文本节点
  createText(text) {
    return document.createTextNode(text); //创建文本节点
  },
  //设置节点文本内容
  setText(node, text) {
    return (node.nodeValue = text);
  },
  //设置元素的文本
  setElementText(node, text) {
    return (node.textContent = text);
  },
  // 获取父节点
  parentNode(node) {
    return node.parentNode;
  },
  nextSibling(node) {
    return node.nextSibling;
  },
};
