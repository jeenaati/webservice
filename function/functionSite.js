const sql = require('mssql')
const config = require('../config/sysconfig.json')
const SQL_CON = config.sql;
module.exports = {
    query_db: async function(type,sql_query,id_insur = '') //type = {select,insert,update,delete}
    {
        try {
            let pool = await sql.connect(SQL_CON)
            let res = await pool.request().query(sql_query)
            pool.close
            sql.close
            if(res){
                
                if(type == 'select' || type == 'insert' || type == 'update'){
                    let data = res.recordset
                    if(data.length == 0){ 
                        // await SAVELOG.L('functionSite: '+type+' empty\n\t\tsql_query('+sql_query+')','info')
                        return false 
                    }
                    else{
                        // await SAVELOG.L('functionSite: '+type+' success\n\t\tsql_query('+sql_query+')','info')
                        return data
                    }
                }
                else{
                    // await SAVELOG.L('functionSite: '+type+' success\n\t\tsql_query('+sql_query+')','info')
                    return true
                }  
            }else{
                // await SAVELOG.L('functionSite: '+type+' error\n\t\tsql_query('+sql_query+')','error','res not return')
                return false
            }
        } catch (err) {
            // await SAVELOG.L('functionSite: '+type+' catch error\n\t\tsql_query('+sql_query+')\n\t','error',err.stack)
            //await RESPONES.NotiSys('[PRO] '+id_insur+'\n'+err.message)
            console.log(err)
            return false
        }
    }
}