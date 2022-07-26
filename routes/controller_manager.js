const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
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

        res.render("manager/lte_contract_list_manager", {server_url: server_url, page_name: 'lte_contract_list_manager', user_rank: req.session.user_rank, user_id: req.session.user_id});
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
        res.render("manager/chart_check", {result: result, server_url: server_url, page_name: 'chart_check', user_id: req.session.user_id, user_rank: req.session.user_rank});
    },
    form_insert_auto_complete_list: async function(req, res){
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
        res.render("manager/form_insert_auto_complete_list", {result: result, server_url: server_url, page_name: 'form_insert_auto_complete_list', user_id: req.session.user_id, user_rank: req.session.user_rank});
    },
    insert_auto_complete_list: async function(req, res){
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

        let post = req.body;

        try{
            await mysql_select_query.start_transaction();
            await mysql_insert_query.insert_auto_complete_list(
                                                                post.list_name, 
                                                                post.plan_name, 
                                                                Number(post.installments), 
                                                                Number(post.table_second_startPrice), 
                                                                Number(post.table_second_supportPrice), 
                                                                Number(post.table_second_installments_origin), 
                                                                Number(post.table_second_nomalPrice), 
                                                                Number(post.table_second_discount), 
                                                                Number(post.table_second_monthPrice), 
                                                                Number(post.table_second_total_monthlyPrice)
                                                            );
            await mysql_select_query.commit_transaction();
        } catch(err) {
            await mysql_select_query.rollback_transaction();
            console.log(err);
        }
        
        res.redirect(server_url+"/form_insert_lte_contract");
    }

}