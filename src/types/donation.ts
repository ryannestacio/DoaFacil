export type DonationStatus = 'Disponivel' | 'Reservado' | 'Entregue';

export type Donation = {
  id: number;
  title: string;
  category: string;
  quantity: string;
  neighborhood: string;
  contact: string;
  status: DonationStatus;
  createdAt: string;
};

export type DonationFormData = Omit<Donation, 'id' | 'createdAt'>;
