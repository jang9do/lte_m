const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const crypto = require('crypto');
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
    form_input_user_admin: async function(req, res){
        let result = "";
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

        res.render("admin/input_user", {result: result, server_url: server_url, page_name: 'form_input_user_admin', user_id: req.session.user_id, user_rank: req.session.user_rank});
    },
    input_user : async function(req, res){
        let result = "";
        let post = req.body;
        let salt = "";
        let encording_variable = 'sha512';
        let crypto_pw ="";

        let cipher = crypto.createHash(encording_variable);
        let getHash = cipher.update(post.user_pw).digest('base64');

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

        const createSalt = () => 
            new Promise((resolve, reject) => {
                crypto.randomBytes(64, (err, buf) => {
                    if (err) reject(err);
                    resolve(buf.toString('base64'));
                });
            });

        const createHashedPassword = (plainPassword) =>
            new Promise(async (resolve, reject) => {
                salt = await createSalt(); // 소금 만들어서 대입
                crypto.pbkdf2(plainPassword, salt, 9999, 64, encording_variable, (err, key) => {
                    if (err) reject(err);
                    resolve(key);
                });
            });
        
        try {
            let id_chk = await mysql_select_query.select_check_user_id(post.user_id);
            console.log(id_chk);
            if(id_chk[0].count>0){
                res.send("중복 ID");
            } else {
                await mysql_select_query.start_transaction();
                console.log(getHash);
                crypto_pw = await createHashedPassword(getHash);
                console.log(crypto_pw);
        
                await mysql_insert_query.insert_input_user(post.user_id, crypto_pw.toString(), post.user_name, post.user_position);
                let user_idx = (await mysql_select_query.select_table_get_last_idx('user_info'));
    
                await mysql_insert_query.insert_input_user_salt(user_idx, salt, 'sha512');
                res.redirect(server_url+"/main");
    
                await mysql_select_query.commit_transaction();
            }
        } catch(err) {
            await mysql_select_query.rollback_transaction();
            result = err+"<br>등록 실패!";
            res.send(result);
        }
    },
    user_list_admin: async function(req, res){
        let result = "";

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

        res.render('admin/user_list',{result: result, server_url: server_url, page_name: 'user_list_admin', user_id: req.session.user_id, user_rank: req.session.user_rank});
    },
    user_status_change: async function(req, res){
        let user_status = req.query.user_status;
        let user_idx = req.query.user_idx;

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

        console.log(user_idx + " " + user_status);
        try{
            await mysql_select_query.start_transaction();

            await mysql_updel_query.user_status_setting(user_idx,user_status);

            await mysql_select_query.commit_transaction();
            res.redirect(server_url+"/user_list_admin");
        } catch(err){
            console.log(err);
            res.redirect(server_url+"/user_list_admin");
        }
    },
    create_key: async function(req,res){
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
        const createSalt = () => 
            new Promise((resolve, reject) => {
                crypto.randomBytes(64, (err, buf) => {
                    if (err) reject(err);
                    resolve(buf.toString('base64'));
                });
            });
        let key = crypto.randomBytes(32).toString('hex').substring(0,32);
        let iv = crypto.randomBytes(16).toString('hex').substring(0,16);
        console.log("key : "+key.toString());
        let list = await mysql_insert_query.save_key("payment_detail","wallet_num",key,iv);
        
        let result = await cipher("1234", key, iv);
        let password = await decipher(result,key,iv);
        
        res.send(key.toString('hex')+"<br>"+iv);
    },

    user_password_reset: async function(req,res){
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

        let get = req.query;
        let change_user_id = get.change_user_id;

        let cipher = crypto.createHash('sha512');
        let getHash = cipher.update("amtelecom!").digest('base64');

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
            let db_user_data = await mysql_select_query.select_login_chk(change_user_id);

            let salt = await createSalt();
            let crypto_pw = await createHashedPassword(getHash, salt);

            await mysql_select_query.start_transaction();

            let user_idx = db_user_data[0].idx;
            await mysql_updel_query.update_user_pw(user_idx, crypto_pw.toString());
            await mysql_updel_query.update_user_pw_salt(user_idx, salt, 'sha512');

            await mysql_select_query.commit_transaction();
            res.redirect(server_url+"/user_list_admin");
        } catch(err) {
            await mysql_select_query.rollback_transaction();
            console.log(err);
        }

    }
}