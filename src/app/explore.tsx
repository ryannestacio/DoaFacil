import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const requirements = [
  'Tema social: doação de alimentos, roupas, móveis e outros itens.',
  'Navegação por abas com Expo Router.',
  'Persistência local com SQLite.',
  'CRUD completo: cadastrar, listar, editar e excluir doações.',
];

const flow = [
  'O usuário cadastra uma doação disponível.',
  'Os registros ficam salvos no banco local do aparelho.',
  'Cada item pode ser atualizado conforme a situação muda.',
  'Doações incorretas ou concluídas podem ser removidas.',
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Sobre o projeto</Text>
          <Text style={styles.title}>DoaFácil</Text>
          <Text style={styles.description}>
            Aplicativo React Native criado para ajudar comunidades a organizar itens que podem ser
            doados e acompanhar o status de cada doação.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requisitos atendidos</Text>
          {requirements.map((item) => (
            <View key={item} style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.rowText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fluxo de uso</Text>
          {flow.map((item, index) => (
            <View key={item} style={styles.row}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.rowText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: '#2F9E44',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#172033',
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    color: '#526071',
    fontSize: 16,
    lineHeight: 23,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 19,
    fontWeight: '800',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  bullet: {
    backgroundColor: '#2F9E44',
    borderRadius: 5,
    height: 10,
    marginTop: 6,
    width: 10,
  },
  rowText: {
    color: '#526071',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: '#E7F5EC',
    borderRadius: 8,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  stepText: {
    color: '#237A36',
    fontSize: 13,
    fontWeight: '800',
  },
});
