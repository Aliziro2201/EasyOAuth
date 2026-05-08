// dashboard-script.js – Fetch user data from backend and display on dashboard
(function() {
  'use strict';

  // ============================================
  // CUSTOMIZABLE LINKS - EDIT THESE VALUES
  // ============================================
  const LINKS = {
    // Page links
    login: '/user/login',             // Login page URL
    home: '/',              // Homepage URL
    
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
    // EDIT: Your backend endpoint for fetching user data
    userDataUrl: '/api/user/profile',   // API endpoint to get user data
    
    // EDIT: Request method
    method: 'GET',
    
    // EDIT: Request headers (add auth token if needed)
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ' + getAuthToken(),
    },
    
    // EDIT: Customize how to check if response is successful
    isSuccess: function(responseData, responseStatus) {
      return responseStatus >= 200 && responseStatus < 300;
      // Alternative: return responseData.success === true;
    },
    
    // EDIT: Map API response to dashboard fields
    // This function extracts user data from your API response
    mapUserData: function(responseData) {
      // Example 1: Direct mapping
      // return {
      //   name: responseData.name,
      //   username: responseData.username,
      //   email: responseData.email,
      //   password: responseData.password,
      //   age: responseData.age
      // };
      
      // Example 2: Nested object
      // const user = responseData.user || responseData.data || responseData;
      // return {
      //   name: user.fullName || user.name,
      //   username: user.username,
      //   email: user.email,
      //   password: user.password,
      //   age: user.age
      // };
      
      // Default: assume responseData contains user fields directly
      const data = responseData.user || responseData.data || responseData;
      return {
        name: data.name || '-',
        username: data.username || '-',
        email: data.email || '-',
        password: data.password || '-',
        age: data.age || '-'
      };
    },
    
    // EDIT: Extract error message from failed response
    extractErrorMessage: function(responseData, responseStatus) {
      return responseData.message || responseData.error || 'Failed to load user data. Please try again.';
    }
  };
  // ============================================

  // DOM Elements
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const userCard = document.getElementById('userCard');
  const errorMessage = document.getElementById('errorMessage');

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

  // Show user card with data
  function showUserCard() {
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (userCard) userCard.style.display = 'block';
  }

  // Get initials from name for avatar
  function getInitials(name) {
    if (!name || name === '-') return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Populate user card with data
  function populateUserCard(userData) {
    // Set name
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = userData.name || '-';

    // Set username
    const userUsernameEl = document.getElementById('userUsername');
    if (userUsernameEl) userUsernameEl.textContent = userData.username || '-';

    // Set email
    const userEmailEl = document.getElementById('userEmail');
    if (userEmailEl) userEmailEl.textContent = userData.email || '-';

    // Set password (store original for toggle)
    const userPasswordEl = document.getElementById('userPassword');
    if (userPasswordEl) {
      const originalPassword = userData.password || '-';
      userPasswordEl.textContent = '••••••••';
      userPasswordEl.setAttribute('data-original', originalPassword);
      userPasswordEl.setAttribute('data-masked', 'true');
    }

    // Set age
    const userAgeEl = document.getElementById('userAge');
    if (userAgeEl) userAgeEl.textContent = userData.age || '-';

    // Set avatar initials
    const userInitialsEl = document.getElementById('userInitials');
    if (userInitialsEl) {
      userInitialsEl.textContent = getInitials(userData.name);
    }
  }

  // Toggle password visibility
  function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordVisibility');
    const passwordEl = document.getElementById('userPassword');

    if (!toggleBtn || !passwordEl) return;

    toggleBtn.addEventListener('click', function() {
      const isMasked = passwordEl.getAttribute('data-masked') === 'true';
      
      if (isMasked) {
        // Show original password
        const original = passwordEl.getAttribute('data-original') || '-';
        passwordEl.textContent = original;
        passwordEl.setAttribute('data-masked', 'false');
        toggleBtn.textContent = '🙈';
      } else {
        // Mask password
        passwordEl.textContent = '••••••••';
        passwordEl.setAttribute('data-masked', 'true');
        toggleBtn.textContent = '👁️';
      }
    });
  }

  // Fetch user data from backend
  async function fetchUserData() {
    showLoading();

    try {
      const response = await fetch(API_CONFIG.userDataUrl, {
        method: API_CONFIG.method,
        headers: API_CONFIG.headers,
      });

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // Keep as text if not JSON
        }
      }

      // Check if successful
      if (API_CONFIG.isSuccess(responseData, response.status)) {
        // Map response to user data format
        const userData = API_CONFIG.mapUserData(responseData);
        
        // Store in localStorage as fallback
        localStorage.setItem('tajanprovider_user_data', JSON.stringify(userData));
        
        // Display user data
        populateUserCard(userData);
        showUserCard();
      } else {
        const errorMsg = API_CONFIG.extractErrorMessage(responseData, response.status);
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
      
      // Clear login state
      localStorage.removeItem('tajanprovider_logged_in');
      localStorage.removeItem('tajanprovider_user');
      localStorage.removeItem('tajanprovider_user_data');
      localStorage.removeItem('tajanprovider_login_response');
    fetch("/user/logout", {
        method: "GET"
    })
    .then(() => window.location.href = "/user/login");
      
      // Redirect to login page
    //   window.location.href = LINKS.login;
    });
  }

  // Setup refresh button
  function setupRefreshButton() {
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
      refreshButton.addEventListener('click', fetchUserData);
    }
  }

  // Setup retry button
  function setupRetryButton() {
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
      retryButton.addEventListener('click', fetchUserData);
    }
  }

  // Initialize everything
  function init() {
    applyFooterLinks();
    handleNavScroll();
    setupPasswordToggle();
    setupLogout();
    setupRefreshButton();
    setupRetryButton();

    // Fetch user data when page loads
    fetchUserData();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();