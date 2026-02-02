// Toggle between Login and Register forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    
    // Clear error message when switching forms
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

// Show error message
function showError(message, type = 'error') {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.classList.remove('error', 'success');
    errorMessage.classList.add(type);
}

// Hide error message
function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

// Get stored users from localStorage
function getStoredUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Register form submission
document.getElementById('registerFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    hideError();

    const name = document.getElementById('registerName').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const agbCheck = document.getElementById('agbCheck').checked;

    // Validation
    if (!name || !password || !passwordConfirm) {
        showError('Bitte alle Felder ausfüllen.', 'error');
        return;
    }

    if (!agbCheck) {
        showError('Bitte akzeptieren Sie die AGB\'s.', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        showError('Passwörter stimmen nicht überein.', 'error');
        return;
    }

    if (password.length < 6) {
        showError('Passwort muss mindestens 6 Zeichen lang sein.', 'error');
        return;
    }

    // Check if name already exists
    const users = getStoredUsers();
    if (users.some(user => user.name === name)) {
        showError('Dieser Name ist bereits registriert.', 'error');
        return;
    }

    // Add new user
    users.push({ name, password });
    saveUsers(users);

    showError('Registrierung erfolgreich! Sie werden weitergeleitet zum Login.', 'success');
    
    // Clear form and switch to login after 2 seconds
    setTimeout(() => {
        document.getElementById('registerFormElement').reset();
        toggleForms();
        hideError();
    }, 2000);
});

// Login form submission
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    hideError();

    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!name || !password) {
        showError('Bitte alle Felder ausfüllen.', 'error');
        return;
    }

    // Check credentials
    const users = getStoredUsers();
    const user = users.find(u => u.name === name && u.password === password);

    if (!user) {
        showError('Name oder Passwort inkorrekt.', 'error');
        return;
    }

    // Successful login - save user session and redirect
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to main.html
    window.location.href = 'main.html';
});
