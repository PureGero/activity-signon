import post from './post.js';

export let groups = [];
let groupCounts = null;
let total = 0;
let emailsSent = 0;

export function updateGroups(groups, callback) {
  post(config.adminBulkEndPoint + '?action=updateGroups&database=' + config.database, {
    groups
  }, (json, err) => {
    if (err || json.error) {
      callback(null, err || json.error);
    } else {
      callback(json);
    }
  });
}

export function updatePaidGroups(students, callback) {
  post(config.adminBulkEndPoint + '?action=updatePaidGroups&database=' + config.database, {
    students
  }, (json, err) => {
    if (err || json.error) {
      callback(null, err || json.error);
    } else {
      callback(json);
    }
  });
}

export function requestGroups() {
  post('groups', {}, (json, err) => {
    if (err || json.error) {
      throw err || json.error;
    } else {
      groups = json.groups;
      globalGroups = Object.keys(json.groups).sort();
      total = json.total;
      emailsSent = json.emailsSent;
      renderGroupList();
      renderGroupEmails();
    }
  });
}

export function renderGroups() {
  if (groups === null) {
    requestGroups();
  } else {
    renderGroupList();
    renderGroupEmails();
  }
}

function renderGroupList() {
  const groupList = document.getElementById('groupList');

  if (groupList) {
    groupList.innerHTML = `
      ${globalGroups.map(group => `<option value="${group}">${group}</option>`)}
      <option value="createNewGroup">+ Create new group</option>
    `;
  }
}

function renderGroupEmails() {
  const groupList = document.getElementById('groupList');
  const groupEmails = document.getElementById('groupEmails');

  if (groupList && groupEmails) {
    console.log('Selected group ' + groupList.value);

    groupEmails.innerHTML = !groups[groupList.value] ? '' : groups[groupList.value].join('\n');
  }

  const emailsToSend = document.getElementById('emailsToSend');

  if (emailsToSend) {
    emailsToSend.innerHTML = total - emailsSent;
  }
}