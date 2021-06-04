const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user

verifyToken = (req,res,next)=>{
    let token = req.headers['x-access-token'];
    if(!token){
        return res.status(403).send({
          message: 'Token não informado'
        });
    }
    jwt.verify(token, config.secret,(err, decode)=>{
        if(err){
            return res.status(401).json({
                message: 'Não autorizado'
            })
        }
        req.userId = decode.id
        next()
    });
};

isAdmin = (req, res, next)=>{
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles =>{
            for (let i = 0; i < role.length; i++){
                if (role[i].name === 'admin'){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: 'Require Admin Role'
            });
            return;
        });
    });
};
isModerator = (req, res, next) =>{
    User.findByPk(req.userId).then(user =>{
        user.getRoles().then(roles =>{
            for (let i = 0; i < roles.length; i++){
                if (role[i].name === 'moderator'){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: 'Require Moderator Role'
            })
        })
    })
}
isModeratorOrAdmin = (req, res, next) =>{
    User.findByPk(req.userId).then(user =>{
        user.getRoles().then(roles =>{
            for (let i = 0; i < roles.length; i++){
                if (role[i].name === 'moderator'){
                    next();
                    return;
                }
                if (role[i].name === 'admin'){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: 'Require Moderator ou Admin Role'
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;