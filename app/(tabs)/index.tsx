import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Card, Text, Avatar, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PROFILE_DATA } from '@/data/seed';

/**
 * Tela de Perfil - Renderiza os dados estáticos do perfil
 * 
 * Critérios de aceitação UI-01:
 * - Tela (tabs)/index.tsx renderiza PROFILE_DATA
 */
export default function ProfileScreen() {
  const theme = useTheme();

  /**
   * Abre o link externo no navegador
   */
  const handleLinkPress = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={PROFILE_DATA.name.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineMedium" style={styles.name}>
            {PROFILE_DATA.name}
          </Text>
          <Text variant="titleMedium" style={[styles.headline, { color: theme.colors.onSurfaceVariant }]}>
            {PROFILE_DATA.headline}
          </Text>
          <Text variant="bodyMedium" style={styles.bio}>
            {PROFILE_DATA.bio}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.linksCard}>
        <Card.Title title="Links" />
        <Card.Content>
          {PROFILE_DATA.links.map((link) => (
            <Button
              key={link.url}
              mode="outlined"
              icon={() => <MaterialCommunityIcons name={link.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={20} />}
              onPress={() => handleLinkPress(link.url)}
              style={styles.linkButton}>
              {link.name}
            </Button>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 8,
    textAlign: 'center',
  },
  headline: {
    marginBottom: 16,
    textAlign: 'center',
  },
  bio: {
    textAlign: 'center',
    lineHeight: 24,
  },
  linksCard: {
    marginBottom: 16,
  },
  linkButton: {
    marginBottom: 8,
  },
});
