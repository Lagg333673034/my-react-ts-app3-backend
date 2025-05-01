const db = require("../db");
const {getCurrentDataTime} = require("../functions");
const Answer = require("./answerModel");

class Question{
    constructor(){
        this.currentData = getCurrentDataTime();
    }
    find(idUser,idTest,id=0){
        let sql = '';
        if(id==0){
            sql = `SELECT id, name, multiplOptions FROM tquestion WHERE udln is null and idUser=${idUser} and idTest=${idTest} order by sort;`;
        }else{
            sql = `SELECT id, name, multiplOptions FROM tquestion WHERE udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;
        }
        
        return db.execute(sql);
    }
    create(idUser,idTest,u_cr,name){
        let sql = `INSERT INTO tquestion(u_cr,d_cr,idUser,idTest,name) VALUES (
        '${u_cr}',
        '${this.currentData}',
        '${idUser}',
        '${idTest}',
        '${name}'
        );`;

        return db.execute(sql);
    }
    update(idUser,idTest,id,u_upd,name){
        let sql = `UPDATE tquestion SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        name='${name}' 
        WHERE udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;

        return db.execute(sql);
    }
    delete(idUser,idTest,id,u_upd){
        let sql_tanswer = `UPDATE tanswer SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${id};`;

        db.execute(sql_tanswer);

        let sql = `UPDATE tquestion SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;
        
        return db.execute(sql);
    }


}

module.exports = Question;