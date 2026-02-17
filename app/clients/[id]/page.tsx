"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function FormularioCliente() {

  const router = useRouter();

  const params = useParams();

  const idArray = params.id;
  const id = idArray ? idArray[0] : null; 
  const isNew = idArray === "new";
  console.log('isNew', isNew);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) {
        setFormData({ fullname: "", email: "", status: true });
        setError("");
        return;
    }
    
    setLoading(true);

    fetch(`/api/clients/${id}`)
    .then(res => res.json())
    .then(data => {

        setFormData({
        fullname: data.fullname,
        email: data.email,
        status: data.status
        });

    })
    .catch(() =>
        setError("Error al cargar cliente")
    )
    .finally(() =>
        setLoading(false)
    );

    

  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    const url = isNew
      ? "/api/clients"
      : `/api/clients/${id}`;

    console.log('isNew22', isNew);
    console.log('url', url);

    const method = isNew
      ? "POST"
      : "PATCH";

    try {

      const res = await fetch(url, {

        method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)

      });

      if (!res.ok)
        throw new Error("Error al guardar");

      router.push("/");

      router.refresh();

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  if (loading && !isNew)
    return <p className="p-10 text-center">Cargando...</p>;

  return (

    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">

        {isNew ? "Nuevo Cliente" : "Editar Cliente"}

      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow-md rounded-xl border"
      >

        <input
          required
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded text-black"
          value={formData.fullname}
          onChange={(e) =>
            setFormData({
              ...formData,
              fullname: e.target.value
            })
          }
        />

        <input
          required
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded text-black"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        <select
          className="w-full p-2 border rounded text-black"
          value={formData.status?.toString() ?? "true"} 
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value === "true"
            })
          }
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>

        {error &&
          <p className="text-red-500">
            {error}
          </p>
        }

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading
            ? "Guardando..."
            : "Guardar"}
        </button>

      </form>

    </div>

  );

}
