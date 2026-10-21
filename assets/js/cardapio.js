/**
 * J4 FITNESS - MOTOR DE CARDÁPIO SEMANAL PERSONALIZADO
 * Base nutricional brasileira (TACO / IBGE) e distribuição balanceada de macros
 */

(function () {
  'use strict';

  // Banco de Alimentos Típicos do Brasil com porções e tabela nutricional
  // Macros por porção de referência
  const FOOD_DATABASE = {
    desjejum: [
      { id: 'agua_limao', name: 'Água morna com meio limão espremido', portion: '1 copo (250ml)', kcal: 8, prot: 0.2, carb: 2, fat: 0 },
      { id: 'cafe_puro', name: 'Café preto coado (sem açúcar)', portion: '1 xícara (100ml)', kcal: 2, prot: 0.1, carb: 0.3, fat: 0 },
      { id: 'shot_imunidade', name: 'Shot matinal (água, própolis e cúrcuma)', portion: '1 dose (50ml)', kcal: 15, prot: 0.1, carb: 3, fat: 0.1 },
      { id: 'cha_verde', name: 'Chá verde natural infusionado', portion: '1 xícara (150ml)', kcal: 2, prot: 0, carb: 0.5, fat: 0 },
      { id: 'glutamina_creatina', name: 'Creatina (5g) em 200ml de água', portion: '1 copo', kcal: 20, prot: 5, carb: 0, fat: 0 }
    ],

    cafe_manha: [
      { id: 'ovos_mexidos', name: 'Ovos mexidos ou cozidos', portion: '2 unidades médias (100g)', kcal: 150, prot: 13, carb: 1, fat: 10.5 },
      { id: 'pao_frances', name: 'Pão francês fresquinho', portion: '1 unidade (50g)', kcal: 135, prot: 4.1, carb: 28, fat: 1.5 },
      { id: 'pao_integral', name: 'Pão 100% integral', portion: '2 fatias (50g)', kcal: 120, prot: 4.5, carb: 22, fat: 1.5 },
      { id: 'tapioca', name: 'Tapioca de frigideira', portion: '3 colheres de sopa de goma (50g)', kcal: 115, prot: 0.1, carb: 28, fat: 0.1 },
      { id: 'cuscuz', name: 'Cuscuz de milho nordestino', portion: '1 fatia média (100g)', kcal: 112, prot: 2.5, carb: 25, fat: 0.5 },
      { id: 'queijo_minas', name: 'Queijo minas frescal ou ricota', portion: '1 fatia média (30g)', kcal: 66, prot: 5.2, carb: 1, fat: 4.8 },
      { id: 'banana', name: 'Banana prata ou nanica', portion: '1 unidade média (70g)', kcal: 70, prot: 0.9, carb: 18, fat: 0.2 },
      { id: 'mamao', name: 'Mamão papaia picado', portion: '1 fatia generosa (100g)', kcal: 45, prot: 0.5, carb: 11, fat: 0.1 },
      { id: 'aveia', name: 'Aveia em flocos finos', portion: '2 colheres de sopa (30g)', kcal: 105, prot: 4.3, carb: 17, fat: 2.2 },
      { id: 'iogurte_natural', name: 'Iogurte natural desnatado', portion: '1 pote (160g)', kcal: 85, prot: 6.8, carb: 9.5, fat: 2 },
      { id: 'pasta_amendoim', name: 'Pasta de amendoim integral', portion: '1 colher de sopa rasa (15g)', kcal: 90, prot: 4, carb: 3, fat: 7.5 },
      { id: 'cafe_com_leite', name: 'Café com leite semidesnatado', portion: '1 xícara média (150ml)', kcal: 65, prot: 4.5, carb: 7, fat: 2.2 }
    ],

    almoco: [
      { id: 'arroz_branco', name: 'Arroz branco tradicional cozido', portion: '2 colheres de servir (100g)', kcal: 130, prot: 2.6, carb: 28, fat: 0.4 },
      { id: 'arroz_integral', name: 'Arroz integral soltinho', portion: '2 colheres de servir (100g)', kcal: 120, prot: 2.6, carb: 26, fat: 1 },
      { id: 'feijao_carioca', name: 'Feijão carioca temperado', portion: '1 concha média (100g)', kcal: 76, prot: 4.8, carb: 13.6, fat: 0.5 },
      { id: 'feijao_preto', name: 'Feijão preto cozido', portion: '1 concha média (100g)', kcal: 77, prot: 4.5, carb: 14, fat: 0.5 },
      { id: 'frango_grelhado', name: 'Peito de frango grelhado em tiras', portion: '1 filé médio (120g)', kcal: 192, prot: 37, carb: 0, fat: 3.8 },
      { id: 'patinho_moido', name: 'Patinho bovino moído refogado', portion: '1 porção média (120g)', kcal: 220, prot: 38, carb: 0, fat: 7 },
      { id: 'tilapia_peixe', name: 'Filé de tilápia grelhada', portion: '1 filé médio (130g)', kcal: 156, prot: 34, carb: 0, fat: 2.5 },
      { id: 'batata_doce', name: 'Batata-doce cozida ou assada', portion: '1 unidade média (100g)', kcal: 77, prot: 1.3, carb: 18.4, fat: 0.1 },
      { id: 'batata_inglesa', name: 'Batata inglesa cozida', portion: '1 unidade média (120g)', kcal: 65, prot: 1.5, carb: 15, fat: 0.1 },
      { id: 'mandioca', name: 'Mandioca (aipim) cozida', portion: '1 pedaço médio (100g)', kcal: 125, prot: 0.6, carb: 30, fat: 0.3 },
      { id: 'salada_verde', name: 'Salada de folhas verdes à vontade (alface, rúcula)', portion: '1 prato raso cheio', kcal: 18, prot: 1.5, carb: 3, fat: 0.2 },
      { id: 'legumes_cozidos', name: 'Mix de legumes (cenoura, abobrinha, brócolis)', portion: '1 pegador (100g)', kcal: 35, prot: 2, carb: 7, fat: 0.3 },
      { id: 'azeite_oliva', name: 'Azeite de oliva extra virgem', portion: '1 colher de sobremesa (5ml)', kcal: 44, prot: 0, carb: 0, fat: 5 }
    ],

    cafe_tarde: [
      { id: 'sanduiche_frango', name: 'Sanduíche natural de pão integral e frango', portion: '1 unidade', kcal: 210, prot: 18, carb: 24, fat: 4 },
      { id: 'crepioca', name: 'Crepioca (1 ovo + 2 colheres de tapioca)', portion: '1 unidade média', kcal: 155, prot: 7.5, carb: 19, fat: 5.5 },
      { id: 'iogurte_fruta', name: 'Iogurte natural com morango picado', portion: '1 taça (180g)', kcal: 115, prot: 7.2, carb: 16, fat: 2.2 },
      { id: 'shake_whey', name: 'Shake de Whey Protein com água ou leite desnatado', portion: '1 dose (30g)', kcal: 125, prot: 24, carb: 3, fat: 1.5 },
      { id: 'maca_castanhas', name: 'Maçã nacional com 3 castanhas-do-Pará', portion: '1 porção', kcal: 170, prot: 2.5, carb: 21, fat: 10 },
      { id: 'banana_aveia_canela', name: 'Banana aquecida com aveia e canela', portion: '1 pratinho', kcal: 175, prot: 5.2, carb: 35, fat: 2.4 },
      { id: 'queijo_coalho', name: 'Queijo branco ou ricota com torrada integral', portion: '2 torradas + 30g queijo', kcal: 140, prot: 8, carb: 15, fat: 5 }
    ],

    janta: [
      { id: 'janta_arroz_feijao', name: 'Arroz, feijão e peito de frango com legumes', portion: '1 prato balanceado', kcal: 420, prot: 42, carb: 48, fat: 5.5 },
      { id: 'patinho_pure', name: 'Patinho moído com purê de batata inglesa', portion: '1 prato médio', kcal: 360, prot: 38, carb: 32, fat: 7.5 },
      { id: 'omelete_completo', name: 'Omelete de 3 ovos com tomate, cebola e espinafre', portion: '1 omelete grande', kcal: 245, prot: 20, carb: 4, fat: 16.5 },
      { id: 'tilapia_legumes', name: 'Filé de tilápia assado com abobrinha e cenoura', portion: '1 porção farta', kcal: 260, prot: 36, carb: 12, fat: 4 },
      { id: 'sopa_legumes_frango', name: 'Sopa caseira de legumes com frango desfiado', portion: '1 prato fundo (300ml)', kcal: 230, prot: 25, carb: 22, fat: 3.5 },
      { id: 'salada_atum', name: 'Saladão colorido com atum sólido e grão-de-bico', portion: '1 bowl grande', kcal: 310, prot: 32, carb: 26, fat: 5 }
    ],

    ceia: [
      { id: 'abacate_limao', name: 'Abacate amassado com gotas de limão', portion: '2 colheres de sopa (50g)', kcal: 80, prot: 1, carb: 3, fat: 8 },
      { id: 'cha_camomila', name: 'Chá calmante de camomila ou melissa (sem açúcar)', portion: '1 xícara (200ml)', kcal: 2, prot: 0, carb: 0.5, fat: 0 },
      { id: 'castanhas_para', name: 'Castanha-do-Pará', portion: '2 unidades (10g)', kcal: 65, prot: 1.4, carb: 1.2, fat: 6.5 },
      { id: 'iogurte_ceia', name: 'Iogurte natural desnatado com canela em pó', portion: '1 pote pequeno (120g)', kcal: 65, prot: 5.5, carb: 7, fat: 1.2 },
      { id: 'ovo_cozido_ceia', name: 'Ovo cozido com pitada de orégano', portion: '1 unidade', kcal: 75, prot: 6.5, carb: 0.5, fat: 5.3 },
      { id: 'leite_morno_canela', name: 'Leite desnatado morno com canela', portion: '1 xícara (150ml)', kcal: 50, prot: 4.8, carb: 7.2, fat: 0.2 }
    ]
  };

  const MEAL_LABELS = {
    desjejum: { name: 'Desjejum (Ao acordar)', icon: '🌅', pct: 0.05 },
    cafe_manha: { name: 'Café da Manhã', icon: '☕', pct: 0.22 },
    almoco: { name: 'Almoço Completo', icon: '🥗', pct: 0.33 },
    cafe_tarde: { name: 'Café da Tarde / Lanche', icon: '🥪', pct: 0.15 },
    janta: { name: 'Jantar', icon: '🍲', pct: 0.20 },
    ceia: { name: 'Ceia (Antes de dormir)', icon: '🌙', pct: 0.05 }
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
    targetCalories: 2200,
    bmr: 1750,
    tdee: 2700,
    goal: 'deficit',
    macros: { carb: 220, prot: 180, fat: 60 },
    selectedMeals: ['cafe_manha', 'almoco', 'cafe_tarde', 'janta'],
    selectedFoods: {
      desjejum: ['agua_limao'],
      cafe_manha: ['ovos_mexidos', 'pao_integral', 'banana', 'cafe_com_leite'],
      almoco: ['arroz_branco', 'feijao_carioca', 'frango_grelhado', 'salada_verde', 'azeite_oliva'],
      cafe_tarde: ['crepioca', 'maca_castanhas'],
      janta: ['janta_arroz_feijao', 'salada_verde'],
      ceia: ['cha_camomila', 'castanhas_para']
    },
    weeklyPlan: null,
    currentDayIndex: 0
  };

  // Carrega os dados da calculadora principal
  function loadCalculatorData() {
    try {
      const stored = localStorage.getItem('j4fitness_user_metrics') || localStorage.getItem('j4fitnes_user_metrics');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.bmr) menuState.bmr = data.bmr;
        if (data.tdee) menuState.tdee = data.tdee;
        if (data.state && data.state.goal) menuState.goal = data.state.goal;

        // Determina alvo calórico
        const goalPcts = { deficit: -0.20, maintenance: 0.0, lean_bulk: 0.12, bulk: 0.20 };
        const factor = 1 + (goalPcts[menuState.goal] || -0.20);
        menuState.targetCalories = Math.round(menuState.tdee * factor);

        // Macros aproximados (40% carb, 35% prot, 25% fat)
        menuState.macros.carb = Math.round((menuState.targetCalories * 0.40) / 4);
        menuState.macros.prot = Math.round((menuState.targetCalories * 0.35) / 4);
        menuState.macros.fat = Math.round((menuState.targetCalories * 0.25) / 9);
      }
    } catch (e) {
      console.warn('Erro ao carregar dados da calculadora:', e);
    }
  }

  // Renderiza a interface de seleção de refeições
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
          <span class="meal-hint">${isChecked ? 'Selecionada' : 'Clique para incluir'}</span>
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
          label.querySelector('.meal-hint').textContent = 'Selecionada';
        } else {
          // Garante ao menos 2 refeições
          if (menuState.selectedMeals.length <= 2) {
            alert('Por favor, selecione ao menos 2 refeições para o seu dia.');
            input.checked = true;
            return;
          }
          menuState.selectedMeals = menuState.selectedMeals.filter(m => m !== mealKey);
          label.classList.remove('active');
          label.querySelector('.meal-hint').textContent = 'Clique para incluir';
        }
        renderFoodPreferences();
      });

      container.appendChild(label);
    });
  }

  // Renderiza as seções de escolha de alimentos para cada refeição ativa
  function renderFoodPreferences() {
    const container = document.getElementById('food-preferences-container');
    if (!container) return;

    container.innerHTML = '';

    menuState.selectedMeals.forEach(mealKey => {
      const meal = MEAL_LABELS[mealKey];
      const foods = FOOD_DATABASE[mealKey] || [];
      const currentSelected = menuState.selectedFoods[mealKey] || [];

      const box = document.createElement('div');
      box.className = 'food-category-box';
      box.innerHTML = `
        <div class="category-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.3rem;">${meal.icon}</span>
            <div>
              <h4>${meal.name}</h4>
              <p>Selecione os alimentos saudáveis que você mais gosta nessa refeição:</p>
            </div>
          </div>
          <button type="button" class="btn-select-all" data-meal="${mealKey}">Marcar Sugeridos</button>
        </div>
        <div class="food-pills-wrap" id="pills-${mealKey}"></div>
      `;

      const pillsWrap = box.querySelector(`#pills-${mealKey}`);

      foods.forEach(food => {
        const isSelected = currentSelected.includes(food.id);
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `food-pill ${isSelected ? 'selected' : ''}`;
        pill.innerHTML = `
          <span class="check-mark">${isSelected ? '✓' : '+'}</span>
          <span class="food-name">${food.name}</span>
          <span class="food-cal">${food.kcal} kcal</span>
        `;

        pill.addEventListener('click', () => {
          const list = menuState.selectedFoods[mealKey] || [];
          if (list.includes(food.id)) {
            if (list.length <= 1) {
              alert('Mantenha pelo menos um alimento selecionado por refeição.');
              return;
            }
            menuState.selectedFoods[mealKey] = list.filter(id => id !== food.id);
            pill.classList.remove('selected');
            pill.querySelector('.check-mark').textContent = '+';
          } else {
            list.push(food.id);
            menuState.selectedFoods[mealKey] = list;
            pill.classList.add('selected');
            pill.querySelector('.check-mark').textContent = '✓';
          }
        });

        pillsWrap.appendChild(pill);
      });

      // Botão marcar todos sugeridos
      const btnAll = box.querySelector('.btn-select-all');
      btnAll.addEventListener('click', () => {
        menuState.selectedFoods[mealKey] = foods.map(f => f.id);
        const allPills = pillsWrap.querySelectorAll('.food-pill');
        allPills.forEach(p => {
          p.classList.add('selected');
          p.querySelector('.check-mark').textContent = '✓';
        });
      });

      container.appendChild(box);
    });
  }

  /**
   * Algoritmo de Geração Semanal Inteligente
   * Distribui calorias proporcionais por refeição e varia alimentos a cada dia
   */
  function generateWeeklyPlan() {
    const totalTarget = menuState.targetCalories;
    const plan = {};

    // Calcula proporções ajustadas para o número de refeições selecionadas
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
        const mealTargetKcal = Math.round(totalTarget * normalizedPct);

        const availableFoodIds = menuState.selectedFoods[mealKey] || [];
        const pool = FOOD_DATABASE[mealKey].filter(f => availableFoodIds.includes(f.id));

        if (pool.length === 0) return;

        // Variação dos alimentos com base no dia da semana
        // Escolhe de 2 a 3 alimentos que combinem bem para atingir a meta
        const chosenFoods = [];
        let accumulatedKcal = 0;

        // Sorteia ou escala circularmente pelo índice do dia
        const startIndex = dayIndex % pool.length;
        const candidate1 = pool[startIndex];
        const candidate2 = pool[(startIndex + 1) % pool.length];
        const candidate3 = pool.length > 2 ? pool[(startIndex + 2) % pool.length] : null;

        const selectedForMeal = [candidate1];
        if (candidate2 && candidate2.id !== candidate1.id) selectedForMeal.push(candidate2);
        if (candidate3 && candidate3.id !== candidate1.id && candidate3.id !== candidate2.id && mealTargetKcal > 300) {
          selectedForMeal.push(candidate3);
        }

        // Soma inicial dos itens selecionados
        let baseSumKcal = selectedForMeal.reduce((sum, item) => sum + item.kcal, 0);
        if (baseSumKcal <= 0) baseSumKcal = 1;

        // Fator de escala para bater precisamente com a meta da refeição
        const scaleFactor = Math.max(0.6, Math.min(2.5, mealTargetKcal / baseSumKcal));

        selectedForMeal.forEach(f => {
          const itemKcal = Math.round(f.kcal * scaleFactor);
          const itemProt = Number((f.prot * scaleFactor).toFixed(1));
          const itemCarb = Number((f.carb * scaleFactor).toFixed(1));
          const itemFat = Number((f.fat * scaleFactor).toFixed(1));

          chosenFoods.push({
            name: f.name,
            portion: f.portion,
            scaledPortion: scalePortionDescription(f.portion, scaleFactor),
            kcal: itemKcal,
            prot: itemProt,
            carb: itemCarb,
            fat: itemFat
          });

          accumulatedKcal += itemKcal;
          dayProt += itemProt;
          dayCarb += itemCarb;
          dayFat += itemFat;
        });

        dayKcal += accumulatedKcal;

        dayMeals.push({
          mealKey,
          name: mealDef.name,
          icon: mealDef.icon,
          targetKcal: mealTargetKcal,
          actualKcal: accumulatedKcal,
          foods: chosenFoods
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

    // Scroll suave para os resultados gerados
    const planView = document.getElementById('cardapio-resultado-wrapper');
    if (planView) {
      planView.style.display = 'block';
      planView.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Ajusta a descrição da porção pelo fator multiplicador
  function scalePortionDescription(portion, factor) {
    if (!factor || Math.abs(factor - 1.0) < 0.15) return portion;
    if (factor > 1.4) return `${portion} (porção reforçada ~${Math.round(factor * 100)}%)`;
    if (factor < 0.75) return `${portion} (porção moderada ~${Math.round(factor * 100)}%)`;
    return portion;
  }

  // Renderiza as abas dos 7 dias da semana
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

  // Renderiza o cardápio do dia selecionado
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
          <p>Alinhado com sua meta calórica diária da calculadora</p>
        </div>
        <div class="day-macro-summary">
          <div class="sum-pill kcal"><strong>${dayData.totalKcal}</strong> kcal <span style="font-size: 0.75rem; color: #64748B;">(${diffSign} kcal)</span></div>
          <div class="sum-pill">Prot: <strong>${dayData.totalProt}g</strong></div>
          <div class="sum-pill">Carb: <strong>${dayData.totalCarb}g</strong></div>
          <div class="sum-pill">Gord: <strong>${dayData.totalFat}g</strong></div>
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
                  <span class="meal-target-sub">Meta da refeição: ~${m.targetKcal} kcal</span>
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

  // Gera lista consolidada de compras da semana
  function generateGroceryList() {
    if (!menuState.weeklyPlan) return;

    const consolidated = {};

    Object.keys(menuState.weeklyPlan).forEach(dayKey => {
      const day = menuState.weeklyPlan[dayKey];
      day.meals.forEach(meal => {
        meal.foods.forEach(food => {
          if (!consolidated[food.name]) {
            consolidated[food.name] = { count: 0, samplePortion: food.portion };
          }
          consolidated[food.name].count += 1;
        });
      });
    });

    const modal = document.getElementById('grocery-modal');
    const listBody = document.getElementById('grocery-list-body');
    if (!modal || !listBody) return;

    listBody.innerHTML = `
      <div style="margin-bottom: 16px;">
        <p>Itens calculados para cobrir todas as refeições de Segunda a Domingo:</p>
      </div>
      <div class="grocery-grid-items">
        ${Object.keys(consolidated).map(item => `
          <div class="grocery-item-card">
            <input type="checkbox" id="item-${item}">
            <label for="item-${item}">
              <strong>${item}</strong>
              <span>Aparece em ${consolidated[item].count} refeições na semana</span>
            </label>
          </div>
        `).join('')}
      </div>
    `;

    modal.style.display = 'flex';
  }

  function setupEvents() {
    // Botão Gerar Cardápio
    const btnGenerate = document.getElementById('btn-gerar-cardapio');
    if (btnGenerate) {
      btnGenerate.addEventListener('click', (e) => {
        e.preventDefault();
        generateWeeklyPlan();
      });
    }

    // Botão Imprimir / Exportar PDF
    const btnPrint = document.getElementById('btn-imprimir-cardapio');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Botão Lista de Compras
    const btnGrocery = document.getElementById('btn-lista-compras');
    if (btnGrocery) {
      btnGrocery.addEventListener('click', () => {
        generateGroceryList();
      });
    }

    // Modal close
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

    // Sincronizar input de calorias se o usuário quiser editar manualmente
    const inputCustomCalories = document.getElementById('input-target-calories');
    if (inputCustomCalories) {
      inputCustomCalories.value = menuState.targetCalories;
      inputCustomCalories.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1000 && val <= 6000) {
          menuState.targetCalories = val;
          menuState.macros.carb = Math.round((val * 0.40) / 4);
          menuState.macros.prot = Math.round((val * 0.35) / 4);
          menuState.macros.fat = Math.round((val * 0.25) / 9);
          updateHeaderDisplays();
        }
      });
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

  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    loadCalculatorData();
    updateHeaderDisplays();
    renderMealCheckboxes();
    renderFoodPreferences();
    setupEvents();
    
    // Auto-gerar para primeira visualização imediata
    generateWeeklyPlan();
  });
})();
