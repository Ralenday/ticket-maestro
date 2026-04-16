'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Evento } from '@/types';

// Skeleton de un evento
function EventSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-56 bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
        <div className="h-3 bg-zinc-700 rounded w-2/3" />
      </div>
    </div>
  );
}

interface Props {
  searchTerm?: string;
  ubicacion?: string;
  fecha?: string;
  fechaFin?: string;
}

export default function EventGrid({ searchTerm = '', ubicacion = '', fecha = '', fechaFin = '' }: Props) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (ubicacion) params.set('ubicacion', ubicacion);
    if (fecha) params.set('fecha', fecha);
    if (fechaFin) params.set('fechaFin', fechaFin);

    setLoading(true);
    fetch(`/api/events?${params.toString()}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) setErrorMsg(json.error);
        else setEventos(json.data || []);
      })
      .catch(() => setErrorMsg('No se pudo conectar con la base de datos.'))
      .finally(() => setLoading(false));
  }, [searchTerm, ubicacion, fecha, fechaFin]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold mb-10">
        {(searchTerm || ubicacion || fecha) ? 'Resultados' : 'Anticipa tus boletos'}
      </h2>

      {errorMsg && (
        <p className="text-red-400 text-center py-8 text-lg">{errorMsg}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton mientras cargan
          Array.from({ length: 8 }).map((_, i) => <EventSkeleton key={i} />)
        ) : eventos.length === 0 && !errorMsg ? (
          <p className="col-span-4 text-center text-gray-400 py-12 text-lg">
            {(searchTerm || ubicacion || fecha)
              ? 'No se encontraron eventos con estos filtros.'
              : 'No hay eventos disponibles en este momento.'}
          </p>
        ) : (
          eventos.map((evento) => (
            <Link
              href={`/evento/${evento.id}`}
              key={evento.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 block"
            >
              <div className="relative h-56 bg-zinc-800">
                <Image
                  src={evento.imagen || `https://picsum.photos/seed/${evento.id}/600/400`}
                  alt={evento.titulo}
                  fill
                  quality={60}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{evento.titulo}</h3>
                <p className="text-pink-400 text-sm mb-1">{evento.ubicacion}</p>
                <p className="text-xs text-gray-400">
                  {new Date(evento.fecha).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
