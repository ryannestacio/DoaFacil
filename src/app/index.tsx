import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createDonation,
  deleteDonation,
  listDonations,
  updateDonation,
} from '@/database/donations';
import type { Donation, DonationFormData, DonationStatus } from '@/types/donation';

const emptyForm: DonationFormData = {
  title: '',
  category: '',
  quantity: '',
  neighborhood: '',
  contact: '',
  status: 'Disponivel',
};

const statusOptions: DonationStatus[] = ['Disponivel', 'Reservado', 'Entregue'];

const statusLabelMap: Record<DonationStatus, string> = {
  Disponivel: 'Disponível',
  Reservado: 'Reservado',
  Entregue: 'Entregue',
};

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [form, setForm] = useState<DonationFormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const completedCount = useMemo(
    () => donations.filter((donation) => donation.status === 'Entregue').length,
    [donations]
  );

  const loadDonations = useCallback(async () => {
    const savedDonations = await listDonations(db);
    setDonations(savedDonations);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadDonations();
    }, 0);

    return () => clearTimeout(timeout);
  }, [loadDonations]);

  function updateFormValue(field: keyof DonationFormData, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function validateForm() {
    return (
      form.title.trim() &&
      form.category.trim() &&
      form.neighborhood.trim() &&
      form.contact.trim()
    );
  }

  async function handleSubmit() {
    if (!validateForm()) {
      Alert.alert('Campos obrigatórios', 'Preencha item, categoria, bairro e contato.');
      return;
    }

    setSaving(true);
    const cleanForm = {
      ...form,
      title: form.title.trim(),
      category: form.category.trim(),
      quantity: form.quantity.trim() || '1 unidade',
      neighborhood: form.neighborhood.trim(),
      contact: form.contact.trim(),
    };

    if (editingId) {
      await updateDonation(db, editingId, cleanForm);
    } else {
      await createDonation(db, cleanForm);
    }

    await loadDonations();
    resetForm();
    setSaving(false);
  }

  function handleEdit(donation: Donation) {
    setEditingId(donation.id);
    setForm({
      title: donation.title,
      category: donation.category,
      quantity: donation.quantity,
      neighborhood: donation.neighborhood,
      contact: donation.contact,
      status: donation.status,
    });
  }

  async function handleDelete(id: number) {
    await deleteDonation(db, id);
    await loadDonations();
    if (editingId === id) {
      resetForm();
    }
  }

  async function handleTakeDonation(donation: Donation) {
    await updateDonation(db, donation.id, {
      title: donation.title,
      category: donation.category,
      quantity: donation.quantity,
      neighborhood: donation.neighborhood,
      contact: donation.contact,
      status: 'Entregue',
    });
    await loadDonations();
    if (editingId === donation.id) {
      resetForm();
    }
  }

  function renderDonation({ item }: { item: Donation }) {
    const isTaken = item.status === 'Entregue';

    return (
      <View style={[styles.card, isTaken && styles.cardUnavailable]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <View style={[styles.statusDot, statusStyleMap[item.status]]} />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusLabelMap[item.status]}</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.detailText}>Quantidade: {item.quantity}</Text>
          <Text style={styles.detailText}>Bairro: {item.neighborhood}</Text>
          <Text style={styles.detailText}>Contato: {item.contact}</Text>
        </View>

        <View style={styles.cardActions}>
          {isTaken ? (
            <View style={styles.unavailableButton}>
              <Text style={styles.unavailableButtonText}>Item já foi pego</Text>
            </View>
          ) : (
            <>
              <Pressable style={styles.primarySmallButton} onPress={() => handleTakeDonation(item)}>
                <Text style={styles.primarySmallButtonText}>Pegar item</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => handleEdit(item)}>
                <Text style={styles.secondaryButtonText}>Editar</Text>
              </Pressable>
              <Pressable style={styles.dangerButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.dangerButtonText}>Excluir</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <FlatList
          data={donations}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDonation}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Impacto social</Text>
                <Text style={styles.title}>DoaFácil</Text>
                <Text style={styles.description}>
                  Cadastre alimentos, roupas, móveis e outros itens para conectar doadores a
                  pessoas que precisam de apoio.
                </Text>
              </View>

              <View style={styles.metrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricNumber}>{donations.length}</Text>
                  <Text style={styles.metricLabel}>doações</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricNumber}>{completedCount}</Text>
                  <Text style={styles.metricLabel}>entregues</Text>
                </View>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingId ? 'Editar doação' : 'Nova doação'}</Text>
                <TextInput
                  placeholder="Item para doar"
                  placeholderTextColor="#7C8698"
                  style={styles.input}
                  value={form.title}
                  onChangeText={(value) => updateFormValue('title', value)}
                />
                <View style={styles.row}>
                  <TextInput
                    placeholder="Categoria"
                    placeholderTextColor="#7C8698"
                    style={[styles.input, styles.rowInput]}
                    value={form.category}
                    onChangeText={(value) => updateFormValue('category', value)}
                  />
                  <TextInput
                    placeholder="Quantidade"
                    placeholderTextColor="#7C8698"
                    style={[styles.input, styles.rowInput]}
                    value={form.quantity}
                    onChangeText={(value) => updateFormValue('quantity', value)}
                  />
                </View>
                <TextInput
                  placeholder="Bairro ou região"
                  placeholderTextColor="#7C8698"
                  style={styles.input}
                  value={form.neighborhood}
                  onChangeText={(value) => updateFormValue('neighborhood', value)}
                />
                <TextInput
                  placeholder="Contato do doador"
                  placeholderTextColor="#7C8698"
                  style={styles.input}
                  value={form.contact}
                  onChangeText={(value) => updateFormValue('contact', value)}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusList}>
                  {statusOptions.map((status) => (
                    <Pressable
                      key={status}
                      style={[styles.statusOption, form.status === status && styles.statusOptionActive]}
                      onPress={() => updateFormValue('status', status)}>
                      <Text
                        style={[
                          styles.statusOptionText,
                          form.status === status && styles.statusOptionTextActive,
                        ]}>
                        {statusLabelMap[status]}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <View style={styles.formActions}>
                  {editingId ? (
                    <Pressable style={styles.secondaryButton} onPress={resetForm}>
                      <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </Pressable>
                  ) : null}
                  <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={saving}>
                    <Text style={styles.primaryButtonText}>
                      {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar doação'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                {loading ? 'Carregando doações...' : 'Doações cadastradas'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhuma doação cadastrada</Text>
                <Text style={styles.emptyText}>
                  Use o formulário acima para registrar o primeiro item disponível na comunidade.
                </Text>
              </View>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const statusStyleMap = StyleSheet.create({
  Disponivel: {
    backgroundColor: '#2F9E44',
  },
  Reservado: {
    backgroundColor: '#F08C00',
  },
  Entregue: {
    backgroundColor: '#4263EB',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 14,
  },
  header: {
    gap: 16,
  },
  hero: {
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
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    color: '#526071',
    fontSize: 16,
    lineHeight: 23,
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  metricNumber: {
    color: '#172033',
    fontSize: 26,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#697386',
    fontSize: 13,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  formTitle: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    color: '#172033',
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  statusList: {
    gap: 8,
    paddingVertical: 2,
  },
  statusOption: {
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statusOptionActive: {
    backgroundColor: '#E7F5EC',
    borderColor: '#2F9E44',
  },
  statusOptionText: {
    color: '#526071',
    fontSize: 14,
    fontWeight: '700',
  },
  statusOptionTextActive: {
    color: '#237A36',
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2F9E44',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  primarySmallButton: {
    alignItems: 'center',
    backgroundColor: '#2F9E44',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  primarySmallButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#EEF2F7',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
  },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  dangerButtonText: {
    color: '#BE123C',
    fontSize: 14,
    fontWeight: '800',
  },
  unavailableButton: {
    alignItems: 'center',
    backgroundColor: '#EEF2F7',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  unavailableButtonText: {
    color: '#526071',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  cardUnavailable: {
    opacity: 0.45,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTitleGroup: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  statusDot: {
    borderRadius: 6,
    height: 12,
    marginTop: 6,
    width: 12,
  },
  cardTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#697386',
    fontSize: 14,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  cardDetails: {
    gap: 4,
  },
  detailText: {
    color: '#526071',
    fontSize: 14,
  },
  cardActions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5EF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: '#697386',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
