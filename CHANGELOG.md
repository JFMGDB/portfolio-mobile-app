# Changelog

Todas as mudanças relevantes nesse projeto serão documentadas nesse arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [Epic: Infraestrutura (INFRA)]

#### Added

- **Task: INF-01 - Configurar projeto Expo (SDK 54) com TypeScript**
  - Adicionada dependência `@react-native-async-storage/async-storage@1.23.1` para persistência local de dados
  - Adicionada dependência `react-native-paper@^5.12.3` para biblioteca de UI Material Design
  - Verificado alinhamento do `package.json` com Expo SDK 54 (React 19.1.0, React Native 0.81.5)
  - Confirmado `tsconfig.json` com modo strict habilitado e aliases de caminho configurados

- **Task: INF-02 - Configurar Navegação (Expo Router)**
  - Adicionado `sdkVersion: "54.0.0"` no `app.json` para compatibilidade com Expo Go
  - Configurado `runtimeVersion` com política `"sdkVersion"` para suporte ao EAS Update
  - Verificado plugin `expo-router` configurado corretamente
  - Confirmado `typedRoutes` habilitado em `experiments` para verificação estática de tipos
  - Estrutura de pastas `app/(tabs)` e `app/_layout.tsx` já existente e funcional

### [Epic: UI e Conteúdo (UI)]

#### Added

- **Task: UI-01 - Implementar Dados Estáticos e Telas**
  - Criado arquivo `types/Profile.ts` com interfaces TypeScript para Profile, Education, Experience e Link
  - Criado arquivo `types/GitHub.ts` com interface GitHubRepo para tipagem dos dados da API
  - Criado arquivo `data/seed.ts` com dados estáticos:
    - `PROFILE_DATA`: informações do perfil (nome, headline, bio, links)
    - `EDUCATION_DATA`: array com dados de educação
    - `EXPERIENCE_DATA`: array com dados de experiência profissional
  - Implementada tela `app/(tabs)/index.tsx` (Perfil):
    - Renderiza `PROFILE_DATA` com Avatar, Cards e botões de links
    - Integração com `Linking.openURL` para abrir links externos
    - Otimizada com `useCallback` para handlers
  - Implementada tela `app/(tabs)/experience.tsx` (Carreira):
    - Renderiza `EDUCATION_DATA` e `EXPERIENCE_DATA` usando `List.Accordion` do React Native Paper
    - Cada accordion controlado independentemente com estado local
    - Tipos explícitos para parâmetros do map (Education, Experience)
    - Otimizada com `useCallback` para handlers

- **Task: UI-02 - Criar Componente RepoCard**
  - Criado componente `components/RepoCard.tsx`:
    - Exibe informações de repositório GitHub (nome, descrição, linguagem, stars, forks)
    - Trata homepage nula com renderização condicional
    - Usa `Linking.openURL` para abrir links externos (GitHub e homepage)
    - Otimizado com `React.memo` para evitar re-renders desnecessários
    - Handlers otimizados com `useCallback`
    - Estilos dinâmicos memoizados com `useMemo`
    - DisplayName configurado para melhor debugging

- **Task: UI-03 - Criar UI da Tela de Projetos**
  - Implementada tela `app/(tabs)/projects.tsx`:
    - Estados visuais implementados:
      - Loading: ActivityIndicator com mensagem "Buscando projetos..."
      - Erro: mensagem de erro com botão "Tentar Novamente"
      - Lista vazia: mensagem informativa quando não há repositórios
      - Sucesso: FlatList renderizando RepoCard para cada repositório
    - Implementado RefreshControl (Pull-to-refresh) com integração ao tema
    - Otimizações de performance:
      - `useCallback` para funções (loadRepositories, handleRefresh, keyExtractor, renderItem)
      - `useMemo` para estilos dinâmicos e renderContent
      - `useRef` para gerenciar timeout com cleanup adequado
      - Cleanup de timeout no useEffect para evitar memory leaks
    - Estrutura preparada para integração com hook `useCachedGithubRepos` (ÉPICO 3)

### [Epic: Integração GitHub (API)]

#### Added

- **Task: API-01 - Criar Serviço Axios para GitHub (RF-01)**
  - Criado arquivo `services/apiClient.ts`:
    - Instância centralizada do Axios configurada com baseURL `https://api.github.com`
    - Timeout de 10 segundos configurado para evitar requisições infinitas
    - Headers apropriados para API do GitHub (`Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`)
    - Segue princípio DRY centralizando configuração HTTP
  - Criado arquivo `services/githubService.ts`:
    - Função `fetchGithubRepos()` implementada para buscar repositórios públicos do usuário
    - Username configurável via `EXPO_PUBLIC_GITHUB_USERNAME` (padrão: 'JFMGDB')
    - Parâmetros de busca configurados:
      - `type: 'all'` (inclui forks e originais)
      - `sort: 'updated'` (ordena por data de atualização)
      - `direction: 'desc'` (mais recentes primeiro)
      - `per_page: 20` (limita a 20 projetos)
    - Tratamento robusto de erros:
      - Erro 403 (Rate Limit): mensagem específica sobre limite de requisições
      - Erro 404 (Usuário não encontrado): mensagem com nome do usuário
      - Erros de rede/timeout: mensagem sobre verificação de conexão
      - Erros inesperados: mensagem genérica apropriada
    - Separação de responsabilidades seguindo princípio SOLID (Single Responsibility)
    - Código otimizado com early returns para melhor legibilidade

- **Task: API-02 - Implementar Cache Offline (RF-02)**
  - Criado hook `hooks/useCachedGithubRepos.ts`:
    - Implementa estratégia stale-while-revalidate para cache offline
    - Exibe dados do cache imediatamente (se existirem) enquanto busca dados frescos em background
    - Cache persistido no AsyncStorage com timestamp para controle de expiração
    - Tempo de expiração configurado para 1 hora (`CACHE_EXPIRATION_MS`)
    - Chave de cache versionada: `@github_repos_cache_v1`
    - Interface `CacheData` para tipagem do cache (timestamp + repos)
    - Interface `UseCachedReposState` para tipagem do retorno do hook
    - Estados gerenciados:
      - `data`: array de repositórios (GitHubRepo[])
      - `isLoading`: estado de carregamento inicial
      - `error`: mensagem de erro (string | null)
      - `refresh`: função para forçar atualização dos dados
    - Lógica de cache inteligente:
      - Se cache válido e não for refresh: não busca na rede
      - Se cache inválido ou for refresh: busca na rede e atualiza cache
      - Se busca falhar mas houver cache: não exibe erro (graceful degradation)
      - Se busca falhar e não houver cache: exibe erro apropriado
    - Otimizações de performance:
      - `useCallback` para `loadData` e `refresh` evitando recriações
      - `useRef` para rastrear se há dados disponíveis sem causar re-renders
      - `useEffect` com dependências corretas para carregamento inicial
  - Atualizada tela `app/(tabs)/projects.tsx`:
    - Integração completa com hook `useCachedGithubRepos`
    - Substituída lógica mock temporária pela implementação real
    - Pull-to-refresh integrado com função `refresh` do hook
    - Estados de loading, erro e lista vazia funcionando com dados reais
    - Otimização de estilos: `errorTextStyle` usando objeto em vez de array
    - Mantidas todas as otimizações de performance existentes

#### Changed

- **Otimização do Tratamento de Erros**
  - Refatorado tratamento de erros em `services/githubService.ts`:
    - Simplificado com early returns para melhor legibilidade
    - Extração de `status` para evitar repetição de `error.response.status`
    - Fluxo mais linear e fácil de manter

---

### [Epic: UI e Conteúdo (UI)]

#### Changed

- **Configuração do PaperProvider**
  - Adicionado `PaperProvider` no `app/_layout.tsx` (Root Layout)
  - Temas light e dark configurados com `MD3LightTheme` e `MD3DarkTheme`
  - Temas memoizados com `useMemo` para evitar recriações desnecessárias
  - Integração com sistema de cores existente

- **Layout das Tabs**
  - Atualizado `app/(tabs)/_layout.tsx`:
    - Configuradas 4 tabs: Perfil, Carreira, Projetos e Configurações
    - Ícones MaterialCommunityIcons conforme especificação do PRD
    - Integração com tema do React Native Paper
    - Headers habilitados com títulos apropriados

#### Added (Funcionalidade Extra)

- **Tela de Configurações**
  - Implementada tela `app/(tabs)/settings.tsx`:
    - Toggle de modo escuro com Switch
    - RadioButton.Group para seleção de tema (Light, Dark, System)
    - Sincronização automática entre themeMode e isDarkMode
    - Handlers otimizados com `useCallback`
    - Estilos memoizados com `useMemo`
    - Validação de tipos para compatibilidade com RadioButton.Group

---

## [0.1.0] - YYYY-MM-DD

### [Epic: Implementação Inicial]

#### Added

- **Task: Configuração do Projeto**
  - Estrutura inicial do projeto
  - Configuração de dependências
  - Setup do ambiente de desenvolvimento

- **Task: Autenticação Básica**
  - Sistema de login com JWT
  - Middleware de autenticação
  - Proteção de rotas privadas
