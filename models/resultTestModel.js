const db = require("../db");
const {getCurrentDataTime} = require("../functions");

class ResultTest{
    constructor(){
        this.currentData = getCurrentDataTime();
    }

    async findResultTest(idUserOwner,idTest,id=0){
        let sql_suffix = '';
        if(id > 0){
            sql_suffix = ` id=${id} and `
        }

        let sql = `
        SELECT 
        tresulttest.id, 
        (select ttest.name from ttest where ttest.id = tresulttest.idTest) as testName, 
        (select tuser.email from tuser where tuser.id = tresulttest.idUser) as emailRegistred, 
        tresulttest.email as emailNotRegistred, 
        DATE_FORMAT(tresulttest.timeStatr, "%d.%m.%Y - %H:%i:%s") as timeStatr, 
        DATE_FORMAT(tresulttest.timeFinish, "%d.%m.%Y - %H:%i:%s") as timeFinish 

        FROM tresulttest 
        WHERE udln is null and 
        ${sql_suffix} 
        tresulttest.idUserOwner=${idUserOwner} and 
        tresulttest.idTest=${idTest} 
        `;

        return await db.execute(sql);
    }

    async findResultTestByIdUser(idTest,idUser){
        let sql = `SELECT 
            id, idTest, 
            DATE_FORMAT(timeFinish, "%Y-%m-%d %H:%i:%s") as timeStatr, 
            DATE_FORMAT(timeFinish, "%Y-%m-%d %H:%i:%s") as timeFinish, 
            idUser, email 
            FROM tresulttest 
            WHERE udln is null and idTest=${idTest} and idUser='${idUser}' 
            order by timeFinish desc
            `;
        return await db.execute(sql);
    }

    async saveResultTest(idTest,timeStatr,timeFinish,idUser,answers){
        let sql_idUserOwner = `SELECT idUser FROM ttest WHERE udln is null and id=${idTest};`;
        let result_sql_idUserOwner = await db.execute(sql_idUserOwner);
        //console.log(result_sql_idUserOwner[0][0].idUser);
        let idUserOwner = result_sql_idUserOwner[0][0].idUser;

        if(result_sql_idUserOwner[0][0].idUser > 0){
            let sql = `INSERT INTO tresulttest(idUserOwner,idTest,timeStatr,timeFinish,idUser) VALUES (  
            ${idUserOwner},
            ${idTest},
            STR_TO_DATE('${timeStatr}',"%Y-%m-%d %H:%i:%s"),
            STR_TO_DATE('${timeFinish}',"%Y-%m-%d %H:%i:%s"),
            ${idUser} 
            );`;
            let result_sql = await db.execute(sql);
            //console.log(result_sql[0].insertId);

            if(result_sql[0].insertId && typeof result_sql[0].insertId !== "undefined" && Number(result_sql[0].insertId) > 0){
                let sql_insert_answer = '';
                for(let i=0; i<answers.length; i++){
                    sql_insert_answer = `INSERT INTO tresulttestanswer(idUserOwner,idResultTest,idAnswer) VALUES (  
                    ${idUserOwner},
                    ${result_sql[0].insertId},
                    ${answers[i]} 
                    );`;
                    await db.execute(sql_insert_answer);
                }
            }
        }
    }

}

module.exports = ResultTest;