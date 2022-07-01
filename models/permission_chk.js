module.exports = {
    login_check: function(req){
        if(req.session.user_id=="" || req.session.user_id==null){
            return "/form_login";
        } else {
            return true;
        }
    },
    
    admin_check: function(req){
        if(req.session.user_rank=="" || req.session.user_rank==null || req.session.user_rank!=1){
            return false;
        } else {
            return true;
        }
    },

    manager_check: function(req){
        if(req.session.user_rank=="" || req.session.user_rank==null || (req.session.user_rank!=2 && req.session.user_rank!=1)){
            return false;
        } else {
            return true;
        }
    }
}