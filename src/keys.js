// module.exports={
//     database:{
//         host: 'localhost',
//         user: 'root',
//         password: 'dOcean048*a',
//         database: 'warehouse'
//     }
// }

require('dotenv').config();

module.exports={
    database:{
  connectionLimit: 10,
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "warehouse",
    }
}

// export const port = process.env.PORT || 4000;