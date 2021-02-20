import HelloWorld from '@/components/HelloWorld'
import PodTest from '@/components/PodTest'
import VueRouter from 'vue-router'

const routes = [
	{ path: '/home', component: HelloWorld },
	{ path: '/', redirect: '/home' },
	{ path: '/rack/pod', component: PodTest },
]

var router = new VueRouter({ routes: routes });

export default router;