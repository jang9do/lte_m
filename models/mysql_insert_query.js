const mysqlConnObj = require('../db');
const mysqlConn = mysqlConnObj.init();
mysqlConnObj.open(mysqlConn);

module.exports = {
    testQuery: function(){ 
        return new Promise (function(response, reject){ 
            mysqlConn.query("SELECT * FROM test", function(err, data){
                if(!err){
                    response(data[0].user);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_main: function(auto_complete_list_idx, c_network_detail_idx, terminal_purchase_idx, c_line_usePrice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, user_id){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`contract`(`auto_complete_list_idx`,`c_network_idx`,`terminal_purchase_idx`,`c_line_usePrice_idx`,`monthly_price_idx`,`customer_detail_idx`,`payment_detail_idx`,`service_detail_idx`,`other_information_idx`,`applicant_detail_idx`,`attached_file_flag`,`create_user`) ';
            sql = sql + 'VALUES(?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,?, ?)';
            let params = [auto_complete_list_idx, c_network_detail_idx, terminal_purchase_idx, c_line_usePrice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, user_id];
            mysqlConn.query(sql, params,function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_log_main: function(origin_idx, auto_complete_list_idx, c_network_detail_idx, terminal_purchase_idx, c_line_usePrice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, attached_file_idx_list, create_user_id, modify_user, origin_modDate){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`contract_before_log`(`origin_idx`,`auto_complete_list_idx`,`c_network_idx`,`terminal_purchase_idx`,`c_line_usePrice_idx`,`monthly_price_idx`,`customer_detail_idx`,`payment_detail_idx`,`service_detail_idx`,`other_information_idx`,`applicant_detail_idx`,`attached_file_flag`,`attached_file_idx_list`,`create_user`,`modify_user`,`origin_modDate`) ';
            sql = sql + 'VALUES(? ,? ,? ,? ,? ,? ,? ,? ,?, ?, ?, ?, ?, ? ,?, ?)';
            let params = [origin_idx, auto_complete_list_idx, c_network_detail_idx, terminal_purchase_idx, c_line_usePrice_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, other_information_idx, applicant_detail_idx, attached_file_flag, attached_file_idx_list, create_user_id, modify_user, origin_modDate];
            mysqlConn.query(sql, params,function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_c_network: function(network, contract_type, contract_work, open_tel_type, customer_type, visit_customer, main_idx){
        return new Promise (function(response, reject){
            let network_value = (network=="" ? null:network);
            let contract_type_value = (contract_type=="" ? null:contract_type);
            let contract_work_value = (contract_work=="" ? null:contract_work);
            let open_tel_type_value = (open_tel_type=="" ? null:open_tel_type);
            let customer_type_value = (customer_type=="" ? null:customer_type);
            let visit_customer_value = (visit_customer=="" ? null:visit_customer);
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`c_network`(`network`,`contract_type`,`contract_work`,`open_tel_type`,`customer_type`,`visit_customer`,`main_idx`) VALUES(?, ?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [network_value, contract_type_value, contract_work_value, open_tel_type_value, customer_type_value, visit_customer_value];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_Terminal_purchase: function(installments, initial_price, discount_support, discount_cash_price, installments_origin, unpair_price, main_idx){
        return new Promise (function(response, reject){
            let installments_value = (installments=="" ? null:installments);
            let initial_price_value = (initial_price=="" ? null:initial_price);
            let discount_support_value = (discount_support=="" ? null:discount_support);
            let discount_cash_price_value = (discount_cash_price=="" ? null:discount_cash_price);
            let installments_origin_value = (installments_origin=="" ? null:installments_origin);
            let unpair_price_value = (unpair_price=="" ? null:unpair_price);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`terminal_purchase`(`installments`,`initial_price`,`discount_support`,`discount_cash_price`,`installments_origin`,`unpair_price`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [installments_value, initial_price_value, discount_support_value, discount_cash_price_value, installments_origin_value, unpair_price_value];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_c_line_useprice: function(line_price, use_type, nomal_price, discount_type, discount, monthly_price, contract_period, main_idx){
        return new Promise (function(response, reject){
            let line_price_value = (line_price=="" ? null:line_price);
            let use_type_value = (use_type=="" ? null:use_type);
            let nomal_price_value = (nomal_price=="" ? null:nomal_price);
            let discount_type_value = (discount_type=="" ? null:discount_type);
            let discount_value = (discount=="" ? null:discount);
            let monthly_price_value = (monthly_price=="" ? null:monthly_price);
            let contract_period_value = (contract_period=="" ? null:contract_period);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`c_line_useprice`(`line_price`,`use_type`,`nomal_price`,`discount_type`,`discount`,`monthly_price`,`contract_period`,`main_idx`) ';
            sql = sql + 'VALUES(? ,? ,? ,? ,? , ?, ?,"'+main_idx+'")';
            let params = [line_price_value, use_type_value, nomal_price_value, discount_type_value, discount_value, monthly_price_value, contract_period_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_monthly_price: function(repeat_monthly_price, terminal_price, comunication_price, other_service_price, total_price, after_support_price, total_monthly_price, main_idx){
        return new Promise (function(response, reject){
            let repeat_monthly_price_value = (repeat_monthly_price=="" ? null:repeat_monthly_price);
            let terminal_price_value = (terminal_price=="" ? null:terminal_price);
            let comunication_price_value = (comunication_price=="" ? null:comunication_price);
            let other_service_price_value = (other_service_price=="" ? null:other_service_price);
            let total_price_value = (total_price=="" ? null:total_price);
            let after_support_price_value = (after_support_price=="" ? null:after_support_price);
            let total_monthly_price_value = (total_monthly_price=="" ? null:total_monthly_price);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`monthly_price`(`repeat_monthly_price`,`terminal_price`,`comunication_price`,`other_service_price`,`total_price`,`after_support_price`,`total_monthly_price`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, "'+main_idx+'")';
            let params = [repeat_monthly_price_value, terminal_price_value, comunication_price_value, other_service_price_value, total_price_value, after_support_price_value, total_monthly_price_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_customer_detail: function(customer_name, birth, gender, tel, coperation_num, email, address, bill_type, main_idx){
        return new Promise (function(response, reject){
            let customer_name_value = (customer_name=="" ? null:customer_name);
            let birth_value = (birth=="" ? null:birth);
            let gender_value = (gender=="" ? null:gender);
            let tel_value = (tel=="" ? null:tel);
            let coperation_num_value = (coperation_num=="" ? null:coperation_num);
            let email_value = (email=="" ? null:email);
            let address_value = (address=="" ? null:address);
            let bill_type_value = (bill_type=="" ? null:bill_type);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`customer_detail`(`customer_name`,`birth`,`gender`,`tel`,`coperation_num`,`email`,`address`,`bill_type`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [customer_name_value, birth_value, gender_value, tel_value, coperation_num_value, email_value, address_value, bill_type_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_payment_detail: function(auto_payment, auto_payment_type, finance_name, wallet_num, auto_payment_user_birth, auto_payment_user_name, auto_payment_user_period, user_relation, auto_payment_agree, request_user_name, main_idx){
        return new Promise (function(response, reject){
            let auto_payment_value = (auto_payment==null ? "no":auto_payment);
            auto_payment_value = (auto_payment=="" ? "no":auto_payment);
            let auto_payment_type_value = (auto_payment_type=="" ? null:auto_payment_type);
            if(auto_payment_value == "no" || auto_payment_value == null){
                auto_payment_type_value = null;
            }
            let finance_name_value = (finance_name=="" ? null:finance_name);
            let wallet_num_value = (wallet_num=="" ? null:wallet_num);
            let auto_payment_user_birth_value = (auto_payment_user_birth=="" ? null:auto_payment_user_birth);
            let auto_payment_user_name_value = (auto_payment_user_name=="" ? null:auto_payment_user_name);
            let auto_payment_user_period_value = (auto_payment_user_period=="" ? null:auto_payment_user_period);
            let user_relation_value = (user_relation=="" ? null:user_relation);
            let auto_payment_agree_value = (auto_payment_agree=="" ? "no":auto_payment_agree);
            auto_payment_agree_value = (auto_payment_agree==null ? "no":auto_payment_agree);
            let request_user_name_value = (request_user_name=="" ? null:request_user_name);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`payment_detail`(`auto_payment`,`auto_payment_type`,`finance_name`,`wallet_num`,`auto_payment_user_birth`,`auto_payment_user_name`,`auto_payment_user_period`,`user_relation`,`auto_payment_agree`,`request_user_name`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [auto_payment_value, auto_payment_type_value, finance_name_value, wallet_num_value, auto_payment_user_birth_value, auto_payment_user_name_value, auto_payment_user_period_value, user_relation_value, auto_payment_agree_value, request_user_name_value];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_service_detail: function(service_name, monthly_price, join_fee, join_fee_type, terminal_model_name, terminal_no_or_IMEI, usim_model_name, usim_no, usim_price, usim_price_payment_type, join_tel, main_idx){
        return new Promise (function(response, reject){
            let service_name_value = (service_name=="" ? null:service_name);
            let monthly_price_value = (monthly_price=="" ? null:monthly_price);
            let join_fee_value = (join_fee=="" ? null:join_fee);
            let join_fee_type_value = (join_fee_type=="" ? null:join_fee_type);
            let terminal_model_name_value = (terminal_model_name=="" ? null:terminal_model_name);
            let terminal_no_or_IMEI_value = (terminal_no_or_IMEI=="" ? null:terminal_no_or_IMEI);
            let usim_model_name_value = (usim_model_name=="" ? null:usim_model_name);
            let usim_no_value = (usim_no=="" ? null:usim_no);
            let usim_price_value = (usim_price=="" ? null:usim_price);
            let usim_price_payment_type_value = (usim_price_payment_type=="" ? null:usim_price_payment_type);
            let join_tel_value = (join_tel=="" ? null:join_tel);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`service_detail`(`service_name`,`monthly_price`,`join_fee`,`join_fee_type`,`terminal_model_name`,`terminal_no_or_IMEI`,`usim_model_name`,`usim_no`,`usim_price`,`usim_price_payment_type`,`join_tel`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [service_name_value, monthly_price_value, join_fee_value, join_fee_type_value, terminal_model_name_value, terminal_no_or_IMEI_value, usim_model_name_value, usim_no_value, usim_price_value, usim_price_payment_type_value, join_tel_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_other_information: function(main_manager, contract_store, ship_no, ship_name, note, main_idx){
        return new Promise (function(response, reject){
            let main_manager_value = (main_manager=="" ? null:main_manager);
            let contract_store_value = (contract_store=="" ? null:contract_store);
            let ship_no_value = (ship_no=="" ? null:ship_no);
            let ship_name_value = (ship_name=="" ? null:ship_name);
            let note_value = (note=="" ? null:note);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`other_information`(`main_manager`,`contract_store`,`ship_no`,`ship_name`,`note`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [main_manager_value, contract_store_value, ship_no_value, ship_name_value, note_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_contract_applicant_detail: function(real_write_contract_date, applicant_name, applicant_store, applicant_sales_man_name, applicant_store_call_number, main_idx){
        return new Promise (function(response, reject){
            let real_write_contract_date_value = (real_write_contract_date=="" ? null:real_write_contract_date);
            let applicant_name_value = (applicant_name=="" ? null:applicant_name);
            let applicant_store_value = (applicant_store=="" ? null:applicant_store);
            let applicant_sales_man_name_value = (applicant_sales_man_name=="" ? null:applicant_sales_man_name);
            let applicant_store_call_number_value = (applicant_store_call_number=="" ? null:applicant_store_call_number);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`applicant_detail`(`real_write_contract_date`,`applicant_name`,`applicant_store`,`applicant_sales_man_name`,`applicant_store_call_number`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?,"'+main_idx+'")';
            let params = [real_write_contract_date_value, applicant_name_value, applicant_store_value, applicant_sales_man_name_value, applicant_store_call_number_value];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    insert_input_user: function(user_id, crypto_pw, user_name, user_position){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`user_info`(`user_id`,`user_pw`,`user_name`,`user_position`) VALUES(?, ?, ?, ?)';
            let params = [user_id, crypto_pw, user_name, user_position];
            
            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },
    insert_input_user_salt: function(user_idx, salt, encording_variable){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`user_pw_key`(`user_idx`,`user_key`,`encording_valiable`) VALUES(?, ?, ?)';
            let params = [user_idx, salt, encording_variable];
            
            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },
    insert_auto_complete_list: function(list_name, plan_name, installments, table_second_startPrice, table_second_supportPrice, table_second_installments_origin, table_second_nomalPrice, table_second_discount, table_second_monthPrice, table_second_total_monthlyPrice){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`auto_complete_list`(`list_name`,`plan_name`,`installments`,`table_second_startPrice`,`table_second_supportPrice`,`table_second_installments_origin`,`table_second_nomalPrice`,`table_second_discount`,`table_second_monthPrice`,`table_second_total_monthlyPrice`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params = [list_name, plan_name, installments, table_second_startPrice, table_second_supportPrice, table_second_installments_origin, table_second_nomalPrice, table_second_discount, table_second_monthPrice, table_second_total_monthlyPrice];
            
            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },
    saveFile: function(filename, path, size, main_idx){
        return new Promise (function(response, reject){ 
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`attached_file`(`file_name`,`file_dir`,`file_size`,`main_idx`) VALUES("'+filename+'","'+path+'","'+size+'","'+main_idx+'")';
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    save_key: function(table, column, key, iv){
        return new Promise (function(response, reject){ 
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`encryption_text`(`target_table`,`target_column`,`en_key`,`en_iv`) VALUES(?,?,?,?)';
            let params = [table, column, key, iv];
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response('OK');
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    }
}