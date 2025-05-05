const db = require("../db");

class Answer{
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
        now(),
        '${idUser}',
        '${idQuestion}',
        '${name}' 
        );`;

        return db.execute(sql);
    }
    update(idUser,idQuestion,id,u_upd,name){
        let sql = `UPDATE tanswer SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        name='${name}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
    setCorrect(idUser,idQuestion,id,u_upd,correct){
        let sql = `UPDATE tanswer SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        correct='${correct}' 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
    delete(idUser,idQuestion,id,u_upd){
        let sql = `UPDATE tanswer SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${idUser} and idQuestion=${idQuestion} and id=${id};`;

        return db.execute(sql);
    }
}

module.exports = Answer;