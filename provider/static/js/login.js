// script.js – Sends credentials to backend for processing
(function() {
  'use strict';

  // ============================================
  // CUSTOMIZABLE LINKS - EDIT THESE VALUES
  // ============================================
  const LINKS = {
    // Redirect after successful login
    dashboard: '/user/dashboard',     // Change to your dashboard URL
    
    // Footer links
    footerBale: '/Iranian_messenger',        
    footerDonationLink: 'https://daramet.com/AliZiro',    
    footerGitHubLink :'https://github.com/Aliziro2201',
    footerTelegramLink : 'https://t.me/TajanSecurity'    
  };
  // ============================================

  // ============================================
  // BACKEND API CONFIGURATION - EDIT THESE VALUES
  // ============================================
  const API_CONFIG = {
    // EDIT: Change this to your actual backend login endpoint
    loginUrl: '/api/login',           // Your backend login API URL
    
    // EDIT: Change request method if needed (POST, GET, etc.)
    method: 'POST',
    
    // EDIT: Set request headers (e.g., Content-Type, API keys)
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer your-token-here',
      // 'X-API-Key': 'your-api-key',
    },
    
    // EDIT: Change how credentials are sent to backend
    // This function formats the username and password for your API
    formatRequestBody: function(username, password) {
      // Example 1: Simple JSON
      return JSON.stringify({
        username: username,
        password: password
      });
      
      // Example 2: Form data style
      // return 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
      
      // Example 3: Nested object
      // return JSON.stringify({
      //   credentials: {
      //     login: username,
      //     pass: password
      //   }
      // });
    },
    
    // EDIT: Customize how to check if login was successful
    // This function receives the response data and returns true/false
    isLoginSuccessful: function(responseData, responseStatus) {
      // Example 1: Check HTTP status
      // return responseStatus === 200;
      
      // Example 2: Check response body field
      // return responseData.success === true;
      
      // Example 3: Check for token
      // return responseData.token !== undefined && responseData.token !== null;
      
      // Default: HTTP 200-299 = success
      return responseStatus >= 200 && responseStatus < 300;
    },
    
    // EDIT: Extract user data from successful response (optional)
    extractUserData: function(responseData) {
      // Example 1: Return username
      // return responseData.username;
      
      // Example 2: Return user object
      // return responseData.user;
      
      // Default: return null
      return null;
    },
    
    // EDIT: Extract error message from failed response
    extractErrorMessage: function(responseData, responseStatus) {
      // Example 1: Message from response body
      // return responseData.message || 'Login failed';
      
      // Example 2: Status-based messages
      // if (responseStatus === 401) return 'Invalid credentials';
      // if (responseStatus === 403) return 'Account locked';
      // if (responseStatus === 429) return 'Too many attempts';
      
      // Default: generic error
      return responseData.message || responseData.error || 'Invalid username/email or password. Please try again.';
    }
  };
  // ============================================

  // Apply footer links
  function applyFooterLinks() {
    const footerBaleLink = document.getElementById('footerBaleLink');
    const footerDonationLink = document.getElementById('footerDonationLink');
    const footerGitHubLink = document.getElementById('footerGitHubLink');
    const footerTelegramLink = document.getElementById('footerTelegramLink');
    
    if (footerBaleLink) footerBaleLink.setAttribute('href', LINKS.footerBale);
    if (footerGitHubLink) footerGitHubLink.setAttribute('href', LINKS.footerGitHubLink);
    if (footerDonationLink) footerDonationLink.setAttribute('href', LINKS.footerDonationLink);
    if (footerTelegramLink) footerTelegramLink.setAttribute('href', LINKS.footerTelegramLink);
  }

  // Navbar scroll effect
  function handleNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 15) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Password visibility toggle
  function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Field validation
  function validateField(input, errorElement) {
    const value = input.value.trim();
    
    if (!value) {
      errorElement.textContent = 'This field is required';
      input.classList.add('error');
      return false;
    }
    
    errorElement.textContent = '';
    input.classList.remove('error');
    return true;
  }

  // Show alert message
  function showAlert(type, message) {
    const errorAlert = document.getElementById('alertError');
    const successAlert = document.getElementById('alertSuccess');
    const alertMessage = document.getElementById('alertMessage');
    const successMessage = document.getElementById('successMessage');

    // Hide both first
    if (errorAlert) errorAlert.style.display = 'none';
    if (successAlert) successAlert.style.display = 'none';

    if (type === 'error' && errorAlert && alertMessage) {
      alertMessage.textContent = message;
      errorAlert.style.display = 'flex';
    } else if (type === 'success' && successAlert && successMessage) {
      successMessage.textContent = message;
      successAlert.style.display = 'flex';
    }
  }

  // Hide all alerts
  function hideAlerts() {
    const errorAlert = document.getElementById('alertError');
    const successAlert = document.getElementById('successAlert');
    if (errorAlert) errorAlert.style.display = 'none';
    if (successAlert) successAlert.style.display = 'none';
  }

  // Set loading state on button
  function setLoading(isLoading) {
    const loginButton = document.getElementById('loginButton');
    if (!loginButton) return;

    if (isLoading) {
      loginButton.disabled = true;
      loginButton.textContent = 'Signing in...';
    } else {
      loginButton.disabled = false;
      loginButton.textContent = 'Sign In';
    }
  }

  // Send credentials to backend and process response
  async function sendToBackend(username, password) {
    try {
      // Prepare request body using configured formatter
      const body = API_CONFIG.formatRequestBody(username, password);
      
      // Make the fetch request to backend
      const response = await fetch(API_CONFIG.loginUrl, {
        method: API_CONFIG.method,
        headers: API_CONFIG.headers,
        body: body
      });

      // Parse response as JSON (change to .text() if backend returns plain text)
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
        // Try to parse as JSON anyway in case content-type is missing
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // Keep as text if not JSON
        }
      }

      // Check if login was successful using configured function
      const isSuccess = API_CONFIG.isLoginSuccessful(responseData, response.status);

      if (isSuccess) {
        // Extract user data if needed
        const userData = API_CONFIG.extractUserData(responseData);
        
        return {
          success: true,
          userData: userData,
          responseData: responseData
        };
      } else {
        // Extract error message
        const errorMessage = API_CONFIG.extractErrorMessage(responseData, response.status);
        
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      // Network error or other fetch failure
      console.error('Login request failed:', error);
      
      return {
        success: false,
        message: 'Unable to connect to server. Please check your connection and try again.'
      };
    }
  }

  // Handle login form submission
  async function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    if (!usernameInput || !passwordInput) return;

    // Hide previous alerts
    hideAlerts();

    // Validate fields client-side first
    const isUsernameValid = validateField(usernameInput, usernameError);
    const isPasswordValid = validateField(passwordInput, passwordError);

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    // Get values
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Show loading state
    setLoading(true);

    // Send to backend and wait for response
    const result = await sendToBackend(username, password);

    // Hide loading state
    setLoading(false);

    if (result.success) {
      // Login successful
      showAlert('success', 'Login successful! Redirecting to dashboard...');
      
      // Store login state
      localStorage.setItem('tajanprovider_logged_in', 'true');
      localStorage.setItem('tajanprovider_user', username);
      
      // Store additional user data if available
      if (result.userData) {
        localStorage.setItem('tajanprovider_user_data', JSON.stringify(result.userData));
      }
      
      // Store full response if needed
      if (result.responseData) {
        localStorage.setItem('tajanprovider_login_response', JSON.stringify(result.responseData));
      }

      // Redirect to dashboard
      setTimeout(function() {
        window.location.href = LINKS.dashboard;
      }, 500);
    } else {
      // Login failed
      showAlert('error', result.message);
      
      // Clear password field for security
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  // Clear errors when user types
  function setupInputListeners() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    if (usernameInput && usernameError) {
      usernameInput.addEventListener('input', function() {
        if (usernameInput.value.trim()) {
          usernameError.textContent = '';
          usernameInput.classList.remove('error');
        }
        hideAlerts();
      });
    }

    if (passwordInput && passwordError) {
      passwordInput.addEventListener('input', function() {
        if (passwordInput.value.trim()) {
          passwordError.textContent = '';
          passwordInput.classList.remove('error');
        }
        hideAlerts();
      });
    }
  }

  // Initialize everything
  function init() {
    applyFooterLinks();
    handleNavScroll();
    setupPasswordToggle();
    setupInputListeners();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();