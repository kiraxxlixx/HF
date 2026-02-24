import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popcorn } from "lucide-react";
import axios from "axios";

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombrePila: "",
    primerApell: "",
    email: "",
    contrasena: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/v1/auth/register", form);

      alert("Cuenta creada correctamente");
      navigate("/login");

    } catch (err) {
      console.log(err.response);
      setError(
        err.response?.data?.message || "Error al registrar usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6 flex items-center justify-center gap-2">
          <Popcorn size={36} className="text-pink-600" />
          Crear Cuenta
        </h2>

        <form onSubmit={handleRegister}>
          
          <div className="mb-4">
            <input
              type="text"
              name="nombrePila"
              placeholder="Nombre"
              onChange={handleChange}
              required
              className="w-full border rounded py-3 px-4"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="primerApell"
              placeholder="Apellido"
              onChange={handleChange}
              className="w-full border rounded py-3 px-4"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
              className="w-full border rounded py-3 px-4"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full border rounded py-3 px-4"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-700 text-white"
            }`}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;