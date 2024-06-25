const password = document.querySelector('.password');
const passwordShow = document.querySelector('#passwordShow');
passwordShow.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
});