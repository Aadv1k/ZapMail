import server from "./server";
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`server listening at http://127.0.0.1:${PORT}`)
})