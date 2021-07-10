import './admin.scss';
import { renderCreateAccount } from './createAccount.js';

export function disconnect(error) {
  document.querySelector('.disconnected').style.display = '';
  throw error;
}

import { login } from './login.js';

const loginForm = document.querySelector('#loginForm');

if (loginForm) {
  loginForm.onsubmit = login;
}

const createAccountButton = document.querySelector('#createAccountButton');

if (createAccountButton) {
  createAccountButton.onclick = renderCreateAccount;
}

if (location.hash == '#createAccount') {
  renderCreateAccount();
}

if (location.hash == '#createAccountSuccess') {
  document.querySelector('.error').innerHTML = 'Account created. Please log in:';
}