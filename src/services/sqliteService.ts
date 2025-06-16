import SQLite from 'react-native-sqlite-storage';

// Configuração do SQLite
SQLite.enablePromise(true);

export interface EducadoraData {
  id: number;
  nome: string;
  tipo: 'educadora' | 'coordenadora';
  email: string;
  senha: string;
  igreja: string;
  regiao: string;
  bloco: string;
  createdAt: string;
}

export interface ChildData {
  id: number;
  nomeCrianca: string;
  idade: number;
  dataNascimento: string;
  responsavel: string;
  telefoneResponsavel: string;
  cpfResponsavel: string;
  createdAt: string;
}

export interface EntradaData {
  id: number;
  salinhaId: number,
  childId: number;
  educadoraId: number;
  codigoColete: string;
  dataEntrada: string;
  horaEntrada: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

// Novos interfaces para histórico
export interface CriancaHistorico {
  id: number;
  nomeCrianca: string;
  codigoColete: string;
  horaEntrada: string;
  horaSaida: string | null;
}

export interface SalinhaHistoricoCompleto {
  id: number;
  educadoraId: number;
  nomeEducadora: string;
  dataAbertura: string;
  horaAbertura: string;
  horaFechamento: string | null;
  status: 'aberta' | 'fechada';
  observacoes?: string;
  criancas: CriancaHistorico[];
}

// Novos interfaces para as telas
export interface SalinhaAtiva {
  id: number;
  educadoraId: number;
  nomeEducadora: string;
  status: 'aberta' | 'fechada';
  dataAbertura: string;
  horaAbertura: string;
}

export interface CriancaEntrada {
  id: number;
  nomeCrianca: string;
  codigoColete: string;
  responsavel: string;
  educadora: string;
  horaEntrada: string;
  childId: number;
}

export interface EntradaCompleta {
  id: number;
  childId: number;
  nomeCrianca: string;
  codigoColete: string;
  dataEntrada: string;
  horaEntrada: string;
  horaSaida?: string;
  educadora: string;
  educadoraId: number;
  responsavel: string;
  telefoneResponsavel: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
}

export interface LoginResult {
  success: boolean;
  user?: EducadoraData;
  error?: string;
}

export interface OperationResult {
  success: boolean;
  error?: string;
  id?: number;
}

// Parâmetros para busca de entradas
export interface EntradaParams {
  data?: string;
  educadoraId?: number;
  childId?: number;
}

// Interface para parâmetros de abertura de salinha
export interface AberturaSalinhaParams {
  data: string;
  horaAbertura: string;
  educadoraId: number;
  observacoes?: string;
}

export interface HistoricoSalinha {
  dataAbertura: string;
  horaAbertura: string;
  horaFechamento: string | null;
  statusSalinha: 'aberta' | 'fechada';
  nomeEducadora: string;
  nomeCrianca: string;
  responsavel: string;
  telefoneResponsavel: string;
  codigoColete: string;
  horaEntrada: string;
  horaSaida: string | null;
  statusCrianca: 'presente' | 'ausente' | 'saiu';
}

export interface Saida {
  id: number;
  entradaId: number;
  horaSaida: string;
  educadoraId: number;
  dataSaida: string;
  createdAt: string;
}

let database: SQLite.SQLiteDatabase;

// Inicializar banco de dados
export const openDB = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (database) {
      return database;
    }

    database = await SQLite.openDatabase({
      name: 'maindb.db',
      location: 'default',
    });

    console.log('Database opened successfully');

    //await dropTables();    

    await createTables();

    return database;

  } catch (error) {
    console.error('Error opening database: ', error);
    throw error;
  }
};

// Obter histórico das salinhas
// export const getHistoricoSalinhas = async (data: string): Promise<SalinhaHistoricoCompleto[]> => {
//   try {
//     if (!database) {
//       await openDB();
//     }

//     // Primeiro, buscar todas as salinhas
//     const [salinhasResults] = await database.executeSql(`
//       SELECT 
//         s.id,
//         s.educadoraId,
//         s.dataAbertura,
//         s.horaAbertura,
//         s.horaFechamento,
//         s.status,
//         s.observacoes,
//         ed.nome as nomeEducadora
//       FROM salinhas s
//       JOIN educadoras ed ON ed.id = s.educadoraId
//       WHERE s.dataAbertura = ?
//       ORDER BY s.horaAbertura DESC
//     `, [data]);

//     const salinhas: SalinhaHistoricoCompleto[] = [];

//     // Para cada salinha, buscar suas crianças
//     for (let i = 0; i < salinhasResults.rows.length; i++) {
//       const salinha = salinhasResults.rows.item(i);

//       console.log(`Buscando crianças para salinha ID ${salinha.id} - Educadora: ${salinha.nomeEducadora}`);

//       // Buscar crianças desta salinha
//       const [criancasResults] = await database.executeSql(`
//         SELECT 
//           c.id,
//           c.nomeCrianca,
//           e.codigoColete,
//           e.horaEntrada,
//           s.horaSaida
//         FROM entradas e
//         JOIN children c ON c.id = e.childId
//         LEFT JOIN saidas s ON s.entradaId = e.id
//         WHERE e.salinhaId = ?
//         ORDER BY e.horaEntrada ASC
//       `, [salinha.id]);

//       const criancas: CriancaHistorico[] = [];

//       // Processar resultados das crianças
//       for (let j = 0; j < criancasResults.rows.length; j++) {
//         const crianca = criancasResults.rows.item(j);
//         criancas.push({
//           id: crianca.id,
//           nomeCrianca: crianca.nomeCrianca,
//           codigoColete: crianca.codigoColete,
//           horaEntrada: crianca.horaEntrada,
//           horaSaida: crianca.horaSaida || null
//         });
//       }

//       // Adicionar salinha com suas crianças ao array final
//       salinhas.push({
//         id: salinha.id,
//         educadoraId: salinha.educadoraId,
//         nomeEducadora: salinha.nomeEducadora,
//         dataAbertura: salinha.dataAbertura,
//         horaAbertura: salinha.horaAbertura,
//         horaFechamento: salinha.horaFechamento,
//         status: salinha.status,
//         observacoes: salinha.observacoes,
//         criancas: criancas
//       });
//     }

//     return salinhas;

//   } catch (error) {
//     console.error('Erro ao buscar histórico das salinhas:', error);
//     throw new Error(`Falha ao buscar histórico: ${error}`);
//   }
// };

// Obter histórico de salinhas
// export const getHistoricoSalinhas = async (data: string): Promise<SalinhaHistoricoCompleto[]> => {
//   try {
//     if (!database) {
//       await openDB();
//     }

//     // Primeiro, buscar todas as salinhas
//     const [salinhasResults] = await database.executeSql(`
//       SELECT 
//         s.id,
//         s.educadoraId,
//         s.dataAbertura,
//         s.horaAbertura,
//         s.horaFechamento,
//         s.status,
//         s.observacoes,
//         ed.nome as nomeEducadora
//       FROM salinhas s
//       JOIN educadoras ed ON ed.id = s.educadoraId
//       WHERE s.dataAbertura = ?
//       ORDER BY s.horaAbertura DESC
//     `, [data]);

//     const salinhas: SalinhaHistoricoCompleto[] = [];

//     //console.log(`Buscando histórico de salinhas qtde: ${salinhasResults.rows.length}`);

//     // Para cada salinha, buscar suas crianças
//     for (let i = 0; i < salinhasResults.rows.length; i++) {
//       const salinha = salinhasResults.rows.item(i);

//       // Buscar crianças desta salinha usando o ID da entrada
//       const [criancasResults] = await database.executeSql(`
//         SELECT 
//           c.id,
//           c.nomeCrianca,
//           e.codigoColete,
//           e.horaEntrada,
//           COALESCE(s.horaSaida, null) as horaSaida
//         FROM entradas e
//         JOIN children c ON c.id = e.childId
//         LEFT JOIN saidas s ON s.entradaId = e.id
//         WHERE e.educadoraId = ? AND e.dataEntrada = ?
//         ORDER BY e.horaEntrada ASC
//       `, [salinha.educadoraId, data]);

//       const criancas: CriancaHistorico[] = [];

//       // Processar resultados das crianças
//       for (let j = 0; j < criancasResults.rows.length; j++) {
//         const crianca = criancasResults.rows.item(j);
//         criancas.push({
//           id: crianca.id,
//           nomeCrianca: crianca.nomeCrianca,
//           codigoColete: crianca.codigoColete,
//           horaEntrada: crianca.horaEntrada,
//           horaSaida: crianca.horaSaida
//         });
//       }

//       // Adicionar salinha com suas crianças ao array final
//       salinhas.push({
//         id: salinha.id,
//         educadoraId: salinha.educadoraId,
//         nomeEducadora: salinha.nomeEducadora,
//         dataAbertura: salinha.dataAbertura,
//         horaAbertura: salinha.horaAbertura,
//         horaFechamento: salinha.horaFechamento,
//         status: salinha.status,
//         observacoes: salinha.observacoes,
//         criancas: criancas
//       });
//     }

//     return salinhas;

//   } catch (error) {
//     console.error('Erro ao buscar histórico das salinhas:', error);
//     throw new Error(`Falha ao buscar histórico: ${error}`);
//   }
// };

export const getHistoricoSalinhas = async (data: string): Promise<SalinhaHistoricoCompleto[]> => {
  try {
    if (!database) {
      await openDB();
    }

    // Query unificada para buscar todas as salinhas e suas crianças
    const [results] = await database.executeSql(`
      WITH SalinhasHoje AS (
        SELECT 
          s.id,
          s.educadoraId,
          s.dataAbertura,
          s.horaAbertura,
          s.horaFechamento,
          s.status,
          s.observacoes,
          ed.nome as nomeEducadora
        FROM salinhas s
        JOIN educadoras ed ON ed.id = s.educadoraId
        WHERE s.dataAbertura = ?
      )
      SELECT 
        s.*,
        c.id as childId,
        c.nomeCrianca,
        e.codigoColete,
        e.horaEntrada,
        COALESCE(sai.horaSaida, null) as horaSaida
      FROM SalinhasHoje s
      LEFT JOIN entradas e ON e.salinhaId = s.id
      LEFT JOIN children c ON c.id = e.childId
      LEFT JOIN saidas sai ON sai.entradaId = e.id
      ORDER BY 
        s.horaAbertura DESC,
        e.horaEntrada ASC
    `, [data]);

    // Processar os resultados agrupando as crianças por salinha
    const salinhasMap = new Map<number, SalinhaHistoricoCompleto>();

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);

      if (!salinhasMap.has(row.id)) {
        // Criar nova entrada para salinha
        salinhasMap.set(row.id, {
          id: row.id,
          educadoraId: row.educadoraId,
          nomeEducadora: row.nomeEducadora,
          dataAbertura: row.dataAbertura,
          horaAbertura: row.horaAbertura,
          horaFechamento: row.horaFechamento,
          status: row.status,
          observacoes: row.observacoes,
          criancas: []
        });
      }

      // Adicionar criança se existir
      if (row.childId) {
        const salinha = salinhasMap.get(row.id)!;
        // Evitar duplicatas
        if (!salinha.criancas.some(c => c.id === row.childId)) {
          salinha.criancas.push({
            id: row.childId,
            nomeCrianca: row.nomeCrianca,
            codigoColete: row.codigoColete,
            horaEntrada: row.horaEntrada,
            horaSaida: row.horaSaida
          });
        }
      }
    }

    return Array.from(salinhasMap.values());

  } catch (error) {
    console.error('Erro ao buscar histórico das salinhas:', error);
    throw new Error(`Falha ao buscar histórico: ${error}`);
  }
};

// Obter salinha ativa
export const getSalinhaAtiva = async (educadoraId: number, dataHoje: string): Promise<SalinhaAtiva | null> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      `SELECT s.id, s.educadoraId, s.dataAbertura, s.horaAbertura, s.status, e.nome as nomeEducadora
             FROM salinhas s
             JOIN educadoras e ON s.educadoraId = e.id
             WHERE s.educadoraId = ? AND s.status = 'aberta' AND s.dataAbertura = ?
             ORDER BY s.dataAbertura DESC, s.horaAbertura DESC`,
      [educadoraId, dataHoje]
    );

    if (results.rows.length > 0) {
      const salinha = results.rows.item(0);

      return {
        id: salinha.id,
        educadoraId: salinha.educadoraId,
        nomeEducadora: salinha.nomeEducadora,
        status: salinha.status,
        dataAbertura: salinha.dataAbertura,
        horaAbertura: salinha.horaAbertura,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting salinha ativa: ', error);
    return null;
  }
};

// Obter instância do banco
export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    return await openDB();
  }
  return database;
};

// Criar tabelas
const createTables = async (): Promise<void> => {
  try {

    // Tabela de educadoras
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS educadoras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('educadora', 'coordenadora')),
        email TEXT UNIQUE,
        senha TEXT,
        igreja TEXT,
        regiao TEXT,
        bloco TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de crianças
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeCrianca TEXT NOT NULL,
        idade INTEGER NOT NULL,
        dataNascimento TEXT NOT NULL,
        responsavel TEXT NOT NULL,
        telefoneResponsavel TEXT NOT NULL,
        cpfResponsavel TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de entradas
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS entradas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        childId INTEGER,
        educadoraId INTEGER NOT NULL,
        salinhaId INTEGER NOT NULL,
        codigoColete TEXT NOT NULL,
        dataEntrada TEXT NOT NULL,
        horaEntrada TEXT NOT NULL,
        observacoes TEXT,
        status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (childId) REFERENCES children (id) ON DELETE CASCADE,
        FOREIGN KEY (educadoraId) REFERENCES educadoras (id) ON DELETE CASCADE,
        FOREIGN KEY (salinhaId) REFERENCES salinhas (id) ON DELETE CASCADE
      )
    `);

    // Tabela de salinhas (para controle de abertura/fechamento)
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS salinhas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        educadoraId INTEGER NOT NULL,
        dataAbertura TEXT NOT NULL,
        horaAbertura TEXT NOT NULL,
        horaFechamento TEXT,
        status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'fechada')),
        observacoes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (educadoraId) REFERENCES educadoras (id) ON DELETE CASCADE
      )
    `);

    // Tabela para registrar saídas
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS saidas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entradaId INTEGER NOT NULL,
        horaSaida TEXT NOT NULL,
        childId INTEGER,
        educadoraId INTEGER NOT NULL,
        dataSaida TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (childId) REFERENCES children (id) ON DELETE CASCADE,
        FOREIGN KEY (entradaId) REFERENCES entradas (id) ON DELETE CASCADE,
        FOREIGN KEY (educadoraId) REFERENCES educadoras (id) ON DELETE CASCADE
      )
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables: ', error);
    throw error;
  }
};

// Verificar estrutura do banco
export const verificarEstruturaBanco = async (): Promise<void> => {
  try {
    if (!database) {
      await openDB();
    }

    // Verificar se todas as tabelas existem
    const tables = ['educadoras', 'children', 'entradas', 'salinhas', 'saidas'];
    for (const table of tables) {
      const [result] = await database.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [table]
      );
      if (result.rows.length === 0) {
        console.log(`Tabela ${table} não existe, criando...`);
        await createTables();
        break;
      }
    }
  } catch (error) {
    console.error('Erro ao verificar estrutura do banco:', error);
    throw error;
  }
};

export const dropTables = async (): Promise<boolean> => {
  try {
    if (!database) {
      await openDB();
    }

    // Lista de todas as tabelas em ordem correta para deleção
    // considerando as dependências de chaves estrangeiras
    const tables = [
      'saidas',
      'entradas',
      'salinha_entries',
      'salinhas',
      'children',
      'educadoras'
    ];

    // Usa transaction para garantir que todas as tabelas sejam deletadas
    // ou nenhuma seja em caso de erro
    return new Promise((resolve, reject) => {
      database.transaction(
        (tx) => {
          // Desativa temporariamente as foreign keys para evitar erros
          tx.executeSql('PRAGMA foreign_keys = OFF;');

          // Drop cada tabela
          tables.forEach((table) => {
            tx.executeSql(
              `DROP TABLE IF EXISTS ${table};`,
              [],
              (_, result) => {
                console.log(`Tabela ${table} deletada com sucesso`);
              },
              (_, error) => {
                console.error(`Erro ao deletar tabela ${table}:`, error);
                return false;
              }
            );
          });

          // Reativa as foreign keys
          tx.executeSql('PRAGMA foreign_keys = ON;');
        },
        (error) => {
          console.error('Erro na transação:', error);
          reject(false);
        },
        () => {
          console.log('Todas as tabelas foram deletadas com sucesso');
          resolve(true);
        }
      );
    });

  } catch (error) {
    console.error('Erro ao deletar tabelas:', error);
    throw new Error(`Falha ao deletar tabelas: ${error}`);
  }
};

// ==================== EDUCADORAS ====================

// Cadastrar educadora
export const cadastrarEducadora = async (
  nome: string,
  tipo: 'educadora' | 'coordenadora',
  email?: string,
  senha?: string,
  igreja?: string,
  regiao?: string,
  bloco?: string
): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    // Verificar se email já existe (apenas se email foi fornecido)
    if (email) {
      const [emailCheck] = await database.executeSql(
        'SELECT id FROM educadoras WHERE email = ?',
        [email]
      );

      if (emailCheck.rows.length > 0) {
        return { success: false, error: 'Email já cadastrado' };
      }
    }

    // Inserir educadora
    const [result] = await database.executeSql(
      `INSERT INTO educadoras (nome, tipo, email, senha, igreja, regiao, bloco, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [nome, tipo, email || null, senha || null, igreja || null, regiao || null, bloco || null]
    );

    return {
      success: true,
      id: result.insertId
    };
  } catch (error) {
    console.error('Error cadastrando educadora: ', error);
    return {
      success: false,
      error: 'Erro ao cadastrar educadora'
    };
  }
};

// Obter todas as educadoras
export const getEducadoras = async (): Promise<EducadoraData[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      'SELECT * FROM educadoras ORDER BY nome ASC'
    );

    const educadoras: EducadoraData[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      educadoras.push(results.rows.item(i));
    }

    return educadoras;
  } catch (error) {
    console.error('Error getting educadoras: ', error);
    return [];
  }
};

// Remover educadora
export const removerEducadora = async (id: number): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    // Verificar se é coordenadora (não pode ser removida)
    const [checkResult] = await database.executeSql(
      'SELECT tipo FROM educadoras WHERE id = ?',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return { success: false, error: 'Educadora não encontrada' };
    }

    const educadora = checkResult.rows.item(0);
    if (educadora.tipo === 'coordenadora') {
      return { success: false, error: 'Coordenadoras não podem ser removidas' };
    }

    // Remover educadora
    await database.executeSql(
      'DELETE FROM educadoras WHERE id = ?',
      [id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error removing educadora: ', error);
    return { success: false, error: 'Erro ao remover educadora' };
  }
};

// Login de educadora
export const loginEducadora = async (email: string, senha: string): Promise<LoginResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      'SELECT * FROM educadoras WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (results.rows.length > 0) {
      const user = results.rows.item(0);
      return {
        success: true,
        user: user as EducadoraData
      };
    } else {
      return {
        success: false,
        error: 'Email ou senha incorretos'
      };
    }
  } catch (error) {
    console.error('Error during login: ', error);
    return {
      success: false,
      error: 'Erro ao fazer login'
    };
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    // Aqui você pode limpar dados de sessão se necessário
    console.log('Logout realizado com sucesso');
  } catch (error) {
    console.error('Erro durante logout:', error);
    throw error;
  }
};

// ==================== CRIANÇAS ====================

// Adicionar criança
export const addChild = async (childData: Omit<ChildData, 'id' | 'createdAt'>): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const [result] = await database.executeSql(
      `INSERT INTO children (nomeCrianca, idade, dataNascimento, responsavel, telefoneResponsavel, cpfResponsavel, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        childData.nomeCrianca,
        childData.idade,
        childData.dataNascimento,
        childData.responsavel,
        childData.telefoneResponsavel,
        childData.cpfResponsavel
      ]
    );

    return {
      success: true,
      id: result.insertId
    };
  } catch (error) {
    console.error('Error adding child: ', error);
    return {
      success: false,
      error: 'Erro ao cadastrar criança'
    };
  }
};

// Obter todas as crianças
export const getChildren = async (): Promise<ChildData[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      'SELECT * FROM children ORDER BY nomeCrianca ASC'
    );

    const children: ChildData[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      children.push(results.rows.item(i));
    }

    return children;
  } catch (error) {
    console.error('Error getting children: ', error);
    return [];
  }
};

// Obter criança por ID
export const getChildById = async (id: number): Promise<ChildData | null> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      'SELECT * FROM children WHERE id = ?',
      [id]
    );

    if (results.rows.length > 0) {
      return results.rows.item(0) as ChildData;
    }
    return null;
  } catch (error) {
    console.error('Error getting child by id: ', error);
    return null;
  }
};

// Remover criança
export const removeChild = async (childId: number): Promise<void> => {
  try {
    if (!database) {
      await openDB();
    }

    // Verificar se há entradas ativas para esta criança
    const [entradasAtivas] = await database.executeSql(
      'SELECT COUNT(*) as count FROM entradas WHERE childId = ? AND status = ?',
      [childId, 'ativo']
    );

    if (entradasAtivas.rows.item(0).count > 0) {
      throw new Error('Não é possível remover criança com entradas ativas');
    }

    // Remover criança
    await database.executeSql(
      'DELETE FROM children WHERE id = ?',
      [childId]
    );
  } catch (error) {
    console.error('Error removing child: ', error);
    throw error;
  }
};

// Obter histórico de uma criança
export const getHistoricoCrianca = async (childId: number): Promise<any[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      `SELECT 
        e.id,
        e.dataEntrada,
        e.horaEntrada,
        s.horaSaida,
        e.codigoColete,
        ed.nome as educadora,
        c.nomeCrianca
       FROM entradas e
       JOIN children c ON e.childId = c.id
       JOIN educadoras ed ON e.educadoraId = ed.id
       LEFT JOIN saidas s ON e.id = s.entradaId
       WHERE e.childId = ?
       ORDER BY e.dataEntrada DESC, e.horaEntrada DESC`,
      [childId]
    );

    const historico: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      historico.push(results.rows.item(i));
    }

    return historico;
  } catch (error) {
    console.error('Error getting historico criança: ', error);
    return [];
  }
};

// ==================== ENTRADAS ====================

// Registrar entrada
export const registrarEntrada = async (entradaData: Omit<EntradaData, 'id'>): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    // Verificar se a criança e educadora existem
    const [childCheck] = await database.executeSql(
      'SELECT id FROM children WHERE id = ?',
      [entradaData.childId]
    );

    if (childCheck.rows.length === 0) {
      return { success: false, error: 'Criança não encontrada' };
    }

    const [educadoraCheck] = await database.executeSql(
      'SELECT id FROM educadoras WHERE id = ?',
      [entradaData.educadoraId]
    );

    if (educadoraCheck.rows.length === 0) {
      return { success: false, error: 'Educadora não encontrada' };
    }

    // Inserir entrada
    const [result] = await database.executeSql(
      `INSERT INTO entradas (salinhaId, childId, educadoraId, codigoColete, dataEntrada, horaEntrada, observacoes, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entradaData.salinhaId,
        entradaData.childId,
        entradaData.educadoraId,
        entradaData.codigoColete,
        entradaData.dataEntrada,
        entradaData.horaEntrada,
        entradaData.observacoes || null,
        entradaData.status,
        entradaData.createdAt
      ]
    );

    return {
      success: true,
      id: result.insertId
    };
  } catch (error) {
    console.error('Error registering entrada: ', error);
    return {
      success: false,
      error: 'Erro ao registrar entrada'
    };
  }
};

// Obter entradas com parâmetros flexíveis
export const getEntradas = async (params: EntradaParams): Promise<EntradaCompleta[]> => {
  try {
    if (!database) {
      await openDB();
    }

    let query = `
      SELECT 
        e.id, e.childId, e.codigoColete, e.dataEntrada, e.horaEntrada, e.observacoes, e.status, e.educadoraId,
        c.nomeCrianca, c.responsavel, c.telefoneResponsavel,
        ed.nome as educadora,
        s.horaSaida
      FROM entradas e
      JOIN children c ON e.childId = c.id
      JOIN educadoras ed ON e.educadoraId = ed.id
      LEFT JOIN saidas s ON e.id = s.entradaId
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    if (params.data) {
      // Converter formato DD-MM-YYYY para YYYY-MM-DD
      const [dia, mes, ano] = params.data.split('-');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      query += ' AND e.dataEntrada = ?';
      queryParams.push(dataFormatada);
    }

    if (params.educadoraId) {
      query += ' AND e.educadoraId = ?';
      queryParams.push(params.educadoraId);
    }

    if (params.childId) {
      query += ' AND e.childId = ?';
      queryParams.push(params.childId);
    }

    query += ' ORDER BY e.dataEntrada DESC, e.horaEntrada DESC';

    const [results] = await database.executeSql(query, queryParams);

    console.log('Resultados da busca de entradas:', results);

    const entradas: EntradaCompleta[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      entradas.push(results.rows.item(i));
    }

    return entradas;
  } catch (error) {
    console.error('Error getting entradas: ', error);
    return [];
  }
};

// Obter entradas por período
export const getEntradasPorPeriodo = async (dataInicio: string, dataFim: string): Promise<any[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      `SELECT 
        e.id, e.codigoColete, e.dataEntrada, e.horaEntrada, e.observacoes, e.status,
        c.nomeCrianca, c.responsavel as nomeResponsavel, c.telefoneResponsavel,
        ed.nome as nomeEducadora,
        s.horaSaida
       FROM entradas e
       JOIN children c ON e.childId = c.id
       JOIN educadoras ed ON e.educadoraId = ed.id
       LEFT JOIN saidas s ON e.id = s.entradaId
       WHERE e.dataEntrada BETWEEN ? AND ?
       ORDER BY e.dataEntrada DESC, e.horaEntrada DESC`,
      [dataInicio, dataFim]
    );

    const entradas: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      entradas.push(results.rows.item(i));
    }

    return entradas;
  } catch (error) {
    console.error('Error getting entradas por período: ', error);
    return [];
  }
};

// Obter entradas do dia atual
export const getEntradasHoje = async (): Promise<any[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [results] = await database.executeSql(
      `SELECT 
        e.id, e.codigoColete, e.dataEntrada, e.horaEntrada, e.observacoes, e.status,
        c.nomeCrianca, c.responsavel as nomeResponsavel, c.telefoneResponsavel,
        ed.nome as nomeEducadora,
        s.horaSaida
       FROM entradas e
       JOIN children c ON e.childId = c.id
       JOIN educadoras ed ON e.educadoraId = ed.id
       LEFT JOIN saidas s ON e.id = s.entradaId
       WHERE e.dataEntrada = ? AND e.status = 'ativo'
       ORDER BY e.horaEntrada DESC`,
      [hoje]
    );

    const entradas: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      entradas.push(results.rows.item(i));
    }

    return entradas;
  } catch (error) {
    console.error('Error getting entradas hoje: ', error);
    return [];
  }
};

// Obter entradas ativas da salinha
export const getEntradasAtivasSalinha = async (data: string): Promise<CriancaEntrada[]> => {
  try {
    if (!database) {
      await openDB();
    }

    const [results] = await database.executeSql(
      `SELECT 
        e.id, e.childId, e.codigoColete, e.horaEntrada,
        c.nomeCrianca, c.responsavel,
        ed.nome as educadora
       FROM entradas e
       JOIN children c ON e.childId = c.id
       JOIN educadoras ed ON e.educadoraId = ed.id
       WHERE e.dataEntrada = ? AND e.status = 'ativo'
       AND NOT EXISTS (SELECT 1 FROM saidas s WHERE s.entradaId = e.id)
       ORDER BY e.horaEntrada ASC`,
      [data]
    );

    const entradas: CriancaEntrada[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const item = results.rows.item(i);
      entradas.push({
        id: item.id,
        childId: item.childId,
        nomeCrianca: item.nomeCrianca,
        codigoColete: item.codigoColete,
        responsavel: item.responsavel,
        educadora: item.educadora,
        horaEntrada: item.horaEntrada
      });
    }

    return entradas;
  } catch (error) {
    console.error('Error getting entradas ativas salinha: ', error);
    return [];
  }
};

// Registrar saída
export const registrarSaida = async (entradaId: number, educadoraId: number): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const agora = new Date();
    const horaSaida = agora.toTimeString().substring(0, 5); // HH:MM
    const dataSaida = agora.toISOString().split('T')[0]; // YYYY-MM-DD

    // Inserir registro de saída
    await database.executeSql(
      `INSERT INTO saidas (entradaId, horaSaida, educadoraId, dataSaida, createdAt) 
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [entradaId, horaSaida, educadoraId, dataSaida]
    );

    // Atualizar status da entrada para inativo
    await database.executeSql(
      'UPDATE entradas SET status = ? WHERE id = ?',
      ['inativo', entradaId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error registering saída: ', error);
    return {
      success: false,
      error: 'Erro ao registrar saída'
    };
  }
};

// Registrar saída de criança (usado na tela sala.tsx)
export const registrarSaidaCrianca = async (entradaId: number, horaSaida: string): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const dataSaida = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Obter educadora da entrada original
    const [entradaResult] = await database.executeSql(
      'SELECT educadoraId FROM entradas WHERE id = ?',
      [entradaId]
    );

    if (entradaResult.rows.length === 0) {
      return { success: false, error: 'Entrada não encontrada' };
    }

    const educadoraId = entradaResult.rows.item(0).educadoraId;

    // Inserir registro de saída
    await database.executeSql(
      `INSERT INTO saidas (entradaId, horaSaida, educadoraId, dataSaida, createdAt) 
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [entradaId, horaSaida, educadoraId, dataSaida]
    );

    // Atualizar status da entrada para inativo
    await database.executeSql(
      'UPDATE entradas SET status = ? WHERE id = ?',
      ['inativo', entradaId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error registering saída criança: ', error);
    return {
      success: false,
      error: 'Erro ao registrar saída'
    };
  }
};

// ==================== SALINHAS ====================

// // Registrar abertura de salinha
// export const registrarAberturaSalinha = async (params: AberturaSalinhaParams): Promise<OperationResult> => {
//   try {
//     if (!database) {
//       await openDB();
//     }

//     const exiteSalinhaAtiva = await getSalinhaAtiva(
//       params.educadoraId,
//       params.data
//     );
//     console.log("exiteSalinhaAtiva: ", exiteSalinhaAtiva?.educadoraId);

//     // Se já existe uma salinha ativa para a educadora, não permitir nova abertura
//     if (exiteSalinhaAtiva) {
//       return { success: true };
//     }

//     // Verificar se já existe uma salinha aberta hoje para esta educadora
//     // const [check] = await database.executeSql(
//     //   'SELECT id FROM salinhas WHERE educadoraId = ? AND dataAbertura = ? AND status = ?',
//     //   [params.educadoraId, params.data, 'aberta']
//     // );

//     // if (check.rows.length > 0) {
//     //   return { success: false, error: 'Já existe uma salinha aberta hoje para esta educadora' };
//     // }

//     // Inserir nova salinha
//     const [result] = await database.executeSql(
//       `INSERT INTO salinhas (educadoraId, dataAbertura, horaAbertura, observacoes, status, createdAt) 
//        VALUES (?, ?, ?, ?, 'aberta', datetime('now'))`,
//       [params.educadoraId, params.data, params.horaAbertura, params.observacoes || null]
//     );

//     return {
//       success: true,
//       id: result.insertId
//     };
//   } catch (error) {
//     console.error('Error registering abertura salinha: ', error);
//     return {
//       success: false,
//       error: 'Erro ao registrar abertura da salinha'
//     };
//   }
// };

// Registrar abertura de salinha
export const registrarAberturaSalinha = async (params: AberturaSalinhaParams): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    //Usar transaction para garantir atomicidade
    return await new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO salinhas (
            educadoraId, 
            dataAbertura, 
            horaAbertura, 
            observacoes, 
            status, 
            createdAt
          ) VALUES (?, ?, ?, ?, 'aberta', datetime('now'))`,
          [
            params.educadoraId,
            params.data,
            params.horaAbertura,
            params.observacoes || null
          ],
          (_, result) => {
            resolve({
              success: true,
              id: result.insertId,
            });
          },
          (_, error) => {
            console.error('Erro na transação:', error);
            reject({
              success: false,
              error: 'Erro ao registrar abertura da salinha'
            });
            return false;
          }
        );
      });
    });

  } catch (error) {
    console.error('Erro ao registrar abertura da salinha:', error);
    return {
      success: false,
      error: `Falha ao registrar abertura: ${error}`
    };
  }
};

// Abrir salinha (função original)
export const abrirSalinha = async (
  educadoraId: number,
  observacoes?: string
): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const agora = new Date();
    const dataAbertura = agora.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaAbertura = agora.toTimeString().substring(0, 5); // HH:MM

    return await registrarAberturaSalinha({
      data: dataAbertura,
      horaAbertura: horaAbertura,
      educadoraId: educadoraId,
      observacoes: observacoes || undefined
    });
  } catch (error) {
    console.error('Error opening salinha: ', error);
    return {
      success: false,
      error: 'Erro ao abrir salinha'
    };
  }
};

// Registrar fechamento de salinha
export const registrarFechamentoSalinha = async (salinhaId: number): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const agora = new Date();
    const horaFechamento = agora.toTimeString().substring(0, 5); // HH:MM

    // Update salinha status and closing time
    await database.executeSql(
      'UPDATE salinhas SET status = ?, horaFechamento = ? WHERE id = ?',
      ['fechada', horaFechamento, salinhaId]
    );

    const [salinhaResult] = await database.executeSql(
      'SELECT dataAbertura, educadoraId FROM salinhas WHERE id = ?',
      [salinhaId]
    );

    if (salinhaResult.rows.length > 0) {
      const salinha = salinhaResult.rows.item(0);
      const dataSalinha = salinha.dataAbertura;
      const educadoraSalinhaId = salinha.educadoraId;

      await database.executeSql(
        `UPDATE entradas SET status = ?
         WHERE dataEntrada = ? AND educadoraId = ? AND status = 'ativo'`,
        ['inativo', dataSalinha, educadoraSalinhaId]
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error registering fechamento salinha: ', error);
    return {
      success: false,
      error: 'Erro ao registrar fechamento da salinha'
    };
  }
};

export const getSalinhasPorDia = async (dia: string): Promise<OperationResult> => {
  try {
    if (!database) {
      await openDB();
    }

    const [salinhaResult] = await database.executeSql(
      "SELECT * FROM salinhas WHERE dataAbertura = ?",
      [dia]
    );

    if (salinhaResult.rows.length === 0) {
      return { success: false, error: 'Nenhuma salinha encontrada para este dia' };
    }

    return { success: true };

  } catch (error) {
    console.error("Error registering fechamento salinha: ", error);
    return {
      success: false,
      error: "Erro ao registrar fechamento da salinha",
    };
  }
};