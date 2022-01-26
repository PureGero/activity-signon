import post from './post.js';
import { requestGroups } from './groups.js';

const r = 40;
const r2pi = r * Math.PI * 2;

export function sendEmails() {
  const button = this;

  button.innerHTML = 'Sending...';
  
  post('getEmailsToSend', {}, (json, err) => {
    if (err || json.error) {
      button.innerHTML = err || json.error;
    } else {
      createProgressBox(json.emails.length);
      sendEmail(json.emailsPerSecond, json.emails, total, 0, (count) => {
        button.innerHTML = `Sent ${count} emails`;
        requestGroups();
      });
    }
  });
}

export function sendSingleEmail(input) {
  const email = input.value;
  createProgressBox(1);
  sendEmail(json.emailsPerSecond, [ input ], 1, 0, (count) => {
    input.value = '';
  });
}

function createProgressBox(total) {
  const progressBox = document.body.appendChild(document.createElement('div'));
  progressBox.className = 'progress__box';
  progressBox.innerHTML = `
    <div class="container">
      <div class="title">Sending emails</div>
      <svg style="transform: rotate(-90deg); stroke-dasharray: ${r2pi}; stroke-dashoffset: ${r2pi}" height="100" width="100">
        <circle cx="${r + 10}" cy="${r + 10}" r="${r}" stroke="${config.lightColor}" stroke-width="6" fill="none" />
      </svg>
      <div class="progress" style="margin-top: -${r*2 + 1}px">0%</div>
      <p>Sent <span class="count">0</span>/${total} emails...</p>
      <p class="error"></p>
    </div>`;
}

function sendEmail(emailsPerSecond, emailsToSend, total, count, callback) {
  const emails = emailsToSend.splice(0, emailsPerSecond);

  if (!emails.length) {
    // We done - out of emails to send
    console.log(`Sent ${count} emails`);
    document.body.removeChild(document.querySelector('.progress__box'));
    callback(count);
    return;
  }
  
  post('sendEmail', {
    emails,
    host: location.host,
    title: config.title,
    darkColor: config.darkColor
  }, (json, err) => {
    if (err || json.error) {
      document.querySelector('.progress__box .error').innerHTML = JSON.stringify(err || json.error);
    } else {
      count += emails.length;
      document.querySelector('.progress__box svg').style.strokeDashoffset = r2pi * (1 - count / total);
      document.querySelector('.progress__box .progress').innerHTML = Math.ceil(count / total * 100) + '%';
      document.querySelector('.progress__box .count').innerHTML = count;

      setTimeout(() => sendEmail(emailsPerSecond, emailsToSend, r2pi, total, count, callback), 1000);
    }
  });
}