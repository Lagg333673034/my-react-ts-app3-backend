require('dotenv').config();
const db = require("../db");
const jwt = require('jsonwebtoken');

const tokenAccessExpiresIn = "30m";
const tokenRefreshExpiresIn = "15d";

class Token{
    static generate(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: tokenAccessExpiresIn}); 
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: tokenRefreshExpiresIn});
        return {
            accessToken,
            refreshToken
        }
    }
    static async findDataByIdUser(idUser){
        let sql = `SELECT id, idUser, refreshToken FROM tusertoken WHERE udln is null and idUser=${idUser}`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async findDataByRefreshToken(refreshToken){
        let sql = `SELECT id, idUser, refreshToken FROM tusertoken WHERE udln is null and refreshToken='${refreshToken}'`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async create(idUser,refreshToken){
        let sql = `INSERT INTO tusertoken (idUser, refreshToken)  VALUES (
        ${idUser},
        '${refreshToken}'
        );`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
    static async update(idUser,refreshToken){
        let sql = `UPDATE tusertoken SET 
        refreshToken='${refreshToken}' 
        WHERE udln is null and idUser=${idUser};`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async save(idUser, refreshToken){
        let tokenExist = await Token.findDataByIdUser(idUser)
        if(tokenExist && tokenExist.idUser && tokenExist.idUser > 0){
            await Token.update(idUser,refreshToken)
        }else{
            await Token.create(idUser,refreshToken)
        }
    }
    static async delete(refreshToken){
        let sql = `DELETE FROM tusertoken WHERE udln is null and refreshToken='${refreshToken}';`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
}

module.exports = Token;
