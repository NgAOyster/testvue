import { createRouter, createWebHistory } from 'vue-router';
import Firebase from '../components/TestFirebase.vue';
import MySQL from '../components/TestMySQL.vue';
import PG from '../components/TestPostgreSQL.vue';
import Select from '../components/Select.vue';
import XML from '../components/TestXML.vue'
import XML2 from '../components/TestXML2.vue'
import Setting from '../components/Setting.vue'
import Checkout from '../components/Checkout.vue'

const routes = [
    { path: '/select', name: 'select', component: Select },
    { path: '/firebase', name: 'firebase', component: Firebase },
    { path: '/mysql', name: 'mysql', component: MySQL },
    { path: '/pg', name: 'postgresql', component: PG },
    { path: '/xml', name: 'xml', component: XML },
    { path: '/xml2', name: 'xml2', component: XML2 },
    { path: '/setting', name: 'setting', component: Setting },
    { path: '/checkout', name: 'checkout', component: Checkout },
    { path: '/', redirect: '/select' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;