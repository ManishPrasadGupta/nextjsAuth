import mongoose from "mongoose";


export async function connect() {
    try {
        // here in the below line --> usig `!` to assigned guaranteed that `process.env` will come.
        mongoose.connect(process.env.MONGO_URL!)
        const connection =  mongoose.connection

        connection.on('connected', () => {
            console.log('MongoDb connected!!')
        })


        connection.on('error' , (err) => {
            console.log('MongoDb connection error!!' + err)
            process.exit()
        })
        
    } catch (error) {
        console.log("something went wrong in connecting to DB")
        console.log(error)
    }
}