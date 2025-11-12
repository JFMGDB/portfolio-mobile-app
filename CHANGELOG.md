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
