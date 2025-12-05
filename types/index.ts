
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  googleMapLink?: string;
  images?: string[];
  specializations: Specialization[];
  doctors?: Doctor[];
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  image?: string;
  specializations: Specialization[];
  yearsOfExperience: number;
  rating: number;
  reviewCount?: number;
  city: string;
  hospitals: Pick<Hospital, "id" | "name" | "city" | "address">[];
}

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
