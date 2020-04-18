module.exports = {
    chainWebpack: config => {
        config.module
            .rule('html')
            .test(/\.html$/)
            .use('html-loader')
            .loader('html-loader')
        config.module
            .rule('files')
            .test(/\.(png|jpe?g|gif|m4a)$/i)
            .use('file-loader')
            .loader('file-loader')
    },
    devServer: {
        proxy: 'http://bet3-0.sgdf.fr/api',
    }
}