
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');
import moment from 'moment';
import { Form, HasError, AlertError } from 'vform';
import VueProgressBar from 'vue-progressbar';
import swal from 'sweetalert2';

window.swal = swal;
const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
window.toast = toast;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
window.Form = Form;
window.Fire = new Vue();

import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(VueProgressBar, {
    color:'blue',
    failedColor:'red',
    height:'5px'
});
const routes = [
    { path: '/dashboard', component:  require('./components/Dashboard.vue') },
    { path: '/developer', component:  require('./components/Developer.vue') },
    { path: '/profile', component:  require('./components/Profile.vue') },
    { path: '/users', component:  require('./components/Users.vue') }
  ]

const router = new VueRouter({
    mode:'history',
    routes // short for `routes: routes`
})
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('dashboard', require('./components/Dashboard.vue'));
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);
Vue.filter('upText', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
});
Vue.filter('fDate', function (time){
    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
})
const app = new Vue({
    el: '#app',
    router
});
