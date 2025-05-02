const db = require("../db");
const {getCurrentDataTime} = require("../functions");

class User{
    constructor(){
        this.currentData = getCurrentDataTime();
    }
    find(id=0){
        let sql = '';
        if(id==0){
            sql = `SELECT id, email FROM tuser WHERE udln is null;`;
        }else{
            sql = `SELECT id, email FROM tuser WHERE udln is null and id = ${id};`;
        }
        
        return db.execute(sql);
    }
    findByEmail(email){
        let sql = `SELECT id, email, password FROM tuser WHERE udln is null and email = '${email}';`;
 
        return db.execute(sql);
    }
    findByUuid(uuid){
        let sql = '';
        if(uuid != ''){
            sql = `SELECT id, email, password FROM tuser WHERE udln is null and uuidForRecoverPassword = '${uuid}';`;
        }else{
            sql = `SELECT 1 FROM tuser WHERE udln is null;`;
        }
 
        return db.execute(sql);
    }
    registration(u_cr,email,password){
        let sql = `INSERT INTO tuser(u_cr,d_cr,email,password) VALUES (
        '${u_cr}',
        '${this.currentData}',
        '${email}',
        '${password}'
        );`;

        return db.execute(sql);
    }
    /*create(u_cr,email,password){
        let sql = `INSERT INTO tuser(u_cr,d_cr,email,password) VALUES (
        '${u_cr}',
        '${this.currentData}',
        '${email}',
        '${password}'
        );`;

        return db.execute(sql);
    }*/


    update(id,u_upd,email){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        email='${email}' 
        WHERE udln is null and id=${id};`;

        return db.execute(sql);
    }
    updateUuidByEmail(email,u_upd,uuid){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        uuidForRecoverPassword='${uuid}' 
        WHERE udln is null and email='${email}';`;

        return db.execute(sql);
    }
    updatePasswordByEmail(email,uuid,u_upd,password){
        let sql = `UPDATE tuser SET 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}', 
        password='${password}', 
        uuidForRecoverPassword='' 
        WHERE udln is null and email='${email}' and uuidForRecoverPassword='${uuid}' ;`;

        return db.execute(sql);
    }


    async delete(id,u_upd){
        let sql_tanswer = `UPDATE tanswer SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_tanswer);

        let sql_tquestion = `UPDATE tquestion SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_tquestion);

        let sql_ttest = `UPDATE ttest SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and idUser=${id};`;
        await db.execute(sql_ttest);

        let sql = `UPDATE tuser SET 
        udln='${this.currentData}', 
        u_upd='${u_upd}', 
        d_upd='${this.currentData}' 
        WHERE udln is null and id=${id};`;
        return db.execute(sql);
    }
}

module.exports = User;
