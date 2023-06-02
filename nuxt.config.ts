// import webpack from 'webpack'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore
    ssr: false,
    // @ts-ignore
    modules: ['@vueuse/nuxt'],
    build: {
        // TODO: Make the following work
        // transpile: ['p5'],
        // plugins: [
        //     new webpack.ProvidePlugin({
        //         p5: 'p5/lib/p5.js'
        //     })
        // ]
    }
})
