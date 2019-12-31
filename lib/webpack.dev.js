const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [ // 用于打包文件优化，资源管理，环境注入（loaders做不了的事情）；作用于构建过程
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist/', // 服务基础目录
    hot: true, // 开启热更新
    stats: 'errors-only',
  },
  devtool: 'source-map',
};

module.exports = merge(baseConfig, devConfig);
