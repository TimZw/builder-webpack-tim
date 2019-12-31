/**
 * 冒烟测试
 * 保障基本功能可用
 */
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');//构建前，删除dist
const Mocha = require('mocha');

const mocha = new Mocha({
    timeout: '10000ms'
});

//process.chdir变更 Node.js 进程的当前工作目录
process.chdir(path.join(__dirname, 'template'));//进入目录

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod.js');

    //运行配置
    webpack(prodConfig, (err, stats) => {

        if (err) {
            console.error(err);
            process.exit(2);
        }
        console.log(stats.toString({
            color: true,
            modules: false,
            children: false
        }));

        console.log('Webpack build success, begin run test.');

        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));
        mocha.run();
    });
});