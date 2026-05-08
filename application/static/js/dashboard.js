// dashboard-script.js – Fetch user data from backend
(function() {
  'use strict';

  // ============================================
  // CUSTOMIZABLE LINKS - EDIT THESE VALUES
  // ============================================
  const LINKS = {
    login: '/application/user/login',             // Login page URL
    home: '/',              // Homepage URL
    
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
    // Backend endpoint to fetch user data
    // Expected response format:
    // {
    //   name: "Ali Ziro",
    //   username: "aliziro",
    //   email: "ali@example.com",
    //   password: "123456",
    //   age: 25,
    //   flag: "🇮🇷 Iran"
    // }
    userDataUrl: '/application/api/profile',   // REPLACE with your backend URL
    
    // Request method
    method: 'GET',
    
    // Request headers (add auth token if needed)
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ' + getToken(),
    },
    
    // Format request body (for POST requests)
    formatRequestBody: function() {
      return null; // null for GET requests
    },
    
    // Check if response is successful
    isSuccess: function(responseData, responseStatus) {
      return responseStatus >= 200 && responseStatus < 300;
    },
    
    // Map API response to user data object
    mapUserData: function(responseData) {
      // Handle different response structures
      const data = responseData.user || responseData.data || responseData;
      
      return {
        name: data.name || '-',
        username: data.username || '-',
        email: data.email || '-',
        password: data.password || '-',
        age: data.age || '-',
        flag: data.flag || '-'
      };
    },
    
    // Extract error message from failed response
    extractErrorMessage: function(responseData, responseStatus) {
      if (responseStatus === 401) return 'Session expired. Please login again.';
      if (responseStatus === 403) return 'Access denied. You do not have permission.';
      if (responseStatus === 404) return 'User data not found.';
      return responseData.message || responseData.error || 'Failed to load user data. Please try again.';
    }
  };
  // ============================================

  // DOM Elements
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const userCard = document.getElementById('userCard');
  const errorMessage = document.getElementById('errorMessage');

  // User data elements
  const displayName = document.getElementById('displayName');
  const userInitials = document.getElementById('userInitials');
  const userFlag = document.getElementById('userFlag');
  const userName = document.getElementById('userName');
  const userUsername = document.getElementById('userUsername');
  const userEmail = document.getElementById('userEmail');
  const userPassword = document.getElementById('userPassword');
  const userAge = document.getElementById('userAge');
  const userFlagValue = document.getElementById('userFlagValue');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

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

  // Get initials from name
  function getInitials(name) {
    if (!name || name === '-') return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Toggle password visibility
  function setupPasswordToggle() {
    if (!togglePasswordBtn || !userPassword) return;

    togglePasswordBtn.addEventListener('click', function() {
      const isMasked = userPassword.getAttribute('data-masked') === 'true';
      
      if (isMasked) {
        // Show original password
        const original = userPassword.getAttribute('data-original') || '-';
        userPassword.textContent = original;
        userPassword.style.letterSpacing = 'normal';
        userPassword.style.fontFamily = 'var(--font-sans)';
        userPassword.setAttribute('data-masked', 'false');
        togglePasswordBtn.textContent = '🙈';
        togglePasswordBtn.title = 'Hide Password';
      } else {
        // Mask password
        userPassword.textContent = '••••••••';
        userPassword.style.letterSpacing = '3px';
        userPassword.style.fontFamily = "'Courier New', monospace";
        userPassword.setAttribute('data-masked', 'true');
        togglePasswordBtn.textContent = '👁️';
        togglePasswordBtn.title = 'Show Password';
      }
    });
  }

  // Show loading state
  function showLoading() {
    if (loadingState) loadingState.style.display = 'flex';
    if (errorState) errorState.style.display = 'none';
    if (userCard) userCard.style.display = 'none';
  }

  // Show error state
  function showError(message) {
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
    if (userCard) userCard.style.display = 'none';
    if (errorMessage) errorMessage.textContent = message;
  }

  // Show user card
  function showUserCard() {
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (userCard) userCard.style.display = 'block';
  }

  // Populate user card with data
  function populateUserCard(userData) {
    // Display name
    if (displayName) displayName.textContent = userData.name || '-';
    
    // Initials for avatar
    if (userInitials) userInitials.textContent = getInitials(userData.name);
    
    // Flag badge under name
    if (userFlag) userFlag.textContent = userData.flag || '-';
    
    // Name field
    if (userName) userName.textContent = userData.name || '-';
    
    // Username field
    if (userUsername) userUsername.textContent = userData.username || '-';
    
    // Email field
    if (userEmail) userEmail.textContent = userData.email || '-';
    
    // Password field (masked by default)
    if (userPassword) {
      const originalPassword = userData.password || '-';
      userPassword.setAttribute('data-original', originalPassword);
      userPassword.setAttribute('data-masked', 'true');
      userPassword.textContent = '••••••••';
      userPassword.style.letterSpacing = '3px';
      userPassword.style.fontFamily = "'Courier New', monospace";
    }
    
    // Age field
    if (userAge) userAge.textContent = userData.age || '-';
    
    // Flag value
    if (userFlagValue) userFlagValue.textContent = userData.flag || '-';
  }

  // Fetch user data from backend
  async function fetchUserData() {
    showLoading();

    try {
      // Build request options
      const requestOptions = {
        method: API_CONFIG.method,
        headers: API_CONFIG.headers,
      };

      // Add body for POST/PUT requests
      const body = API_CONFIG.formatRequestBody();
      if (body && API_CONFIG.method !== 'GET') {
        requestOptions.body = body;
      }

      // Make the request
      const response = await fetch(API_CONFIG.userDataUrl, requestOptions);

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
          responseData = textResponse;
        }
      }

      // Check if successful
      if (API_CONFIG.isSuccess(responseData, response.status)) {
        // Map response to user data
        const userData = API_CONFIG.mapUserData(responseData);
        
        // Cache in localStorage as fallback
        localStorage.setItem('tajanprovider_user_data', JSON.stringify(userData));
        
        // Display data
        populateUserCard(userData);
        showUserCard();
        setupPasswordToggle();
      } else {
        // Handle error
        const errorMsg = API_CONFIG.extractErrorMessage(responseData, response.status);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('tajanprovider_logged_in');
          localStorage.removeItem('tajanprovider_user');
          setTimeout(function() {
            window.location.href = LINKS.login;
          }, 1500);
        }
        
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
      // Try to load from localStorage as fallback
      const cachedData = localStorage.getItem('tajanprovider_user_data');
      if (cachedData) {
        try {
          const userData = JSON.parse(cachedData);
          populateUserCard(userData);
          showUserCard();
          setupPasswordToggle();
          return;
        } catch (e) {
          // Invalid cached data
        }
      }
      
      showError('Unable to connect to server. Please check your connection and try again.');
    }
  }

  // Handle logout
  function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Clear all stored data
      localStorage.removeItem('tajanprovider_logged_in');
      localStorage.removeItem('tajanprovider_user');
      localStorage.removeItem('tajanprovider_user_data');
      localStorage.removeItem('tajanprovider_login_response');
      localStorage.removeItem('tajanprovider_remember');
      localStorage.removeItem('tajanprovider_oauth_pending');
      localStorage.removeItem('tajanprovider_oauth_state');
      localStorage.removeItem('tajanprovider_access_token');
      localStorage.removeItem('tajanprovider_auth_method');
      
      // Redirect to login page
      window.location.href ="/user/logout?redirect=" +encodeURIComponent(LINKS.login);
    });
  }

  // Setup refresh button
  function setupRefreshButton() {
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
      refreshButton.addEventListener('click', function() {
        fetchUserData();
      });
    }
  }

  // Setup retry button
  function setupRetryButton() {
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
      retryButton.addEventListener('click', function() {
        fetchUserData();
      });
    }
  }

  // Check authentication
  // function checkAuth() {
  //   const isLoggedIn = localStorage.getItem('tajanprovider_logged_in');
  //   if (isLoggedIn !== 'true') {
  //     window.location.href = LINKS.login;
  //     return false;
  //   }
  //   return true;
  // }

  // Initialize everything
  function init() {
    // Check if user is logged in
    // if (!checkAuth()) return;

    applyFooterLinks();
    handleNavbarScroll();
    setupLogout();
    setupRefreshButton();
    setupRetryButton();

    // Fetch user data from backend
    fetchUserData();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();