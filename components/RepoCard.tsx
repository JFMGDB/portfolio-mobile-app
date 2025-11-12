import React, { useCallback, useMemo } from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GitHubRepo } from '@/types/GitHub';

interface RepoCardProps {
  item: GitHubRepo;
}

/**
 * Componente RepoCard - Exibe informações de um repositório GitHub
 * 
 * Critérios de aceitação UI-02:
 * - Exibe nome, descrição, linguagem, stars e forks
 * - Trata homepage nula (renderiza condicionalmente)
 * - Usa Linking.openURL para abrir links externos
 */
export const RepoCard: React.FC<RepoCardProps> = React.memo(({ item }) => {
  const theme = useTheme();

  /**
   * Abre o repositório no GitHub
   */
  const handleOpenRepo = useCallback(() => {
    Linking.openURL(item.html_url);
  }, [item.html_url]);

  /**
   * Abre a homepage do projeto (se existir)
   */
  const handleOpenHomepage = useCallback(() => {
    if (item.homepage) {
      Linking.openURL(item.homepage);
    }
  }, [item.homepage]);

  // Estilos dinâmicos baseados no tema
  const textColor = useMemo(() => ({ color: theme.colors.onSurfaceVariant }), [theme.colors.onSurfaceVariant]);

  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        titleVariant="titleMedium"
        right={(props) =>
          item.homepage ? (
            <IconButton {...props} icon="web" onPress={handleOpenHomepage} />
          ) : null
        }
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.description}>
          {item.description || 'Sem descrição.'}
        </Text>
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={textColor}>
            {item.language || 'N/A'}
          </Text>
          <View style={styles.stats}>
            <MaterialCommunityIcons
              name="star-outline"
              size={16}
              color={theme.colors.onSurfaceVariant}
              style={styles.icon}
            />
            <Text variant="bodySmall" style={[styles.statText, textColor]}>
              {item.stargazers_count}
            </Text>
            <MaterialCommunityIcons
              name="source-fork"
              size={16}
              color={theme.colors.onSurfaceVariant}
              style={styles.icon}
            />
            <Text variant="bodySmall" style={textColor}>
              {item.forks_count}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleOpenRepo}>Ver no GitHub</Button>
      </Card.Actions>
    </Card>
  );
});

RepoCard.displayName = 'RepoCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  description: {
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  statText: {
    marginRight: 16,
  },
});

