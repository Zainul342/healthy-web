// FitTrack AI - Application Logic

// --- STATE MANAGEMENT ---
let appState = {
  activeTab: 'dashboard',
  profile: {
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
    activityLevel: '',
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    targetProtein: 0,
    defaultRestDuration: 90,
    isSet: false
  },
  foodLogs: [], // Array of { id, date, name, portion, calories, protein, carbs, fat, timestamp }
  workoutLogs: [], // Array of { id, date, dayIndex, exercises: { tuckFLHold, dipsMaxReps, runDistance, runTimeSeconds, runPaceMinutes, plankHold, scapulaHangs, legRaises } }
  activeWorkoutDay: 1,
  simMode: 'presets',
  selectedPresetMeal: null,
  uploadedImageSrc: null,
  timer: {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    timerInterval: null
  }
};

// --- PRESET MEALS FOR SIMULATOR ---
const PRESET_MEALS = {
  'nasi-goreng': {
    name: 'Nasi Goreng + Telur Ceplok',
    portion: 250,
    calories: 450,
    protein: 18,
    carbs: 55,
    fat: 14,
    imgUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=60',
    boundingBoxes: [
      { label: 'Telur Ceplok', top: '15%', left: '30%', width: '38%', height: '38%', color: '#f5c2e7' },
      { label: 'Nasi Goreng', top: '45%', left: '15%', width: '70%', height: '45%', color: '#cba6f7' }
    ]
  },
  'dada-ayam': {
    name: 'Dada Ayam & Brokoli Rebus',
    portion: 200,
    calories: 280,
    protein: 32,
    carbs: 12,
    fat: 6,
    imgUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&auto=format&fit=crop&q=60',
    boundingBoxes: [
      { label: 'Dada Ayam', top: '25%', left: '20%', width: '48%', height: '48%', color: '#89b4fa' },
      { label: 'Brokoli', top: '45%', left: '60%', width: '30%', height: '40%', color: '#a6e3a1' }
    ]
  },
  'sate-ayam': {
    name: 'Sate Ayam Bumbu Kacang (5 Tusuk)',
    portion: 120,
    calories: 310,
    protein: 22,
    carbs: 8,
    fat: 18,
    imgUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&auto=format&fit=crop&q=60',
    boundingBoxes: [
      { label: 'Sate Ayam', top: '20%', left: '10%', width: '80%', height: '45%', color: '#fab387' },
      { label: 'Saus Kacang', top: '45%', left: '25%', width: '45%', height: '40%', color: '#eba0ac' }
    ]
  },
  'oatmeal': {
    name: 'Oatmeal & Pisang',
    portion: 220,
    calories: 260,
    protein: 8,
    carbs: 48,
    fat: 5,
    imgUrl: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=300&auto=format&fit=crop&q=60',
    boundingBoxes: [
      { label: 'Oatmeal Bowl', top: '25%', left: '15%', width: '70%', height: '60%', color: '#a6adc8' },
      { label: 'Pisang Iris', top: '35%', left: '30%', width: '40%', height: '30%', color: '#f9e2af' }
    ]
  }
};

// --- WORKOUT SPLIT DETAILS (5-Day Active, 2-Day Recovery) ---
const WORKOUT_SPLIT = {
  1: {
    title: 'Strength - Pull & Push',
    desc: 'Fokus pada kekuatan dasar Front Lever dan Dips dengan tambahan kardio HIIT',
    exercises: [
      { name: 'Tuck Front Lever Hold', target: '4 Set x Max Detik (Akumulasi Target 30 detik)', note: 'Jaga scapula tetap aktif ditarik ke bawah (retracted & depressed). Gunakan stopwatch di sebelah kanan untuk mencatat hold time.' },
      { name: 'Dips', target: '4 Set x Repetisi Maksimal (RPE 8-9)', note: 'Turun hingga bahu berada di bawah siku, kunci di posisi atas secara terkontrol.' },
      { name: 'HIIT Sprint Running', target: '10 Mnt Pemanasan, 5x Sprint 30 Detik (Jeda Jalan Kaki 1 Mnt)', note: 'Sprint secepat mungkin selama 30 detik diikuti istirahat aktif dengan berjalan kaki.' }
    ]
  },
  2: {
    title: 'Cardio Endurance',
    desc: 'Latihan daya tahan jantung (kardio LISS) untuk membakar lemak tubuh',
    exercises: [
      { name: 'Lari Tempo LISS', target: '3 - 5 KM (Kecepatan Konstan / Zona 2)', note: 'Pace nyaman di mana Anda masih bisa berbicara santai tanpa terengah-engah.' },
      { name: 'Plank', target: '3 Set x 1 Menit', note: 'Jaga tubuh tetap lurus sejajar, pantat tidak naik, kunci perut.' }
    ]
  },
  3: {
    title: 'REST & RECOVERY (Istirahat Aktif)',
    desc: 'Hari pemulihan otot dan sendi agar siap untuk latihan berikutnya',
    exercises: [
      { name: 'Stretching Aktif & Mobility', target: '15 - 20 Menit Peregangan Ringan', note: 'Fokus peregangan pada bahu, dada, hamstrings, dan pergelangan kaki.' }
    ]
  },
  4: {
    title: 'Strength & Volume',
    desc: 'Menambah volume reps dan durasi ketahanan otot dengan tempo lambat',
    exercises: [
      { name: 'Active Scapula Hangs', target: '4 Set x 8 - 12 Reps', note: 'Bergantung pada bar, angkat bahu mendekati bar hanya dengan kekuatan tulang belikat.' },
      { name: 'Tuck Front Lever Hold', target: '4 Set x Durasi Nyaman (Tempo Kontrol)', note: 'Tahan di posisi tuck yang bersih selama yang Anda bisa.' },
      { name: 'Dips (Eksentrik Lambat)', target: '4 Set x 8-12 Repetisi', note: 'Turun ke bawah sangat lambat (3-4 detik), tekan ke atas dalam 1 detik.' },
      { name: 'Lari Recovery', target: '15 - 20 Menit Jogging Ringan', note: 'Jogging sangat santai untuk membuang asam laktat di otot kaki.' }
    ]
  },
  5: {
    title: 'Cardio & Core Strength',
    desc: 'Peningkatan pace lari menengah dan kekuatan otot inti pendukung calisthenics',
    exercises: [
      { name: 'Lari Jarak Menengah', target: '4 - 6 KM (Target Perbaikan Pace)', note: 'Coba tingkatkan kecepatan secara berkala dari lari sesi sebelumnya.' },
      { name: 'Leg Raises', target: '3 Set x 10 - 15 Reps', note: 'Bergantung di bar, angkat kaki lurus ke atas. Lakukan terkontrol tanpa berayun.' },
      { name: 'Hollow Body Hold', target: '3 Set x 45 Detik', note: 'Tidur terlentang, angkat bahu dan kaki sedikit dari lantai, tekan pinggang menempel ke lantai.' }
    ]
  },
  6: {
    title: 'Peak Performance Test',
    desc: 'Uji kekuatan puncak mingguan untuk melacak progressive overload Anda',
    exercises: [
      { name: 'Tuck Front Lever Max Hold', target: '1 Set Uji Coba Max Hold (Detik)', note: 'Catat waktu terlama Anda mampu bertahan dengan form yang benar.' },
      { name: 'Dips Max Repetitions', target: '1 Set Uji Coba Max Reps (Reps)', note: 'Lakukan dips sebanyak mungkin dalam satu set sampai gagal (muscle failure).' },
      { name: 'Jogging Santai', target: '15 Menit Jogging Ringan', note: 'Pendinginan aktif setelah uji performa puncak.' }
    ]
  },
  7: {
    title: 'REST & RECOVERY (Istirahat Total)',
    desc: 'Pemulihan penuh untuk memulai siklus latihan baru di minggu depan',
    exercises: [
      { name: 'Istirahat Penuh', target: 'Tidak Ada Latihan Fisik Berat', note: 'Pastikan tidur cukup 7-8 jam dan penuhi asupan air putih minimal 3 liter.' }
    ]
  }
};

// --- WORKOUT SET CONFIGURATION ---
const SETS_EXERCISES = {
  'Tuck Front Lever Hold': { sets: 4, type: 'seconds', label: 'detik', placeholder: 'Detik' },
  'Dips': { sets: 4, type: 'reps', label: 'reps', placeholder: 'Reps' },
  'Dips (Eksentrik Lambat)': { sets: 4, type: 'reps', label: 'reps', placeholder: 'Reps' },
  'Plank': { sets: 3, type: 'seconds', label: 'detik', placeholder: 'Detik' },
  'Active Scapula Hangs': { sets: 4, type: 'reps', label: 'reps', placeholder: 'Reps' },
  'Leg Raises': { sets: 3, type: 'reps', label: 'reps', placeholder: 'Reps' },
  'Hollow Body Hold': { sets: 3, type: 'seconds', label: 'detik', placeholder: 'Detik' },
  'Tuck Front Lever Max Hold': { sets: 1, type: 'seconds', label: 'detik', placeholder: 'Detik' },
  'Dips Max Repetitions': { sets: 1, type: 'reps', label: 'reps', placeholder: 'Reps' }
};

// --- REST TIMER STATE & CONTROLLER ---
let restTimerState = {
  timeLeft: 90,
  totalTime: 90,
  interval: null,
  isRunning: false
};

function generateSetLoggerHTML(exerciseName, setsConfig, keyPrefix) {
  let html = `
    <div class="exercise-set-logger" data-exercise="${exerciseName}">
      <h4>${exerciseName} (${setsConfig.sets} Set)</h4>
      <div class="sets-table-header">
        <span>Set</span>
        <span class="text-center">${setsConfig.placeholder}</span>
        <span class="text-center">Selesai</span>
      </div>
  `;
  for (let s = 1; s <= setsConfig.sets; s++) {
    html += `
      <div class="set-row">
        <span class="set-number-badge">${s}</span>
        <div class="set-input-wrap">
          <input type="number" class="form-input set-input" data-set="${s}" data-key="${keyPrefix}" placeholder="${setsConfig.placeholder}" min="0">
        </div>
        <div class="set-row-completed-chk">
          <input type="checkbox" class="chk-box-custom set-checkbox" onchange="handleSetCompletion(this)">
        </div>
      </div>
    `;
  }
  html += `</div>`;
  return html;
}

function handleSetCompletion(checkbox) {
  if (checkbox.checked) {
    const duration = parseInt(appState.profile.defaultRestDuration) || 90;
    startRestTimer(duration);
  }
}

function startRestTimer(durationSeconds) {
  const box = document.getElementById('rest-timer-box');
  if (box) box.style.display = 'block';

  // If already running, clear previous
  clearInterval(restTimerState.interval);

  restTimerState.totalTime = durationSeconds;
  restTimerState.timeLeft = durationSeconds;
  restTimerState.isRunning = true;

  updateRestTimerUI();

  const playPauseBtn = document.getElementById('btn-rest-play-pause');
  if (playPauseBtn) playPauseBtn.textContent = 'Jeda';

  // Reset red flashing from previous finish
  if (box) box.style.backgroundColor = '';

  restTimerState.interval = setInterval(() => {
    if (restTimerState.timeLeft > 0) {
      restTimerState.timeLeft--;
      updateRestTimerUI();
    } else {
      clearInterval(restTimerState.interval);
      restTimerState.isRunning = false;
      triggerRestTimeFinished();
    }
  }, 1000);
}

function updateRestTimerUI() {
  const display = document.getElementById('rest-time-display');
  const fill = document.getElementById('rest-progress-fill');

  if (display) {
    const mins = Math.floor(restTimerState.timeLeft / 60);
    const secs = restTimerState.timeLeft % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (fill) {
    const pct = restTimerState.totalTime > 0 ? (restTimerState.timeLeft / restTimerState.totalTime) * 100 : 0;
    fill.style.width = `${pct}%`;
  }
}

function toggleRestTimer() {
  const btn = document.getElementById('btn-rest-play-pause');
  if (restTimerState.isRunning) {
    // Pause
    clearInterval(restTimerState.interval);
    restTimerState.isRunning = false;
    if (btn) btn.textContent = 'Mulai';
  } else {
    // Resume
    restTimerState.isRunning = true;
    if (btn) btn.textContent = 'Jeda';
    
    // Reset red flashing if we adjust / play again
    const box = document.getElementById('rest-timer-box');
    if (box) box.style.backgroundColor = '';

    restTimerState.interval = setInterval(() => {
      if (restTimerState.timeLeft > 0) {
        restTimerState.timeLeft--;
        updateRestTimerUI();
      } else {
        clearInterval(restTimerState.interval);
        restTimerState.isRunning = false;
        triggerRestTimeFinished();
      }
    }, 1000);
  }
}

function adjustRestTime(seconds) {
  restTimerState.timeLeft = Math.max(0, restTimerState.timeLeft + seconds);
  restTimerState.totalTime = Math.max(restTimerState.timeLeft, restTimerState.totalTime);
  updateRestTimerUI();

  // Reset flashing if we add more time
  const box = document.getElementById('rest-timer-box');
  if (box && restTimerState.timeLeft > 0) {
    box.style.backgroundColor = '';
  }
}

function closeRestTimer() {
  clearInterval(restTimerState.interval);
  restTimerState.isRunning = false;
  const box = document.getElementById('rest-timer-box');
  if (box) {
    box.style.display = 'none';
    box.style.backgroundColor = '';
  }
}

function triggerRestTimeFinished() {
  const display = document.getElementById('rest-time-display');
  if (display) {
    display.textContent = 'SELESAI!';
  }
  
  const container = document.getElementById('rest-timer-box');
  if (container) {
    container.style.backgroundColor = 'rgba(243, 139, 168, 0.2)'; // Catppuccin Red flash
  }
  
  // Play clean synth audio beep
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio API blocked or not supported:", e);
  }
}

// --- CHART OBJECTS FOR CHART.JS ---
let calorieChart = null;
let runningChart = null;
let strengthChart = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromLocalStorage();
  setupEventListeners();
  switchTab(appState.activeTab);
  renderWorkoutDay(appState.activeWorkoutDay);
  updateDashboardUI();
  updateDateDisplay();
  initCharts();
});

// --- DATE HELPER ---
function updateDateDisplay() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  document.getElementById('current-date-str').textContent = today.toLocaleDateString('id-ID', options);
}

function getTodayDateKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// --- LOCAL STORAGE FUNCTIONS ---
function loadDataFromLocalStorage() {
  const savedState = localStorage.getItem('fittrack_ai_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      appState.profile = parsed.profile || appState.profile;
      appState.foodLogs = parsed.foodLogs || appState.foodLogs;
      appState.workoutLogs = parsed.workoutLogs || appState.workoutLogs;
      appState.activeWorkoutDay = parsed.activeWorkoutDay || 1;
      
      // Auto-set workout day to current weekday if profile is set
      if (appState.profile.isSet) {
        // Javascript Sunday is 0, Monday is 1, Saturday is 6.
        // Map: Monday(1)->Day 1, Tuesday(2)->Day 2, Wednesday(3)->Day 3, Thursday(4)->Day 4, Friday(5)->Day 5, Saturday(6)->Day 6, Sunday(0)->Day 7
        const jsDay = new Date().getDay();
        appState.activeWorkoutDay = jsDay === 0 ? 7 : jsDay;
      }
    } catch (e) {
      console.error("Error loading localStorage state:", e);
    }
  }
}

function saveToLocalStorage() {
  const stateToSave = {
    profile: appState.profile,
    foodLogs: appState.foodLogs,
    workoutLogs: appState.workoutLogs,
    activeWorkoutDay: appState.activeWorkoutDay
  };
  localStorage.setItem('fittrack_ai_state', JSON.stringify(stateToSave));
}

// --- TAB ROUTING ---
function switchTab(tabId) {
  appState.activeTab = tabId;
  
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Show target panel
  const targetPanel = document.getElementById(`tab-${tabId}`);
  if (targetPanel) targetPanel.classList.add('active');
  
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });

  // Update mobile bottom nav active state
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });

  // Update header text based on tab
  const title = document.getElementById('page-title');
  const subtitle = document.getElementById('page-subtitle');
  
  switch (tabId) {
    case 'dashboard':
      title.textContent = 'Dashboard';
      subtitle.textContent = 'Ringkasan aktivitas dan nutrisi hari ini';
      updateDashboardUI();
      break;
    case 'nutrition':
      title.textContent = 'Nutrisi & AI Tracker';
      subtitle.textContent = 'Foto makanan Anda untuk menghitung kalori instan';
      updateNutritionUI();
      break;
    case 'workout':
      title.textContent = 'Jadwal & Latihan Hybrid';
      subtitle.textContent = 'Program latihan 5 hari aktif & 2 hari pemulihan';
      renderWorkoutDay(appState.activeWorkoutDay);
      break;
    case 'analytics':
      title.textContent = 'Grafik & Analisis Progres';
      subtitle.textContent = 'Evaluasi tren kalori, pace lari, dan progressive overload';
      updateCharts();
      break;
    case 'settings':
      title.textContent = 'Profil & Pengaturan';
      subtitle.textContent = 'Hitung target metabolisme basal (BMR) dan TDEE';
      populateSettingsForm();
      renderBadgesUI();
      break;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Sidebar navigation click
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });

  // Settings form submit
  const profileForm = document.getElementById('profile-settings-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  // Quick weight submit
  const btnSaveWeight = document.getElementById('btn-save-quick-weight');
  if (btnSaveWeight) {
    btnSaveWeight.addEventListener('click', handleQuickWeightSubmit);
  }

  // Drag and Drop Image upload
  const dropzone = document.getElementById('upload-dropzone');
  const fileUploader = document.getElementById('file-uploader');
  
  if (dropzone && fileUploader) {
    dropzone.addEventListener('click', () => fileUploader.click());
    
    fileUploader.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleImageSelection(e.target.files[0]);
      }
    });
    
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--color-accent)';
    });
    
    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      if (e.dataTransfer.files.length > 0) {
        handleImageSelection(e.dataTransfer.files[0]);
      }
    });
  }

  // Scan uploaded image button
  const btnScanUploaded = document.getElementById('btn-scan-uploaded');
  if (btnScanUploaded) {
    btnScanUploaded.addEventListener('click', () => {
      const savedKey = localStorage.getItem('fittrack_gemini_api_key');
      if (appState.uploadedImageSrc) {
        if (savedKey) {
          performRealGeminiScan(appState.uploadedImageSrc, savedKey);
        } else {
          // Show simulated scan, but alert user that it is simulated
          alert('Menggunakan Mode Simulasi. Untuk analisis foto asli secara live, masukkan Google Gemini API Key Anda di Tab Profil (Pengaturan).');
          simulateAIScan(appState.uploadedImageSrc, 'Makanan Campur Sehat (Simulasi)', {
            portion: 300,
            calories: 520,
            protein: 28,
            carbs: 65,
            fat: 12,
            boundingBoxes: [
              { label: 'Sayuran Hijau', top: '10%', left: '15%', width: '40%', height: '35%', color: 'var(--color-cal)' },
              { label: 'Dada Ayam', top: '25%', left: '50%', width: '35%', height: '40%', color: 'var(--color-accent)' },
              { label: 'Nasi Merah', top: '55%', left: '20%', width: '45%', height: '35%', color: 'var(--color-carbs)' }
            ]
          });
        }
      }
    });
  }

  // Save Gemini API Key Button
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const apiKeyFeedback = document.getElementById('api-key-feedback');
  if (btnSaveApiKey && apiKeyInput) {
    // Load key immediately
    const savedKey = localStorage.getItem('fittrack_gemini_api_key');
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }
    btnSaveApiKey.addEventListener('click', () => {
      const keyVal = apiKeyInput.value.trim();
      if (keyVal) {
        localStorage.setItem('fittrack_gemini_api_key', keyVal);
        if (apiKeyFeedback) {
          apiKeyFeedback.textContent = 'Kunci API berhasil disimpan!';
          apiKeyFeedback.style.color = 'var(--color-success)';
        }
      } else {
        localStorage.removeItem('fittrack_gemini_api_key');
        if (apiKeyFeedback) {
          apiKeyFeedback.textContent = 'Kunci API dihapus.';
          apiKeyFeedback.style.color = 'var(--color-danger)';
        }
      }
      setTimeout(() => {
        if (apiKeyFeedback) apiKeyFeedback.textContent = '';
      }, 3000);
    });
  }

  // Save Food Log button from results card
  const btnSaveFoodLog = document.getElementById('btn-save-food-log');
  if (btnSaveFoodLog) {
    btnSaveFoodLog.addEventListener('click', handleSaveFoodLog);
  }

  // Manual Food Form submit
  const manualFoodForm = document.getElementById('manual-food-form');
  if (manualFoodForm) {
    manualFoodForm.addEventListener('submit', handleManualFoodSubmit);
  }

  // Stopwatch Button Triggers
  const btnTimerStartPause = document.getElementById('btn-timer-start-pause');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  if (btnTimerStartPause && btnTimerReset) {
    btnTimerStartPause.addEventListener('click', handleTimerStartPause);
    btnTimerReset.addEventListener('click', handleTimerReset);
  }

  // Workout Day Selection button triggers
  document.querySelectorAll('.calendar-day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const day = parseInt(btn.getAttribute('data-day'));
      appState.activeWorkoutDay = day;
      renderWorkoutDay(day);
      saveToLocalStorage();
    });
  });

  // Workout Log Form submit
  const workoutLogForm = document.getElementById('workout-log-form');
  if (workoutLogForm) {
    workoutLogForm.addEventListener('submit', handleWorkoutLogSubmit);
  }
}

// --- SETTINGS & PROFILE CALCULATION ---
function handleProfileSubmit(e) {
  e.preventDefault();
  
  const gender = document.getElementById('gender-input').value;
  const age = parseInt(document.getElementById('age-input').value);
  const weight = parseFloat(document.getElementById('weight-input').value);
  const height = parseFloat(document.getElementById('height-input').value);
  const activityLevel = parseFloat(document.getElementById('activity-input').value);
  const defaultRestDuration = parseInt(document.getElementById('rest-duration-input').value) || 90;
  const feedback = document.getElementById('settings-feedback');

  if (!gender || !age || !weight || !height || !activityLevel) {
    showFeedback(feedback, 'Semua kolom profil wajib diisi!', 'error');
    return;
  }

  // Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = Math.round(bmr * activityLevel);
  const targetCalories = tdee - 300; // Defisit moderat
  const targetProtein = Math.round(2.0 * weight); // 2g per kg

  appState.profile = {
    gender,
    age,
    weight,
    height,
    activityLevel: activityLevel.toString(),
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    targetProtein,
    defaultRestDuration,
    isSet: true
  };

  saveToLocalStorage();
  populateSettingsForm();
  updateDashboardUI();
  showFeedback(feedback, 'Profil dan target berhasil disimpan!', 'success');

  // Trigger charts update to align with new targets
  updateCharts();
}

function populateSettingsForm() {
  const p = appState.profile;
  if (p.isSet) {
    document.getElementById('gender-input').value = p.gender;
    document.getElementById('age-input').value = p.age;
    document.getElementById('weight-input').value = p.weight;
    document.getElementById('height-input').value = p.height;
    document.getElementById('activity-input').value = p.activityLevel;
    document.getElementById('rest-duration-input').value = p.defaultRestDuration || '90';

    // Display values
    document.getElementById('calc-bmr').textContent = `${p.bmr} kcal`;
    document.getElementById('calc-tdee').textContent = `${p.tdee} kcal`;
    document.getElementById('calc-target-cal').textContent = `${p.targetCalories} kcal`;
    document.getElementById('calc-target-prot').textContent = `${p.targetProtein} gram`;
  } else {
    document.getElementById('calc-bmr').textContent = `0 kcal`;
    document.getElementById('calc-tdee').textContent = `0 kcal`;
    document.getElementById('calc-target-cal').textContent = `0 kcal`;
    document.getElementById('calc-target-prot').textContent = `0 gram`;
  }

  // Load API Key to inputs
  const savedKey = localStorage.getItem('fittrack_gemini_api_key');
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  if (savedKey && apiKeyInput) {
    apiKeyInput.value = savedKey;
  }
}

// --- QUICK WEIGHT SUBMIT ---
function handleQuickWeightSubmit() {
  const weightInput = document.getElementById('quick-weight-input');
  const weightVal = parseFloat(weightInput.value);
  const feedback = document.getElementById('quick-weight-feedback');

  if (isNaN(weightVal) || weightVal <= 0) {
    showFeedback(feedback, 'Masukkan berat badan yang valid!', 'error');
    return;
  }

  // Update profile weight and recompute protein target
  appState.profile.weight = weightVal;
  
  if (appState.profile.isSet) {
    // Recalculate BMR and TDEE based on new weight
    let bmr = 0;
    const p = appState.profile;
    if (p.gender === 'male') {
      bmr = 10 * weightVal + 6.25 * p.height - 5 * p.age + 5;
    } else {
      bmr = 10 * weightVal + 6.25 * p.height - 5 * p.age - 161;
    }
    appState.profile.bmr = Math.round(bmr);
    appState.profile.tdee = Math.round(bmr * parseFloat(p.activityLevel));
    appState.profile.targetCalories = appState.profile.tdee - 300;
    appState.profile.targetProtein = Math.round(2.0 * weightVal);
  } else {
    // Set basic target protein even if profile not fully configured
    appState.profile.targetProtein = Math.round(2.0 * weightVal);
  }

  saveToLocalStorage();
  updateDashboardUI();
  weightInput.value = '';
  showFeedback(feedback, 'Berat badan berhasil diperbarui!', 'success');
  
  // Sync to settings tab displays
  populateSettingsForm();
  updateCharts();
}

// --- DASHBOARD UPDATER ---
function updateDashboardUI() {
  updateStreakUI();
  const p = appState.profile;
  const alertCard = document.getElementById('profile-alert');
  
  if (p.isSet) {
    alertCard.style.display = 'none';
  } else {
    alertCard.style.display = 'block';
  }

  // Calculate daily intake values
  const todayKey = getTodayDateKey();
  const todayFoods = appState.foodLogs.filter(log => log.date === todayKey);
  
  let consumedCal = 0;
  let consumedProt = 0;
  let consumedCarb = 0;
  let consumedFat = 0;
  
  todayFoods.forEach(food => {
    consumedCal += food.calories;
    consumedProt += food.protein;
    consumedCarb += food.carbs;
    consumedFat += food.fat;
  });

  const targetCal = p.targetCalories || 0;
  const targetProt = p.targetProtein || 0;
  // Standard distribution for Carbs (50%) and Fat (25%) if target calorie is active
  const targetCarb = targetCal > 0 ? Math.round((targetCal * 0.5) / 4) : 0;
  const targetFat = targetCal > 0 ? Math.round((targetCal * 0.25) / 9) : 0;

  // Calorie ring and numbers
  document.getElementById('dash-cal-consumed').textContent = consumedCal;
  document.getElementById('dash-cal-target').textContent = targetCal;
  
  const remainingCal = Math.max(0, targetCal - consumedCal);
  document.getElementById('dash-cal-remaining').textContent = `${remainingCal} kcal`;

  const deficitAmt = consumedCal - targetCal;
  const deficitEl = document.getElementById('dash-cal-deficit-status');
  if (deficitAmt <= 0) {
    deficitEl.textContent = `${Math.abs(deficitAmt)} kcal Di Bawah Batas`;
    deficitEl.className = 'val-success text-bold';
  } else {
    deficitEl.textContent = `${deficitAmt} kcal Melebihi Batas`;
    deficitEl.className = 'val-danger text-bold';
  }

  // Calorie Ring SVG stroke-dasharray
  const ringFill = document.getElementById('calorie-ring-fill');
  if (targetCal > 0) {
    const pct = Math.min(100, Math.round((consumedCal / targetCal) * 100));
    ringFill.setAttribute('stroke-dasharray', `${pct}, 100`);
    if (consumedCal > targetCal) {
      ringFill.style.stroke = 'var(--color-danger)';
    } else {
      ringFill.style.stroke = 'var(--color-cal)';
    }
  } else {
    ringFill.setAttribute('stroke-dasharray', '0, 100');
  }

  // Macros progress bars
  document.getElementById('dash-prot-consumed').textContent = consumedProt;
  document.getElementById('dash-prot-target').textContent = targetProt;
  const protPct = targetProt > 0 ? Math.min(100, Math.round((consumedProt / targetProt) * 100)) : 0;
  document.getElementById('dash-prot-bar').style.width = `${protPct}%`;

  document.getElementById('dash-carb-consumed').textContent = consumedCarb;
  document.getElementById('dash-carb-target').textContent = targetCarb;
  const carbPct = targetCarb > 0 ? Math.min(100, Math.round((consumedCarb / targetCarb) * 100)) : 0;
  document.getElementById('dash-carb-bar').style.width = `${carbPct}%`;

  document.getElementById('dash-fat-consumed').textContent = consumedFat;
  document.getElementById('dash-fat-target').textContent = targetFat;
  const fatPct = targetFat > 0 ? Math.min(100, Math.round((consumedFat / targetFat) * 100)) : 0;
  document.getElementById('dash-fat-bar').style.width = `${fatPct}%`;

  // Today's workout card
  // Map standard weekday to Day 1-7
  const jsDay = new Date().getDay();
  const todayDayIndex = jsDay === 0 ? 7 : jsDay;
  const todayWorkout = WORKOUT_SPLIT[todayDayIndex];
  
  document.getElementById('dash-workout-day-badge').textContent = `Hari ${todayDayIndex}`;
  
  if (todayWorkout && todayWorkout.exercises.length > 0 && todayDayIndex !== 3 && todayDayIndex !== 7) {
    document.getElementById('dash-workout-empty').style.display = 'none';
    document.getElementById('dash-workout-active').style.display = 'block';
    document.getElementById('dash-workout-title').textContent = todayWorkout.title;
    
    const listContainer = document.getElementById('dash-workout-exercises');
    listContainer.innerHTML = '';
    todayWorkout.exercises.forEach(ex => {
      const li = document.createElement('li');
      li.textContent = `${ex.name} (${ex.target})`;
      listContainer.appendChild(li);
    });
  } else {
    document.getElementById('dash-workout-active').style.display = 'none';
    document.getElementById('dash-workout-empty').style.display = 'block';
  }

  // Populate food log table
  populateFoodTable(todayFoods);

  // Update Recomp Status Box
  const recNutr = document.getElementById('recomp-nutrition-status');
  if (targetCal === 0) {
    recNutr.textContent = 'Belum Ada Target';
    recNutr.className = 'metric-val text-bold text-muted';
  } else if (consumedCal === 0) {
    recNutr.textContent = 'Belum Ada Log';
    recNutr.className = 'metric-val text-bold text-muted';
  } else if (consumedCal <= targetCal && consumedProt >= (targetProt * 0.8)) {
    recNutr.textContent = 'Optimal Recomp';
    recNutr.className = 'metric-val text-bold val-success';
  } else if (consumedCal > targetCal) {
    recNutr.textContent = 'Surplus Kalori';
    recNutr.className = 'metric-val text-bold val-danger';
  } else {
    recNutr.textContent = 'Kurang Protein';
    recNutr.className = 'metric-val text-bold val-warning';
  }

  // Count active workouts completed in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentWorkouts = appState.workoutLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= sevenDaysAgo && log.dayIndex !== 3 && log.dayIndex !== 7;
  });
  // Unique dates of workouts
  const uniqueDates = [...new Set(recentWorkouts.map(w => w.date))];
  document.getElementById('recomp-workout-status').textContent = `${uniqueDates.length} / 5 Hari`;
}

function populateFoodTable(foods) {
  const tbody = document.getElementById('dash-food-list-tbody');
  tbody.innerHTML = '';
  
  if (foods.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5" class="text-center text-secondary">Belum ada makanan yang dicatat hari ini.</td></tr>`;
    return;
  }

  foods.forEach(food => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-bold">${food.name}</td>
      <td>${food.portion}g</td>
      <td class="text-bold text-primary">${food.calories} kcal</td>
      <td>${food.protein}g</td>
      <td>
        <button class="btn-icon" onclick="deleteFoodLog(${food.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- NUTRITION PAGE & MOCK AI PHOTO SCANNER ---
function updateNutritionUI() {
  const todayKey = getTodayDateKey();
  const todayFoods = appState.foodLogs.filter(log => log.date === todayKey);
  
  const tbody = document.getElementById('full-food-list-tbody');
  tbody.innerHTML = '';

  let totalCal = 0;
  todayFoods.forEach(food => totalCal += food.calories);
  
  const targetCal = appState.profile.targetCalories || 0;
  document.getElementById('daily-total-calories-badge').textContent = `Total Harian: ${totalCal} / ${targetCal} kcal`;

  if (todayFoods.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8" class="text-center text-secondary">Belum ada log makanan untuk hari ini. Silakan tambahkan makanan di atas.</td></tr>`;
    return;
  }

  todayFoods.forEach(food => {
    const timestampStr = food.timestamp ? new Date(food.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${timestampStr}</td>
      <td class="text-bold">${food.name}</td>
      <td>${food.portion}g</td>
      <td class="text-bold text-primary">${food.calories} kcal</td>
      <td><span class="bullet p-bullet mr-1"></span>${food.protein}g</td>
      <td><span class="bullet c-bullet mr-1"></span>${food.carbs}g</td>
      <td><span class="bullet f-bullet mr-1"></span>${food.fat}g</td>
      <td>
        <button class="btn-icon" onclick="deleteFoodLog(${food.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setSimMode(mode) {
  appState.simMode = mode;
  document.querySelectorAll('.sim-mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('sim-presets-view').classList.remove('active');
  document.getElementById('sim-upload-view').classList.remove('active');

  if (mode === 'presets') {
    document.querySelector('.sim-mode-btn[onclick="setSimMode(\'presets\')"]').classList.add('active');
    document.getElementById('sim-presets-view').classList.add('active');
  } else {
    document.querySelector('.sim-mode-btn[onclick="setSimMode(\'upload\')"]').classList.add('active');
    document.getElementById('sim-upload-view').classList.add('active');
  }
  resetAIScanner();
}

function selectPresetMeal(presetId) {
  const meal = PRESET_MEALS[presetId];
  if (meal) {
    appState.selectedPresetMeal = meal;
    simulateAIScan(meal.imgUrl, meal.name, meal);
  }
}

function handleImageSelection(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    appState.uploadedImageSrc = e.target.result;
    document.getElementById('upload-dropzone').style.display = 'none';
    const previewContainer = document.getElementById('uploaded-preview-container');
    previewContainer.style.display = 'flex';
    document.getElementById('uploaded-preview-img').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearUploadedImage() {
  appState.uploadedImageSrc = null;
  document.getElementById('uploaded-preview-container').style.display = 'none';
  document.getElementById('upload-dropzone').style.display = 'flex';
  document.getElementById('file-uploader').value = '';
}

function simulateAIScan(imgUrl, foodName, macrosObj) {
  const scannerOverlay = document.getElementById('scanner-animation-container');
  const scanningImg = document.getElementById('scanning-img-src');
  
  // Set image inside scanner
  scanningImg.src = imgUrl;
  scannerOverlay.style.display = 'flex';
  
  // Wait 2.5 seconds to simulate complex Vision API computation
  setTimeout(() => {
    scannerOverlay.style.display = 'none';
    showAIScanResults(foodName, macrosObj, imgUrl);
  }, 2500);
}

function performRealGeminiScan(imgSrc, apiKey) {
  const scannerOverlay = document.getElementById('scanner-animation-container');
  const scanningImg = document.getElementById('scanning-img-src');
  
  // Set image inside scanner
  scanningImg.src = imgSrc;
  scannerOverlay.style.display = 'flex';
  
  // Parse base64 parts
  const mimeType = imgSrc.match(/data:([^;]+);base64,/)[1];
  const base64Data = imgSrc.split(',')[1];
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Anda adalah AI Ahli Nutrisi dan Dietisien Profesional. Analisis gambar makanan yang diunggah oleh pengguna ini.
Tugas Anda:
1. Identifikasi nama makanan utama (misal: "Nasi Goreng + Telur Ceplok").
2. Estimasikan berat porsi total dalam gram (misal: 250).
3. Estimasikan nilai makronutrien: Kalori total (kcal), Protein (g), Karbohidrat (g), dan Lemak (g).
4. Identifikasi 1 hingga 4 komponen makanan utama dalam gambar dan tentukan koordinat kotak pembatas (bounding box) mereka. Koordinat harus dinormalisasi dari 0 hingga 1000 dalam format [ymin, xmin, ymax, xmax], di mana (0,0) adalah sudut kiri atas gambar.

Kembalikan jawaban dalam format JSON yang valid dengan struktur berikut:
{
  "name": "Nama Makanan",
  "portion": berat_dalam_gram_sebagai_angka,
  "calories": kalori_sebagai_angka,
  "protein": protein_sebagai_angka,
  "carbs": karbohidrat_sebagai_angka,
  "fat": lemak_sebagai_angka,
  "boundingBoxes": [
    {
      "label": "Nama Komponen",
      "ymin": ymin_0_hingga_1000,
      "xmin": xmin_0_hingga_1000,
      "ymax": ymax_0_hingga_1000,
      "xmax": xmax_0_hingga_1000
    }
  ]
}
Jangan sertakan markdown wrapper seperti \`\`\`json atau \`\`\` di sekitar output Anda. Pastikan itu adalah JSON murni yang valid.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };
  
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    scannerOverlay.style.display = 'none';
    
    // Extract JSON response text
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const responseText = data.candidates[0].content.parts[0].text.trim();
      
      try {
        const parsed = JSON.parse(responseText);
        
        // Translate ymin, xmin, ymax, xmax coordinates to CSS top, left, width, height percentages
        const colors = ['#cba6f7', '#89b4fa', '#a6e3a1', '#f9e2af', '#f5c2e7'];
        let boxIdx = 0;
        
        const mappedBoxes = (parsed.boundingBoxes || []).map(box => {
          const top = (box.ymin / 10).toFixed(1) + '%';
          const left = (box.xmin / 10).toFixed(1) + '%';
          const width = ((box.xmax - box.xmin) / 10).toFixed(1) + '%';
          const height = ((box.ymax - box.ymin) / 10).toFixed(1) + '%';
          const color = colors[boxIdx % colors.length];
          boxIdx++;
          
          return {
            label: box.label,
            top,
            left,
            width,
            height,
            color
          };
        });
        
        const macros = {
          portion: parsed.portion || 250,
          calories: parsed.calories || 0,
          protein: parsed.protein || 0,
          carbs: parsed.carbs || 0,
          fat: parsed.fat || 0,
          boundingBoxes: mappedBoxes
        };
        
        showAIScanResults(parsed.name || 'Hasil Deteksi Gemini AI', macros, imgSrc);
      } catch (err) {
        console.error('Failed to parse Gemini JSON output:', err, responseText);
        alert('Gagal memproses respons format JSON dari Gemini AI. Silakan coba kembali.');
      }
    } else {
      throw new Error('Invalid structure in Gemini response');
    }
  })
  .catch(err => {
    scannerOverlay.style.display = 'none';
    console.error('Gemini API Error:', err);
    alert('Terjadi kesalahan saat memanggil Gemini API. Pastikan kunci API Anda aktif, benar, dan terhubung ke internet.');
  });
}

function showAIScanResults(foodName, data, imgUrl) {
  document.getElementById('ai-status-badge').style.display = 'inline-block';
  document.getElementById('result-placeholder').style.display = 'none';
  
  const activeResult = document.getElementById('result-data-active');
  activeResult.style.display = 'flex';

  // Set detected image src
  const detectedImg = document.getElementById('result-detected-img');
  if (detectedImg) {
    detectedImg.src = imgUrl;
  }

  // Draw bounding boxes on result image container
  const overlayContainer = document.getElementById('result-image-overlay-container');
  if (overlayContainer) {
    // Clear previous boxes
    const existingBoxes = overlayContainer.querySelectorAll('.bounding-box');
    existingBoxes.forEach(box => box.remove());

    // Generate or use box definitions
    const boxesData = data.boundingBoxes || [
      { label: 'Deteksi Makanan', top: '25%', left: '25%', width: '50%', height: '50%', color: 'var(--color-accent)' }
    ];

    boxesData.forEach(box => {
      const boxEl = document.createElement('div');
      boxEl.className = 'bounding-box';
      boxEl.style.top = box.top;
      boxEl.style.left = box.left;
      boxEl.style.width = box.width;
      boxEl.style.height = box.height;
      boxEl.style.borderColor = box.color || 'var(--color-accent)';
      boxEl.style.boxShadow = `0 0 10px ${box.color || 'var(--color-accent)'}`;
      
      const labelEl = document.createElement('span');
      labelEl.className = 'bounding-box-label';
      labelEl.textContent = box.label;
      if (box.color) {
        labelEl.style.backgroundColor = box.color;
      }
      
      boxEl.appendChild(labelEl);
      overlayContainer.appendChild(boxEl);
    });
  }

  // Fill in inputs and labels
  document.getElementById('result-food-name').textContent = foodName;
  document.getElementById('result-portion').value = data.portion;
  
  // Cache original macros as attributes so we can scale them if portion changes
  activeResult.setAttribute('data-base-portion', data.portion);
  activeResult.setAttribute('data-base-cal', data.calories);
  activeResult.setAttribute('data-base-protein', data.protein);
  activeResult.setAttribute('data-base-carbs', data.carbs);
  activeResult.setAttribute('data-base-fat', data.fat);

  updateScaledResultMacros();

  // Add event listener to portion change input
  const portionInput = document.getElementById('result-portion');
  portionInput.oninput = updateScaledResultMacros;
}

function updateScaledResultMacros() {
  const activeResult = document.getElementById('result-data-active');
  const portionInput = document.getElementById('result-portion');
  
  const basePortion = parseFloat(activeResult.getAttribute('data-base-portion'));
  const baseCal = parseFloat(activeResult.getAttribute('data-base-cal'));
  const baseProt = parseFloat(activeResult.getAttribute('data-base-protein'));
  const baseCarb = parseFloat(activeResult.getAttribute('data-base-carbs'));
  const baseFat = parseFloat(activeResult.getAttribute('data-base-fat'));
  
  const currentPortion = parseFloat(portionInput.value) || 0;
  const ratio = basePortion > 0 ? currentPortion / basePortion : 0;

  document.getElementById('result-cal').textContent = Math.round(baseCal * ratio);
  document.getElementById('result-protein').textContent = Math.round(baseProt * ratio);
  document.getElementById('result-carbs').textContent = Math.round(baseCarb * ratio);
  document.getElementById('result-fat').textContent = Math.round(baseFat * ratio);
}

function resetAIScanner() {
  document.getElementById('ai-status-badge').style.display = 'none';
  document.getElementById('result-data-active').style.display = 'none';
  document.getElementById('result-placeholder').style.display = 'flex';

  const overlayContainer = document.getElementById('result-image-overlay-container');
  if (overlayContainer) {
    const existingBoxes = overlayContainer.querySelectorAll('.bounding-box');
    existingBoxes.forEach(box => box.remove());
  }
  
  appState.selectedPresetMeal = null;
  clearUploadedImage();
}

function handleSaveFoodLog() {
  const activeResult = document.getElementById('result-data-active');
  const name = document.getElementById('result-food-name').textContent;
  const portion = parseInt(document.getElementById('result-portion').value) || 100;
  
  const calories = parseInt(document.getElementById('result-cal').textContent);
  const protein = parseInt(document.getElementById('result-protein').textContent);
  const carbs = parseInt(document.getElementById('result-carbs').textContent);
  const fat = parseInt(document.getElementById('result-fat').textContent);

  const newLog = {
    id: Date.now(),
    date: getTodayDateKey(),
    name,
    portion,
    calories,
    protein,
    carbs,
    fat,
    timestamp: Date.now()
  };

  appState.foodLogs.push(newLog);
  saveToLocalStorage();
  updateNutritionUI();
  updateDashboardUI();
  resetAIScanner();

  // Scroll down to logs table
  document.getElementById('full-food-log-table').scrollIntoView({ behavior: 'smooth' });
}

// --- MANUAL FOOD MODAL ---
function openManualFoodModal() {
  document.getElementById('manual-food-modal').style.display = 'flex';
}

function closeManualFoodModal() {
  document.getElementById('manual-food-modal').style.display = 'none';
  document.getElementById('manual-food-form').reset();
}

function handleManualFoodSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('manual-food-name-input').value;
  const portion = parseInt(document.getElementById('manual-portion-input').value);
  const calories = parseInt(document.getElementById('manual-cal-input').value);
  const protein = parseInt(document.getElementById('manual-prot-input').value);
  const carbs = parseInt(document.getElementById('manual-carb-input').value);
  const fat = parseInt(document.getElementById('manual-fat-input').value);

  const newLog = {
    id: Date.now(),
    date: getTodayDateKey(),
    name,
    portion,
    calories,
    protein,
    carbs,
    fat,
    timestamp: Date.now()
  };

  appState.foodLogs.push(newLog);
  saveToLocalStorage();
  updateNutritionUI();
  updateDashboardUI();
  closeManualFoodModal();
}

function deleteFoodLog(id) {
  appState.foodLogs = appState.foodLogs.filter(log => log.id !== id);
  saveToLocalStorage();
  updateDashboardUI();
  updateNutritionUI();
  updateCharts();
}

// --- WORKOUT ENGINE (CALENDAR & LOGGER) ---
function renderWorkoutDay(dayIndex) {
  appState.activeWorkoutDay = dayIndex;
  
  // Highlight calendar day
  document.querySelectorAll('.calendar-day-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-day')) === dayIndex) {
      btn.classList.add('active');
    }
  });

  const workout = WORKOUT_SPLIT[dayIndex];
  if (!workout) return;

  document.getElementById('workout-day-title').textContent = workout.title;
  document.getElementById('workout-day-desc').textContent = workout.desc;

  const container = document.getElementById('exercises-list-container');
  container.innerHTML = '';

  workout.exercises.forEach(ex => {
    const box = document.createElement('div');
    box.className = 'exercise-item-box';
    box.innerHTML = `
      <div class="exercise-name-row">
        <h4>${ex.name}</h4>
        <span class="exercise-target-tag">${ex.target}</span>
      </div>
      <p class="exercise-notes">${ex.note}</p>
    `;
    container.appendChild(box);
  });

  // Generate input fields dynamically in the sidebar logger
  const fieldsContainer = document.getElementById('workout-input-fields');
  fieldsContainer.innerHTML = '';

  // Show stopwatch recommendation suggestions box only on Tuck FL or Plank
  const stopwatchSuggest = document.getElementById('stopwatch-suggestion-box');
  stopwatchSuggest.style.display = 'none';

  // Specific forms depending on exercises (using set logger for strength/holds)
  if (dayIndex === 1) { // Pull/Push
    fieldsContainer.innerHTML = `
      ${generateSetLoggerHTML('Tuck Front Lever Hold', SETS_EXERCISES['Tuck Front Lever Hold'], 'tuckFLHold')}
      ${generateSetLoggerHTML('Dips', SETS_EXERCISES['Dips'], 'dipsMaxReps')}
      <div class="form-group">
        <label class="form-label">Sesi Sprint HIIT Selesai?</label>
        <select id="input-hiit-status" class="form-input">
          <option value="yes">Ya (Selesai 5 Set Sprint)</option>
          <option value="no">Tidak Selesai</option>
        </select>
      </div>
    `;
  } else if (dayIndex === 2) { // Cardio LISS
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label for="input-run-distance" class="form-label">Jarak Tempuh Lari (KM)</label>
        <input type="number" id="input-run-distance" placeholder="Contoh: 4.2" step="0.01" required min="0" class="form-input">
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label for="input-run-min" class="form-label">Waktu Tempuh (Menit)</label>
          <input type="number" id="input-run-min" placeholder="25" required min="0" class="form-input">
        </div>
        <div class="form-group">
          <label for="input-run-sec" class="form-label">Waktu Tempuh (Detik)</label>
          <input type="number" id="input-run-sec" placeholder="30" required min="0" max="59" class="form-input">
        </div>
      </div>
      ${generateSetLoggerHTML('Plank', SETS_EXERCISES['Plank'], 'plankHold')}
    `;
  } else if (dayIndex === 4) { // Strength/Volume
    fieldsContainer.innerHTML = `
      ${generateSetLoggerHTML('Active Scapula Hangs', SETS_EXERCISES['Active Scapula Hangs'], 'scapulaHangs')}
      ${generateSetLoggerHTML('Tuck Front Lever Hold', SETS_EXERCISES['Tuck Front Lever Hold'], 'tuckFLHold')}
      ${generateSetLoggerHTML('Dips (Eksentrik Lambat)', SETS_EXERCISES['Dips (Eksentrik Lambat)'], 'dipsMaxReps')}
      <div class="form-group">
        <label for="input-recovery-run-done" class="form-label">Selesai Lari Recovery 15-20 Mnt?</label>
        <select id="input-recovery-run-done" class="form-input">
          <option value="yes">Ya, Selesai</option>
          <option value="no">Tidak</option>
        </select>
      </div>
    `;
  } else if (dayIndex === 5) { // Cardio & Core
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label for="input-run-distance" class="form-label">Jarak Tempuh Lari (KM)</label>
        <input type="number" id="input-run-distance" placeholder="Contoh: 5.0" step="0.01" required min="0" class="form-input">
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label for="input-run-min" class="form-label">Waktu Tempuh (Menit)</label>
          <input type="number" id="input-run-min" placeholder="28" required min="0" class="form-input">
        </div>
        <div class="form-group">
          <label for="input-run-sec" class="form-label">Waktu Tempuh (Detik)</label>
          <input type="number" id="input-run-sec" placeholder="0" required min="0" max="59" class="form-input">
        </div>
      </div>
      ${generateSetLoggerHTML('Leg Raises', SETS_EXERCISES['Leg Raises'], 'legRaises')}
      ${generateSetLoggerHTML('Hollow Body Hold', SETS_EXERCISES['Hollow Body Hold'], 'hollowHold')}
    `;
  } else if (dayIndex === 6) { // Peak Performance
    fieldsContainer.innerHTML = `
      ${generateSetLoggerHTML('Tuck Front Lever Max Hold', SETS_EXERCISES['Tuck Front Lever Max Hold'], 'tuckFLHold')}
      ${generateSetLoggerHTML('Dips Max Repetitions', SETS_EXERCISES['Dips Max Repetitions'], 'dipsMaxReps')}
      <div class="form-group">
        <label for="input-recovery-run-done" class="form-label">Selesai Lari Pemulihan 15 Mnt?</label>
        <select id="input-recovery-run-done" class="form-input">
          <option value="yes">Ya, Selesai</option>
          <option value="no">Tidak</option>
        </select>
      </div>
    `;
  } else { // Recovery / Rest Days (Day 3 & 7)
    fieldsContainer.innerHTML = `
      <p class="text-secondary label-xs text-center">Hari pemulihan aktif. Tidak ada input reps olahraga beban berat yang dicatat.</p>
      <div class="form-group mt-2">
        <label for="input-recovery-notes" class="form-label">Catatan Pemulihan / Peregangan</label>
        <select id="input-recovery-notes" class="form-input">
          <option value="stretching-done">Selesai Peregangan / Stretching Aktif</option>
          <option value="rest-only">Istirahat Total</option>
        </select>
      </div>
    `;
  }

  // Populate Workout history list
  populateWorkoutTable();
}

function populateWorkoutTable() {
  const tbody = document.getElementById('workout-history-tbody');
  tbody.innerHTML = '';
  
  if (appState.workoutLogs.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5" class="text-center text-secondary">Belum ada riwayat latihan. Silakan lakukan latihan dan simpan log di atas.</td></tr>`;
    return;
  }

  // Sort logs descending (newest first)
  const sortedLogs = [...appState.workoutLogs].sort((a,b) => new Date(b.date) - new Date(a.date));

  // Helper to format logs (arrays or single values)
  const formatExVal = (val, suffix) => {
    if (!val) return '';
    if (Array.isArray(val)) {
      const filtered = val.filter(v => v > 0);
      if (filtered.length === 0) return '';
      return `[${filtered.join(', ')}] ${suffix}`;
    }
    return `${val} ${suffix}`;
  };

  sortedLogs.forEach(log => {
    const workoutDetails = WORKOUT_SPLIT[log.dayIndex];
    let detailString = '';
    
    // Construct readable text based on logged parameters
    const ex = log.exercises;
    if (ex.tuckFLHold) {
      const f = formatExVal(ex.tuckFLHold, 's');
      if (f) detailString += `Tuck FL: ${f}. `;
    }
    if (ex.dipsMaxReps) {
      const f = formatExVal(ex.dipsMaxReps, 'reps');
      if (f) detailString += `Dips: ${f}. `;
    }
    if (ex.runDistance) {
      const minStr = Math.floor(ex.runTimeSeconds / 60);
      const secStr = ex.runTimeSeconds % 60;
      detailString += `Lari: ${ex.runDistance} KM (${minStr}m ${secStr}s), Pace: ${formatPace(ex.runPaceMinutes)}. `;
    }
    if (ex.plankHold) {
      const f = formatExVal(ex.plankHold, 's');
      if (f) detailString += `Plank: ${f}. `;
    }
    if (ex.scapulaHangs) {
      const f = formatExVal(ex.scapulaHangs, 'reps');
      if (f) detailString += `Scapula Hangs: ${f}. `;
    }
    if (ex.legRaises) {
      const f = formatExVal(ex.legRaises, 'reps');
      if (f) detailString += `Leg Raises: ${f}. `;
    }
    if (ex.hollowHold) {
      const f = formatExVal(ex.hollowHold, 's');
      if (f) detailString += `Hollow Hold: ${f}. `;
    }
    if (ex.recoveryNotes) detailString += `Pemulihan: ${ex.recoveryNotes === 'stretching-done' ? 'Stretching Aktif Selesai' : 'Istirahat Total'}. `;
    if (ex.hiitStatus) detailString += `HIIT Sprint: ${ex.hiitStatus === 'yes' ? 'Selesai' : 'Tidak Selesai'}. `;
    if (ex.recoveryRunDone) detailString += `Lari Recovery: ${ex.recoveryRunDone === 'yes' ? 'Selesai' : 'Tidak'}. `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(log.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
      <td class="text-bold">Hari ${log.dayIndex}</td>
      <td class="text-bold text-accent">${workoutDetails ? workoutDetails.title : 'Workout'}</td>
      <td>${detailString}</td>
      <td>
        <button class="btn-icon" onclick="deleteWorkoutLog(${log.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteWorkoutLog(id) {
  appState.workoutLogs = appState.workoutLogs.filter(log => log.id !== id);
  saveToLocalStorage();
  populateWorkoutTable();
  updateDashboardUI();
  updateCharts();
}

// --- STOPWATCH / TIMER CONTROLLER ---
function handleTimerStartPause() {
  const btn = document.getElementById('btn-timer-start-pause');
  
  if (appState.timer.isRunning) {
    // Pause stopwatch
    appState.timer.isRunning = false;
    btn.textContent = 'Mulai';
    btn.className = 'btn btn-primary stopwatch-btn';
    clearInterval(appState.timer.timerInterval);
    
    // Check if we should recommend hold time
    const totalSeconds = Math.round(appState.timer.elapsedTime / 1000);
    if (totalSeconds > 0) {
      document.getElementById('stopwatch-suggestion-box').style.display = 'block';
      document.getElementById('suggested-hold-val').textContent = totalSeconds;
      
      const btnUseHold = document.getElementById('btn-use-hold-time');
      btnUseHold.onclick = () => {
        const fieldsContainer = document.getElementById('workout-input-fields');
        const setInputs = fieldsContainer.querySelectorAll('.set-input');
        if (setInputs.length > 0) {
          let filled = false;
          for (let input of setInputs) {
            const key = input.getAttribute('data-key');
            if ((key === 'tuckFLHold' || key === 'plankHold' || key === 'hollowHold') && !input.value) {
              input.value = totalSeconds;
              filled = true;
              break;
            }
          }
          if (!filled) {
            for (let input of setInputs) {
              const key = input.getAttribute('data-key');
              if (key === 'tuckFLHold' || key === 'plankHold' || key === 'hollowHold') {
                input.value = totalSeconds;
                break;
              }
            }
          }
        }
        document.getElementById('stopwatch-suggestion-box').style.display = 'none';
      };
    }
  } else {
    // Start stopwatch
    appState.timer.isRunning = true;
    btn.textContent = 'Jeda';
    btn.className = 'btn btn-danger stopwatch-btn';
    appState.timer.startTime = Date.now() - appState.timer.elapsedTime;
    
    appState.timer.timerInterval = setInterval(() => {
      appState.timer.elapsedTime = Date.now() - appState.timer.startTime;
      updateStopwatchDisplay();
    }, 10);
  }
}

function handleTimerReset() {
  appState.timer.isRunning = false;
  clearInterval(appState.timer.timerInterval);
  appState.timer.elapsedTime = 0;
  updateStopwatchDisplay();
  
  const btn = document.getElementById('btn-timer-start-pause');
  btn.textContent = 'Mulai';
  btn.className = 'btn btn-primary stopwatch-btn';
  document.getElementById('stopwatch-suggestion-box').style.display = 'none';
}

function updateStopwatchDisplay() {
  const display = document.getElementById('stopwatch-display');
  let ms = Math.floor((appState.timer.elapsedTime % 1000) / 10);
  let sec = Math.floor((appState.timer.elapsedTime / 1000) % 60);
  let min = Math.floor((appState.timer.elapsedTime / 60000) % 60);

  ms = ms < 10 ? '0' + ms : ms;
  sec = sec < 10 ? '0' + sec : sec;
  min = min < 10 ? '0' + min : min;

  display.textContent = `${min}:${sec}.${ms}`;
}

// --- WORKOUT LOG SUBMIT ---
function handleWorkoutLogSubmit(e) {
  e.preventDefault();
  
  const dayIndex = appState.activeWorkoutDay;
  const feedback = document.getElementById('workout-log-feedback');

  const exercises = {};
  
  // Collect set inputs dynamically
  const fieldsContainer = document.getElementById('workout-input-fields');
  const setInputs = fieldsContainer.querySelectorAll('.set-input');
  
  setInputs.forEach(input => {
    const key = input.getAttribute('data-key');
    const val = parseInt(input.value) || 0;
    if (!exercises[key]) {
      exercises[key] = [];
    }
    exercises[key].push(val);
  });

  // Construct other fields (run, recovery notes, etc.)
  const runDistEl = document.getElementById('input-run-distance');
  const runMinEl = document.getElementById('input-run-min');
  const runSecEl = document.getElementById('input-run-sec');
  const recoveryNotesEl = document.getElementById('input-recovery-notes');
  const hiitStatusEl = document.getElementById('input-hiit-status');
  const recoveryRunDoneEl = document.getElementById('input-recovery-run-done');

  if (recoveryNotesEl) exercises.recoveryNotes = recoveryNotesEl.value;
  if (hiitStatusEl) exercises.hiitStatus = hiitStatusEl.value;
  if (recoveryRunDoneEl) exercises.recoveryRunDone = recoveryRunDoneEl.value;

  if (runDistEl) {
    const dist = parseFloat(runDistEl.value) || 0;
    const min = parseInt(runMinEl.value) || 0;
    const sec = parseInt(runSecEl.value) || 0;
    const totalSeconds = (min * 60) + sec;
    
    // Pace: Total minutes divided by distance
    const totalMinutes = totalSeconds / 60;
    const paceMin = dist > 0 ? totalMinutes / dist : 0;

    exercises.runDistance = dist;
    exercises.runTimeSeconds = totalSeconds;
    exercises.runPaceMinutes = paceMin;
  }

  const newLog = {
    id: Date.now(),
    date: getTodayDateKey(),
    dayIndex,
    exercises
  };

  // Prevent multiple logs of the same day in the same date (updates instead)
  appState.workoutLogs = appState.workoutLogs.filter(log => !(log.date === newLog.date && log.dayIndex === newLog.dayIndex));

  appState.workoutLogs.push(newLog);
  saveToLocalStorage();
  populateWorkoutTable();
  updateDashboardUI();
  resetWorkoutLogForm();
  showFeedback(feedback, 'Log latihan berhasil disimpan!', 'success');

  // Trigger charts update
  updateCharts();

  // Scroll to history table
  document.getElementById('workout-history-table').scrollIntoView({ behavior: 'smooth' });
}

function resetWorkoutLogForm() {
  document.getElementById('workout-log-form').reset();
  handleTimerReset();
  closeRestTimer();
}

function showFeedback(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback-msg ${type}`;
  setTimeout(() => {
    el.textContent = '';
  }, 4000);
}

// --- PACE FORMATTERS ---
function formatPace(decimalMinutes) {
  if (!decimalMinutes || decimalMinutes === 0) return '0:00';
  const min = Math.floor(decimalMinutes);
  const sec = Math.round((decimalMinutes - min) * 60);
  const secStr = sec < 10 ? '0' + sec : sec;
  return `${min}:${secStr}`;
}

// --- RESET ALL DATA ---
function resetAllApplicationData() {
  if (confirm("Apakah Anda yakin ingin menghapus semua profil, log makanan, dan log latihan? Tindakan ini tidak dapat dibatalkan.")) {
    localStorage.removeItem('fittrack_ai_state');
    appState = {
      activeTab: 'settings',
      profile: { gender: '', age: 0, weight: 0, height: 0, activityLevel: '', bmr: 0, tdee: 0, targetCalories: 0, targetProtein: 0, isSet: false },
      foodLogs: [],
      workoutLogs: [],
      activeWorkoutDay: 1,
      simMode: 'presets',
      selectedPresetMeal: null,
      uploadedImageSrc: null,
      timer: { isRunning: false, startTime: 0, elapsedTime: 0, timerInterval: null }
    };
    saveToLocalStorage();
    location.reload();
  }
}

// --- CHART.JS CONFIGURATION ---
function initCharts() {
  const ctxCal = document.getElementById('chart-calories').getContext('2d');
  const ctxRun = document.getElementById('chart-running').getContext('2d');
  const ctxStr = document.getElementById('chart-strength').getContext('2d');

  // Linear Gradients for premium styling
  const gradCal = ctxCal.createLinearGradient(0, 0, 0, 220);
  gradCal.addColorStop(0, 'rgba(166, 227, 161, 0.4)'); // Green
  gradCal.addColorStop(1, 'rgba(166, 227, 161, 0.01)');

  const gradRun = ctxRun.createLinearGradient(0, 0, 0, 220);
  gradRun.addColorStop(0, 'rgba(137, 180, 250, 0.4)'); // Blue
  gradRun.addColorStop(1, 'rgba(137, 180, 250, 0.01)');

  const gradStr = ctxStr.createLinearGradient(0, 0, 0, 220);
  gradStr.addColorStop(0, 'rgba(137, 220, 235, 0.4)'); // Sky
  gradStr.addColorStop(1, 'rgba(137, 220, 235, 0.01)');

  // Common dark themes chart defaults (Catppuccin Mocha)
  Chart.defaults.color = '#a6adc8'; // Subtext0
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Chart 1: Calories Consumed vs Budget
  calorieChart = new Chart(ctxCal, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Asupan Harian',
          data: [],
          backgroundColor: gradCal,
          borderColor: '#a6e3a1', // Green
          borderWidth: 2,
          borderRadius: 4
        },
        {
          label: 'Target Defisit',
          data: [],
          type: 'line',
          borderColor: '#cba6f7', // Mauve
          borderWidth: 2.5,
          pointBackgroundColor: '#cba6f7',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#181825',
          titleColor: '#cdd6f4',
          bodyColor: '#a6adc8',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Kalori (kcal)' }
        }
      }
    }
  });

  // Chart 2: Running Progress (Multi-axis: Distance (KM) & Pace)
  runningChart = new Chart(ctxRun, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Jarak (KM)',
          data: [],
          borderColor: '#89b4fa', // Blue
          backgroundColor: gradRun,
          borderWidth: 3,
          yAxisID: 'yDist',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Rata-rata Pace (Min/KM)',
          data: [],
          borderColor: '#f9e2af', // Yellow
          borderWidth: 3,
          yAxisID: 'yPace',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#181825',
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.datasetIndex === 1) { // Pace axis
                label += formatPace(context.parsed.y) + ' /KM';
              } else {
                label += context.parsed.y + ' KM';
              }
              return label;
            }
          }
        }
      },
      scales: {
        yDist: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: { display: true, text: 'Jarak (KM)' }
        },
        yPace: {
          type: 'linear',
          position: 'right',
          reverse: true, // A lower pace is faster/better
          title: { display: true, text: 'Pace (Menit/KM)' },
          ticks: {
            callback: function(value) {
              return formatPace(value);
            }
          },
          grid: { drawOnChartArea: false } // Only draw grid for left axis
        }
      }
    }
  });

  // Chart 3: Strength Progressive Overload (Dual Line: Tuck FL Hold Time & Dips Max Reps)
  strengthChart = new Chart(ctxStr, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Max Hold Tuck FL (Detik)',
          data: [],
          borderColor: '#89dceb', // Sky
          backgroundColor: gradStr,
          borderWidth: 3,
          yAxisID: 'yHold',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Max Reps Dips',
          data: [],
          borderColor: '#f5c2e7', // Pink
          borderWidth: 3,
          yAxisID: 'yReps',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        yHold: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: { display: true, text: 'Hold Time (detik)' }
        },
        yReps: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: { display: true, text: 'Repetisi Dips' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });

  updateCharts();
}

function updateCharts() {
  if (!calorieChart || !runningChart || !strengthChart) return;

  // Retrieve last 14 dates to establish a clean timeline
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const shortDateLabels = dates.map(dt => {
    const parts = dt.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  const targetCal = appState.profile.targetCalories || 0;

  // --- 1. Calorie Chart Data ---
  const calConsumedData = dates.map(dt => {
    const logs = appState.foodLogs.filter(f => f.date === dt);
    let sum = 0;
    logs.forEach(f => sum += f.calories);
    return sum;
  });
  const calTargetData = dates.map(() => targetCal);

  calorieChart.data.labels = shortDateLabels;
  calorieChart.data.datasets[0].data = calConsumedData;
  calorieChart.data.datasets[1].data = calTargetData;
  calorieChart.update();

  // --- 2. Running Progress Data ---
  // We extract all workout sessions that have a run log
  const runningSessions = appState.workoutLogs
    .filter(log => log.exercises && log.exercises.runDistance > 0)
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  const runLabels = runningSessions.map(log => {
    const parts = log.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  const runDistances = runningSessions.map(log => log.exercises.runDistance);
  const runPaces = runningSessions.map(log => log.exercises.runPaceMinutes);

  // Fallback if no running logs logged yet to avoid rendering empty boxes
  runningChart.data.labels = runLabels.length > 0 ? runLabels : shortDateLabels.slice(7);
  runningChart.data.datasets[0].data = runDistances.length > 0 ? runDistances : Array(7).fill(0);
  runningChart.data.datasets[1].data = runPaces.length > 0 ? runPaces : Array(7).fill(0);
  runningChart.update();

  // --- 3. Strength Overload Data ---
  // Extract workout sessions with strength parameters (Tuck FL hold or Dips max reps)
  const strengthSessions = appState.workoutLogs
    .filter(log => {
      if (!log.exercises) return false;
      const fl = log.exercises.tuckFLHold;
      const dips = log.exercises.dipsMaxReps;
      const hasFl = Array.isArray(fl) ? fl.some(v => v > 0) : (fl > 0);
      const hasDips = Array.isArray(dips) ? dips.some(v => v > 0) : (dips > 0);
      return hasFl || hasDips;
    })
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  const strengthLabels = strengthSessions.map(log => {
    const parts = log.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  const getMaxValue = (val) => {
    if (!val) return 0;
    if (Array.isArray(val)) {
      const activeVals = val.filter(v => v > 0);
      return activeVals.length > 0 ? Math.max(...activeVals) : 0;
    }
    return val;
  };

  const flHolds = strengthSessions.map(log => getMaxValue(log.exercises.tuckFLHold));
  const dipsReps = strengthSessions.map(log => getMaxValue(log.exercises.dipsMaxReps));

  strengthChart.data.labels = strengthLabels.length > 0 ? strengthLabels : shortDateLabels.slice(7);
  strengthChart.data.datasets[0].data = flHolds.length > 0 ? flHolds : Array(7).fill(0);
  strengthChart.data.datasets[1].data = dipsReps.length > 0 ? dipsReps : Array(7).fill(0);
  strengthChart.update();

  // --- 4. Mini Metric Badges in Analytics Panel ---
  const bestPace = runPaces.length > 0 ? Math.min(...runPaces) : 0;
  const maxHold = flHolds.length > 0 ? Math.max(...flHolds) : 0;
  const maxDips = dipsReps.length > 0 ? Math.max(...dipsReps) : 0;

  document.getElementById('analytics-max-hold').innerHTML = `${maxHold} <span class="unit-xs">detik</span>`;
  document.getElementById('analytics-max-reps').innerHTML = `${maxDips} <span class="unit-xs">reps</span>`;
  document.getElementById('analytics-best-pace').innerHTML = `${formatPace(bestPace)} <span class="unit-xs">/KM</span>`;

  // Trend percentages (comparing last session to first session in list)
  const holdPctEl = document.getElementById('hold-progress-pct');
  if (flHolds.length > 1) {
    const diff = flHolds[flHolds.length - 1] - flHolds[0];
    const sign = diff >= 0 ? '+' : '';
    holdPctEl.textContent = `${sign}${diff}s`;
    holdPctEl.className = diff >= 0 ? 'label-xs text-success' : 'label-xs text-danger';
  } else {
    holdPctEl.textContent = 'Stabil';
    holdPctEl.className = 'label-xs text-muted';
  }

  const repsPctEl = document.getElementById('reps-progress-pct');
  if (dipsReps.length > 1) {
    const diff = dipsReps[dipsReps.length - 1] - dipsReps[0];
    const sign = diff >= 0 ? '+' : '';
    repsPctEl.textContent = `${sign}${diff} reps`;
    repsPctEl.className = diff >= 0 ? 'label-xs text-success' : 'label-xs text-danger';
  } else {
    repsPctEl.textContent = 'Stabil';
    repsPctEl.className = 'label-xs text-muted';
  }

  const pacePctEl = document.getElementById('pace-progress-pct');
  if (runPaces.length > 1) {
    const firstPace = runPaces[0];
    const lastPace = runPaces[runPaces.length - 1];
    const pctDiff = Math.round(((firstPace - lastPace) / firstPace) * 100); // positive is better (decrease in pace time)
    const sign = pctDiff >= 0 ? '+' : '';
    pacePctEl.textContent = `${sign}${pctDiff}% Efisiensi`;
    pacePctEl.className = pctDiff >= 0 ? 'label-xs text-success' : 'label-xs text-danger';
  } else {
    pacePctEl.textContent = 'Stabil';
    pacePctEl.className = 'label-xs text-muted';
  }
}

// --- GAMIFICATION SYSTEMS ---
const BADGES_CONFIG = [
  { id: 'streak_3', name: 'Streak Starter', desc: 'Mencapai streak aktivitas harian selama 3 hari berturut-turut', icon: '🔥' },
  { id: 'protein_king', name: 'Protein King', desc: 'Mencapai target protein harian penuh dalam log makanan', icon: '👑' },
  { id: 'iron_will', name: 'Iron Will', desc: 'Menyelesaikan program kekuatan (Hari 1, 4, atau 6)', icon: '⚔️' },
  { id: 'cardio_warrior', name: 'Cardio Warrior', desc: 'Menyelesaikan sesi lari dengan jarak >= 3 KM', icon: '🏃' },
  { id: 'master_chef', name: 'Master Chef', desc: 'Mencatat minimal 3 makanan dalam satu hari', icon: '🍳' }
];

function calculateDailyStreak() {
  const activityDates = new Set();
  
  appState.foodLogs.forEach(log => activityDates.add(log.date));
  appState.workoutLogs.forEach(log => activityDates.add(log.date));
  
  const sortedDates = Array.from(activityDates).sort((a, b) => new Date(b) - new Date(a));
  
  if (sortedDates.length === 0) {
    return 0;
  }
  
  const todayStr = getTodayDateKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // If the user was not active today nor yesterday, streak is broken
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      break;
    }
  }
  
  return streak;
}

function updateStreakUI() {
  const streak = calculateDailyStreak();
  const badge = document.getElementById('streak-badge');
  const val = document.getElementById('streak-count-val');
  
  if (streak > 0) {
    if (badge) badge.style.display = 'flex';
    if (val) val.textContent = streak;
  } else {
    if (badge) badge.style.display = 'none';
  }
}

function checkUnlockedBadges() {
  const unlocked = new Set();
  
  // 1. Streak Starter
  const currentStreak = calculateDailyStreak();
  if (currentStreak >= 3) {
    unlocked.add('streak_3');
  }
  
  // 2. Protein King
  const targetProt = appState.profile.targetProtein || 0;
  if (targetProt > 0) {
    const dates = [...new Set(appState.foodLogs.map(f => f.date))];
    for (let dt of dates) {
      const dayFoods = appState.foodLogs.filter(f => f.date === dt);
      let sum = 0;
      dayFoods.forEach(f => sum += f.protein);
      if (sum >= targetProt) {
        unlocked.add('protein_king');
        break;
      }
    }
  }

  // 3. Iron Will
  const strengthLogs = appState.workoutLogs.filter(log => log.dayIndex === 1 || log.dayIndex === 4 || log.dayIndex === 6);
  if (strengthLogs.length > 0) {
    unlocked.add('iron_will');
  }

  // 4. Cardio Warrior
  const runLogs = appState.workoutLogs.filter(log => log.exercises && log.exercises.runDistance >= 3.0);
  if (runLogs.length > 0) {
    unlocked.add('cardio_warrior');
  }

  // 5. Master Chef
  const dates = [...new Set(appState.foodLogs.map(f => f.date))];
  for (let dt of dates) {
    const dayFoods = appState.foodLogs.filter(f => f.date === dt);
    if (dayFoods.length >= 3) {
      unlocked.add('master_chef');
      break;
    }
  }
  
  return unlocked;
}

function renderBadgesUI() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  
  const unlocked = checkUnlockedBadges();
  grid.innerHTML = '';
  
  BADGES_CONFIG.forEach(badge => {
    const isUnlocked = unlocked.has(badge.id);
    const item = document.createElement('div');
    item.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
    item.innerHTML = `
      <div class="badge-medal-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.desc}</div>
    `;
    grid.appendChild(item);
  });
}
