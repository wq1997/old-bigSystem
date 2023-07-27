import Vue from 'vue'
import VueI18n from 'vue-i18n' /* 国际化 */
Vue.use(VueI18n)

import store from "../store";

export default new VueI18n({
  locale: store.getters['app/locale'],
  messages: {
    ...require('./locales/zh'),
    ...require('./locales/zh_tw'),
    ...require('./locales/en'),
    ...require('./locales/czech'),
  },
  silentTranslationWarn: true,
})



