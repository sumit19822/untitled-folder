/**
 * Himanshu Dairy Farm - Complete Application Logic
 * हिमांशु डेयरी फ़ार्म - मुख्य स्क्रिप्ट व कार्यप्रणाली
 */

// Global State
let appData = null;
let currentLanguage = 'hi'; // 'hi' (Hindi/Hinglish) or 'en' (English)
let activeTab = 'dashboard';
let collectionChart = null;
let cattleChart = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  renderApp();
  initDefaultDate();
  feather?.replace();
});

// Set default date input values to today
function initDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) input.value = today;
  });
}

// Load data from LocalStorage or Demo Data
function loadData() {
  const stored = localStorage.getItem('himanshu_dairy_db');
  if (stored) {
    try {
      appData = JSON.parse(stored);
    } catch (e) {
      console.error("Error loading stored data, reverting to demo data", e);
      appData = JSON.parse(JSON.stringify(defaultDairyData));
    }
  } else {
    appData = JSON.parse(JSON.stringify(defaultDairyData));
    saveData();
  }
}

// Save data to LocalStorage
function saveData() {
  localStorage.setItem('himanshu_dairy_db', JSON.stringify(appData));
  showToast("डेटा सुरक्षित कर लिया गया है (Saved successfully)", "success");
}

// Reset to Default Demo Data
function resetToDemo() {
  if (confirm("क्या आप वाकई डेमो डेटा पुनः लोड करना चाहते हैं? आपकी नई प्रविष्टियां रीसेट हो सकती हैं।")) {
    appData = JSON.parse(JSON.stringify(defaultDairyData));
    saveData();
    renderApp();
    showToast("डेमो डेटा पुनः लोड हो गया!", "info");
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('[data-tab-target]').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = button.getAttribute('data-tab-target');
      switchTab(target);
    });
  });

  // Fat calculation in Milk Entry Modal
  const fatInput = document.getElementById('entryFat');
  const animalSelect = document.getElementById('entryAnimal');
  const rateInput = document.getElementById('entryRate');
  const qtyInput = document.getElementById('entryQty');
  const totalDisplay = document.getElementById('entryTotal');

  function updateMilkModalRate() {
    const fat = parseFloat(fatInput.value) || 0;
    const qty = parseFloat(qtyInput.value) || 0;
    const animal = animalSelect.value;
    
    // Auto-calculate rate if not manually locked
    if (fat > 0) {
      const mult = animal === 'Buffalo' 
        ? (appData.settings.buffaloFatMultiplier || 9.0) 
        : (appData.settings.cowFatMultiplier || 7.5);
      const computedRate = (fat * mult).toFixed(2);
      if (!rateInput.dataset.manual) {
        rateInput.value = computedRate;
      }
    }
    
    const rate = parseFloat(rateInput.value) || 0;
    totalDisplay.value = '₹ ' + (qty * rate).toFixed(2);
  }

  if (fatInput && animalSelect && rateInput && qtyInput && totalDisplay) {
    fatInput.addEventListener('input', () => {
      delete rateInput.dataset.manual;
      updateMilkModalRate();
    });
    qtyInput.addEventListener('input', updateMilkModalRate);
    rateInput.addEventListener('input', () => {
      rateInput.dataset.manual = "true";
      updateMilkModalRate();
    });
    animalSelect.addEventListener('change', () => {
      delete rateInput.dataset.manual;
      updateMilkModalRate();
    });
  }

  // AI Date to Expected Calving Date auto-calculation in Cattle Modal
  const aiDateInput = document.getElementById('cattleAiDate');
  const cattleTypeSelect = document.getElementById('cattleType');
  const expectedCalvingInput = document.getElementById('cattleExpectedCalving');

  if (aiDateInput && cattleTypeSelect && expectedCalvingInput) {
    aiDateInput.addEventListener('change', () => {
      if (aiDateInput.value) {
        const aiDate = new Date(aiDateInput.value);
        // Buffalo: ~310 days, Cow: ~280 days
        const daysToAdd = cattleTypeSelect.value === 'Cow' ? 280 : 310;
        const expected = new Date(aiDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        expectedCalvingInput.value = expected.toISOString().split('T')[0];
      }
    });
  }

  // Quick Global Search
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      handleGlobalSearch(query);
    });
  }
}

// Switch Active Tab
function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    if (btn.getAttribute('data-tab-target') === tabName) {
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
    } else {
      btn.classList.remove('bg-emerald-700', 'text-white', 'shadow-sm');
      btn.classList.add('text-slate-600', 'hover:bg-slate-100');
    }
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  // Specific tab render triggers
  if (tabName === 'dashboard') {
    renderDashboard();
  } else if (tabName === 'milk') {
    renderMilkEntries();
  } else if (tabName === 'cattle') {
    renderCattle();
  } else if (tabName === 'khata') {
    renderKhata();
  } else if (tabName === 'expenses') {
    renderExpenses();
  } else if (tabName === 'tools') {
    renderTools();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render entire App
function renderApp() {
  renderHeaderInfo();
  renderDashboard();
  renderMilkEntries();
  renderCattle();
  renderKhata();
  renderExpenses();
}

// Header Info
function renderHeaderInfo() {
  const nameEl = document.getElementById('headerDairyName');
  const ownerEl = document.getElementById('headerOwner');
  if (nameEl) nameEl.textContent = appData.settings.dairyName;
  if (ownerEl) ownerEl.textContent = `संचालक: ${appData.settings.ownerName} | 📞 ${appData.settings.phone}`;
}

// -------------------------------------------------------------
// DASHBOARD LOGIC & CHARTS
// -------------------------------------------------------------
function renderDashboard() {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's metrics
  let todayCollectionLiters = 0;
  let todayCollectionAmount = 0;
  let todaySalesLiters = 0;
  let todaySalesAmount = 0;

  appData.milkEntries.forEach(entry => {
    if (entry.date === today) {
      if (entry.flow === 'collection') {
        todayCollectionLiters += entry.liters;
        todayCollectionAmount += entry.totalAmount;
      } else if (entry.flow === 'sale') {
        todaySalesLiters += entry.liters;
        todaySalesAmount += entry.totalAmount;
      }
    }
  });

  // Calculate cattle statistics
  const totalCattle = appData.cattle.length;
  const milkingCount = appData.cattle.filter(c => c.status === 'milking').length;
  const pregnantCount = appData.cattle.filter(c => c.status === 'pregnant').length;
  const sickCount = appData.cattle.filter(c => c.status === 'sick').length;
  const totalDailyCapacity = appData.cattle.reduce((acc, c) => acc + (c.dailyYield || 0), 0);

  // Calculate dues
  const totalFarmerPayable = appData.farmers.reduce((acc, f) => acc + (f.balancePayable || 0), 0);
  const totalCustomerReceivable = appData.customers.reduce((acc, c) => acc + (c.balanceReceivable || 0), 0);

  // Update DOM Metric cards
  const elColLiters = document.getElementById('dashColLiters');
  const elColAmt = document.getElementById('dashColAmt');
  const elSaleLiters = document.getElementById('dashSaleLiters');
  const elSaleAmt = document.getElementById('dashSaleAmt');
  const elCattleCount = document.getElementById('dashCattleCount');
  const elCattleSub = document.getElementById('dashCattleSub');
  const elReceivable = document.getElementById('dashReceivable');
  const elPayable = document.getElementById('dashPayable');
  const elNetProfit = document.getElementById('dashNetProfit');

  if (elColLiters) elColLiters.textContent = `${todayCollectionLiters.toFixed(1)} L`;
  if (elColAmt) elColAmt.textContent = `लागत: ₹${todayCollectionAmount.toFixed(0)}`;
  if (elSaleLiters) elSaleLiters.textContent = `${todaySalesLiters.toFixed(1)} L`;
  if (elSaleAmt) elSaleAmt.textContent = `कमाई: ₹${todaySalesAmount.toFixed(0)}`;
  if (elCattleCount) elCattleCount.textContent = `${totalCattle} पशु`;
  if (elCattleSub) elCattleSub.textContent = `${milkingCount} दुधारू (${totalDailyCapacity.toFixed(0)} L/दिन), ${pregnantCount} गाभिन`;
  if (elReceivable) elReceivable.textContent = `₹${totalCustomerReceivable.toLocaleString('en-IN')}`;
  if (elPayable) elPayable.textContent = `₹${totalFarmerPayable.toLocaleString('en-IN')}`;
  
  const estimatedProfit = todaySalesAmount - todayCollectionAmount;
  if (elNetProfit) {
    elNetProfit.textContent = `₹${estimatedProfit.toFixed(0)}`;
    elNetProfit.className = estimatedProfit >= 0 ? "text-emerald-700 font-bold" : "text-rose-600 font-bold";
  }

  // Render recent 5 transactions in dashboard
  const dashRecentTable = document.getElementById('dashRecentTableBody');
  if (dashRecentTable) {
    const recent = [...appData.milkEntries].reverse().slice(0, 5);
    dashRecentTable.innerHTML = recent.map(entry => {
      const isCollection = entry.flow === 'collection';
      const flowBadge = isCollection
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">संकलन (ख़रीद)</span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">बिक्री (सप्लाई)</span>`;
      
      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4 text-sm font-medium text-slate-800">${entry.date} (${entry.shift === 'Morning' ? 'सुबह' : 'शाम'})</td>
          <td class="py-3 px-4 text-sm">${flowBadge}</td>
          <td class="py-3 px-4 text-sm font-semibold text-slate-900">${entry.partyName}</td>
          <td class="py-3 px-4 text-sm text-slate-600">${entry.liters} L (${entry.animal})</td>
          <td class="py-3 px-4 text-sm text-slate-600">${entry.fat ? entry.fat + '%' : '-'}</td>
          <td class="py-3 px-4 text-sm font-bold text-slate-800">₹${entry.totalAmount.toFixed(1)}</td>
          <td class="py-3 px-4 text-sm">
            <button onclick="printSlip('${entry.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded transition">पर्ची</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Charts
  renderDashboardCharts();
}

function renderDashboardCharts() {
  const chartCanvas = document.getElementById('weeklyMilkChart');
  if (!chartCanvas) return;

  // Generate last 7 days labels
  const days = [];
  const colData = [];
  const saleData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const displayStr = d.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric' });
    days.push(displayStr);

    let dayCol = 0;
    let daySale = 0;
    appData.milkEntries.forEach(e => {
      if (e.date === dStr) {
        if (e.flow === 'collection' || e.flow === 'farm_production') dayCol += e.liters;
        if (e.flow === 'sale') daySale += e.liters;
      }
    });

    // Fallback realistic variations for previous days demo
    if (dayCol === 0) dayCol = 70 + Math.floor(Math.random() * 25);
    if (daySale === 0) daySale = 65 + Math.floor(Math.random() * 20);

    colData.push(dayCol);
    saleData.push(daySale);
  }

  if (collectionChart) {
    collectionChart.destroy();
  }

  const ctx = chartCanvas.getContext('2d');
  collectionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'कुल संकलन / उत्पादन (Liters)',
          data: colData,
          backgroundColor: '#047857',
          borderRadius: 6
        },
        {
          label: 'कुल दूध बिक्री (Liters)',
          data: saleData,
          backgroundColor: '#38bdf8',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Outfit, sans-serif' } } }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'लीटर (Liters)' } }
      }
    }
  });

  // Cattle Pie Chart
  const cattleCanvas = document.getElementById('cattlePieChart');
  if (cattleCanvas) {
    if (cattleChart) cattleChart.destroy();
    
    const milkingCount = appData.cattle.filter(c => c.status === 'milking').length;
    const pregnantCount = appData.cattle.filter(c => c.status === 'pregnant').length;
    const sickCount = appData.cattle.filter(c => c.status === 'sick').length;
    const dryCount = appData.cattle.filter(c => c.status === 'dry').length;

    const cCtx = cattleCanvas.getContext('2d');
    cattleChart = new Chart(cCtx, {
      type: 'doughnut',
      data: {
        labels: ['दुधारू (Milking)', 'गाभिन (Pregnant)', 'बीमार (Sick)', 'सूखी (Dry)'],
        datasets: [{
          data: [milkingCount, pregnantCount, sickCount, dryCount],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// -------------------------------------------------------------
// MILK COLLECTION & SALE VIEW (दूध का हिसाब)
// -------------------------------------------------------------
function renderMilkEntries() {
  const filterShift = document.getElementById('filterShift')?.value || 'all';
  const filterFlow = document.getElementById('filterFlow')?.value || 'all';
  const filterDate = document.getElementById('filterDate')?.value || '';

  const tableBody = document.getElementById('milkTableBody');
  if (!tableBody) return;

  let filtered = [...appData.milkEntries].reverse();

  if (filterShift !== 'all') {
    filtered = filtered.filter(e => e.shift === filterShift);
  }
  if (filterFlow !== 'all') {
    filtered = filtered.filter(e => e.flow === filterFlow);
  }
  if (filterDate) {
    filtered = filtered.filter(e => e.date === filterDate);
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-slate-500">
          कोई प्रविष्टि नहीं मिली (No entries found for selected filter).
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(entry => {
    const isCollection = entry.flow === 'collection' || entry.flow === 'farm_production';
    const flowBadge = entry.flow === 'collection' 
      ? `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">संकलन (ख़रीद)</span>`
      : entry.flow === 'farm_production'
      ? `<span class="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-semibold">फ़ार्म उत्पादन</span>`
      : `<span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">बिक्री (सप्लाई)</span>`;

    const statusBadge = entry.paymentStatus === 'paid'
      ? `<span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">नकद (Paid)</span>`
      : `<span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-medium">उधार (Credit)</span>`;

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-sm transition">
        <td class="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
          <div>${entry.date}</div>
          <div class="text-xs text-slate-400">${entry.shift === 'Morning' ? 'सुबह (M)' : 'शाम (E)'} • ${entry.timestamp || ''}</div>
        </td>
        <td class="py-3 px-3">${flowBadge}</td>
        <td class="py-3 px-3 font-semibold text-slate-900">${entry.partyName}</td>
        <td class="py-3 px-3">${entry.animal === 'Buffalo' ? 'भैंस (Buffalo)' : 'गाय (Cow)'}</td>
        <td class="py-3 px-3 font-bold text-slate-800">${entry.liters.toFixed(1)} L</td>
        <td class="py-3 px-3 text-slate-600">
          ${entry.fat ? `<span class="font-medium text-slate-700">${entry.fat}%</span>` : '-'}
          ${entry.snf ? `<span class="text-xs text-slate-400"> (SNF: ${entry.snf}%)</span>` : ''}
        </td>
        <td class="py-3 px-3 text-slate-700">₹${entry.rate ? entry.rate.toFixed(1) : '-'}</td>
        <td class="py-3 px-3 font-bold text-emerald-800">₹${entry.totalAmount.toFixed(1)}</td>
        <td class="py-3 px-3">${statusBadge}</td>
        <td class="py-3 px-3 whitespace-nowrap text-right">
          <button onclick="printSlip('${entry.id}')" title="पर्ची प्रिंट करें" class="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded mr-1">
            🖨️
          </button>
          <button onclick="shareWhatsAppSlip('${entry.id}')" title="WhatsApp भेजें" class="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded mr-1">
            💬
          </button>
          <button onclick="deleteMilkEntry('${entry.id}')" title="हटाएं" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Open Milk Entry Modal
function openMilkModal(defaultFlow = 'collection') {
  const modal = document.getElementById('milkEntryModal');
  const flowSelect = document.getElementById('entryFlow');
  const partySelect = document.getElementById('entryParty');
  
  if (flowSelect) flowSelect.value = defaultFlow;
  updatePartyDropdownOptions(defaultFlow);

  document.getElementById('entryQty').value = '';
  document.getElementById('entryFat').value = '';
  document.getElementById('entrySnf').value = '';
  document.getElementById('entryRate').value = '';
  document.getElementById('entryTotal').value = '₹ 0.00';

  modal.classList.remove('hidden');
}

function updatePartyDropdownOptions(flow) {
  const partySelect = document.getElementById('entryParty');
  if (!partySelect) return;

  if (flow === 'collection') {
    partySelect.innerHTML = `
      <option value="">-- किसान / ग्वाला चुनें --</option>
      ${appData.farmers.map(f => `<option value="${f.id}" data-name="${f.name}" data-animal="${f.defaultType}">${f.code} - ${f.name} (${f.village})</option>`).join('')}
      <option value="NEW">+ नया किसान नाम दर्ज करें</option>
    `;
  } else if (flow === 'sale') {
    partySelect.innerHTML = `
      <option value="">-- ग्राहक / परिवार / होटल चुनें --</option>
      ${appData.customers.map(c => `<option value="${c.id}" data-name="${c.name}" data-rate="${c.ratePerLiter}">${c.code} - ${c.name} (${c.type})</option>`).join('')}
      <option value="NEW">+ नया ग्राहक नाम दर्ज करें</option>
    `;
  } else {
    partySelect.innerHTML = `<option value="FARM" data-name="हिमांशु डेयरी फार्म (अपना उत्पादन)">हिमांशु डेयरी फार्म (स्वयं का उत्पादन)</option>`;
  }
}

// On party select change, autofill animal or rate
function onPartySelectionChange() {
  const partySelect = document.getElementById('entryParty');
  const flowSelect = document.getElementById('entryFlow');
  const animalSelect = document.getElementById('entryAnimal');
  const rateInput = document.getElementById('entryRate');
  const selected = partySelect.options[partySelect.selectedIndex];

  if (selected.value === 'NEW') {
    const customName = prompt("कृपया किसान या ग्राहक का नाम दर्ज करें (Enter Name):");
    if (customName) {
      const opt = document.createElement('option');
      opt.value = "CUSTOM_" + Date.now();
      opt.text = customName;
      opt.setAttribute('data-name', customName);
      opt.selected = true;
      partySelect.add(opt, partySelect.options[1]);
    }
    return;
  }

  if (flowSelect.value === 'collection') {
    const animal = selected.getAttribute('data-animal');
    if (animal) animalSelect.value = animal;
  } else if (flowSelect.value === 'sale') {
    const rate = selected.getAttribute('data-rate');
    if (rate) {
      rateInput.value = rate;
      rateInput.dataset.manual = "true";
      const qty = parseFloat(document.getElementById('entryQty').value) || 0;
      document.getElementById('entryTotal').value = '₹ ' + (qty * parseFloat(rate)).toFixed(2);
    }
  }
}

// Submit Milk Entry Form
function submitMilkEntry(e) {
  e.preventDefault();

  const flow = document.getElementById('entryFlow').value;
  const partySelect = document.getElementById('entryParty');
  const selectedOpt = partySelect.options[partySelect.selectedIndex];
  const partyName = selectedOpt ? (selectedOpt.getAttribute('data-name') || selectedOpt.text) : 'अज्ञात';
  const partyId = selectedOpt ? selectedOpt.value : '';

  const date = document.getElementById('entryDate').value || new Date().toISOString().split('T')[0];
  const shift = document.getElementById('entryShift').value;
  const animal = document.getElementById('entryAnimal').value;
  const liters = parseFloat(document.getElementById('entryQty').value) || 0;
  const fat = parseFloat(document.getElementById('entryFat').value) || 0;
  const snf = parseFloat(document.getElementById('entrySnf').value) || 0;
  const rate = parseFloat(document.getElementById('entryRate').value) || 0;
  const totalAmount = parseFloat((liters * rate).toFixed(2));
  const paymentStatus = document.getElementById('entryPaymentStatus').value;

  if (liters <= 0 || rate <= 0) {
    alert("कृपया सही मात्रा (Liters) और दर (Rate) भरें!");
    return;
  }

  const newEntry = {
    id: "M-" + Date.now(),
    date,
    shift,
    flow,
    partyType: flow === 'collection' ? 'farmer' : (flow === 'sale' ? 'customer' : 'own_farm'),
    partyId,
    partyName,
    animal,
    liters,
    fat: fat > 0 ? fat : null,
    snf: snf > 0 ? snf : null,
    rate,
    totalAmount,
    paymentStatus,
    slipNo: "SLIP-" + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  appData.milkEntries.push(newEntry);

  // Update Khata balance automatically if credit
  if (paymentStatus === 'credit') {
    if (flow === 'collection' && partyId && partyId.startsWith('F-')) {
      const farmer = appData.farmers.find(f => f.id === partyId);
      if (farmer) farmer.balancePayable = (farmer.balancePayable || 0) + totalAmount;
    } else if (flow === 'sale' && partyId && partyId.startsWith('CUST-')) {
      const cust = appData.customers.find(c => c.id === partyId);
      if (cust) cust.balanceReceivable = (cust.balanceReceivable || 0) + totalAmount;
    }
  }

  saveData();
  closeModal('milkEntryModal');
  renderMilkEntries();
  renderDashboard();
  renderKhata();
  showToast("दूध प्रविष्टि सफलतापूर्वक दर्ज हो गई! (Milk entry recorded)", "success");

  // Offer to print slip
  setTimeout(() => {
    if (confirm("क्या आप इस प्रविष्टि की पर्ची प्रिंट / WhatsApp करना चाहते हैं?")) {
      printSlip(newEntry.id);
    }
  }, 200);
}

// Delete Milk Entry
function deleteMilkEntry(id) {
  if (confirm("क्या आप वाकई इस दूध प्रविष्टि को हटाना चाहते हैं?")) {
    appData.milkEntries = appData.milkEntries.filter(e => e.id !== id);
    saveData();
    renderMilkEntries();
    renderDashboard();
    showToast("प्रविष्टि हटा दी गई!", "info");
  }
}

// -------------------------------------------------------------
// CATTLE & BUFFALO MANAGEMENT (भैंसों का हिसाब)
// -------------------------------------------------------------
function renderCattle() {
  const filterStatus = document.getElementById('filterCattleStatus')?.value || 'all';
  const filterType = document.getElementById('filterCattleType')?.value || 'all';
  const searchInput = document.getElementById('searchCattle')?.value.toLowerCase().trim() || '';

  const container = document.getElementById('cattleGrid');
  if (!container) return;

  let filtered = [...appData.cattle];

  if (filterStatus !== 'all') {
    filtered = filtered.filter(c => c.status === filterStatus);
  }
  if (filterType !== 'all') {
    filtered = filtered.filter(c => c.type === filterType);
  }
  if (searchInput) {
    filtered = filtered.filter(c => 
      c.tagNo.toLowerCase().includes(searchInput) || 
      c.name.toLowerCase().includes(searchInput) ||
      c.breed.toLowerCase().includes(searchInput)
    );
  }

  // Update summary header
  const totalCattleCount = appData.cattle.length;
  const milkingBuffaloCount = appData.cattle.filter(c => c.type === 'Buffalo' && c.status === 'milking').length;
  const totalYield = appData.cattle.reduce((sum, c) => sum + (c.dailyYield || 0), 0);

  const statsBadge = document.getElementById('cattleSummaryStats');
  if (statsBadge) {
    statsBadge.textContent = `कुल: ${totalCattleCount} पशु | दुधारू भैंसें: ${milkingBuffaloCount} | दैनिक दूध क्षमता: ${totalYield.toFixed(1)} L/दिन`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <p class="text-lg font-medium">कोई पशु नहीं मिला (No cattle found matching criteria)</p>
        <button onclick="openCattleModal()" class="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition">
          + नई भैंस / पशु जोड़ें
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(c => {
    let statusBadgeClass = 'badge-milking';
    let statusText = 'दूध दे रही है (Milking)';
    if (c.status === 'pregnant') {
      statusBadgeClass = 'badge-pregnant';
      statusText = 'गाभिन (Pregnant)';
    } else if (c.status === 'dry') {
      statusBadgeClass = 'badge-dry';
      statusText = 'सूखी (Dry)';
    } else if (c.status === 'sick') {
      statusBadgeClass = 'badge-sick';
      statusText = 'इलाज चल रहा है (Sick)';
    }

    const isBuffalo = c.type === 'Buffalo';
    const animalIcon = isBuffalo ? '🐃' : '🐄';

    return `
      <div class="dairy-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <!-- Card Top Bar -->
        <div class="p-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
              ${animalIcon}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="font-bold text-slate-900 text-lg">${c.name}</h4>
                <span class="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">${c.tagNo}</span>
              </div>
              <p class="text-xs text-slate-500">${c.breed} • ब्यांत: ${c.lactation || 1}</p>
            </div>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadgeClass}">
            ${statusText}
          </span>
        </div>

        <!-- Card Body -->
        <div class="p-5 space-y-3 flex-1">
          <!-- Milk Yield Highlight -->
          <div class="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100/80 flex items-center justify-between">
            <div>
              <span class="text-xs text-emerald-800 font-medium">दैनिक दूध उत्पादन</span>
              <div class="text-2xl font-extrabold text-emerald-900">${c.dailyYield || 0} <span class="text-sm font-semibold">L/दिन</span></div>
            </div>
            <div class="text-right text-xs text-emerald-700">
              <div>सुबह: <span class="font-bold">${c.morningYield || 0} L</span></div>
              <div>शाम: <span class="font-bold">${c.eveningYield || 0} L</span></div>
            </div>
          </div>

          <!-- Breeding & Health Info -->
          <div class="text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            ${c.aiDate ? `
              <div class="flex justify-between">
                <span class="text-slate-500">AI / गर्भाधान तिथि:</span>
                <span class="font-semibold text-slate-800">${c.aiDate}</span>
              </div>
            ` : ''}
            ${c.expectedCalvingDate ? `
              <div class="flex justify-between">
                <span class="text-amber-700 font-medium">संभावित ब्याने की तिथि:</span>
                <span class="font-bold text-amber-900">${c.expectedCalvingDate}</span>
              </div>
            ` : ''}
            <div class="flex justify-between">
              <span class="text-slate-500">टीकाकरण (Vaccine):</span>
              <span class="text-slate-800 font-medium">${c.vaccinationStatus || 'Up to date'}</span>
            </div>
            ${c.healthNotes ? `
              <div class="pt-1 border-t border-slate-200/70 text-slate-600">
                <span class="font-semibold text-slate-700">नोट:</span> ${c.healthNotes}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onclick="quickAddMilkForCattle('${c.name}', ${c.dailyYield || 0})" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition shadow-sm">
            + दूध दर्ज करें
          </button>
          <div class="space-x-1">
            <button onclick="editCattle('${c.id}')" class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition font-medium">
              संपादित करें
            </button>
            <button onclick="deleteCattle('${c.id}')" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Open Cattle Modal
function openCattleModal(cattleId = null) {
  const modal = document.getElementById('cattleModal');
  const modalTitle = document.getElementById('cattleModalTitle');
  const form = document.getElementById('cattleForm');

  if (cattleId) {
    const c = appData.cattle.find(item => item.id === cattleId);
    if (!c) return;
    modalTitle.textContent = "पशु विवरण संपादित करें (Edit Cattle)";
    form.dataset.editId = cattleId;
    document.getElementById('cattleTag').value = c.tagNo;
    document.getElementById('cattleName').value = c.name;
    document.getElementById('cattleType').value = c.type;
    document.getElementById('cattleBreed').value = c.breed;
    document.getElementById('cattleLactation').value = c.lactation || 1;
    document.getElementById('cattleStatus').value = c.status;
    document.getElementById('cattleMorningYield').value = c.morningYield || 0;
    document.getElementById('cattleEveningYield').value = c.eveningYield || 0;
    document.getElementById('cattleAiDate').value = c.aiDate || '';
    document.getElementById('cattleExpectedCalving').value = c.expectedCalvingDate || '';
    document.getElementById('cattleVaccine').value = c.vaccinationStatus || '';
    document.getElementById('cattleNotes').value = c.healthNotes || '';
  } else {
    modalTitle.textContent = "+ नई भैंस / पशु जोड़ें (Add Cattle)";
    delete form.dataset.editId;
    form.reset();
    document.getElementById('cattleTag').value = "HDF-" + (100 + appData.cattle.length + 1);
  }

  modal.classList.remove('hidden');
}

// Submit Cattle Form
function submitCattleForm(e) {
  e.preventDefault();
  const form = document.getElementById('cattleForm');
  const editId = form.dataset.editId;

  const morningYield = parseFloat(document.getElementById('cattleMorningYield').value) || 0;
  const eveningYield = parseFloat(document.getElementById('cattleEveningYield').value) || 0;
  const dailyYield = morningYield + eveningYield;

  const cattleData = {
    tagNo: document.getElementById('cattleTag').value.trim(),
    name: document.getElementById('cattleName').value.trim(),
    type: document.getElementById('cattleType').value,
    breed: document.getElementById('cattleBreed').value.trim() || 'मुर्राह',
    lactation: parseInt(document.getElementById('cattleLactation').value) || 1,
    status: document.getElementById('cattleStatus').value,
    morningYield,
    eveningYield,
    dailyYield,
    aiDate: document.getElementById('cattleAiDate').value,
    expectedCalvingDate: document.getElementById('cattleExpectedCalving').value,
    vaccinationStatus: document.getElementById('cattleVaccine').value.trim() || 'Vaccinated',
    healthNotes: document.getElementById('cattleNotes').value.trim()
  };

  if (!cattleData.tagNo || !cattleData.name) {
    alert("कृपया टैग नंबर और नाम भरें!");
    return;
  }

  if (editId) {
    const idx = appData.cattle.findIndex(c => c.id === editId);
    if (idx !== -1) {
      appData.cattle[idx] = { ...appData.cattle[idx], ...cattleData };
    }
  } else {
    cattleData.id = "C-" + Date.now();
    appData.cattle.push(cattleData);
  }

  saveData();
  closeModal('cattleModal');
  renderCattle();
  renderDashboard();
  showToast("पशु विवरण सुरक्षित हो गया!", "success");
}

function editCattle(id) {
  openCattleModal(id);
}

function deleteCattle(id) {
  if (confirm("क्या आप वाकई इस भैंस/पशु का रिकॉर्ड हटाना चाहते हैं?")) {
    appData.cattle = appData.cattle.filter(c => c.id !== id);
    saveData();
    renderCattle();
    renderDashboard();
    showToast("पशु हटा दिया गया!", "info");
  }
}

function quickAddMilkForCattle(cattleName, dailyCapacity) {
  openMilkModal('collection');
  document.getElementById('entryParty').value = 'FARM';
  document.getElementById('entryQty').value = (dailyCapacity / 2).toFixed(1);
}

// -------------------------------------------------------------
// KHATA BOOK / LEDGER (किसान व ग्राहक खाता)
// -------------------------------------------------------------
function renderKhata() {
  renderFarmerKhata();
  renderCustomerKhata();
  renderTransactionHistory();
}

function renderFarmerKhata() {
  const container = document.getElementById('farmerKhataTableBody');
  if (!container) return;

  const totalPayable = appData.farmers.reduce((sum, f) => sum + (f.balancePayable || 0), 0);
  const totalPayableEl = document.getElementById('totalFarmerPayableDisplay');
  if (totalPayableEl) totalPayableEl.textContent = `कुल देय राशि: ₹${totalPayable.toLocaleString('en-IN')}`;

  container.innerHTML = appData.farmers.map(f => {
    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-sm transition">
        <td class="py-3 px-4 font-mono font-bold text-slate-700">${f.code}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${f.name}</div>
          <div class="text-xs text-slate-500">${f.village || ''} • 📞 ${f.phone || ''}</div>
        </td>
        <td class="py-3 px-4 text-slate-600">${f.defaultType === 'Buffalo' ? 'भैंस' : 'गाय'}</td>
        <td class="py-3 px-4 text-slate-700 font-medium">${f.totalSuppliedLiters || 0} L</td>
        <td class="py-3 px-4">
          <span class="text-base font-extrabold text-amber-700">₹${(f.balancePayable || 0).toLocaleString('en-IN')}</span>
          <div class="text-xs text-slate-400">भुगतान बाकी</div>
        </td>
        <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
          <button onclick="openPaymentModal('farmer', '${f.id}', '${f.name}', ${f.balancePayable || 0})" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition shadow-sm">
            रुपया दें (Pay)
          </button>
          <button onclick="shareKhataWhatsApp('farmer', '${f.name}', '${f.phone}', ${f.balancePayable || 0})" class="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition">
            💬 WhatsApp
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCustomerKhata() {
  const container = document.getElementById('customerKhataTableBody');
  if (!container) return;

  const totalReceivable = appData.customers.reduce((sum, c) => sum + (c.balanceReceivable || 0), 0);
  const totalReceivableEl = document.getElementById('totalCustomerReceivableDisplay');
  if (totalReceivableEl) totalReceivableEl.textContent = `मार्केट उधारी (वसूली योग्य): ₹${totalReceivable.toLocaleString('en-IN')}`;

  container.innerHTML = appData.customers.map(c => {
    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-sm transition">
        <td class="py-3 px-4 font-mono font-bold text-slate-700">${c.code}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${c.name}</div>
          <div class="text-xs text-slate-500">${c.address || ''} • 📞 ${c.phone || ''}</div>
        </td>
        <td class="py-3 px-4 text-slate-600">${c.dailyQuota || 0} L/दिन (₹${c.ratePerLiter}/L)</td>
        <td class="py-3 px-4 text-slate-700 font-medium">${c.totalPurchasedLiters || 0} L</td>
        <td class="py-3 px-4">
          <span class="text-base font-extrabold text-rose-600">₹${(c.balanceReceivable || 0).toLocaleString('en-IN')}</span>
          <div class="text-xs text-slate-400">उधारी बाकी</div>
        </td>
        <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
          <button onclick="openPaymentModal('customer', '${c.id}', '${c.name}', ${c.balanceReceivable || 0})" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm">
            रुपया जमा करें
          </button>
          <button onclick="shareKhataWhatsApp('customer', '${c.name}', '${c.phone}', ${c.balanceReceivable || 0})" class="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition">
            💬 तकादा भेजें
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTransactionHistory() {
  const container = document.getElementById('txHistoryTableBody');
  if (!container) return;

  const txs = [...(appData.khataTransactions || [])].reverse();
  if (txs.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">कोई लेन-देन दर्ज नहीं है।</td></tr>`;
    return;
  }

  container.innerHTML = txs.map(tx => {
    const isReceived = tx.type === 'received';
    const badge = isReceived 
      ? `<span class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-medium">प्राप्त हुआ (In)</span>`
      : `<span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-medium">भुगतान किया (Out)</span>`;

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-2.5 px-3 font-medium text-slate-700">${tx.date}</td>
        <td class="py-2.5 px-3">${badge}</td>
        <td class="py-2.5 px-3 font-semibold text-slate-900">${tx.partyName}</td>
        <td class="py-2.5 px-3 font-bold text-slate-800">₹${tx.amount.toLocaleString('en-IN')}</td>
        <td class="py-2.5 px-3 text-slate-500">${tx.mode || 'Cash'}</td>
        <td class="py-2.5 px-3 text-slate-600">${tx.notes || '-'}</td>
      </tr>
    `;
  }).join('');
}

// Open Payment Entry Modal
function openPaymentModal(partyType, partyId, partyName, currentBalance) {
  const modal = document.getElementById('paymentModal');
  document.getElementById('payPartyType').value = partyType;
  document.getElementById('payPartyId').value = partyId;
  document.getElementById('payPartyName').value = partyName;
  document.getElementById('payCurrentBalance').value = `₹ ${currentBalance.toLocaleString('en-IN')}`;
  document.getElementById('payAmount').value = currentBalance > 0 ? currentBalance : '';
  
  const title = document.getElementById('payModalTitle');
  if (partyType === 'farmer') {
    title.textContent = `किसान को भुगतान करें: ${partyName}`;
  } else {
    title.textContent = `ग्राहक से रुपया प्राप्त करें: ${partyName}`;
  }

  modal.classList.remove('hidden');
}

// Submit Payment Transaction
function submitPayment(e) {
  e.preventDefault();
  const partyType = document.getElementById('payPartyType').value;
  const partyId = document.getElementById('payPartyId').value;
  const partyName = document.getElementById('payPartyName').value;
  const amount = parseFloat(document.getElementById('payAmount').value) || 0;
  const mode = document.getElementById('payMode').value;
  const notes = document.getElementById('payNotes').value.trim();
  const date = document.getElementById('payDate').value || new Date().toISOString().split('T')[0];

  if (amount <= 0) {
    alert("कृपया वैध राशि भरें!");
    return;
  }

  // Update Party Balance
  if (partyType === 'farmer') {
    const farmer = appData.farmers.find(f => f.id === partyId);
    if (farmer) farmer.balancePayable = Math.max(0, (farmer.balancePayable || 0) - amount);
  } else {
    const cust = appData.customers.find(c => c.id === partyId);
    if (cust) cust.balanceReceivable = Math.max(0, (cust.balanceReceivable || 0) - amount);
  }

  // Record Transaction
  if (!appData.khataTransactions) appData.khataTransactions = [];
  appData.khataTransactions.push({
    id: "TX-" + Date.now(),
    date,
    type: partyType === 'farmer' ? 'paid' : 'received',
    partyName,
    partyType,
    partyId,
    amount,
    mode,
    notes
  });

  saveData();
  closeModal('paymentModal');
  renderKhata();
  renderDashboard();
  showToast("भुगतान सफलतापूर्वक दर्ज हो गया!", "success");
}

// -------------------------------------------------------------
// EXPENSES & FODDER MANAGEMENT (खर्चे व चारा दाना)
// -------------------------------------------------------------
function renderExpenses() {
  const container = document.getElementById('expensesTableBody');
  if (!container) return;

  const totalExpense = appData.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalExpenseEl = document.getElementById('totalExpenseDisplay');
  if (totalExpenseEl) totalExpenseEl.textContent = `कुल दर्ज खर्चे: ₹${totalExpense.toLocaleString('en-IN')}`;

  container.innerHTML = [...appData.expenses].reverse().map(exp => {
    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-sm transition">
        <td class="py-3 px-4 font-medium text-slate-700">${exp.date}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            ${exp.category}
          </span>
        </td>
        <td class="py-3 px-4 font-semibold text-slate-900">${exp.description}</td>
        <td class="py-3 px-4 text-slate-600">${exp.paidTo || '-'}</td>
        <td class="py-3 px-4 text-slate-500 text-xs">${exp.paymentMode || 'Cash'}</td>
        <td class="py-3 px-4 font-bold text-rose-600">₹${exp.amount.toLocaleString('en-IN')}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="deleteExpense('${exp.id}')" class="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openExpenseModal() {
  const modal = document.getElementById('expenseModal');
  document.getElementById('expenseForm').reset();
  initDefaultDate();
  modal.classList.remove('hidden');
}

function submitExpense(e) {
  e.preventDefault();
  const date = document.getElementById('expDate').value || new Date().toISOString().split('T')[0];
  const category = document.getElementById('expCategory').value;
  const description = document.getElementById('expDesc').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value) || 0;
  const paidTo = document.getElementById('expPaidTo').value.trim();
  const paymentMode = document.getElementById('expMode').value;

  if (amount <= 0 || !description) {
    alert("कृपया सही विवरण और राशि भरें!");
    return;
  }

  const newExp = {
    id: "EXP-" + Date.now(),
    date,
    category,
    description,
    amount,
    paidTo,
    paymentMode
  };

  appData.expenses.push(newExp);
  saveData();
  closeModal('expenseModal');
  renderExpenses();
  renderDashboard();
  showToast("खर्चा सफलतापूर्वक दर्ज हो गया!", "success");
}

function deleteExpense(id) {
  if (confirm("क्या आप वाकई इस खर्च को हटाना चाहते हैं?")) {
    appData.expenses = appData.expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
    renderDashboard();
    showToast("खर्च हटा दिया गया!", "info");
  }
}

// -------------------------------------------------------------
// SMART TOOLS & CALCULATORS
// -------------------------------------------------------------
function renderTools() {
  // Tool 1: Live Fat Rate calculation
  const calcFat = document.getElementById('calcFatInput');
  const calcAnimal = document.getElementById('calcAnimalSelect');
  const calcRateResult = document.getElementById('calcRateResult');

  function calculateRate() {
    const fat = parseFloat(calcFat.value) || 0;
    const mult = calcAnimal.value === 'Buffalo' 
      ? (appData.settings.buffaloFatMultiplier || 9.0) 
      : (appData.settings.cowFatMultiplier || 7.5);
    const rate = (fat * mult).toFixed(2);
    calcRateResult.textContent = `₹ ${rate} / लीटर`;
  }

  if (calcFat && calcAnimal && calcRateResult) {
    calcFat.addEventListener('input', calculateRate);
    calcAnimal.addEventListener('change', calculateRate);
    calculateRate();
  }

  // Tool 2: Calving Date
  const toolAiDate = document.getElementById('toolAiDate');
  const toolAnimal = document.getElementById('toolCalvingAnimal');
  const toolCalvingResult = document.getElementById('toolCalvingResult');

  function calculateCalvingDate() {
    if (!toolAiDate.value) return;
    const ai = new Date(toolAiDate.value);
    const days = toolAnimal.value === 'Cow' ? 280 : 310;
    const delivery = new Date(ai.getTime() + days * 24 * 60 * 60 * 1000);
    toolCalvingResult.textContent = delivery.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  if (toolAiDate && toolAnimal && toolCalvingResult) {
    toolAiDate.addEventListener('change', calculateCalvingDate);
    toolAnimal.addEventListener('change', calculateCalvingDate);
  }

  // Tool 3: Feed Requirement Estimator
  const feedWeight = document.getElementById('feedAnimalWeight');
  const feedYield = document.getElementById('feedMilkYield');
  const feedDry = document.getElementById('resDryFodder');
  const feedGreen = document.getElementById('resGreenFodder');
  const feedConc = document.getElementById('resConcentrate');

  function calculateFeed() {
    const weight = parseFloat(feedWeight.value) || 450; // kg
    const milk = parseFloat(feedYield.value) || 12; // L

    // Dry fodder ~ 4-6 kg
    const dry = (weight * 0.012).toFixed(1);
    // Green fodder ~ 15-25 kg
    const green = (weight * 0.04).toFixed(1);
    // Concentrate: Body maintenance (1.5 kg) + 0.4 kg per liter of milk for buffalo
    const conc = (1.5 + milk * 0.4).toFixed(1);

    if (feedDry) feedDry.textContent = `${dry} kg (भूसा/पुआल)`;
    if (feedGreen) feedGreen.textContent = `${green} kg (हरा चारा)`;
    if (feedConc) feedConc.textContent = `${conc} kg (खल, चोकर, दाना)`;
  }

  if (feedWeight && feedYield) {
    feedWeight.addEventListener('input', calculateFeed);
    feedYield.addEventListener('input', calculateFeed);
    calculateFeed();
  }
}

// -------------------------------------------------------------
// PRINT & SLIP GENERATION
// -------------------------------------------------------------
function printSlip(entryId) {
  const entry = appData.milkEntries.find(e => e.id === entryId);
  if (!entry) return;

  const slipArea = document.getElementById('printSlipArea');
  const isCollection = entry.flow === 'collection' || entry.flow === 'farm_production';
  const flowTitle = isCollection ? "दूध संकलन पर्ची (Milk Collection Slip)" : "दूध बिक्री पर्ची (Milk Sale Receipt)";

  slipArea.innerHTML = `
    <div style="font-family: monospace; border: 1px dashed #666; padding: 15px; border-radius: 8px; background: white; max-width: 320px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px dashed #444; padding-bottom: 8px; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${appData.settings.dairyName}</h3>
        <p style="margin: 2px 0; font-size: 11px;">${appData.settings.address}</p>
        <p style="margin: 2px 0; font-size: 11px;">📞 ${appData.settings.phone}</p>
        <div style="font-weight: bold; margin-top: 4px; font-size: 12px; background: #eee; padding: 2px;">${flowTitle}</div>
      </div>

      <div style="font-size: 12px; line-height: 1.5;">
        <div><b>पर्ची क्र.:</b> ${entry.slipNo}</div>
        <div><b>दिनांक:</b> ${entry.date} (${entry.shift === 'Morning' ? 'सुबह' : 'शाम'})</div>
        <div><b>नाम:</b> ${entry.partyName}</div>
        <div><b>पशु:</b> ${entry.animal === 'Buffalo' ? 'भैंस (Buffalo)' : 'गाय (Cow)'}</div>
        <hr style="border: 0; border-top: 1px dashed #999; margin: 6px 0;">
        <div style="display: flex; justify-content: space-between;">
          <span>मात्रा (Quantity):</span>
          <b>${entry.liters.toFixed(1)} L</b>
        </div>
        ${entry.fat ? `
          <div style="display: flex; justify-content: space-between;">
            <span>फैट (FAT %):</span>
            <b>${entry.fat}%</b>
          </div>
        ` : ''}
        ${entry.snf ? `
          <div style="display: flex; justify-content: space-between;">
            <span>SNF %:</span>
            <b>${entry.snf}%</b>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>दर (Rate):</span>
          <b>₹ ${entry.rate.toFixed(2)}/L</b>
        </div>
        <hr style="border: 0; border-top: 1px dashed #999; margin: 6px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
          <span>कुल राशि (Total):</span>
          <span>₹ ${entry.totalAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 2px;">
          <span>भुगतान प्रकार:</span>
          <span>${entry.paymentStatus === 'paid' ? 'नकद (Paid)' : 'खाते में (Credit)'}</span>
        </div>
      </div>

      <div style="text-align: center; border-top: 1px dashed #444; margin-top: 10px; padding-top: 8px; font-size: 11px;">
        धन्यवाद! फिर पधारें 🙏<br>
        <span style="font-size: 9px; color: #666;">Software by Antigravity Dairy Solution</span>
      </div>
    </div>
  `;

  // Open Slip Preview Modal
  const modal = document.getElementById('slipPreviewModal');
  modal.classList.remove('hidden');
}

function executePrint() {
  window.print();
}

// WhatsApp Slip Share
function shareWhatsAppSlip(entryId) {
  const entry = appData.milkEntries.find(e => e.id === entryId);
  if (!entry) return;

  const isCollection = entry.flow === 'collection' || entry.flow === 'farm_production';
  const text = `🥛 *${appData.settings.dairyName}* 🥛\n` +
    `---------------------------\n` +
    `*पर्ची क्र.:* ${entry.slipNo}\n` +
    `*दिनांक:* ${entry.date} (${entry.shift === 'Morning' ? 'सुबह' : 'शाम'})\n` +
    `*नाम:* ${entry.partyName}\n` +
    `*पशु:* ${entry.animal === 'Buffalo' ? 'भैंस' : 'गाय'}\n` +
    `*दूध मात्रा:* ${entry.liters.toFixed(1)} L\n` +
    (entry.fat ? `*फैट (FAT):* ${entry.fat}%\n` : '') +
    (entry.snf ? `*SNF:* ${entry.snf}%\n` : '') +
    `*दर:* ₹${entry.rate.toFixed(2)} / L\n` +
    `---------------------------\n` +
    `*कुल राशि:* ₹${entry.totalAmount.toFixed(2)}\n` +
    `*भुगतान स्थिति:* ${entry.paymentStatus === 'paid' ? 'नकद (Paid)' : 'खाते में बाकी (Credit)'}\n` +
    `---------------------------\n` +
    `धन्यवाद! - हिमांशु डेयरी फ़ार्म\n📞 ${appData.settings.phone}`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// WhatsApp Khata Due Reminder / Summary Share
function shareKhataWhatsApp(type, name, phone, balance) {
  let text = '';
  if (type === 'customer') {
    text = `नमस्ते *${name}* जी,\n` +
      `*${appData.settings.dairyName}* की तरफ से आपका दूध का कुल बकाया हिसाब:\n` +
      `*कुल बकाया राशि:* ₹${balance.toLocaleString('en-IN')}\n\n` +
      `कृपया समय पर भुगतान करने का कष्ट करें।\n` +
      `धन्यवाद! 🙏\n` +
      `संपर्क: ${appData.settings.phone}`;
  } else {
    text = `नमस्ते *${name}* जी,\n` +
      `*${appData.settings.dairyName}* की तरफ से आपके दूध का हिसाब:\n` +
      `*आपके खाते की देय राशि:* ₹${balance.toLocaleString('en-IN')}\n` +
      `आप डेयरी से आकर अपना भुगतान प्राप्त कर सकते हैं।\n` +
      `धन्यवाद! - हिमांशु डेयरी`;
  }

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const url = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(text)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  window.open(url, '_blank');
}

// -------------------------------------------------------------
// BACKUP, RESTORE & EXPORT
// -------------------------------------------------------------
function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `himanshu_dairy_backup_${date}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("डेटा बैकअप फ़ाइल डाउनलोड हो गई!", "success");
}

function triggerImportBackup() {
  const fileInput = document.getElementById('backupFileInput');
  if (fileInput) fileInput.click();
}

function handleBackupFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.settings && imported.cattle && imported.milkEntries) {
        appData = imported;
        saveData();
        renderApp();
        showToast("बैकअप सफलतापूर्वक रीस्टोर हो गया!", "success");
      } else {
        alert("अवैध बैकअप फ़ाइल (Invalid backup JSON structure).");
      }
    } catch (err) {
      alert("फ़ाइल पढ़ने में त्रुटि (Error parsing JSON).");
    }
  };
  reader.readAsText(file);
}

function exportMilkToCSV() {
  const headers = ["दिनांक", "पारी", "प्रकार", "नाम", "पशु", "मात्रा (L)", "फैट %", "SNF %", "दर (₹)", "कुल राशि (₹)", "भुगतान"];
  const rows = appData.milkEntries.map(e => [
    e.date,
    e.shift,
    e.flow,
    `"${e.partyName}"`,
    e.animal,
    e.liters,
    e.fat || '',
    e.snf || '',
    e.rate,
    e.totalAmount,
    e.paymentStatus
  ]);

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `himanshu_dairy_milk_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("Excel/CSV रिपोर्ट डाउनलोड हो गई!", "success");
}

// -------------------------------------------------------------
// UTILITIES: TOASTS & MODALS
// -------------------------------------------------------------
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-800' : (type === 'error' ? 'bg-rose-700' : 'bg-slate-800');
  toast.className = `${bg} text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center space-x-2 transition-all transform duration-300 translate-y-2 opacity-0 font-medium`;
  toast.innerHTML = `<span>🥛</span> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global Search
function handleGlobalSearch(query) {
  if (!query) return;
  // If user searches for a cattle name or tag, auto switch to cattle tab
  const foundCattle = appData.cattle.some(c => c.name.toLowerCase().includes(query) || c.tagNo.toLowerCase().includes(query));
  if (foundCattle && activeTab !== 'cattle') {
    switchTab('cattle');
    const searchCattleInput = document.getElementById('searchCattle');
    if (searchCattleInput) {
      searchCattleInput.value = query;
      renderCattle();
    }
  }
}
