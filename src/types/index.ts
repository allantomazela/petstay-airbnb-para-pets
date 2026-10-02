export type UserRole = 'tutor' | 'host' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  bio: string
  phone: string
  isHostVerified?: boolean
  isSuperHost?: boolean
  rating?: number
  reviewsCount?: number
  joinedDate: string
}

export type PetSpecies = 'cachorro' | 'gato' | 'outro'
export type PetSize = 'Pequeno' | 'Médio' | 'Grande'
export type EnergyLevel = 'Baixo' | 'Médio' | 'Alto'

export interface Pet {
  id: string
  ownerId: string
  name: string
  species: PetSpecies
  breed: string
  size: PetSize
  age: string
  gender: 'Macho' | 'Fêmea'
  isNeutered: boolean
  isVaccinated: boolean // V8/V10 + Raiva
  vaccineCardUrl?: string
  vetClinic: string
  behaviorTags: string[] // ex: "Amigável com cães", "Bom com gatos", "Adora crianças"
  energyLevel: EnergyLevel
  specialNeeds?: string
  fearsAndTriggers?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  photo: string
  rating?: number
  reviewsCount?: number
}

export type SpaceType =
  | 'Hospedagem domiciliar'
  | 'Daycare (creche diurna)'
  | 'Casa inteira pet-friendly'
export type CancellationPolicy = 'Flexível' | 'Moderada' | 'Rigorosa'

export interface Amenity {
  id: string
  label: string
  icon: string
  description?: string
}

export interface AcceptanceRules {
  maxPets: number
  allowedSizes: PetSize[]
  acceptsFemalesInHeat: boolean
  acceptsNonNeutered: boolean
  acceptsPuppies: boolean
  fenceHeightMeters: number
  hasWindowNets: boolean
  noToxicPlants: boolean
}

export interface Listing {
  id: string
  hostId: string
  title: string
  description: string
  spaceType: SpaceType
  address: {
    city: string
    state: string
    neighborhood: string
    street?: string
  }
  pricePerNight: number
  cleaningFee: number
  serviceFeePercent: number
  securityDeposit: number
  photos: string[]
  amenities: string[] // IDs or names
  rules: AcceptanceRules
  cancellationPolicy: CancellationPolicy
  rating: number
  reviewsCount: number
  isInstantBook: boolean
  status: 'active' | 'paused'
  features: string[] // Categorias pet: "Com Quintal Gramado", "Telas de Proteção", "Sem Outros Animais", "Veterinário 24h Perto", "Piscina Pet", "Câmeras 24h"
  calendarBlockedDates: string[] // "YYYY-MM-DD"
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  listingId: string
  tutorId: string
  petId: string
  checkIn: string
  checkOut: string
  nights: number
  petsCount: number
  pricePerNight: number
  baseTotal: number
  petExtraFee: number
  cleaningFee: number
  serviceFee: number
  securityDeposit: number
  totalAmount: number
  status: BookingStatus
  cancellationPolicy: CancellationPolicy
  healthInstructions?: string
  rejectionReason?: string
  createdAt: string
  checkInInspection?: {
    completed: boolean
    photo?: string
    notes?: string
    completedAt?: string
  }
  checkOutInspection?: {
    completed: boolean
    depositReleased: boolean
    notes?: string
    completedAt?: string
  }
}

export interface DailyLogEntry {
  id: string
  bookingId: string
  timestamp: string
  date: string
  photo: string
  notes: string
  mood: 'feliz' | 'satisfeito' | 'neutro' | 'cansado'
  feeding: string
  medication?: string
  walks?: string
}

export interface ChatMessage {
  id: string
  bookingId: string
  senderId: string
  senderName: string
  senderRole: 'tutor' | 'host'
  text: string
  timestamp: string
  isLogEntry?: boolean
  logData?: DailyLogEntry
}

export interface ReviewRatingTutorToHost {
  care: number
  cleanliness: number
  communication: number
  safety: number
}

export interface ReviewRatingHostToTutor {
  petBehavior: number
  medicalAccuracy: number
  punctuality: number
}

export interface DoubleBlindReview {
  id: string
  bookingId: string
  listingId: string
  tutorId: string
  hostId: string
  tutorReview?: {
    ratings: ReviewRatingTutorToHost
    average: number
    comment: string
    submittedAt: string
  }
  hostReview?: {
    ratings: ReviewRatingHostToTutor
    average: number
    comment: string
    submittedAt: string
  }
  isRevealed: boolean // Revealed when both submit OR timer simulated
  revealedAt?: string
}
