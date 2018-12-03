const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const globSync = require('glob').sync;

module.exports =  (env, options) => ({
    entry: {
        index: './src/pages/index.js',
        adverts: './src/pages/adverts.js',
        register: './src/pages/register.js',
        advertDetail: './src/pages/advert-detail.js'
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    options.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                    publicPath: '../fonts'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/'
                    }
                }]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':src']
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|vendors)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    // optimization: {
	// 	splitChunks: {
	// 		chunks: "all",
	// 		maxInitialRequests: 20, // for HTTP2
	// 		maxAsyncRequests: 20, // for HTTP2
	// 		minSize: 40 // for example only: chosen to match 2 modules
	// 		// omit minSize in real use case to use the default of 30kb
	// 	}
	// },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
        }),
        new CleanWebpackPlugin(["dist"]),
        // ...globSync('src/**/*.html').map((fileName) => {
        //     return new HtmlWebpackPlugin({
        //         template: fileName,
        //         inject: "body",
        //         filename: fileName.replace('src/', '')
        //     })
        // }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/adverts.html',
            inject: true,
            chunks: ['adverts'],
            filename: 'adverts.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/advert-detail.html',
            inject: true,
            chunks: ['advertDetail'],
            filename: 'advert-detail.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/register.html',
            inject: true,
            chunks: ['register'],
            filename: 'register.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            // _config: 'exports-loader?self.fetch!whatwg-fetch',
            // _config: [path.resolve('./config.js'), 'default']
            // Popper: ['popper.js', 'default'],
            // Util: "exports-loader?Util!bootstrap/js/dist/util",
            // Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        })
    ],
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    }
})
