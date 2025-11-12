import { RepoCard } from '@/components/RepoCard';
import { useCachedGithubRepos } from '@/hooks/useCachedGithubRepos';
import { GitHubRepo } from '@/types/GitHub';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

/**
 * Tela de Projetos - Exibe lista de repositórios do GitHub
 * 
 * O QUE: Tela que exibe repositórios do GitHub usando hook com cache
 * POR QUÊ: Integra com API do GitHub e oferece experiência offline-first
 * ONDE: app/(tabs)/projects.tsx - Tela principal de projetos
 * 
 * Critérios de aceitação UI-03:
 * - Deve ter estados visuais para loading, erro e lista vazia
 * - A lista de sucesso renderiza uma FlatList de RepoCard
 * - Implementa RefreshControl (Pull-to-refresh)
 * 
 * Critérios de aceitação API-02:
 * - Consome hook useCachedGithubRepos para buscar e cachear dados
 */
export default function ProjectsScreen() {
  const theme = useTheme();
  const { data, isLoading, error, refresh } = useCachedGithubRepos();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Manipula o refresh manual (pull-to-refresh)
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  // Estilos dinâmicos baseados no tema
  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background]
  );
  const centerContainerStyle = useMemo(
    () => [styles.centerContainer, { backgroundColor: theme.colors.background }],
    [theme.colors.background]
  );
  const errorTextStyle = useMemo(
    () => ({ ...styles.errorMessage, color: theme.colors.error }),
    [theme.colors.error]
  );

  /**
   * Extrai a chave única de cada item da lista
   */
  const keyExtractor = useCallback((item: GitHubRepo) => item.id.toString(), []);

  /**
   * Renderiza cada item da lista
   */
  const renderItem = useCallback(({ item }: { item: GitHubRepo }) => <RepoCard item={item} />, []);

  /**
   * Renderiza o conteúdo baseado no estado atual (loading, erro, vazio ou sucesso)
   */
  const renderContent = useMemo(() => {
    // Estado de carregamento inicial
    if (isLoading && data.length === 0) {
      return (
        <View style={centerContainerStyle}>
          <ActivityIndicator animating={true} size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Buscando projetos...
          </Text>
        </View>
      );
    }

    // Estado de erro (sem dados em cache)
    if (error && data.length === 0) {
      return (
        <View style={centerContainerStyle}>
          <Text variant="titleMedium" style={styles.errorTitle}>
            Erro ao Carregar Projetos
          </Text>
          <Text variant="bodyMedium" style={errorTextStyle}>
            {error}
          </Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            Tentar Novamente
          </Button>
        </View>
      );
    }

    // Estado de lista vazia
    if (!isLoading && data.length === 0) {
      return (
        <View style={centerContainerStyle}>
          <Text variant="titleMedium" style={styles.emptyTitle}>
            Nenhum Projeto Encontrado
          </Text>
          <Text variant="bodyMedium" style={styles.emptyMessage}>
            Nenhum repositório público foi encontrado na conta {process.env.EXPO_PUBLIC_GITHUB_USERNAME || 'JFMGDB'}.
          </Text>
        </View>
      );
    }

    // Estado de sucesso - lista de repositórios
    return (
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />
        }
      />
    );
  }, [isLoading, data, error, isRefreshing, centerContainerStyle, errorTextStyle, handleRefresh, keyExtractor, renderItem, theme.colors.primary]);

  return <View style={containerStyle}>{renderContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    marginTop: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

