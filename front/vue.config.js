module.exports = {
    chainWebpack: config => {
        config.module
            .rule('html')
            .test(/\.html$/)
            .use('html-loader')
            .loader('html-loader')
    },
    devServer: {
        proxy: 'http://bet3-0.sgdf.fr/api',
    }
}