const app = require("./server")

const PORT = 8001

try {
    app.listen(PORT, () => {
        console.log(`listening on port:${PORT}`)
    });
} catch (error) {
    console.log("🚀 ~ error:", error)

}