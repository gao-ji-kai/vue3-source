// 开发环境搭建

import minimist from "minimist";
import { fileURLToPath } from 'url'
import { dirname, resolve } from "path";//为了取父级路径
// 使用 esbuild 作为构建工具
import esbuild from 'esbuild'; //打包方式
// node scripts/dev.js reactivity -f esm minimist 按照空格进行解析
const args = minimist(process.argv.slice(2)) //使用 minimist 解析命令行参数  解析用户传递过来的参数  前两个参数没有意义 所以适用slice
// 打包的格式。默认为 global，即打包成 IIFE 格式，在浏览器中使用
const fromat = args.f || 'iife'//如果传了 就取  如果没传 就是自执行函数
//需要打包的模块。默认打包 reactivity 模块
const target = args._[0] || 'reactivity'
console.log(args, 'args');//{ _: [ 'reactivity' ], f: 'esm' } args
console.log(fromat, target, 'fromat')
/*
    import.meta.url能拿到当前路径 file:///D:/myProduct/vue3-base/scripts/dev.js 但是需要转化 
    fileURLToPath(import.meta.url) 转化需要借助fileURLToPath 这是node中的   D:\myProduct\vue3-base\scripts\dev.js
    dirname(fileURLToPath(import.meta.url))     D:\myProduct\vue3-base\scripts  需要拿到父级路径 需要借助dirname 是path中的模块
*/
const __dirname = dirname(fileURLToPath(import.meta.url))

const IIFENameMap = {
    'reactivity': 'VueReactivity'
}
esbuild.context({
    // 打包的入口文件。每个模块的 src/index.ts 作为该模块的入口文件
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    // 文件输出路径。输出到模块目录下的 dist 目录下，并以各自的模块规范为后缀名作为区分
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    // 将依赖的文件递归的打包到一个文件中，默认不会进行打包
    bundle: true,//将所有文件打包在一起
    sourcemap: true,
    // 打包文件的输出格式，值有三种：iife、cjs 和 esm
    format: fromat,
    // 如果输出格式为 IIFE，需要为其指定一个全局变量名字
    globalName: IIFENameMap[target],
    // 默认情况下，esbuild 构建会生成用于浏览器的代码。如果打包的文件是在 node 环境运行，需要将平台设置为node
    platform: 'browser'

    // es-browser 就是希望将所有模块都打包在一起
    //es-bundler  不把所有模块都打包  可以用 external进行排除
}).then(ctx => ctx.watch())// 监听文件变化，进行重新构建