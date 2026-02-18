"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PencilIcon, UserPlusIcon, MagnifyingGlassIcon, XMarkIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/solid'
interface Client {
  id: number;
  fullname: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchClientes = async (query = "", pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/clients?q=${query}&page=${pageNum}&limit=${limit}`);
      if (!res.ok) throw new Error("Error al conectar con la API");
      const data = await res.json();
      setClients(data.clients);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // Cuando cambie búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClientes(search, 1); // reinicia página al buscar
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Funciones para cambiar página
  const handlePrev = () => { if (page > 1) fetchClientes(search, page - 1); }
  const handleNext = () => { if (page < totalPages) fetchClientes(search, page + 1); }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClientes(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);



  return (
    <div className="bg-white max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <Link
          href="/clients/new"
          className="bg-green-600 flex items-center justify-center gap-x-2 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <UserPlusIcon className="w-5 h-5" /> Nuevo Cliente
        </Link>
      </div>

      <div className="mb-6 relative w-full">
        <input
          type="text"
          placeholder=" Buscar por nombre o email..."
          className="w-full pl-5 py-3 pr-16 rounded-xl shadow-sm outline-none ring-2 focus:ring-2 ring-gray-300 focus:ring-blue-500 hover:ring-blue-500 text-black transition"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        
        {search ? (
          <button
            onClick={() => setSearch("")}
            className="absolute cursor-pointer right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        ) : (
          <button className="absolute top-1/2 -translate-y-1/2 right-6">
            <MagnifyingGlassIcon className="w-6  h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      
        <div className="bg-white min-h-100 flex flex-col justify-between shadow-md rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full  leading-normal">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                <th className="px-5 py-4 border-b text-left font-semibold">Nombre</th>
                <th className="px-5 py-4 border-b text-left font-semibold">Email</th>
                <th className="px-5 py-4 border-b text-center font-semibold">Estado</th>
                <th className="px-5 py-4 border-b text-center font-semibold">Creado</th>
                <th className="px-5 py-4 border-b text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <span className="loader mx-auto"></span>
                  </td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition border-b border-gray-100">
                    <td className="px-5 py-4 text-sm font-medium">{client.fullname}</td>
                    <td className="px-5 py-4 text-sm">{client.email}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        client.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {client.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <Link
                        title="Editar"
                        href={`/clients/${client.id}`}
                        className="flex justify-center items-center rounded-lg text-sm transition"
                      >
                        <PencilIcon className="h-8 w-8 text-gray-600 bg-yellow-400 hover:bg-yellow-600 p-2 rounded-lg transition" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500 italic">
                    No se encontraron clientes que coincidan.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
          {clients.length > 0 && totalPages > 0 && (
          <div className="w-full flex items-center justify-center ">
            <div className=" bg-gray-100 rounded-lg p-2 mb-2 flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={handlePrev}
                disabled={page === 1 || loading}
                className="px-2 py-1 hover:text-blue-600 disabled:hover:text-gray-400 rounded disabled:cursor-not-allowed disabled:text-gray-400 cursor-pointer transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchClientes(search, p)}
                  className={`px-3 py-1 cursor-pointer rounded ${
                    page === p ? "bg-blue-500 text-white" : "hover:bg-gray-300 bg-gray-200 transition"
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => fetchClientes(search, totalPages)}
                    className={`px-3 py-1 cursor-pointer rounded ${
                      page === totalPages ? "bg-blue-500 text-white" : "hover:bg-gray-300 bg-gray-200 transition"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Botón Siguiente */}
              <button
                onClick={handleNext}
                disabled={page === totalPages || loading}
                className="px-2 py-1 hover:text-blue-600 disabled:hover:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400 rounded cursor-pointer transition"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          )}
        </div>
      
    </div>
  );
}