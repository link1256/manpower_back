import { resolve } from 'path'
import colors from 'vuetify/es5/util/colors'
import webpack from 'webpack'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'zh-TW'
    },
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  env: {
    apiUrl: isProduction
      ? 'http://recreation.forest.gov.tw/forestry_community_api'
      : null
  },
  alias: {
    jQuery: resolve(__dirname, 'node_modules/jquery')
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/Scss/all.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/utils/all.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/auth'
  ],
  /**
   * Nuxt.js proxy
   */
  proxy: {
    '/api/': isProduction ? '/api/' : 'http://localhost:57925'
  },
  /**
   * Nuxt.js auth moudule
   * https://auth.nuxtjs.org/
   */
  auth: {},
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  router: {
    base: '/dgbas_back'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient }) {
      if (isClient) {
        const { entry } = config
        config.entry = { service: 'core-js/stable', ...entry }
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ],
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              useBuiltIns: 'entry',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    }
  }
}
