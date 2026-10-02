import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { PetSpecies, PetSize, EnergyLevel } from '@/types'
import {
  PawPrint,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  Heart,
  Dog,
  Cat,
  PhoneCall,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'

const BEHAVIOR_PRESETS = [
  'Dócil com cães',
  'Bom com gatos',
  'Adora crianças',
  'Gosta de água',
  'Brincalhão',
  'Calmo e dorminhoco',
  'Acostumado a arranhadores',
  'Sabe comandos básicos',
  'Passeia bem na guia',
]

export default function NewPetForm() {
  const navigate = useNavigate()
  const { addPet } = useData()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const totalSteps = 4

  // Form State
  // Step 1: Identificação
  const [species, setSpecies] = useState<PetSpecies>('cachorro')
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [size, setSize] = useState<PetSize>('Médio')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'Macho' | 'Fêmea'>('Macho')
  const [isNeutered, setIsNeutered] = useState<boolean>(true)
  const [photoUrl, setPhotoUrl] = useState('')

  // Step 2: Saúde
  const [vetClinic, setVetClinic] = useState('')
  const [hasV8, setHasV8] = useState(true)
  const [hasRabies, setHasRabies] = useState(true)
  const [uploadedDocName, setUploadedDocName] = useState('')
  const [uploadError, setUploadError] = useState('')

  // Step 3: Comportamento
  const [selectedTags, setSelectedTags] = useState<string[]>(['Dócil com cães', 'Adora crianças'])
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('Médio')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [fearsAndTriggers, setFearsAndTriggers] = useState('')

  // Step 4: Emergência
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Validation state per step
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Nome do pet é obrigatório'
    if (!breed.trim()) errs.breed = 'Raça é obrigatória (ex: Vira-lata, Poodle...)'
    if (!age.trim()) errs.age = 'Idade é obrigatória (ex: 2 anos)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!vetClinic.trim()) errs.vetClinic = 'Clínica habitual é obrigatória para segurança'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = () => {
    // Tags and special needs optional
    setErrors({})
    return true
  }

  const validateStep4 = () => {
    const errs: Record<string, string> = {}
    if (!emergencyName.trim()) errs.emergencyName = 'Nome do contato é obrigatório'
    if (!emergencyPhone.trim()) errs.emergencyPhone = 'Telefone é obrigatório'
    if (!emergencyRelation.trim()) errs.emergencyRelation = 'Parentesco/Relação é obrigatório'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    setStep((prev) => Math.min(totalSteps, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrev = () => {
    setErrors({})
    setStep((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Simulated doc upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError('')
    if (!file) return

    // Validations: size max 5MB, pdf/jpg/png
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('O arquivo deve ter no máximo 5MB.')
      return
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato inválido. Envie PDF, PNG ou JPG.')
      return
    }

    setUploadedDocName(file.name)
    toast({
      title: 'Documento recebido! 📄',
      description: `Arquivo "${file.name}" anexado à carteira de vacinas.`,
    })
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep4()) return

    // Default image if not supplied
    const defaultPhoto =
      photoUrl.trim() ||
      (species === 'gato'
        ? 'https://img.usecurling.com/p/600/600?q=cat'
        : 'https://img.usecurling.com/p/600/600?q=dog')

    addPet({
      name,
      species,
      breed,
      size,
      age,
      gender,
      isNeutered,
      isVaccinated: hasV8 && hasRabies,
      vaccineCardUrl: uploadedDocName || 'carteira_vacina_padrao.pdf',
      vetClinic,
      behaviorTags: selectedTags,
      energyLevel,
      specialNeeds: specialNeeds.trim() || undefined,
      fearsAndTriggers: fearsAndTriggers.trim() || undefined,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRelation,
      },
      photo: defaultPhoto,
    })

    navigate('/pets')
  }

  const stepTitles = ['1. Identificação', '2. Saúde & Vacinas', '3. Comportamento', '4. Emergência']

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Step Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#E8F5E9] px-3 py-1 rounded-full">
          Cadastro de Pet
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight mt-2">
          {stepTitles[step - 1]}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Etapa {step} de {totalSteps} — Preencha com carinho para garantir o melhor atendimento.
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <Progress value={(step / totalSteps) * 100} className="h-2 bg-gray-200" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 card-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: IDENTIFICAÇÃO */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Espécie */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                  Espécie do Pet *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cachorro', label: 'Cachorro', icon: Dog },
                    { id: 'gato', label: 'Gato', icon: Cat },
                    { id: 'outro', label: 'Outro', icon: PawPrint },
                  ].map((s) => {
                    const Icon = s.icon
                    const isSelected = species === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSpecies(s.id as PetSpecies)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 font-bold text-sm transition-all ${
                          isSelected
                            ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D] ring-2 ring-[#22C55E]/30'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Nome */}
              <div>
                <Label htmlFor="pet-name" className="text-xs font-bold text-gray-700 block mb-1">
                  Nome do Pet *
                </Label>
                <Input
                  id="pet-name"
                  placeholder="Ex: Thor, Mia, Pipoca"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  className={`rounded-xl ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Raça e Idade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pet-breed" className="text-xs font-bold text-gray-700 block mb-1">
                    Raça *
                  </Label>
                  <Input
                    id="pet-breed"
                    placeholder="Ex: Golden, Siamês, SRD..."
                    value={breed}
                    onChange={(e) => {
                      setBreed(e.target.value)
                      if (errors.breed) setErrors({ ...errors, breed: '' })
                    }}
                    className={`rounded-xl ${errors.breed ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                  />
                  {errors.breed && <p className="text-xs text-red-600 mt-1">{errors.breed}</p>}
                </div>

                <div>
                  <Label htmlFor="pet-age" className="text-xs font-bold text-gray-700 block mb-1">
                    Idade *
                  </Label>
                  <Input
                    id="pet-age"
                    placeholder="Ex: 3 anos e meio"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value)
                      if (errors.age) setErrors({ ...errors, age: '' })
                    }}
                    className={`rounded-xl ${errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                  />
                  {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
                </div>
              </div>

              {/* Porte */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                  Porte do Pet *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Pequeno', desc: 'Até 10kg' },
                    { id: 'Médio', desc: '11kg a 25kg' },
                    { id: 'Grande', desc: 'Mais de 25kg' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSize(sz.id as PetSize)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        size === sz.id
                          ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D] ring-2 ring-[#22C55E]/30'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-sm">{sz.id}</p>
                      <p className="text-[11px] text-gray-400">{sz.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sexo e Castração */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-2">Sexo</Label>
                  <div className="flex gap-2">
                    {['Macho', 'Fêmea'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as 'Macho' | 'Fêmea')}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          gender === g
                            ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D]'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-2">Castrado?</Label>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: 'Sim' },
                      { val: false, label: 'Não' },
                    ].map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setIsNeutered(c.val)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isNeutered === c.val
                            ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D]'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Foto URL opcional */}
              <div className="pt-2">
                <Label htmlFor="pet-photo" className="text-xs font-bold text-gray-700 block mb-1">
                  URL da Foto do Pet (opcional)
                </Label>
                <Input
                  id="pet-photo"
                  placeholder="Deixe em branco para usar foto padrão"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="rounded-xl border-gray-200 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SAÚDE & VACINAS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#C8E6C9] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#15803D] leading-relaxed">
                  Para segurança de todos os hóspedes, os anfitriões exigem comprovação de vacinas
                  em dia.
                </p>
              </div>

              {/* Upload Simulado */}
              <div className="border-2 border-dashed border-gray-200 hover:border-[#22C55E] rounded-3xl p-6 text-center transition-colors">
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-800">Carteira de Vacinação do Pet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  Envie foto nítida ou PDF da caderneta contendo os carimbos das vacinas (Máx 5MB).
                </p>

                <label className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#15803D] hover:bg-[#d8eedb] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                  <span>Selecionar Arquivo</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedDocName && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <FileCheck className="w-4 h-4 text-[#22C55E]" />
                    <span>{uploadedDocName}</span>
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Checkboxes de Vacinas */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Vacinas Administradas no Último Ano:
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vac-v8"
                    checked={hasV8}
                    onCheckedChange={(checked) => setHasV8(!!checked)}
                  />
                  <label
                    htmlFor="vac-v8"
                    className="text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    V8 ou V10 / Quádrupla Felina (em dia)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vac-rabies"
                    checked={hasRabies}
                    onCheckedChange={(checked) => setHasRabies(!!checked)}
                  />
                  <label
                    htmlFor="vac-rabies"
                    className="text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    Antirrábica (em dia)
                  </label>
                </div>
              </div>

              {/* Clínica Veterinária */}
              <div>
                <Label htmlFor="vet-clinic" className="text-xs font-bold text-gray-700 block mb-1">
                  Clínica Veterinária Habitual *
                </Label>
                <Input
                  id="vet-clinic"
                  placeholder="Nome do hospital ou clínica que costuma atender seu pet"
                  value={vetClinic}
                  onChange={(e) => {
                    setVetClinic(e.target.value)
                    if (errors.vetClinic) setErrors({ ...errors, vetClinic: '' })
                  }}
                  className={`rounded-xl ${errors.vetClinic ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.vetClinic && (
                  <p className="text-xs text-red-600 mt-1">{errors.vetClinic}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: COMPORTAMENTO */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Nível de Energia */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                  Nível de Energia
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Baixo', desc: 'Dorme bastante, passeios curtos' },
                    { id: 'Médio', desc: 'Brincalhão, passeios moderados' },
                    { id: 'Alto', desc: 'Muita energia, precisa correr' },
                  ].map((en) => (
                    <button
                      key={en.id}
                      type="button"
                      onClick={() => setEnergyLevel(en.id as EnergyLevel)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        energyLevel === en.id
                          ? 'bg-[#E8F5E9] border-[#22C55E] text-[#15803D] ring-2 ring-[#22C55E]/30'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-sm">{en.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{en.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags de Socialização */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                  Tags Comportamentais (Selecione as que combinam)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {BEHAVIOR_PRESETS.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#15803D] text-white border-[#15803D]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Necessidades especiais */}
              <div>
                <Label
                  htmlFor="special-needs"
                  className="text-xs font-bold text-gray-700 block mb-1"
                >
                  Necessidades Especiais ou Rotina Alimentar
                </Label>
                <Textarea
                  id="special-needs"
                  rows={2}
                  placeholder="Ex: Ração especial 2x ao dia, colírio pela manhã, não pode comer petiscos de frango..."
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  className="rounded-xl border-gray-200 text-xs"
                />
              </div>

              {/* Medos e Gatilhos */}
              <div>
                <Label htmlFor="fears" className="text-xs font-bold text-gray-700 block mb-1">
                  Medos e Gatilhos Conhecidos
                </Label>
                <Input
                  id="fears"
                  placeholder="Ex: Trovões fortes, fogos de artifício, aspirador de pó..."
                  value={fearsAndTriggers}
                  onChange={(e) => setFearsAndTriggers(e.target.value)}
                  className="rounded-xl border-gray-200 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 4: CONTATO DE EMERGÊNCIA */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-[#FEF3C7] p-4 rounded-2xl border border-[#FDE68A] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#B45309] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#B45309] leading-relaxed">
                  O contato de emergência é acionado caso você esteja inacessível durante a estadia.
                  Pode ser um parente, amigo próximo ou o próprio veterinário de confiança.
                </p>
              </div>

              <div>
                <Label htmlFor="em-name" className="text-xs font-bold text-gray-700 block mb-1">
                  Nome do Contato de Emergência *
                </Label>
                <Input
                  id="em-name"
                  placeholder="Ex: Dr. Fernando ou Juliana Mendes"
                  value={emergencyName}
                  onChange={(e) => {
                    setEmergencyName(e.target.value)
                    if (errors.emergencyName) setErrors({ ...errors, emergencyName: '' })
                  }}
                  className={`rounded-xl ${errors.emergencyName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.emergencyName && (
                  <p className="text-xs text-red-600 mt-1">{errors.emergencyName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="em-phone" className="text-xs font-bold text-gray-700 block mb-1">
                  Telefone / WhatsApp *
                </Label>
                <Input
                  id="em-phone"
                  placeholder="Ex: (11) 98111-2233"
                  value={emergencyPhone}
                  onChange={(e) => {
                    setEmergencyPhone(e.target.value)
                    if (errors.emergencyPhone) setErrors({ ...errors, emergencyPhone: '' })
                  }}
                  className={`rounded-xl ${errors.emergencyPhone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.emergencyPhone && (
                  <p className="text-xs text-red-600 mt-1">{errors.emergencyPhone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="em-relation" className="text-xs font-bold text-gray-700 block mb-1">
                  Relação com o Tutor ou Pet *
                </Label>
                <Input
                  id="em-relation"
                  placeholder="Ex: Veterinário titular, Irmã, Vizinho..."
                  value={emergencyRelation}
                  onChange={(e) => {
                    setEmergencyRelation(e.target.value)
                    if (errors.emergencyRelation) setErrors({ ...errors, emergencyRelation: '' })
                  }}
                  className={`rounded-xl ${errors.emergencyRelation ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.emergencyRelation && (
                  <p className="text-xs text-red-600 mt-1">{errors.emergencyRelation}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="rounded-xl border-gray-200 text-gray-700 font-bold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl px-6 flex items-center gap-1.5 btn-hover-effect"
              >
                Próxima Etapa
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#15803D] hover:bg-[#166534] text-white font-extrabold rounded-xl px-8 shadow-md btn-hover-effect"
              >
                Finalizar e Salvar Pet
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
