import type { SQLiteDatabase } from 'expo-sqlite';

import type { Donation, DonationFormData, DonationStatus } from '@/types/donation';

type DonationRow = {
  id: number;
  title: string;
  category: string;
  quantity: string;
  neighborhood: string;
  contact: string;
  status: DonationStatus;
  created_at: string;
};

function mapDonation(row: DonationRow): Donation {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    quantity: row.quantity,
    neighborhood: row.neighborhood,
    contact: row.contact,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function migrateDonationsDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      contact TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Disponivel',
      created_at TEXT NOT NULL
    );
  `);
}

export async function listDonations(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<DonationRow>(
    'SELECT * FROM donations ORDER BY datetime(created_at) DESC, id DESC'
  );

  return rows.map(mapDonation);
}

export async function createDonation(db: SQLiteDatabase, donation: DonationFormData) {
  await db.runAsync(
    `INSERT INTO donations
      (title, category, quantity, neighborhood, contact, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    donation.title,
    donation.category,
    donation.quantity,
    donation.neighborhood,
    donation.contact,
    donation.status,
    new Date().toISOString()
  );
}

export async function updateDonation(
  db: SQLiteDatabase,
  id: number,
  donation: DonationFormData
) {
  await db.runAsync(
    `UPDATE donations
      SET title = ?, category = ?, quantity = ?, neighborhood = ?, contact = ?, status = ?
      WHERE id = ?`,
    donation.title,
    donation.category,
    donation.quantity,
    donation.neighborhood,
    donation.contact,
    donation.status,
    id
  );
}

export async function deleteDonation(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM donations WHERE id = ?', id);
}
