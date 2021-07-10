export function renderCreateAccount() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.google.com/recaptcha/api.js';
  script.async = true;
  document.querySelector('head').appendChild(script);

  document.querySelector('main').innerHTML = `
    <form>
      <h2 id="name">Create an account</h2>
      <label for="username">Email:</label>
      <input type="email" name="email" id="email" placeholder="Email" autofocus/>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password" placeholder="Password"/>
      <button class="g-recaptcha" data-sitekey="6Ler14gbAAAAADwj5Iq5vN-jm9TBTjZpFJqgSLpO" data-callback='onSubmitCreateAccount'>Create account</button>
    </form>
    <a href="${location.pathname}">Login instead &gt;</a>
  `;
}

window.onSubmitCreateAccount = token => {
  console.log('Success!')
  console.log(token);
  location.assign(location.pathname + '#createAccountSuccess');
};