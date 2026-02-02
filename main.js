// Check if user is logged in
function checkUserSession() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // No active session - redirect to login
        window.location.href = 'login.html';
        return;
    }

    // Display user information
    const user = JSON.parse(currentUser);
    const welcomeText = document.getElementById('welcomeText');
    const userInfo = document.getElementById('userInfo');

    welcomeText.textContent = `Willkommen, ${user.name}!`;
    
    userInfo.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Registriert seit:</strong> ${user.registeredDate || 'Heute'}</p>
    `;

    // Load user settings
    loadUserSettings(user.name);
    updateLoginStats(user.name);
}

// Load user settings
function loadUserSettings(userName) {
    const settings = JSON.parse(localStorage.getItem(`settings_${userName}`) || '{}');
    
    const themeSelect = document.getElementById('theme');
    const notificationsCheckbox = document.getElementById('notifications');

    if (settings.theme) {
        themeSelect.value = settings.theme;
        applyTheme(settings.theme);
    }

    if (settings.notifications !== undefined) {
        notificationsCheckbox.checked = settings.notifications;
    }
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

// Save settings
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const theme = document.getElementById('theme').value;
    const notifications = document.getElementById('notifications').checked;

    const settings = {
        theme,
        notifications
    };

    localStorage.setItem(`settings_${currentUser.name}`, JSON.stringify(settings));
    applyTheme(theme);

    // Show success message
    showMessage('Einstellungen gespeichert!', 'success');
});

// Update login statistics
function updateLoginStats(userName) {
    let stats = JSON.parse(localStorage.getItem(`stats_${userName}`) || '{"loginCount": 0}');
    stats.loginCount = (stats.loginCount || 0) + 1;
    stats.lastLogin = new Date().toLocaleDateString('de-DE');
    localStorage.setItem(`stats_${userName}`, JSON.stringify(stats));

    document.getElementById('loginCount').textContent = stats.loginCount;
    document.getElementById('lastLogin').textContent = stats.lastLogin;
}

// Show message
function showMessage(message, type) {
    // For settings
    if (document.getElementById('settingsForm')) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message show ${type}`;
        messageDiv.textContent = message;
        document.getElementById('settingsForm').parentElement.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Change password
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate old password
    if (oldPassword !== currentUser.password) {
        showPasswordMessage('Aktuelles Passwort ist falsch!', 'error');
        return;
    }

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
        showPasswordMessage('Neue Passwörter stimmen nicht überein!', 'error');
        return;
    }

    // Validate password length
    if (newPassword.length < 6) {
        showPasswordMessage('Neues Passwort muss mindestens 6 Zeichen lang sein!', 'error');
        return;
    }

    // Update password in storage
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.name === currentUser.name);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user session
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showPasswordMessage('Passwort erfolgreich geändert!', 'success');
        document.getElementById('passwordForm').reset();
    }
});

// Show password message
function showPasswordMessage(message, type) {
    const messageDiv = document.getElementById('passwordMessage');
    messageDiv.textContent = message;
    messageDiv.className = `message show ${type}`;

    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 3000);
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Check session on page load
document.addEventListener('DOMContentLoaded', checkUserSession);
