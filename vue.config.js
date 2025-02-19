/*
* npm run build 打包代码
* 如果代码放在指定文件夹如pc，publicPath需要改为/pc
* */
module.exports = {
  productionSourceMap: false,
  lintOnSave: true,
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "./src/style/theme.scss";`
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
      ],
    },
  }
}
