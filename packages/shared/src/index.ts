/*
 * @Author: gaojikai gaojikai@fehorizon.com
 * @Date: 2023-07-04 19:10:43
 * @LastEditors: gaojikai gaojikai@fehorizon.com
 * @LastEditTime: 2023-09-21 16:40:41
 * @FilePath: \vue3-base\packages\shared\src\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function isObject(val) {
  return typeof val === "object" && val !== null;
}

export function isFunction(val) {
  return typeof val === "function";
}

export function isString(val) {
  return typeof val === "string";
}

// 使用位运算 针对特定的值可以进行组合
// 00000001 向左移一位  00000010  每进一位 就是平方
export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 2 向左移一位    函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 4 状态组件
  TEXT_CHILDREN = 1 << 3, // 文本孩子 8
  ARRAY_CHILDREN = 1 << 4, // 数组孩子 16
  SLOTS_CHILDREN = 1 << 5, // 组件的插槽  32
  TELEPORT = 1 << 6, // 传送门组件  64
  SUSPENSE = 1 << 7, // 懒加载组件  128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // keep-alive
  COMPONENT_KEEP_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
