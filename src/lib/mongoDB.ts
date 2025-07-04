import mongoose from "mongoose";

const connection: { isConnected?: number } = {};


export const connectToDB = async ()=>{
  try{
    if(connection.isConnected){
      console.log("using exsisting connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO as string);
    connection.isConnected = db.connections[0].readyState;

  }
  catch(error){
    console.log(error)
  throw new Error ('error connecting to db')}
}