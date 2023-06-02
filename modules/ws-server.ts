import {defineNuxtModule} from "@nuxt/kit";
import {WebSocketServer} from "ws";

type Client = {
    id: string
    send: (message: any) => void
    readyState: number
}

export default defineNuxtModule({
    setup(options, nuxt) {
        nuxt.hook('listen', async (server) => {
            const io = new WebSocketServer({ server })

            nuxt.hook('close', () => io.close())

            io.on('connection', (socket) => {
                console.log('Socket connected')
                socket.on('open', () => {
                    console.log('opened socket server')
                })

                socket.on('message' , (message, isBinary) => {
                    // console.log('message received => ', message)
                    // socket.send(message)
                    io.clients.forEach((client) => {
                        client.send(message)
                    })
                })
            })
        })
    }
})
