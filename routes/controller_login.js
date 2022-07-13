const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const crypto = require('crypto');
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

module.exports = {
    login : async function(req, res){
        let result = "";
        let post = req.body;
        let salt = "";
        let encording_variable = 'sha512';
        let crypto_pw ="";

        let cipher = crypto.createHash(encording_variable);
        let getHash = cipher.update(post.login_pw).digest('base64');

        const createHashedPassword = (plainPassword) =>
            new Promise(async (resolve, reject) => {
                crypto.pbkdf2(plainPassword, salt, 9999, 64, encording_variable, (err, key) => {
                    if (err) reject(err);
                    resolve(key);
                });
            });
        try {
            let db_user_data = await mysql_select_query.select_login_chk(post.login_id);
            if(db_user_data.length == 0){
                res.send("등록되지 않았거나 사용할 수 없는 아이디입니다.");
                return;
            } else {
                salt = db_user_data[0].user_key;
    
                crypto_pw = await createHashedPassword(getHash);
    
                if(db_user_data[0].user_pw == crypto_pw.toString()){
                    req.session.user_id = post.login_id;
                    req.session.user_rank = db_user_data[0].user_rank;
                    res.redirect(server_url+"/lte_contract_list");
                } else {
                    res.redirect(server_url+"/form_login");
                }
            }

        } catch(err) {
            res.render("login/login", {result: result, server_url: server_url, page_name: 'login'});
            res.send(result);
        }
    },

    logout: async function(req, res){
        if(req.session.user_id){
            await req.session.destroy(function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect(server_url+"/lte_contract_list");
                }
            });
        }
    },

    form_login: async function(req, res){
        let result = "";
        res.render("login/login", {result: result, server_url: server_url, page_name: 'form_login'});
    },

    change_password: async function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let post = req.body;

        let user_id = req.session.user_id;
        let user_now_pw = post.user_now_pw;
        let user_new_pw = post.user_new_pw;

        let cipher = crypto.createHash('sha512');
        let getHash = cipher.update(user_now_pw).digest('base64');
        cipher = crypto.createHash('sha512');
        let getHash_new = cipher.update(user_new_pw).digest('base64');
        let salt = "";

        const createSalt = () => 
            new Promise((resolve, reject) => {
                crypto.randomBytes(64, (err, buf) => {
                    if (err) reject(err);
                    resolve(buf.toString('base64'));
                });
            });

        const createHashedPassword = (plainPassword, salt) =>
            new Promise(async (resolve, reject) => {
                crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                    if (err) reject(err);
                    resolve(key);
                });
            });

        try {
            let db_user_data = await mysql_select_query.select_login_chk(user_id);
            salt = db_user_data[0].user_key;

            let = crypto_pw = await createHashedPassword(getHash, salt);

            if(db_user_data[0].user_pw == crypto_pw.toString()){
                await mysql_select_query.start_transaction();
                
                let salt_new = await createSalt();
                let crypto_pw_new = await createHashedPassword(getHash_new, salt_new);
                
                let user_idx = db_user_data[0].idx;
                await mysql_updel_query.update_user_pw(user_idx, crypto_pw_new.toString());
    
                await mysql_updel_query.update_user_pw_salt(user_idx, salt_new, 'sha512');
    
                await mysql_select_query.commit_transaction();
                
                if(req.session.user_id){
                    await req.session.destroy(function(err){
                        if(err){
                            console.log(err);
                        } else {
                            res.redirect(server_url+"/lte_contract_list");
                        }
                    });
                } else {
                    res.redirect(server_url+"/login");
                }
            } else {
                await mysql_select_query.rollback_transaction();
            }

        } catch(err) {
            await mysql_select_query.rollback_transaction();
            
            console.log(err);

        }

    },

    form_change_password: function(req, res){
        // login_chk
        let login_chk = permission_chk.login_check(req);
        if(login_chk != true){
            res.redirect(server_url+login_chk);
            return;
        }

        let result = "";
        res.render("login/form_change_password", {result: result, server_url: server_url, page_name: 'form_change_password', user_id: req.session.user_id, user_rank: req.session.user_rank})
    }
}