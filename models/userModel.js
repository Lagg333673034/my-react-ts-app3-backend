const db = require("../db");

class User{
    static async findAll(){
        let sql = `SELECT id, email FROM tuser WHERE udln is null;`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
    static async findById(id){
        let sql = `SELECT id, email FROM tuser WHERE udln is null and id = ${id};`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
    static async findByEmail(email){
        console.log("findByEmail==");
        console.log(email);
        let sql = `SELECT 
        id, email, password, entryMethod, 
        CASE 
        WHEN entryMethod=1 THEN 'Email & Password' 
        WHEN entryMethod=2 THEN 'Google' 
        ELSE 'Unknown method' END AS entryMethodName 

        FROM tuser 
        WHERE udln is null and email='${email}';`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async findByUuid(uuid){
        let sql = `SELECT id, email, password FROM tuser WHERE udln is null and uuidForRecoverPassword = '${uuid}';`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
    static async registratioUsingEmailAndPassword(u_cr,email,password){
        let sql = `INSERT INTO tuser(u_cr,d_cr,entryMethod,email,password) VALUES (
        '${u_cr}',
        now(),
        1,
        '${email}',
        '${password}'
        );`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async registratioUsingGoogle(u_cr,email){
        let sql = `INSERT INTO tuser(u_cr,d_cr,entryMethod,email) VALUES (
        '${u_cr}',
        now(),
        2,
        '${email}'
        );`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async update(id,u_upd,email){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        email='${email}' 
        WHERE udln is null and id=${id};`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async updateUuidByEmail(email,u_upd,uuid){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        uuidForRecoverPassword='${uuid}' 
        WHERE udln is null and email='${email}';`;

        let result = await db.execute(sql);
        return result[0][0];
    }
    static async updatePasswordByEmail(email,uuid,u_upd,password){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd=now(), 
        password='${password}', 
        uuidForRecoverPassword='' 
        WHERE udln is null and email='${email}' and uuidForRecoverPassword='${uuid}' ;`;

        let result = await db.execute(sql);
        return result[0][0];
    }


    static async delete(id,u_upd){
        let sql_tanswer = `UPDATE tanswer SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_tanswer);

        let sql_tquestion = `UPDATE tquestion SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_tquestion);

        let sql_ttest = `UPDATE ttest SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_ttest);

        let sql = `UPDATE tuser SET 
        udln=now(), 
        u_upd='${u_upd}', 
        d_upd=now() 
        WHERE udln is null and id=${id};`;
        return await db.execute(sql);
    }
}

module.exports = User;
