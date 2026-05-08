// login-script.js – TajanProvider Login Page
(function() {
  'use strict';

  // ============================================
  // CUSTOMIZABLE LINKS - EDIT THESE VALUES
  // ============================================
  const LINKS = {
    // Redirect after successful login
    dashboard: '/application/user/dashboard',     // Change to your dashboard URL
    
    // Footer links
    footerBale: '/Iranian_messenger',        
    footerDonationLink: 'https://daramet.com/AliZiro',    
    footerGitHubLink :'https://github.com/Aliziro2201',
    footerTelegramLink : 'https://t.me/TajanSecurity'           
  };
  // ============================================

  // ============================================
  // OAUTH BACKEND CONFIGURATION
  // ============================================
  const OAUTH_CONFIG = {
    // Backend endpoint to get OAuth parameters
    // This backend returns: client_id, status, scope, redirect_uri, type
    backendUrl: '/login/OAuth',    // REPLACE with your actual backend URL
    
    // Request method
    method: 'GET',
    
    // Request headers
    headers: {
      'Content-Type': 'application/json',
    },
    
    // Format request body (if backend needs any data)
    // formatRequestBody: function() {
    //   return JSON.stringify({
    //     // You can send additional data to backend if needed
    //     // e.g., platform: 'web', version: '1.0'
    //   });
    // },
  };
  // ============================================

  // ============================================
  // TEST CREDENTIALS - EDIT HERE
  // ============================================
  const VALID_CREDENTIALS = {
    'aliziro': '123456',
    // Add more test users:
    // 'testuser': 'password123',
  };
  // ============================================

  // ============================================
  // BACKEND API CONFIGURATION (for email/password login)
  // ============================================
  const API_CONFIG = {
    // Set useBackend to true to send credentials to backend
    useBackend: true,
    
    // Backend endpoint
    loginUrl: '/application/api/login',
    
    // Request method
    method: 'POST',
    
    // Headers
    headers: {
      'Content-Type': 'application/json',
    },
    
    // Format request body
    formatRequestBody: function(username, password) {
      return JSON.stringify({
        username: username,
        password: password
      });
    },
    
    // Check if login successful
    isLoginSuccessful: function(responseData, responseStatus) {
      return responseStatus >= 200 && responseStatus < 300;
    },
    
    // Extract error message
    extractErrorMessage: function(responseData) {
      return responseData.message || responseData.error || 'Invalid credentials. Please try again.';
    }
  };
  // ============================================

  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const alertError = document.getElementById('alertError');
  const alertSuccess = document.getElementById('alertSuccess');
  const alertMessage = document.getElementById('alertMessage');
  const successMessage = document.getElementById('successMessage');
  const loginButton = document.getElementById('loginButton');
  const buttonText = document.getElementById('buttonText');
  const buttonLoader = document.getElementById('buttonLoader');
  const googleModal = document.getElementById('googleModal');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const tajanLoginBtn = document.getElementById('tajanLoginBtn');
  const googleModalClose = document.getElementById('googleModalClose');
  const togglePasswordBtn = document.getElementById('togglePassword');

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
  function handleNavbarScroll() {
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
    if (!togglePasswordBtn || !passwordInput) return;
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Show/hide alerts
  function showAlert(type, message) {
    if (alertError) alertError.style.display = 'none';
    if (alertSuccess) alertSuccess.style.display = 'none';

    if (type === 'error' && alertError && alertMessage) {
      alertMessage.textContent = message;
      alertError.style.display = 'flex';
    } else if (type === 'success' && alertSuccess && successMessage) {
      successMessage.textContent = message;
      alertSuccess.style.display = 'flex';
    }
  }

  function hideAlerts() {
    if (alertError) alertError.style.display = 'none';
    if (alertSuccess) alertSuccess.style.display = 'none';
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

  // Set loading state on TajanProvider button
  function setTajanButtonLoading(isLoading) {
    if (!tajanLoginBtn) return;
    if (isLoading) {
      tajanLoginBtn.disabled = true;
      tajanLoginBtn.style.opacity = '0.7';
      tajanLoginBtn.style.cursor = 'not-allowed';
      tajanLoginBtn.textContent = 'Connecting...';
    } else {
      tajanLoginBtn.disabled = false;
      tajanLoginBtn.style.opacity = '1';
      tajanLoginBtn.style.cursor = 'pointer';
      tajanLoginBtn.innerHTML = '<span class="tajan-icon">◆</span> Continue with TajanProvider';
    }
  }

  // Set loading state on login button
  function setLoading(isLoading) {
    if (!loginButton || !buttonText || !buttonLoader) return;
    if (isLoading) {
      loginButton.disabled = true;
      buttonText.style.display = 'none';
      buttonLoader.style.display = 'inline-block';
    } else {
      loginButton.disabled = false;
      buttonText.style.display = 'inline';
      buttonLoader.style.display = 'none';
    }
  }

  // Check credentials locally
  function checkCredentialsLocally(username, password) {
    if (VALID_CREDENTIALS.hasOwnProperty(username)) {
      return VALID_CREDENTIALS[username] === password;
    }
    return false;
  }

  // Send credentials to backend
  async function sendToBackend(username, password) {
    try {
      const body = API_CONFIG.formatRequestBody(username, password);
      const response = await fetch(API_CONFIG.loginUrl, {
        method: API_CONFIG.method,
        headers: API_CONFIG.headers,
        body: body
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // Keep as text
        }
      }

      if (API_CONFIG.isLoginSuccessful(responseData, response.status)) {
        return { success: true };
      } else {
        return {
          success: false,
          message: API_CONFIG.extractErrorMessage(responseData)
        };
      }
    } catch (error) {
      console.error('Login request failed:', error);
      return {
        success: false,
        message: 'Unable to connect to server. Please try again.'
      };
    }
  }

  // Handle successful login
  function handleLoginSuccess(username) {
    showAlert('success', 'Login successful! Redirecting...');
    
    // Store login state
    localStorage.setItem('tajanprovider_logged_in', 'true');
    localStorage.setItem('tajanprovider_user', username);
    
    // Remember me
    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem('tajanprovider_remember', 'true');
    }
    
    // Redirect to dashboard
    setTimeout(function() {
      window.location.href = LINKS.dashboard;
    }, 800);
  }

  // Handle login form submission
  async function handleLogin(event) {
    event.preventDefault();
    
    if (!usernameInput || !passwordInput) return;
    
    hideAlerts();
    
    const isUsernameValid = validateField(usernameInput, usernameError);
    const isPasswordValid = validateField(passwordInput, passwordError);
    
    if (!isUsernameValid || !isPasswordValid) return;
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    setLoading(true);
    
    let result;
    
    if (API_CONFIG.useBackend) {
      // Send to backend
      result = await sendToBackend(username, password);
    } else {
      // Check locally
      const isValid = checkCredentialsLocally(username, password);
      // Simulate small delay for UX
      await new Promise(function(resolve) { setTimeout(resolve, 600); });
      result = isValid ? { success: true } : { success: false, message: 'Invalid email/username or password. Please try again.' };
    }
    
    setLoading(false);
    
    if (result.success) {
      handleLoginSuccess(username);
    } else {
      showAlert('error', result.message);
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  }

  // ============================================
  // TAJANPROVIDER OAUTH FLOW
  // ============================================
  
  /**
   * Send request to backend to get OAuth parameters.
   * Expected backend response format:
   * {
   *   client_id: "your_client_id",
   *   status: "ok",
   *   scope: "profile email",
   *   redirect_uri: "https://yourdomain.com/oauth-callback.html",
   *   type: "code"
   * }
   */
  async function fetchOAuthParams() {
    try {
    //   const body = OAUTH_CONFIG.formatRequestBody();
      
      const response = await fetch(OAUTH_CONFIG.backendUrl, {
        method: OAUTH_CONFIG.method,
        headers: OAUTH_CONFIG.headers
        // body: body
      });

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        try {
          responseData = JSON.parse(textResponse);
        } catch (e) {
          throw new Error('Invalid response format from server');
        }
      }

      // Check if response is valid
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to get OAuth parameters');
      }

      // Validate required fields in response
      if (!responseData.client_id) {
        throw new Error('Missing client_id in response');
      }
      if (!responseData.redirect_uri) {
        throw new Error('Missing redirect_uri in response');
      }

      return {
        success: true,
        data: {
          client_id: responseData.client_id,
          status: responseData.status || 'ok',
          scope: responseData.scope || 'profile email',
          redirect_uri: responseData.redirect_uri,
          type: responseData.type || 'code',
          // Any additional params from backend
          state: responseData.state || generateRandomState()
        //   extraParams: responseData.extra_params || {}
        }
      };

    } catch (error) {
      console.error('OAuth init failed:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to authentication server. Please try again.'
      };
    }
  }

  // Generate random state for CSRF protection
  function generateRandomState() {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return Array.from(array, function(dec) { 
      return ('0' + dec.toString(16)).slice(-2); 
    }).join('');
  }

  // Build redirect URL to tajanprovider.com with response parameters
  function buildTajanProviderUrl(oauthData) {
    // Base URL for tajanprovider.com OAuth authorization
    const baseUrl = 'http://tajanprovider.com:5959/Authorization/OAuth';
    
    // Build query parameters from backend response
    const params = new URLSearchParams();
    
    // Add required OAuth parameters
    params.append('client_id', oauthData.client_id);
    params.append('redirect_uri', oauthData.redirect_uri);
    params.append('response_type', oauthData.type);
    params.append('scope', oauthData.scope);
    params.append('state', oauthData.state);
    
    // Add status if provided
    if (oauthData.status) {
      params.append('status', oauthData.status);
    }
    
    // Add any extra parameters from backend
    if (oauthData.extraParams) {
      Object.keys(oauthData.extraParams).forEach(function(key) {
        params.append(key, oauthData.extraParams[key]);
      });
    }
    
    // Construct final URL
    const redirectUrl = baseUrl + '?' + params.toString();
    
    return redirectUrl;
  }

  // Save OAuth state for verification when user returns
  function saveOAuthData(oauthData) {
    localStorage.setItem('tajanprovider_oauth_state', oauthData.state);
    localStorage.setItem('tajanprovider_oauth_client_id', oauthData.client_id);
    localStorage.setItem('tajanprovider_oauth_redirect_uri', oauthData.redirect_uri);
    localStorage.setItem('tajanprovider_oauth_pending', 'true');
    
    // Store the full response for debugging if needed
    localStorage.setItem('tajanprovider_oauth_data', JSON.stringify(oauthData));
  }

  // Handle TajanProvider login button click
  async function handleTajanProviderLogin() {
    // Show loading state
    setTajanButtonLoading(true);
    hideAlerts();
    
    // Step 1: Send request to backend to get OAuth parameters
    const result = await fetchOAuthParams();
    
    // Reset button state
    setTajanButtonLoading(false);
    
    if (!result.success) {
      // Show error if backend request failed
      showAlert('error', result.message);
      return;
    }
    
    // Step 2: Save OAuth data for callback verification
    saveOAuthData(result.data);
    
    // Step 3: Build the redirect URL to tajanprovider.com
    const tajanProviderUrl = buildTajanProviderUrl(result.data);
    
    // Log for debugging (remove in production)
    console.log('Backend response:', result.data);
    console.log('Redirecting to:', tajanProviderUrl);
    
    // Step 4: Show success message and redirect
    showAlert('success', 'Redirecting to TajanProvider for authentication...');
    
    // Step 5: Redirect user to tajanprovider.com with the parameters
    setTimeout(function() {
      window.location.href = tajanProviderUrl;
    }, 800);
  }

  // Setup TajanProvider login button
  function setupTajanLogin() {
    if (!tajanLoginBtn) return;
    
    tajanLoginBtn.addEventListener('click', handleTajanProviderLogin);
  }

  // ============================================
  // GOOGLE LOGIN - SHOW MODAL
  // ============================================
  
  function setupGoogleLogin() {
    if (!googleLoginBtn || !googleModal || !googleModalClose) return;
    
    googleLoginBtn.addEventListener('click', function() {
      googleModal.classList.add('active');
    });
    
    googleModalClose.addEventListener('click', function() {
      googleModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    googleModal.addEventListener('click', function(event) {
      if (event.target === googleModal) {
        googleModal.classList.remove('active');
      }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && googleModal.classList.contains('active')) {
        googleModal.classList.remove('active');
      }
    });
  }

  // Clear errors on input
  function setupInputListeners() {
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

  // Auto-fill remembered credentials
  function autoFillCredentials() {
    const remembered = localStorage.getItem('tajanprovider_remember');
    const savedUser = localStorage.getItem('tajanprovider_user');
    
    if (remembered === 'true' && savedUser && usernameInput) {
      usernameInput.value = savedUser;
      const rememberMe = document.getElementById('rememberMe');
      if (rememberMe) rememberMe.checked = true;
      if (passwordInput) passwordInput.focus();
    }
  }

  // Initialize everything
  function init() {
    applyFooterLinks();
    handleNavbarScroll();
    setupPasswordToggle();
    setupGoogleLogin();
    setupTajanLogin();
    setupInputListeners();
    autoFillCredentials();
    
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