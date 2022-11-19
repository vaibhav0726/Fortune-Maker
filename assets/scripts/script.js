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


// let cross = document.querySelector('#cross-btn');
// let userform = document.querySelector('.user-form');
// let signin = document.querySelector('.sign .in');
// let signup = document.querySelector('.sign .up');
// let signinForm = document.querySelector('.signIn');
// let signupForm = document.querySelector('.signUp');


// cross.addEventListener('click',()=>{
//     userform.style.display = 'none';
// })

// signin.addEventListener('click',()=>{
//     userform.style.display = 'flex';
//     signinForm.style.display = 'block';
//     signupForm.style.display = 'none';
//     userform.classList.remove("cross");
// })

// signup.addEventListener('click',()=>{
//     userform.style.display = 'flex';
//     signupForm.style.display = 'block';
//     signinForm.style.display = 'none';
//     userform.classList.remove("cross");
// })


function load(id)
{
    console.log(id);
    let ele = document.querySelector(`.${id}`);
    console.log(ele);
    ele.style.display = 'block';
}

function closed(id)
{
    let ele = document.querySelector(`.${id}`);
    ele.style.display = 'none';
}