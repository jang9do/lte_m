const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const { render } = require("ejs");
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

module.exports = {
    main : async function(req, res){
        res.redirect(server_url+"/lte_contract_list");
    }
}