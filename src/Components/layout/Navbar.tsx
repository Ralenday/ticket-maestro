'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

type NavbarProps = {
  user: Usuario | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignorar error de red
    }
    setMenuAbierto(false);
    router.push('/');
    router.refresh(); // refresca el servidor para limpiar el estado del usuario
  }

  return (
    <nav className="bg-[#e91e63] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center hover:scale-105 transition">
          <Image
            src="/11.png"
            alt="TicketMaestro"
            width={380}
            height={110}
            className="object-contain h-20"
            priority
          />
        </Link>

        {/* Menú de navegación */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-pink-100 hover:bg-white/10 px-4 py-2 rounded-xl transition">
            Inicio
          </Link>
          <Link href="/events" className="hover:text-pink-100 hover:bg-white/10 px-4 py-2 rounded-xl transition">
            Buscar
          </Link>
          <Link href="/about" className="hover:text-pink-100 hover:bg-white/10 px-4 py-2 rounded-xl transition">
            Acerca de
          </Link>
        </div>

        {/* Área derecha */}
        <div className="flex items-center gap-4">
          {user ? (
            /* Usuario LOGUEADO → menú desplegable */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-2xl transition"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/40">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white leading-tight">{user.nombre}</p>
                  <p className="text-xs text-pink-100 leading-tight">{user.rol}</p>
                </div>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1030] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  
                  {/* Info del usuario */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold truncate">{user.nombre}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>

                  {/* Opciones */}
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi perfil
                    </Link>

                    <Link
                      href="/mis-boletos"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Mis boletos
                    </Link>

                    {/* Solo para admin */}
                    {user.rol === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMenuAbierto(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-pink-300 hover:bg-white/10 hover:text-pink-200 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Panel de admin
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/10 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Usuario NO logueado → botones normales */
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2 text-sm font-medium hover:bg-pink-700 hover:text-white rounded-full transition"
              >
                Inicio de sesión
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-pink-100 transition"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}