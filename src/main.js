/*
 * @Author: your name
 * @Date: 2020-10-14 13:50:09
 * @LastEditTime: 2021-04-27 11:10:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Ed
 * @FilePath: \vue3-element-admin\src\main.js
 */
import { createApp } from "vue"; 
import axios from "@/plugins/axios";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import installElementPlus from "@/plugins/element";
import installComponents from "@/plugins/components";
import permission from "@/plugins/permission";
import directives from "@/directives";
import "normalize.css/normalize.css";
import "nprogress/nprogress.css";
import "@/styles/common.scss";
const app = createApp(App);



app.use(store)
    .use(router)
    .use(installElementPlus)
    .use(installComponents)
    .use(axios, { router, store, opt: "VE_API" })
    // .use(permission, { router, store })
    .use(directives, { router, store })
    .mount("#app");


Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}