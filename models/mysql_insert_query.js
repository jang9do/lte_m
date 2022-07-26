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
    insert_contract_main: function(auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, user_id){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`contract`(`auto_complete_list_idx`,`basic_information_idx`,`monthly_price_idx`,`customer_detail_idx`,`payment_detail_idx`,`service_detail_idx`,`ship_information_idx`,`applicant_detail_idx`,`attached_file_flag`,`create_user`) ';
            sql = sql + 'VALUES(?, ?, ?, ? ,? ,? ,? ,? ,?, ?)';
            let params = [auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, user_id];
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
    insert_contract_log_main: function(origin_idx, auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, attached_file_idx_list, create_user_id, modify_user, origin_modDate){
        return new Promise (function(response, reject){
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`contract_before_log`(`origin_idx`,`auto_complete_list_idx`,`basic_information_idx`,`monthly_price_idx`,`customer_detail_idx`,`payment_detail_idx`,`service_detail_idx`,`ship_information_idx`,`applicant_detail_idx`,`attached_file_flag`,`attached_file_idx_list`,`create_user`,`modify_user`,`origin_modDate`) ';
            sql = sql + 'VALUES(? ,? ,? ,? ,? ,? ,? ,? ,?, ?, ?, ?, ?, ?)';
            let params = [origin_idx, auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, attached_file_idx_list, create_user_id, modify_user, origin_modDate];
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
    insert_contract_basic_information: function(contract_type, open_tel_type, customer_type, agreement_period, main_idx){
        return new Promise (function(response, reject){
            let contract_type_value = (contract_type=="" ? null:contract_type);
            let open_tel_type_value = (open_tel_type=="" ? null:open_tel_type);
            let customer_type_value = (customer_type=="" ? null:customer_type);
            let agreement_period_value = (agreement_period=="" ? null:agreement_period);
            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`basic_information`(`contract_type`,`open_tel_type`,`customer_type`,`agreement_period`,`main_idx`) VALUES(?, ?, ?, ?, ?)';
            let params = [contract_type_value, open_tel_type_value, customer_type_value, agreement_period_value, main_idx];

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

    /*
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
    */
    insert_contract_monthly_price: function(start_price, support_price, installments_origin, installments_period, monthly_installments, installments_commission, monthly_price, monthly_discount, monthly_payments, total_monthly_price, main_idx){
        return new Promise (function(response, reject){
            let start_price_value = (start_price=="" ? null:start_price);
            let support_price_value = (support_price=="" ? null:support_price);
            let installments_origin_value = (installments_origin=="" ? null:installments_origin);
            let installments_period_value = (installments_period=="" ? null:installments_period);
            let monthly_installments_value = (monthly_installments=="" ? null:monthly_installments);
            let installments_commission_value = (installments_commission=="" ? null:installments_commission);
            let monthly_price_value = (monthly_price=="" ? null:monthly_price);
            let monthly_discount_value = (monthly_discount=="" ? null:monthly_discount);
            let monthly_payments_value = (monthly_payments=="" ? null:monthly_payments);
            let total_monthly_price_value = (total_monthly_price=="" ? null:total_monthly_price);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`monthly_price`(`start_price`,`support_price`,`installments_origin`,`installments_period`,`monthly_installments`,`installments_commission`,`monthly_price`,`monthly_discount`,`monthly_payments`,`total_monthly_price`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params = [start_price_value, support_price_value, installments_origin_value, installments_period_value, monthly_installments_value, installments_commission_value, monthly_price_value, monthly_discount_value, monthly_payments_value, total_monthly_price_value, main_idx];
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
    insert_contract_customer_detail: function(customer_name, tel, birth, gender, coperation_num, bill_type, email, address, main_idx){
        return new Promise (function(response, reject){
            let customer_name_value = (customer_name=="" ? null:customer_name);
            let tel_value = (tel=="" ? null:tel);
            let birth_value = (birth=="" ? null:birth);
            let gender_value = (gender=="" ? null:gender);
            let coperation_num_value = (coperation_num=="" ? null:coperation_num);
            let bill_type_value = (bill_type=="" ? null:bill_type);
            let email_value = (email=="" ? null:email);
            let address_value = (address=="" ? null:address);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`customer_detail`(`customer_name`,`tel`,`birth`,`gender`,`coperation_num`,`bill_type`,`email`,`address`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params = [customer_name_value, tel_value, birth_value, gender_value, coperation_num_value, bill_type_value, email_value, address_value, main_idx];
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
    insert_contract_payment_detail: function(payer_name, payer_relation, other_people_payment_agree, consenter, payer_birth, payments_method, finance_name, wallet_num, customer_agree, main_idx){
        return new Promise (function(response, reject){
            let payer_name_value = (payer_name==null ? "no":payer_name);
            let payer_relation_value = (payer_relation==null ? "no":payer_relation);
            let other_people_payment_agree_value = (other_people_payment_agree==null ? "no":other_people_payment_agree);
            let consenter_value = (consenter==null ? "no":consenter);
            let payer_birth_value = (payer_birth==null ? "no":payer_birth);
            let payments_method_value = (payments_method==null ? "no":payments_method);
            let finance_name_value = (finance_name==null ? "no":finance_name);
            let wallet_num_value = (wallet_num==null ? "no":wallet_num);
            let customer_agree_value = (customer_agree==null ? "no":customer_agree);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`payment_detail`(`payer_name`,`payer_relation`,`other_people_payment_agree`,`consenter`,`payer_birth`,`payments_method`,`finance_name`,`wallet_num`,`customer_agree`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params = [payer_name_value, payer_relation_value, other_people_payment_agree_value, consenter_value, payer_birth_value, payments_method_value, finance_name_value, wallet_num_value, customer_agree_value, main_idx];

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
    insert_contract_service_detail: function(terminal_model_name, line_cnt, terminal_no_or_IMEI, usim_price, usim_model_name, usim_no, join_fee_type, extra_service, main_idx){
        return new Promise (function(response, reject){
            let terminal_model_name_value = (terminal_model_name=="" ? null:terminal_model_name);
            let line_cnt_value = (line_cnt=="" ? null:line_cnt);
            let terminal_no_or_IMEI_value = (terminal_no_or_IMEI=="" ? null:terminal_no_or_IMEI);
            let usim_price_value = (usim_price=="" ? null:usim_price);
            let usim_model_name_value = (usim_model_name=="" ? null:usim_model_name);
            let usim_no_value = (usim_no=="" ? null:usim_no);
            let join_fee_type_value = (join_fee_type=="" ? null:join_fee_type);
            let extra_service_value = (extra_service=="" ? null:extra_service);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`service_detail`(`terminal_model_name`,`line_cnt`,`terminal_no_or_IMEI`,`usim_price`,`usim_model_name`,`usim_no`,`join_fee_type`,`extra_service`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params = [terminal_model_name_value, line_cnt_value, terminal_no_or_IMEI_value, usim_price_value, usim_model_name_value, usim_no_value, join_fee_type_value, extra_service_value, main_idx];
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
    insert_contract_ship_information: function(ship_name, ship_no, total_weight, port_of_shipment, ship_type, ship_navigation_area, main_idx){
        return new Promise (function(response, reject){
            let ship_name_value = (ship_name=="" ? null:ship_name);
            let ship_no_value = (ship_no=="" ? null:ship_no);
            let total_weight_value = (total_weight=="" ? null:total_weight);
            let port_of_shipment_value = (port_of_shipment=="" ? null:port_of_shipment);
            let ship_type_value = (ship_type=="" ? null:ship_type);
            let ship_navigation_area_value = (ship_navigation_area=="" ? null:ship_navigation_area);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`ship_information`(`ship_name`,`ship_no`,`total_weight`,`port_of_shipment`,`ship_type`,`ship_navigation_area`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?, ?)';
            let params = [ship_name_value, ship_no_value, total_weight_value, port_of_shipment_value, ship_type_value, ship_navigation_area_value, main_idx];
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
    insert_contract_applicant_detail: function(applicant_store, applicant_sales_man_name, applicant_store_call_number, real_write_contract_date, applicant_name, main_idx){
        return new Promise (function(response, reject){
            let applicant_store_value = (applicant_store=="" ? null:applicant_store);
            let applicant_sales_man_name_value = (applicant_sales_man_name=="" ? null:applicant_sales_man_name);
            let applicant_store_call_number_value = (applicant_store_call_number=="" ? null:applicant_store_call_number);
            let real_write_contract_date_value = (real_write_contract_date=="" ? null:real_write_contract_date);
            let applicant_name_value = (applicant_name=="" ? null:applicant_name);

            let sql = 'INSERT INTO `'+process.env.MYSQL_DATABASE+'`.`applicant_detail`(`applicant_store`,`applicant_sales_man_name`,`applicant_store_call_number`,`real_write_contract_date`,`applicant_name`,`main_idx`) ';
            sql = sql + 'VALUES(?, ?, ?, ?, ?, ?)';
            let params = [applicant_store_value, applicant_sales_man_name_value, applicant_store_call_number_value, real_write_contract_date_value, applicant_name_value, main_idx];
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