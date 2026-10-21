/**
 * J4 FITNESS - MOTOR METABÓLICO DE PRECISÃO
 * Algoritmos Clínicos: Mifflin-St Jeor, Katch-McArdle, Harris-Benedict Revisada
 * Padrão Web Clean 2026
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
    goal: 'deficit', // 'deficit' | 'maintenance' | 'lean_bulk'
    macroSplit: 'sports', // 'sports'
  };

  // Goal calorie modifiers
  const goalModifiers = {
    'deficit': { pct: -0.20, label: 'Secar / Déficit Saudável (-20%)' },
    'maintenance': { pct: 0.0, label: 'Manutenção Metabólica (0%)' },
    'lean_bulk': { pct: 0.12, label: 'Ganho Limpo (+12%)' }
  };

  // Macro splits percentages (Carb, Protein, Fat)
  const macroPresets = {
    'sports': { carb: 0.40, prot: 0.35, fat: 0.25, label: 'Alta Proteína / Esportiva (40/35/25)' }
  };

  // Elements Cache Helper
  function getElements() {
    return {
      genderBtns: document.querySelectorAll('.gender-btn'),
      formulaBtns: document.querySelectorAll('.formula-tab, .formula-btn'),
      activityItems: document.querySelectorAll('.activity-item, .activity-option'),
      goalBtns: document.querySelectorAll('.goal-pill-btn, .goal-btn'),
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
      toast: document.getElementById('toast-notice')
    };
  }

  let el = null;

  /**
   * Scientific Calculations Engine
   */
  function calculateBMR(params) {
    const { gender, age, weight, height, bodyFat, formula } = params;
    let bmr = 0;

    switch (formula) {
      case 'katch': {
        const bfRatio = (bodyFat && bodyFat > 3 && bodyFat < 70) ? (bodyFat / 100) : (gender === 'male' ? 0.15 : 0.23);
        const lbm = weight * (1 - bfRatio);
        bmr = 370 + (21.6 * lbm);
        break;
      }
      case 'harris': {
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        break;
      }
      case 'mifflin':
      default: {
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
    if (!el) el = getElements();

    const bmr = calculateBMR(state);
    const tdee = Math.round(bmr * state.activityLevel);

    const goalMod = goalModifiers[state.goal] || goalModifiers['deficit'];
    const targetCalories = Math.round(tdee * (1 + goalMod.pct));

    // IMC
    const heightInMeters = state.height / 100;
    const bmi = (state.weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Meta de água: 35ml/kg base + 500ml se treinar
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
    if (el.bmrNumber) el.bmrNumber.textContent = bmr.toLocaleString('pt-BR');
    if (el.tdeeNumber) el.tdeeNumber.textContent = tdee.toLocaleString('pt-BR') + ' kcal';
    if (el.targetCalNumber) el.targetCalNumber.textContent = targetCalories.toLocaleString('pt-BR') + ' kcal';
    if (el.bmiNumber) el.bmiNumber.textContent = bmi;
    if (el.waterNumber) el.waterNumber.textContent = (waterMl / 1000).toFixed(1) + ' L/dia';

    // Macros
    if (el.carbGrams) el.carbGrams.textContent = carbG + 'g';
    if (el.protGrams) el.protGrams.textContent = protG + 'g';
    if (el.fatGrams) el.fatGrams.textContent = fatG + 'g';

    if (el.carbGkg) el.carbGkg.textContent = `${carbPerKg}g/kg (40%)`;
    if (el.protGkg) el.protGkg.textContent = `${protPerKg}g/kg (35%)`;
    if (el.fatGkg) el.fatGkg.textContent = `${fatPerKg}g/kg (25%)`;

    if (el.barCarb) el.barCarb.style.width = '40%';
    if (el.barProt) el.barProt.style.width = '35%';
    if (el.barFat) el.barFat.style.width = '25%';

    // Circular Gauge Animation
    if (el.gaugeCircle) {
      const maxVisualBmr = 3000;
      const minVisualBmr = 1000;
      const clampedBmr = Math.min(Math.max(bmr, minVisualBmr), maxVisualBmr);
      const ratio = (clampedBmr - minVisualBmr) / (maxVisualBmr - minVisualBmr);
      const maxOffset = 565.48;
      const targetOffset = maxOffset - (ratio * (maxOffset * 0.75));
      el.gaugeCircle.style.strokeDashoffset = targetOffset;
    }

    // Sincroniza com localStorage para o gerador de cardápio
    try {
      localStorage.setItem('j4fitness_user_metrics', JSON.stringify({
        bmr,
        tdee,
        targetCalories,
        macros: { carb: carbG, prot: protG, fat: fatG },
        state
      }));
    } catch (e) {}
  }

  function setupEventListeners() {
    el = getElements();

    // Gender buttons
    el.genderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gender = btn.dataset.gender;
        calculateAll();
      });
    });

    // Formula buttons
    el.formulaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.formulaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.formula = btn.dataset.formula;

        if (el.bodyFatGroup) {
          el.bodyFatGroup.style.display = (state.formula === 'katch') ? 'block' : 'none';
        }
        calculateAll();
      });
    });

    // Activity items
    el.activityItems.forEach(item => {
      item.addEventListener('click', () => {
        el.activityItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        state.activityLevel = parseFloat(item.dataset.activity);
        calculateAll();
      });
    });

    // Goal buttons
    el.goalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.goalBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.goal = btn.dataset.goal;
        calculateAll();
      });
    });

    // Inputs
    const inputs = [
      { element: el.ageInput, key: 'age', min: 10, max: 110 },
      { element: el.weightInput, key: 'weight', min: 30, max: 300 },
      { element: el.heightInput, key: 'height', min: 100, max: 250 },
      { element: el.bodyFatInput, key: 'bodyFat', min: 4, max: 65 }
    ];

    inputs.forEach(({ element, key, min, max }) => {
      if (!element) return;
      element.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= min && val <= max) {
          state[key] = val;
          calculateAll();
        }
      });
    });

    // Form submit
    if (el.calcForm) {
      el.calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateAll();
        showToast('Cálculos atualizados com sucesso!');
      });
    }

    // Save metrics
    if (el.btnSave) {
      el.btnSave.addEventListener('click', () => {
        try {
          const snapshot = {
            state,
            date: new Date().toLocaleDateString('pt-BR'),
            bmr: calculateBMR(state),
            tdee: Math.round(calculateBMR(state) * state.activityLevel)
          };
          localStorage.setItem('j4fitness_user_metrics', JSON.stringify(snapshot));
          showToast('Dados salvos no seu navegador!');
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Export PDF
    if (el.btnExport) {
      el.btnExport.addEventListener('click', () => {
        window.print();
      });
    }

    // Share result
    if (el.btnShare) {
      el.btnShare.addEventListener('click', async () => {
        const bmr = calculateBMR(state);
        const tdee = Math.round(bmr * state.activityLevel);
        const shareData = {
          title: 'Meu Relatório Metabólico - J4 Fitness',
          text: `Minha Taxa Metabólica Basal é ${bmr} kcal e meu Gasto Diário (TDEE) é ${tdee} kcal! Calcule na J4 Fitness:`,
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
          showToast('Link copiado para a área de transferência!');
        }
      });
    }

    // FAQ Accordion
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
  }

  function showToast(message) {
    if (!el || !el.toast) return;
    el.toast.textContent = message;
    el.toast.classList.add('show');
    setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2800);
  }

  function loadStoredData() {
    try {
      const saved = localStorage.getItem('j4fitness_user_metrics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.state) {
          Object.assign(state, parsed.state);
          if (el.ageInput) el.ageInput.value = state.age;
          if (el.weightInput) el.weightInput.value = state.weight;
          if (el.heightInput) el.heightInput.value = state.height;
          if (el.bodyFatInput) el.bodyFatInput.value = state.bodyFat;

          el.genderBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.gender === state.gender);
          });

          el.formulaBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.formula === state.formula);
          });

          el.activityItems.forEach(item => {
            item.classList.toggle('active', parseFloat(item.dataset.activity) === state.activityLevel);
          });

          el.goalBtns.forEach(b => {
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
    setupEventListeners();
    loadStoredData();
    calculateAll();
  });
})();
