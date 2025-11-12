import { EDUCATION_DATA, EXPERIENCE_DATA } from '@/data/seed';
import { Education, Experience } from '@/types/Profile';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';

/**
 * Tela de Experiência - Renderiza dados de educação e experiência profissional
 * 
 * Critérios de aceitação UI-01:
 * - Tela (tabs)/experience.tsx renderiza EDUCATION_DATA e EXPERIENCE_DATA
 * - Utiliza List.Accordion do React Native Paper
 */
export default function ExperienceScreen() {
  const theme = useTheme();
  
  // Estado para controlar quais accordions estão expandidos
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  /**
   * Alterna o estado de expansão de um accordion específico
   */
  const handleToggle = useCallback((key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}>
      <List.Section>
        <List.Subheader>Educação</List.Subheader>
        {EDUCATION_DATA.map((education: Education, index: number) => {
          const key = `education-${index}`;
          return (
            <List.Accordion
              key={key}
              title={education.institution}
              left={(props) => <List.Icon {...props} icon="school" />}
              expanded={expandedItems[key] ?? true}
              onPress={() => handleToggle(key)}>
              <List.Item
                title={education.degree}
                description={education.period}
                titleNumberOfLines={2}
                descriptionNumberOfLines={1}
              />
              <List.Item
                title={education.description}
                titleNumberOfLines={4}
                style={styles.descriptionItem}
              />
            </List.Accordion>
          );
        })}
      </List.Section>

      <List.Section>
        <List.Subheader>Experiência Profissional</List.Subheader>
        {EXPERIENCE_DATA.map((experience: Experience, index: number) => {
          const key = `experience-${index}`;
          return (
            <List.Accordion
              key={key}
              title={experience.company}
              left={(props) => <List.Icon {...props} icon="briefcase" />}
              expanded={expandedItems[key] ?? true}
              onPress={() => handleToggle(key)}>
              <List.Item
                title={experience.role}
                description={experience.period}
                titleNumberOfLines={2}
                descriptionNumberOfLines={1}
              />
              <List.Item
                title={experience.description}
                titleNumberOfLines={4}
                style={styles.descriptionItem}
              />
            </List.Accordion>
          );
        })}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  descriptionItem: {
    paddingLeft: 16,
  },
});

