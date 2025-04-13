// src/pages/index.tsx o src/components/Componente.tsx
import { useEffect, useState } from 'react';
import { fetchData } from '../api/servicios'; // Ruta correcta

interface Usuario {
  id: number;
  name: string;
  email: string;
}

const Home = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await fetchData<Usuario[]>('https://jsonplaceholder.typicode.com/users');
        setUsuarios(data);
      } catch (error) {
        console.error('Hubo un error al cargar los usuarios');
      }
    };

    cargarUsuarios();
  }, []);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.name} ({usuario.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
