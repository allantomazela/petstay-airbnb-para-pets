import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { Booking, BookingStatus, DailyLogEntry } from '@/types'
import {
  CalendarDays,
  MessageSquare,
  Send,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Smile,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  ChevronRight,
  Dog,
  MapPin,
  Star,
  AlertCircle,
  FileText,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

export default function ReservationsChat() {
  const {
    currentUser,
    bookings,
    listings,
    pets,
    users,
    messages,
    addChatMessage,
    addDailyLogEntry,
    completeCheckIn,
    completeCheckOut,
  } = useData()
  const { toast } = useToast()

  // Filter bookings for user
  const userBookings = bookings.filter((b) =>
    currentUser.role === 'host' ? true : b.tutorId === currentUser.id,
  )

  const [activeTab, setActiveTab] = useState<string>('all')
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    userBookings[0]?.id || 'book-in-progress-1',
  )

  // Chat message input
  const [inputText, setInputText] = useState('')

  // Modals state
  const [dailyLogModalOpen, setDailyLogModalOpen] = useState(false)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false)

  // Daily Log Form State
  const [logNotes, setLogNotes] = useState('')
  const [logMood, setLogMood] = useState<'feliz' | 'satisfeito' | 'neutro' | 'cansado'>('feliz')
  const [logFeeding, setLogFeeding] = useState('Comeu toda a porção de ração com ótimo apetite.')
  const [logMedication, setLogMedication] = useState('')
  const [logWalks, setLogWalks] = useState('Passeio no gramado e brincadeira na piscina.')
  const [logPhotoUrl, setLogPhotoUrl] = useState('')

  // Check-in Checklist State
  const [ciCoatHealthy, setCiCoatHealthy] = useState(true)
  const [ciGatesInspected, setCiGatesInspected] = useState(true)
  const [ciNetsChecked, setCiNetsChecked] = useState(true)
  const [ciNoToxicPlants, setCiNoToxicPlants] = useState(true)
  const [ciNotes, setCiNotes] = useState(
    'Pet chegou muito saudável e tranquilo. Portões conferidos.',
  )

  // Check-out Mutual State
  const [coTutorConfirmed, setCoTutorConfirmed] = useState(true)
  const [coHostConfirmed, setCoHostConfirmed] = useState(true)
  const [coNotes, setCoNotes] = useState(
    'Hospedagem perfeita, sem avarias e pet devolvido com saúde.',
  )

  // Current selected booking
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || userBookings[0]
  const currentListing = listings.find((l) => l.id === selectedBooking?.listingId)
  const currentPet = pets.find((p) => p.id === selectedBooking?.petId)
  const currentTutor = users.find((u) => u.id === selectedBooking?.tutorId)
  const currentHost = users.find((u) => u.id === currentListing?.hostId)

  // Filtered bookings list
  const filteredBookings = userBookings.filter((b) => {
    if (activeTab === 'all') return true
    return b.status === activeTab
  })

  // Booking chat messages
  const currentChatMessages = messages.filter((m) => m.bookingId === selectedBooking?.id)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedBooking) return
    addChatMessage(selectedBooking.id, inputText.trim())
    setInputText('')
  }

  const handlePublishDailyLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    const photoToUse =
      logPhotoUrl.trim() || 'https://img.usecurling.com/p/600/400?q=happy+dog+playing+outdoors'

    addDailyLogEntry(selectedBooking.id, {
      date: new Date().toLocaleDateString('pt-BR'),
      photo: photoToUse,
      notes: logNotes || 'Dia repleto de diversão, descanso na caminha e carinho!',
      mood: logMood,
      feeding: logFeeding,
      medication: logMedication.trim() || undefined,
      walks: logWalks,
    })

    setDailyLogModalOpen(false)
    setLogNotes('')
    setLogPhotoUrl('')
  }

  const handleConfirmCheckIn = () => {
    if (!selectedBooking) return
    completeCheckIn(selectedBooking.id, ciNotes)
    setCheckInModalOpen(false)
  }

  const handleConfirmCheckOut = () => {
    if (!selectedBooking) return
    completeCheckOut(selectedBooking.id, coNotes)
    setCheckOutModalOpen(false)
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-xs">
            Pendente
          </Badge>
        )
      case 'confirmed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-none font-bold text-xs">
            Confirmada
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge className="bg-[#E8F5E9] text-[#15803D] border-[#C8E6C9] font-bold text-xs">
            Em Andamento 🐾
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-none font-bold text-xs">
            Concluída
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-none font-bold text-xs">Cancelada</Badge>
        )
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Central de Reservas & Diário de Bordo
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe suas estadias ativas, receba fotos diárias e converse diretamente pelo chat
          seguro.
        </p>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Reservations List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-2xl border border-gray-100 card-shadow">
            <div className="flex gap-1 overflow-x-auto p-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'pending', label: 'Pendentes' },
                { id: 'confirmed', label: 'Confirmadas' },
                { id: 'in_progress', label: 'Em Andamento' },
                { id: 'completed', label: 'Concluídas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Scroll List */}
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 text-gray-500 text-xs">
                Nenhuma reserva encontrada nesta aba.
              </div>
            ) : (
              filteredBookings.map((b) => {
                const list = listings.find((l) => l.id === b.listingId)
                const pt = pets.find((p) => p.id === b.petId)
                const isSelected = selectedBooking?.id === b.id

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#22C55E] ring-2 ring-[#22C55E]/20 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={pt?.photo || 'https://img.usecurling.com/p/100/100?q=dog'}
                          alt={pt?.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{pt?.name}</h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{list?.title}</p>
                        </div>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100 mt-2">
                      <span>
                        📅 {b.checkIn} a {b.checkOut}
                      </span>
                      <span className="font-bold text-gray-900">R$ {b.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Booking Chat & Live Board (7 cols) */}
        <div className="lg:col-span-7">
          {selectedBooking ? (
            <div className="bg-white rounded-3xl border border-gray-100 card-shadow flex flex-col h-[75vh] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-[#F8FAF8] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      currentUser.role === 'host'
                        ? currentTutor?.avatar
                        : currentHost?.avatar || 'https://img.usecurling.com/ppl/medium?seed=1'
                    }
                    alt=""
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#22C55E]"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">
                      {currentUser.role === 'host'
                        ? `Tutor: ${currentTutor?.name}`
                        : `Anfitrião: ${currentHost?.name}`}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Hóspede: <strong>{currentPet?.name}</strong> ({currentPet?.breed}) •{' '}
                      {selectedBooking.checkIn} a {selectedBooking.checkOut}
                    </p>
                  </div>
                </div>

                {/* Contextual Actions based on Booking Status & Role */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Host: Report Diário do Pet */}
                  {currentUser.role === 'host' && selectedBooking.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => setDailyLogModalOpen(true)}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Report Diário do Pet
                    </Button>
                  )}

                  {/* Host: Iniciar Check-in */}
                  {currentUser.role === 'host' && selectedBooking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => setCheckInModalOpen(true)}
                      className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Iniciar Check-in
                    </Button>
                  )}

                  {/* Host: Iniciar Check-out */}
                  {currentUser.role === 'host' && selectedBooking.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCheckOutModalOpen(true)}
                      className="border-gray-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Check-out
                    </Button>
                  )}

                  {/* Avaliar se Concluída */}
                  {selectedBooking.status === 'completed' && (
                    <Link to="/reviews">
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Avaliar Estadia
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAF8]/50">
                {/* Inspection Banner if checkin completed */}
                {selectedBooking.checkInInspection?.completed && (
                  <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-2xl text-xs text-[#15803D] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>
                      <strong>Vistoria de Entrada Concluída:</strong> Portões fechados, telas
                      conferidas e pet saudável às {selectedBooking.checkInInspection.completedAt}.
                    </span>
                  </div>
                )}

                {currentChatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id

                  // If this is a Daily Log Entry
                  if (msg.isLogEntry && msg.logData) {
                    const log = msg.logData
                    return (
                      <div
                        key={msg.id}
                        className="max-w-md mx-auto my-4 bg-white border border-[#22C55E]/30 rounded-3xl overflow-hidden card-shadow"
                      >
                        <div className="bg-gradient-to-r from-[#15803D] to-[#22C55E] p-3 text-white flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Diário de Bordo Oficial Petbnb
                          </span>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                            {log.date}
                          </span>
                        </div>

                        <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                          <img
                            src={log.photo}
                            alt="Foto do Pet"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <span>Humor:</span>
                            <span className="capitalize">{log.mood} 😄</span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2 text-xs">
                          <p className="text-gray-800 font-medium leading-relaxed">"{log.notes}"</p>
                          <div className="pt-2 border-t border-gray-100 text-gray-600 space-y-1">
                            <p>
                              🍖 <strong>Alimentação:</strong> {log.feeding}
                            </p>
                            {log.medication && (
                              <p className="text-amber-800">
                                💊 <strong>Medicação:</strong> {log.medication}
                              </p>
                            )}
                            {log.walks && (
                              <p>
                                🐾 <strong>Atividades:</strong> {log.walks}
                              </p>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 text-right pt-1">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  }

                  // Normal Chat Balloon
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-gray-400 mb-1 px-1">
                        {msg.senderName} • {msg.timestamp}
                      </div>
                      <div
                        className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-[#22C55E] text-white rounded-br-xs font-medium'
                            : 'bg-white text-gray-800 rounded-bl-xs border border-gray-100'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
              >
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="rounded-2xl border-gray-200 text-xs sm:text-sm focus-visible:ring-[#22C55E]"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="w-11 h-11 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-white flex-shrink-0 btn-hover-effect"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-500">
              Selecione uma reserva ao lado para ver o chat e o diário de bordo.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: REPORT DIÁRIO DO PET (Host Only) */}
      <Dialog open={dailyLogModalOpen} onOpenChange={setDailyLogModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#22C55E]" />
              Atualização do Dia (Diário de Bordo)
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Publique fotos, estado de humor e rotina do pet para tranquilizar o tutor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishDailyLog} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Foto do Pet (URL simulada ou deixe em branco para padrão)
              </Label>
              <Input
                placeholder="https://... (ou deixe vazio)"
                value={logPhotoUrl}
                onChange={(e) => setLogPhotoUrl(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Estado de Humor do Pet
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'feliz', label: 'Feliz 😄' },
                  { id: 'satisfeito', label: 'Satisfeito 😌' },
                  { id: 'neutro', label: 'Neutro 😐' },
                  { id: 'cansado', label: 'Cansadinho 😴' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setLogMood(m.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      logMood === m.id
                        ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Relato do Dia para o Tutor *
              </Label>
              <Textarea
                rows={3}
                placeholder="Conte o que ele aprontou de bom hoje..."
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">
                  Registro de Alimentação
                </Label>
                <Input
                  value={logFeeding}
                  onChange={(e) => setLogFeeding(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-700 block mb-1">
                  Medicação Ministrada
                </Label>
                <Input
                  placeholder="Ex: Colírio às 10h"
                  value={logMedication}
                  onChange={(e) => setLogMedication(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDailyLogModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl text-xs"
              >
                Publicar no Chat
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: CHECKLIST DE CHECK-IN */}
      <Dialog open={checkInModalOpen} onOpenChange={setCheckInModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              Checklist Fotográfico de Check-in
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Vistoria mútua na chegada do pet para garantir segurança e saúde.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-800">Itens Inspecionados na Entrada:</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ciCoatHealthy}
                  onChange={(e) => setCiCoatHealthy(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Pelagem, pele e olhos sem lesões visíveis</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ciGatesInspected}
                  onChange={(e) => setCiGatesInspected(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Portões duplos fechados com trinco seguro</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ciNetsChecked}
                  onChange={(e) => setCiNetsChecked(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Telas de proteção das janelas íntegras</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ciNoToxicPlants}
                  onChange={(e) => setCiNoToxicPlants(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Sem plantas tóxicas ao alcance do pet</span>
              </label>
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-700 block mb-1">
                Observações de Entrada
              </Label>
              <Textarea
                rows={2}
                value={ciNotes}
                onChange={(e) => setCiNotes(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCheckInModalOpen(false)}
                className="rounded-xl"
              >
                Voltar
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmCheckIn}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl"
              >
                Confirmar Check-in
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CHECK-OUT MUTUAL & CAUÇÃO */}
      <Dialog open={checkOutModalOpen} onOpenChange={setCheckOutModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#22C55E]" />
              Validação Mútua de Check-out
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Ao confirmar a devolução sem avarias, o depósito caução é estornado integralmente ao
              tutor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] text-[#15803D]">
              <p className="font-bold">
                Caução a ser liberada: R$ {selectedBooking.securityDeposit.toFixed(2)}
              </p>
              <p className="text-[11px] mt-0.5">
                O estorno é processado automaticamente no cartão do tutor.
              </p>
            </div>

            <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coTutorConfirmed}
                  onChange={(e) => setCoTutorConfirmed(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Tutor confirma recebimento do pet saudável</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coHostConfirmed}
                  onChange={(e) => setCoHostConfirmed(e.target.checked)}
                  className="rounded text-[#22C55E]"
                />
                <span>Anfitrião confirma espaço sem danos materiais</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCheckOutModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmCheckOut}
                className="bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded-xl"
              >
                Liberar Caução & Finalizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
