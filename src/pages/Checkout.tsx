import React, { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  ShieldCheck,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  Dog,
  Cat,
  Plus,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'

export default function Checkout() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { listings, pets, currentUser, createBooking } = useData()
  const { toast } = useToast()

  const listing = listings.find((l) => l.id === id) || listings[0]

  // Query parameters
  const checkIn = searchParams.get('checkIn') || '2025-05-20'
  const checkOut = searchParams.get('checkOut') || '2025-05-24'
  const petsCountParam = parseInt(searchParams.get('petsCount') || '1', 10)
  const nightsParam = parseInt(searchParams.get('nights') || '4', 10)

  // User pets
  const userPets = pets.filter((p) => p.ownerId === currentUser.id)

  // Form State
  const [selectedPetId, setSelectedPetId] = useState<string>(userPets[0]?.id || '')
  const [healthInstructions, setHealthInstructions] = useState('')
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)

  // Payment mock fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cost calculations
  const baseCost = listing.pricePerNight * nightsParam
  const petExtraFee = petsCountParam > 1 ? (petsCountParam - 1) * 35 * nightsParam : 0
  const serviceFee = Number(
    ((baseCost + petExtraFee) * (listing.serviceFeePercent / 100)).toFixed(2),
  )
  const totalAmount = baseCost + petExtraFee + listing.cleaningFee + serviceFee

  // Selected pet object
  const selectedPet = userPets.find((p) => p.id === selectedPetId)
  const isPetVaccinated = selectedPet ? selectedPet.isVaccinated : false

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
  }

  // Format Card Expiry (MM/AA)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    setCardExpiry(value)
  }

  // Format CVV (3-4 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvv(value)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!selectedPetId) errs.pet = 'Selecione o pet que irá se hospedar'
    if (selectedPet && !selectedPet.isVaccinated) {
      errs.pet = 'Este pet está com vacinas pendentes. Atualize o perfil do pet antes de reservar.'
    }
    if (!acceptedPolicy) {
      errs.policy = 'É obrigatório aceitar a política de cancelamento'
    }

    // Payment validation
    const cleanCard = cardNumber.replace(/\s/g, '')
    if (cleanCard.length < 16) errs.cardNumber = 'Número de cartão inválido (16 dígitos)'
    if (!cardHolder.trim()) errs.cardHolder = 'Nome impresso no cartão é obrigatório'
    if (!cardExpiry || cardExpiry.length < 5) errs.cardExpiry = 'Validade inválida (MM/AA)'
    if (!cardCvv || cardCvv.length < 3) errs.cardCvv = 'CVV inválido'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    setTimeout(() => {
      // Determine initial status: if instant book, confirmed; otherwise pending
      const initialStatus = listing.isInstantBook ? 'confirmed' : 'pending'

      const newBooking = createBooking({
        listingId: listing.id,
        tutorId: currentUser.id,
        petId: selectedPetId,
        checkIn,
        checkOut,
        nights: nightsParam,
        petsCount: petsCountParam,
        pricePerNight: listing.pricePerNight,
        baseTotal: baseCost,
        petExtraFee,
        cleaningFee: listing.cleaningFee,
        serviceFee,
        securityDeposit: listing.securityDeposit,
        totalAmount,
        status: initialStatus,
        cancellationPolicy: listing.cancellationPolicy,
        healthInstructions: healthInstructions.trim() || undefined,
      })

      setIsSubmitting(false)
      toast({
        title: listing.isInstantBook
          ? '🎉 Reserva Confirmada!'
          : 'Solicitação enviada ao anfitrião!',
        description: listing.isInstantBook
          ? 'Sua estadia foi confirmada com sucesso! Você já pode conversar com o host.'
          : 'O anfitrião tem até 24h para responder à solicitação.',
      })

      navigate('/reservations')
    }, 800)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para a acomodação
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight mb-8">
        Confirmar e Pagar Hospedagem
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP A: Seleção de Pet */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  1. Selecione o Pet que vai se hospedar
                </h2>
                <p className="text-xs text-gray-500">
                  Apenas pets com carteira de vacinas regularizada podem ser selecionados.
                </p>
              </div>
              <Link to="/pets/novo">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#22C55E] text-[#15803D] hover:bg-[#E8F5E9] text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Pet
                </Button>
              </Link>
            </div>

            {userPets.length === 0 ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
                Você não possui nenhum pet cadastrado.{' '}
                <Link to="/pets/novo" className="underline font-bold">
                  Cadastre seu pet agora
                </Link>{' '}
                para poder prosseguir.
              </div>
            ) : (
              <RadioGroup
                value={selectedPetId}
                onValueChange={(val) => {
                  setSelectedPetId(val)
                  if (errors.pet) setErrors({ ...errors, pet: '' })
                }}
                className="space-y-3 pt-2"
              >
                {userPets.map((p) => (
                  <label
                    key={p.id}
                    htmlFor={`pet-radio-${p.id}`}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPetId === p.id
                        ? 'border-[#22C55E] bg-[#E8F5E9]/50 ring-2 ring-[#22C55E]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={p.id} id={`pet-radio-${p.id}`} />
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          {p.breed} • {p.age} • Porte {p.size}
                        </p>
                      </div>
                    </div>

                    <div>
                      {p.isVaccinated ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Vacinas Ok
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Vacina Pendente
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}

            {errors.pet && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.pet}
              </p>
            )}
          </div>

          {/* STEP B: Instruções de Saúde Opcionais */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              2. Instruções de Saúde & Cuidados (Opcional)
            </h2>
            <p className="text-xs text-gray-500">
              Avise o anfitrião sobre alergias, medicamentos, horários de refeição ou preferências
              do seu pet.
            </p>
            <Textarea
              rows={3}
              placeholder="Ex: Levará ração própria na mochila; tomar metade de um comprimido para articulação às 10h; não soltar perto de outros cães machos sem supervisão..."
              value={healthInstructions}
              onChange={(e) => setHealthInstructions(e.target.value)}
              className="rounded-2xl border-gray-200 text-xs"
            />
          </div>

          {/* STEP C: Política de Cancelamento */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              3. Política de Cancelamento: {listing.cancellationPolicy}
            </h2>
            <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
              {listing.cancellationPolicy === 'Flexível' && (
                <p>
                  <strong>Cancelamento Flexível:</strong> Reembolso integral se cancelado até 24
                  horas antes do horário de check-in (14h do dia {checkIn}). Cancelamentos
                  posteriores têm reembolso de 50% das diárias não utilizadas, deduzida a taxa de
                  limpeza.
                </p>
              )}
              {listing.cancellationPolicy === 'Moderada' && (
                <p>
                  <strong>Cancelamento Moderado:</strong> Reembolso de 100% até 5 dias antes do
                  check-in. Menos de 5 dias recebe 50% do valor total da reserva.
                </p>
              )}
              {listing.cancellationPolicy === 'Rigorosa' && (
                <p>
                  <strong>Cancelamento Rigoroso:</strong> Reembolso integral somente para
                  cancelamentos feitos com pelo menos 14 dias de antecedência. Menos de 7 dias não
                  há reembolso.
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="policy-accept"
                checked={acceptedPolicy}
                onCheckedChange={(checked) => {
                  setAcceptedPolicy(!!checked)
                  if (errors.policy) setErrors({ ...errors, policy: '' })
                }}
              />
              <label
                htmlFor="policy-accept"
                className="text-xs text-gray-700 leading-normal cursor-pointer"
              >
                Li e concordo com a{' '}
                <strong>Política de Cancelamento ({listing.cancellationPolicy})</strong> e com as
                regras de aceitação de animais deste anfitrião.
              </label>
            </div>
            {errors.policy && <p className="text-xs text-red-600">{errors.policy}</p>}
          </div>

          {/* STEP D: Pagamento Mock */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#22C55E]" />
                4. Dados do Pagamento Seguro
              </h2>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#15803D]" /> Criptografia 256-bit
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <Label htmlFor="card-number" className="text-xs font-bold text-gray-700 block mb-1">
                  Número do Cartão de Crédito
                </Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="4532 •••• •••• 8890"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`rounded-xl text-sm font-mono ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.cardNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="card-holder" className="text-xs font-bold text-gray-700 block mb-1">
                  Nome Impresso no Cartão
                </Label>
                <Input
                  id="card-holder"
                  placeholder="CAROLINA MENDES"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className={`rounded-xl text-sm ${errors.cardHolder ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.cardHolder && (
                  <p className="text-xs text-red-600 mt-1">{errors.cardHolder}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="card-expiry"
                    className="text-xs font-bold text-gray-700 block mb-1"
                  >
                    Validade (MM/AA)
                  </Label>
                  <Input
                    id="card-expiry"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className={`rounded-xl text-sm font-mono ${errors.cardExpiry ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.cardExpiry && (
                    <p className="text-xs text-red-600 mt-1">{errors.cardExpiry}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="card-cvv" className="text-xs font-bold text-gray-700 block mb-1">
                    Código CVV
                  </Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={handleCvvChange}
                    className={`rounded-xl text-sm font-mono ${errors.cardCvv ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.cardCvv && <p className="text-xs text-red-600 mt-1">{errors.cardCvv}</p>}
                </div>
              </div>
            </div>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmReservation}
              className="w-full mt-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold py-6 rounded-2xl shadow-lg shadow-[#22C55E]/30 btn-hover-effect text-base"
            >
              {isSubmitting ? 'Processando Reserva...' : 'Confirmar Reserva e Concluir'}
            </Button>
          </div>
        </div>

        {/* Right Column: Reservation Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-3xl p-6 border border-gray-100 card-shadow space-y-6">
            {/* Listing mini summary */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              />
              <div>
                <span className="text-[11px] font-semibold text-[#15803D] uppercase">
                  {listing.spaceType}
                </span>
                <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{listing.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {listing.address.neighborhood}, {listing.address.city}
                </p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3 text-xs border-b border-gray-100 pb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-500">Datas da Hospedagem:</span>
                <span className="font-bold text-gray-900">
                  {checkIn} até {checkOut} ({nightsParam} {nightsParam === 1 ? 'noite' : 'noites'})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-500">Quantidade de Pets:</span>
                <span className="font-bold text-gray-900">
                  {petsCountParam} {petsCountParam === 1 ? 'pet' : 'pets'}
                </span>
              </div>
              {selectedPet && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Pet Selecionado:</span>
                  <span className="font-bold text-[#15803D]">{selectedPet.name}</span>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 border-b border-gray-100 pb-5">
              <div className="flex justify-between">
                <span>
                  R$ {listing.pricePerNight} × {nightsParam} noites
                </span>
                <span className="font-semibold text-gray-800">R$ {baseCost.toFixed(2)}</span>
              </div>

              {petsCountParam > 1 && (
                <div className="flex justify-between">
                  <span>Taxa adicional ({petsCountParam - 1} pet extra)</span>
                  <span className="font-semibold text-gray-800">R$ {petExtraFee.toFixed(2)}</span>
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

              <div className="flex justify-between text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Depósito caução reembolsável
                </span>
                <span className="font-bold">R$ {listing.securityDeposit.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-base font-extrabold text-gray-900 block">Total a Pagar</span>
                <span className="text-[11px] text-gray-400">Em até 3x sem juros no cartão</span>
              </div>
              <span className="text-2xl font-extrabold text-[#15803D]">
                R$ {totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] flex items-center gap-2 text-[11px] text-[#15803D]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Garantia Veterinária Petbnb:</strong> Atendimento emergencial coberto
                durante todo o período da estadia.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
