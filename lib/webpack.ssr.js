const merge = require('webpack-merge');
const cssnano = require('cssnano');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.base');

const ssrConfig = {
  mode: 'production',
  module: { // loaders 处理webpack不能解析的文件
    rules: [
      {
        test: /\.css$/,
        use: 'ignore-loader', // loader 是链式调用，从右到左
      },
      {
        test: /\.less$/,
        use: 'ignore-loader',
      },
      {
        test: /\.scss$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new OptimizeCssAssetsPlugin({ // 压缩css
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano, // cssnano预处理器
    }),
    new HtmlWebpackExternalsPlugin({ // 分离公共引入包如react
      externals: [{
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
module.exports = merge(baseConfig, ssrConfig);
