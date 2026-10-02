import React, { useState } from 'react'
import { useData } from '@/context/DataContext'
import {
  Star,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Award,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export default function ReviewsPage() {
  const {
    currentUser,
    bookings,
    listings,
    pets,
    users,
    reviews,
    submitTutorReview,
    submitHostReview,
    simulateDoubleBlindReveal,
  } = useData()
  const { toast } = useToast()

  // Completed bookings eligible for reviews
  const completedBookings = bookings.filter((b) => b.status === 'completed')

  // Modal form states
  const [activeReviewBookingId, setActiveReviewBookingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Tutor evaluation criteria (1 to 5)
  const [tutorCare, setTutorCare] = useState(5)
  const [tutorCleanliness, setTutorCleanliness] = useState(5)
  const [tutorCommunication, setTutorCommunication] = useState(5)
  const [tutorSafety, setTutorSafety] = useState(5)
  const [tutorComment, setTutorComment] = useState('')

  // Host evaluation criteria (1 to 5)
  const [hostBehavior, setHostBehavior] = useState(5)
  const [hostMedical, setHostMedical] = useState(5)
  const [hostPunctuality, setHostPunctuality] = useState(5)
  const [hostComment, setHostComment] = useState('')

  const handleOpenReviewModal = (bookingId: string) => {
    setActiveReviewBookingId(bookingId)
    setTutorComment('')
    setHostComment('')
    setModalOpen(true)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeReviewBookingId) return

    if (currentUser.role === 'host') {
      submitHostReview(
        activeReviewBookingId,
        {
          petBehavior: hostBehavior,
          medicalAccuracy: hostMedical,
          punctuality: hostPunctuality,
        },
        hostComment || 'Excelente tutor e pet adorável, muito bem cuidado!',
      )
    } else {
      submitTutorReview(
        activeReviewBookingId,
        {
          care: tutorCare,
          cleanliness: tutorCleanliness,
          communication: tutorCommunication,
          safety: tutorSafety,
        },
        tutorComment || 'Experiência fantástica! Meu pet foi tratado como da família.',
      )
    }

    setModalOpen(false)
  }

  // Star selector helper component with pop scale
  const renderStarSelector = (value: number, onChange: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 star-pop focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value
                  ? 'fill-[#EAB308] text-[#EAB308]'
                  : 'text-gray-300 hover:text-[#EAB308]'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-gray-700">{value}.0</span>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#15803D] px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4" />
          Sistema de Avaliações Double-Blind
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Avaliações Mútuas & Imparciais
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Para garantir total honestidade e transparência, os comentários permanecem{' '}
          <strong>ocultos (Double-Blind)</strong> até que ambas as partes concluam o envio ou até o
          prazo simulado de 14 dias expirar.
        </p>
      </div>

      {/* Explanatory Banner */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <h4 className="font-bold text-gray-900 mb-0.5">
              Como funciona o mecanismo Double-Blind?
            </h4>
            <p>
              O tutor avalia o anfitrião e suas instalações. O anfitrião avalia o comportamento do
              pet e a pontualidade do tutor. Ninguém lê a nota do outro antes de enviar a sua!
            </p>
          </div>
        </div>
      </div>

      {/* COMPLETED BOOKINGS LIST */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900">
          Estadias Concluídas Elegíveis para Avaliação
        </h2>

        {completedBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-500">
            Nenhuma estadia concluída no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {completedBookings.map((b) => {
              const list = listings.find((l) => l.id === b.listingId)
              const pet = pets.find((p) => p.id === b.petId)
              const tutor = users.find((u) => u.id === b.tutorId)
              const host = users.find((u) => u.id === list?.hostId)
              const reviewObj = reviews.find((r) => r.bookingId === b.id)

              const tutorHasReviewed = !!reviewObj?.tutorReview
              const hostHasReviewed = !!reviewObj?.hostReview
              const isRevealed = reviewObj?.isRevealed

              const canCurrentUserReview =
                currentUser.role === 'host' ? !hostHasReviewed : !tutorHasReviewed

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 card-shadow space-y-6"
                >
                  {/* Top card info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={list?.photos[0]}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-gray-900">{list?.title}</h3>
                          <Badge className="bg-[#E8F5E9] text-[#15803D] text-[10px] font-bold">
                            Concluída
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Hóspede: <strong>{pet?.name}</strong> • Período: {b.checkIn} a{' '}
                          {b.checkOut}
                        </p>
                        <p className="text-xs text-gray-400">
                          Tutor: {tutor?.name} • Anfitrião: {host?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canCurrentUserReview ? (
                        <Button
                          onClick={() => handleOpenReviewModal(b.id)}
                          className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl px-5 py-2.5 shadow-md btn-hover-effect flex items-center gap-1.5"
                        >
                          <Star className="w-4 h-4" />
                          {currentUser.role === 'host'
                            ? 'Avaliar Tutor & Pet'
                            : 'Avaliar Anfitrião'}
                        </Button>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 font-bold text-xs py-1.5 px-3">
                          ✓ Sua avaliação foi enviada
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Double Blind Status Box */}
                  <div className="bg-[#F8FAF8] rounded-2xl p-5 border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {isRevealed ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D] bg-[#E8F5E9] px-3 py-1 rounded-full">
                            <Unlock className="w-3.5 h-3.5" />
                            Avaliações Reveladas Publicamente
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                            <Lock className="w-3.5 h-3.5" />
                            Avaliação enviada — aguardando a outra parte para revelar
                          </div>
                        )}
                      </div>

                      {/* Demonstration Tool: Simulate Timer / Reveal */}
                      {!isRevealed && reviewObj && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => simulateDoubleBlindReveal(reviewObj.id)}
                          className="text-[11px] font-bold border-amber-300 text-amber-800 hover:bg-amber-50 rounded-xl flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Simular Fim dos 14 Dias (Revelar Agora)
                        </Button>
                      )}
                    </div>

                    {/* Both sides cards (Side by side when revealed, or blurred/locked when waiting) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tutor review */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700">
                              Avaliação do Tutor ({tutor?.name.split(' ')[0]})
                            </span>
                            {tutorHasReviewed ? (
                              <span className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Enviada
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-gray-400">
                                Pendente
                              </span>
                            )}
                          </div>

                          {tutorHasReviewed ? (
                            isRevealed ? (
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
                                  <span className="font-extrabold text-sm text-gray-900">
                                    {reviewObj?.tutorReview?.average.toFixed(1)}
                                  </span>
                                  <span className="text-gray-400">
                                    (Cuidado: {reviewObj?.tutorReview?.ratings.care}, Limpeza:{' '}
                                    {reviewObj?.tutorReview?.ratings.cleanliness}, Segurança:{' '}
                                    {reviewObj?.tutorReview?.ratings.safety})
                                  </span>
                                </div>
                                <p className="text-gray-700 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  "{reviewObj?.tutorReview?.comment}"
                                </p>
                              </div>
                            ) : (
                              <div className="p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-500 flex flex-col items-center gap-1.5">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span>Conteúdo protegido pelo mecanismo Double-Blind.</span>
                              </div>
                            )
                          ) : (
                            <p className="text-xs text-gray-400 py-3">
                              O tutor ainda não preencheu a avaliação.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Host review */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700">
                              Avaliação do Anfitrião ({host?.name.split(' ')[0]})
                            </span>
                            {hostHasReviewed ? (
                              <span className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Enviada
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-gray-400">
                                Pendente
                              </span>
                            )}
                          </div>

                          {hostHasReviewed ? (
                            isRevealed ? (
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
                                  <span className="font-extrabold text-sm text-gray-900">
                                    {reviewObj?.hostReview?.average.toFixed(1)}
                                  </span>
                                  <span className="text-gray-400">
                                    (Comportamento Pet: {reviewObj?.hostReview?.ratings.petBehavior}
                                    , Informações Vet:{' '}
                                    {reviewObj?.hostReview?.ratings.medicalAccuracy})
                                  </span>
                                </div>
                                <p className="text-gray-700 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  "{reviewObj?.hostReview?.comment}"
                                </p>
                              </div>
                            ) : (
                              <div className="p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-500 flex flex-col items-center gap-1.5">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span>Conteúdo protegido pelo mecanismo Double-Blind.</span>
                              </div>
                            )
                          ) : (
                            <p className="text-xs text-gray-400 py-3">
                              O anfitrião ainda não preencheu a avaliação.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL DE FORMULÁRIO DE AVALIAÇÃO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#EAB308]" />
              {currentUser.role === 'host'
                ? 'Avaliar Tutor e Hóspede Pet'
                : 'Avaliar Anfitrião e Acomodação'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Sua avaliação permanecerá sigilosa até que ambas as partes concluam.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-5 pt-3">
            {currentUser.role === 'host' ? (
              // HOST EVALUATION FORM
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Comportamento do Pet (Sociabilidade e Adaptação)
                  </Label>
                  {renderStarSelector(hostBehavior, setHostBehavior)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Precisão das Informações Médicas e Rotina
                  </Label>
                  {renderStarSelector(hostMedical, setHostMedical)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Pontualidade e Comunicação do Tutor
                  </Label>
                  {renderStarSelector(hostPunctuality, setHostPunctuality)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Comentário para o Tutor (Ficará oculto temporariamente) *
                  </Label>
                  <Textarea
                    rows={3}
                    placeholder="Conte como foi hospedar este pet e a convivência..."
                    value={hostComment}
                    onChange={(e) => setHostComment(e.target.value)}
                    className="rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            ) : (
              // TUTOR EVALUATION FORM
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Cuidado e Carinho com o Pet
                  </Label>
                  {renderStarSelector(tutorCare, setTutorCare)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Limpeza e Higiene do Espaço
                  </Label>
                  {renderStarSelector(tutorCleanliness, setTutorCleanliness)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Comunicação & Diário de Bordo com Fotos
                  </Label>
                  {renderStarSelector(tutorCommunication, setTutorCommunication)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Segurança das Instalações (Telas, Muros e Portões)
                  </Label>
                  {renderStarSelector(tutorSafety, setTutorSafety)}
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    Comentário para o Anfitrião (Ficará oculto temporariamente) *
                  </Label>
                  <Textarea
                    rows={3}
                    placeholder="Conte como seu pet foi recebido, se ficou feliz..."
                    value={tutorComment}
                    onChange={(e) => setTutorComment(e.target.value)}
                    className="rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl text-xs px-6"
              >
                Enviar Avaliação Sigilosa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
