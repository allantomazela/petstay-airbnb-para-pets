import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import {
  PawPrint,
  Menu,
  X,
  Compass,
  CalendarDays,
  LayoutDashboard,
  Star,
  Dog,
  User as UserIcon,
  LogOut,
  Mail,
  ShieldCheck,
  Heart,
  HelpCircle,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function Layout() {
  const { currentUser, users, switchUserRole } = useData()
  const { toast } = useToast()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: 'E-mail inválido',
        description: 'Por favor, digite um endereço de e-mail válido.',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Inscrição realizada! 🐾',
      description: 'Você receberá dicas exclusivas e promoções pet-friendly.',
    })
    setNewsletterEmail('')
  }

  const navLinks = [
    { label: 'Explorar', path: '/', icon: Compass },
    { label: 'Meus Pets', path: '/pets', icon: Dog },
    { label: 'Viagens & Chat', path: '/reservations', icon: CalendarDays },
    { label: 'Painel do Anfitrião', path: '/host', icon: LayoutDashboard },
    { label: 'Avaliações', path: '/reviews', icon: Star },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAF8] text-[#1F2937]">
      {/* Simulation Banner to easily switch between Tutor and Host */}
      <div className="bg-[#15803D] text-white text-xs py-1.5 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span>
              Simulação ativa: Conectado como <strong>{currentUser.name}</strong> (
              {currentUser.role === 'host' ? 'Anfitrião Pet' : 'Tutor / Hóspede'})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 hidden sm:inline">
              Trocar usuário para testar papéis:
            </span>
            <div className="flex gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUserRole(u.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    currentUser.id === u.id
                      ? 'bg-white text-[#15803D] font-bold shadow-sm'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {u.role === 'host' ? '🏡 ' : '🐕 '} {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Sticky */}
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Petbnb */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] rounded-xl p-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#15803D] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-[#22C55E]/20 group-hover:scale-105 transition-transform duration-200">
              <PawPrint className="w-6 h-6 fill-white stroke-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-[#1F2937]">
                Pet<span className="text-[#22C55E]">bnb</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#15803D] font-bold -mt-1 hidden sm:block">
                Hospedagem com carinho
              </span>
            </div>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E8F5E9] text-[#15803D] shadow-sm'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#22C55E]' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action / User Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/host"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#15803D] bg-[#E8F5E9] hover:bg-[#d8eedb] px-3 py-2 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              {currentUser.role === 'host' ? 'Modo Anfitrião' : 'Seja um Anfitrião'}
            </Link>

            {/* Dropdown User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menu do usuário"
                  className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 rounded-full pl-3 pr-2 py-1.5 shadow-sm hover:shadow transition-all bg-white"
                >
                  <div className="flex flex-col text-left mr-1 hidden sm:block">
                    <span className="text-xs font-bold text-[#1F2937] leading-none">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {currentUser.role === 'host' ? 'Anfitrião' : 'Tutor'}
                    </span>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#22C55E]/40"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Badge className="bg-[#E8F5E9] text-[#15803D] hover:bg-[#E8F5E9] text-[10px]">
                      {currentUser.role === 'host' ? 'Anfitrião Verificado' : 'Tutor Verificado'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/pets" className="cursor-pointer flex items-center gap-2.5 py-2">
                    <Dog className="w-4 h-4 text-[#22C55E]" />
                    <span>Meus Pets</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/reservations"
                    className="cursor-pointer flex items-center gap-2.5 py-2"
                  >
                    <CalendarDays className="w-4 h-4 text-[#22C55E]" />
                    <span>Minhas Reservas & Diário</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/host" className="cursor-pointer flex items-center gap-2.5 py-2">
                    <LayoutDashboard className="w-4 h-4 text-[#22C55E]" />
                    <span>Painel do Anfitrião</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/reviews" className="cursor-pointer flex items-center gap-2.5 py-2">
                    <Star className="w-4 h-4 text-[#22C55E]" />
                    <span>Minhas Avaliações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1.5">Trocar usuário:</p>
                  <div className="flex flex-col gap-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => switchUserRole(u.id)}
                        className={`text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between ${
                          currentUser.id === u.id
                            ? 'bg-[#E8F5E9] font-bold text-[#15803D]'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] capitalize text-gray-400">
                          {u.role === 'host' ? 'Host' : 'Tutor'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: 'Sessão mantida',
                      description:
                        'Como estamos em modo de demonstração em memória, você permanece conectado.',
                    })
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
              className="md:hidden p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Left sliding drawer with backdrop) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white">
                  <PawPrint className="w-5 h-5 fill-white stroke-none" />
                </div>
                <span className="text-xl font-extrabold text-gray-900">
                  Pet<span className="text-[#22C55E]">bnb</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User card in mobile drawer */}
            <div className="p-4 mx-4 mt-4 bg-[#F8FAF8] border border-gray-100 rounded-2xl flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#22C55E]"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-gray-900 truncate">{currentUser.name}</span>
                <span className="text-xs text-gray-500">
                  {currentUser.role === 'host' ? 'Anfitrião Pet' : 'Tutor / Hóspede'}
                </span>
              </div>
            </div>

            {/* Navigation links in mobile */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path)
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-colors min-h-[44px] ${
                      isActive ? 'bg-[#E8F5E9] text-[#15803D]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#22C55E]' : 'text-gray-400'}`} />
                    {link.label}
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="text-xs font-bold uppercase text-gray-400 px-4 mb-2">
                  Alternar Perfil
                </p>
                <div className="space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUserRole(u.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                        currentUser.id === u.id
                          ? 'bg-[#E8F5E9] text-[#15803D] font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{u.name}</span>
                      <span className="text-xs text-gray-400">
                        {u.role === 'host' ? 'Anfitrião' : 'Tutor'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 pt-16 pb-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#22C55E] flex items-center justify-center text-white shadow-md">
                  <PawPrint className="w-5 h-5 fill-white stroke-none" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-[#1F2937]">
                  Pet<span className="text-[#22C55E]">bnb</span>
                </span>
              </Link>
              <p className="text-[#4B5563] text-sm leading-relaxed max-w-sm">
                Conectamos tutores apaixonados a anfitriões certificados, com proteção de segurança,
                diário de bordo com fotos e suporte 24h para que seu melhor amigo se sinta em casa.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#E8F5E9] hover:text-[#15803D] text-gray-600 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#E8F5E9] hover:text-[#15803D] text-gray-600 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#E8F5E9] hover:text-[#15803D] text-gray-600 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links column 1 */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">Institucional</h4>
              <ul className="space-y-2.5 text-sm text-[#4B5563]">
                <li>
                  <Link to="/" className="hover:text-[#22C55E] transition-colors">
                    Sobre o Petbnb
                  </Link>
                </li>
                <li>
                  <Link to="/host" className="hover:text-[#22C55E] transition-colors">
                    Como ser um Anfitrião
                  </Link>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-[#22C55E] transition-colors">
                    Como funciona
                  </a>
                </li>
                <li>
                  <Link to="/reviews" className="hover:text-[#22C55E] transition-colors">
                    Avaliações Verificadas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">
                Ajuda & Segurança
              </h4>
              <ul className="space-y-2.5 text-sm text-[#4B5563]">
                <li>
                  <a href="#" className="hover:text-[#22C55E] transition-colors">
                    Central de Ajuda 24h
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#22C55E] transition-colors">
                    Garantia Veterinária
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#22C55E] transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#22C55E] transition-colors">
                    Privacidade & Cookies
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">
                Dicas & Novidades
              </h4>
              <p className="text-xs text-[#4B5563] mb-3">
                Receba guias de cuidados, novos anfitriões e cupons pet-friendly.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-[#22C55E]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl text-sm btn-hover-effect"
                >
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} Petbnb Brasil Tecnologia Ltda. Todos os direitos
              reservados.
            </p>
            <div className="flex items-center gap-4">
              <span>Feito com 💚 para quem ama animais</span>
              <span>•</span>
              <span className="text-[#15803D] font-semibold">100% Pet-friendly</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
