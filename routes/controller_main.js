const mysql_insert_query = require("../models/mysql_insert_query.js");
const mysql_select_query = require("../models/mysql_select_query.js");
const mysql_updel_query = require("../models/mysql_updel_query.js");
const permission_chk = require("../models/permission_chk.js");
require('dotenv').config();
const server_url = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

module.exports = {
    main : async function(req, res){
        res.redirect(server_url+"/lte_contract_list");
    },
    curl_test : async function(req, res){
        let result;
        let request = require("request");
        request.get(
            { headers: {'content-type' : 'application/json', 'X-Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGphbmdAYW10ZWwuY28ua3IiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjRkZmRiOWEwLWY3NzktMTFlYy1hOGQxLTNmNDlkZjUwOGM2YiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiIyOWQ0ZTRlMC01NzI0LTExZWMtYjNlYi1lNzVkNmExZDU2ZmEiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTcxODM4OTEsImV4cCI6MTY1NzE5Mjg5MX0.J9-S3sgBnIm-BPtJZozHJ9WmfVDuw86I4brnpcrPclFDZnKO7mh1U3b8x9vf7butxa7sVe_gAgUjmjlHwdI57g'}
               , url: 'http://localhost:3000/api/test_api'}
               , function(error, response, body){
                    res.render("curl", {result: body});
            }
        );
    },
    insert_form_test: async function(req, res){
        res.render("contract/contract_test", {server_url: server_url, user_id: req.session.user_id, user_rank: req.session.user_rank});
    }
}