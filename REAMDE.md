- reactivity

# vue3 中区分编译时(模板编译)和运行时(不关心模板编译)

# vue3 中区分了是否根据环境来区分操作

- runtime-dom(浏览器操作的一些 api,dom 的增删改查) /runtime-core(并不关心调用了哪些 api)
- compiler-dom(针对Dom的编译) / compiler-core(进行非平台相关的编译)
