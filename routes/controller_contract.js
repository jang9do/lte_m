const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const crypto = require('crypto');
const { render } = require("ejs");
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

// 암호화 메서드
const cipher = (password, key, iv) => {
    return new Promise((resolve, reject) => {
        const encrypt = crypto.createCipheriv('aes-256-cbc', key, iv); // des알고리즘과 키를 설정
        const encryptResult = encrypt.update(password, 'utf8', 'base64') // 암호화
            + encrypt.final('base64'); // 인코딩
        resolve(encryptResult);
    })
}

// 복호화 메서드
const decipher = (password, key, iv) => {
    return new Promise((resolve, reject) => {
        const decode = crypto.createDecipheriv('aes-256-cbc', key, iv)
        const decodeResult = decode.update(password, 'base64', 'utf8') // 암호화된 문자열, 암호화 했던 인코딩 종류, 복호화 할 인코딩 종류 설정
            + decode.final('utf8') // 복호화 결과의 인코딩
            
        resolve(decodeResult)
    })
}

module.exports = {
    form_insert_lte_contract : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        res.render("../views/contract/form_insert_lte_contract.ejs", {server_url: server_url, page_name: 'form_insert_lte_contract', user_rank: req.session.user_rank, user_id: req.session.user_id});
    },

    insert_lte_contract : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let get_idx = Number(await mysql_select_query.select_table_get_last_idx("contract"))+1;
        let attached_file_flag = (await mysql_select_query.select_attach_file_chk(get_idx));
        let post = req.body;
        let user_id = req.session.user_id;

        let bill_type_string = "";

        if(post.bill_variation_mail=="ok"){
            bill_type_string = "\'mail\'";
        }
        if(post.bill_variation_message=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'message\'";
        }
        if(post.bill_variation_alram=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'alram\'";
        }
        if(post.bill_variation_post=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'post\'";
        }


        //insert_and_update_db
        try{
            await mysql_select_query.start_transaction();

            let c_network_result = (await mysql_insert_query.insert_contract_c_network(post.tel_comp, post.contact_variation, post.work_variation, post.connect_variation, post.customer_variation, post.visit_costomer, get_idx));
            if(c_network_result=='OK'){
                console.log('c_network_OK');
            }

            let terminal_purchase_result = (await mysql_insert_query.insert_contract_Terminal_purchase(post.installments, post.table_second_startPrice, post.table_second_supportPrice, post.table_second_supportPrice_money, post.table_second_installments_origin, post.table_second_unpairPrice, get_idx));
            if(terminal_purchase_result=='OK'){
                console.log('terminal_purchase_OK');
            }

            let c_line_useprice_result = (await mysql_insert_query.insert_contract_c_line_useprice(post.line_use_price, post.table_second_price_model_name, post.table_second_nomalPrice, post.table_second_discount_type, post.table_second_discount, post.table_second_monthPrice, post.table_second_contactPeriod, get_idx));
            if(c_line_useprice_result=='OK'){
                console.log('c_line_useprice_OK');
            }

            let monthly_price_result = (await mysql_insert_query.insert_contract_monthly_price(post.month_price, post.table_second_terminal_price, post.table_second_comuPrice, post.table_second_addPrice, post.table_second_totalPrice, post.table_second_plusSupportPrice, post.table_second_total_monthlyPrice, get_idx));
            if(monthly_price_result=='OK'){
                console.log('monthly_price_OK');
            }

            let customer_detail_result = (await mysql_insert_query.insert_contract_customer_detail(post.customer_name, post.customer_birth, post.customer_gender, post.customer_phone_num, post.customer_company_num, post.customer_mail, post.customer_address, bill_type_string, get_idx));
            if(customer_detail_result=='OK'){
                console.log('customer_detail_OK');
            }

            let get_encryption_key = (await mysql_select_query.select_get_encryption_key("payment_detail","wallet_num"));
            let payment_detail_result = (await mysql_insert_query.insert_contract_payment_detail(post.auto_payment_chk, post.auto_payment, post.auto_payment_finance_name, (await cipher(post.auto_payment_finance_num,get_encryption_key.en_key,get_encryption_key.en_iv)), post.finance_master_birth, post.finance_master_name, post.finance_master_valid, post.finance_master_relation, post.auto_payment_other_peaple_chk, post.request_name, get_idx));
            if(payment_detail_result=='OK'){
                console.log('payment_detail_OK');
            }

            let service_detail_result = (await mysql_insert_query.insert_contract_service_detail(post.join_service_variation, post.fifth_table_monthly_price, post.join_price, post.join_price_variation, post.single_model_name, post.terminal_num_or_IMEI, post.USIM_model_name, post.USIM_num, post.USIM_price, post.USIM_price_variation, post.join_phone_num, get_idx));
            if(service_detail_result=='OK'){
                console.log('service_detail_OK');
            }

            let other_information_result = (await mysql_insert_query.insert_contract_other_information(post.sales_people_name, post.sales_store_name, post.ship_num, post.ship_name, post.other_input_text, get_idx));
            if(other_information_result=='OK'){
                console.log('other_information_OK');
            }

            let applicant_detail_result = (await mysql_insert_query.insert_contract_applicant_detail(post.real_write_contract_date, post.applicant_name, post.applicant_store, post.applicant_sales_man_name, post.applicant_store_call_number, get_idx));
            if(applicant_detail_result=='OK'){
                console.log('applicant_detail_OK');
            }


            //get_idx
            let c_network_idx = (await mysql_select_query.select_table_get_last_idx('c_network'));
            let terminal_purchase_idx = (await mysql_select_query.select_table_get_last_idx('terminal_purchase'));
            let c_line_useprice_idx = (await mysql_select_query.select_table_get_last_idx('c_line_useprice'));
            let monthly_price_idx = (await mysql_select_query.select_table_get_last_idx('monthly_price'));
            let customer_detail_idx = (await mysql_select_query.select_table_get_last_idx('customer_detail'));
            let payment_detail_idx = (await mysql_select_query.select_table_get_last_idx('payment_detail'));
            let service_detail_idx = (await mysql_select_query.select_table_get_last_idx('service_detail'));
            let other_information_idx = (await mysql_select_query.select_table_get_last_idx('other_information'));
            let applicant_detail_idx = (await mysql_select_query.select_table_get_last_idx('applicant_detail'));

            let result = (await mysql_insert_query.insert_contract_main(c_network_idx, terminal_purchase_idx, c_line_useprice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, user_id));
            await mysql_select_query.commit_transaction();

            res.redirect(server_url+"/lte_contract_list");
        } catch(err) {
            await mysql_select_query.rollback_transaction();

            console.log(err);
            let result = err;
            res.redirect(server_url+"/form_insert_lte_contract");
        }
    },

    update_lte_contract : async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        let post = req.body;
        let get_idx = post.main_idx;
        let contract_idx_list = (await mysql_select_query.select_get_contract_all_idx(get_idx));
        let attached_file_flag = (await mysql_select_query.select_attach_file_chk(get_idx));
        let user_id = req.session.user_id;

        if(contract_idx_list.delFlag!=0 || contract_idx_list.contract_status!=1){
            res.send("확인할 수 없는 항목입니다.");
            return;
        }
        if(contract_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
            res.send("잘못된 유저의 접근입니다.");
            return;
        }

        console.log(post.before_attached_file_idx_list);

        let bill_type_string = "";

        if(post.bill_variation_mail=="ok"){
            bill_type_string = "\'mail\'";
        }
        if(post.bill_variation_message=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'message\'";
        }
        if(post.bill_variation_alram=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'alram\'";
        }
        if(post.bill_variation_post=="ok"){
            if(bill_type_string != ""){
                bill_type_string = bill_type_string + ",";
            }
            bill_type_string = bill_type_string+"\'post\'";
        }


        //update_db
        try{
            await mysql_select_query.start_transaction();

            await mysql_insert_query.insert_contract_log_main(
                get_idx, 
                contract_idx_list.c_network_idx, 
                contract_idx_list.terminal_purchase_idx, 
                contract_idx_list.c_line_usePrice_idx, 
                contract_idx_list.monthly_price_idx, 
                contract_idx_list.customer_detail_idx, 
                contract_idx_list.payment_detail_idx, 
                contract_idx_list.service_detail_idx, 
                contract_idx_list.other_information_idx, 
                contract_idx_list.applicant_detail_idx, 
                contract_idx_list.attached_file_flag, 
                post.before_attached_file_idx_list, 
                contract_idx_list.create_user, 
                contract_idx_list.modify_user, 
                contract_idx_list.modDate
                );

            /*
            await mysql_updel_query.lte_contract_tables_deleteRows("c_network",contract_idx_list.c_network_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("terminal_purchase",contract_idx_list.terminal_purchase_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("c_line_useprice",contract_idx_list.c_line_usePrice_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("monthly_price",contract_idx_list.monthly_price_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("customer_detail",contract_idx_list.customer_detail_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("payment_detail",contract_idx_list.payment_detail_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("service_detail",contract_idx_list.service_detail_idx,0);
            await mysql_updel_query.lte_contract_tables_deleteRows("other_information",contract_idx_list.other_information_idx,0);
            */

            let c_network_result = (await mysql_insert_query.insert_contract_c_network(post.tel_comp, post.contact_variation, post.work_variation, post.connect_variation, post.customer_variation, post.visit_costomer, get_idx));
            if(c_network_result=='OK'){
                console.log('c_network_OK');
            }

            let terminal_purchase_result = (await mysql_insert_query.insert_contract_Terminal_purchase(post.installments, post.table_second_startPrice, post.table_second_supportPrice, post.table_second_supportPrice_money, post.table_second_installments_origin, post.table_second_unpairPrice, get_idx));
            if(terminal_purchase_result=='OK'){
                console.log('terminal_purchase_OK');
            }

            let c_line_useprice_result = (await mysql_insert_query.insert_contract_c_line_useprice(post.line_use_price, post.table_second_price_model_name, post.table_second_nomalPrice, post.table_second_discount_type, post.table_second_discount, post.table_second_monthPrice, post.table_second_contactPeriod, get_idx));
            if(c_line_useprice_result=='OK'){
                console.log('c_line_useprice_OK');
            }

            let monthly_price_result = (await mysql_insert_query.insert_contract_monthly_price(post.month_price, post.table_second_terminal_price, post.table_second_comuPrice, post.table_second_addPrice, post.table_second_totalPrice, post.table_second_plusSupportPrice, post.table_second_total_monthlyPrice, get_idx));
            if(monthly_price_result=='OK'){
                console.log('monthly_price_OK');
            }

            let customer_detail_result = (await mysql_insert_query.insert_contract_customer_detail(post.customer_name, post.customer_birth, post.customer_gender, post.customer_phone_num, post.customer_company_num, post.customer_mail, post.customer_address, bill_type_string, get_idx));
            if(customer_detail_result=='OK'){
                console.log('customer_detail_OK');
            }

            let get_encryption_key = (await mysql_select_query.select_get_encryption_key("payment_detail","wallet_num"));
            let payment_detail_result = (await mysql_insert_query.insert_contract_payment_detail(post.auto_payment_chk, post.auto_payment, post.auto_payment_finance_name, (await cipher(post.auto_payment_finance_num,get_encryption_key.en_key,get_encryption_key.en_iv)), post.finance_master_birth, post.finance_master_name, post.finance_master_valid, post.finance_master_relation, post.auto_payment_other_peaple_chk, post.request_name, get_idx));
            if(payment_detail_result=='OK'){
                console.log('payment_detail_OK');
            }

            let service_detail_result = (await mysql_insert_query.insert_contract_service_detail(post.join_service_variation, post.fifth_table_monthly_price, post.join_price, post.join_price_variation, post.single_model_name, post.terminal_num_or_IMEI, post.USIM_model_name, post.USIM_num, post.USIM_price, post.USIM_price_variation, post.join_phone_num, get_idx));
            if(service_detail_result=='OK'){
                console.log('service_detail_OK');
            }

            let other_information_result = (await mysql_insert_query.insert_contract_other_information(post.sales_people_name, post.sales_store_name, post.ship_num, post.ship_name, post.other_input_text, get_idx));
            if(other_information_result=='OK'){
                console.log('other_information_OK');
            }

            let applicant_detail_result = (await mysql_insert_query.insert_contract_applicant_detail(post.real_write_contract_date, post.applicant_name, post.applicant_store, post.applicant_sales_man_name, post.applicant_store_call_number, get_idx));
            if(applicant_detail_result=='OK'){
                console.log('applicant_detail_OK');
            }


            //get_idx
            let c_network_idx = (await mysql_select_query.select_table_get_last_idx('c_network'));
            let terminal_purchase_idx = (await mysql_select_query.select_table_get_last_idx('terminal_purchase'));
            let c_line_useprice_idx = (await mysql_select_query.select_table_get_last_idx('c_line_useprice'));
            let monthly_price_idx = (await mysql_select_query.select_table_get_last_idx('monthly_price'));
            let customer_detail_idx = (await mysql_select_query.select_table_get_last_idx('customer_detail'));
            let payment_detail_idx = (await mysql_select_query.select_table_get_last_idx('payment_detail'));
            let service_detail_idx = (await mysql_select_query.select_table_get_last_idx('service_detail'));
            let other_information_idx = (await mysql_select_query.select_table_get_last_idx('other_information'));
            let applicant_detail_idx = (await mysql_select_query.select_table_get_last_idx('applicant_detail'));

            await mysql_updel_query.update_contract_main(c_network_idx, terminal_purchase_idx, c_line_useprice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, contract_idx_list.create_user, user_id, get_idx);
            await mysql_select_query.commit_transaction();

            console.log(server_url);
            res.redirect(server_url+"/form_show_lte_contract?main_idx="+get_idx);
        } catch(err) {
            await mysql_select_query.rollback_transaction();

            console.log(err);
            res.redirect(server_url+"/form_modify_lte_contract?main_idx="+get_idx);
        }
    },

    lte_contract_list: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        res.render("../views/contract/lte_contract_list.ejs", {server_url: server_url, page_name: 'lte_contract_list', user_rank: req.session.user_rank, user_id: req.session.user_id});
    },

    form_show_lte_contract: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        let main_idx = req.query.main_idx;
        
        // get_query_data
        try {
            let contract_idx_list = await mysql_select_query.select_get_contract_all_idx(main_idx);
            let mod_log_list = await mysql_select_query.select_get_before_contract_list(main_idx);

            if((contract_idx_list.delFlag != 0 || contract_idx_list.contract_status!=1)){
                res.send("확인할 수 없는 항목입니다.");
                return;
            }

            if(contract_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
                res.send("잘못된 유저의 접근입니다.");
                return;
            }

            let get_encryption_key = (await mysql_select_query.select_get_encryption_key("payment_detail","wallet_num"));

            let c_network_data = await mysql_select_query.select_c_network_detail(contract_idx_list.c_network_idx);
            let terminal_purchase_data = await mysql_select_query.select_terminal_purchase_detail(contract_idx_list.terminal_purchase_idx);
            let c_line_usePrice_data = await mysql_select_query.select_c_line_usePrice_detail(contract_idx_list.c_line_usePrice_idx);
            let monthly_price_data = await mysql_select_query.select_monthly_price_detail(contract_idx_list.monthly_price_idx);
            let customer_detail_data = await mysql_select_query.select_customer_detail_detail(contract_idx_list.customer_detail_idx);
            let payment_detail_data = await mysql_select_query.select_payment_detail_detail(contract_idx_list.payment_detail_idx);
            payment_detail_data[0].wallet_num = await decipher(payment_detail_data[0].wallet_num, get_encryption_key.en_key, get_encryption_key.en_iv);
            let service_detail_data = await mysql_select_query.select_service_detail_detail(contract_idx_list.service_detail_idx);
            let other_information_data = await mysql_select_query.select_other_information_detail(contract_idx_list.other_information_idx);
            let applicant_detail_data = await mysql_select_query.select_applicant_detail_detail(contract_idx_list.applicant_detail_idx);
            let attached_file_data = await mysql_select_query.select_attached_file_detail(main_idx);

            res.render("../views/contract/form_show_lte_contract.ejs", {
                server_url: server_url, 
                page_name: 'form_show_lte_contract', 
                contract_idx_list: contract_idx_list,
                main_idx: main_idx, 
                c_network_data: c_network_data, 
                terminal_purchase_data: terminal_purchase_data,
                c_line_usePrice_data: c_line_usePrice_data,
                monthly_price_data: monthly_price_data,
                customer_detail_data: customer_detail_data,
                payment_detail_data: payment_detail_data,
                service_detail_data: service_detail_data,
                other_information_data: other_information_data,
                applicant_detail_data: applicant_detail_data,
                attached_file_data: attached_file_data,
                user_id: req.session.user_id,
                user_rank: req.session.user_rank,
                delFlag: contract_idx_list.delFlag,
                mod_log_list: mod_log_list
            });
        } catch(err){
            console.log(err);
            res.redirect(server_url+"/lte_contract_list");
        }
    },

    form_show_before_lte_contract: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }
        let main_idx = req.query.main_idx;
        
        // get_query_data
        try {
            let contract_before_idx_list = await mysql_select_query.select_get_before_contract_all_idx(main_idx);

            if(contract_before_idx_list.contract_status!=1){

                res.send("확인할 수 없는 항목입니다.");
                return;
            }

            if(contract_before_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
                res.send("잘못된 유저의 접근입니다.");
                return;
            }

            let get_encryption_key = (await mysql_select_query.select_get_encryption_key("payment_detail","wallet_num"));

            let c_network_data = await mysql_select_query.select_c_network_detail(contract_before_idx_list.c_network_idx);
            let terminal_purchase_data = await mysql_select_query.select_terminal_purchase_detail(contract_before_idx_list.terminal_purchase_idx);
            let c_line_usePrice_data = await mysql_select_query.select_c_line_usePrice_detail(contract_before_idx_list.c_line_usePrice_idx);
            let monthly_price_data = await mysql_select_query.select_monthly_price_detail(contract_before_idx_list.monthly_price_idx);
            let customer_detail_data = await mysql_select_query.select_customer_detail_detail(contract_before_idx_list.customer_detail_idx);
            let payment_detail_data = await mysql_select_query.select_payment_detail_detail(contract_before_idx_list.payment_detail_idx);
            payment_detail_data[0].wallet_num = await decipher(payment_detail_data[0].wallet_num, get_encryption_key.en_key, get_encryption_key.en_iv);
            let service_detail_data = await mysql_select_query.select_service_detail_detail(contract_before_idx_list.service_detail_idx);
            let other_information_data = await mysql_select_query.select_other_information_detail(contract_before_idx_list.other_information_idx);
            let applicant_detail_data = await mysql_select_query.select_applicant_detail_detail(contract_before_idx_list.applicant_detail_idx);
            let attached_file_data = await mysql_select_query.select_before_attached_file_detail(contract_before_idx_list.attached_file_idx_list);

            res.render("../views/contract/form_show_before_lte_contract.ejs", {
                server_url: server_url, 
                page_name: 'form_show_before_lte_contract', 
                contract_before_idx_list: contract_before_idx_list,
                main_idx: main_idx, 
                c_network_data: c_network_data, 
                terminal_purchase_data: terminal_purchase_data,
                c_line_usePrice_data: c_line_usePrice_data,
                monthly_price_data: monthly_price_data,
                customer_detail_data: customer_detail_data,
                payment_detail_data: payment_detail_data,
                service_detail_data: service_detail_data,
                other_information_data: other_information_data,
                applicant_detail_data: applicant_detail_data,
                attached_file_data: attached_file_data,
                user_id: req.session.user_id,
                user_rank: req.session.user_rank
            });
        } catch(err){
            console.log(err);
            res.redirect(server_url+"/lte_contract_list");
        }
    },

    form_modify_lte_contract: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let main_idx = req.query.main_idx;

        // get_query_data
        try {
            let contract_idx_list = await mysql_select_query.select_get_contract_all_idx(main_idx);

            if(contract_idx_list.delFlag!=0 || contract_idx_list.contract_status!=1){
                res.send("확인할 수 없는 항목입니다.");
                return;
            }

            if(contract_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
                res.send("잘못된 유저의 접근입니다.");
                return;
            }

            let get_encryption_key = (await mysql_select_query.select_get_encryption_key("payment_detail","wallet_num"));

            let c_network_data = await mysql_select_query.select_c_network_detail(contract_idx_list.c_network_idx);
            let terminal_purchase_data = await mysql_select_query.select_terminal_purchase_detail(contract_idx_list.terminal_purchase_idx);
            let c_line_usePrice_data = await mysql_select_query.select_c_line_usePrice_detail(contract_idx_list.c_line_usePrice_idx);
            let monthly_price_data = await mysql_select_query.select_monthly_price_detail(contract_idx_list.monthly_price_idx);
            let customer_detail_data = await mysql_select_query.select_customer_detail_detail(contract_idx_list.customer_detail_idx);
            let payment_detail_data = await mysql_select_query.select_payment_detail_detail(contract_idx_list.payment_detail_idx);
            payment_detail_data[0].wallet_num = await decipher(payment_detail_data[0].wallet_num, get_encryption_key.en_key, get_encryption_key.en_iv);
            let service_detail_data = await mysql_select_query.select_service_detail_detail(contract_idx_list.service_detail_idx);
            let other_information_data = await mysql_select_query.select_other_information_detail(contract_idx_list.other_information_idx);
            let applicant_detail_data = await mysql_select_query.select_applicant_detail_detail(contract_idx_list.applicant_detail_idx);
            let attached_file_data = await mysql_select_query.select_attached_file_detail(main_idx);

            res.render("../views/contract/form_modify_lte_contract.ejs", {
                server_url: server_url, 
                page_name: 'form_modify_lte_contract', 
                main_idx: main_idx, 
                contract_idx_list: contract_idx_list,
                c_network_data: c_network_data, 
                terminal_purchase_data: terminal_purchase_data,
                c_line_usePrice_data: c_line_usePrice_data,
                monthly_price_data: monthly_price_data,
                customer_detail_data: customer_detail_data,
                payment_detail_data: payment_detail_data,
                service_detail_data: service_detail_data,
                other_information_data: other_information_data,
                applicant_detail_data: applicant_detail_data,
                attached_file_data: attached_file_data,
                user_id: req.session.user_id,
                user_rank: req.session.user_rank
            });
        } catch(err){
            console.log(err);
            res.render("../views/contract/form_modify_lte_contract.ejs", {server_url: server_url, page_name: 'form_modify_lte_contract', user_rank: req.session.user_rank, user_id: req.session.user_id});
        }
    },

    delete_lte_contract: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let get_idx = req.query.main_idx;

        try{
            let contract_idx_list = await mysql_select_query.select_get_contract_all_idx(get_idx);

            if(contract_idx_list.delFlag!=0 || contract_idx_list.contract_status!=1){
                res.send("확인할 수 없는 항목입니다.");
                return;
            }

            if(contract_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
                res.send("잘못된 유저의 접근입니다.");
                return;
            }

            await mysql_updel_query.delete_lte_contract(get_idx);
            res.redirect(server_url+"/lte_contract_list");
        } catch(err){
            console.log(err);
            res.redirect(server_url+"/form_show_lte_contract?main_idx="+get_idx);
        }
    },

    recovery_lte_contract: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let get_idx = req.query.main_idx;

        try{
            let contract_idx_list = await mysql_select_query.select_get_contract_all_idx(get_idx);

            if(contract_idx_list.delFlag==0 || contract_idx_list.contract_status!=1){
                res.send("복구할 수 없는 항목입니다.");
                return;
            }

            if(contract_idx_list.create_user != req.session.user_id && (req.session.user_rank != 1 && req.session.user_rank != 2)){
                res.send("잘못된 유저의 접근입니다.");
                return;
            }

            await mysql_updel_query.recovery_lte_contract(get_idx);
            res.redirect(server_url+"/lte_contract_list");
        } catch(err){
            console.log(err);
            res.redirect(server_url+"/form_show_lte_contract?main_idx="+get_idx);
        }
    }
}