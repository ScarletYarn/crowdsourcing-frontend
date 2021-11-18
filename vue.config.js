module.exports = {
  // options...
  devServer: {
    port: 3000
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'ICA众包平台'
      return args
    })
  }
}
