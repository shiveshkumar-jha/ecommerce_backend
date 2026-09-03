import {app} from "./app.js"
import "dotenv/config"
import {connectdb} from './db/index.js'

connectdb()
    .then(()=>{
        app.listen(process.env.PORT || 8000,()=>{
        console.log(`server running on ${process.env.port || 8000}`)
        })
    })
    .catch((err)=>{
        console.log("mongodb connection failed",err)
    })
