import post from './post.js';
import { loadPeriodList } from './periodList.js';

export function login() {
  document.querySelector('.error').innerHTML = '';
  
  post('login', {
    email: this.email.value,
    password: this.password.value
  }, (json, err) => {
    if (err || json.error) {
      document.querySelector('.error').innerText = err || json.error;
      this.submit.innerHTML = 'Login';
    } else {
      init(json.email);
    }
  });
  
  this.submit.innerHTML = 'Logging in...';
  
  // Disable default form action
  return false;
}

function init(username) {
  document.querySelector('h1').onclick = loadPeriodList;
  document.getElementById('loginstatus').innerHTML = 'Logged in as ' + username;
  
  loadPeriodList();
}