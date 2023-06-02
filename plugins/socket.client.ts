export default defineNuxtPlugin(() => {
    if (process.server) return

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    let socket: WebSocket = new WebSocket(`${wsProtocol}//nash-dev.local:24678`)

    return {
        provide: {
            socket
        },
    }
})
