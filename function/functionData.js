const squel = require("squel");
const squelMssql = squel.useFlavour('mssql');
// const request = require('request');
const config = require('../config/sysconfig.json');
const SITE = require('./functionSite.js');

const PATH = "D:/Project/web";
const LOGGER = require(PATH + '/function/functionSaveLog');
module.exports = {
    insertUser: async function (object_insert) {
        let sql_query = squelMssql.insert()
            .into("[user]")
            .setFields(object_insert)
            .toString()
        LOGGER.saveLogger('info', sql_query);
        let data = await SITE.query_db('insert', sql_query)
        return data
    },

    getUserProfile: async function (username) {
        let sql_query = squelMssql.select()
            .from("[user]")
            .where("username = '" + username + "'")
            .order('created_date', false)
            .limit(1)
            .toString()
        let data = await SITE.query_db('select', sql_query)
        return data[0]
    },

    getUserAuth: async function (authKey) {
        let sql_query = squelMssql.select()
            .from("[user]")
            .where("auth_key = '" + authKey + "'")
            .limit(1)
            .toString()
        let data = await SITE.query_db('select', sql_query)
        return data[0]
    },

    insertOrder: async function (object_insert) {
        let sql_query = squelMssql.insert()
            .into("[order]")
            .output("*")
            .setFields(object_insert)
            .toString()
        LOGGER.saveLogger('info', sql_query);
        let data = await SITE.query_db('insert', sql_query)
        return data
    },

    updateOrder: async function (object_update, id) {
        let sql_query = squelMssql.update()
            .table("[order]")
            .output("*")
            .setFields(object_update)
            .where("id =" + id)
            .toString()
        let data = await SITE.query_db('update', sql_query)
        return data
    },

    insertOrderDetail: async function (object_insert) {
        let sql_query = squelMssql.insert()
            .into("[order_detail]")
            .output("*")
            .setFields(object_insert)
            .toString()
        let data = await SITE.query_db('insert', sql_query)
        return data
    },

    getOrderDetail: async function (id) {
        let sql_query = squelMssql.select()
            .field("product_detail.product_id")
            .field("product_detail.name")
            .field("order_detail.count")
            .from("[order_detail]")
            .left_join("[product_detail]", null, "order_detail.product_id = product_detail.product_id")
            .where("order_detail.order_id ="+ id)
            .toString()
        LOGGER.saveLogger('info', sql_query);

        let data = await SITE.query_db('select', sql_query)
        return data
    },

    getOrder: async function (user_id, id) {
        let sql_query = squelMssql.select()
            .from("[order]")
            .where("user_id = " + user_id + " AND id = " + id)
            .order('created_date', false)
            .limit(1)
            .toString()
        LOGGER.saveLogger('info', sql_query);

        let data = await SITE.query_db('select', sql_query)
        return data[0]
    },

    getOrderHistory: async function (user_id) {
        let sql_query = squelMssql.select()
            .from("[order]")
            .where("user_id = " + user_id)
            .order('created_date', false)
            .toString()
        LOGGER.saveLogger('info', sql_query);

        let data = await SITE.query_db('select', sql_query)
        return data
    },

    getStatus: async function (name) {
        let sql_query = squelMssql.select()
            .from("[order_status]")
            .where("name = '" + name + "'")
            .limit(1)
            .toString()
        let data = await SITE.query_db('select', sql_query)
        return data[0].status_id
    },

    getStatusById: async function (id) {
        let sql_query = squelMssql.select()
            .from("[order_status]")
            .where("status_id = " + id)
            .limit(1)
            .toString()
        LOGGER.saveLogger('info', sql_query);

        let data = await SITE.query_db('select', sql_query)
        return data[0].name
    },

    getProductAll: async function () {
        let sql_query = squelMssql.select()
            .from("product")
            .toString()
        let data = await SITE.query_db('select', sql_query)
        return data
    },
    
    getProductDetail: async function (product_id) {
        let sql_query = squelMssql.select()
            .from("product_detail")
            .where("product_id = " + product_id)
            .limit(1)
            .toString()
        let data = await SITE.query_db('select', sql_query)
        return data[0]
    }
}