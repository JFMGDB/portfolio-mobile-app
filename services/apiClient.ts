import axios from 'axios';

/**
 * Cliente HTTP centralizado para requisições à API do GitHub
 * 
 * O QUE: Instância configurada do Axios com baseURL, timeout e headers padrão
 * POR QUÊ: Centraliza configuração HTTP, seguindo princípio DRY e facilitando manutenção
 * ONDE: services/apiClient.ts - Base para todos os serviços HTTP do app
 * 
 * Critérios de aceitação API-01:
 * - Instância do Axios criada com configuração base
 * - Headers apropriados para API do GitHub
 * - Timeout configurado para evitar requisições infinitas
 */
const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

export default apiClient;

