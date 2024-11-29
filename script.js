// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// Check system preference and saved preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true' || (savedDarkMode === null && 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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

// Invoice number generation
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
}

document.getElementById('invoiceNumber').textContent = generateInvoiceNumber();

// Items management
let items = [];

function addItem() {
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
        <input type="text" placeholder="Description" onchange="updateTotals()">
        <input type="number" placeholder="Quantity" value="1" min="1" onchange="updateTotals()">
        <input type="number" placeholder="Price" step="0.01" onchange="updateTotals()">
        <div class="item-total">${currentCurrency}0.00</div>
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    document.getElementById('itemsList').appendChild(itemRow);
    items.push(itemRow);
    updateTotals();
}

function removeItem(button) {
    const row = button.parentElement;
    items = items.filter(item => item !== row);
    row.remove();
    updateTotals();
}

function updateTotals() {
    let subtotal = 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    document.getElementById('taxRateDisplay').textContent = taxRate.toFixed(1);

    items.forEach(row => {
        const quantity = parseFloat(row.children[1].value) || 0;
        const price = parseFloat(row.children[2].value) || 0;
        const total = quantity * price;
        row.children[3].textContent = `${currentCurrency}${total.toFixed(2)}`;
        subtotal += total;
    });

    const vat = subtotal * (taxRate / 100);
    const total = subtotal + vat;

    document.getElementById('subtotal').textContent = `${currentCurrency}${subtotal.toFixed(2)}`;
    document.getElementById('vat').textContent = `${currentCurrency}${vat.toFixed(2)}`;
    document.getElementById('total').textContent = `${currentCurrency}${total.toFixed(2)}`;
}

// PDF Generation
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const invoice = document.getElementById('invoice');
    
    // Temporarily hide the theme switch for PDF generation
    const themeSwitch = document.querySelector('.theme-switch');
    themeSwitch.style.display = 'none';
    
    html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.body.classList.contains('dark-mode') ? '#1a1a1a' : 'white'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        const fileName = `invoice-${document.getElementById('invoiceNumber').textContent}.pdf`;
        pdf.save(fileName);
        
        // Restore theme switch visibility
        themeSwitch.style.display = 'flex';
    });
}

// Draft saving functionality
function saveAsDraft() {
    const formData = {
        invoiceNumber: document.getElementById('invoiceNumber').textContent,
        currency: document.getElementById('currency').value,
        taxRate: document.getElementById('taxRate').value,
        fromCompany: document.getElementById('fromCompany').value,
        fromVAT: document.getElementById('fromVAT').value,
        fromAddress: document.getElementById('fromAddress').value,
        fromEmail: document.getElementById('fromEmail').value,
        fromPhone: document.getElementById('fromPhone').value,
        toCompany: document.getElementById('toCompany').value,
        toVAT: document.getElementById('toVAT').value,
        toAddress: document.getElementById('toAddress').value,
        toEmail: document.getElementById('toEmail').value,
        toPhone: document.getElementById('toPhone').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        poNumber: document.getElementById('poNumber').value,
        notes: document.getElementById('notes').value,
        paymentDetails: document.getElementById('paymentDetails').value,
        items: Array.from(document.querySelectorAll('#itemsList .item-row')).map(row => ({
            description: row.children[0].value,
            quantity: row.children[1].value,
            price: row.children[2].value
        }))
    };

    localStorage.setItem('invoiceDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
}

// Load draft if available
function loadDraft() {
    const savedDraft = localStorage.getItem('invoiceDraft');
    if (savedDraft) {
        const formData = JSON.parse(savedDraft);
        
        // Restore form fields
        Object.keys(formData).forEach(key => {
            if (key !== 'items') {
                const element = document.getElementById(key);
                if (element) {
                    if (key === 'invoiceNumber') {
                        element.textContent = formData[key];
                    } else {
                        element.value = formData[key];
                    }
                }
            }
        });

        // Clear existing items
        document.getElementById('itemsList').innerHTML = '';
        items = [];

        // Restore items
        formData.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <input type="text" placeholder="Description" value="${item.description}" onchange="updateTotals()">
                <input type="number" placeholder="Quantity" value="${item.quantity}" min="1" onchange="updateTotals()">
                <input type="number" placeholder="Price" step="0.01" value="${item.price}" onchange="updateTotals()">
                <div class="item-total">${currentCurrency}0.00</div>
                <button class="btn-remove" onclick="removeItem(this)">×</button>
            `;
            document.getElementById('itemsList').appendChild(itemRow);
            items.push(itemRow);
        });

        updateTotals();
        updateCurrency();
    }
}

// Set default dates
const today = new Date().toISOString().split('T')[0];
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 30);
document.getElementById('invoiceDate').value = today;
document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

// Initialize
addItem();
loadDraft();