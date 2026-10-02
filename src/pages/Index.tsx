import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { SearchBar } from '@/components/SearchBar'
import { ListingCard } from '@/components/ListingCard'
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Award,
  Video,
  Trees,
  Waves,
  Cross,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  FilterX,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const PET_CATEGORIES = [
  { id: '', label: 'Todas as Acomodações', icon: Home },
  { id: 'Com Quintal Gramado', label: 'Com Quintal Gramado', icon: Trees },
  { id: 'Telas de Proteção', label: 'Telas de Proteção', icon: ShieldCheck },
  { id: 'Sem Outros Animais', label: 'Sem Outros Animais', icon: Heart },
  { id: 'Veterinário 24h Perto', label: 'Veterinário 24h Perto', icon: Stethoscope },
  { id: 'Piscina Pet', label: 'Piscina Pet', icon: Waves },
  { id: 'Câmeras 24h', label: 'Câmeras 24h', icon: Video },
]

export default function Index() {
  const { listings, searchFilters, setSearchFilters } = useData()
  const [selectedType, setSelectedType] = useState<string>('all')

  // Filter listings based on searchFilters & category
  const filteredListings = listings.filter((item) => {
    if (item.status === 'paused') return false

    // Category filter
    if (searchFilters.selectedCategory && !item.features.includes(searchFilters.selectedCategory)) {
      return false
    }

    // Space type filter
    if (selectedType !== 'all' && item.spaceType !== selectedType) {
      return false
    }

    // Location filter
    if (searchFilters.location) {
      const q = searchFilters.location.toLowerCase()
      const inCity = item.address.city.toLowerCase().includes(q)
      const inNeigh = item.address.neighborhood.toLowerCase().includes(q)
      const inState = item.address.state.toLowerCase().includes(q)
      if (!inCity && !inNeigh && !inState) return false
    }

    return true
  })

  const handleSelectCategory = (catId: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      selectedCategory: prev.selectedCategory === catId ? '' : catId,
    }))
  }

  const clearFilters = () => {
    setSearchFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      dogsCount: 1,
      catsCount: 0,
      selectedCategory: '',
    })
    setSelectedType('all')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F5E9] via-[#F0FDF4] to-[#F8FAF8] pt-12 pb-24 md:pt-16 md:pb-28">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#15803D]/10 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#22C55E]/20 shadow-sm mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-xs font-bold text-[#15803D]">
              Mais de 15.000 pets hospedados com carinho & segurança
            </span>
          </div>

          {/* Hero Headings */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight max-w-3xl mx-auto leading-[1.15] mb-4">
            Encontre o lar perfeito para o seu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15803D] via-[#22C55E] to-[#16A34A]">
              melhor amigo
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Hospedagem familiar, daycare e cuidadores verificados com diário de fotos em tempo real
            e cobertura veterinária.
          </p>

          {/* Floating Search Bar */}
          <div className="relative z-20">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {PET_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = searchFilters.selectedCategory === cat.id
              return (
                <button
                  key={cat.id || 'all'}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#15803D] text-white border-[#15803D] shadow-md shadow-[#15803D]/20 scale-[1.02]'
                      : 'bg-white text-[#4B5563] border-gray-200 hover:border-[#22C55E] hover:text-[#15803D]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E8F5E9] text-[#15803D]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Space type subfilter */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Tipo de espaço:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'Hospedagem domiciliar', label: 'Hospedagem Domiciliar' },
                  { id: 'Daycare (creche diurna)', label: 'Daycare (Diurno)' },
                  { id: 'Casa inteira pet-friendly', label: 'Casa Inteira' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedType === type.id
                        ? 'bg-[#E8F5E9] text-[#15803D]'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {(searchFilters.location ||
              searchFilters.selectedCategory ||
              selectedType !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-[#DC2626] hover:underline flex items-center gap-1 font-semibold"
              >
                <FilterX className="w-3.5 h-3.5" />
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FEED DE ACOMODAÇÕES */}
      <section id="explore-feed" className="py-12 max-w-[1200px] mx-auto px-4 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Acomodações em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {filteredListings.length}{' '}
              {filteredListings.length === 1 ? 'espaço encontrado' : 'espaços encontrados'} com
              anfitriões certificados
            </p>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 card-shadow max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center mx-auto mb-4">
              <FilterX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma acomodação encontrada</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tente remover ou alterar seus filtros de localização ou categoria para ver mais
              opções.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl"
            >
              Ver Todas as Acomodações
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMO FUNCIONA (3 Passos) */}
      <section id="como-funciona" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#E8F5E9] px-3.5 py-1 rounded-full">
              Simples & Seguro
            </span>
            <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mt-3 mb-3">
              Como Funciona o Petbnb
            </h2>
            <p className="text-sm text-[#4B5563]">
              Do check-in ao retorno para casa, garantimos bem-estar e tranquilidade para você e seu
              bichinho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#F8FAF8] rounded-3xl p-8 border border-gray-100 card-shadow relative group hover:border-[#22C55E]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center font-extrabold text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cadastre seu pet</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Crie a ficha médica e comportamental do seu cão ou gato, com carteira de vacinas,
                preferências, hábitos e contato de emergência.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200/60">
                <Link
                  to="/pets/novo"
                  className="text-xs font-bold text-[#15803D] hover:text-[#16A34A] flex items-center gap-1"
                >
                  Cadastrar meu pet agora <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8FAF8] rounded-3xl p-8 border border-gray-100 card-shadow relative group hover:border-[#22C55E]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center font-extrabold text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Encontre o anfitrião ideal</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Filtre por quintal gramado, telas de proteção, ausência de outros pets e proximidade
                veterinária. Reserve com aprovação em até 24h ou instantaneamente.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200/60">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Anfitriões 100%
                  verificados
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8FAF8] rounded-3xl p-8 border border-gray-100 card-shadow relative group hover:border-[#22C55E]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#15803D] flex items-center justify-center font-extrabold text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Acompanhe com diário de bordo
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Receba fotos diárias, atualizações de humor, registros de alimentação e passeios
                direto no chat durante toda a estadia do pet.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200/60">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Suporte & vistoria com
                  fotos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER CTA ANFITRIÃO */}
      <section className="py-16 bg-gradient-to-r from-[#15803D] to-[#22C55E] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Renda Extra com Amor por Pets
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-2">
              Você tem espaço seguro e adora animais?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Torne-se um Anfitrião Petbnb, defina suas próprias tarifas, escolha as datas
              disponíveis e receba pets adoráveis na sua casa com proteção completa.
            </p>
          </div>
          <Link to="/host">
            <Button className="bg-white text-[#15803D] hover:bg-white/90 text-sm font-extrabold px-8 py-6 rounded-2xl shadow-xl btn-hover-effect">
              Acessar Painel do Anfitrião
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
