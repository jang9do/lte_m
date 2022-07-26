const mysqlConnObj = require('../db');
const mysqlConn = mysqlConnObj.init();
mysqlConnObj.open(mysqlConn);

module.exports = {
    update_contract_main: function(auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, create_user_id, modify_user_id, main_idx){
        return new Promise (function(response, reject){
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`contract` SET `auto_complete_list_idx`=?, `basic_information_idx`=?, `monthly_price_idx`=?, `customer_detail_idx`=?, `payment_detail_idx`=?, `service_detail_idx`=?, `ship_information_idx`=?, `applicant_detail_idx`=?, `attached_file_flag`=?, `create_user`=?, `modify_user`=?, `modDate`=NOW() ';
            sql = sql + 'WHERE idx=?';
            let params = [auto_complete_list_idx, basic_information_idx, monthly_price_idx, customer_detail_idx, payment_detail_idx, service_detail_idx, ship_information_idx, applicant_detail_idx, attached_file_flag, create_user_id, modify_user_id, main_idx];
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
    lte_contract_tables_deleteRows: function(table_name, idx, main_idx){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`'+table_name+'` SET delFlag=1, modDate=NOW() ';
            let params = [];
            if(main_idx != 0){
                sql = sql + 'WHERE main_idx=?';
                params = [main_idx];
            } else {
                sql = sql + 'WHERE idx=?';
                params = [idx];
            }
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

    delete_lte_contract: function(main_idx){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`contract` SET delFlag=1, delDate=NOW() WHERE idx=?';
            let params = [main_idx];
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

    recovery_lte_contract: function(main_idx){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`contract` SET delFlag=0, delDate=NOW() WHERE idx=?';
            let params = [main_idx];
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

    user_status_setting: function(user_idx, user_status){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`user_info` SET user_status=?, modDate=NOW() WHERE idx=?';
            let params = [user_status, user_idx];
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

    update_user_pw: function(user_idx, crypto_pw_new){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`user_info` SET user_pw=?, modDate=NOW() WHERE idx=?';
            let params = [crypto_pw_new, user_idx];
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

    update_user_pw_salt: function(user_idx, salt_new, encording_valiable){
        return new Promise (function(response, reject){ 
            let sql = 'UPDATE `'+process.env.MYSQL_DATABASE+'`.`user_pw_key` SET user_key=?, encording_valiable=?, modDate=NOW() WHERE user_idx=?';
            let params = [salt_new, encording_valiable, user_idx];
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