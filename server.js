const express = require('express');
const cors = require('cors');//faz uma aplicação se conectar com outra, como a axios

const app = express();

let corsOption = {
    origin: 'http://localhost:3030' //aqui é passado a url do frontEnd
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const db = require('./app/models');

const Role = db.role;

db.sequelize.sync({force: true}).then(()=>{
    console.log('Dropando e syncando o banco')
    initial();
});

function initial(){
    Role.create({
        id: 1,
        name: 'user'
    });
    Role.create({
        id: 2,
        name: 'moderator'
    });
    Role.create({
        id: 3,
        name: 'admin'
    })
}

// routes
require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);

//rota simples
app.get('/',(req,res)=>{res.json({message:'Hello Word!'})});

app.listen(3000,()=>{
    console.log('Rodando!')
})

// lib necessarias para criar a aplicação
//npm install express nodemon sequelize mysql2 cors jsonwebtoken bcryptjs --save