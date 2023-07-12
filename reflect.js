
//返回的是代理对象
const person = {
    name: 'wyh',
    get aliaName() {//属性访问器
        return 'handsome' + this.name;
    }
}
const proxy = new Proxy(person, {
    get(target, key, recevier) {
        //target是原始对象 就是index.html中的{ name: "gaoter", age: 18 }
        console.log(key);//aliaName
        //return target[key];//此时就不能这样写了 应该写成 Reflect.get()
        // target[key]  -this指向person 
        // Reflect.get(target, key, recevier)  - this 指向的是receiver
        return Reflect.get(target, key, recevier)
    },
    set(target, key, value, recevier) {
        // console.log("要让effect重新执行");
        target[key] = value;
        //return true; //返回true代表设置成功
        return Reflect.set(target, key, value, recevier)
    },
});

console.log(proxy.aliaName)//handsomewyh
// 如果用户修改了name属性，我们是无法监控到的
// 原则上 我们希望我修改了name  就能取到修改后的name

