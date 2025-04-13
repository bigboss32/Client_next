"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Movimiento {
  fondoId: string;
  tipo: string;
  nombre: string;
  fecha: string;
}

interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export default function Home() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [clienteId, setClienteId] = useState<string>("1");
  const [fondoId, setFondoId] = useState<string>("2");
  const [monto, setMonto] = useState<number>(100);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await axios.get<Movimiento[]>(
          "http://44.211.95.88:8080/suscribirse?id=1"
        );
        setMovimientos(response.data);
      } catch (error) {
        console.error("Error cargando movimientos");
      }
    };

    fetchMovimientos();
  }, []);


  const handlePost = async () => {
    const data = {
      clienteId,
      fondoId,
      monto,
    };

    try {
      await axios.post("http://44.211.95.88:8080/suscribirse?id=1", data);
      alert("Suscripción exitosa!");
      const response = await axios.get<Movimiento[]>(
        "http://44.211.95.88:8080/suscribirse?id=1"
      );
      setMovimientos(response.data);
      setErrorMessage(null); 
    } catch (error: any) {
      console.error("Error realizando suscripción", error);
      if (error.response && error.response.status === 400) {
        const errorData: ErrorResponse = error.response.data;
        setErrorMessage(errorData.message); 
      } else {
        alert("Error al suscribirse.");
      }
    }
  };


  const handleDelete = async (fondoId: string) => {
    const data = {
      clienteId: "1", 
      fondoId: fondoId, 
    };

    try {
      await axios.delete("http://44.211.95.88:8080/suscribirse", {
        data: data, 
      });
      alert("Movimiento eliminado!");

      const response = await axios.get<Movimiento[]>(
        "http://44.211.95.88:8080/suscribirse?id=1"
      );
      setMovimientos(response.data);
    } catch (error) {
      console.error("Error eliminando el movimiento", error);
      alert("Error al eliminar el movimiento.");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row", 
        gap: "2rem",
      }}
    >
      {/* Lista de movimientos */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
          📋 Historial de Movimientos
        </h1>

        {movimientos.length === 0 ? (
          <p>No hay movimientos aún.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {movimientos.map((mov, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#1a1a1a",
                  boxShadow: "0 2px 4px rgba(255, 255, 255, 0.1)",
                  color: "#f1f1f1",
                }}
              >
                <h2 style={{ margin: "0 0 0.5rem", color: "#ffcc00" }}>
                  {mov.tipo} - {mov.nombre}
                </h2>
                <p style={{ margin: "0.2rem 0" }}>
                  🆔 <strong>Fondo ID:</strong> {mov.fondoId}
                </p>
                <p style={{ margin: "0.2rem 0" }}>
                  📅 <strong>Fecha:</strong> {new Date(mov.fecha).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(mov.fondoId)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ff4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario de Suscripción */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#333",
          borderRadius: "8px",
        }}
      >
        <h2>Realizar Suscripción</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Fondo ID:
            <input
              type="text"
              value={fondoId}
              onChange={(e) => setFondoId(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Monto:
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <button
          onClick={handlePost}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ffcc00",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Suscribirse
        </button>

        {/* Mostrar el mensaje de error si existe */}
        {errorMessage && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#ff4444",
              color: "#fff",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
