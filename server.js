const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3020;

app.use(express.json())
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000", 
  methods: [`DELETE`,  `PUT`, `POST`],
  allowedHeaders: ["Content-Type", "token"],
  exposedHeaders: ["token", "novino"],
  credentials: true
};

app.use( cors(corsOptions) )
//let HOST = process.env.HOST

//We install the postSQL client pg
const { Pool } = require("pg");

//Different Poll config
/*
const connectionString = 
  `postgres://mini:${process.env.DATABASE_PASSWORD}@dpg-cun1gphu0jms73b9u8pg-a/renderserver_jjqh`;

const pool = new Pool({
  connectionString,
});
*/

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mrlzarate",
  port: 5432,
});


app.post("/hotels", function(req, res) {
  console.log( "logaritminco lano" )
  let {primo , secondo } = req.body
  console.log("Datte", primo, secondo ) 

  pool.query( `INSERT into multi (name, employed, age) VALUES ($1, true, $2)`, [primo, Number(secondo)] )
  .then((result)=>{
    res.json( result.rowCount )  
  })
  .catch((error)=>{
    res.status(500).json({ error: "database error" })
  })
});

app.get("/fila", async (req, res)=>{
  let nomefila = req.query.num
  let query = `delete from multi where age > $1`

  try{
    await pool.query(query, [ nomefila ])
    let risulta = await pool.query( "select * from multi where age < 500 " )

    if(risulta.rowCount){
      res.status(202).send( risulta.rows )
    }else{
      res.status(404).send( risulta.rows )
    }
  }catch (error) {
    console.log( error )
    res.status(500).json({ error: 'Database error' }); 
  }
})

app.get("/remova/:index", async (req, res)=>{
  let index = Number( req.params.index )
  console.log( index )

  pool.query("Delete from multi where name = $1", [index])
  .then((result)=>{

    res.json( result.rows )
  })
  .catch((error)=>{
    res.status(500).json({ error })
  })
})

app.get("/testa", (req, res)=>{
  console.log( "---> Request", req.headers['token'] )
  res.set('novino', 'not too easy');
  res.json({ locro: "micro" })
})

// ---------------------

app.get("/", (req, res)=> {
  console.log( "the pool" )
  res.send( `Server with internal URL links to database` )
})

//listen() sets the localhost: endpoint 
app.listen(PORT, () => console.log(`Server is up and running ${PORT}`))