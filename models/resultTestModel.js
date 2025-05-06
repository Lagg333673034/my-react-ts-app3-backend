const db = require("../db");

class ResultTest{
    async findResultTest(idUserOwner,idTest){
        let sql = `
        SELECT 
        tresulttest.id, 
        (select ttest.name from ttest where ttest.id = tresulttest.idTest) as testName, 
        (select tuser.email from tuser where tuser.id = tresulttest.idUser) as emailRegistred, 
        tresulttest.email as emailNotRegistred, 
        DATE_FORMAT(tresulttest.timeStart, "%d.%m.%Y (%H:%i:%s)") as timeStart, 
        tresulttest.timeStart as timeStart0, 
        DATE_FORMAT(tresulttest.timeFinish, "%d.%m.%Y (%H:%i:%s)") as timeFinish, 
        tresulttest.timeFinish as timeFinish0 

        FROM tresulttest 
        WHERE udln is null and 
        tresulttest.idUserOwner=${idUserOwner} and 
        tresulttest.idTest=${idTest} 
        `;

        return await db.execute(sql);
    }
    async findResultTestAnswers(idUserOwner,idTresultTest){
        let sql = `
SELECT 
tresulttest.id as idTresulttest,
ttest.id as idTest, 
ttest.name as testName, 
tquestion.id as idQuestion, 
tquestion.name as questionName, 
tanswer.id as idAnswer, 
tanswer.name as answerName, 
CASE WHEN tanswer.id = (
    select tresulttestanswer.idAnswer 
    from tresulttestanswer 
    where tresulttestanswer.idResultTest=tresulttest.id and tresulttestanswer.idAnswer=tanswer.id) 
THEN 1 ELSE 0 END AS userAnswer,
tanswer.correct as correctAnswer 

FROM tresulttest 
INNER JOIN (ttest INNER JOIN (tquestion INNER JOIN tanswer on tanswer.idQuestion=tquestion.id) on 
tquestion.idTest=ttest.id) on ttest.id=tresulttest.idTest

WHERE 
tresulttest.udln is null and 
ttest.udln is null and 
tquestion.udln is null and 
tanswer.udln is null and 
ttest.ready !=0 and 
ttest.idUser=${idUserOwner} and 
tresulttest.idUserOwner=${idUserOwner} and 
tresulttest.id=${idTresultTest} 
        `;
        //console.log(sql);
        return await db.execute(sql);
    }
    async calculateScore(idUserOwner,idTresultTest){
        let sql = `
SELECT
count(*) as questionCount, count(case incorrect when 0 then 1 else null end) as questionTrueCount
from(
    
select t2.idQuestion as idQuestion, SUM(t2.incorrect) as incorrect
from(
    
select t1.idQuestion, CASE WHEN t1.userAnswer != t1.correctAnswer THEN 1 ELSE 0 END AS incorrect 
from(
    
SELECT tquestion.id as idQuestion, tanswer.id as idAnswer, 
CASE WHEN tanswer.id = (
    select tresulttestanswer.idAnswer 
    from tresulttestanswer 
    where tresulttestanswer.idResultTest=tresulttest.id and tresulttestanswer.idAnswer=tanswer.id) 
THEN 1 ELSE 0 END AS userAnswer,
tanswer.correct as correctAnswer 
FROM tresulttest 
INNER JOIN (ttest INNER JOIN (tquestion INNER JOIN tanswer on tanswer.idQuestion=tquestion.id) on 
tquestion.idTest=ttest.id) on ttest.id=tresulttest.idTest
WHERE 
tresulttest.udln is null and 
ttest.udln is null and 
tquestion.udln is null and 
tanswer.udln is null and 
ttest.ready !=0 and 
ttest.idUser=${idUserOwner} and 
tresulttest.idUserOwner=${idUserOwner} and 
tresulttest.id=${idTresultTest} 
)t1 
)t2 
group by t2.idQuestion 
)t3 
        `;
        //console.log(sql);
        return await db.execute(sql);
    }

    async findResultTestByIdUser(idTest,idUser){
        let sql = `SELECT 
            id, idTest, 
            DATE_FORMAT(timeStart, "%Y-%m-%dT%H:%i:%s.000Z") as timeStart,
            DATE_FORMAT(timeFinish, "%Y-%m-%dT%H:%i:%s.000Z") as timeFinish,
            idUser, email 
            FROM tresulttest 
            WHERE udln is null and idTest=${idTest} and idUser='${idUser}' 
            order by timeFinish desc
            `;
        return await db.execute(sql);
    }

    async saveResultTest(idTest,timeStart,timeFinish,idUser,answers){
        let sql_idUserOwner = `SELECT idUser FROM ttest WHERE udln is null and id=${idTest};`;
        let result_sql_idUserOwner = await db.execute(sql_idUserOwner);
        //console.log(result_sql_idUserOwner[0][0].idUser);
        let idUserOwner = result_sql_idUserOwner[0][0].idUser;

        if(result_sql_idUserOwner[0][0].idUser > 0){
            let sql = `INSERT INTO tresulttest(idUserOwner,idTest,timeStart,timeFinish,idUser) VALUES (  
            ${idUserOwner},
            ${idTest},
            STR_TO_DATE('${timeStart}',"%Y-%m-%dT%H:%i:%s.000Z"),
            STR_TO_DATE('${timeFinish}',"%Y-%m-%dT%H:%i:%s.000Z"),
            ${idUser} 
            );`;
            let result_sql = await db.execute(sql);
            //console.log(result_sql[0].insertId);

            if(result_sql[0].insertId && typeof result_sql[0].insertId !== "undefined" && Number(result_sql[0].insertId) > 0){
                let sql_insert_answer = '';
                for(let i=0; i<answers.length; i++){
                    sql_insert_answer = `INSERT INTO tresulttestanswer(idResultTest,idAnswer) VALUES (  
                    ${result_sql[0].insertId},
                    ${answers[i]} 
                    );`;
                    await db.execute(sql_insert_answer);
                }
            }
        }
    }

    static async delete(idUserOwner,idTest,id){
        let sql_tresulttestanswer = `UPDATE tresulttestanswer SET 
        udln=now(), 
        u_upd='${idUserOwner}', 
        d_upd=now() 
        WHERE udln is null and idResultTest=${id};`;
        await db.execute(sql_tresulttestanswer);

        let sql_tresulttest = `UPDATE tresulttest SET 
        udln=now(), 
        u_upd='${idUserOwner}', 
        d_upd=now() 
        WHERE udln is null and idUserOwner=${idUserOwner} and idTest=${idTest} and id=${id};`;
        await db.execute(sql_tresulttest);
    }

}

module.exports = ResultTest;