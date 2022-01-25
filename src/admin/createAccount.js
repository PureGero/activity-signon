import post from './post.js';

export function renderCreateAccount() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.google.com/recaptcha/api.js';
  script.async = true;
  document.querySelector('head').appendChild(script);

  document.querySelector('main').innerHTML = `
    <form class="createaccount">
      <h2 id="name">Create an account</h2>
      <p class="error" aria-live="polite"></p>
      <label for="username">Name:</label>
      <input type="text" name="name" id="name" placeholder="Name" autofocus/>
      <label for="username">Company name:</label>
      <input type="text" name="company" id="company" placeholder="Company name"/>
      <label for="username">Email:</label>
      <input type="email" name="email" id="email" placeholder="Email"/>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password" placeholder="Password"/>
      <label for="billingaddress1">Billing address:</label>
      <input type="text" name="billingaddress1" id="billingaddress1" placeholder="Line 1"/>
      <input type="text" name="billingaddress2" id="billingaddress2" placeholder="Line 2"/>
      <label for="username">City:</label>
      <input type="text" name="city" id="city" placeholder="City"/>
      <label for="username">State:</label>
      <input type="text" name="state" id="state" placeholder="State"/>
      <label for="username">Post code:</label>
      <input type="text" name="postcode" id="postcode" placeholder="Post code"/>
      <label for="username">Country:</label>
      <input type="text" name="country" id="country" placeholder="Country"/>
      <button class="g-recaptcha" data-sitekey="6Ler14gbAAAAADwj5Iq5vN-jm9TBTjZpFJqgSLpO" data-callback='onSubmitCreateAccount'>Create account</button>
    </form>
    <a href="${location.pathname}">Login instead &gt;</a>
  `;
}

window.onSubmitCreateAccount = token => {
  const form = document.querySelector('form');
  post('createAccount', {
    name: form.name.value,
    company: form.company.value,
    email: form.email.value,
    password: form.password.value,
    billingaddress1: form.billingaddress1.value,
    billingaddress2: form.billingaddress2.value,
    city: form.city.value,
    state: form.state.value,
    postcode: form.postcode.value,
    country: form.country.value,
    token
  }, (json, err) => {
    if (err || json.error) {
      document.querySelector('.error').innerText = err || json.error;
    } else {
      location.assign(location.pathname + '#createAccountSuccess');
      location.reload();
    }
  });
};