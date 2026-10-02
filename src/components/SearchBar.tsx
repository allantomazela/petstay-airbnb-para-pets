import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  MapPin,
  Calendar as CalendarIcon,
  Dog,
  Cat,
  Search,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const POPULAR_CITIES = [
  'São Paulo, SP',
  'Campinas, SP',
  'Ubatuba, SP',
  'Rio de Janeiro, RJ',
  'Curitiba, PR',
  'Belo Horizonte, MG',
]

export const SearchBar: React.FC = () => {
  const { searchFilters, setSearchFilters } = useData()
  const navigate = useNavigate()

  const [locationInput, setLocationInput] = useState(searchFilters.location)
  const [showLocationSuggest, setShowLocationSuggest] = useState(false)
  const [checkIn, setCheckIn] = useState(searchFilters.checkIn || '2025-05-15')
  const [checkOut, setCheckOut] = useState(searchFilters.checkOut || '2025-05-18')
  const [dogs, setDogs] = useState(searchFilters.dogsCount || 1)
  const [cats, setCats] = useState(searchFilters.catsCount || 0)

  const handleSearch = () => {
    setSearchFilters((prev) => ({
      ...prev,
      location: locationInput,
      checkIn,
      checkOut,
      dogsCount: dogs,
      catsCount: cats,
    }))

    // Scroll smoothly to feed
    const feedElement = document.getElementById('explore-feed')
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const selectCity = (city: string) => {
    setLocationInput(city)
    setShowLocationSuggest(false)
  }

  const totalPets = dogs + cats

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-3 md:p-4 hover-shadow border border-gray-100 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Campo 1: Localização */}
        <div className="md:col-span-4 relative p-2 md:p-3 hover:bg-gray-50/80 rounded-2xl transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            Onde seu pet vai ficar?
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value)
                setShowLocationSuggest(true)
              }}
              onFocus={() => setShowLocationSuggest(true)}
              placeholder="São Paulo, Campinas, Ubatuba..."
              className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Autocomplete dropdown */}
          {showLocationSuggest && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in-up duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">
                Destinos Populares
              </div>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-[#E8F5E9] hover:text-[#15803D] flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
                  {city}
                </button>
              ))}
              <div className="pt-1 mt-1 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => selectCity('')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-[11px] text-gray-500 hover:bg-gray-50"
                >
                  Ver todas as cidades
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator Desktop */}
        <div className="hidden md:block w-px h-10 bg-gray-200" />

        {/* Campo 2: Datas (Check-in e Check-out) */}
        <div className="md:col-span-4 p-2 md:p-3 hover:bg-gray-50/80 rounded-2xl transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            Período da Hospedagem
          </label>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <CalendarIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
            />
            <span className="text-gray-400 font-normal">até</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Separator Desktop */}
        <div className="hidden md:block w-px h-10 bg-gray-200" />

        {/* Campo 3: Pets (Popover Seletor) */}
        <div className="md:col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-2 md:p-3 hover:bg-gray-50/80 rounded-2xl transition-colors cursor-pointer">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                  Quem vai?
                </label>
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {totalPets === 0
                      ? 'Nenhum pet'
                      : `${totalPets} pet${totalPets > 1 ? 's' : ''} (${dogs} cão, ${cats} gato)`}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 rounded-2xl shadow-xl" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dog className="w-4 h-4 text-[#22C55E]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Cães</p>
                      <p className="text-xs text-gray-400">Pequeno, médio ou grande</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={dogs <= 0}
                      onClick={() => setDogs((p) => Math.max(0, p - 1))}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:border-gray-400"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{dogs}</span>
                    <button
                      type="button"
                      onClick={() => setDogs((p) => p + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Cat className="w-4 h-4 text-[#22C55E]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Gatos</p>
                      <p className="text-xs text-gray-400">Ambientes telados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={cats <= 0}
                      onClick={() => setCats((p) => Math.max(0, p - 1))}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:border-gray-400"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{cats}</span>
                    <button
                      type="button"
                      onClick={() => setCats((p) => p + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botão Buscar */}
        <div className="md:col-span-1 flex justify-end">
          <Button
            type="button"
            onClick={handleSearch}
            aria-label="Buscar acomodações"
            className="w-full md:w-14 h-12 md:h-14 rounded-2xl md:rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center shadow-md shadow-[#22C55E]/30 btn-hover-effect"
          >
            <Search className="w-5 h-5 text-white" />
            <span className="md:hidden ml-2 font-bold text-base">Buscar Acomodações</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
