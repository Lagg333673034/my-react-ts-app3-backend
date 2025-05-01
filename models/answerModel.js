const db = require("../db");
const {getCurrentDataTime} = require("../functions");

class Answer{
    constructor(){
        this.currentData = getCurrentDataTime();
    }
    find(idUser,idQuestion,id=0){
        let sql = '';
        if(id==0){
            sql = `SELECT id, name, correct FROM tanswer WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} order by sort;`;
        }else{
            sql = `SELECT id, name, correct FROM tanswer WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;
        }
        
        return db.execute(sql);
    }
    create(idUser,idQuestion,u_cr,name){
        let sql = `INSERT INTO tanswer(u_cr,d_cr,idUser,idQuestion,name) VALUES (
        '${u_cr}',
        '${this.currentData}',
        '${idUser}',
        '${idQuestion}',
        '${name}' 
        );`;

        return db.execute(sql);
    }
    update(idUser,idQuestion,id,u_upd,name){
        let sql = `UPDATE tanswer SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        name='${name}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
    setCorrect(idUser,idQuestion,id,u_upd,correct){
        let sql = `UPDATE tanswer SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        correct='${correct}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
    delete(idUser,idQuestion,id,u_upd){
        let sql = `UPDATE tanswer SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
}

module.exports = Answer;