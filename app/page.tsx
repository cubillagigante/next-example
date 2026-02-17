"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  const fetchClientes = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/clients?q=${query}`);
      if (!res.ok) throw new Error("Error al conectar con la API");
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="bg-white max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <Link
          href="/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchClientes(e.target.value);
          }}
        />
      </div>

      {loading && (
        <div className="text-center py-10">
          <p className="text-blue-600 font-medium animate-pulse">Cargando clientes...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* TABLA DE RESULTADOS */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full leading-normal">
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
              {clients.length > 0 ? (
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
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/clients/${client.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500 italic">
                    No se encontraron clientes que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}