const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const qs = require('querystring');
const crypto = require('crypto');
const { render } = require("ejs");
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

module.exports = {
    lte_contract_list_manager: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        // manager_chk
        let manager_chk = permission_chk.manager_check(req);
        if(manager_chk != true){
            res.send("잘못된 접근입니다.");
            return;
        }

        res.render("../views/manager/lte_contract_list_manager.ejs", {server_url: server_url, page_name: 'lte_contract_list_manager', user_rank: req.session.user_rank, user_id: req.session.user_id});
    },
    chart_check: async function(req,res){
        let result = "";
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        // manager_chk
        let manager_chk = permission_chk.manager_check(req);
        if(manager_chk != true){
            res.send("잘못된 접근입니다.");
            return;
        }
        res.render("../views/manager/chart_check.ejs", {result: result, server_url: server_url, page_name: 'chart_check', user_id: req.session.user_id, user_rank: req.session.user_rank});
    },

}