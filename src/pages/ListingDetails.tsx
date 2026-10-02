import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  Star,
  MapPin,
  ShieldCheck,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Trees,
  Waves,
  Video,
  Wind,
  Stethoscope,
  Sparkles,
  Info,
  Calendar,
  CheckCircle,
  XCircle,
  HelpCircle,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>()
  const { listings, users, pets, currentUser, searchFilters } = useData()
  const navigate = useNavigate()

  const listing = listings.find((l) => l.id === id) || listings[0]
  const host = users.find((u) => u.id === listing.hostId) || users[1]

  // Image gallery states
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [hostModalOpen, setHostModalOpen] = useState(false)

  // Booking dynamic calculator states
  const [checkIn, setCheckIn] = useState(searchFilters.checkIn || '2025-05-20')
  const [checkOut, setCheckOut] = useState(searchFilters.checkOut || '2025-05-24')
  const [petsCount, setPetsCount] = useState(1)

  // Calculate nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkIn)
      const d2 = new Date(checkOut)
      const diffTime = Math.abs(d2.getTime() - d1.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 1
    } catch {
      return 1
    }
  }

  const nights = calculateNights()
  const baseCost = listing.pricePerNight * nights
  const extraPetFee = petsCount > 1 ? (petsCount - 1) * 35 * nights : 0
  const serviceFee = Number(
    ((baseCost + extraPetFee) * (listing.serviceFeePercent / 100)).toFixed(2),
  )
  const totalCost = baseCost + extraPetFee + listing.cleaningFee + serviceFee

  // Instant Book Eligibility: check if user has at least one pet with vaccine & 5-star rating
  const userPets = pets.filter((p) => p.ownerId === currentUser.id)
  const hasEligiblePet = userPets.some((p) => p.isVaccinated && (p.rating || 5) >= 4.9)

  const handleBookClick = () => {
    // Navigate to checkout with query params
    navigate(
      `/checkout/${listing.id}?checkIn=${checkIn}&checkOut=${checkOut}&petsCount=${petsCount}&nights=${nights}`,
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Explorar
        </Link>
      </div>

      {/* Title Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className="bg-[#FEF3C7] text-[#B45309] font-bold text-xs flex items-center gap-1 border border-[#FDE68A]">
            <Award className="w-3.5 h-3.5 fill-[#B45309]" />
            Super Host Verificado
          </Badge>
          {listing.isInstantBook && (
            <Badge className="bg-[#E8F5E9] text-[#15803D] font-bold text-xs flex items-center gap-1 border border-[#C8E6C9]">
              <Zap className="w-3 h-3 fill-[#15803D]" />
              Reserva Instantânea
            </Badge>
          )}
          <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full">
            {listing.spaceType}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          {listing.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
            <span className="font-bold text-gray-900">{listing.rating.toFixed(2)}</span>
            <span className="text-gray-400">({listing.reviewsCount} avaliações de tutores)</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-4 h-4 text-[#22C55E]" />
            <span>
              {listing.address.street}, {listing.address.neighborhood}, {listing.address.city} -{' '}
              {listing.address.state}
            </span>
          </div>
        </div>
      </div>

      {/* IMAGE GALLERY & LIGHTBOX TRIGGER */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden relative group">
          {/* Main Large Photo */}
          <div className="md:col-span-3 aspect-[16/10] md:aspect-[16/9] bg-gray-100 relative overflow-hidden">
            <img
              src={listing.photos[activePhotoIndex]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Navigation arrows on main photo */}
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === 0 ? listing.photos.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === listing.photos.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {activePhotoIndex + 1} / {listing.photos.length}
            </div>

            {/* View all photos button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Ver todas as fotos ({listing.photos.length})
            </button>
          </div>

          {/* Thumbnails desktop column */}
          <div className="hidden md:flex flex-col gap-3">
            {listing.photos.slice(0, 3).map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative flex-1 rounded-2xl overflow-hidden border-2 transition-all ${
                  activePhotoIndex === idx
                    ? 'border-[#22C55E] ring-2 ring-[#22C55E]/30'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnails mobile row */}
        <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-1">
          {listing.photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 ${
                activePhotoIndex === idx ? 'border-[#22C55E]' : 'border-transparent opacity-70'
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 text-white border-none rounded-3xl">
          <DialogHeader className="p-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-white text-base font-bold">
              Galeria de Fotos — {listing.title}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[16/10] w-full max-h-[75vh] flex items-center justify-center">
            <img
              src={listing.photos[activePhotoIndex]}
              alt=""
              className="max-h-full max-w-full object-contain rounded-xl"
            />
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === 0 ? listing.photos.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === listing.photos.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          <div className="p-4 flex justify-center gap-2 overflow-x-auto">
            {listing.photos.map((ph, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 ${
                  activePhotoIndex === idx ? 'border-[#22C55E]' : 'opacity-50'
                }`}
              >
                <img src={ph} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* TWO COLUMN GRID: Details & Sticky Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Host Card Mini */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={host.avatar}
                alt={host.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#22C55E]/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-gray-900">{host.name}</h3>
                  <Badge className="bg-[#E8F5E9] text-[#15803D] text-[10px] font-bold border-none">
                    Identidade Verificada
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Anfitrião Pet desde {host.joinedDate} • ⭐ {host.rating} ({host.reviewsCount}{' '}
                  avaliações)
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setHostModalOpen(true)}
              className="rounded-2xl border-gray-200 text-xs font-bold text-gray-700 hover:bg-[#E8F5E9] hover:text-[#15803D]"
            >
              Ver perfil completo do host
            </Button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">Sobre esta acomodação</h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Comodidades Pet (Grade de Ícones) */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              Comodidades Pet Oferecidas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'quintal fechado', label: 'Quintal Murado & Fechado', icon: Trees },
                { name: 'tela de proteção', label: 'Telas em 100% das Janelas', icon: ShieldCheck },
                { name: 'ar-condicionado', label: 'Ambiente Climatizado', icon: Wind },
                { name: 'piscina pet', label: 'Piscina Pet Exclusiva', icon: Waves },
                { name: 'câmeras 24h', label: 'Câmeras 24h com Acesso', icon: Video },
                {
                  name: 'veterinário a 5 min',
                  label: 'Clínica Veterinária a 5 min',
                  icon: Stethoscope,
                },
                { name: 'sem plantas tóxicas', label: 'Zero Plantas Tóxicas', icon: CheckCircle },
                {
                  name: 'sem outros animais',
                  label: 'Sem Outros Animais no Local',
                  icon: Sparkles,
                },
              ].map((item, i) => {
                const Icon = item.icon
                const hasAmenity = listing.amenities.includes(item.name)
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                      hasAmenity
                        ? 'bg-white border-gray-200 text-gray-800'
                        : 'bg-gray-50/60 border-dashed border-gray-200 text-gray-400 opacity-60'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${hasAmenity ? 'text-[#22C55E]' : 'text-gray-300'}`}
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Regras Explícitas de Aceitação */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              Regras e Condições de Aceitação de Pets
            </h2>
            <div className="bg-[#F8FAF8] rounded-3xl p-6 border border-gray-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Máximo de pets simultâneos:</span>
                  <span className="font-bold text-gray-900">{listing.rules.maxPets} pets</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Portes permitidos:</span>
                  <span className="font-bold text-gray-900">
                    {listing.rules.allowedSizes.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Aceita fêmeas no cio:</span>
                  <span className="font-bold flex items-center gap-1">
                    {listing.rules.acceptsFemalesInHeat ? (
                      <span className="text-[#15803D] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Sim
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Não
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Aceita pets não castrados:</span>
                  <span className="font-bold">
                    {listing.rules.acceptsNonNeutered ? (
                      <span className="text-[#15803D] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Sim
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Não
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Aceita filhotes:</span>
                  <span className="font-bold">
                    {listing.rules.acceptsPuppies ? (
                      <span className="text-[#15803D] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Sim
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Não
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Altura mínima dos muros:</span>
                  <span className="font-bold text-gray-900">
                    {listing.rules.fenceHeightMeters}m
                  </span>
                </div>
              </div>

              {/* Informação sobre plantas tóxicas */}
              <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] flex items-center gap-2 text-xs text-[#15803D]">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Inspeção Botânica:</strong> Este espaço é livre de plantas tóxicas como
                  Espada-de-São-Jorge, Comigo-Ninguém-Pode e Costela-de-Adão.
                </span>
              </div>
            </div>
          </div>

          {/* Localização & Mapa Estático Mock */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Localização</h2>
            <p className="text-xs text-gray-500 mb-4">
              {listing.address.neighborhood}, {listing.address.city} - {listing.address.state} (O
              endereço exato é enviado após a confirmação da reserva).
            </p>
            <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
              <div className="relative z-10 flex flex-col items-center gap-2 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900">{listing.address.neighborhood}</p>
                  <p className="text-[11px] text-gray-500">
                    {listing.address.city}, {listing.address.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Política de Cancelamento */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Política de Cancelamento: {listing.cancellationPolicy}
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100">
              {listing.cancellationPolicy === 'Flexível' &&
                'Reembolso integral se cancelado até 24h antes do início do check-in. Cancelamentos posteriores reembolsam 50% das noites restantes.'}
              {listing.cancellationPolicy === 'Moderada' &&
                'Reembolso integral até 5 dias antes do check-in. Após esse período, reembolso de 50% do valor total.'}
              {listing.cancellationPolicy === 'Rigorosa' &&
                'Reembolso integral só até 14 dias antes do check-in. Não há reembolso para cancelamentos feitos com menos de 7 dias de antecedência.'}
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Booking Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-2xl font-extrabold text-gray-900">
                  R$ {listing.pricePerNight}
                </span>
                <span className="text-xs text-gray-500"> / diária</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                <span className="font-bold text-gray-800">{listing.rating.toFixed(2)}</span>
                <span className="text-gray-400">({listing.reviewsCount})</span>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-3 bg-gray-50/50">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    CHECK-IN
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
                <div className="p-3 bg-gray-50/50">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    CHECK-OUT
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pets Count */}
              <div className="p-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-gray-400">PETS</span>
                  <span className="font-bold text-gray-800">
                    {petsCount} {petsCount === 1 ? 'Pet' : 'Pets'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={petsCount <= 1}
                    onClick={() => setPetsCount((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold text-xs">{petsCount}</span>
                  <button
                    type="button"
                    disabled={petsCount >= listing.rules.maxPets}
                    onClick={() => setPetsCount((p) => p + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>
                  R$ {listing.pricePerNight} × {nights} {nights === 1 ? 'noite' : 'noites'}
                </span>
                <span className="font-semibold text-gray-800">R$ {baseCost.toFixed(2)}</span>
              </div>

              {petsCount > 1 && (
                <div className="flex justify-between">
                  <span>Taxa adicional ({petsCount - 1} pet extra)</span>
                  <span className="font-semibold text-gray-800">R$ {extraPetFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxa de limpeza pet</span>
                <span className="font-semibold text-gray-800">
                  R$ {listing.cleaningFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de serviço da plataforma ({listing.serviceFeePercent}%)</span>
                <span className="font-semibold text-gray-800">R$ {serviceFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Depósito caução (bloqueio temporário)
                </span>
                <span className="font-bold">R$ {listing.securityDeposit.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-900 block">Total Estimado</span>
                <span className="text-[11px] text-gray-400">Inclui taxas e limpeza</span>
              </div>
              <span className="text-2xl font-extrabold text-[#15803D]">
                R$ {totalCost.toFixed(2)}
              </span>
            </div>

            {/* CTA Button */}
            {listing.isInstantBook ? (
              hasEligiblePet ? (
                <Button
                  onClick={handleBookClick}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold py-6 rounded-2xl shadow-lg shadow-[#22C55E]/30 btn-hover-effect flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  Reservar Agora (Instantânea)
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-bold py-6 rounded-2xl cursor-not-allowed"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Reserva Instantânea Indisponível
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs p-3 bg-gray-900 text-white rounded-xl">
                      Para usar a Reserva Instantânea, seu pet precisa ter carteira de vacinas em
                      dia e avaliação mínima de 5 estrelas. Você pode cadastrar um pet ou enviar
                      solicitação sob consulta.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            ) : (
              <Button
                onClick={handleBookClick}
                className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-extrabold py-6 rounded-2xl shadow-lg btn-hover-effect"
              >
                Solicitar Reserva (Resposta em 24h)
              </Button>
            )}

            <p className="text-[11px] text-center text-gray-400">
              Você ainda não será cobrado nesta etapa.
            </p>
          </div>
        </div>
      </div>

      {/* HOST PROFILE MODAL */}
      <Dialog open={hostModalOpen} onOpenChange={setHostModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#22C55E]" />
              Perfil do Anfitrião
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Informações verificadas pela equipe de segurança do Petbnb.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100">
              <img
                src={host.avatar}
                alt={host.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#22C55E]"
              />
              <div>
                <h4 className="font-bold text-base text-gray-900">{host.name}</h4>
                <p className="text-xs text-[#15803D] font-semibold">
                  ⭐ {host.rating} • {host.reviewsCount} avaliações positivas
                </p>
                <p className="text-[11px] text-gray-400">Membro desde {host.joinedDate}</p>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Biografia & Experiência
              </h5>
              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                {host.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] text-[#15803D] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Identidade Checada
              </div>
              <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] text-[#15803D] font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Vistoria Presencial
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
