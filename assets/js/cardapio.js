/**
 * J4 FITNESS - MOTOR INTELIGENTE DE CARDÁPIO SEMANAL PERSONALIZADO
 * Arquitetura de Refeições com Slots Gastronômicos Reais (Culinária Brasileira + TACO)
 * Evita repetições incoerentes (pão com pão, feijão com feijão)
 * Garante proteína animal no almoço/jantar e recheio apropriado para pão/tapioca
 */

(function () {
  'use strict';

  // Banco de Alimentos Estruturado por Slots Lógicos
  const MEAL_SLOTS_DB = {
    // === CAFÉ DA MANHÃ ===
    cafe_manha: {
      bases: [
        { id: 'pao_frances', name: 'Pão francês fresquinho', unit: 'unidade (50g)', baseQty: 1, kcal: 135, prot: 4.1, carb: 28, fat: 1.5, type: 'bread' },
        { id: 'pao_integral', name: 'Pão 100% integral', unit: 'fatias (50g)', baseQty: 2, kcal: 120, prot: 4.5, carb: 22, fat: 1.5, type: 'bread' },
        { id: 'tapioca', name: 'Tapioca de frigideira', unit: 'colheres de sopa de goma (50g)', baseQty: 3, kcal: 115, prot: 0.1, carb: 28, fat: 0.1, type: 'bread' },
        { id: 'cuscuz', name: 'Cuscuz de milho nordestino', unit: 'fatia média (100g)', baseQty: 1, kcal: 112, prot: 2.5, carb: 25, fat: 0.5, type: 'bread' },
        { id: 'aveia', name: 'Aveia em flocos finos', unit: 'colheres de sopa (30g)', baseQty: 2, kcal: 105, prot: 4.3, carb: 17, fat: 2.2, type: 'oats' }
      ],
      recheios: [
        { id: 'ovos_mexidos', name: 'Ovos mexidos ou na chapa', unit: 'unidades', baseQty: 2, kcal: 150, prot: 13, carb: 1, fat: 10.5, fitWith: ['bread', 'oats'] },
        { id: 'queijo_minas', name: 'Queijo minas frescal ou ricota', unit: 'fatias médias (30g)', baseQty: 1.5, kcal: 90, prot: 7.5, carb: 1.5, fat: 6.5, fitWith: ['bread'] },
        { id: 'frango_desfiado_cm', name: 'Frango desfiado temperado (recheio)', unit: 'colheres de sopa (60g)', baseQty: 2, kcal: 95, prot: 18, carb: 0, fat: 2, fitWith: ['bread'] },
        { id: 'pasta_amendoim', name: 'Pasta de amendoim integral', unit: 'colher de sopa (15g)', baseQty: 1, kcal: 90, prot: 4, carb: 3, fat: 7.5, fitWith: ['bread', 'oats'] }
      ],
      frutas: [
        { id: 'banana', name: 'Banana prata fatiada', unit: 'unidade média (70g)', baseQty: 1, kcal: 70, prot: 0.9, carb: 18, fat: 0.2 },
        { id: 'mamao', name: 'Mamão papaia em cubos', unit: 'fatia média (100g)', baseQty: 1, kcal: 45, prot: 0.5, carb: 11, fat: 0.1 },
        { id: 'maca', name: 'Maçã nacional higienizada', unit: 'unidade média (120g)', baseQty: 1, kcal: 65, prot: 0.4, carb: 17, fat: 0.2 }
      ],
      bebidas: [
        { id: 'cafe_puro', name: 'Café preto coado (sem açúcar)', unit: 'xícara (100ml)', baseQty: 1, kcal: 2, prot: 0.1, carb: 0.3, fat: 0 },
        { id: 'cafe_com_leite', name: 'Café com leite desnatado ou semidesnatado', unit: 'xícara (150ml)', baseQty: 1, kcal: 65, prot: 4.5, carb: 7, fat: 2 }
      ]
    },

    // === ALMOÇO & JANTAR ===
    almoco: {
      proteinas: [
        { id: 'frango_grelhado', name: 'Peito de frango grelhado em tiras', unit: 'g pesados pronto', baseQty: 130, kcal: 208, prot: 40, carb: 0, fat: 4.2 },
        { id: 'patinho_moido', name: 'Carne bovina magra (patinho moído)', unit: 'g pesados pronto', baseQty: 130, kcal: 238, prot: 41, carb: 0, fat: 7.5 },
        { id: 'tilapia_peixe', name: 'Filé de tilápia grelhada com limão', unit: 'g pesados pronto', baseQty: 150, kcal: 180, prot: 39, carb: 0, fat: 2.8 },
        { id: 'alcatra_magra', name: 'Bife de alcatra grelhado acebolado', unit: 'g pesados pronto', baseQty: 130, kcal: 245, prot: 40, carb: 0, fat: 8.5 },
        { id: 'omelete_almoco', name: 'Omelete de 3 ovos com cheiro-verde', unit: 'unidades de ovos', baseQty: 3, kcal: 225, prot: 19.5, carb: 1.5, fat: 15.5 }
      ],
      carboidratos: [
        { id: 'arroz_branco', name: 'Arroz branco tradicional cozido', unit: 'colheres de servir (~100g)', baseQty: 2, kcal: 130, prot: 2.6, carb: 28, fat: 0.4 },
        { id: 'arroz_integral', name: 'Arroz integral soltinho', unit: 'colheres de servir (~100g)', baseQty: 2, kcal: 120, prot: 2.6, carb: 26, fat: 1 },
        { id: 'batata_doce', name: 'Batata-doce cozida ou assada', unit: 'unidade média (~120g)', baseQty: 1, kcal: 92, prot: 1.5, carb: 22, fat: 0.1 },
        { id: 'mandioca', name: 'Mandioca (aipim) cozida', unit: 'pedaço médio (~100g)', baseQty: 1, kcal: 125, prot: 0.6, carb: 30, fat: 0.3 },
        { id: 'batata_inglesa', name: 'Batata inglesa cozida ou purê leve', unit: 'unidade média (~120g)', baseQty: 1, kcal: 65, prot: 1.5, carb: 15, fat: 0.1 }
      ],
      leguminosas: [
        { id: 'feijao_carioca', name: 'Feijão carioca temperado', unit: 'concha média (~100g)', baseQty: 1, kcal: 76, prot: 4.8, carb: 13.6, fat: 0.5 },
        { id: 'feijao_preto', name: 'Feijão preto cozido', unit: 'concha média (~100g)', baseQty: 1, kcal: 77, prot: 4.5, carb: 14, fat: 0.5 },
        { id: 'grao_bico', name: 'Grão-de-bico cozido temperado', unit: 'colheres de sopa (~80g)', baseQty: 3, kcal: 95, prot: 5.5, carb: 16, fat: 1.5 }
      ],
      acompanhamentos: [
        { id: 'salada_azeite', name: 'Salada verde mista (alface, tomate, rúcula) + azeite extra virgem', unit: '1 prato fundo + 1 colher de sobremesa de azeite', baseQty: 1, kcal: 62, prot: 1.5, carb: 3.5, fat: 5 },
        { id: 'legumes_vapor', name: 'Mix de legumes cozidos no vapor (cenoura, abobrinha, brócolis)', unit: '1 pegador farto (120g)', baseQty: 1, kcal: 42, prot: 2.2, carb: 8.5, fat: 0.3 }
      ]
    },

    // === CAFÉ DA TARDE / LANCHE ===
    cafe_tarde: {
      combos: [
        {
          id: 'combo_crepioca',
          name: 'Crepioca Fit Recheada',
          items: [
            { name: 'Massa de Crepioca (1 ovo + 2 colheres de sopa de tapioca)', unit: '1 unidade', kcal: 155, prot: 7.5, carb: 19, fat: 5.5 },
            { name: 'Recheio: Queijo branco ou frango desfiado', unit: '40g', kcal: 75, prot: 10, carb: 0.5, fat: 3.5 }
          ]
        },
        {
          id: 'combo_sanduiche',
          name: 'Sanduíche Natural Proteico',
          items: [
            { name: 'Pão 100% integral', unit: '2 fatias', kcal: 120, prot: 4.5, carb: 22, fat: 1.5 },
            { name: 'Recheio: Frango desfiado ou atum sólido com ricota', unit: '60g', kcal: 95, prot: 16, carb: 1, fat: 2.5 }
          ]
        },
        {
          id: 'combo_iogurte_aveia',
          name: 'Iogurte Bowl com Frutas e Fibras',
          items: [
            { name: 'Iogurte natural desnatado', unit: '1 pote (160g)', kcal: 85, prot: 6.8, carb: 9.5, fat: 2 },
            { name: 'Banana fatiada ou morangos frescos', unit: '1 porção (80g)', kcal: 60, prot: 0.8, carb: 15, fat: 0.2 },
            { name: 'Aveia em flocos ou sementes de chia', unit: '1 colher de sopa (15g)', kcal: 52, prot: 2.1, carb: 8.5, fat: 1.1 }
          ]
        },
        {
          id: 'combo_shake_whey',
          name: 'Shake de Proteína com Fruta',
          items: [
            { name: 'Whey Protein (isolado ou concentrado)', unit: '1 scoop (30g) em 200ml de água', kcal: 120, prot: 24, carb: 2.5, fat: 1.5 },
            { name: 'Fruta de acompanhamento (maçã ou banana)', unit: '1 unidade', kcal: 70, prot: 0.8, carb: 18, fat: 0.2 }
          ]
        },
        {
          id: 'combo_fruta_castanhas',
          name: 'Lanche Rápido: Fruta & Oleaginosas',
          items: [
            { name: 'Maçã ou pêra fresca', unit: '1 unidade média', kcal: 65, prot: 0.4, carb: 17, fat: 0.2 },
            { name: 'Castanha-do-Pará ou nozes', unit: '3 unidades (15g)', kcal: 98, prot: 2.1, carb: 1.8, fat: 9.8 }
          ]
        }
      ]
    },

    // === DESJEJUM & CEIA (Opcionais) ===
    desjejum: {
      opcoes: [
        { id: 'desj_agua_limao', name: 'Água morna com meio limão espremido em jejum', unit: '1 copo (250ml)', kcal: 8, prot: 0.2, carb: 2, fat: 0 },
        { id: 'desj_cafe', name: 'Café preto coado puro sem açúcar', unit: '1 xícara (100ml)', kcal: 2, prot: 0.1, carb: 0.3, fat: 0 },
        { id: 'desj_shot', name: 'Shot matinal de imunidade (água, própolis, cúrcuma e gengibre)', unit: '1 dose (50ml)', kcal: 15, prot: 0.1, carb: 3, fat: 0.1 }
      ]
    },

    ceia: {
      opcoes: [
        { id: 'ceia_cha_castanhas', name: 'Chá calmante de camomila ou melissa + 2 castanhas-do-Pará', unit: '1 xícara + 2 castanhas (10g)', kcal: 67, prot: 1.4, carb: 1.7, fat: 6.5 },
        { id: 'ceia_abacate', name: 'Abacate com gotas de limão (gordura boa para sono)', unit: '2 colheres de sopa (50g)', kcal: 80, prot: 1, carb: 3, fat: 8 },
        { id: 'ceia_iogurte', name: 'Iogurte natural com canela em pó polvilhada', unit: '1/2 pote (100g)', kcal: 55, prot: 4.5, carb: 6, fat: 1.2 },
        { id: 'ceia_ovo', name: 'Ovo cozido temperado com orégano e sal rosa', unit: '1 unidade', kcal: 75, prot: 6.5, carb: 0.5, fat: 5.3 }
      ]
    }
  };

  const MEAL_LABELS = {
    desjejum: { name: 'Desjejum (Ao acordar)', icon: '🌅', pct: 0.04 },
    cafe_manha: { name: 'Café da Manhã', icon: '☕', pct: 0.23 },
    almoco: { name: 'Almoço Completo', icon: '🥗', pct: 0.34 },
    cafe_tarde: { name: 'Café da Tarde / Lanche', icon: '🥪', pct: 0.15 },
    janta: { name: 'Jantar', icon: '🍲', pct: 0.20 },
    ceia: { name: 'Ceia (Antes de dormir)', icon: '🌙', pct: 0.04 }
  };

  const DAYS_OF_WEEK = [
    { key: 'seg', label: 'Segunda-feira' },
    { key: 'ter', label: 'Terça-feira' },
    { key: 'qua', label: 'Quarta-feira' },
    { key: 'qui', label: 'Quinta-feira' },
    { key: 'sex', label: 'Sexta-feira' },
    { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' }
  ];

  // Estado do Criador de Cardápio
  const menuState = {
    targetCalories: 2599,
    bmr: 2096,
    tdee: 3249,
    goal: 'deficit',
    macros: { carb: 260, prot: 195, fat: 72 },
    selectedMeals: ['cafe_manha', 'almoco', 'cafe_tarde', 'janta'],
    weeklyPlan: null,
    currentDayIndex: 0
  };

  function loadCalculatorData() {
    try {
      const stored = localStorage.getItem('j4fitness_user_metrics') || localStorage.getItem('j4fitnes_user_metrics');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.bmr) menuState.bmr = data.bmr;
        if (data.tdee) menuState.tdee = data.tdee;
        if (data.targetCalories) menuState.targetCalories = data.targetCalories;
        if (data.macros) menuState.macros = data.macros;
        if (data.state && data.state.goal) menuState.goal = data.state.goal;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados da calculadora:', e);
    }
  }

  function updateHeaderDisplays() {
    const elKcal = document.getElementById('disp-target-kcal');
    const elProt = document.getElementById('disp-target-prot');
    const elCarb = document.getElementById('disp-target-carb');
    const elFat = document.getElementById('disp-target-fat');

    if (elKcal) elKcal.textContent = menuState.targetCalories.toLocaleString('pt-BR');
    if (elProt) elProt.textContent = menuState.macros.prot + 'g';
    if (elCarb) elCarb.textContent = menuState.macros.carb + 'g';
    if (elFat) elFat.textContent = menuState.macros.fat + 'g';
  }

  function renderMealCheckboxes() {
    const container = document.getElementById('meal-selection-grid');
    if (!container) return;

    container.innerHTML = '';
    Object.keys(MEAL_LABELS).forEach(mealKey => {
      const meal = MEAL_LABELS[mealKey];
      const isChecked = menuState.selectedMeals.includes(mealKey);

      const label = document.createElement('label');
      label.className = `meal-check-card ${isChecked ? 'active' : ''}`;
      label.innerHTML = `
        <input type="checkbox" name="meals" value="${mealKey}" ${isChecked ? 'checked' : ''} style="display:none;">
        <span class="meal-icon">${meal.icon}</span>
        <div class="meal-info">
          <h5>${meal.name}</h5>
          <span class="meal-hint">${isChecked ? 'Refeição Selecionada' : 'Clique para incluir'}</span>
        </div>
      `;

      const input = label.querySelector('input');
      label.addEventListener('click', (e) => {
        e.preventDefault();
        input.checked = !input.checked;
        if (input.checked) {
          if (!menuState.selectedMeals.includes(mealKey)) {
            menuState.selectedMeals.push(mealKey);
          }
          label.classList.add('active');
          label.querySelector('.meal-hint').textContent = 'Refeição Selecionada';
        } else {
          if (menuState.selectedMeals.length <= 2) {
            alert('Mantenha ao menos 2 refeições selecionadas para o seu dia.');
            input.checked = true;
            return;
          }
          menuState.selectedMeals = menuState.selectedMeals.filter(m => m !== mealKey);
          label.classList.remove('active');
          label.querySelector('.meal-hint').textContent = 'Clique para incluir';
        }
        renderRuleNotice();
      });

      container.appendChild(label);
    });
  }

  // Explica as regras inteligentes de montagem do cardápio para o usuário
  function renderRuleNotice() {
    const container = document.getElementById('food-preferences-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
        <h4 style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
          <span>⚖️</span> Regras Inteligentes de Combinação Alimentar
        </h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">
          O sistema aplica a <strong>arquitetura nutricional brasileira balanceada</strong> para impedir repetições incoerentes:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; font-size: 0.85rem;">
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #2563EB;">
            <strong>☕ Café da manhã sem repetição:</strong> Escolhe 1 base (pão OU tapioca OU cuscuz OU aveia) acompanhado de recheio proteico real (ovos, queijo ou pasta de amendoim) + fruta + café.
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #059669;">
            <strong>🥗 Almoço & Jantar com Proteína Animal:</strong> Sempre inclui exatamente 1 proteína animal nobre (frango, carne magra, tilápia ou ovos) + 1 carboidrato + 1 concha de feijão + salada com azeite. Nunca repete dois feijões!
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #D97706;">
            <strong>🥪 Lanche Único e Completo:</strong> Seleciona 1 combo coerente (ex: crepioca recheada OU sanduíche natural OU iogurte com aveia e fruta), sem misturar múltiplos lanches.
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Gerador Semanal de Cardápio com Seleção de Slots
   */
  function generateWeeklyPlan() {
    const totalTargetKcal = menuState.targetCalories;
    const plan = {};

    let totalBasePct = 0;
    menuState.selectedMeals.forEach(m => {
      totalBasePct += MEAL_LABELS[m].pct;
    });

    DAYS_OF_WEEK.forEach((day, dayIndex) => {
      const dayMeals = [];
      let dayKcal = 0;
      let dayProt = 0;
      let dayCarb = 0;
      let dayFat = 0;

      menuState.selectedMeals.forEach(mealKey => {
        const mealDef = MEAL_LABELS[mealKey];
        const normalizedPct = mealDef.pct / totalBasePct;
        const mealTargetKcal = Math.round(totalTargetKcal * normalizedPct);

        const mealFoods = assembleMealBySlots(mealKey, dayIndex, mealTargetKcal);

        let actualKcal = 0;
        mealFoods.forEach(f => {
          actualKcal += f.kcal;
          dayProt += f.prot;
          dayCarb += f.carb;
          dayFat += f.fat;
        });

        dayKcal += actualKcal;

        dayMeals.push({
          mealKey,
          name: mealDef.name,
          icon: mealDef.icon,
          targetKcal: mealTargetKcal,
          actualKcal,
          foods: mealFoods
        });
      });

      plan[day.key] = {
        label: day.label,
        totalKcal: dayKcal,
        totalProt: Math.round(dayProt),
        totalCarb: Math.round(dayCarb),
        totalFat: Math.round(dayFat),
        meals: dayMeals
      };
    });

    menuState.weeklyPlan = plan;
    renderWeeklyTabs();
    renderDayPlan(DAYS_OF_WEEK[menuState.currentDayIndex].key);

    const planView = document.getElementById('cardapio-resultado-wrapper');
    if (planView) {
      planView.style.display = 'block';
      planView.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Monta os alimentos de uma refeição respeitando rigorosamente os slots gastronômicos
   */
  function assembleMealBySlots(mealKey, dayIndex, targetKcal) {
    const foods = [];

    if (mealKey === 'cafe_manha') {
      const db = MEAL_SLOTS_DB.cafe_manha;
      // 1. Base única de carboidrato (varia dia a dia: Pão francês, Pão integral, Tapioca, Cuscuz, Aveia)
      const base = db.bases[dayIndex % db.bases.length];

      // 2. Recheio / Proteína de acompanhamento condizente com a base
      const compatibleRecheios = db.recheios.filter(r => r.fitWith.includes(base.type));
      const recheio = compatibleRecheios[dayIndex % compatibleRecheios.length] || db.recheios[0];

      // 3. Fruta matinal
      const fruta = db.frutas[dayIndex % db.frutas.length];

      // 4. Bebida
      const bebida = db.bebidas[dayIndex % db.bebidas.length];

      // Cálculo de proporção para atingir as calorias necessárias
      const rawSum = base.kcal + recheio.kcal + fruta.kcal + bebida.kcal;
      const factor = Math.max(0.7, Math.min(2.0, targetKcal / rawSum));

      foods.push(formatFoodItem(`${base.name} (base)`, base.unit, base.baseQty, factor, base));
      foods.push(formatFoodItem(`Recheio: ${recheio.name}`, recheio.unit, recheio.baseQty, factor, recheio));
      foods.push(formatFoodItem(fruta.name, fruta.unit, fruta.baseQty, 1.0, fruta));
      foods.push(formatFoodItem(bebida.name, bebida.unit, bebida.baseQty, 1.0, bebida));
    }

    else if (mealKey === 'almoco' || mealKey === 'janta') {
      const db = MEAL_SLOTS_DB.almoco;
      // Se for janta, defasamos o índice em +2 para que o jantar nunca repita a mesma carne ou carboidrato do almoço!
      const offset = (mealKey === 'janta') ? 2 : 0;
      const effectiveIndex = (dayIndex + offset) % db.proteinas.length;

      // 1. PROTEÍNA ANIMAL OBRIGATÓRIA (1 item único!)
      const prot = db.proteinas[effectiveIndex];

      // 2. CARBOIDRATO BASE ÚNICO (Arroz, Batata ou Mandioca - 1 item apenas!)
      const carb = db.carboidratos[(dayIndex + offset) % db.carboidratos.length];

      // 3. LEGUMINOSA (1 concha de Feijão - NUNCA 2 feijões juntos!)
      const leg = db.leguminosas[(dayIndex + offset) % db.leguminosas.length];

      // 4. ACOMPANHAMENTO (Salada com azeite ou legumes no vapor)
      const acomp = db.acompanhamentos[(dayIndex + offset) % db.acompanhamentos.length];

      const rawSum = prot.kcal + carb.kcal + leg.kcal + acomp.kcal;
      const factor = Math.max(0.7, Math.min(2.2, targetKcal / rawSum));

      foods.push(formatFoodItem(`🥩 Proteína: ${prot.name}`, prot.unit, prot.baseQty, factor, prot));
      foods.push(formatFoodItem(`🍚 Carboidrato: ${carb.name}`, carb.unit, carb.baseQty, factor, carb));
      foods.push(formatFoodItem(`🫘 Leguminosa: ${leg.name}`, leg.unit, leg.baseQty, factor, leg));
      foods.push(formatFoodItem(`🥗 Fibras: ${acomp.name}`, acomp.unit, acomp.baseQty, 1.0, acomp));
    }

    else if (mealKey === 'cafe_tarde') {
      const db = MEAL_SLOTS_DB.cafe_tarde;
      // Escolhe 1 combo único completo (sem misturar crepioca com sanduíche e iogurte!)
      const combo = db.combos[dayIndex % db.combos.length];
      const rawSum = combo.items.reduce((acc, it) => acc + it.kcal, 0);
      const factor = Math.max(0.8, Math.min(2.0, targetKcal / rawSum));

      combo.items.forEach(it => {
        const itemKcal = Math.round(it.kcal * factor);
        const itemProt = Number((it.prot * factor).toFixed(1));
        const itemCarb = Number((it.carb * factor).toFixed(1));
        const itemFat = Number((it.fat * factor).toFixed(1));

        foods.push({
          name: it.name,
          portion: it.unit,
          scaledPortion: factor > 1.3 ? `${it.unit} (reforçado)` : it.unit,
          kcal: itemKcal,
          prot: itemProt,
          carb: itemCarb,
          fat: itemFat
        });
      });
    }

    else if (mealKey === 'desjejum') {
      const db = MEAL_SLOTS_DB.desjejum;
      const item = db.opcoes[dayIndex % db.opcoes.length];
      foods.push({
        name: item.name,
        portion: item.unit,
        scaledPortion: item.unit,
        kcal: item.kcal,
        prot: item.prot,
        carb: item.carb,
        fat: item.fat
      });
    }

    else if (mealKey === 'ceia') {
      const db = MEAL_SLOTS_DB.ceia;
      const item = db.opcoes[dayIndex % db.opcoes.length];
      foods.push({
        name: item.name,
        portion: item.unit,
        scaledPortion: item.unit,
        kcal: item.kcal,
        prot: item.prot,
        carb: item.carb,
        fat: item.fat
      });
    }

    return foods;
  }

  function formatFoodItem(title, unitStr, baseQty, factor, itemRef) {
    const finalQty = Math.round(baseQty * factor);
    const finalKcal = Math.round(itemRef.kcal * factor);
    const finalProt = Number((itemRef.prot * factor).toFixed(1));
    const finalCarb = Number((itemRef.carb * factor).toFixed(1));
    const finalFat = Number((itemRef.fat * factor).toFixed(1));

    let portionText = '';
    if (unitStr.includes('pesados') || unitStr.includes('g pronto') || unitStr === 'g') {
      const filesAprox = (finalQty / 120).toFixed(1);
      const descFiles = filesAprox >= 1.5 ? ` (~${filesAprox} filés)` : ' (1 filé médio)';
      portionText = `${finalQty}g pesados pronto${descFiles}`;
    } else if (unitStr.includes('unidades')) {
      portionText = `${Math.max(1, Math.round(finalQty))} unidades`;
    } else if (unitStr.includes('colheres')) {
      portionText = `${Math.max(1, Math.round(finalQty))} colheres`;
    } else if (unitStr.includes('concha')) {
      const conchas = Number((finalQty).toFixed(1));
      portionText = `${conchas} concha(s) (~${Math.round(conchas * 100)}g)`;
    } else if (unitStr.includes('fatia')) {
      portionText = `${Math.max(1, Math.round(finalQty))} fatia(s)`;
    } else {
      portionText = `${finalQty} ${unitStr}`;
    }

    return {
      name: title,
      portion: portionText,
      scaledPortion: portionText,
      kcal: finalKcal,
      prot: finalProt,
      carb: finalCarb,
      fat: finalFat
    };
  }

  function renderWeeklyTabs() {
    const tabsContainer = document.getElementById('week-days-tabs');
    if (!tabsContainer || !menuState.weeklyPlan) return;

    tabsContainer.innerHTML = '';
    DAYS_OF_WEEK.forEach((d, idx) => {
      const dayData = menuState.weeklyPlan[d.key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `day-tab-btn ${idx === menuState.currentDayIndex ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="day-short">${d.label.split('-')[0]}</span>
        <span class="day-kcal">${dayData ? dayData.totalKcal : 0} kcal</span>
      `;

      btn.addEventListener('click', () => {
        menuState.currentDayIndex = idx;
        const allBtns = tabsContainer.querySelectorAll('.day-tab-btn');
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderDayPlan(d.key);
      });

      tabsContainer.appendChild(btn);
    });
  }

  function renderDayPlan(dayKey) {
    const dayData = menuState.weeklyPlan[dayKey];
    const container = document.getElementById('day-plan-content');
    if (!container || !dayData) return;

    const diffKcal = dayData.totalKcal - menuState.targetCalories;
    const diffSign = diffKcal >= 0 ? `+${diffKcal}` : `${diffKcal}`;

    container.innerHTML = `
      <div class="day-summary-header">
        <div>
          <h3>Cardápio para ${dayData.label}</h3>
          <p>Estrutura equilibrada com proteína animal, carboidrato, leguminosa e vegetais</p>
        </div>
        <div class="day-macro-summary">
          <div class="sum-pill kcal"><strong>${dayData.totalKcal}</strong> kcal <span style="font-size: 0.75rem; color: #64748B;">(${diffSign} kcal)</span></div>
          <div class="sum-pill">Proteínas: <strong>${dayData.totalProt}g</strong></div>
          <div class="sum-pill">Carboidratos: <strong>${dayData.totalCarb}g</strong></div>
          <div class="sum-pill">Gorduras: <strong>${dayData.totalFat}g</strong></div>
        </div>
      </div>

      <div class="meals-timeline-list">
        ${dayData.meals.map(m => `
          <div class="meal-card-item">
            <div class="meal-card-head">
              <div class="meal-title-group">
                <span class="meal-badge-icon">${m.icon}</span>
                <div>
                  <h5>${m.name}</h5>
                  <span class="meal-target-sub">Alvo da refeição: ~${m.targetKcal} kcal</span>
                </div>
              </div>
              <div class="meal-total-kcal">${m.actualKcal} kcal</div>
            </div>

            <div class="meal-foods-table">
              ${m.foods.map(f => `
                <div class="food-row">
                  <div class="food-main-desc">
                    <span class="bullet">•</span>
                    <strong>${f.name}</strong>
                    <span class="food-portion-tag">${f.scaledPortion}</span>
                  </div>
                  <div class="food-macro-badges">
                    <span class="macro-badge c">${f.carb}g C</span>
                    <span class="macro-badge p">${f.prot}g P</span>
                    <span class="macro-badge g">${f.fat}g G</span>
                    <span class="macro-badge k">${f.kcal} kcal</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Dicionário canônico para consolidação inteligente de compras no mercado
  function mapFoodToGroceryItem(rawName) {
    const n = rawName.toLowerCase();

    // 1. AÇOUGUE & PEIXARIA
    if (n.includes('frango') || n.includes('sassami')) {
      return {
        key: 'frango',
        category: '🥩 Açougue & Peixaria',
        name: 'Peito de frango (filé ou sassami)',
        unitType: 'meat_grams',
        weightRawEst: 180
      };
    }
    if (n.includes('patinho') || n.includes('carne bovina') || n.includes('alcatra')) {
      return {
        key: 'carne_bovina',
        category: '🥩 Açougue & Peixaria',
        name: 'Carne bovina magra (Patinho moído ou Alcatra)',
        unitType: 'meat_grams',
        weightRawEst: 180
      };
    }
    if (n.includes('tilápia') || n.includes('peixe') || n.includes('atum')) {
      return {
        key: 'peixe_tilapia',
        category: '🥩 Açougue & Peixaria',
        name: 'Filé de tilápia fresca ou atum sólido',
        unitType: 'meat_grams',
        weightRawEst: 170
      };
    }

    // 2. HORTIFRUTI & FEIRA
    if (n.includes('ovo') || n.includes('omelete')) {
      const eggsCount = n.includes('3 ovos') ? 3 : (n.includes('1 ovo') ? 1 : 2);
      return {
        key: 'ovos',
        category: '🥬 Hortifruti & Feira',
        name: 'Ovos de galinha (brancos ou caipiras)',
        unitType: 'eggs',
        unitsEst: eggsCount
      };
    }
    if (n.includes('banana')) {
      return {
        key: 'banana',
        category: '🥬 Hortifruti & Feira',
        name: 'Banana prata fresca',
        unitType: 'bananas',
        unitsEst: 1
      };
    }
    if (n.includes('mamão') || n.includes('mamao')) {
      return {
        key: 'mamao',
        category: '🥬 Hortifruti & Feira',
        name: 'Mamão papaia',
        unitType: 'fixed_purchase',
        fixedText: '1 a 2 unidades médias'
      };
    }
    if (n.includes('maçã') || n.includes('maca') || n.includes('pêra') || n.includes('pera')) {
      return {
        key: 'maca',
        category: '🥬 Hortifruti & Feira',
        name: 'Maçã nacional higienizada',
        unitType: 'apples',
        unitsEst: 1
      };
    }
    if (n.includes('batata-doce') || n.includes('batata doce')) {
      return {
        key: 'batata_doce',
        category: '🥬 Hortifruti & Feira',
        name: 'Batata-doce roxa ou branca',
        unitType: 'fixed_weight',
        gramsPerMeal: 160
      };
    }
    if (n.includes('batata inglesa') || n.includes('batata-inglesa') || n.includes('purê')) {
      return {
        key: 'batata_inglesa',
        category: '🥬 Hortifruti & Feira',
        name: 'Batata inglesa para cozinhar',
        unitType: 'fixed_weight',
        gramsPerMeal: 160
      };
    }
    if (n.includes('mandioca') || n.includes('aipim')) {
      return {
        key: 'mandioca',
        category: '🥬 Hortifruti & Feira',
        name: 'Mandioca (aipim) fresca ou descascada',
        unitType: 'fixed_weight',
        gramsPerMeal: 160
      };
    }
    if (n.includes('salada') || n.includes('alface') || n.includes('rúcula') || n.includes('folhas')) {
      return {
        key: 'folhas_verdes',
        category: '🥬 Hortifruti & Feira',
        name: 'Folhas verdes (Alface, Rúcula ou Espinafre)',
        unitType: 'fixed_purchase',
        fixedText: '2 a 3 maços frescos'
      };
    }
    if (n.includes('legumes') || n.includes('cenoura') || n.includes('brócolis') || n.includes('abobrinha')) {
      return {
        key: 'mix_legumes',
        category: '🥬 Hortifruti & Feira',
        name: 'Mix de legumes (Cenoura, Abobrinha, Brócolis, Tomate)',
        unitType: 'fixed_purchase',
        fixedText: '~1 kg variado para cozinhar'
      };
    }
    if (n.includes('morango')) {
      return {
        key: 'morango',
        category: '🥬 Hortifruti & Feira',
        name: 'Morangos frescos',
        unitType: 'fixed_purchase',
        fixedText: '1 caixa (250g)'
      };
    }
    if (n.includes('abacate')) {
      return {
        key: 'abacate',
        category: '🥬 Hortifruti & Feira',
        name: 'Abacate maduro',
        unitType: 'fixed_purchase',
        fixedText: '1 a 2 unidades'
      };
    }

    // 3. MERCEARIA & GRÃOS
    if (n.includes('arroz')) {
      return {
        key: 'arroz',
        category: '🍚 Mercearia & Grãos',
        name: 'Arroz (branco ou integral)',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (1 kg)'
      };
    }
    if (n.includes('feijão') || n.includes('feijao')) {
      return {
        key: 'feijao',
        category: '🍚 Mercearia & Grãos',
        name: 'Feijão (carioca ou preto)',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (1 kg)'
      };
    }
    if (n.includes('grão-de-bico') || n.includes('grao de bico')) {
      return {
        key: 'grao_bico',
        category: '🍚 Mercearia & Grãos',
        name: 'Grão-de-bico seco ou em conserva',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (500g)'
      };
    }
    if (n.includes('aveia')) {
      return {
        key: 'aveia',
        category: '🍚 Mercearia & Grãos',
        name: 'Aveia em flocos finos',
        unitType: 'fixed_purchase',
        fixedText: '1 caixa (250g a 500g)'
      };
    }
    if (n.includes('tapioca') || n.includes('crepioca')) {
      return {
        key: 'tapioca',
        category: '🍚 Mercearia & Grãos',
        name: 'Goma de tapioca hidratada',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (500g)'
      };
    }
    if (n.includes('cuscuz') || n.includes('milho')) {
      return {
        key: 'cuscuz',
        category: '🍚 Mercearia & Grãos',
        name: 'Flocão de milho para cuscuz',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (500g)'
      };
    }
    if (n.includes('azeite')) {
      return {
        key: 'azeite',
        category: '🍚 Mercearia & Grãos',
        name: 'Azeite de oliva extra virgem',
        unitType: 'fixed_purchase',
        fixedText: '1 garrafa (500ml)'
      };
    }
    if (n.includes('café') || n.includes('cafe')) {
      return {
        key: 'cafe_po',
        category: '🍚 Mercearia & Grãos',
        name: 'Café em pó tradicional',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote (500g)'
      };
    }
    if (n.includes('chá') || n.includes('cha') || n.includes('camomila')) {
      return {
        key: 'cha_camomila',
        category: '🍚 Mercearia & Grãos',
        name: 'Chá de camomila ou erva-cidreira em sachê',
        unitType: 'fixed_purchase',
        fixedText: '1 caixinha (10 a 15 sachês)'
      };
    }

    // 4. PADARIA
    if (n.includes('pão francês') || n.includes('pao frances')) {
      return {
        key: 'pao_frances',
        category: '🥖 Padaria',
        name: 'Pão francês fresquinho',
        unitType: 'bread_french',
        unitsEst: 2
      };
    }
    if (n.includes('pão') || n.includes('pao') || n.includes('integral') || n.includes('sanduíche') || n.includes('sanduiche')) {
      return {
        key: 'pao_integral',
        category: '🥖 Padaria',
        name: 'Pão de forma 100% integral',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote fatiado (400g a 500g)'
      };
    }

    // 5. LATICÍNIOS & FRIOS
    if (n.includes('queijo') || n.includes('ricota')) {
      return {
        key: 'queijo_minas',
        category: '🧀 Laticínios & Frios',
        name: 'Queijo minas frescal, ricota ou cottage',
        unitType: 'fixed_purchase',
        fixedText: '1 peça (~300g a 500g)'
      };
    }
    if (n.includes('iogurte')) {
      return {
        key: 'iogurte',
        category: '🧀 Laticínios & Frios',
        name: 'Iogurte natural desnatado sem açúcar',
        unitType: 'yogurt_pots',
        unitsEst: 1
      };
    }
    if (n.includes('leite')) {
      return {
        key: 'leite',
        category: '🧀 Laticínios & Frios',
        name: 'Leite desnatado ou semidesnatado',
        unitType: 'fixed_purchase',
        fixedText: '1 a 2 litros'
      };
    }

    // 6. EMPÓRIO & SUPLEMENTOS
    if (n.includes('castanha') || n.includes('nozes')) {
      return {
        key: 'castanhas',
        category: '🥜 Empório & Suplementos',
        name: 'Castanha-do-Pará ou nozes',
        unitType: 'fixed_purchase',
        fixedText: '1 pacote pequeno (~100g a 150g)'
      };
    }
    if (n.includes('amendoim') || n.includes('pasta de amendoim')) {
      return {
        key: 'pasta_amendoim',
        category: '🥜 Empório & Suplementos',
        name: 'Pasta de amendoim integral 100% pura',
        unitType: 'fixed_purchase',
        fixedText: '1 pote (450g a 500g)'
      };
    }
    if (n.includes('whey')) {
      return {
        key: 'whey_protein',
        category: '🥜 Empório & Suplementos',
        name: 'Whey Protein (concentrado ou isolado)',
        unitType: 'fixed_purchase',
        fixedText: '1 pote ou refil (900g)'
      };
    }

    // Fallback genérico
    return {
      key: 'misc_' + rawName.slice(0, 15).replace(/\s+/g, '_'),
      category: '🛒 Mercearia Geral',
      name: rawName,
      unitType: 'fixed_purchase',
      fixedText: '1 unidade/porção'
    };
  }

  function generateGroceryList() {
    if (!menuState.weeklyPlan) return;

    // Mapa de itens canônicos consolidados
    const groceryMap = {};

    Object.keys(menuState.weeklyPlan).forEach(dayKey => {
      const day = menuState.weeklyPlan[dayKey];
      day.meals.forEach(meal => {
        meal.foods.forEach(food => {
          const mapping = mapFoodToGroceryItem(food.name);
          if (!groceryMap[mapping.key]) {
            groceryMap[mapping.key] = {
              name: mapping.name,
              category: mapping.category,
              unitType: mapping.unitType,
              fixedText: mapping.fixedText || '',
              totalWeight: 0,
              totalUnits: 0,
              occurrences: 0
            };
          }

          groceryMap[mapping.key].occurrences += 1;

          if (mapping.unitType === 'meat_grams') {
            groceryMap[mapping.key].totalWeight += (mapping.weightRawEst || 180);
          } else if (mapping.unitType === 'fixed_weight') {
            groceryMap[mapping.key].totalWeight += (mapping.gramsPerMeal || 150);
          } else if (mapping.unitType === 'eggs' || mapping.unitType === 'bananas' || mapping.unitType === 'apples' || mapping.unitType === 'bread_french' || mapping.unitType === 'yogurt_pots') {
            groceryMap[mapping.key].totalUnits += (mapping.unitsEst || 1);
          }
        });
      });
    });

    // Calcula texto de quantidade exata e realista de compra
    const consolidatedList = Object.keys(groceryMap).map(key => {
      const it = groceryMap[key];
      let quantityText = '';

      if (it.unitType === 'meat_grams') {
        const kg = Math.ceil(it.totalWeight / 250) * 0.25; // arredonda de 250g em 250g
        quantityText = `~${kg.toFixed(1).replace('.', ',')} kg (para a semana toda)`;
      } else if (it.unitType === 'fixed_weight') {
        const kg = Math.max(0.5, Math.ceil(it.totalWeight / 500) * 0.5);
        quantityText = `~${kg.toFixed(1).replace('.', ',')} kg`;
      } else if (it.unitType === 'eggs') {
        const cartelas = it.totalUnits > 20 ? '1 cartela de 30 ovos' : (it.totalUnits > 12 ? '1 cartela de 20 ovos' : '1 dúzia (12 ovos)');
        quantityText = `${it.totalUnits} ovos (${cartelas})`;
      } else if (it.unitType === 'bananas') {
        quantityText = `${it.totalUnits} unidades (1 cacho com ~${Math.max(6, it.totalUnits)} bananas)`;
      } else if (it.unitType === 'apples') {
        quantityText = `${it.totalUnits} a ${it.totalUnits + 2} unidades`;
      } else if (it.unitType === 'bread_french') {
        quantityText = `${it.totalUnits} a ${it.totalUnits + 2} pães franceses frescos`;
      } else if (it.unitType === 'yogurt_pots') {
        quantityText = `${it.totalUnits} potes individuais (160g cada)`;
      } else if (it.fixedText) {
        quantityText = it.fixedText;
      } else {
        quantityText = `${it.occurrences}x porções na semana`;
      }

      return {
        key,
        name: it.name,
        category: it.category,
        quantity: quantityText,
        occurrences: it.occurrences
      };
    });

    // Agrupa por Categorias de Supermercado
    const categories = [
      '🥩 Açougue & Peixaria',
      '🥬 Hortifruti & Feira',
      '🍚 Mercearia & Grãos',
      '🧀 Laticínios & Frios',
      '🥖 Padaria',
      '🥜 Empório & Suplementos',
      '🛒 Mercearia Geral'
    ];

    const modal = document.getElementById('grocery-modal');
    const listBody = document.getElementById('grocery-list-body');
    if (!modal || !listBody) return;

    const totalItems = consolidatedList.length;

    let html = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border-card);">
        <div style="display: flex; gap: 8px; align-items: center;">
          <button type="button" id="btn-toggle-all-grocery" class="btn-select-all" style="padding: 7px 16px; font-weight: 700; font-size: 0.82rem;">
            ✓ Marcar Todos
          </button>
          <button type="button" id="btn-copy-grocery" class="btn-select-all" style="background: var(--bg-subtle); color: var(--text-body); border-color: var(--border-card); font-size: 0.82rem;">
            📋 Copiar Lista (WhatsApp)
          </button>
        </div>
        <span id="grocery-counter" style="font-size: 0.84rem; font-weight: 700; color: var(--primary);">
          0 de ${totalItems} itens no carrinho
        </span>
      </div>
    `;

    categories.forEach(cat => {
      const itemsInCat = consolidatedList.filter(i => i.category === cat);
      if (itemsInCat.length === 0) return;

      html += `
        <div style="margin-bottom: 22px;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; padding-left: 2px;">
            ${cat}
          </h4>
          <div class="grocery-grid-items">
            ${itemsInCat.map(item => `
              <div class="grocery-item-card" id="card-${item.key}">
                <input type="checkbox" class="grocery-chk" id="item-${item.key}">
                <label for="item-${item.key}">
                  <strong>${item.name}</strong>
                  <span style="color: var(--primary); font-weight: 700; font-size: 0.8rem; margin-top: 2px;">Comprar: ${item.quantity}</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">Consumo em ${item.occurrences} refeições da semana</span>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    listBody.innerHTML = html;

    // Lógica de Marcar / Desmarcar Todos
    const btnToggleAll = document.getElementById('btn-toggle-all-grocery');
    const chks = listBody.querySelectorAll('.grocery-chk');
    const counterEl = document.getElementById('grocery-counter');

    function updateCounter() {
      const checkedCount = listBody.querySelectorAll('.grocery-chk:checked').length;
      if (counterEl) {
        counterEl.textContent = `${checkedCount} de ${totalItems} itens no carrinho`;
      }
      if (btnToggleAll) {
        if (checkedCount === totalItems && totalItems > 0) {
          btnToggleAll.textContent = '✕ Desmarcar Todos';
          btnToggleAll.style.background = '#FEE2E2';
          btnToggleAll.style.color = '#DC2626';
          btnToggleAll.style.borderColor = '#FCA5A5';
        } else {
          btnToggleAll.textContent = '✓ Marcar Todos';
          btnToggleAll.style.background = '';
          btnToggleAll.style.color = '';
          btnToggleAll.style.borderColor = '';
        }
      }
    }

    chks.forEach(chk => {
      chk.addEventListener('change', () => {
        const parentCard = chk.closest('.grocery-item-card');
        if (chk.checked) {
          parentCard.style.opacity = '0.55';
          parentCard.querySelector('strong').style.textDecoration = 'line-through';
        } else {
          parentCard.style.opacity = '1';
          parentCard.querySelector('strong').style.textDecoration = 'none';
        }
        updateCounter();
      });
    });

    if (btnToggleAll) {
      btnToggleAll.addEventListener('click', () => {
        const currentlyChecked = listBody.querySelectorAll('.grocery-chk:checked').length;
        const markAll = currentlyChecked < totalItems;

        chks.forEach(chk => {
          chk.checked = markAll;
          const parentCard = chk.closest('.grocery-item-card');
          if (markAll) {
            parentCard.style.opacity = '0.55';
            parentCard.querySelector('strong').style.textDecoration = 'line-through';
          } else {
            parentCard.style.opacity = '1';
            parentCard.querySelector('strong').style.textDecoration = 'none';
          }
        });
        updateCounter();
      });
    }

    // Copiar para WhatsApp formatado por categoria e com quantidades exatas
    const btnCopy = document.getElementById('btn-copy-grocery');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const lines = [
          '🛒 *LISTA DE COMPRAS SEMANAL - J4 FITNESS*',
          'Quantidades calculadas para cobrir seu plano alimentar de Segunda a Domingo:\n'
        ];

        categories.forEach(cat => {
          const itemsInCat = consolidatedList.filter(i => i.category === cat);
          if (itemsInCat.length === 0) return;

          lines.push(`*${cat.toUpperCase()}*`);
          itemsInCat.forEach(it => {
            lines.push(`• *${it.name}* ➔ Comprar: _${it.quantity}_`);
          });
          lines.push('');
        });

        lines.push('_Gerado por J4 Fitness: https://j4fitnes.5450wp.easypanel.host/cardapio.html_');

        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
          alert('Lista de compras detalhada copiada! Você pode colar diretamente no WhatsApp.');
        }).catch(() => {
          prompt('Copie a lista abaixo:', text);
        });
      });
    }

    modal.style.display = 'flex';
  }

  function setupEvents() {
    const btnGenerate = document.getElementById('btn-gerar-cardapio');
    if (btnGenerate) {
      btnGenerate.addEventListener('click', (e) => {
        e.preventDefault();
        generateWeeklyPlan();
      });
    }

    const btnPrint = document.getElementById('btn-imprimir-cardapio');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const btnGrocery = document.getElementById('btn-lista-compras');
    if (btnGrocery) {
      btnGrocery.addEventListener('click', () => {
        generateGroceryList();
      });
    }

    const btnCloseModal = document.getElementById('btn-close-modal');
    const modal = document.getElementById('grocery-modal');
    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadCalculatorData();
    updateHeaderDisplays();
    renderMealCheckboxes();
    renderRuleNotice();
    setupEvents();
    generateWeeklyPlan();
  });
})();
