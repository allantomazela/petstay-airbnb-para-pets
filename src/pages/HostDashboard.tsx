import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { SpaceType, PetSize, Pet } from '@/types'
import {
  TrendingUp,
  DollarSign,
  Star,
  Users,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Power,
  ShieldCheck,
  Dog,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function HostDashboard() {
  const {
    currentUser,
    listings,
    bookings,
    pets,
    users,
    approveBooking,
    rejectBooking,
    toggleListingStatus,
    createListing,
    toggleCalendarDate,
  } = useData()
  const { toast } = useToast()

  // Listings managed by current user or mock host
  const hostListings = listings.filter((l) =>
    currentUser.role === 'host' ? l.hostId === currentUser.id : true,
  )
  const currentListing = hostListings[0] || listings[0]

  // Pending bookings to approve/reject
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  // Modals state
  const [selectedPetForModal, setSelectedPetForModal] = useState<Pet | null>(null)
  const [petModalOpen, setPetModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [bookingToReject, setBookingToReject] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [newListingModalOpen, setNewListingModalOpen] = useState(false)

  // Interactive Calendar State (May 2025 default)
  const [calMonth, setCalMonth] = useState(4) // 0-based: 4 = Maio
  const [calYear, setCalYear] = useState(2025)

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState<SpaceType>('Hospedagem domiciliar')
  const [newCity, setNewCity] = useState('São Paulo')
  const [newNeighborhood, setNewNeighborhood] = useState('')
  const [newPrice, setNewPrice] = useState('130')
  const [newCleaning, setNewCleaning] = useState('40')

  // Calculate calendar days
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOffset = (month: number, year: number) => {
    return new Date(year, month, 1).getDay() // 0 = Sunday
  }

  const daysInMonth = getDaysInMonth(calMonth, calYear)
  const firstDayOffset = getFirstDayOffset(calMonth, calYear)
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear((y) => y - 1)
    } else {
      setCalMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear((y) => y + 1)
    } else {
      setCalMonth((m) => m + 1)
    }
  }

  // Get date status for calendar
  const getDateStatus = (day: number) => {
    const formattedDate = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // Check if manually blocked by host
    if (currentListing.calendarBlockedDates.includes(formattedDate)) {
      return { status: 'blocked', label: 'Bloqueado', dateStr: formattedDate }
    }

    // Check if has a confirmed or in-progress booking
    const isBooked = bookings.some(
      (b) =>
        b.listingId === currentListing.id &&
        (b.status === 'confirmed' || b.status === 'in_progress') &&
        formattedDate >= b.checkIn &&
        formattedDate <= b.checkOut,
    )
    if (isBooked) {
      return { status: 'reserved', label: 'Reservado', dateStr: formattedDate }
    }

    // Check if provisional/pending
    const isPending = bookings.some(
      (b) =>
        b.listingId === currentListing.id &&
        b.status === 'pending' &&
        formattedDate >= b.checkIn &&
        formattedDate <= b.checkOut,
    )
    if (isPending) {
      return { status: 'provisional', label: 'Solicitação Pendente', dateStr: formattedDate }
    }

    return { status: 'available', label: 'Disponível', dateStr: formattedDate }
  }

  const handleDayClick = (day: number) => {
    const { status, dateStr } = getDateStatus(day)
    if (status === 'reserved') {
      toast({
        title: 'Data com reserva confirmada',
        description: 'Esta data possui hóspedes confirmados e não pode ser alterada diretamente.',
      })
      return
    }

    toggleCalendarDate(currentListing.id, dateStr)
    toast({
      title: status === 'blocked' ? 'Data desbloqueada' : 'Data bloqueada',
      description: `Dia ${day} de ${monthNames[calMonth]} agora está ${status === 'blocked' ? 'disponível' : 'bloqueado'}.`,
    })
  }

  // Open Pet Modal
  const openPetModal = (petId: string) => {
    const targetPet = pets.find((p) => p.id === petId)
    if (targetPet) {
      setSelectedPetForModal(targetPet)
      setPetModalOpen(true)
    }
  }

  // Handle Reject
  const handleRejectClick = (bookingId: string) => {
    setBookingToReject(bookingId)
    setRejectModalOpen(true)
  }

  const confirmRejection = () => {
    if (bookingToReject) {
      rejectBooking(bookingToReject, rejectionReason)
      setRejectModalOpen(false)
      setRejectionReason('')
      setBookingToReject(null)
    }
  }

  // Handle Create Listing
  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      toast({ title: 'Título é obrigatório', variant: 'destructive' })
      return
    }

    createListing({
      title: newTitle,
      description: newDesc || 'Espaço acolhedor e seguro para hospedar seu pet com muito amor.',
      spaceType: newType,
      address: {
        city: newCity,
        state: 'SP',
        neighborhood: newNeighborhood || 'Centro',
        street: 'Rua Petbnb, 100',
      },
      pricePerNight: Number(newPrice) || 120,
      cleaningFee: Number(newCleaning) || 40,
      serviceFeePercent: 12,
      securityDeposit: 150,
      photos: [
        'https://img.usecurling.com/p/800/600?q=modern+pet+friendly+house',
        'https://img.usecurling.com/p/800/600?q=pet+lounge+room',
        'https://img.usecurling.com/p/800/600?q=dog+bed+cushion',
      ],
      amenities: [
        'quintal fechado',
        'tela de proteção',
        'ar-condicionado',
        'câmeras 24h',
        'sem plantas tóxicas',
      ],
      rules: {
        maxPets: 3,
        allowedSizes: ['Pequeno', 'Médio', 'Grande'],
        acceptsFemalesInHeat: false,
        acceptsNonNeutered: true,
        acceptsPuppies: true,
        fenceHeightMeters: 2.0,
        hasWindowNets: true,
        noToxicPlants: true,
      },
      cancellationPolicy: 'Flexível',
      isInstantBook: true,
      status: 'active',
      features: ['Com Quintal Gramado', 'Telas de Proteção', 'Câmeras 24h'],
    })

    setNewListingModalOpen(false)
    setNewTitle('')
    setNewDesc('')
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#FEF3C7] text-[#B45309] font-bold text-xs flex items-center gap-1 border border-[#FDE68A]">
              <Award className="w-3.5 h-3.5 fill-[#B45309]" />
              Super Host Petbnb
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Painel do Anfitrião
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie reservas, calendário de ocupação, solicitações de hóspedes e anúncios.
          </p>
        </div>

        <Button
          onClick={() => setNewListingModalOpen(true)}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-2xl px-5 py-6 shadow-md shadow-[#22C55E]/20 btn-hover-effect flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Anúncio
        </Button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Reservas Ativas
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
              {
                bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress')
                  .length
              }
            </h3>
            <p className="text-xs text-[#15803D] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2 esta semana
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Receita Mensal (Mock)
            </p>
            <h3 className="text-3xl font-extrabold text-[#15803D] mt-1">R$ 3.840</h3>
            <p className="text-xs text-[#15803D] font-semibold mt-1">+18% vs mês anterior</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Avaliação Média
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1 flex items-center gap-1">
              4.98 <Star className="w-5 h-5 fill-[#EAB308] text-[#EAB308]" />
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Baseada em 142 estadias</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Taxa de Ocupação
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">84%</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Alta temporada pet</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 1: SOLICITAÇÕES PENDENTES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Solicitações Pendentes ({pendingBookings.length})
            </h2>
            <p className="text-xs text-gray-500">
              Analise a ficha médica e comportamental do pet antes de aceitar.
            </p>
          </div>
          {pendingBookings.length > 0 && (
            <Badge className="bg-amber-100 text-amber-800 border-none font-bold">
              Aguardando Resposta
            </Badge>
          )}
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-8 text-center bg-[#F8FAF8] rounded-2xl border border-gray-100">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-800">
              Nenhuma solicitação pendente no momento
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Todas as novas reservas solicitadas por tutores aparecerão aqui com a ficha completa
              do pet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((b) => {
              const pet = pets.find((p) => p.id === b.petId)
              const tutor = users.find((u) => u.id === b.tutorId)
              return (
                <div
                  key={b.id}
                  className="bg-[#F8FAF8] rounded-2xl p-5 border border-gray-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={pet?.photo || 'https://img.usecurling.com/p/200/200?q=dog'}
                      alt={pet?.name || 'Pet'}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#22C55E]/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-gray-900">{pet?.name}</h3>
                        <span className="text-xs text-gray-500">
                          ({pet?.breed}, {pet?.age})
                        </span>
                        {pet?.isVaccinated && (
                          <Badge className="bg-[#E8F5E9] text-[#15803D] text-[10px] font-bold border-none">
                            Vacinas Ok
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Tutor: <strong>{tutor?.name}</strong> • Datas: <strong>{b.checkIn}</strong>{' '}
                        até <strong>{b.checkOut}</strong> ({b.nights} noites)
                      </p>
                      <p className="text-xs text-[#15803D] font-bold mt-0.5">
                        Total da Estadia: R$ {b.totalAmount.toFixed(2)} (Caução: R${' '}
                        {b.securityDeposit})
                      </p>
                      {b.healthInstructions && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1.5 border border-amber-200">
                          Obs do Tutor: {b.healthInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPetModal(b.petId)}
                      className="rounded-xl border-gray-200 text-xs font-bold text-gray-700 hover:bg-[#E8F5E9] hover:text-[#15803D] flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Ficha do Pet
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveBooking(b.id)}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRejectClick(b.id)}
                      className="text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: CALENDÁRIO INTERATIVO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Calendário de Disponibilidade</h2>
            <p className="text-xs text-gray-500">
              Clique em uma data livre para <strong>bloquear</strong>; clique em uma data bloqueada
              para <strong>liberar</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-800">
              {monthNames[calMonth]} de {calYear}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#22C55E]" />
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#DC2626]" />
            <span>Reservado (Confirmado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#EAB308]" />
            <span>Provisional (Solicitado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gray-300 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-gray-600" />
            </span>
            <span>Bloqueado pelo Host</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-gray-50 text-center py-2.5 text-xs font-bold text-gray-500 border-b border-gray-200">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 bg-white">
            {/* Blank offsets */}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`blank-${i}`} className="h-20 bg-gray-50/40 p-2" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const { status } = getDateStatus(day)

              let bgClasses = 'bg-white hover:bg-gray-50 text-gray-800'
              let indicator = <span className="w-2 h-2 rounded-full bg-[#22C55E]" />

              if (status === 'blocked') {
                bgClasses = 'bg-gray-100 text-gray-400'
                indicator = <Lock className="w-3.5 h-3.5 text-gray-500" />
              } else if (status === 'reserved') {
                bgClasses = 'bg-red-50 text-red-900 font-bold'
                indicator = <span className="w-2 h-2 rounded-full bg-red-600" />
              } else if (status === 'provisional') {
                bgClasses = 'bg-amber-50 text-amber-900 font-bold'
                indicator = <span className="w-2 h-2 rounded-full bg-amber-500" />
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`h-20 p-2 flex flex-col justify-between text-left transition-colors cursor-pointer ${bgClasses}`}
                >
                  <span className="text-xs font-bold">{day}</span>
                  <div className="flex items-center justify-between">
                    {indicator}
                    <span className="text-[10px] uppercase font-semibold opacity-70">
                      {status === 'blocked' ? 'Bloq' : status === 'reserved' ? 'Res' : 'Livre'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: GERENCIADOR DE ANÚNCIOS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 card-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Meus Anúncios Cadastrados</h2>
            <p className="text-xs text-gray-500">
              Ative, pause ou configure as regras e fotos dos seus espaços pet-friendly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostListings.map((listing) => (
            <div
              key={listing.id}
              className="border border-gray-200 rounded-3xl overflow-hidden bg-white flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-gray-100">
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                      className={`${
                        listing.status === 'active'
                          ? 'bg-[#E8F5E9] text-[#15803D]'
                          : 'bg-gray-200 text-gray-700'
                      } font-bold text-xs`}
                    >
                      {listing.status === 'active' ? '● Ativo' : '⏸ Pausado'}
                    </Badge>
                    {listing.isInstantBook && (
                      <Badge className="bg-[#FEF3C7] text-[#B45309] font-bold text-xs">
                        Instantânea
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-semibold text-[#15803D] uppercase">
                    {listing.spaceType}
                  </span>
                  <h3 className="font-bold text-base text-gray-900 line-clamp-1 mt-0.5">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {listing.address.neighborhood}, {listing.address.city}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <span className="font-bold text-sm text-gray-900">
                        R$ {listing.pricePerNight}
                      </span>{' '}
                      / diária
                    </div>
                    <div className="text-gray-500">Limpeza: R$ {listing.cleaningFee}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-gray-100 mt-2">
                <Link to={`/listings/${listing.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs font-bold"
                  >
                    Visualizar Anúncio
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleListingStatus(listing.id)}
                  className={`rounded-xl text-xs font-bold ${
                    listing.status === 'active'
                      ? 'text-amber-700 hover:bg-amber-50'
                      : 'text-[#15803D] hover:bg-[#E8F5E9]'
                  }`}
                >
                  <Power className="w-3.5 h-3.5 mr-1" />
                  {listing.status === 'active' ? 'Pausar' : 'Ativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: VER FICHA DO PET (Pré-aprovação) */}
      <Dialog open={petModalOpen} onOpenChange={setPetModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Dog className="w-5 h-5 text-[#22C55E]" />
              Ficha Médica & Comportamental do Pet
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Analise cuidadosamente antes de aceitar a hospedagem.
            </DialogDescription>
          </DialogHeader>

          {selectedPetForModal && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100">
                <img
                  src={selectedPetForModal.photo}
                  alt={selectedPetForModal.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#22C55E]"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">
                    {selectedPetForModal.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedPetForModal.breed} • {selectedPetForModal.age} • Porte{' '}
                    {selectedPetForModal.size}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-[#E8F5E9] text-[#15803D] text-[10px]">
                      {selectedPetForModal.isNeutered ? 'Castrado' : 'Não Castrado'}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        selectedPetForModal.isVaccinated
                          ? 'bg-[#E8F5E9] text-[#15803D]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedPetForModal.isVaccinated
                        ? 'Vacinas V8/V10 e Raiva Ok'
                        : 'Vacinas Pendentes'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Saúde */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2 text-xs">
                <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Informações Clínicas
                </p>
                <p>
                  <strong>Clínica Habitual:</strong> {selectedPetForModal.vetClinic}
                </p>
                <p>
                  <strong>Documento:</strong> {selectedPetForModal.vaccineCardUrl || 'carteira.pdf'}
                </p>
                {selectedPetForModal.specialNeeds && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <strong>Cuidados/Medicação:</strong> {selectedPetForModal.specialNeeds}
                  </p>
                )}
              </div>

              {/* Comportamento */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2 text-xs">
                <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Comportamento & Energia
                </p>
                <p>
                  <strong>Nível de Energia:</strong> {selectedPetForModal.energyLevel}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPetForModal.behaviorTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#E8F5E9] text-[#15803D] px-2.5 py-0.5 rounded-md font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedPetForModal.fearsAndTriggers && (
                  <p className="text-gray-500 pt-1">
                    <strong>Gatilhos:</strong> {selectedPetForModal.fearsAndTriggers}
                  </p>
                )}
              </div>

              {/* Emergência */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-1 text-xs">
                <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Contato de Emergência
                </p>
                <p>
                  {selectedPetForModal.emergencyContact.name} (
                  {selectedPetForModal.emergencyContact.relationship}) —{' '}
                  <strong>{selectedPetForModal.emergencyContact.phone}</strong>
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setPetModalOpen(false)}
                  className="bg-[#22C55E] text-white font-bold rounded-xl text-xs"
                >
                  Fechar Ficha
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: REJEITAR RESERVA COM MOTIVO */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Recusar Solicitação de Reserva
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              O tutor será notificado do cancelamento. O motivo abaixo é opcional.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="rej-reason" className="text-xs font-bold text-gray-700 block mb-1">
                Motivo da Recusa (opcional)
              </Label>
              <Textarea
                id="rej-reason"
                rows={3}
                placeholder="Ex: Não estarei disponível nestas datas; espaço atingiu a lotação de cães grandes..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-xl border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-xl"
              >
                Voltar
              </Button>
              <Button
                size="sm"
                onClick={confirmRejection}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
              >
                Confirmar Recusa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: NOVO ANÚNCIO FORMULÁRIO */}
      <Dialog open={newListingModalOpen} onOpenChange={setNewListingModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900">
              Cadastrar Nova Acomodação Pet
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Defina o tipo de espaço, endereço, diária e comodidades do seu anúncio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateListingSubmit} className="space-y-5 pt-3">
            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Título do Anúncio *
              </Label>
              <Input
                placeholder="Ex: Casa com Gramado e Piscina Pet em Pinheiros"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">
                  Tipo de Espaço *
                </Label>
                <Select value={newType} onValueChange={(val) => setNewType(val as SpaceType)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospedagem domiciliar">Hospedagem domiciliar</SelectItem>
                    <SelectItem value="Daycare (creche diurna)">Daycare (creche diurna)</SelectItem>
                    <SelectItem value="Casa inteira pet-friendly">
                      Casa inteira pet-friendly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">Cidade *</Label>
                <Input
                  placeholder="Ex: São Paulo"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">Bairro *</Label>
                <Input
                  placeholder="Ex: Moema"
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">
                  Preço Diária (R$) *
                </Label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">
                  Taxa Limpeza (R$)
                </Label>
                <Input
                  type="number"
                  value={newCleaning}
                  onChange={(e) => setNewCleaning(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Descrição Detalhada do Espaço
              </Label>
              <Textarea
                rows={3}
                placeholder="Conte sobre sua experiência, tamanho do quintal, rotina de carinho..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewListingModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl px-6"
              >
                Publicar Anúncio
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
