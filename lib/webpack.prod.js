const merge = require('webpack-merge');
const cssnano = require('cssnano');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.base');

const pordConfig = {
  mode: 'production',
  plugins: [
    new OptimizeCssAssetsPlugin({ // 压缩css
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano, // cssnano预处理器
    }),
    new HtmlWebpackExternalsPlugin({ // 分离公共引入包如react
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcss.com/react/16.10.2/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcss.com/react-dom/16.10.2/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0, // 文件超过多少才打包，//提出公共文件
      cacheGroups: {
        vendor: { // 提出引用文件
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2, // 至少引用次数
        },
      },
    },
  },
};
module.exports = merge(baseConfig, pordConfig);
