import { GitHubRepo } from '@/types/GitHub';
import axios from 'axios';
import apiClient from './apiClient';

/**
 * Serviço para buscar repositórios do GitHub
 * 
 * O QUE: Função que busca repositórios públicos do usuário JFMGDB via API do GitHub
 * POR QUÊ: Separa lógica de negócio da camada de apresentação, seguindo princípio Single Responsibility (SOLID)
 * ONDE: services/githubService.ts - Camada de serviço para integração com GitHub API
 * 
 * Critérios de aceitação API-01:
 * - Busca repositórios do usuário JFMGDB
 * - Ordena por updated (mais recentes primeiro)
 * - Trata erros 403 (Rate Limit), 404 (Usuário não encontrado) e de rede
 */

const GITHUB_USERNAME = process.env.EXPO_PUBLIC_GITHUB_USERNAME || 'JFMGDB';

/**
 * Busca repositórios públicos do usuário GitHub
 * 
 * @returns Promise com array de repositórios ordenados por data de atualização (mais recentes primeiro)
 * @throws Error com mensagem descritiva em caso de falha
 */
export const fetchGithubRepos = async (): Promise<GitHubRepo[]> => {
  try {
    const response = await apiClient.get<GitHubRepo[]>(`/users/${GITHUB_USERNAME}/repos`, {
      params: {
        type: 'all',
        sort: 'updated',
        direction: 'desc',
        per_page: 20,
      },
    });

    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new Error('Um erro inesperado ocorreu ao buscar os repositórios.');
    }

    if (error.response) {
      const { status } = error.response;
      
      if (status === 403) {
        throw new Error('Limite de requisições da API do GitHub atingido. Tente novamente mais tarde.');
      }
      
      if (status === 404) {
        throw new Error(`Erro: Usuário do GitHub "${GITHUB_USERNAME}" não encontrado.`);
      }
      
      throw new Error(`Erro ao buscar repositórios: ${status}`);
    }

    if (error.request) {
      throw new Error('Não foi possível conectar ao GitHub. Verifique sua rede e tente novamente.');
    }

    throw new Error('Um erro inesperado ocorreu ao buscar os repositórios.');
  }
};

