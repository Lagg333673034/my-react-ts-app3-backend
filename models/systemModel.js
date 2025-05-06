const db = require("../db");

class System{
    static async getCurrentSystemTime(){
        let sql = `SELECT now() as time;`;
        
        let result = await db.execute(sql);
        return result[0][0];
    }
}

module.exports = System;
