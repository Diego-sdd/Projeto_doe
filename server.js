const express = require("express");
const server = express();

//configurando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configurando arquivo estáticos
server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }))

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_doe'
});
connection.connect(function (err) {
    if (err) return console.log(err);
    console.log('conectou!');
})



server.get("/", function (req, res) {
    connection.query("Select * from tb_donors;", function (err, result) {
        if (err) return res.send("Erro de banco de dados");
        const donors = result;

        return res.render("index.html", { donors });
    })
});

server.post("/", function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;
    if (name == "" || email == "" || blood == "") {
        return res.send("todos os campos são obrigatórios");
    }
    var sql = "INSERT INTO tb_donors (name,email, blood) VALUES (?,?,?)";
    var values = [name, email, blood];
    try {
        connection.query(sql, values);
        return res.redirect("/");
    }
    catch (err) {
        console.log(err);
    }
});





server.listen(3000, function () {
    console.log("servidor ligado");
});

