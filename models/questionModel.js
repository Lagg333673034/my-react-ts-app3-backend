const db = require("../db");

class Question{
    find(idUser,idTest,id=0){
        let sql = '';
        if(id==0){
            sql = `
            SELECT 
            tquestion.id, 
            tquestion.name, 
            tquestion.multiplOptions, 
            (select count(tanswer.id) from tanswer where tanswer.udln is null and tanswer.idQuestion=tquestion.id) as answerCount, 
            (select count(tanswer.id) from tanswer where tanswer.udln is null and tanswer.idQuestion=tquestion.id and tanswer.correct=1) as answerTrueCount 

            FROM tquestion 
            WHERE tquestion.udln is null and idUser=${idUser} and idTest=${idTest} order by sort;`;
        }else{
            sql = `
            SELECT 
            tquestion.id, 
            tquestion.name, 
            tquestion.multiplOptions, 
            (select count(tanswer.id) from tanswer where tanswer.udln is null and tanswer.idQuestion=tquestion.id) as answerCount, 
            (select count(tanswer.id) from tanswer where tanswer.udln is null and tanswer.idQuestion=tquestion.id and tanswer.correct=1) as answerTrueCount 

            FROM tquestion 
            WHERE tquestion.udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;
        }
        
        return db.execute(sql);
    }
    create(idUser,idTest,u_cr,name){
        let sql = `INSERT INTO tquestion(u_cr,d_cr,idUser,idTest,name) VALUES (
        '${u_cr}',
        now(),
        '${idUser}',
        '${idTest}',
        '${name}'
        );`;

        return db.execute(sql);
    }
    update(idUser,idTest,id,u_upd,name){
        let sql = `UPDATE tquestion SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        name='${name}' 
        WHERE udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;

        return db.execute(sql);
    }
    delete(idUser,idTest,id,u_upd){
        let sql_tanswer = `UPDATE tanswer SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${idUser} and idQuestion=${id};`;

        db.execute(sql_tanswer);

        let sql = `UPDATE tquestion SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${idUser} and idTest=${idTest} and id=${id};`;
        
        return db.execute(sql);
    }


}

module.exports = Question;