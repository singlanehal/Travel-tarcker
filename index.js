# Travel-tarcker


import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// PostgreSQL connection configuration
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: "pgadmin123",
    database: "world",
  port: 5432, // Default port for PostgreSQL
});

// Connect to PostgreSQL
db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err));

  async function checkVisisted(){
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    result.rows.forEach((country)=>{
        countries.push(country.country_code);
    });
    return countries;
}

// Define your routes
app.get('/', async(req, res) => {
    const countries = await checkVisisted();
    res.render("index.ejs",{countries: countries, total:countries.length});
});

app.post("/add",async(req,res)=>{
    const input = req.body["country"];
    console.log(input);
    const result = await db.query("SELECT country_code FROM countries WHERE country_name=$1",[input]);
    console.log(result);
    if(result.rows.length !==0){
        const data = result.rows[0];
        const countryCode = data.country_code;
        
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[countryCode,]);
        res.redirect("/");
    }
});


// Start the server
const port =  3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
