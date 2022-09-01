$(document).ready(function(){
    $("#signup-form").validate({
        rules:{
            fname:{
                required:true,
                minlength:4,
                maxlength:6
            },
            sname:{
                required:true,
                minlength:4,
                maxlength:6
            },
        
            password:{
                required:true,
                minlength:6
            },
            day:{
                required:true
            },
            month:{
                required:true
            },
            year:{
                required:true
            },
            sex:{
                required:true
            }
        },
        messages:{
            fname:{
                required:"Enter first name",
                minlength:"Enter atleast 4 characters",
                maxlength:"Maximum 6 characters"
            },
            sname:{
                required:"Enter first name",
                minlength:"Enter atleast 4 characters",
                maxlength:"Maximum 6 characters"
            },
        
            password:{
                required:"please enter password",
                minlength:"password must be atleast 6 characters"
            },
            day:{
                required:"please enter the day"
            },
            month:{
                required:"please enter your month"
            },
            year:{
                required:"please enter your year"
            },
            sex:{
                required:"please select your gender"
            }
        }
    })
})