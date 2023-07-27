import Vue from 'vue'
import Router from 'vue-router'
import containerRoutes from './routes.container'
import containerRoutes_v2 from './routes.container_v2'
Vue.use(Router)

/* 解决点击多次点击同一导航报错问题  */
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

let routes = [
    {
        path: "/",
        redirect: "/authorization",
        hidden: true
    },
    {
        path: "/authorization",
        component: _ => import(/* webpackChunkName: "authorization" */"@/pages/Authorization"),
        hidden: true
    },
    {
        path: "/workOrder",
        component: _ => import(/* webpackChunkName: "workOrder" */"@/pages/workOrder"),
        hidden: true
    },
     {
                path: "/containerIndex",
                component: _ =>
                  import(
                    /* webpackChunkName: "Container" */ "@/pages/Index"
                    ),
                    meta: {
                      name: "首页",
                      icon: "icon-fangzi"
                    },
                   
            },
    ...containerRoutes_v2,
    ...containerRoutes,
    
];



export default new Router({
    routes,
    mode: 'history'
})

