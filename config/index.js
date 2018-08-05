/*
 * @Author: HW.Liang 
 * @Date: 2018-05-30 15:38:32 
 * @Last Modified by: HW.Liang
 * @Last Modified time: 2018-07-17 10:13:12
 */
'use strict'
const path = require('path')
//const myset ='192.168.60.140'

module.exports = {
    build: {
        webpack_public_path:'//fecdn.neigou.com/',
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report,
        clubDomin:'//bcdn.ddguanhuai.com/',
   },
   test: {
        webpack_public_path:'http://test.neigou.com/m/v3/',
        env: require('./test.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report,
        clubDomin:'//club.test.neigou.com/',
    },
    dev: {
        env: require('./dev.env'),
        host:'v3.neigou.com', 
        port: 8010, 
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        poll: false,
        clubDomin:'//club.test.neigou.com/',
        proxyTable: {
            '/store-api-domain':{
                target:'http://test.neigou.com/',
                changeOrigin:true,
                pathRewrite: {
                    '^/store-api-domain': ''
                }
            },
            '/mall-api-domain':{
                target:'http://mall.test.neigou.com/',
                changeOrigin:true,
                pathRewrite: {
                    '^/mall-api-domain': ''
                }
            },
            '/life-api-domain':{
                target:'http://life.test.neigou.com/',
                changeOrigin:true,
                pathRewrite: {
                    '^/life-api-domain': ''
                }
            },
            '/hd-api-domain':{
                target:'http://hd.test.neigou.com/',
                changeOrigin:true,
                pathRewrite: {
                    '^/hd-api-domain': ''
                }
            },
        },
        cssSourceMap: false,
        historyApiFallback:true,
        // rewrites:[// 单页应用 fallback 配置
        //     { from: /\/v2\/?(\/[A-Za-z0-9]*)*.html?$/, to: '/neigou/neigou.html'}, // 默认入口
        // ]
    },
}
