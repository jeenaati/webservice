const sql = require('mssql')
const request = require('request')
const config = require('./config/sysconfig.json')
//insert update delete
async function query_db(sql_query) {
    try {
        let pool = await sql.connect(config.sql)
        let res = await pool.request().query(sql_query)

        pool.close;
        sql.close;

        if (res) {
            return "ok";
        } else {
            return "error";
        }
    } catch (err) {
        console.error(err);
        return []
    }
}
exports.query_db = query_db

/* 
    select_db
    @input query sql
    @output array data in database
    @created date 20-09-2021
*/
async function select_db(sql_query) {
    try {
        let pool = await sql.connect(config.sql)
        let res = await pool.request().query(sql_query)
        let rows = res.recordset


        pool.close;
        sql.close;

        if (rows.length == 0) {
            return false
        } else {
            return rows
        }
    } catch (err) {
        console.error(err);
        return false
    }

}
exports.select_db = select_db