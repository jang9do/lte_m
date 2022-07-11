const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller_admin = require("./controller_admin");
const controller_manager = require("./controller_manager");
const controller_api = require("./controller_api");
const controller_contract = require("./controller_contract");
const controller_login = require("./controller_login");
const controller_main = require("./controller_main");

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, './files/')
    },
    filename:  (req, file, cb) => {
      cb(null, Date.now() + '_' + Math.random().toString(36).slice(2) + '.' + file.originalname.split('.').reverse()[0])// 파일 원본이름 저장
    }
  })
const storage_excel = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, './excel/')
    },
    filename:  (req, file, cb) => {
      cb(null, Date.now() + '_' + Math.random().toString(36).slice(2) + '.' + file.originalname.split('.').reverse()[0])// 파일 원본이름 저장
    }
  })
const upload = multer({ storage: storage });
const upload_excel = multer({ storage: storage_excel });

//contract_get
router.get("/insert_lte_contract", controller_contract.insert_lte_contract);
router.get("/form_insert_lte_contract", controller_contract.form_insert_lte_contract);
router.get("/lte_contract_list", controller_contract.lte_contract_list);
router.get("/form_show_lte_contract", controller_contract.form_show_lte_contract);
router.get("/form_modify_lte_contract", controller_contract.form_modify_lte_contract);
router.get("/delete_lte_contract", controller_contract.delete_lte_contract);
router.get("/recovery_lte_contract", controller_contract.recovery_lte_contract);
router.get("/form_show_before_lte_contract", controller_contract.form_show_before_lte_contract);
//contract_post
router.post("/insert_lte_contract", controller_contract.insert_lte_contract);
router.post("/update_lte_contract", controller_contract.update_lte_contract);

//api_get
router.get("/get_lte_contract_json_list", controller_api.get_lte_contract_json_list);
router.get("/get_lte_contract_json_list_manager", controller_api.get_lte_contract_json_list_mamager);
router.get("/get_user_json_list_admin", controller_api.get_user_json_list_admin);
router.get("/get_customer_type_chart_json_manager", controller_api.get_customer_type_chart_json_manager);
router.get("/get_service_type_chart_json_manager", controller_api.get_service_type_chart_json_manager);
router.get("/get_monthly_contract_chart_json_manager", controller_api.get_monthly_contract_chart_json_manager);
router.get("/download_file", controller_api.download_file);
router.get("/download_contract_attach_file", controller_api.download_contract_attach_file);
router.get("/get_auto_complete_list_json", controller_api.get_auto_complete_list_json);
//api_post
router.post("/file_upload", upload.array('contract_copy_file'), controller_api.file_upload);
router.post("/file_upload_update", upload.array('contract_copy_file'), controller_api.file_upload_update);
router.post("/file_upload_update", upload.array('contract_copy_file'), controller_api.file_upload_update);
router.post("/excel_json", upload_excel.array('excel_file'), controller_api.excel_json);

//login_get
router.get("/form_login", controller_login.form_login);
router.get("/logout", controller_login.logout);
router.get("/form_change_password", controller_login.form_change_password);
router.post("/login", controller_login.login);
router.post("/change_password", controller_login.change_password);

//admin_get
router.get("/form_input_user_admin", controller_admin.form_input_user_admin);
router.get("/user_list_admin", controller_admin.user_list_admin);
router.get("/user_status_change", controller_admin.user_status_change);
router.get("/create_key", controller_admin.create_key);
router.get("/user_password_reset", controller_admin.user_password_reset);
//admin_post
router.post("/input_user", controller_admin.input_user);

//manager_get
router.get("/lte_contract_list_manager", controller_manager.lte_contract_list_manager);
router.get("/form_insert_auto_complete_list", controller_manager.form_insert_auto_complete_list);
router.post("/insert_auto_complete_list", controller_manager.insert_auto_complete_list);
router.get("/chart_check", controller_manager.chart_check);


//main_get
router.get("/", controller_main.main);
router.get("/main", controller_main.main);
router.get("/curl_test", controller_main.curl_test);

module.exports = router;