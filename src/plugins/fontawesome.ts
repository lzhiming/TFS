import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { defineNuxtPlugin } from '#app'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

library.add(faDiscord);

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('fa', FontAwesomeIcon);
});
