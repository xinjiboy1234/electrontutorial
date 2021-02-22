import HelloWorld from '@/components/HelloWorld'
import PodTest from '@/components/PodTest'
import RebinWall from '@/components/RebinWall'
import VueRouter from 'vue-router'

const routes = [
	{ path: '/home', component: HelloWorld },
	{ path: '/', redirect: '/home' },
	{ path: '/rack/pod', component: PodTest },
	{ path: '/rack/rebin', component: RebinWall },
]

var router = new VueRouter({ routes: routes });

export default router;