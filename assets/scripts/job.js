// smooth scroll

var navbarHeight = $(".navbar").outerHeight();
$(".navbar-menu a").click(function(e){
    var targetHref = $(this).attr("href");
    $("html,body").animate({
        scrollTop:$(targetHref).offset().top - navbarHeight
    },1000)
    e.preventDefault();
});

// navbar
$(document).ready(function(){
    $(window).scroll(function(){
        var scroll = $(window).scrollTop();
        if(scroll >80){
            $(".navbar").css("background","#222")
            $(".navbar").css("box-shadow", "rgba(0,0,0,0.1) 0px 4px 12px")
        }
        else{
            $(".navbar").css("background","transparent");
            $(".navbar").css("box-shadow","none");

        }
    })
});



//navbar mobile view

const mobile = document.querySelector(".menu-toggle");

const mobileLink = document.querySelector(".navbar-menu");

mobile.addEventListener("click", function(){
    mobile.classList.toggle("is-active");
    mobileLink.classList.toggle("active");
});

mobileLink.addEventListener("click",function(){
    const menuBars = document.querySelector(".is-active");
    if(window.innerWidth <=768 && menuBars){
        mobile.classList.toggle("is-active");
        mobileLink.classList.remove("active");
    }
});


//  Search Bar functionality
const searchFun= () =>{
    let filter = document.getElementById('input').value.toUpperCase();
    let data = document.getElementsByClassName('job-card');
    let skillsSet = document.getElementsByClassName('job-label');

    
    
    for(var i = 0;i<skillsSet.length; i++ ){
        let skillLen  = skillsSet[i].getElementsByTagName('a').length;
       
        for(var j=0;j<skillLen;j++){
            let skillName  = skillsSet[i].getElementsByTagName('a')[j];
            if(skillName){
                let textValue = skillName.textContent || skillName.innerHTML;
                if(textValue.toUpperCase().indexOf(filter) > -1){
                    data[i].style.display= "";
                   break;
                }else{
                    data[i].style.display= "none";
                }
            }
        }
        

     
    }


}