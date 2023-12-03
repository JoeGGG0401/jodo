import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

import Prism from "prismjs";

const vuetify = createVuetify({
    components,
    directives,
  })
  

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

createApp(App)
.use(vuetify)
.use(VueMarkdownEditor)
.use(router)
.mount("#app");
