const mysqlConnObj = require('../db');
const mysqlConn = mysqlConnObj.init();
mysqlConnObj.open(mysqlConn);

module.exports = {
    start_transaction: function(){
        return new Promise (function(response, reject){
            mysqlConn.commit((err)=>{
                if(!err){
                    response("OK");
                } else {
                    response(err);
                }
            });
        })
    },
    commit_transaction: function(){
        return new Promise (function(response, reject){
            mysqlConn.commit((err)=>{
                if(!err){
                    response("OK");
                } else {
                    response(err);
                }
            });
        })
    },
    rollback_transaction: function(){
        return new Promise (function(response, reject){
            mysqlConn.rollback((err)=>{
                if(!err){
                    response("OK");
                } else {
                    response(err);
                }
            });
        })
    },

    select_table_get_last_idx: function(table){
        return new Promise (function(response, reject){
            let sql = 'SELECT IFNULL(MAX(idx),0) idx FROM `'+process.env.MYSQL_DATABASE+'`.`'+table+'`';
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response(data[0].idx);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    select_attach_file_chk: function(main_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT COUNT(idx) count FROM `'+process.env.MYSQL_DATABASE+'`.`attached_file` WHERE main_idx=?';
            let params = [main_idx]
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    if(data[0].count>0){
                        response("yes");
                    } else {
                        response("no");
                    }
                } else {
                    console.log("fail?");
                    reject(err);
                }
            })
        })
    },
    select_get_list: function(user_id, contract_date_start, contract_date_end, customer_variation, auto_payment_chk, sales_people_or_store_name){
        return new Promise (function(response, reject){
            let params = [user_id, contract_date_start, contract_date_end];
            let sql = 'SELECT con.idx idx, customer_detail.customer_name customer_name, customer_detail.gender gender, DATE_FORMAT(customer_detail.birth,"%Y-%m-%d") birth, customer_detail.tel tel, DATE_FORMAT(applicant_detail.real_write_contract_date,"%Y-%m-%d") real_write_contract_date, applicant_detail.applicant_name applicant_name, DATE_FORMAT(con.regDate,"%Y-%m-%d") regDate  FROM '+process.env.MYSQL_DATABASE+'.contract con '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.basic_information basic_information ON con.basic_information_idx = basic_information.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.monthly_price monthly_price ON con.monthly_price_idx = monthly_price.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.customer_detail customer_detail ON con.customer_detail_idx = customer_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.payment_detail payment_detail ON con.payment_detail_idx = payment_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.service_detail service_detail ON con.service_detail_idx = service_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.ship_information ship_information ON con.ship_information_idx = ship_information.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.applicant_detail applicant_detail ON con.applicant_detail_idx = applicant_detail.idx '
            sql = sql + 'WHERE con.create_user=? AND con.delFlag=0 AND con.contract_status=1 AND applicant_detail.real_write_contract_date BETWEEN ? AND concat(?," 23:59:59")';
            if(customer_variation != null){
                sql = sql + ' AND basic_information.customer_type = ?';
                params.push(customer_variation);
            }
            if(auto_payment_chk != null){
                sql = sql + ' AND payment_detail.other_people_payment_agree = ?';
                params.push(auto_payment_chk);
            }if(sales_people_or_store_name != null){
                sql = sql + ' AND (applicant_detail.applicant_sales_man_name like concat("%",?,"%") OR applicant_detail.applicant_store like concat("%",?,"%"))';
                params.push(sales_people_or_store_name);
                params.push(sales_people_or_store_name);
            }
            sql = sql + ' ORDER BY con.idx DESC';
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },

    select_get_list_admin: function(contract_date_start, contract_date_end, customer_variation, auto_payment_chk, sales_people_or_store_name){
        return new Promise (function(response, reject){
            let params = [contract_date_start, contract_date_end];
            let sql = 'SELECT con.idx idx, customer_detail.customer_name customer_name, customer_detail.gender gender, DATE_FORMAT(customer_detail.birth,"%Y-%m-%d") birth, customer_detail.tel tel, DATE_FORMAT(applicant_detail.real_write_contract_date,"%Y-%m-%d") real_write_contract_date, applicant_detail.applicant_name applicant_name, DATE_FORMAT(con.regDate,"%Y-%m-%d") regDate, con.delFlag delFlag  FROM '+process.env.MYSQL_DATABASE+'.contract con '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.basic_information basic_information ON con.basic_information_idx = basic_information.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.monthly_price monthly_price ON con.monthly_price_idx = monthly_price.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.customer_detail customer_detail ON con.customer_detail_idx = customer_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.payment_detail payment_detail ON con.payment_detail_idx = payment_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.service_detail service_detail ON con.service_detail_idx = service_detail.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.ship_information ship_information ON con.ship_information_idx = ship_information.idx '
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.applicant_detail applicant_detail ON con.applicant_detail_idx = applicant_detail.idx '
            sql = sql + 'WHERE con.contract_status=1 AND applicant_detail.real_write_contract_date BETWEEN ? AND concat(?," 23:59:59")';
            if(customer_variation != null){
                sql = sql + ' AND c_network.customer_type = ?';
                params.push(customer_variation);
            }
            if(auto_payment_chk != null){
                sql = sql + ' AND payment_detail.auto_payment = ?';
                params.push(auto_payment_chk);
            }if(sales_people_or_store_name != null){
                sql = sql + ' AND (other_information.main_manager like concat("%",?,"%") OR other_information.contract_store like concat("%",?,"%")) ';
                params.push(sales_people_or_store_name);
                params.push(sales_people_or_store_name);
            }
            sql = sql + ' ORDER BY con.idx DESC';

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    }, 
    
    select_get_contract_all_idx: function(idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, create_user, modify_user, regDate, modDate, contract_status, delFlag ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.contract WHERE idx=?';
            let params = [idx];

            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response(data[0]);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_basic_information_detail: function(basic_information_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT contract_type, open_tel_type, customer_type, agreement_period FROM '+process.env.MYSQL_DATABASE+'.basic_information WHERE delFlag=0 AND idx= ?';
            let params = [basic_information_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    /*
    select_terminal_purchase_detail: function(terminal_purchase_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT installments, FORMAT(initial_price, 0) initial_price, FORMAT(discount_support, 0) discount_support, FORMAT(discount_cash_price, 0) discount_cash_price, FORMAT(installments_origin, 0) installments_origin, FORMAT(unpair_price, 0) unpair_price FROM '+process.env.MYSQL_DATABASE+'.terminal_purchase WHERE delFlag=0 AND idx= ?';
            let params = [terminal_purchase_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },
    
    select_c_line_usePrice_detail: function(c_line_usePrice_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT FORMAT(line_price, 0) line_price, use_type, FORMAT(nomal_price, 0) nomal_price, discount_type, FORMAT(discount, 0) discount, FORMAT(monthly_price, 0) monthly_price, contract_period FROM '+process.env.MYSQL_DATABASE+'.c_line_useprice WHERE delFlag=0 AND idx= ?';
            let params = [c_line_usePrice_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },
    */
    select_monthly_price_detail: function(monthly_price_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT FORMAT(start_price, 0) start_price, FORMAT(support_price, 0) support_price, FORMAT(installments_origin, 0) installments_origin, FORMAT(installments_period, 0) installments_period, FORMAT(monthly_installments, 0) monthly_installments, FORMAT(installments_commission, 0) installments_commission, FORMAT(monthly_price, 0) monthly_price, FORMAT(monthly_discount, 0) monthly_discount, FORMAT(monthly_payments, 0) monthly_payments, FORMAT(total_monthly_price, 0) total_monthly_price FROM '+process.env.MYSQL_DATABASE+'.monthly_price WHERE delFlag=0 AND idx= ?';
            let params = [monthly_price_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_customer_detail_detail: function(customer_detail_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT customer_name, tel, DATE_FORMAT(birth,'%Y-%m-%d') birth, gender, coperation_num, bill_type, email, address FROM "+process.env.MYSQL_DATABASE+".customer_detail WHERE delFlag=0 AND idx= ?";
            let params = [customer_detail_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_payment_detail_detail: function(payment_detail_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT payer_name, payer_relation, other_people_payment_agree, consenter, payer_birth, payments_method, finance_name, wallet_num, customer_agree FROM "+process.env.MYSQL_DATABASE+".payment_detail WHERE delFlag=0 AND idx= ?";
            let params = [payment_detail_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_service_detail_detail: function(service_detail_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT terminal_model_name, line_cnt, terminal_no_or_IMEI, FORMAT(usim_price, 0) usim_price, usim_model_name, usim_no, join_fee_type, extra_service FROM "+process.env.MYSQL_DATABASE+".service_detail WHERE delFlag=0 AND idx= ?";
            let params = [service_detail_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_ship_information_detail: function(ship_information_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT ship_name, ship_no, total_weight, port_of_shipment, ship_type, ship_navigation_area FROM "+process.env.MYSQL_DATABASE+".ship_information WHERE delFlag=0 AND idx= ?";
            let params = [ship_information_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_applicant_detail_detail: function(applicant_detail_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT applicant_store, applicant_sales_man_name, applicant_store_call_number, DATE_FORMAT(real_write_contract_date, '%Y-%m-%d') real_write_contract_date, applicant_name FROM "+process.env.MYSQL_DATABASE+".applicant_detail WHERE delFlag=0 AND idx= ?";
            let params = [applicant_detail_idx];

            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_attached_file_detail: function(main_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT idx, file_name, file_dir, ROUND((file_size/1000000), 1) file_size FROM "+process.env.MYSQL_DATABASE+".attached_file WHERE delFlag=0 AND main_idx= ?";
            let params = [main_idx];
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_before_attached_file_detail: function(idx_list){
        return new Promise (function(response, reject){
            let params = [];
            let sql = "SELECT idx, file_name, file_dir, ROUND((file_size/1000000), 1) file_size FROM "+process.env.MYSQL_DATABASE+".attached_file WHERE idx=";
            let idx_list_split = idx_list.split(",");
            for(var i=0; i<idx_list_split.length; i++){
                sql = sql + "? OR idx=";
                params.push(idx_list_split[i]);
            }
            sql = sql.substring(0, sql.length-7);
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_attach_file_download_chk: function(file_name){
        return new Promise (function(response, reject){
            let sql = "SELECT ct.create_user create_user FROM SERVICE_LTE.contract ct LEFT JOIN SERVICE_LTE.attached_file af ON ct.idx=af.main_idx WHERE af.file_name=?";
            let params = [file_name];

            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data[0].create_user);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },

    select_check_user_id: function(user_id){
        return new Promise (function(response, reject){
            let sql = "SELECT COUNT(idx) count FROM "+process.env.MYSQL_DATABASE+".user_info WHERE user_id= ?";
            let params = [user_id];
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_login_chk: function(user_id){
        return new Promise (function(response, reject){
            let sql = "SELECT ui.idx idx, ui.user_id user_id, ui.user_pw user_pw, ui.user_rank user_rank, upk.user_key user_key FROM "+process.env.MYSQL_DATABASE+".user_info ui LEFT JOIN "+process.env.MYSQL_DATABASE+".user_pw_key upk ON ui.idx=upk.user_idx WHERE ui.user_id = ? AND user_status=1";
            let params = [user_id];
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_get_before_contract_list: function(main_idx){
        return new Promise (function(response, reject){
            let sql = "SELECT idx, DATE_FORMAT(origin_modDate,'%Y-%m-%d') origin_modDate, IF(modify_user IS NULL, create_user, modify_user) modify_user FROM "+process.env.MYSQL_DATABASE+".contract_before_log WHERE origin_idx=? ORDER BY idx DESC";
            let params = [main_idx];
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_get_before_contract_all_idx: function(before_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT idx, auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, attached_file_idx_list, create_user, IF(modify_user IS NULL, create_user, modify_user) modify_user, regDate, DATE_FORMAT(origin_modDate, "%Y-%m-%d %H:%i") origin_modDate, contract_status ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.contract_before_log WHERE idx=?';
            let params = [before_idx];

            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response(data[0]);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_get_user_list: function(){
        return new Promise (function(response, reject){
            let sql = 'SELECT idx, user_id, user_name, user_position, user_rank, DATE_FORMAT(regDate, "%Y-%m-%d") regDate, 0 btn_pw, user_status ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.user_info';

            mysqlConn.query(sql, function(err,data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    },

    select_get_encryption_key: function(table_name, column_name){
        return new Promise (function(response, reject){
            let sql = 'SELECT target_table, target_column, en_key, en_iv ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.encryption_text WHERE delFlag=0 AND target_table=? AND target_column=?';
            params = [table_name, column_name];

            mysqlConn.query(sql, params, function(err,data){
                if(!err){
                    response(data[0]);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        });
    }, 

    select_get_customer_type_chart: function(){
        return new Promise (function(response, reject){
            let sql = 'SELECT basic_information.customer_type customer_type, COUNT(basic_information.customer_type) type_count FROM '+process.env.MYSQL_DATABASE+'.contract con ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.basic_information basic_information ON con.basic_information_idx = basic_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.monthly_price monthly_price ON con.monthly_price_idx = monthly_price.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.customer_detail customer_detail ON con.customer_detail_idx = customer_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.payment_detail payment_detail ON con.payment_detail_idx = payment_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.service_detail service_detail ON con.service_detail_idx = service_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.ship_information ship_information ON con.ship_information_idx = ship_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.applicant_detail applicant_detail ON con.applicant_detail_idx = applicant_detail.idx ';
            sql = sql + 'GROUP BY basic_information.customer_type ';
            
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response(JSON.stringify(data));
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    }, 

    select_get_service_type_chart: function(){
        return new Promise (function(response, reject){
            let sql = 'SELECT service_detail.join_fee_type service_name, COUNT(service_detail.join_fee_type) service_cnt FROM '+process.env.MYSQL_DATABASE+'.contract con ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.basic_information basic_information ON con.basic_information_idx = basic_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.monthly_price monthly_price ON con.monthly_price_idx = monthly_price.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.customer_detail customer_detail ON con.customer_detail_idx = customer_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.payment_detail payment_detail ON con.payment_detail_idx = payment_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.service_detail service_detail ON con.service_detail_idx = service_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.ship_information ship_information ON con.ship_information_idx = ship_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.applicant_detail applicant_detail ON con.applicant_detail_idx = applicant_detail.idx ';
            sql = sql + 'WHERE con.contract_status=1 AND con.delFlag=0 AND service_detail.join_fee_type IS NOT NULL '
            sql = sql + 'GROUP BY service_detail.join_fee_type ';
            
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response(JSON.stringify(data));
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    }, 

    select_monthly_contract_chart: function(){
        return new Promise (function(response, reject){
            let sql = 'SELECT DATE_FORMAT(applicant_detail.real_write_contract_date, "%Y-%m") con_date, count(DATE_FORMAT(applicant_detail.real_write_contract_date, "%Y-%m")) con_cnt FROM '+process.env.MYSQL_DATABASE+'.contract con ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.basic_information basic_information ON con.basic_information_idx = basic_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.monthly_price monthly_price ON con.monthly_price_idx = monthly_price.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.customer_detail customer_detail ON con.customer_detail_idx = customer_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.payment_detail payment_detail ON con.payment_detail_idx = payment_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.service_detail service_detail ON con.service_detail_idx = service_detail.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.ship_information ship_information ON con.ship_information_idx = ship_information.idx ';
            sql = sql + 'LEFT JOIN '+process.env.MYSQL_DATABASE+'.applicant_detail applicant_detail ON con.applicant_detail_idx = applicant_detail.idx ';
            sql = sql + 'WHERE DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -6 MONTH), "%Y-%m-01") < applicant_detail.real_write_contract_date AND con.contract_status=1 AND con.delFlag=0 ';
            sql = sql + 'GROUP BY DATE_FORMAT(applicant_detail.real_write_contract_date, "%Y-%m") ';
            sql = sql + 'ORDER BY DATE_FORMAT(applicant_detail.real_write_contract_date, "%Y-%m") ASC';
            
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response(JSON.stringify(data));
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    }, 

    select_auto_complete_list: function(){
        return new Promise (function(response, reject){
            let sql = 'SELECT idx, list_name, join_service_variation, agreement_period, table_second_startPrice, table_second_supportPrice, table_second_installments_origin, table_second_monthly_installments, table_second_monthlyPrice, table_second_monthlyDiscount, table_second_monthlyPayments, table_second_total_monthlyPrice ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.auto_complete_list WHERE delFlag=0';
            
            mysqlConn.query(sql, function(err, data){
                if(!err){
                    response(JSON.stringify(data));
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    },

    select_auto_complete_value: function(auto_complete_list_idx){
        return new Promise (function(response, reject){
            let sql = 'SELECT idx, list_name, join_service_variation, agreement_period, table_second_startPrice, table_second_supportPrice, table_second_installments_origin, table_second_monthly_installments, table_second_monthlyPrice, table_second_monthlyDiscount, table_second_monthlyPayments, table_second_total_monthlyPrice ';
            sql = sql + 'FROM '+process.env.MYSQL_DATABASE+'.auto_complete_list WHERE delFlag=0 AND idx=?';

            params = [auto_complete_list_idx];
            
            mysqlConn.query(sql, params, function(err, data){
                if(!err){
                    response(data);
                } else {
                    console.log("fail?");
                    reject(err);
                }
            });
        })
    }


}