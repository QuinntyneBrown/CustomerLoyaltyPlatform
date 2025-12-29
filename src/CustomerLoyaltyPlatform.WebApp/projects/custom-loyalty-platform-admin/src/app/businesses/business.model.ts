export interface Business {
  businessId: string;
  tenantId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  address: Address;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  registeredAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface RegisterBusinessRequest {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  address: Address;
}

export interface UpdateBusinessRequest {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: Address;
}
