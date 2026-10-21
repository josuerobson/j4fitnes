/**
 * J4 FITNES - CALCULADORA METABÓLICA DE PRECISÃO
 * Algoritmos Científicos: Mifflin-St Jeor, Harris-Benedict Revisada, Katch-McArdle
 * Desenvolvido com padrões modernos Web 2026
 */

(function () {
  'use strict';

  // State Management
  const state = {
    gender: 'male', // 'male' | 'female'
    age: 28,
    weight: 78, // kg
    height: 178, // cm
    bodyFat: 15, // %
    formula: 'mifflin', // 'mifflin' | 'harris' | 'katch'
    activityLevel: 1.55, // 1.2, 1.375, 1.55, 1.725, 1.9
    goal: 'deficit', // 'deficit_aggressive' | 'deficit' | 'maintenance' | 'lean_bulk' | 'bulk'
    macroSplit: 'sports', // 'balanced', 'sports', 'lowcarb'
  };

  // Activity multipliers map
  const activityMap = {
    '1.20': { label: 'Sedentário', desc: 'Pouco ou nenhum exercício diário' },
    '1.375': { label: 'Levemente Ativo', desc: 'Treino leve de 1 a 3 dias por semana' },
    '1.55': { label: 'Moderadamente Ativo', desc: 'Treino moderado de 3 a 5 dias por semana' },
    '1.725': { label: 'Muito Ativo', desc: 'Treino pesado de 6 a 7 dias por semana' },
    '1.90': { label: 'Extremamente Ativo', desc: 'Atleta de alta performance ou trabalho pesado' }
  };

  // Goal calorie modifiers
  const goalModifiers = {
    'deficit_aggressive': { pct: -0.25, label: 'Déficit Agressivo (-25%)' },
    'deficit': { pct: -0.20, label: 'Secar / Déficit Saudável (-20%)' },
    'maintenance': { pct: 0.0, label: 'Manutenção Metabólica' },
    'lean_bulk': { pct: 0.12, label: 'Ganho Limpo (+12%)' },
    'bulk': { pct: 0.20, label: 'Hipertrofia Agressiva (+20%)' }
  };

  // Macro splits percentages (Carb, Protein, Fat)
  const macroPresets = {
    'balanced': { carb: 0.45, prot: 0.25, fat: 0.30, label: 'Equilibrada (45/25/30)' },
    'sports': { carb: 0.40, prot: 0.35, fat: 0.25, label: 'Alta Proteína / Esportiva (40/35/25)' },
    'lowcarb': { carb: 0.20, prot: 0.40, fat: 0.40, label: 'Low Carb Cetogênica (20/40/40)' }
  };

  // Elements Cache
  const elements = {
    genderBtns: document.querySelectorAll('.gender-btn'),
    formulaBtns: document.querySelectorAll('.formula-btn'),
    activityOptions: document.querySelectorAll('.activity-option'),
    goalBtns: document.querySelectorAll('.goal-btn'),
    ageInput: document.getElementById('input-age'),
    weightInput: document.getElementById('input-weight'),
    heightInput: document.getElementById('input-height'),
    bodyFatInput: document.getElementById('input-bodyfat'),
    bodyFatGroup: document.getElementById('group-bodyfat'),
    calcForm: document.getElementById('metabolic-form'),
    
    // Outputs
    bmrNumber: document.getElementById('result-bmr-number'),
    tdeeNumber: document.getElementById('result-tdee-number'),
    targetCalNumber: document.getElementById('result-target-cal'),
    bmiNumber: document.getElementById('result-bmi'),
    waterNumber: document.getElementById('result-water'),
    gaugeCircle: document.getElementById('gauge-progress'),
    
    // Macro outputs
    carbGrams: document.getElementById('macro-carb-g'),
    protGrams: document.getElementById('macro-prot-g'),
    fatGrams: document.getElementById('macro-fat-g'),
    carbGkg: document.getElementById('macro-carb-gkg'),
    protGkg: document.getElementById('macro-prot-gkg'),
    fatGkg: document.getElementById('macro-fat-gkg'),
    barCarb: document.getElementById('bar-carb'),
    barProt: document.getElementById('bar-prot'),
    barFat: document.getElementById('bar-fat'),

    // Buttons
    btnSave: document.getElementById('btn-save-metrics'),
    btnExport: document.getElementById('btn-export-pdf'),
    btnShare: document.getElementById('btn-share'),
    themeToggle: document.getElementById('theme-toggle-btn'),
    toast: document.getElementById('toast-notice')
  };

  /**
   * Scientific Calculations Engine
   */
  function calculateBMR(params) {
    const { gender, age, weight, height, bodyFat, formula } = params;

    let bmr = 0;

    switch (formula) {
      case 'katch': {
        // Katch-McArdle Formula based on Lean Body Mass (LBM)
        const bfRatio = (bodyFat && bodyFat > 3 && bodyFat < 70) ? (bodyFat / 100) : (gender === 'male' ? 0.15 : 0.23);
        const lbm = weight * (1 - bfRatio);
        bmr = 370 + (21.6 * lbm);
        break;
      }
      case 'harris': {
        // Revised Harris-Benedict (Roza & Shizgal, 1984)
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        break;
      }
      case 'mifflin':
      default: {
        // Mifflin-St Jeor Formula (Clinical Gold Standard)
        if (gender === 'male') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        break;
      }
    }

    return Math.round(bmr);
  }

  function calculateAll() {
    const bmr = calculateBMR(state);
    const tdee = Math.round(bmr * state.activityLevel);

    const goalMod = goalModifiers[state.goal] || goalModifiers['deficit'];
    const targetCalories = Math.round(tdee * (1 + goalMod.pct));

    // IMC
    const heightInMeters = state.height / 100;
    const bmi = (state.weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Meta de água: 35ml/kg base + 500ml se treinar (fator > 1.2)
    const extraWater = state.activityLevel > 1.2 ? 500 : 0;
    const waterMl = Math.round((state.weight * 35) + extraWater);

    // Macronutrientes
    const split = macroPresets[state.macroSplit] || macroPresets['sports'];
    const carbKcal = targetCalories * split.carb;
    const protKcal = targetCalories * split.prot;
    const fatKcal = targetCalories * split.fat;

    const carbG = Math.round(carbKcal / 4);
    const protG = Math.round(protKcal / 4);
    const fatG = Math.round(fatKcal / 9);

    const carbPerKg = (carbG / state.weight).toFixed(1);
    const protPerKg = (protG / state.weight).toFixed(1);
    const fatPerKg = (fatG / state.weight).toFixed(1);

    // Update DOM
    if (elements.bmrNumber) elements.bmrNumber.textContent = bmr.toLocaleString('pt-BR');
    if (elements.tdeeNumber) elements.tdeeNumber.textContent = tdee.toLocaleString('pt-BR') + ' kcal';
    if (elements.targetCalNumber) elements.targetCalNumber.textContent = targetCalories.toLocaleString('pt-BR') + ' kcal';
    if (elements.bmiNumber) elements.bmiNumber.textContent = bmi;
    if (elements.waterNumber) elements.waterNumber.textContent = (waterMl / 1000).toFixed(1) + ' L/dia';

    // Macros
    if (elements.carbGrams) elements.carbGrams.textContent = carbG + 'g';
    if (elements.protGrams) elements.protGrams.textContent = protG + 'g';
    if (elements.fatGrams) elements.fatGrams.textContent = fatG + 'g';

    if (elements.carbGkg) elements.carbGkg.textContent = `${carbPerKg}g/kg (${Math.round(split.carb * 100)}%)`;
    if (elements.protGkg) elements.protGkg.textContent = `${protPerKg}g/kg (${Math.round(split.prot * 100)}%)`;
    if (elements.fatGkg) elements.fatGkg.textContent = `${fatPerKg}g/kg (${Math.round(split.fat * 100)}%)`;

    if (elements.barCarb) elements.barCarb.style.width = `${split.carb * 100}%`;
    if (elements.barProt) elements.barProt.style.width = `${split.prot * 100}%`;
    if (elements.barFat) elements.barFat.style.width = `${split.fat * 100}%`;

    // Circular Gauge Animation
    // Total circumference = 2 * PI * r = 2 * 3.14159 * 90 = 565.48
    if (elements.gaugeCircle) {
      const maxVisualBmr = 3000;
      const minVisualBmr = 1000;
      const clampedBmr = Math.min(Math.max(bmr, minVisualBmr), maxVisualBmr);
      const ratio = (clampedBmr - minVisualBmr) / (maxVisualBmr - minVisualBmr);
      const maxOffset = 565.48;
      const targetOffset = maxOffset - (ratio * (maxOffset * 0.75));
      elements.gaugeCircle.style.strokeDashoffset = targetOffset;
    }
  }

  /**
   * Event Listeners & Interactions
   */
  function setupEventListeners() {
    // Gender buttons
    elements.genderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.gender;
        calculateAll();
      });
    });

    // Formula buttons
    elements.formulaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.formulaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.formula = btn.dataset.formula;

        // Show/hide bodyfat field for Katch-McArdle
        if (state.formula === 'katch') {
          elements.bodyFatGroup.style.display = 'block';
        } else {
          elements.bodyFatGroup.style.display = 'none';
        }
        calculateAll();
      });
    });

    // Activity level options
    elements.activityOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        elements.activityOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        state.activityLevel = parseFloat(opt.dataset.activity);
        calculateAll();
      });
    });

    // Goal buttons
    elements.goalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.goalBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.goal = btn.dataset.goal;
        calculateAll();
      });
    });

    // Numeric inputs with real-time feedback
    const inputs = [
      { el: elements.ageInput, key: 'age', min: 10, max: 110 },
      { el: elements.weightInput, key: 'weight', min: 30, max: 300 },
      { el: elements.heightInput, key: 'height', min: 100, max: 250 },
      { el: elements.bodyFatInput, key: 'bodyFat', min: 4, max: 65 }
    ];

    inputs.forEach(({ el, key, min, max }) => {
      if (!el) return;
      el.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= min && val <= max) {
          state[key] = val;
          calculateAll();
        }
      });
    });

    // Form submit prevention
    if (elements.calcForm) {
      elements.calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateAll();
        showToast('Métricas metabólicas recalculadas com sucesso!');
      });
    }

    // Save metrics to local storage
    if (elements.btnSave) {
      elements.btnSave.addEventListener('click', () => {
        try {
          const snapshot = {
            state,
            date: new Date().toLocaleDateString('pt-BR'),
            bmr: calculateBMR(state),
            tdee: Math.round(calculateBMR(state) * state.activityLevel)
          };
          localStorage.setItem('j4fitnes_user_metrics', JSON.stringify(snapshot));
          showToast('Seus dados biométricos foram salvos no dispositivo!');
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Export PDF via Print Friendly view
    if (elements.btnExport) {
      elements.btnExport.addEventListener('click', () => {
        window.print();
      });
    }

    // Share result
    if (elements.btnShare) {
      elements.btnShare.addEventListener('click', async () => {
        const bmr = calculateBMR(state);
        const tdee = Math.round(bmr * state.activityLevel);
        const shareData = {
          title: 'Meu Relatório Metabólico - J4 Fitnes',
          text: `Minha Taxa Metabólica Basal é ${bmr} kcal e meu Gasto Diário (TDEE) é ${tdee} kcal! Calcule a sua na J4 Fitnes:`,
          url: window.location.href
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (e) {
            // share canceled
          }
        } else {
          navigator.clipboard.writeText(window.location.href);
          showToast('Link da calculadora copiado para a área de transferência!');
        }
      });
    }

    // FAQ Accordion toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });

    // Theme toggle (Dark / Light)
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        elements.themeToggle.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('j4fitnes_theme', nextTheme);
      });
    }
  }

  function showToast(message) {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 3200);
  }

  function loadStoredData() {
    try {
      // Saved Theme
      const savedTheme = localStorage.getItem('j4fitnes_theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (elements.themeToggle) {
          elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
      }

      // Saved Metrics
      const saved = localStorage.getItem('j4fitnes_user_metrics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.state) {
          Object.assign(state, parsed.state);
          if (elements.ageInput) elements.ageInput.value = state.age;
          if (elements.weightInput) elements.weightInput.value = state.weight;
          if (elements.heightInput) elements.heightInput.value = state.height;
          if (elements.bodyFatInput) elements.bodyFatInput.value = state.bodyFat;

          // Gender active class
          elements.genderBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.gender === state.gender);
          });

          // Formula active class
          elements.formulaBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.formula === state.formula);
          });

          // Activity active class
          elements.activityOptions.forEach(o => {
            o.classList.toggle('active', parseFloat(o.dataset.activity) === state.activityLevel);
          });

          // Goal active class
          elements.goalBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.goal === state.goal);
          });
        }
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    setupEventListeners();
    calculateAll();
  });
})();
