import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GitHubRepo } from '@/types/GitHub';
import { fetchGithubRepos } from '@/services/githubService';

/**
 * Hook customizado para buscar repositórios do GitHub com cache offline
 * 
 * O QUE: Hook que implementa estratégia stale-while-revalidate para cache de repositórios
 * POR QUÊ: Melhora UX exibindo dados em cache imediatamente enquanto busca dados frescos em background
 * ONDE: hooks/useCachedGithubRepos.ts - Hook reutilizável para gerenciar estado e cache de repositórios
 * 
 * Critérios de aceitação API-02:
 * - Implementa lógica stale-while-revalidate
 * - Usa AsyncStorage para persistência com timestamp
 * - Expõe estado de loading, erro e função refresh
 */

const CACHE_KEY = '@github_repos_cache_v1';
const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 hora

interface CacheData {
  timestamp: number;
  repos: GitHubRepo[];
}

interface UseCachedReposState {
  data: GitHubRepo[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook que busca repositórios do GitHub com cache offline
 * 
 * Estratégia stale-while-revalidate:
 * 1. Exibe dados do cache imediatamente (se existirem)
 * 2. Busca dados frescos em background
 * 3. Atualiza cache e UI quando novos dados chegarem
 * 
 * @returns Estado com dados, loading, erro e função refresh
 */
export const useCachedGithubRepos = (): UseCachedReposState => {
  const [data, setData] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasDataRef = useRef(false);

  /**
   * Carrega dados do cache e/ou da API
   * 
   * @param isRefreshing - Se true, força busca na API mesmo com cache válido
   */
  const loadData = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) {
      setIsLoading(true);
    }

    let cacheIsValid = false;
    let cachedRepos: GitHubRepo[] = [];

    // 1. (Stale) Tenta carregar dados do cache
    try {
      const cachedJSON = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedJSON) {
        const cachedData: CacheData = JSON.parse(cachedJSON);
        const now = Date.now();

        cachedRepos = cachedData.repos;
        hasDataRef.current = cachedRepos.length > 0;

        // Exibe os dados do cache imediatamente
        setData(cachedRepos);

        // Verifica se o cache ainda é válido
        if (now - cachedData.timestamp < CACHE_EXPIRATION_MS) {
          cacheIsValid = true;
        }
      }
    } catch (error) {
      console.warn('Erro ao ler cache do AsyncStorage:', error);
    }

    // 2. (Revalidate) Se o cache for inválido ou for um refresh, busca na rede
    if (!cacheIsValid || isRefreshing) {
      try {
        const freshData = await fetchGithubRepos();

        // 3. Atualiza o estado e o cache
        setData(freshData);
        setError(null);
        hasDataRef.current = freshData.length > 0;

        const newCacheData: CacheData = {
          timestamp: Date.now(),
          repos: freshData,
        };

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newCacheData));
      } catch (error: unknown) {
        // Se a busca falhar, mas tivermos dados do cache, não mostramos erro
        // Apenas mostramos erro se não tivermos NADA para mostrar
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados.';
        
        if (!hasDataRef.current) {
          setError(errorMessage);
        }
        console.error('Falha ao buscar dados novos:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Carrega dados na montagem do componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Função para forçar refresh dos dados
   */
  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  return { data, isLoading, error, refresh };
};

