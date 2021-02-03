import HelloWorld from '@/components/HelloWorld'
import VueRouter from 'vue-router'

const routes = [
	{ path: '/home', component: HelloWorld },
	{ path: '/', redirect: '/home' },
]

var router = new VueRouter({ routes: routes });

export default router;