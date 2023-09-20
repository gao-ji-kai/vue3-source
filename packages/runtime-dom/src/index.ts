// 节点api
import { nodeOps } from "./nodeOps";
import { patchProp } from "./props";

const renderOption = { ...nodeOps, patchProp };
