// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Check system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
}

// Currency handling
let currentCurrency = '€';
const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£'
};

function updateCurrency() {
    const select = document.getElementById('currency');
    currentCurrency = currencySymbols[select.value];
    updateTotals();
}

// Rest of the JavaScript functionality remains the same, just updated to use currentCurrency