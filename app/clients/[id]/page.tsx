"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUturnLeftIcon

 } from '@heroicons/react/24/solid'

export default function FormularioCliente() {
  const router = useRouter();
  const params = useParams();
  const didFetch = useRef(false);

  const idArray = params.id;
  const id = idArray ? idArray[0] : null; 
  const isNew = idArray === "new";

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
  });

  const [error, setError] = useState("");

 useEffect(() => {

    if (isNew) return;
    if (!id || isNaN(Number(id))) {
      setError("ID inválido");
      return;
    }

    setLoading(true);

    fetch(`/api/clients/${id}`)
      .then(async (res) => {

        if (res.status === 404) {
          throw new Error("Cliente no existe");
        }

        if (!res.ok) {
          throw new Error("Error al cargar cliente");
        }

        return res.json();

      })
      .then(data => {

        setFormData({
          fullname: data.fullname,
          email: data.email,
          status: data.status,
        });

      })
      .catch((err) => {

        setError(err.message);

      })
      .finally(() => setLoading(false));

  }, [id, isNew]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ fullname: "", email: "" });
    setError("");
    setLoading(true);

    const url = isNew ? "/api/clients" : `/api/clients/${id}`;
    const method = isNew ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: { [key: string]: string } = {};
          for (const field in data.details) {
            fieldErrors[field] = (data.details[field] as string[]).join(", ");
          }

          setErrors(fieldErrors as { fullname: string; email: string });
        } else {
          setError(data.error || "Error al guardar");
        }
        return;
      }

      router.push("/");
      router.refresh();

    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };


  if (loading && !isNew) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loader"></span>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 space-y-4 bg-white border-2 border-gray-400 p-6 shadow-md rounded-xl">

        <h2 className="text-2xl text-center font-bold text-red-500 mb-4">
          {error}
        </h2>

        <Link
          href="/"
          className="hover:text-blue-700 flex items-center justify-center hover:bg-blue-400 text-blue-700 bg-blue-300 p-2 rounded-lg transition"
        >
          <ArrowUturnLeftIcon className="h-5 w-5 inline mr-2" /> Volver
        </Link>

      </div>
    );
  }

  return (

    <div className="max-w-2xl mx-auto p-10">

      <div className="flex items-center gap-x-2 mb-4">
        <Link
          title="volver"
          href="/"
          className=" hover:text-blue-700 hover:bg-blue-400 text-blue-700 bg-blue-300 p-2 rounded-lg transition"
        >
          <ArrowLeftIcon className="h-5 w-5 " />
        </Link>
        <h1 className="text-2xl font-bold ">

          {isNew ? "Nuevo Cliente" : `Editar Cliente Id: ${id}`}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border-2 border-gray-400 p-6 shadow-md rounded-xl"
      >
        <div>
          <h2 className="mb-2 font-semibold">Nombre Completo*</h2>
          <input
            name="fullname"
            type="text"
            placeholder="ej: Arnaldo Ismael Cardozo Ramirez"
            className={`w-full p-2 outline-none ring-2 rounded-lg text-black transition
            ${
              errors.fullname
                ? "ring-red-500"
                : "ring-gray-300 focus:ring-blue-500 hover:ring-blue-500"
            }`}
            value={formData.fullname}
            onChange={(e) =>
            {
              setFormData({
                ...formData,
                fullname: e.target.value
              });

              setErrors({
                ...errors,
                fullname: ""
              });
            }}
          />

          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullname}
            </p>
          )}

        </div>

        <div>
          <h2 className="mb-2 font-semibold">Email*</h2>
          <input
            type="email"
            placeholder="ej: ejemplo@gmail.com"
            className={`w-full p-2 outline-none ring-2 rounded-lg text-black transition
            ${
              errors.email
                ? "ring-red-500"
                : "ring-gray-300 focus:ring-blue-500 hover:ring-blue-500"
            }`}
            value={formData.email}
            onChange={(e) =>
            {
              setFormData({
                ...formData,
                email: e.target.value
              });

              setErrors({
                ...errors,
                email: ""
              });
            }}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
        {!isNew && (
        <div>
          <h2 className="mb-2 font-semibold">Estado*</h2>
          <div className="p-2 outline-none rounded-lg ring-2 focus:ring-2 ring-gray-300 focus:ring-blue-500 hover:ring-blue-500 transition">
            <select
              className="w-full  rounded outline-none text-black"
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
          </div>
        </div>
        )}
        {error &&
          <p className="text-red-500">
            {error}
          </p>
        }

        <button
          type="submit"
          className={`w-full cursor-pointer font-semibold text-white p-2 rounded-lg transition
            ${
              isNew
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-400 hover:bg-yellow-600"
            }
          `}
        >
          {loading
            ? "Guardando..."
            : isNew
              ? "Guardar"
              : "Actualizar"}
        </button>

      </form>

    </div>

  );

}
