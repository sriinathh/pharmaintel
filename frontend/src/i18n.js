import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      navbar: {
        home: 'Home',
        dashboard: 'Dashboard',
        chatbot: 'Chatbot',
        reports: 'Reports',
        profile: 'Profile',
        admin: 'Admin'
      },
      buttons: {
        login: 'Log in',
        register: 'Register',
        export_pdf: 'Export PDF'
      },
      headings: {
        dashboard: 'Dashboard',
        reports: 'Reports',
        profile: 'Profile',
        chatbot_placeholder: 'Ask PharmaIntel AI about medicines, interactions, or clinical guidance.'
      }
    }
  },
  hi: { translation: { navbar: {}, buttons: {}, headings: {} } },
  te: { translation: { navbar: {}, buttons: {}, headings: {} } },
  fr: { translation: { navbar: {}, buttons: {}, headings: {} } }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
