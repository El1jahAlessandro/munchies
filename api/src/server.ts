import express from 'express'
import allRouter from "./routers/_all.router";

const app = express()
const PORT = 6000

app.use(express.json())
app.use('/api', allRouter)

app.listen(PORT, () =>
    console.log(`🚀 Server ready at: http://localhost:${PORT}`),
)