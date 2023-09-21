
// 节点api
import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./props";

const renderOption = { ...nodeOps, patchProp };



// 调vue内部的api  render
export function render(vdom, container) {
    const {render} = createRenderer(renderOption)
    render(vdom,container)
}


export *from '@vue/runtime-core'