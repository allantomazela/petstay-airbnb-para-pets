import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Heart,
  Dog,
  Cat,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PetsList() {
  const { pets, currentUser, deletePet } = useData()

  // Tutor's pets
  const myPets = pets.filter((p) => p.ownerId === currentUser.id)

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
              Perfil Obrigatório para Reservas
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Meus Pets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os dados médicos, comportamentais e carteira de vacinas dos seus bichinhos.
          </p>
        </div>

        <Link to="/pets/novo">
          <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-2xl px-5 py-6 shadow-md shadow-[#22C55E]/20 btn-hover-effect flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Cadastrar Novo Pet
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-4 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#15803D]">
          <strong>Dica Petbnb:</strong> Pets com vacinação V8/V10 e Raiva comprovadas têm acesso à{' '}
          <strong>Reserva Instantânea</strong>, além de maior taxa de aprovação imediata pelos
          anfitriões.
        </div>
      </div>

      {/* Pets Grid */}
      {myPets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 card-shadow max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center mx-auto mb-4">
            <Dog className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Você ainda não tem pets cadastrados
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Cadastre seu cão ou gato para poder reservar hospedagens e daycare com segurança.
          </p>
          <Link to="/pets/novo">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl">
              Cadastrar Agora
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-shadow card-hover-effect flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {pet.isVaccinated ? (
                      <Badge className="bg-[#E8F5E9] text-[#15803D] border border-[#C8E6C9] font-bold text-xs flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                        Vacinas em Dia
                      </Badge>
                    ) : (
                      <Badge className="bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] font-bold text-xs flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                        Vacina Pendente
                      </Badge>
                    )}

                    {pet.isNeutered && (
                      <Badge className="bg-white/90 text-gray-800 font-bold text-xs shadow-sm">
                        Castrado
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    {pet.species === 'gato' ? (
                      <Cat className="w-3 h-3" />
                    ) : (
                      <Dog className="w-3 h-3" />
                    )}
                    Porte {pet.size}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-extrabold text-gray-900">{pet.name}</h3>
                    <span className="text-xs font-semibold text-gray-500">{pet.age}</span>
                  </div>

                  <p className="text-xs text-[#4B5563] font-medium mb-3">
                    {pet.breed} • {pet.gender} • Nível de Energia:{' '}
                    <strong>{pet.energyLevel}</strong>
                  </p>

                  <div className="text-xs text-gray-600 space-y-1 mb-4 bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                    <p>
                      <strong>Clínica Vet:</strong> {pet.vetClinic}
                    </p>
                    <p>
                      <strong>Contato de Emergência:</strong> {pet.emergencyContact.name} (
                      {pet.emergencyContact.phone})
                    </p>
                    {pet.specialNeeds && (
                      <p className="text-amber-800">
                        <strong>Cuidados:</strong> {pet.specialNeeds}
                      </p>
                    )}
                  </div>

                  {/* Behavior Tags */}
                  <div className="flex flex-wrap gap-1">
                    {pet.behaviorTags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-[#E8F5E9] text-[#15803D] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-4">
                <Link to={`/pets/${pet.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold rounded-xl border-gray-200 hover:bg-[#E8F5E9] hover:text-[#15803D] flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Ficha Completa
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePet(pet.id)}
                  aria-label="Excluir pet"
                  className="rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
