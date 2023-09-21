// 用户自己传选项  然后调render方法
// 此方法并不关心options是谁提供的 所以 应该在runtime-core中
export function createRenderer(options) {
  return {
    render(vdom, container) {
      // 根据vdom和容器   通过vdom创建真实dom插入到容器中
    },
  };
}
