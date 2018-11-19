const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env:{
    server:'dev'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~assets/font-awesome/css/font-awesome.min.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~plugins/iview', ssr: true},
    '~plugins/i18n',
    '~plugins/moment',
    '~plugins/validation'
    /*{src: '~plugins/axios', ssr: true}*/
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  proxy: [
    [
      '/proxy',
      {
        target: 'https://cnodejs.org/api/v1', // api主机
        pathRewrite: { '^/proxy' : '/' }
      }
    ]
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['external_library','axios','js-cookie','i18n','moment'],
    extend(config, ctx) {

    }
  },
  router: {
    middleware: ['i18n','browser','stats','auth']
  }
}
