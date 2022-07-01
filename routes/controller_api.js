const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const qs = require('querystring');
const exceljs = require("exceljs");
const fs = require("fs");
const { render } = require("ejs");
const e = require("express");
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

module.exports = {
    file_upload : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        console.log("upload OK");
        let get_idx = Number(await mysql_select_query.select_table_get_last_idx("contract"))+1;

        let result = '';
        try{
            await mysql_select_query.start_transaction();
            for(var i=0; i<req.files.length; i++){
                result = await mysql_insert_query.saveFile(req.files[i].filename, req.files[i].destination, req.files[i].size, get_idx);
            }
            console.log("upload OK : "+result);
            await mysql_select_query.commit_transaction();
            res.send(result);
        } catch(err) {
            console.log("upload Fail : "+result);
            await mysql_select_query.rollback_transaction();
            res.send(result);
        }
    },
    
    file_upload_update : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        console.log("upload OK");
        let post = req.body;
        let get_idx = post.main_idx;
        let result = '';
        let delete_result = '';

        try{
            await mysql_select_query.start_transaction();
            let before_file_idx_result = await mysql_select_query.select_attached_file_detail(get_idx);
            let idx_list_result = '';

            before_file_idx_result.forEach((value,key) => {
                if(idx_list_result == ''){
                    idx_list_result = value.idx;
                } else {
                    idx_list_result = idx_list_result + ',' + value.idx;
                }
            });

            delete_result = (await mysql_updel_query.lte_contract_tables_deleteRows("attached_file", 0, get_idx));
            console.log("delete OK : "+result);

            for(var i=0; i<req.files.length; i++){
                result = await mysql_insert_query.saveFile(req.files[i].filename, req.files[i].destination, req.files[i].size, get_idx);
            }
            console.log("upload OK : "+result);
            await mysql_select_query.commit_transaction();
            res.send(idx_list_result.toString());
        } catch(err) {
            console.log("upload OR delete Fail : "+result);
            await mysql_select_query.rollback_transaction();
        }
    },

    get_lte_contract_json_list: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let get_list = req.query;
        let contract_date_start = get_list.contract_date_start=="" ? null:get_list.contract_date_start;
        let contract_date_end = get_list.contract_date_end=="" ? null:get_list.contract_date_end;
        let customer_variation = get_list.customer_variation=="" ? null:get_list.customer_variation;
        let auto_payment_chk = get_list.auto_payment_chk=="" ? null:get_list.auto_payment_chk;
        let sales_people_or_store_name = get_list.sales_people_or_store_name=="" ? null:get_list.sales_people_or_store_name;

        let sql_array = JSON.stringify(await mysql_select_query.select_get_list(req.session.user_id, contract_date_start, contract_date_end, customer_variation, auto_payment_chk, sales_people_or_store_name));

        let json_result = JSON.parse(sql_array, function(key, value){
            if (typeof value === 'number') {
                return value.toString();
              }
              return value;
        });

        res.send('{"data":'+JSON.stringify(json_result)+'}');
    },
    
    get_lte_contract_json_list_mamager: async function(req, res){
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

        let get_list = req.query;
        let contract_date_start = get_list.contract_date_start=="" ? null:get_list.contract_date_start;
        let contract_date_end = get_list.contract_date_end=="" ? null:get_list.contract_date_end;
        let customer_variation = get_list.customer_variation=="" ? null:get_list.customer_variation;
        let auto_payment_chk = get_list.auto_payment_chk=="" ? null:get_list.auto_payment_chk;
        let sales_people_or_store_name = get_list.sales_people_or_store_name=="" ? null:get_list.sales_people_or_store_name;
        
        let sql_array = JSON.stringify(await mysql_select_query.select_get_list_admin(contract_date_start, contract_date_end, customer_variation, auto_payment_chk, sales_people_or_store_name));

        let json_result = JSON.parse(sql_array, function(key, value){
            if (typeof value === 'number') {
                return value.toString();
              }
              return value;
        });

        res.send('{"data":'+JSON.stringify(json_result)+'}');
    },

    get_user_json_list_admin: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        // admin_chk
        let admin_chk = permission_chk.admin_check(req);
        if(admin_chk != true){
            res.send("잘못된 접근입니다.");
            return;
        }
        let sql_array = JSON.stringify(await mysql_select_query.select_get_user_list());

        let json_result = JSON.parse(sql_array, function(key, value){
            if (typeof value === 'number') {
                return value.toString();
              }
              return value;
        });

        res.send('{"data":'+JSON.stringify(json_result)+'}');
    },

    get_customer_type_chart_json_manager: async function(req, res){
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

        let sql_array = (await mysql_select_query.select_get_customer_type_chart());

        res.send(sql_array);
    }, 

    get_service_type_chart_json_manager: async function(req, res){
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
        let sql_array = (await mysql_select_query.select_get_service_type_chart());

        res.send(sql_array);
    }, 

    get_monthly_contract_chart_json_manager: async function(req, res){
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
        let sql_array = (await mysql_select_query.select_monthly_contract_chart());

        res.send(sql_array);
    },
    
    excel_json : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        let workbook = new exceljs.Workbook();
        try{
            await workbook.xlsx.readFile(process.env.LOCAL_DIR + "/excel/" + req.files[0].filename).then(function(){
                let workSheet = workbook.getWorksheet("cell_point");
                let input_Sheet = workbook.getWorksheet("input_sheet");
                let result_arr = {};
                
                workSheet.eachRow({includeEmpty:true},function(row, row_num){
                    if(row.values[2] == "J21"){
                        result_arr[row.values[1]] = input_Sheet.getCell(row.values[2]).text;
                    } else{
                        result_arr[row.values[1]] = input_Sheet.getCell(row.values[2]).value;
                    }
                })
                res.json(result_arr);
            });
            
            fs.unlink(process.env.LOCAL_DIR + "/excel/" + req.files[0].filename, function(err){
                if(err){
                    console.log(err);
                }
            })
            
        } catch(err) {
            res.send(err);
            console.log(err);
        }
    },
    
    excel_export: async function(req, res){
        let workbook = new exceljs.Workbook();
        try{
            await workbook.xlsx.writeFile(process.env.LOCAL_DIR + "/excel/" + req.files[0].filename).then(function(){
                let workSheet = workbook.getWorksheet("cell_point");
                let input_Sheet = workbook.getWorksheet("input_sheet");
                let result_arr = {};
                
                workSheet.eachRow({includeEmpty:true},function(row, row_num){
                    if(row.values[2] == "J21"){
                        result_arr[row.values[1]] = input_Sheet.getCell(row.values[2]).text;
                    } else{
                        result_arr[row.values[1]] = input_Sheet.getCell(row.values[2]).value;
                    }
                })
                res.json(result_arr);
            });
            
            fs.unlink(process.env.LOCAL_DIR + "/excel/" + req.files[0].filename, function(err){
                if(err){
                    console.log(err);
                }
            })
            
        } catch(err) {
            res.send(err);
            console.log(err);
        }
    },

    download_file: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        let folder = req.query.folder;
        let file_name = req.query.file_name;
        let path = "";

        if(folder != "" && folder != null){
            path = "/"+folder+"/"+file_name;
        } else {
            path = "/"+file_name;
        }
        res.download(process.env.LOCAL_DIR+path);
    },

    download_contract_attach_file: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let attach_file_name = req.query.file_name;
        let file_owner = "";

        if(req.session.user_rank!=1){
            file_owner = await mysql_select_query.select_attach_file_download_chk(attach_file_name)

            if(file_owner == req.session.user_id){
                res.download(process.env.LOCAL_DIR+"/files/"+attach_file_name);
            } else {
                res.send("잘못된 접근입니다.");
            }
        } else {
            res.download(process.env.LOCAL_DIR+"/files/"+attach_file_name);
        }

    }
}