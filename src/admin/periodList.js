import post from './post.js';
import { renderGroups } from './groups.js';
import { renderCreateNewPeriod } from './createPeriod.js';
import { loadPeriod } from './sportList.js';
import { disconnect } from './admin.js';
import { sendEmails } from './sendEmails.js';

export function loadPeriodList() {
  document.querySelector('.periodlist').innerHTML = '<h2 id="periodlist">Loading...</h2>';
  document.querySelector('.sportlist').innerHTML = '';
  document.querySelector('main').innerHTML = '<h2 id="name">Loading period list...</h2>';
  
  post('periodList', {}, (json, err) => {
    if (err) {
      disconnect(err);
    } else {
      renderPeriodList(json);
    }
  });
}

export function renderPeriodList(json) {
  if (!json.periodList) return;

  if (document.querySelector('.periodlist').innerHTML.indexOf('Loading...') >= 0) {
    // Render main aswell
    document.querySelector('main').innerHTML = `
      <h2 id="name">Activity Signon</h2>
      <h3>Manage groups</h3>
      <p>Add user email addresses to groups to allow them access to activities.</p>
      <p>Viewing group <select id="groups">
        <option value="Users">Users</option>
        <option value="createNewGroup">+ Create new group</option>
      </select></p>
      <input id="newGroupName" type="text" placeholder="Group name"/>
      <textarea id="emails" col=30 rows=15>fredric@example.com</textarea>
      
      <h3>Send login codes</h3>
      <p>Send login codes to all email addresses.</p>
      <button id="sendEmails" class="download" type="button">Send login codes <i class="fas fa-paper-plane"></i></button>
      <small>Warning: Tell the users to check their spam folder!</small><br/>
      <small>Note: It may take a few minutes to send all emails</small><br/>
      <small>Note: This won't send an email to addresses that have been emailed in the past 30 days</small><br/>
      <p>Or, send a login code to a single email address.</p>
      <input id="sendSingleEmail" type="email" placeholder="Email"/>
      <button id="sendSingleEmailButton" class="download" type="button"><i class="fas fa-paper-plane"></i></button>
      `;
    document.querySelector('.periodlist').innerHTML = '<h2 id="periodlist" class="visuallyhidden">Period List</h2><ul></ul>';
    document.getElementById('sendEmails').onclick = sendEmails;
  }
  
  // Update
  const ul = document.querySelector('.periodlist').querySelector('ul');
  
  if (!ul.querySelector('.new')) {
    ul.innerHTML += '<li class="new"><h3>New Period</h3></li>';
  }
  
  json.periodList.forEach(period => {
    let li = ul.querySelector(`.period${period.periodid}`);
    
    if (!li) {
      ul.innerHTML += `<li class="period period${period.periodid}" data-periodid="${period.periodid}"><h3></h3><span class="time"></span></li>`;
      li = ul.querySelector(`.period${period.periodid}`);
    }
  
    let time;
    
    if (period.opens > Date.now()) {
      time = `Opens <time class="countdown" datetime="${datetime(period.opens)}"></time>`;
    } else if (period.closes > Date.now()) {
      time = `Closes <time class="countdown" datetime="${datetime(period.closes)}"></time>`;
    } else {
      time = `Closed`;
    }
    
    li.querySelector('h3').innerHTML = period.name;
    li.querySelector('.time').innerHTML = time;
  });

  ul.querySelectorAll('.new').forEach(li => li.onclick = renderCreateNewPeriod);
  ul.querySelectorAll('.period').forEach(li => li.onclick = loadPeriod);
  
  renderGroups();
  
  doCountdown();
}

export function doCountdown() {
  document.querySelectorAll('time.countdown').forEach(element => {
    countdown(element);
  });
}

setInterval(doCountdown, 1000);

function countdown(element) {
  let timeDiff = new Date(element.dateTime) - new Date();

  element.innerHTML = prettifyTime(timeDiff);
}

function datetime(millis) {
  return datetimeLocal(millis).replace(/-/g, "/").replace("T", " ");
}

export function datetimeLocal(millis) {
  const time = new Date(millis);
  const offsetMs = time.getTimezoneOffset() * 60 * 1000;
  const dateLocal = new Date(time.getTime() - offsetMs);
  return dateLocal.toISOString().slice(0, 19);
}

function prettifyTime(millis) {
  if (millis < 0) {
    if (millis > -60000) {
      return "now";
    } else {
      return prettifyTime(-millis).replace('in ', '') + ' ago';
    }
  }

  var seconds = Math.floor(millis/1000);
  var minutes = Math.floor(seconds/60);
  var hours = Math.floor(minutes/60);
  var days = Math.floor(hours/24);
  
  if (seconds < 1) {
    return "in " + seconds + " seconds";
  } else if (seconds < 2) {
    return "in " + seconds + " second";
  } else if (seconds < 60) {
    return "in " + seconds + " seconds";
  } else if (minutes < 2) {
    return "in " + minutes + " minute";
  } else if (minutes < 60) {
    return "in " + minutes + " minutes";
  } else if (hours < 2) {
    return "in " + hours + " hour";
  } else if (hours < 24) {
    return "in " + hours + " hours";
  } else if (days < 2) {
    return "in " + days + " day";
  } else {
    return "in " + days + " days";
  }
}