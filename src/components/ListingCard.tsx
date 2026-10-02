import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Listing } from '@/types'
import { Star, Zap, MapPin, ChevronLeft, ChevronRight, ShieldCheck, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ListingCardProps {
  listing: Listing
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [photoIndex, setPhotoIndex] = useState(0)

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((prev) => (prev === 0 ? listing.photos.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((prev) => (prev === listing.photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 card-shadow card-hover-effect relative"
    >
      {/* Photo Carousel Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={listing.photos[photoIndex] || listing.photos[0]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges on photo */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <Badge className="bg-[#FEF3C7] text-[#B45309] hover:bg-[#FEF3C7] font-bold text-xs px-2.5 py-0.5 border border-[#FDE68A] flex items-center gap-1 shadow-sm">
            <Award className="w-3.5 h-3.5 fill-[#B45309]" />
            Super Host
          </Badge>
          {listing.isInstantBook && (
            <Badge className="bg-[#E8F5E9] text-[#15803D] hover:bg-[#E8F5E9] font-bold text-xs px-2.5 py-0.5 border border-[#C8E6C9] flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 fill-[#15803D]" />
              Reserva Instantânea
            </Badge>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {listing.spaceType}
          </span>
        </div>

        {/* Carousel arrows */}
        {listing.photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 z-10">
              {listing.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`block rounded-full transition-all ${
                    idx === photoIndex
                      ? 'w-2 h-2 bg-white ring-1 ring-black/20'
                      : 'w-1.5 h-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="flex items-center gap-1 text-xs text-[#4B5563] font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
              {listing.address.neighborhood}, {listing.address.city}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
              <span className="text-xs font-bold text-gray-900">{listing.rating.toFixed(2)}</span>
              <span className="text-[11px] text-gray-400">({listing.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-[#15803D] transition-colors">
            {listing.title}
          </h3>

          {/* Quick pet features */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {listing.features.slice(0, 2).map((feat, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-[#E8F5E9] text-[#15803D] px-2 py-0.5 rounded-md"
              >
                {feat}
              </span>
            ))}
            {listing.features.length > 2 && (
              <span className="text-[10px] text-gray-400 py-0.5">
                +{listing.features.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
          <div className="text-xs text-gray-500">A partir de</div>
          <div>
            <span className="text-lg font-extrabold text-[#1F2937]">
              R$ {listing.pricePerNight}
            </span>
            <span className="text-xs text-[#4B5563] font-medium"> / diária</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
