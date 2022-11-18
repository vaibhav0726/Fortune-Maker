let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>
{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
}

let loadMoreBtn = document.querySelector('#load-more-btn');

loadMoreBtn.onclick = () =>{
    let url = '../html/resourses.html';
    loadMoreBtn = window.open(url,"_blank");
}

let cross = document.querySelector('#cross-btn');
let userform = document.querySelector('.user-form');
let signin = document.querySelector('.sign .in');
let signup = document.querySelector('.sign .up');
let signinForm = document.querySelector('.signIn');
let signupForm = document.querySelector('.signUp');

cross.addEventListener('click',()=>{
    userform.style.display = 'none';
})

signin.addEventListener('click',()=>{
    userform.style.display = 'flex';
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    userform.classList.remove("cross");
})

signup.addEventListener('click',()=>{
    userform.style.display = 'flex';
    signupForm.style.display = 'block';
    signinForm.style.display = 'none';
    userform.classList.remove("cross");
})
