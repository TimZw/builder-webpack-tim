const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd(); //返回 Node.js 进程的当前工作目录。

// 多页面（MPA打包）动态设置
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];

      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];

      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({ // 压缩HTML
          template: path.join(projectRoot, `src/${pageName}/index.html`), // 模板
          filename: `${pageName}.html`, // 打包后文件的名称
          chunks: [ // 生成的HTML引入js文件名称 使用那些chunk 对应entry中的key
            'vendors',
            'commons',
            pageName,
          ],
          inject: true, // 打包后的chunk 自动注入到打包后的HTML文件中
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        })
      );
    });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const {
  entry,
  htmlWebpackPlugins
} = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: { // loaders 处理webpack不能解析的文件
    rules: [{
        test: /\.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [ // loader 是链式调用，从右到左
          MiniCssExtractPlugin.loader, // 与'style-loader'产生冲突，删除
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecision: 8, // 小数点后构建
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecision: 8, // 小数点后构建
            },
          },
        ],
      },
      /*       {
              test: /\.(png|jpg|gif|jpeg)$/,
              use: [
                  {
                      loader: 'file-loader',
                      options: {
                          name: '[name]_[hash:8].[ext]'//图片的文件指纹
                      }
                  }
              ]
            }, */
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash:8].[ext]', // 图片的文件指纹
            limit: 10240,
          },
        }],
      },
      {
        test: /\.(woff|woff2|eot|eot|ttf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]', // 图片的文件指纹
            limit: 10240,
          },
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css', // css 文件指纹 用contenthash
    }),
    new CleanWebpackPlugin(), // 清除dist文件下内容
    new FriendlyErrorsWebpackPlugin(), // 优化显示日志
    function errorPlugin() {
      /* 捕获并处理构件错误 */
      /* this.plugin('done', (stats) => { webpack3 */
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          /* 可以自动上报错误 */
          console.log('build error'); //eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};