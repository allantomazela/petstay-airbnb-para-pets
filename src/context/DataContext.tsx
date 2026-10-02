import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  User,
  Pet,
  Listing,
  Booking,
  ChatMessage,
  DoubleBlindReview,
  DailyLogEntry,
  ReviewRatingTutorToHost,
  ReviewRatingHostToTutor,
} from '@/types'
import {
  MOCK_USERS,
  MOCK_PETS,
  MOCK_LISTINGS,
  MOCK_BOOKINGS,
  MOCK_CHAT_MESSAGES,
  MOCK_REVIEWS,
} from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'

interface SearchFilters {
  location: string
  checkIn: string
  checkOut: string
  dogsCount: number
  catsCount: number
  selectedCategory?: string
}

interface DataContextType {
  currentUser: User
  setCurrentUser: (user: User) => void
  users: User[]
  pets: Pet[]
  listings: Listing[]
  bookings: Booking[]
  messages: ChatMessage[]
  reviews: DoubleBlindReview[]
  searchFilters: SearchFilters
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>

  // Helper actions
  switchUserRole: (userId: string) => void
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => void
  updatePet: (id: string, pet: Partial<Pet>) => void
  deletePet: (id: string) => void
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking
  approveBooking: (bookingId: string) => void
  rejectBooking: (bookingId: string, reason?: string) => void
  addChatMessage: (bookingId: string, text: string) => void
  addDailyLogEntry: (
    bookingId: string,
    entry: Omit<DailyLogEntry, 'id' | 'bookingId' | 'timestamp'>,
  ) => void
  completeCheckIn: (bookingId: string, notes?: string, photo?: string) => void
  completeCheckOut: (bookingId: string, notes?: string) => void
  toggleListingStatus: (listingId: string) => void
  createListing: (
    listing: Omit<Listing, 'id' | 'hostId' | 'rating' | 'reviewsCount' | 'calendarBlockedDates'>,
  ) => void
  toggleCalendarDate: (listingId: string, dateStr: string) => void
  submitTutorReview: (bookingId: string, ratings: ReviewRatingTutorToHost, comment: string) => void
  submitHostReview: (bookingId: string, ratings: ReviewRatingHostToTutor, comment: string) => void
  simulateDoubleBlindReveal: (reviewId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast()
  const [users] = useState<User[]>(MOCK_USERS)
  const [currentUserId, setCurrentUserId] = useState<string>('user-tutor-1')
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS)
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [reviews, setReviews] = useState<DoubleBlindReview[]>(MOCK_REVIEWS)

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    dogsCount: 1,
    catsCount: 0,
    selectedCategory: '',
  })

  const currentUser = users.find((u) => u.id === currentUserId) || users[0]

  const switchUserRole = (userId: string) => {
    const selected = users.find((u) => u.id === userId)
    if (selected) {
      setCurrentUserId(selected.id)
      toast({
        title: `Perfil alterado para ${selected.name}`,
        description: `Modo ${selected.role === 'host' ? 'Anfitrião' : 'Tutor'} ativado.`,
      })
    }
  }

  const addPet = (petData: Omit<Pet, 'id' | 'ownerId'>) => {
    const newPet: Pet = {
      ...petData,
      id: `pet-${Date.now()}`,
      ownerId: currentUser.id,
      rating: 5.0,
      reviewsCount: 0,
    }
    setPets((prev) => [newPet, ...prev])
    toast({
      title: 'Pet cadastrado com sucesso!',
      description: `${newPet.name} já pode ser selecionado nas suas reservas.`,
    })
  }

  const updatePet = (id: string, updatedFields: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)))
    toast({
      title: 'Perfil atualizado!',
      description: 'As alterações do pet foram salvas.',
    })
  }

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id))
    toast({
      title: 'Pet removido',
      description: 'O perfil foi excluído da sua lista.',
    })
  }

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }

  const approveBooking = (bookingId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b)))
    toast({
      title: 'Reserva Aprovada!',
      description: 'O tutor foi notificado e a estadia está confirmada.',
    })
  }

  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', rejectionReason: reason || 'Não disponível nas datas' }
          : b,
      ),
    )
    toast({
      title: 'Solicitação recusada',
      description: 'O status da reserva foi atualizado para cancelado.',
      variant: 'destructive',
    })
  }

  const addChatMessage = (bookingId: string, text: string) => {
    const now = new Date()
    const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'host' ? 'host' : 'tutor',
      text,
      timestamp: timeStr,
    }

    setMessages((prev) => [...prev, newMsg])

    // Se o remetente for tutor, simula resposta automática do anfitrião após 1.5s
    if (currentUser.role === 'tutor') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          bookingId,
          senderId: 'user-host-1',
          senderName: 'Rodrigo PetCare (Anfitrião)',
          senderRole: 'host',
          text: 'Recebido com sucesso! Por aqui está tudo tranquilo com seu pet. Já te envio mais notícias e fotos!',
          timestamp: 'Agora mesmo',
        }
        setMessages((prev) => [...prev, autoReply])
      }, 1500)
    }
  }

  const addDailyLogEntry = (
    bookingId: string,
    entry: Omit<DailyLogEntry, 'id' | 'bookingId' | 'timestamp'>,
  ) => {
    const now = new Date()
    const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const fullLog: DailyLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      bookingId,
      timestamp: timeStr,
    }

    const logChatMessage: ChatMessage = {
      id: `msg-log-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'host',
      text: `Novo Diário de Bordo publicado (${entry.date})`,
      timestamp: timeStr,
      isLogEntry: true,
      logData: fullLog,
    }

    setMessages((prev) => [...prev, logChatMessage])
    toast({
      title: 'Diário de Bordo publicado!',
      description: 'O tutor já pode visualizar fotos e status do pet.',
    })
  }

  const completeCheckIn = (bookingId: string, notes?: string, photo?: string) => {
    const now = new Date()
    const timeStr = `${now.toLocaleDateString('pt-BR')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'in_progress',
              checkInInspection: {
                completed: true,
                photo: photo || 'https://img.usecurling.com/p/600/400?q=dog+checkin+safety',
                notes: notes || 'Check-in e vistoria concluídos com sucesso.',
                completedAt: timeStr,
              },
            }
          : b,
      ),
    )
    toast({
      title: 'Check-in confirmado!',
      description: 'A hospedagem agora está em andamento.',
    })
  }

  const completeCheckOut = (bookingId: string, notes?: string) => {
    const now = new Date()
    const timeStr = `${now.toLocaleDateString('pt-BR')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'completed',
              checkOutInspection: {
                completed: true,
                depositReleased: true,
                notes: notes || 'Check-out finalizado. Caução de segurança liberada.',
                completedAt: timeStr,
              },
            }
          : b,
      ),
    )
    toast({
      title: 'Check-out finalizado!',
      description: 'Hospedagem concluída e caução liberada. Agora vocês podem se avaliar!',
    })
  }

  const toggleListingStatus = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l,
      ),
    )
    toast({
      title: 'Status do anúncio atualizado!',
    })
  }

  const createListing = (
    listingData: Omit<
      Listing,
      'id' | 'hostId' | 'rating' | 'reviewsCount' | 'calendarBlockedDates'
    >,
  ) => {
    const newListing: Listing = {
      ...listingData,
      id: `list-${Date.now()}`,
      hostId: currentUser.id,
      rating: 5.0,
      reviewsCount: 0,
      calendarBlockedDates: [],
    }
    setListings((prev) => [newListing, ...prev])
    toast({
      title: 'Acomodação cadastrada!',
      description: 'Seu anúncio já está disponível para reservas.',
    })
  }

  const toggleCalendarDate = (listingId: string, dateStr: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== listingId) return l
        const isBlocked = l.calendarBlockedDates.includes(dateStr)
        const updated = isBlocked
          ? l.calendarBlockedDates.filter((d) => d !== dateStr)
          : [...l.calendarBlockedDates, dateStr]
        return { ...l, calendarBlockedDates: updated }
      }),
    )
  }

  const submitTutorReview = (
    bookingId: string,
    ratings: ReviewRatingTutorToHost,
    comment: string,
  ) => {
    const avg = (ratings.care + ratings.cleanliness + ratings.communication + ratings.safety) / 4
    const today = new Date().toLocaleDateString('pt-BR')

    setReviews((prev) => {
      const existing = prev.find((r) => r.bookingId === bookingId)
      if (existing) {
        const willBeRevealed = !!existing.hostReview
        if (willBeRevealed) {
          toast({
            title: '🎉 Comentários revelados!',
            description:
              'Ambas as partes enviaram as avaliações. As notas e relatos agora são públicos!',
          })
        } else {
          toast({
            title: 'Avaliação enviada!',
            description:
              'Aguardando o anfitrião avaliar para revelar os comentários mutuamente (Double-blind).',
          })
        }
        return prev.map((r) =>
          r.bookingId === bookingId
            ? {
                ...r,
                tutorReview: {
                  ratings,
                  average: Number(avg.toFixed(1)),
                  comment,
                  submittedAt: today,
                },
                isRevealed: willBeRevealed,
                revealedAt: willBeRevealed ? today : undefined,
              }
            : r,
        )
      } else {
        const targetBooking = bookings.find((b) => b.id === bookingId)
        const newReview: DoubleBlindReview = {
          id: `rev-${Date.now()}`,
          bookingId,
          listingId: targetBooking?.listingId || 'list-1',
          tutorId: currentUser.id,
          hostId: 'user-host-1',
          tutorReview: {
            ratings,
            average: Number(avg.toFixed(1)),
            comment,
            submittedAt: today,
          },
          isRevealed: false,
        }
        toast({
          title: 'Avaliação enviada!',
          description:
            'Aguardando o anfitrião avaliar para revelar os comentários mutuamente (Double-blind).',
        })
        return [...prev, newReview]
      }
    })
  }

  const submitHostReview = (
    bookingId: string,
    ratings: ReviewRatingHostToTutor,
    comment: string,
  ) => {
    const avg = (ratings.petBehavior + ratings.medicalAccuracy + ratings.punctuality) / 3
    const today = new Date().toLocaleDateString('pt-BR')

    setReviews((prev) => {
      const existing = prev.find((r) => r.bookingId === bookingId)
      if (existing) {
        const willBeRevealed = !!existing.tutorReview
        if (willBeRevealed) {
          toast({
            title: '🎉 Comentários revelados!',
            description:
              'Ambas as partes enviaram as avaliações. As notas e relatos agora são públicos!',
          })
        } else {
          toast({
            title: 'Avaliação enviada!',
            description:
              'Aguardando o tutor avaliar para revelar os comentários mutuamente (Double-blind).',
          })
        }
        return prev.map((r) =>
          r.bookingId === bookingId
            ? {
                ...r,
                hostReview: {
                  ratings,
                  average: Number(avg.toFixed(1)),
                  comment,
                  submittedAt: today,
                },
                isRevealed: willBeRevealed,
                revealedAt: willBeRevealed ? today : undefined,
              }
            : r,
        )
      } else {
        const targetBooking = bookings.find((b) => b.id === bookingId)
        const newReview: DoubleBlindReview = {
          id: `rev-${Date.now()}`,
          bookingId,
          listingId: targetBooking?.listingId || 'list-1',
          tutorId: targetBooking?.tutorId || 'user-tutor-1',
          hostId: currentUser.id,
          hostReview: {
            ratings,
            average: Number(avg.toFixed(1)),
            comment,
            submittedAt: today,
          },
          isRevealed: false,
        }
        toast({
          title: 'Avaliação enviada!',
          description:
            'Aguardando o tutor avaliar para revelar os comentários mutuamente (Double-blind).',
        })
        return [...prev, newReview]
      }
    })
  }

  const simulateDoubleBlindReveal = (reviewId: string) => {
    const today = new Date().toLocaleDateString('pt-BR')
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            isRevealed: true,
            revealedAt: today,
            hostReview: r.hostReview || {
              ratings: { petBehavior: 5, medicalAccuracy: 5, punctuality: 5 },
              average: 5.0,
              comment:
                'Hospedagem exemplar! O pet foi super calmo e o tutor seguiu todas as regras da casa.',
              submittedAt: today,
            },
          }
        }
        return r
      }),
    )
    toast({
      title: '🎉 Prazo expirado / Avaliação completada!',
      description: 'As avaliações foram reveladas para ambas as partes.',
    })
  }

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser: (u) => setCurrentUserId(u.id),
        users,
        pets,
        listings,
        bookings,
        messages,
        reviews,
        searchFilters,
        setSearchFilters,
        switchUserRole,
        addPet,
        updatePet,
        deletePet,
        createBooking,
        approveBooking,
        rejectBooking,
        addChatMessage,
        addDailyLogEntry,
        completeCheckIn,
        completeCheckOut,
        toggleListingStatus,
        createListing,
        toggleCalendarDate,
        submitTutorReview,
        submitHostReview,
        simulateDoubleBlindReveal,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider')
  }
  return context
}
