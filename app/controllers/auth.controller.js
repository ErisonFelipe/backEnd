const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req,res)=>{
    user.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 6)
    }).then(user => {
        if(req.body.role){
            Role.findAll({
                where:{
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles =>{
                user.setRoles(roles).then(()=>{
                    res.send({message: "Usuario Registrado com Sucesso!"})
                });
            });
        }else{
            user.setRoles([1]).then(()=>{
                res.send({message: "Usuario registrado com sucesso"})
            });
        };
    }).catch(err =>{
        res.status(500).send({message: err.message})
    })
}

exports.signin = (req,res)=>{
    User.findOne({
        where:{
            username:req.body.username
        }
    }).the(user =>{
        if(!user){
            return res.status(404).send({message: "Usuario não encontrado"})
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password,
        );
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken: null,
                message: "Algo está errado"
            })
        }
        var token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // 24 horas
        });
        let authorities = [];
        user.getRoles().then(roles => {
            for (let i=0; i < roles.length; i++){
                authoritties.push("ROLES_" + roles[i].name.toUpperCase())
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            })
        })
    }).catch(err =>{
        res.status(500).send({message: err.message});
    })
}