import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  PawPrint,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  FileText,
  Phone,
  Heart,
  Dog,
  Cat,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PetDetails() {
  const { id } = useParams<{ id: string }>()
  const { pets } = useData()
  const navigate = useNavigate()

  const pet = pets.find((p) => p.id === id)

  if (!pet) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pet não encontrado</h2>
        <p className="text-sm text-gray-500 mb-6">Este pet não existe ou foi excluído.</p>
        <Link to="/pets">
          <Button className="bg-[#22C55E] text-white">Voltar para Meus Pets</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden card-shadow">
        {/* Header with Photo */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-gray-100">
          <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                {pet.species}
              </span>
              <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                Porte {pet.size}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold">{pet.name}</h1>
            <p className="text-xs text-white/90">
              {pet.breed} • {pet.age} • {pet.gender}
            </p>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Status Geral */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#F8FAF8] p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Castrado</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                {pet.isNeutered ? 'Sim' : 'Não'}
              </p>
            </div>
            <div className="bg-[#F8FAF8] p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Vacinação</p>
              <p
                className={`text-sm font-bold mt-1 ${pet.isVaccinated ? 'text-[#15803D]' : 'text-red-600'}`}
              >
                {pet.isVaccinated ? '100% Em Dia' : 'Pendente'}
              </p>
            </div>
            <div className="bg-[#F8FAF8] p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Energia</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{pet.energyLevel}</p>
            </div>
            <div className="bg-[#F8FAF8] p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Avaliação</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                ⭐ {pet.rating?.toFixed(1) || '5.0'}
              </p>
            </div>
          </div>

          {/* Ficha Médica */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              Ficha Médica & Vacinação
            </h3>
            <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="font-semibold text-gray-500">Clínica Veterinária Habitual:</span>
                <span className="font-bold text-gray-900">{pet.vetClinic}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="font-semibold text-gray-500">Documento de Vacina:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                  {pet.vaccineCardUrl || 'carteira_vacinas.pdf'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="font-semibold text-gray-500">Vacinas V8/V10 e Raiva:</span>
                <span className="text-[#15803D] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Comprovadas
                </span>
              </div>
              {pet.specialNeeds && (
                <div className="pt-2">
                  <span className="font-bold text-amber-800 block mb-0.5">
                    Instruções Especiais / Medicamentos:
                  </span>
                  <p className="text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    {pet.specialNeeds}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comportamento e Hábitos */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#22C55E]" />
              Comportamento & Convivência
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {pet.behaviorTags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-[#E8F5E9] text-[#15803D] px-3 py-1 rounded-full"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
            {pet.fearsAndTriggers && (
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                <strong>Gatilhos ou medos informados:</strong> {pet.fearsAndTriggers}
              </p>
            )}
          </div>

          {/* Contato de Emergência */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#22C55E]" />
              Contato de Emergência
            </h3>
            <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">{pet.emergencyContact.name}</p>
                <p className="text-xs text-gray-500">{pet.emergencyContact.relationship}</p>
              </div>
              <a
                href={`tel:${pet.emergencyContact.phone}`}
                className="text-xs font-bold text-[#15803D] bg-white border border-[#C8E6C9] px-3 py-2 rounded-xl shadow-sm hover:bg-[#E8F5E9] transition-colors"
              >
                {pet.emergencyContact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
