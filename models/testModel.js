const db = require("../db");
const {getCurrentDataTime} = require("../functions");

class Test{
    constructor(){
        this.currentData = getCurrentDataTime();
    }
    
    async find(idUser,id=0){
        let sql = '';
        if(id==0){
            sql = `
            SELECT 
            ttest.id,
            ttest.name, 
            ttest.ready, 
            ttest.published,
            ttest.uuid, 
            (select count(tquestion.id) from tquestion where tquestion.udln is null and tquestion.idTest=ttest.id) as questionCount 
            FROM ttest 
            WHERE ttest.udln is null and ttest.idUser=${idUser} order by sort;`;
        }else{
            sql = `
            SELECT 
            ttest.id,
            ttest.name, 
            ttest.ready, 
            ttest.published,
            ttest.uuid, 
            (select count(tquestion.id) from tquestion where tquestion.udln is null and tquestion.idTest=ttest.id) as questionCount 
            FROM ttest 
            WHERE ttest.udln is null and ttest.idUser=${idUser} and id=${id};`;
        }
        
        return await db.execute(sql);
    }
    async readyForPass(idTest,uuid){
        let sql = `
        SELECT 
        ttest.id as idTest, ttest.name as testName, 
        tquestion.id as idQuestion, tquestion.name as questionName, 
        tanswer.id as idAnswer, tanswer.name as answerName, 0 as correct

        FROM ttest 
        INNER JOIN (tquestion INNER JOIN tanswer on tquestion.id=tanswer.idQuestion) on ttest.id=tquestion.idTest 

        WHERE 
        ttest.udln is null and 
        tquestion.udln is null and 
        tanswer.udln is null and 
        ttest.ready !=0 and 
        ttest.uuid='${uuid}' and 
        ttest.id=${idTest} 
        `;
        //console.log(sql);
        return await db.execute(sql);
    }
    async create(idUser,u_cr,name,uuid){ 
        let sql = `INSERT INTO ttest(u_cr,d_cr,idUser,name,uuid) VALUES (
        '${u_cr}',
        '${this.currentData}',
        '${idUser}',
        '${name}',
        '${uuid}'
        );`;

        return await db.execute(sql);
    }
    async update(idUser,id,u_upd,name){
        let sql = `UPDATE ttest SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        name='${name}' 
        WHERE udln is null and idUser=${idUser} and id=${id};`;

        return await db.execute(sql);
    }
    async setReady(idUser,id,u_upd,ready){
        let sql = `UPDATE ttest SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        ready='${ready}' 
        WHERE udln is null and idUser=${idUser} and id=${id};`;

        return await db.execute(sql);
    }
    async setPublished(idUser,id,u_upd,published){
        let sql = `UPDATE ttest SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        published='${published}' 
        WHERE udln is null and idUser=${idUser} and id=${id};`;

        return await db.execute(sql);
    }
    async delete(idUser,id,u_upd){
        let sql_tanswer = '';
        let sql_tquestion = '';
        let sql_ttest = '';

        let sql_tquestion_id = `SELECT id FROM tquestion WHERE udln is null and idUser=${idUser} and idTest = ${id};`;
        let tquestion_id_array = await db.execute(sql_tquestion_id);
        tquestion_id_array = tquestion_id_array[0];
        tquestion_id_array &&
        tquestion_id_array.length > 0 &&
        tquestion_id_array.map(async tquestion_id => {
                    sql_tanswer = `UPDATE tanswer SET 
                    udln='${this.currentData}', 
                    u_upd='${u_upd}', 
                    d_upd='${this.currentData}' 
                    WHERE udln is null and idUser=${idUser} and idQuestion=${tquestion_id.id};`;
                    await db.execute(sql_tanswer);
        })

        sql_tquestion = `UPDATE tquestion SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${idUser} and idTest=${id};`;
        await db.execute(sql_tquestion);

        sql_ttest = `UPDATE ttest SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${idUser} and id=${id};`;
        await db.execute(sql_ttest);
    }
}

module.exports = Test;