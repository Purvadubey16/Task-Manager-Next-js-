import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host:process.env.DB_HOST,
    port: 5432,
    username: "postgres",
    password: "postgres",
    database:process.env.DB_NAME,
    entities:["src/entities/*{.ts,.js}"],
    synchronize:true,
    logging: true,
})

AppDataSource.initialize().then(()=>{
    console.log("database connected succesfully");
}).catch((err)=>console.log("not connected to db",err))

export default AppDataSource;

