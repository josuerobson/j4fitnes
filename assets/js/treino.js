/**
 * J4 FITNESS - SISTEMA INTELIGENTE DE MONTAGEM DE TREINOS
 * Algoritmo biomecânico com divisões científicas por frequência, gênero,
 * ambiente (Academia vs Casa/Calistenia) e objetivos específicos.
 */

(function () {
  'use strict';

  // Banco de Dados Científico de Exercícios com Dados Biomecânicos e Ângulos
  const EXERCISES_DB = {
    // --- MEMBROS INFERIORES: QUADRÍCEPS & GLÚTEOS ---
    agachamento_livre: {
      id: 'agachamento_livre',
      name: 'Agachamento Livre com Barra',
      shortName: 'Agachamento Livre',
      category: 'inferiores',
      musclesPrimary: ['Quadríceps', 'Glúteo Máximo'],
      musclesSecondary: ['Adutores', 'Core / Abdômen', 'Eretores da Espinha'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Pés na largura dos ombros com pontas apontadas levemente para fora (15° a 30°).',
        'Inicie o movimento dobrando os quadris e joelhos simultaneamente, mantendo o peito aberto.',
        'Desça até que o quadril fique pelo menos paralelo aos joelhos, sem arredondar a lombar.',
        'Suba empurrando o chão através do meio do pé e calcanhares.'
      ],
      mistakes: [
        'Valgo dinâmico (deixar os joelhos colapsarem para dentro na subida).',
        'Tirar os calcanhares do chão durante a descida.',
        'Flexionar a coluna lombar no ponto mais fundo (retroversão pélvica excessiva).'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Alinhamento de joelhos, postura dos pés e simetria do tronco.',
        lateral: 'Ângulo Lateral: Trajetória vertical da barra, neutralidade da coluna e profundidade.',
      }
    },
    agachamento_peso_corpo: {
      id: 'agachamento_peso_corpo',
      name: 'Agachamento Livre (Air Squat)',
      shortName: 'Agachamento Livre em Casa',
      category: 'inferiores',
      musclesPrimary: ['Quadríceps', 'Glúteo Máximo'],
      musclesSecondary: ['Posteriores de Coxa', 'Core'],
      environment: ['casa', 'academia'],
      type: 'composto',
      cues: [
        'Pés afastados na largura dos ombros, braços estendidos à frente para contrabalancear.',
        'Desça de forma controlada em 3 segundos, mantendo a coluna alinhada e peito elevado.',
        'Faça uma breve pausa de 1 segundo embaixo e suba contraindo os glúteos.'
      ],
      mistakes: [
        'Descer despencando sem controle excêntrico.',
        'Inclinar o tronco excessivamente para frente.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Joelhos acompanhando a linha das pontas dos pés.',
        lateral: 'Ângulo Lateral: Curvatura anatômica da coluna vertebral preservada.'
      }
    },
    elevacao_pelvica: {
      id: 'elevacao_pelvica',
      name: 'Elevação Pélvica com Barra (Hip Thrust)',
      shortName: 'Elevação Pélvica / Hip Thrust',
      category: 'gluteos',
      musclesPrimary: ['Glúteo Máximo'],
      musclesSecondary: ['Posteriores de Coxa', 'Core'],
      environment: ['academia'],
      type: 'isolador_composto',
      cues: [
        'Apoie a parte inferior das escápulas na borda de um banco acolchoado estável.',
        'Barra posicionada na linha do quadril (use protetor acolchoado).',
        'Na subida, empurre pelos calcanhares até formar um ângulo de 90° nos joelhos e travar o quadril.',
        'Mantenha o queixo apontado levemente para o peito (evite hiperextensão da cervical).'
      ],
      mistakes: [
        'Hiperextender a coluna lombar ao invés de contrair o glúteo no topo.',
        'Posicionar os pés muito longe ou muito perto (fora dos 90°).'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Joelhos alinhados com o quadril sem fechar.',
        lateral: 'Ângulo Lateral: Travamento completo do quadril e 90° de flexão de joelhos.'
      }
    },
    ponte_gluteos_solo: {
      id: 'ponte_gluteos_solo',
      name: 'Elevação Pélvica no Solo (Ponte de Glúteos)',
      shortName: 'Ponte de Glúteos no Solo',
      category: 'gluteos',
      musclesPrimary: ['Glúteo Máximo'],
      musclesSecondary: ['Posteriores de Coxa', 'Abdômen'],
      environment: ['casa', 'academia'],
      type: 'isolador',
      cues: [
        'Deite-se de costas, joelhos dobrados e pés firmes no chão na largura dos quadris.',
        'Suba os quadris apertando os glúteos no ponto mais alto por 2 segundos.',
        'Para maior intensidade, execute de forma unilateral (uma perna suspensa).'
      ],
      mistakes: [
        'Empurrar com a ponta dos pés em vez dos calcanhares.',
        'Arquear excessivamente a lombar sem focar no glúteo.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Alinhamento horizontal da pelve sem oscilações.',
        lateral: 'Ângulo Lateral: Linha reta contínua do joelho ao ombro no topo.'
      }
    },
    afundo_passada: {
      id: 'afundo_passada',
      name: 'Afundo / Passada com Halteres',
      shortName: 'Passada / Afundo com Halteres',
      category: 'inferiores',
      musclesPrimary: ['Quadríceps', 'Glúteo Máximo'],
      musclesSecondary: ['Posteriores de Coxa', 'Panturrilhas'],
      environment: ['academia'],
      type: 'unilateral',
      cues: [
        'Dê um passo à frente firme, mantendo o tronco ereto e escápulas encaixadas.',
        'Flexione ambos os joelhos simultaneamente até o joelho de trás quase encostar no chão (90°).',
        'Mantenha o joelho da frente estável sobre o tornozelo.',
        'Retorne à posição inicial empurrando pelo calcanhar da perna da frente.'
      ],
      mistakes: [
        'Inclinar o tronco bruscamente para frente.',
        'Permitir que o joelho da frente desvie para dentro (valgo).'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Equilíbrio pélvico e joelho frontal centrado.',
        lateral: 'Ângulo Lateral: Formação dos dois ângulos de 90° na descida.'
      }
    },
    afundo_livre_casa: {
      id: 'afundo_livre_casa',
      name: 'Afundo Estático / Búlgaro com Peso do Corpo',
      shortName: 'Afundo Estático / Búlgaro',
      category: 'inferiores',
      musclesPrimary: ['Glúteo Máximo', 'Quadríceps'],
      musclesSecondary: ['Estabilizadores do Core'],
      environment: ['casa', 'academia'],
      type: 'unilateral',
      cues: [
        'Se executar o Búlgaro, apoie a ponta do pé de trás em um sofá, banco ou cadeira estável.',
        'Desça com o peso concentrado 85% na perna da frente.',
        'Concentre a força no calcanhar da frente ao subir, sentindo o glúteo em tensão contínua.'
      ],
      mistakes: [
        'Distância inadequada do pé, causando desconforto na patela.',
        'Perda de equilíbrio por posicionar os pés em linha reta estreita.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Alargamento da base para maior estabilidade.',
        lateral: 'Ângulo Lateral: Inclinação suave do tronco (15°) focando no glúteo.'
      }
    },
    leg_press_45: {
      id: 'leg_press_45',
      name: 'Leg Press 45° Articulado',
      shortName: 'Leg Press 45°',
      category: 'inferiores',
      musclesPrimary: ['Quadríceps', 'Glúteos'],
      musclesSecondary: ['Posteriores de Coxa'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Apoie as costas e o quadril completamente no encosto, sem desencostar a lombar.',
        'Pés no meio da plataforma, afastados na largura dos ombros.',
        'Desça até 90° com controle absoluto (2 a 3 segundos de excêntrica).',
        'Empurre sem bloquear (hiperextender) os joelhos no final da extensão.'
      ],
      mistakes: [
        'Desencostar o quadril do banco no fundo do movimento.',
        'Bloquear os joelhos bruscamente estalando a articulação.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Abertura natural das pernas na descida.',
        lateral: 'Ângulo Lateral: Lombar e quadril totalmente colados no estofamento.'
      }
    },
    stiff_halteres: {
      id: 'stiff_halteres',
      name: 'Stiff / RDL (Levantamento Terra Romeno) com Halteres',
      shortName: 'Stiff com Halteres',
      category: 'posteriores',
      musclesPrimary: ['Posteriores de Coxa (Isquiotibiais)', 'Glúteos'],
      musclesSecondary: ['Eretores da Espinha', 'Dorsais'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Pés na largura dos quadris, joelhos levemente destravados (micro-flexão fixa).',
        'Inicie empurrando o quadril para trás como se fosse fechar uma porta com o glúteo.',
        'Desça os halteres rentes às pernas, mantendo a coluna 100% neutra e escápulas firmes.',
        'Sinta o alongamento potente dos posteriores de coxa e retorne contraindo os glúteos.'
      ],
      mistakes: [
        'Arredondar a coluna torácica ou lombar para tentar alcançar o chão.',
        'Flexionar os joelhos demais transformando o movimento em agachamento.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Simetria dos halteres deslizando na frente das coxas.',
        lateral: 'Ângulo Lateral: Quadril projetando para trás com coluna reta.'
      }
    },
    stiff_unilateral_casa: {
      id: 'stiff_unilateral_casa',
      name: 'Stiff Unilateral com Peso do Corpo (Single Leg RDL)',
      shortName: 'Stiff Unilateral (Sem Equipamento)',
      category: 'posteriores',
      musclesPrimary: ['Posteriores de Coxa', 'Glúteo Médio e Máximo'],
      musclesSecondary: ['Tornozelos e Equilíbrio'],
      environment: ['casa', 'academia'],
      type: 'unilateral',
      cues: [
        'Firme um dos pés no chão e incline o tronco para a frente enquanto a outra perna sobe estendida atrás.',
        'Mantenha os quadris paralelos ao chão, sem girar a pelve para o lado.',
        'Volte à posição inicial apertando o glúteo e a coxa de apoio.'
      ],
      mistakes: [
        'Girar o quadril abrindo para a lateral.',
        'Dobrar excessivamente a perna de apoio.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Bacia nivelada horizontalmente.',
        lateral: 'Ângulo Lateral: Linha reta perfeita do calcanhar elevado até a cabeça.'
      }
    },
    panturrilha_em_pe: {
      id: 'panturrilha_em_pe',
      name: 'Elevação de Panturrilha em Pé (Degrau)',
      shortName: 'Panturrilha em Pé',
      category: 'inferiores',
      musclesPrimary: ['Gastrocnêmio', 'Sóleo'],
      musclesSecondary: ['Estabilizadores do Tornozelo'],
      environment: ['academia', 'casa'],
      type: 'isolador',
      cues: [
        'Apoie a ponta dos pés na borda de um degrau ou bloco.',
        'Desça os calcanhares sentindo o alongamento completo da fáscia e tendão (2 segundos).',
        'Suba na ponta máxima dos pés e segure 1 segundo no pico de contração.'
      ],
      mistakes: [
        'Fazer repetições rápidas quicando no tendão de Aquiles sem controle.',
        'Fletir os joelhos na subida.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Distribuição do peso entre o dedão e os dedos do pé.',
        lateral: 'Ângulo Lateral: Amplitude máxima completa (descida e subida).'
      }
    },

    // --- MEMBROS SUPERIORES: PEITORAL & EMPURRAR ---
    supino_reto_halteres: {
      id: 'supino_reto_halteres',
      name: 'Supino Reto com Halteres',
      shortName: 'Supino Reto com Halteres',
      category: 'peitoral',
      musclesPrimary: ['Peitoral Maior'],
      musclesSecondary: ['Tríceps Braquial', 'Deltóide Anterior'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Deite-se no banco, escápulas em retração e depressão (travadas atrás).',
        'Pés firmes no chão proporcionando leg drive.',
        'Desça os halteres com os cotovelos em ângulo de 45° a 60° em relação ao tronco (em formato de flecha, nunca 90°).',
        'Empurre convergindo levemente no topo sem bater os pesos.'
      ],
      mistakes: [
        'Abrir os cotovelos a 90° desalinhados, sobrecarregando o manguito rotador.',
        'Soltar as escápulas e empurrar com os ombros no final.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Trajetória dos halteres e simetria de empuxo.',
        lateral: 'Ângulo Lateral: Ângulo de 45° dos cotovelos e arco lombar anatômico.'
      }
    },
    flexao_braco_solo: {
      id: 'flexao_braco_solo',
      name: 'Flexão de Braço no Solo (Push-Up)',
      shortName: 'Flexão de Braço no Solo',
      category: 'peitoral',
      musclesPrimary: ['Peitoral Maior', 'Tríceps Braquial'],
      musclesSecondary: ['Deltóide Anterior', 'Core / Abdômen'],
      environment: ['casa', 'academia'],
      type: 'composto',
      cues: [
        'Mãos apoiadas no chão na largura dos ombros ou ligeiramente mais abertas.',
        'Corpo alinhado como uma prancha rígida dos calcanhares à cabeça.',
        'Desça até o peito quase tocar o chão mantendo cotovelos apontados para trás a 45°.',
        'Empurre o chão de volta estendendo os braços com firmeza (iniciantes podem apoiar os joelhos).'
      ],
      mistakes: [
        'Deixar o quadril cair ou empinar os glúteos.',
        'Cotovelos abertos demais em T (90°).'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Posicionamento das mãos e ângulo dos cotovelos.',
        lateral: 'Ângulo Lateral: Alinhamento reto absoluto de tornozelo, quadril e ombro.'
      }
    },
    supino_inclinado_halteres: {
      id: 'supino_inclinado_halteres',
      name: 'Supino Inclinado com Halteres (30° a 45°)',
      shortName: 'Supino Inclinado com Halteres',
      category: 'peitoral',
      musclesPrimary: ['Peitoral Superior (Porção Clavicular)'],
      musclesSecondary: ['Deltóide Anterior', 'Tríceps'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Ajuste o banco em inclinação moderada (30° a 45° máximo).',
        'Retraia as escápulas e empurre com os pés no chão.',
        'Desça até a linha média/alta do peito de forma controlada.'
      ],
      mistakes: [
        'Inclinação muito alta do banco transformando o exercício em desenvolvimento de ombros.',
        'Despencar com os pesos na descida.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Abertura das mãos e controle do peso.',
        lateral: 'Ângulo Lateral: Encosto do banco e trajetória diagonal suave dos halteres.'
      }
    },
    crucifixo_polia_ou_chao: {
      id: 'crucifixo_polia_ou_chao',
      name: 'Crossover / Crucifixo na Polia',
      shortName: 'Crossover na Polia',
      category: 'peitoral',
      musclesPrimary: ['Peitoral Maior (Fibras Esternais)'],
      musclesSecondary: ['Deltóide Anterior'],
      environment: ['academia'],
      type: 'isolador',
      cues: [
        'Passo à frente para estabilidade, cotovelos com leve flexão fixa.',
        'Abra os braços sentindo o alongamento do peito sem puxar com os ombros.',
        'Feche as mãos à frente imaginando que está abraçando um barril grande.'
      ],
      mistakes: [
        'Dobrar e estender os braços virando um supino disfarçado.',
        'Balançar o tronco para dar impulso.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Encontro das mãos no centro com peito estufado.',
        lateral: 'Ângulo Lateral: Estabilidade do tronco e ângulo estático dos cotovelos.'
      }
    },

    // --- MEMBROS SUPERIORES: COSTAS & PUXAR ---
    puxada_alta_pulley: {
      id: 'puxada_alta_pulley',
      name: 'Puxada Alta no Pulley (Lat Pulldown)',
      shortName: 'Puxada Alta no Pulley',
      category: 'costas',
      musclesPrimary: ['Latíssimo do Dorso (Grande Dorsal)'],
      musclesSecondary: ['Bíceps Braquial', 'Braquial', 'Redondo Maior'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Sente-se com as coxas firmes sob o acolchoado de apoio.',
        'Pegada pronada um pouco mais aberta que a largura dos ombros.',
        'Inicie puxando as escápulas para baixo (depressão escapular).',
        'Puxe a barra em direção à parte superior do peitoral, apontando os cotovelos para baixo e para os bolsos da calça.'
      ],
      mistakes: [
        'Puxar a barra por trás do pescoço (risco à articulação gleno-umeral e cervical).',
        'Inclinar o corpo excessivamente para trás usando impulso lombar.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Barra descendo reta até a clavícula/peitoral superior.',
        lateral: 'Ângulo Lateral: Inclinação discreta de 10° a 15° do tronco.'
      }
    },
    barra_fixa_ou_invertida_casa: {
      id: 'barra_fixa_ou_invertida_casa',
      name: 'Barra Fixa / Remada Invertida (Mesa ou Toalha)',
      shortName: 'Barra Fixa / Remada Invertida',
      category: 'costas',
      musclesPrimary: ['Latíssimo do Dorso', 'Rombóides'],
      musclesSecondary: ['Bíceps', 'Trapézio'],
      environment: ['casa', 'academia'],
      type: 'composto',
      cues: [
        'Se na barra fixa: suspenda-se, ative as costas e puxe o peito até a barra.',
        'Se em casa embaixo de uma mesa firme: posicione o corpo inclinado e puxe o peito até a borda da mesa.',
        'Foque em juntar as escápulas no final de cada puxada.'
      ],
      mistakes: [
        'Encolher os ombros em direção às orelhas ao invés de abaixá-los.',
        'Não completar a amplitude completa de extensão.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Abertura das escápulas e ativação em V.',
        lateral: 'Ângulo Lateral: Trajetória do peito em direção ao ponto de tração.'
      }
    },
    remada_curvada_halteres: {
      id: 'remada_curvada_halteres',
      name: 'Remada Curvada com Halteres / Barra',
      shortName: 'Remada Curvada com Halteres',
      category: 'costas',
      musclesPrimary: ['Latíssimo do Dorso', 'Rombóides', 'Trapézio Médio'],
      musclesSecondary: ['Bíceps', 'Deltóide Posterior', 'Eretores da Espinha'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Incline o tronco à frente a ~45° com joelhos levemente destravados e coluna neutra.',
        'Puxe os halteres em direção à cintura/umbigo, espremendo as costas.',
        'Desça controlando a carga e sentindo o alongamento dorsal.'
      ],
      mistakes: [
        'Arredondar a coluna lombar durante a sustentação da postura.',
        'Puxar com os braços em vez de liderar o movimento com os cotovelos.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Cotovelos passando próximos às costelas.',
        lateral: 'Ângulo Lateral: Coluna 100% reta e ângulo de 45° mantido.'
      }
    },
    remada_unilateral_serrote: {
      id: 'remada_unilateral_serrote',
      name: 'Remada Unilateral com Halter (Serrote)',
      shortName: 'Remada Unilateral (Serrote)',
      category: 'costas',
      musclesPrimary: ['Latíssimo do Dorso'],
      musclesSecondary: ['Bíceps', 'Redondo Maior'],
      environment: ['academia', 'casa'],
      type: 'unilateral',
      cues: [
        'Apoie um joelho e mão num banco (ou sofá/cadeira firme).',
        'Com a outra mão segurando o peso, puxe em arco na direção do bolso da calça.',
        'Concentre a força no cotovelo, contraindo a dorsal no topo por 1 segundo.'
      ],
      mistakes: [
        'Girar o tronco bruscamente para levantar mais carga.',
        'Puxar o halter na vertical para o peito em vez de em arco para o quadril.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Tronco estabilizado sem rotação excessiva.',
        lateral: 'Ângulo Lateral: Arco perfeito de tração em direção ao quadril.'
      }
    },

    // --- MEMBROS SUPERIORES: OMBROS (DELTÓIDES) ---
    desenvolvimento_halteres: {
      id: 'desenvolvimento_halteres',
      name: 'Desenvolvimento de Ombros com Halteres (Sentado)',
      shortName: 'Desenvolvimento com Halteres',
      category: 'ombros',
      musclesPrimary: ['Deltóide Anterior', 'Deltóide Lateral'],
      musclesSecondary: ['Tríceps', 'Trapézio Superior'],
      environment: ['academia'],
      type: 'composto',
      cues: [
        'Sente-se num banco com encosto a 80° ou 90° com os pés apoiados.',
        'Eleve os halteres acima da cabeça com os cotovelos levemente à frente no plano escapular (30° à frente da linha do corpo).',
        'Desça até os halteres ficarem próximos à altura das orelhas/queixo.',
        'Empurre para cima sem bater os halteres no alto.'
      ],
      mistakes: [
        'Abrir os cotovelos para trás na linha reta dos ombros gerando impacto articular.',
        'Arquear as costas excessivamente descolando a lombar do banco.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Trajetória vertical simétrica e controle da carga.',
        lateral: 'Ângulo Lateral: Braços no plano escapular (levemente à frente).'
      }
    },
    flexao_pike_casa: {
      id: 'flexao_pike_casa',
      name: 'Flexão Pike para Ombros (Pike Push-Up)',
      shortName: 'Flexão Pike para Ombros',
      category: 'ombros',
      musclesPrimary: ['Deltóide Anterior', 'Deltóide Superior'],
      musclesSecondary: ['Tríceps', 'Trapézio', 'Core'],
      environment: ['casa', 'academia'],
      type: 'composto',
      cues: [
        'Posicione o corpo em V invertido (quadril alto para o teto, pernas retas ou semi-fletidas).',
        'Desça a cabeça diagonalmente à frente das mãos formando um tripé.',
        'Empurre o chão de volta para cima e para trás, finalizando no V invertido.'
      ],
      mistakes: [
        'Descer a cabeça entre as mãos ao invés de à frente em triângulo.',
        'Deixar o quadril ceder perdendo a forma em V.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Triângulo entre as mãos e a descida da cabeça.',
        lateral: 'Ângulo Lateral: V invertido nítido com foco no ombro.'
      }
    },
    elevacao_lateral: {
      id: 'elevacao_lateral',
      name: 'Elevação Lateral com Halteres / Garrafas',
      shortName: 'Elevação Lateral',
      category: 'ombros',
      musclesPrimary: ['Deltóide Lateral (Medial)'],
      musclesSecondary: ['Trapézio Superior'],
      environment: ['academia', 'casa'],
      type: 'isolador',
      cues: [
        'Corpo ereto com leve inclinação do tronco para a frente (5° a 10°).',
        'Eleve os braços lateralmente pelo cotovelo até a altura dos ombros.',
        'Mantenha os cotovelos levemente fletidos no plano escapular.',
        'Desça controlando a gravidade em 2 a 3 segundos.'
      ],
      mistakes: [
        'Usar impulso com o quadril balançando o corpo.',
        'Elevar as mãos mais alto que os cotovelos (inverte o estímulo para o ombro anterior).'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Cotovelo e punho alinhados na altura do ombro.',
        lateral: 'Ângulo Lateral: Leve projeção à frente (plano escapular).'
      }
    },

    // --- BRAÇOS: TRÍCEPS & BÍCEPS ---
    triceps_corda_polia: {
      id: 'triceps_corda_polia',
      name: 'Tríceps na Polia com Corda',
      shortName: 'Tríceps Corda na Polia',
      category: 'bracos',
      musclesPrimary: ['Tríceps Braquial (Cabeça Lateral e Medial)'],
      musclesSecondary: ['Antebraços'],
      environment: ['academia'],
      type: 'isolador',
      cues: [
        'Cotovelos colados ao lado das costelas e imóveis durante todo o exercício.',
        'Empurre a corda para baixo estendendo os braços.',
        'Abra a corda para fora no final da extensão para contração máxima.'
      ],
      mistakes: [
        'Mover os cotovelos para frente e para trás usando impulso dos ombros.',
        'Subir demais deixando os cotovelos saírem do lugar.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Separação das pontas da corda no final do movimento.',
        lateral: 'Ângulo Lateral: Cotovelos estáticos como um pivô fixo.'
      }
    },
    triceps_banco_casa: {
      id: 'triceps_banco_casa',
      name: 'Tríceps Mergulho no Banco ou Cadeira',
      shortName: 'Tríceps Mergulho no Banco',
      category: 'bracos',
      musclesPrimary: ['Tríceps Braquial'],
      musclesSecondary: ['Deltóide Anterior', 'Peitoral Inferior'],
      environment: ['casa', 'academia'],
      type: 'composto',
      cues: [
        'Apoie as mãos na borda do banco/cadeira com dedos voltados para a frente.',
        'Mantenha as costas rentes à borda do banco durante toda a descida.',
        'Desça até os cotovelos dobrarem em ~90° e empurre de volta estendendo os braços.'
      ],
      mistakes: [
        'Afastar o corpo para longe do banco, sobrecarregando o ombro.',
        'Descer além de 90° se sentir desconforto articular.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Cotovelos apontando diretamente para trás.',
        lateral: 'Ângulo Lateral: Coluna descendo colada no banco a 90°.'
      }
    },
    rosca_direta_halteres: {
      id: 'rosca_direta_halteres',
      name: 'Rosca Direta com Halteres (Simultânea ou Alternada)',
      shortName: 'Rosca Direta com Halteres',
      category: 'bracos',
      musclesPrimary: ['Bíceps Braquial'],
      musclesSecondary: ['Braquiorradial', 'Braquial Anterior'],
      environment: ['academia', 'casa'],
      type: 'isolador',
      cues: [
        'Em pé, postura ereta, peito estufado e abdômen contraído.',
        'Flexione os cotovelos erguendo os halteres enquanto supina os punhos (palmas para cima).',
        'Aperte o bíceps no topo por 1 segundo e desça resistindo ao peso.'
      ],
      mistakes: [
        'Balançar a lombar para dar impulso ao peso.',
        'Projetar os cotovelos para frente no topo.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Supinação fluida dos punhos na subida.',
        lateral: 'Ângulo Lateral: Cotovelos alinhados com a linha lateral do tronco.'
      }
    },

    // --- ABDÔMEN & CORE ---
    prancha_isometrica: {
      id: 'prancha_isometrica',
      name: 'Prancha Abdominal Isométrica no Solo',
      shortName: 'Prancha Abdominal no Solo',
      category: 'core',
      musclesPrimary: ['Reto Abdominal', 'Transverso do Abdômen'],
      musclesSecondary: ['Glúteos', 'Eretores da Espinha', 'Ombros'],
      environment: ['casa', 'academia'],
      type: 'isometria',
      cues: [
        'Apoie os antebraços e pontas dos pés no solo.',
        'Encaixe a pelve (retroversão pélvica discreta) e puxe o umbigo para as costas.',
        'Contraia os glúteos e quadríceps intensamente mantendo uma linha horizontal perfeita.',
        'Respire de forma controlada sem prender o ar.'
      ],
      mistakes: [
        'Deixar o quadril cair em direção ao chão (hiperextensão da lombar).',
        'Empinar os glúteos para cima em formato de pirâmide.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Cotovelos alinhados sob os ombros na largura do peito.',
        lateral: 'Ângulo Lateral: Linha reta dos calcanhares até a nuca.'
      }
    },
    abdominal_infra_solo: {
      id: 'abdominal_infra_solo',
      name: 'Abdominal Infra no Solo (Elevação de Pernas)',
      shortName: 'Abdominal Infra no Solo',
      category: 'core',
      musclesPrimary: ['Porção Infra-umbilical do Abdômen'],
      musclesSecondary: ['Flexores de Quadril'],
      environment: ['casa', 'academia'],
      type: 'isolador',
      cues: [
        'Deite-se no colchonete com as mãos apoiadas ao lado do corpo ou sob o quadril.',
        'Suba as pernas estendidas ou semi-fletidas até 90° e tire levemente o sacro do chão.',
        'Desça de forma lenta e controlada, parando antes de encostar no chão para manter a tensão.'
      ],
      mistakes: [
        'Despencar as pernas sem controlar o movimento.',
        'Descolar a lombar do chão durante a descida.'
      ],
      videoAngles: {
        frontal: 'Ângulo Frontal: Pernas unidas e controle central do tronco.',
        lateral: 'Ângulo Lateral: Lombar apoiada no chão na descida.'
      }
    }
  };

  window.J4_EXERCISES_DB = EXERCISES_DB;

  // Objetivos Biomecânicos por Gênero
  const OBJECTIVES_DATA = {
    masculino: [
      {
        id: 'hipertrofia',
        title: 'Hipertrofia Muscular',
        desc: 'Ganho sólido de massa magra, volume e densidade com sobrecarga mecânica progressiva.',
        tag: 'Volume & Densidade',
        icon: '🏋️‍♂️',
        setsReps: '3 a 4 séries • 8 a 12 reps',
        rest: '60 a 90 seg',
        rpe: 'RPE 8-9 (1-2 reps da falha)'
      },
      {
        id: 'emagrecimento',
        title: 'Emagrecimento & Definição',
        desc: 'Alta densidade de treino, aceleração metabólica (EPOC) e preservação máxima de massa magra.',
        tag: 'Queima Máxima',
        icon: '🔥',
        setsReps: '3 a 4 séries • 12 a 15 reps',
        rest: '45 a 60 seg',
        rpe: 'RPE 8 (densidade elevada)'
      },
      {
        id: 'forca',
        title: 'Força Pura & Cargas',
        desc: 'Recrutamento de unidades motoras e potência neuromuscular em exercícios compostos livres.',
        tag: 'Potência & Carga',
        icon: '🧱',
        setsReps: '4 a 5 séries • 4 a 6 reps',
        rest: '120 a 180 seg',
        rpe: 'RPE 9 (intensidade máxima)'
      },
      {
        id: 'tronco_v_bracos',
        title: 'Tronco em V & Braços Fortes',
        desc: 'Ênfase em dorsais alargadas, deltóides laterais e braços esculpidos (bíceps e tríceps).',
        tag: 'Estética V-Taper',
        icon: '🦾',
        setsReps: '3 a 4 séries • 10 a 12 reps',
        rest: '60 seg',
        rpe: 'RPE 8-9'
      },
      {
        id: 'condicionamento',
        title: 'Condicionamento & Fôlego',
        desc: 'Resistência muscular localizada, capacidade cardiovascular integrada e agilidade funcional.',
        tag: 'Resistência & Cardio',
        icon: '⚡',
        setsReps: '3 séries • 15 a 20 reps',
        rest: '30 a 45 seg',
        rpe: 'Metabólico'
      },
      {
        id: 'saude_postura',
        title: 'Saúde, Postura & Longevidade',
        desc: 'Fortalecimento de paravertebrais, core protetor da coluna, estabilidade articular e mobilidade.',
        tag: 'Postura & Mobilidade',
        icon: '🧘‍♂️',
        setsReps: '3 séries • 12 a 15 reps',
        rest: '60 seg',
        rpe: 'Cadência Lenta (3s-1s-2s)'
      }
    ],
    feminino: [
      {
        id: 'gluteos_pernas',
        title: 'Glúteos & Pernas Firmes',
        desc: 'Priorização máxima da cadeia posterior: glúteo máximo/médio, quadríceps e posteriores definidos.',
        tag: 'Foco Glúteos 360°',
        icon: '👙',
        setsReps: '3 a 4 séries • 10 a 12 reps',
        rest: '60 a 90 seg',
        rpe: 'RPE 8-9 (contração de pico)'
      },
      {
        id: 'emagrecimento',
        title: 'Secar & Definir Acelerado',
        desc: 'Queima de gordura preservando o tônus muscular em pernas, glúteos e abdômen sem flacidez.',
        tag: 'Definição & EPOC',
        icon: '🔥',
        setsReps: '3 a 4 séries • 12 a 15 reps',
        rest: '45 a 60 seg',
        rpe: 'RPE 8 (ritmo dinâmico)'
      },
      {
        id: 'hipertrofia',
        title: 'Hipertrofia Geral Equilibrada',
        desc: 'Desenvolvimento muscular harmonioso em membros inferiores e membros superiores modelados.',
        tag: 'Massa Magra & Curvas',
        icon: '🏋️‍♀️',
        setsReps: '3 a 4 séries • 8 a 12 reps',
        rest: '60 a 90 seg',
        rpe: 'RPE 8-9'
      },
      {
        id: 'cintura_core',
        title: 'Cintura Fina & Abdômen Reto',
        desc: 'Fortalecimento do transverso abdominal (efeito corset), postura esguia e queima de gordura visceral.',
        tag: 'Core & Transverso',
        icon: '⏳',
        setsReps: '3 a 4 séries • 12 a 15 reps',
        rest: '45 seg',
        rpe: 'Isometria + Ativação'
      },
      {
        id: 'condicionamento',
        title: 'Fôlego, Energia & Resistência',
        desc: 'Treinos dinâmicos para aumentar o gasto calórico, disposição diária e vigor físico.',
        tag: 'Resistência & Vigor',
        icon: '⚡',
        setsReps: '3 séries • 15 a 20 reps',
        rest: '30 a 45 seg',
        rpe: 'Metabólico'
      },
      {
        id: 'saude_postura',
        title: 'Postura, Coluna & Bem-Estar',
        desc: 'Alívio de tensões, fortalecimento lombar e torácico, mobilidade articular e prevenção de dores.',
        tag: 'Mobilidade & Saúde',
        icon: '🧘‍♀️',
        setsReps: '3 séries • 12 a 15 reps',
        rest: '60 seg',
        rpe: 'Controle Motor'
      }
    ]
  };

  // Mapeamento de Mídias de Demonstração (Imagens e Vídeos com Atletas Reais e IA)
  const MEDIA_ASSETS = {
    agachamento_livre: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-agachamento-lado.jpg', video: 'assets/videos/homem_agachamento_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-agachamento-lado.jpg', video: 'assets/videos/mulher_agachamento_lado.mp4' }
      }
    },
    agachamento_peso_corpo: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-agachamento-lado.jpg', video: 'assets/videos/homem_agachamento_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-agachamento-lado.jpg', video: 'assets/videos/mulher_agachamento_lado.mp4' }
      }
    },
    elevacao_pelvica: {
      masculino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-elevacao-pelvica.jpg', video: 'assets/videos/mulher_elevacao_pelvica.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-elevacao-pelvica.jpg', video: 'assets/videos/mulher_elevacao_pelvica.mp4' }
      }
    },
    ponte_gluteos_solo: {
      masculino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-elevacao-pelvica.jpg', video: 'assets/videos/mulher_elevacao_pelvica.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-elevacao-pelvica.jpg', video: 'assets/videos/mulher_elevacao_pelvica.mp4' }
      }
    },
    afundo_passada: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-afundo-lado.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-afundo-lado.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' }
      }
    },
    afundo_livre_casa: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-afundo-lado.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_agachamento_frente.mp4' },
        lateral: { img: 'assets/images/treino-mulher-afundo-lado.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' }
      }
    },
    stiff_halteres: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_stiff_lado.mp4' },
        lateral: { img: 'assets/images/treino-homem-stiff-lado.jpg', video: 'assets/videos/homem_stiff_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_stiff_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-stiff-lado.jpg', video: 'assets/videos/mulher_stiff_lado.mp4' }
      }
    },
    stiff_unilateral_casa: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_stiff_lado.mp4' },
        lateral: { img: 'assets/images/treino-homem-stiff-lado.jpg', video: 'assets/videos/homem_stiff_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_stiff_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-stiff-lado.jpg', video: 'assets/videos/mulher_stiff_lado.mp4' }
      }
    },
    supino_reto_halteres: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-supino-frente.jpg', video: 'assets/videos/homem_supino_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-supino-lado.jpg', video: 'assets/videos/homem_supino_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' }
      }
    },
    supino_inclinado_halteres: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-supino-frente.jpg', video: 'assets/videos/homem_supino_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-supino-lado.jpg', video: 'assets/videos/homem_supino_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' }
      }
    },
    flexao_braco_solo: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-supino-frente.jpg', video: 'assets/videos/homem_supino_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-prancha-lado.jpg', video: 'assets/videos/homem_prancha_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' }
      }
    },
    crucifixo_polia_ou_chao: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-supino-frente.jpg', video: 'assets/videos/homem_supino_frente.mp4' },
        lateral: { img: 'assets/images/treino-homem-supino-lado.jpg', video: 'assets/videos/homem_supino_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-supino-lado.jpg', video: 'assets/videos/mulher_supino_lado.mp4' }
      }
    },
    prancha_isometrica: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-prancha-lado.jpg', video: 'assets/videos/homem_prancha_lado.mp4' },
        lateral: { img: 'assets/images/treino-homem-prancha-lado.jpg', video: 'assets/videos/homem_prancha_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-homem-prancha-lado.jpg', video: 'assets/videos/homem_prancha_lado.mp4' },
        lateral: { img: 'assets/images/treino-homem-prancha-lado.jpg', video: 'assets/videos/homem_prancha_lado.mp4' }
      }
    },
    puxada_alta_pulley: {
      masculino: {
        frontal: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' },
        lateral: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' },
        lateral: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' }
      }
    },
    barra_fixa_ou_invertida_casa: {
      masculino: {
        frontal: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' },
        lateral: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' },
        lateral: { img: 'assets/images/real_pull_ups.jpg', video: 'assets/videos/real_pull_ups.mp4' }
      }
    },
    remada_curvada_halteres: {
      masculino: {
        frontal: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' },
        lateral: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' },
        lateral: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' }
      }
    },
    remada_unilateral_serrote: {
      masculino: {
        frontal: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' },
        lateral: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' },
        lateral: { img: 'assets/images/real_bent_row.jpg', video: 'assets/videos/real_bent_row.mp4' }
      }
    },
    desenvolvimento_halteres: {
      masculino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      }
    },
    flexao_pike_casa: {
      masculino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      }
    },
    elevacao_lateral: {
      masculino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' },
        lateral: { img: 'assets/images/real_shoulder_press.jpg', video: 'assets/videos/real_shoulder_press.mp4' }
      }
    },
    triceps_corda_polia: {
      masculino: {
        frontal: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' },
        lateral: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' },
        lateral: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' }
      }
    },
    triceps_banco_casa: {
      masculino: {
        frontal: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' },
        lateral: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' },
        lateral: { img: 'assets/images/real_triceps.jpg', video: 'assets/videos/real_triceps.mp4' }
      }
    },
    rosca_direta_halteres: {
      masculino: {
        frontal: { img: 'assets/images/real_biceps_curl.jpg', video: 'assets/videos/real_biceps_curl.mp4' },
        lateral: { img: 'assets/images/real_biceps_curl.jpg', video: 'assets/videos/real_biceps_curl.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_biceps_curl.jpg', video: 'assets/videos/real_biceps_curl.mp4' },
        lateral: { img: 'assets/images/real_biceps_curl.jpg', video: 'assets/videos/real_biceps_curl.mp4' }
      }
    },
    leg_press_45: {
      masculino: {
        frontal: { img: 'assets/images/real_leg_press.jpg', video: 'assets/videos/real_leg_press.mp4' },
        lateral: { img: 'assets/images/real_leg_press.jpg', video: 'assets/videos/real_leg_press.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_leg_press.jpg', video: 'assets/videos/real_leg_press.mp4' },
        lateral: { img: 'assets/images/real_leg_press.jpg', video: 'assets/videos/real_leg_press.mp4' }
      }
    },
    abdominal_infra_solo: {
      masculino: {
        frontal: { img: 'assets/images/real_leg_raises.jpg', video: 'assets/videos/real_leg_raises.mp4' },
        lateral: { img: 'assets/images/real_leg_raises.jpg', video: 'assets/videos/real_leg_raises.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/real_leg_raises.jpg', video: 'assets/videos/real_leg_raises.mp4' },
        lateral: { img: 'assets/images/real_leg_raises.jpg', video: 'assets/videos/real_leg_raises.mp4' }
      }
    },
    panturrilha_em_pe: {
      masculino: {
        frontal: { img: 'assets/images/treino-homem-agachamento-frente.jpg', video: 'assets/videos/homem_agachamento_lado.mp4' },
        lateral: { img: 'assets/images/treino-homem-agachamento-lado.jpg', video: 'assets/videos/homem_agachamento_lado.mp4' }
      },
      feminino: {
        frontal: { img: 'assets/images/treino-mulher-agachamento-frente.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' },
        lateral: { img: 'assets/images/treino-mulher-afundo-lado.jpg', video: 'assets/videos/mulher_afundo_lado.mp4' }
      }
    }
  };

  // Estado Atual do Aplicativo
  const appState = {
    gender: 'masculino',
    objective: 'hipertrofia',
    environment: 'academia',
    selectedDays: ['seg', 'qua', 'sex'],
    activeDayTab: 'seg',
    weeklyPlan: null,
    // Estado do Modal de Vídeo
    modalExerciseId: null,
    modalAthleteGender: 'masculino',
    modalAngle: 'frontal',
    // Timer
    timerSeconds: 0,
    timerInterval: null
  };

  // Mapeamento dos Dias
  const DAYS_ORDER = [
    { key: 'seg', label: 'Segunda', short: 'SEG' },
    { key: 'ter', label: 'Terça', short: 'TER' },
    { key: 'qua', label: 'Quarta', short: 'QUA' },
    { key: 'qui', label: 'Quinta', short: 'QUI' },
    { key: 'sex', label: 'Sexta', short: 'SEX' },
    { key: 'sab', label: 'Sábado', short: 'SÁB' },
    { key: 'dom', label: 'Domingo', short: 'DOM' }
  ];

  // Renderizar Cards de Objetivos conforme Gênero Selecionado
  function renderObjectiveCards() {
    const container = document.getElementById('objectives-container');
    if (!container) return;

    const list = OBJECTIVES_DATA[appState.gender] || OBJECTIVES_DATA.masculino;
    // Se o objetivo atual não existe na lista nova, seleciona o primeiro
    if (!list.find(o => o.id === appState.objective)) {
      appState.objective = list[0].id;
    }

    container.innerHTML = list.map(obj => `
      <div class="objective-item-btn ${obj.id === appState.objective ? 'active' : ''}" data-obj="${obj.id}">
        <div>
          <div class="objective-item-head">
            <span class="objective-icon-badge">${obj.icon}</span>
            <h5>${obj.title}</h5>
          </div>
          <p class="objective-item-desc">${obj.desc}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <span class="objective-focus-tag">${obj.tag}</span>
          <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);">${obj.setsReps.split('•')[1] || ''}</span>
        </div>
      </div>
    `).join('');

    // Adiciona event listeners aos cards
    container.querySelectorAll('.objective-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.objective-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.objective = btn.dataset.obj;
        updateFrequencyBanner();
      });
    });
  }

  // Atualizar Banner de Feedback dos Dias Selecionados
  function updateFrequencyBanner() {
    const banner = document.getElementById('frequency-banner');
    if (!banner) return;

    const count = appState.selectedDays.length;
    let splitName = '';
    let recommendation = '';

    if (count === 0) {
      banner.innerHTML = `<span style="color: #EF4444; font-weight: 700;">Selecione pelo menos 2 dias para montar sua rotina semanal.</span>`;
      return;
    }

    if (count <= 2) {
      splitName = 'Divisão Full Body A/B';
      recommendation = 'Ideal para iniciantes ou rotinas corridas. Cada treino estimula o corpo inteiro com descanso amplo.';
    } else if (count === 3) {
      splitName = appState.gender === 'feminino' && appState.objective === 'gluteos_pernas' 
        ? 'Divisão Glúteos & Pernas 360° + Superiores' 
        : 'Divisão Full Body 3x ou ABC Clássico';
      recommendation = 'Frequência padrão-ouro para equilíbrio muscular e recuperação excelente.';
    } else if (count === 4) {
      splitName = 'Divisão Upper / Lower (Superior e Inferior)';
      recommendation = 'Excelente equilíbrio para hipertrofia e força. 2 treinos superiores e 2 treinos inferiores.';
    } else if (count === 5) {
      splitName = 'Divisão Push / Pull / Legs + Upper / Lower';
      recommendation = 'Alta performance e volume ótimo de treino para ganho acelerado de massa magra.';
    } else {
      splitName = 'Divisão Push / Pull / Legs 2x (Alta Frequência)';
      recommendation = 'Para praticantes avançados que buscam máxima densidade semanal.';
    }

    banner.innerHTML = `
      <div>
        <strong>${count} dias selecionados:</strong> ${splitName}.
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">${recommendation}</div>
      </div>
      <span style="font-weight: 700; color: var(--primary); white-space: nowrap;">Frequência Ótima</span>
    `;
  }

  // Algoritmo Gerador do Treino Semanal
  function generateWeeklyWorkout() {
    const gender = appState.gender;
    const objId = appState.objective;
    const env = appState.environment; // 'academia' ou 'casa'
    const daysSelected = appState.selectedDays;

    if (daysSelected.length === 0) {
      alert('Por favor, selecione ao menos 2 dias para treinar na semana.');
      return;
    }

    // Busca detalhes do objetivo
    const objList = OBJECTIVES_DATA[gender] || OBJECTIVES_DATA.masculino;
    const currentObj = objList.find(o => o.id === objId) || objList[0];

    const weekly = {};

    // Módulos de Treino Prontos (compostos pelos exercícios técnicos)
    const db = EXERCISES_DB;

    // Treino Inferior / Glúteos (Academia)
    const gymLegsGlutes = [
      { ex: db.agachamento_livre, note: 'Foco em amplitude e estabilidade pélvica' },
      { ex: db.elevacao_pelvica, note: 'Segure 1 segundo no pico de contração no topo' },
      { ex: db.leg_press_45, note: 'Controle excêntrico de 3 segundos na descida' },
      { ex: db.stiff_halteres, note: 'Alongamento profundo de posteriores com coluna neutra' },
      { ex: db.afundo_passada, note: 'Passos firmes mantendo o tronco alinhado' },
      { ex: db.panturrilha_em_pe, note: 'Amplitude total sem quicar nos tendões' }
    ];

    // Treino Inferior / Glúteos (Casa)
    const homeLegsGlutes = [
      { ex: db.agachamento_peso_corpo, note: 'Cadência lenta e peito sempre aberto' },
      { ex: db.ponte_gluteos_solo, note: 'Aperto forte de glúteos no ponto mais alto' },
      { ex: db.afundo_livre_casa, note: 'Foco na perna da frente apoiada no chão' },
      { ex: db.stiff_unilateral_casa, note: 'Equilíbrio e tensão pura nos posteriores' },
      { ex: db.panturrilha_em_pe, note: 'Use um degrau para amplitude máxima' }
    ];

    // Treino Superior / Empurrar & Puxar (Academia)
    const gymUpper = [
      { ex: db.supino_reto_halteres, note: 'Escápulas travadas e cotovelos a 45°' },
      { ex: db.puxada_alta_pulley, note: 'Puxe com as costas, cotovelos apontando para os bolsos' },
      { ex: db.desenvolvimento_halteres, note: 'Elevação controlada sem arquear a lombar' },
      { ex: db.remada_curvada_halteres, note: 'Esprema as escápulas no ponto final' },
      { ex: db.triceps_corda_polia, note: 'Abra a corda embaixo para pico de contração' },
      { ex: db.rosca_direta_halteres, note: 'Sem balanço do tronco, supinação no topo' },
      { ex: db.prancha_isometrica, note: 'Abdômen e glúteos em tensão contínua' }
    ];

    // Treino Superior / Empurrar & Puxar (Casa)
    const homeUpper = [
      { ex: db.flexao_braco_solo, note: 'Corpo rígido como uma tábua, desça até o chão' },
      { ex: db.barra_fixa_ou_invertida_casa, note: 'Puxe o peito com foco nas dorsais' },
      { ex: db.flexao_pike_casa, note: 'Quadril alto e foco total nos ombros' },
      { ex: db.remada_unilateral_serrote, note: 'Puxe em arco em direção ao quadril' },
      { ex: db.triceps_banco_casa, note: 'Costas rentes ao banco para proteger os ombros' },
      { ex: db.rosca_direta_halteres, note: 'Use garrafas ou elástico com cadência lenta' },
      { ex: db.prancha_isometrica, note: 'Transverso ativado puxando o umbigo' }
    ];

    // Treino Full Body (Academia)
    const gymFullBodyA = [
      { ex: db.agachamento_livre, note: 'Exercício rei para membros inferiores e core' },
      { ex: db.supino_reto_halteres, note: 'Base de força para peitoral e tríceps' },
      { ex: db.puxada_alta_pulley, note: 'Alargamento de dorsais e equilíbrio escapular' },
      { ex: db.elevacao_lateral, note: 'Isolamento de deltóide lateral (largura de ombros)' },
      { ex: db.triceps_corda_polia, note: 'Finalização de braços' },
      { ex: db.abdominal_infra_solo, note: 'Core inferior sem descolar a lombar' }
    ];

    const gymFullBodyB = [
      { ex: db.stiff_halteres, note: 'Cadeia posterior completa (glúteos e isquiotibiais)' },
      { ex: db.elevacao_pelvica, note: 'Pico de contração nos glúteos' },
      { ex: db.desenvolvimento_halteres, note: 'Empurrar vertical para ombros' },
      { ex: db.remada_curvada_halteres, note: 'Espessura de costas e postura' },
      { ex: db.rosca_direta_halteres, note: 'Bíceps e antebraços' },
      { ex: db.prancha_isometrica, note: 'Isometria de estabilização' }
    ];

    // Treino Full Body (Casa)
    const homeFullBodyA = [
      { ex: db.agachamento_peso_corpo, note: '3 segundos na descida, subida potente' },
      { ex: db.flexao_braco_solo, note: 'Apoie os joelhos se necessário para manter a forma' },
      { ex: db.barra_fixa_ou_invertida_casa, note: 'Puxe o peito firme contra a resistência' },
      { ex: db.afundo_livre_casa, note: 'Tensão contínua nas pernas' },
      { ex: db.prancha_isometrica, note: 'Sustentação firme por 40 a 60 segundos' }
    ];

    const homeFullBodyB = [
      { ex: db.ponte_gluteos_solo, note: 'Suba apertando os glúteos por 2 segundos' },
      { ex: db.flexao_pike_casa, note: 'Foco em ombros e tríceps' },
      { ex: db.stiff_unilateral_casa, note: 'Equilíbrio e posteriores de coxa' },
      { ex: db.triceps_banco_casa, note: 'Extensão controlada dos cotovelos' },
      { ex: db.abdominal_infra_solo, note: 'Subida controlada sem embalo' }
    ];

    // Distribuição dos dias
    const activeDays = DAYS_ORDER.filter(d => daysSelected.includes(d.key));
    let trainingIndex = 0;

    DAYS_ORDER.forEach(d => {
      const isSelected = daysSelected.includes(d.key);

      if (!isSelected) {
        // Dia de descanso / regeneração ativa
        weekly[d.key] = {
          dayName: d.label,
          short: d.short,
          isRest: true,
          title: 'Descanso Ativo & Regeneração',
          duration: '30-40 min',
          description: 'A hipertrofia e a queima de gordura ocorrem durante a recuperação. Hidrate-se e mantenha a musculatura relaxada.',
          activities: [
            'Caminhada leve ou esteira em ritmo confortável (5.000 a 8.000 passos).',
            'Sessão de alongamento suave para membros inferiores e coluna.',
            'Consumo ideal de água (35 a 45ml por kg de peso corporal).',
            'Sono reparador de 7 a 9 horas para restauração hormonal (GH e Testosterona).'
          ]
        };
      } else {
        // Dia de treino ativo
        trainingIndex++;
        let dayTitle = '';
        let targetMuscles = '';
        let warmup = '';
        let exercisesList = [];

        if (activeDays.length <= 3) {
          // Divisão Full Body ou ABC
          if (gender === 'feminino' && objId === 'gluteos_pernas') {
            if (trainingIndex % 2 === 1) {
              dayTitle = `Treino ${trainingIndex}: Foco Glúteos Máximos & Quadríceps`;
              targetMuscles = 'Glúteo Máximo, Quadríceps e Panturrilhas';
              warmup = '5 min de mobilidade de tornozelo e 2 séries de 15 repetições de ponte de glúteos sem peso.';
              exercisesList = env === 'academia' ? gymLegsGlutes : homeLegsGlutes;
            } else {
              dayTitle = `Treino ${trainingIndex}: Superiores Esculpidos, Costas & Core`;
              targetMuscles = 'Dorsais, Ombros, Peitoral, Braços e Abdômen';
              warmup = '5 min de rotação de ombros, manguito rotador e prancha isométrica de ativação.';
              exercisesList = env === 'academia' ? gymUpper : homeUpper;
            }
          } else {
            // Full Body Alternado Masculino / Geral
            if (trainingIndex % 2 === 1) {
              dayTitle = `Treino ${trainingIndex}: Full Body A (Ênfase Peitoral & Pernas)`;
              targetMuscles = 'Quadríceps, Peitoral, Dorsal e Ombros';
              warmup = '5 min de aquecimento articular geral, polichinelos leves e 1 série de agachamento corporal.';
              exercisesList = env === 'academia' ? gymFullBodyA : homeFullBodyA;
            } else {
              dayTitle = `Treino ${trainingIndex}: Full Body B (Ênfase Cadeia Posterior & Costas)`;
              targetMuscles = 'Posteriores, Glúteos, Ombros e Braços';
              warmup = '5 min de mobilidade de quadril, perdigueiro e elevações pélvicas sem peso.';
              exercisesList = env === 'academia' ? gymFullBodyB : homeFullBodyB;
            }
          }
        } else {
          // 4 ou mais dias: Upper / Lower alternado
          if (trainingIndex % 2 === 1) {
            dayTitle = `Treino ${trainingIndex}: Membros Inferiores & Glúteos`;
            targetMuscles = 'Quadríceps, Glúteos, Isquiotibiais e Panturrilhas';
            warmup = '5 min de mobilidade de quadril, tornozelos e ativação de glúteo médio.';
            exercisesList = env === 'academia' ? gymLegsGlutes : homeLegsGlutes;
          } else {
            dayTitle = `Treino ${trainingIndex}: Membros Superiores & Core`;
            targetMuscles = 'Peitoral, Costas, Deltóides, Tríceps, Bíceps e Abdômen';
            warmup = '5 min de aquecimento escapular, rotação de punhos e ativação de manguito.';
            exercisesList = env === 'academia' ? gymUpper : homeUpper;
          }
        }

        weekly[d.key] = {
          dayName: d.label,
          short: d.short,
          isRest: false,
          title: dayTitle,
          targetMuscles: targetMuscles,
          duration: '~50 a 60 min',
          warmup: warmup,
          prescription: {
            setsReps: currentObj.setsReps,
            rest: currentObj.rest,
            rpe: currentObj.rpe
          },
          exercises: exercisesList.map(item => ({
            ...item.ex,
            specificNote: item.note,
            setsReps: currentObj.setsReps,
            restTime: currentObj.rest
          }))
        };
      }
    });

    appState.weeklyPlan = weekly;

    // Se o dia ativo atual for descanso, tenta focar no primeiro dia de treino ativo
    if (weekly[appState.activeDayTab] && weekly[appState.activeDayTab].isRest) {
      const firstActive = DAYS_ORDER.find(d => daysSelected.includes(d.key));
      if (firstActive) appState.activeDayTab = firstActive.key;
    }

    renderDaysTabs();
    renderActiveDayContent();
    updatePlanSummaryHeader();

    // Rola suavemente até o resultado
    const sec = document.getElementById('workout-results-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }

  // Atualizar Resumo no Cabeçalho
  function updatePlanSummaryHeader() {
    const el = document.getElementById('plan-meta-summary');
    if (!el) return;

    const gText = appState.gender === 'masculino' ? 'Perfil Masculino' : 'Perfil Feminino';
    const objList = OBJECTIVES_DATA[appState.gender] || OBJECTIVES_DATA.masculino;
    const obj = objList.find(o => o.id === appState.objective) || objList[0];
    const envText = appState.environment === 'academia' ? 'Academia Completa' : 'Em Casa (Calistenia)';
    const daysCount = `${appState.selectedDays.length} Dias na Semana`;

    el.textContent = `${gText} • ${obj.title} • ${envText} • ${daysCount}`;
  }

  // Renderizar Abas dos Dias
  function renderDaysTabs() {
    const tabsContainer = document.getElementById('workout-days-tabs');
    if (!tabsContainer || !appState.weeklyPlan) return;

    tabsContainer.innerHTML = DAYS_ORDER.map(d => {
      const dayData = appState.weeklyPlan[d.key];
      const isSelected = appState.selectedDays.includes(d.key);
      const isActive = appState.activeDayTab === d.key;
      const statusIcon = isSelected ? '🏋️' : '💤';

      return `
        <button type="button" class="plan-day-tab ${isActive ? 'active' : ''}" data-day="${d.key}">
          <span>${statusIcon} ${d.label}</span>
        </button>
      `;
    }).join('');

    tabsContainer.querySelectorAll('.plan-day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.plan-day-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        appState.activeDayTab = tab.dataset.day;
        renderActiveDayContent();
      });
    });
  }

  // Renderizar o Conteúdo do Dia Ativo
  function renderActiveDayContent() {
    const container = document.getElementById('workout-day-content');
    if (!container || !appState.weeklyPlan) return;

    const day = appState.weeklyPlan[appState.activeDayTab];
    if (!day) return;

    if (day.isRest) {
      container.innerHTML = `
        <div class="rest-day-card">
          <div class="rest-icon">🧘‍♂️</div>
          <h4>${day.dayName}: ${day.title}</h4>
          <p>${day.description}</p>
          <div style="max-width: 520px; margin: 0 auto; text-align: left; background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 18px 22px;">
            <strong style="display: block; font-size: 0.88rem; color: var(--text-main); margin-bottom: 10px;">
              Diretrizes para este dia de descanso:
            </strong>
            <ul style="padding-left: 20px; font-size: 0.82rem; color: var(--text-body); line-height: 1.6; margin: 0;">
              ${day.activities.map(act => `<li>${act}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="workout-day-card">
        
        <div class="workout-day-head">
          <div class="workout-day-title-wrap">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px;">${day.dayName}</span>
            <h3>${day.title}</h3>
            <span class="workout-day-target-sub">Músculos Alvo: <strong>${day.targetMuscles}</strong></span>
          </div>

          <div class="workout-day-badges">
            <span class="badge-metric">⏱️ ${day.duration}</span>
            <span class="badge-metric">🎯 ${day.prescription.setsReps}</span>
            <span class="badge-metric">⏳ Descanso: ${day.prescription.rest}</span>
          </div>
        </div>

        <!-- Aquecimento & Mobilidade -->
        <div class="warmup-box">
          <span style="font-size: 1.3rem;">🔥</span>
          <div>
            <strong>Aquecimento & Ativação Específica (5-8 min):</strong>
            <div>${day.warmup}</div>
          </div>
        </div>

        <!-- Lista de Exercícios -->
        <div class="workout-exercises-list">
          ${day.exercises.map((ex, idx) => `
            <div class="workout-exercise-item" id="ex-row-${ex.id}">
              <div class="exercise-item-main">
                <div class="exercise-name-group">
                  <div class="exercise-num-badge">${idx + 1}</div>
                  <div class="exercise-title-text">
                    <h4>${ex.name}</h4>
                    <div class="exercise-target-tags">
                      ${ex.musclesPrimary.map(m => `<span class="muscle-tag">${m}</span>`).join('')}
                      ${ex.musclesSecondary.slice(0, 2).map(m => `<span class="muscle-tag sec">${m}</span>`).join('')}
                    </div>
                  </div>
                </div>

                <div class="exercise-meta-actions">
                  <div class="exercise-prescription-tag">
                    ${ex.setsReps} • Descanso: ${ex.restTime}
                  </div>
                  <button type="button" class="btn-open-video" data-exercise="${ex.id}">
                    <span>🎬</span> Como Fazer (Vídeo IA)
                  </button>
                </div>
              </div>

              <div class="exercise-cue-bar">
                <span class="icon">💡 Ponto de Atenção:</span>
                <span>${ex.specificNote}</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    // Event listeners para os botões "Como Fazer (Vídeo IA)"
    container.querySelectorAll('.btn-open-video').forEach(btn => {
      btn.addEventListener('click', () => {
        openVideoModal(btn.dataset.exercise);
      });
    });
  }

  // Abrir Modal de Demonstração em Vídeo
  function openVideoModal(exerciseId) {
    const modal = document.getElementById('video-demo-modal');
    if (!modal) return;

    appState.modalExerciseId = exerciseId;
    appState.modalAthleteGender = appState.gender;
    appState.modalAngle = 'frontal';

    updateModalContent();
    modal.style.display = 'flex';
  }

  // Atualizar Conteúdo do Modal de Vídeo
  function updateModalContent() {
    const exId = appState.modalExerciseId;
    const db = EXERCISES_DB[exId];
    if (!db) return;

    // Título
    const titleEl = document.getElementById('modal-exercise-title');
    if (titleEl) titleEl.textContent = db.name;

    // Botão de alternar atleta
    const athleteText = document.getElementById('modal-athlete-text');
    const athleteIcon = document.getElementById('modal-athlete-icon');
    if (athleteText && athleteIcon) {
      if (appState.modalAthleteGender === 'masculino') {
        athleteIcon.textContent = '👨';
        athleteText.textContent = 'Mudar para Atriz Feminina';
      } else {
        athleteIcon.textContent = '👩';
        athleteText.textContent = 'Mudar para Ator Masculino';
      }
    }

    // Cues e Mistakes
    const cuesList = document.getElementById('modal-cues-list');
    if (cuesList) {
      cuesList.innerHTML = db.cues.map(c => `<li>${c}</li>`).join('');
    }

    const mistakesList = document.getElementById('modal-mistakes-list');
    if (mistakesList) {
      mistakesList.innerHTML = db.mistakes.map(m => `<li>${m}</li>`).join('');
    }

    // Busca mídias do exercício
    const mediaItem = MEDIA_ASSETS[exId] || MEDIA_ASSETS.agachamento_livre;
    const currentAthleteMedia = mediaItem[appState.modalAthleteGender] || mediaItem.masculino;

    const screenGrid = document.getElementById('video-screen-grid');
    const viewFrontal = document.getElementById('viewport-frontal');
    const viewLateral = document.getElementById('viewport-lateral');
    const imgFrontal = document.getElementById('img-video-frontal');
    const imgLateral = document.getElementById('img-video-lateral');
    const videoFrontal = document.getElementById('video-player-frontal');
    const videoLateral = document.getElementById('video-player-lateral');
    const badgeFrontal = document.getElementById('actor-badge-frontal');
    const badgeLateral = document.getElementById('actor-badge-lateral');

    const actorLabel = appState.modalAthleteGender === 'masculino' 
      ? 'Ator IA Masculino • Físico Atlético' 
      : 'Atriz IA Feminina • Físico Atlético';

    if (badgeFrontal) badgeFrontal.textContent = actorLabel;
    if (badgeLateral) badgeLateral.textContent = actorLabel;

    // Configuração de Mídia Frontal (Vídeo ou Imagem)
    if (currentAthleteMedia.frontal) {
      if (videoFrontal && currentAthleteMedia.frontal.video) {
        videoFrontal.src = currentAthleteMedia.frontal.video;
        videoFrontal.style.display = 'block';
        if (imgFrontal) imgFrontal.style.display = 'none';
        videoFrontal.play().catch(() => {});
        videoFrontal.onerror = () => {
          videoFrontal.style.display = 'none';
          if (imgFrontal) {
            imgFrontal.src = currentAthleteMedia.frontal.img;
            imgFrontal.style.display = 'block';
          }
        };
      } else if (imgFrontal) {
        if (videoFrontal) videoFrontal.style.display = 'none';
        imgFrontal.src = currentAthleteMedia.frontal.img;
        imgFrontal.style.display = 'block';
      }
    }

    // Configuração de Mídia Lateral (Vídeo ou Imagem)
    if (currentAthleteMedia.lateral) {
      if (videoLateral && currentAthleteMedia.lateral.video) {
        videoLateral.src = currentAthleteMedia.lateral.video;
        videoLateral.style.display = 'block';
        if (imgLateral) imgLateral.style.display = 'none';
        videoLateral.play().catch(() => {});
        videoLateral.onerror = () => {
          videoLateral.style.display = 'none';
          if (imgLateral) {
            imgLateral.src = currentAthleteMedia.lateral.img;
            imgLateral.style.display = 'block';
          }
        };
      } else if (imgLateral) {
        if (videoLateral) videoLateral.style.display = 'none';
        imgLateral.src = currentAthleteMedia.lateral.img;
        imgLateral.style.display = 'block';
      }
    }

    // Controle de Ângulos de Visualização
    if (screenGrid && viewFrontal && viewLateral) {
      if (appState.modalAngle === 'frontal') {
        screenGrid.classList.remove('dual-view');
        viewFrontal.style.display = 'flex';
        viewLateral.style.display = 'none';
      } else if (appState.modalAngle === 'lateral') {
        screenGrid.classList.remove('dual-view');
        viewFrontal.style.display = 'none';
        viewLateral.style.display = 'flex';
      } else {
        // Dual view (2 ângulos)
        screenGrid.classList.add('dual-view');
        viewFrontal.style.display = 'flex';
        viewLateral.style.display = 'flex';
      }
    }

    // Atualiza abas ativas do ângulo
    const tabsContainer = document.getElementById('angle-tabs-container');
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.angle-tab-btn').forEach(btn => {
        if (btn.dataset.angle === appState.modalAngle) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Animação do Rastreador de Fases Biomecânicas
    startPhaseTrackerAnimation();
  }

  let phaseInterval = null;
  function startPhaseTrackerAnimation() {
    if (phaseInterval) clearInterval(phaseInterval);

    const b1 = document.getElementById('phase-badge-1');
    const b2 = document.getElementById('phase-badge-2');
    const b3 = document.getElementById('phase-badge-3');
    if (!b1 || !b2 || !b3) return;

    let step = 1;
    function updateBadges() {
      b1.classList.toggle('active', step === 1);
      b2.classList.toggle('active', step === 2);
      b3.classList.toggle('active', step === 3);
      step = step >= 3 ? 1 : step + 1;
    }

    updateBadges();
    phaseInterval = setInterval(updateBadges, 1200);
  }

  // Gerenciamento do Cronômetro de Descanso
  function setupRestTimer() {
    const display = document.getElementById('timer-display');
    const timerWidget = document.getElementById('floating-rest-timer');
    const btnReset = document.getElementById('btn-timer-reset');

    function updateDisplay() {
      const m = Math.floor(appState.timerSeconds / 60);
      const s = appState.timerSeconds % 60;
      if (display) {
        display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }

    function startTimer(seconds) {
      if (appState.timerInterval) clearInterval(appState.timerInterval);
      appState.timerSeconds = seconds;
      updateDisplay();

      if (timerWidget) timerWidget.style.borderColor = 'var(--primary)';

      appState.timerInterval = setInterval(() => {
        if (appState.timerSeconds > 0) {
          appState.timerSeconds--;
          updateDisplay();
        } else {
          clearInterval(appState.timerInterval);
          if (timerWidget) timerWidget.style.borderColor = '#10B981';
          // Tenta emitir um bip visual ou áudio
          if (display) display.textContent = 'PRONTO!';
          setTimeout(() => {
            updateDisplay();
            if (timerWidget) timerWidget.style.borderColor = 'var(--primary)';
          }, 3000);
        }
      }, 1000);
    }

    document.querySelectorAll('.timer-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const secs = parseInt(btn.dataset.time, 10);
        startTimer(secs);
      });
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (appState.timerInterval) clearInterval(appState.timerInterval);
        appState.timerSeconds = 0;
        updateDisplay();
      });
    }
  }

  // Copiar Ficha para WhatsApp
  function setupWhatsAppExport() {
    const btnCopy = document.getElementById('btn-copy-workout-zap');
    if (!btnCopy) return;

    btnCopy.addEventListener('click', () => {
      if (!appState.weeklyPlan) return;

      const objList = OBJECTIVES_DATA[appState.gender] || OBJECTIVES_DATA.masculino;
      const obj = objList.find(o => o.id === appState.objective) || objList[0];
      const envText = appState.environment === 'academia' ? 'Academia Completa' : 'Em Casa (Calistenia)';

      const lines = [
        '🏋️ *FICHA DE TREINO SEMANAL - J4 FITNESS*',
        `Objetivo: *${obj.title}* | Local: *${envText}*`,
        'Prescrição Baseada no Colégio Americano de Medicina do Esporte (ACSM)\n'
      ];

      DAYS_ORDER.forEach(d => {
        const day = appState.weeklyPlan[d.key];
        if (!day) return;

        if (day.isRest) {
          lines.push(`💤 *${day.dayName.toUpperCase()} - DESCANSO ATIVO*`);
          lines.push(`• ${day.description}`);
          lines.push('');
        } else {
          lines.push(`🔥 *${day.dayName.toUpperCase()}: ${day.title}*`);
          lines.push(`🎯 Alvo: ${day.targetMuscles}`);
          lines.push(`⏳ Descanso entre séries: ${day.prescription.rest}`);
          day.exercises.forEach((ex, i) => {
            lines.push(` ${i + 1}. *${ex.name}* (${ex.setsReps})`);
            lines.push(`    ↳ Dica: _${ex.specificNote}_`);
          });
          lines.push('');
        }
      });

      lines.push('_Monte seu treino completo com vídeos em 2 ângulos: https://j4fitnes.5450wp.easypanel.host/treino.html_');

      const fullText = lines.join('\n');
      navigator.clipboard.writeText(fullText).then(() => {
        alert('Ficha de treino copiada com sucesso! Cole diretamente no WhatsApp.');
      }).catch(() => {
        prompt('Copie o texto da sua ficha abaixo:', fullText);
      });
    });
  }

  // Inicialização e Event Listeners Gerais
  function init() {
    // 1. Alternância de Gênero
    const btnMasc = document.getElementById('btn-gender-masc');
    const btnFem = document.getElementById('btn-gender-fem');
    if (btnMasc && btnFem) {
      btnMasc.addEventListener('click', () => {
        btnMasc.classList.add('active');
        btnFem.classList.remove('active');
        appState.gender = 'masculino';
        renderObjectiveCards();
      });

      btnFem.addEventListener('click', () => {
        btnFem.classList.add('active');
        btnMasc.classList.remove('active');
        appState.gender = 'feminino';
        renderObjectiveCards();
      });
    }

    // 2. Alternância de Ambiente (Academia vs Casa)
    const btnAcademia = document.getElementById('btn-env-academia');
    const btnCasa = document.getElementById('btn-env-casa');
    if (btnAcademia && btnCasa) {
      btnAcademia.addEventListener('click', () => {
        btnAcademia.classList.add('active');
        btnCasa.classList.remove('active');
        appState.environment = 'academia';
      });

      btnCasa.addEventListener('click', () => {
        btnCasa.classList.add('active');
        btnAcademia.classList.remove('active');
        appState.environment = 'casa';
      });
    }

    // 3. Seleção dos Dias da Semana
    const daysRow = document.getElementById('days-pills-row');
    if (daysRow) {
      daysRow.querySelectorAll('.day-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const day = btn.dataset.day;
          if (appState.selectedDays.includes(day)) {
            // Se for o único dia selecionado, não desmarca
            if (appState.selectedDays.length <= 1) return;
            appState.selectedDays = appState.selectedDays.filter(d => d !== day);
            btn.classList.remove('active');
          } else {
            appState.selectedDays.push(day);
            btn.classList.add('active');
          }
          updateFrequencyBanner();
        });
      });
    }

    // 4. Botão Gerar Treino
    const btnGerar = document.getElementById('btn-gerar-treino');
    if (btnGerar) {
      btnGerar.addEventListener('click', (e) => {
        e.preventDefault();
        generateWeeklyWorkout();
      });
    }

    // 5. Botão Imprimir Ficha
    const btnPrint = document.getElementById('btn-print-workout');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // 6. Eventos do Modal de Vídeo
    const modal = document.getElementById('video-demo-modal');
    const btnCloseModal = document.getElementById('btn-close-video-modal');
    if (modal && btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
        if (phaseInterval) clearInterval(phaseInterval);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          if (phaseInterval) clearInterval(phaseInterval);
        }
      });
    }

    // Alternância de Ângulos no Modal
    const angleTabs = document.getElementById('angle-tabs-container');
    if (angleTabs) {
      angleTabs.querySelectorAll('.angle-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          appState.modalAngle = btn.dataset.angle;
          updateModalContent();
        });
      });
    }

    // Alternância de Ator IA no Modal
    const btnToggleAthlete = document.getElementById('btn-toggle-modal-athlete');
    if (btnToggleAthlete) {
      btnToggleAthlete.addEventListener('click', () => {
        appState.modalAthleteGender = appState.modalAthleteGender === 'masculino' ? 'feminino' : 'masculino';
        updateModalContent();
      });
    }

    // 7. Render inicial
    renderObjectiveCards();
    updateFrequencyBanner();
    setupRestTimer();
    setupWhatsAppExport();
    generateWeeklyWorkout();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

