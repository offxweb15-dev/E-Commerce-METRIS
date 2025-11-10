/**
 * METRIS SMART FURNITURE - Main JavaScript
 * Handles mobile navigation and interactive elements
 */

// Show loading overlay when page starts loading
const loadingOverlay = document.getElementById('loadingOverlay');
if (loadingOverlay) {
    loadingOverlay.classList.add('active');
    
    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
        }, 500); // Small delay for smoother transition
    });
}

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.cartCount = document.querySelector('.cart-count');
        this.cartItems = [];
        this.loadCart();
        this.updateCartUI();
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }
    
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }
    
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({...product, quantity: 1});
        }
        this.saveCart();
        this.showNotification('Item added to cart');
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    updateCartUI() {
        if (this.cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Trigger reflow
        notification.offsetHeight;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Language Support
const translations = {
    en: {
        search: 'Search',
        exclusive: 'EXCLUSIVE',
        newArrivals: 'NEW ARRIVALS',
        wooden: 'WOODEN',
        showcase: 'SHOWCASE',
        accessories: 'ACCESSORIES',
        cart: 'Cart',
        user: 'Account',
        title: 'METRIS SMART FURNITURE',
        heroTitle: 'SMART FURNITURE',
        heroSubtitle: 'Discover the perfect blend of style and comfort with our exclusive collection of modern furniture.',
        ctaButton: 'EXCLUSIVE GALLERY',
        discountBadge: '30% OFF',
        footerText: '© 2025 Metris Smart Furniture. All rights reserved.',
        designedBy: 'Designed & Developed by',
        addToCart: 'Add to Cart',
        viewCart: 'View Cart',
        close: 'Close'
    },
    hi: {
        search: 'खोजें',
        exclusive: 'विशेष',
        newArrivals: 'नए आइटम',
        wooden: 'लकड़ी',
        showcase: 'प्रदर्शनी',
        accessories: 'सामान',
        cart: 'कार्ट',
        user: 'खाता',
        title: 'मेट्रिस स्मार्ट फर्नीचर',
        heroTitle: 'स्मार्ट फर्नीचर',
        heroSubtitle: 'आधुनिक फर्नीचर के हमारे विशेष संग्रह के साथ शैली और आराम का सही मिश्रण खोजें।',
        ctaButton: 'विशेष गैलरी',
        discountBadge: '30% छूट',
        footerText: '© 2025 मेट्रिस स्मार्ट फर्नीचर। सर्वाधिकार सुरक्षित।',
        designedBy: 'डिज़ाइन और विकसित',
        addToCart: 'कार्ट में जोड़ें',
        viewCart: 'कार्ट देखें',
        close: 'बंद करें'
    }
};

function setLanguage(lang) {
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update UI elements with translations
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update active state in language selector
    document.querySelectorAll('.language-dropdown .language-selector-item').forEach(item => {
        if (item.getAttribute('data-lang') === lang) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update the language button text
    const currentLangElement = document.getElementById('currentLanguage');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update direction for RTL languages if needed
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const searchBar = document.getElementById('searchBar');
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const navItems = document.querySelectorAll('.nav-links a');
    // Get the existing language selector from the DOM
    const languageSelector = document.querySelector('.language-selector');
    
    // Create and add the current language display
    const currentLangSpan = document.createElement('span');
    currentLangSpan.className = 'language-current';
    currentLangSpan.id = 'currentLanguage';
    currentLangSpan.textContent = 'EN';
    
    // Create and add the dropdown arrow
    const arrowSvg = document.createElement('div');
    arrowSvg.innerHTML = `
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    // Clear existing content and add new elements
    languageSelector.innerHTML = '';
    languageSelector.appendChild(currentLangSpan);
    languageSelector.appendChild(arrowSvg);
    
    // Create dropdown with both language options
    const languageDropdown = document.createElement('div');
    languageDropdown.className = 'language-dropdown';
    languageDropdown.innerHTML = `
        <div class="language-selector-item" data-lang="en">English</div>
        <div class="language-selector-item" data-lang="hi">हिंदी</div>
    `;
    
    // Add dropdown to the DOM
    languageSelector.appendChild(languageDropdown);
    
    // Toggle dropdown visibility
    languageSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // Handle language selection
    languageDropdown.addEventListener('click', (e) => {
        const langItem = e.target.closest('.language-selector-item');
        if (langItem) {
            const lang = langItem.getAttribute('data-lang');
            setLanguage(lang);
            languageDropdown.classList.remove('show');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('show');
    });
    
    // Set initial language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);
    
    // This is now handled by the initial setLanguage call above
    
    // Handle cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real implementation, this would open a cart modal or navigate to cart page
            cart.showNotification('Cart clicked!');
        });
    }
    
    let isSearchOpen = false;
    let isMenuOpen = false;
    
    // Toggle mobile menu function
    function toggleMenu() {
        if (!menuToggle || !navLinks) return;
        
        isMenuOpen = !menuToggle.classList.contains('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
        navLinks.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Close search if open when menu is toggled on mobile
        if (isSearchOpen) {
            toggleSearch();
        }
    }
    
    // Toggle mobile menu on button click
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !menuToggle.contains(e.target) && 
            !navLinks.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking on a nav link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                toggleMenu();
                
                // If it's an anchor link, scroll to the section after the menu closes
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Small delay to allow menu to close before scrolling
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                            // Update URL without adding to history
                            history.pushState(null, '', targetId);
                        }, 300);
                    }
                } else if (targetId && !targetId.startsWith('#')) {
                    // For regular links, navigate after a small delay
                    setTimeout(() => {
                        window.location.href = targetId;
                    }, 300);
                }
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });
    
    // Search functionality toggle
    function toggleSearch() {
        if (!searchBar || !searchInput) return;
        
        isSearchOpen = !isSearchOpen;
        
        if (isSearchOpen) {
            searchBar.classList.add('active');
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
            // Focus input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        } else {
            searchBar.classList.remove('active');
            searchInput.value = '';
            searchInput.blur();
        }
    }

    // Toggle search on search icon click
    if (searchToggle) {
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSearch();
        });
    }

    // Close search on close button click
    if (searchClose) {
        searchClose.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearch();
        });
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (isSearchOpen && searchBar && searchToggle && 
            !searchBar.contains(e.target) && 
            !searchToggle.contains(e.target)) {
            toggleSearch();
        }
    });

    // Handle search form submission
    if (searchBar && searchInput) {
        const searchForm = searchBar.querySelector('form') || searchBar;
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Handle search functionality here
                console.log('Searching for:', searchTerm);
            }
        });
    }

    // This navItems event listener is no longer needed as it's now handled by the toggleMenu function
    
    // Add data-translate attributes to elements that need translation
    document.querySelector('.search-icon span').setAttribute('data-translate', 'search');
    document.querySelector('.cta-button').setAttribute('data-translate', 'ctaButton');
    document.querySelector('.discount-badge').setAttribute('data-translate', 'discountBadge');
    document.querySelector('.footer p').setAttribute('data-translate', 'footerText');
    document.querySelector('.designer-credit span').setAttribute('data-translate', 'designedBy');
    
    // Add data-translate to navigation items
    const navLinkElements = document.querySelectorAll('.nav-links a');
    const navKeys = ['exclusive', 'newArrivals', 'wooden', 'showcase', 'accessories'];
    navLinkElements.forEach((link, index) => {
        link.setAttribute('data-translate', navKeys[index]);
    });
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.hero-content, .hero-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add hover effect to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    }
});

