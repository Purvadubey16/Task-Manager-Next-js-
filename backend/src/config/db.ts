import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host:"localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database:"typeorm",
    entities:["src/entities/*{.ts,.js}"],
    synchronize:true,
    logging: true,
})

AppDataSource.initialize().then(()=>{
    console.log("database connected succesfully");
}).catch((err)=>console.log("not connected to db",err))

export default AppDataSource;