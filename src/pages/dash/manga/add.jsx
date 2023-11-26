import React, { useState, useEffect } from 'react';
import Connect from '@/db/connect';
import Genres from '@/models/Genres';
import Format from '@/models/Format';
import Status from '@/models/Status';
import { createFormat } from "@/middleware/generate"
import jwt from "jsonwebtoken"
import UploadIcon from '@/src/icon/upload';
import styled from '@emotion/styled';
import Layout from "@/layout/Main"
import User from '@/models/User';

const Container = styled.section`
  /* Tu estilo aquí */
`

const ContainerDrop = styled.article`
  display:flex;
  justify-content:center;
`

const Drop = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  border: 1px solid var(--border);
  width:400px;
  margin:0 auto;
  text-align:center;
  margin-top:2rem;
  padding:1rem;
  border-radius:4px;
`

const StyledInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const CheckboxSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width:80%;
  margin:0 auto;
  background:#333;
  padding:1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap:.200rem;
`;

const Checkbox = ({ label, value, onChange }) => {
  return (
      <CheckboxLabel>
        <input
          type="checkbox"
          value={value}
          onChange={(e) => onChange(value, e.target.checked)}
        />
        {label}
      </CheckboxLabel>
  );
};

const AddManga = ({ genres, format, status, url, token }) => {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    format: '',
    genres: [],
    status: ''
  });
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFilesToUpload(selectedFiles);

    const statusElement = document.getElementById('status');
    const fileCount = selectedFiles.length;
    statusElement.innerText =
      fileCount > 0 ? fileCount + ' imagen seleccionada(s)' : 'Esperando imagen...';
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const uploadManga = async () => {
    if (filesToUpload.length > 0) {
      try {
        const response = await fetch(`${url}/api/manga/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            genres: selectedGenres
          }),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const { id } = responseData;
          console.log('Primer POST exitoso. ID:', id);
  
          const filesArray = Array.from(filesToUpload);
          filesArray.forEach((file) => uploadPoster(file, id));
  
          setFilesToUpload([]);
        } else {
          console.error('Error en el primer POST');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    } else {
      alert('Seleccione al menos una imagen antes de subir.');
    }
  };

  const uploadPoster = async (file, id) => {
    console.log('Cargando archivo:', file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch(`${url}/cdn/poster/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (uploadResponse.ok) {
        console.log('Segundo POST exitoso para el archivo:', file.name);
      } else {
        console.error('Error en el segundo POST para el archivo:', file.name);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleCheckboxChange = (value, isChecked) => {
    if (isChecked) {
      setSelectedGenres((prevGenres) => [...prevGenres, value]);
    } else {
      setSelectedGenres((prevGenres) => prevGenres.filter((genre) => genre !== value));
    }
  };

  const layout = {
    title: 'xdsss',
    description: '3'
  }

  return (
    <Layout layout={layout}>
      <Container>
        <ContainerDrop>
          <Drop>
            <StyledInput
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div>
              <UploadIcon width={34} height={34}/>
            </div>
            <label htmlFor="files">Seleccionar Poster</label>
            <p id="status"></p>
          </Drop>
        </ContainerDrop>
        <section>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="overview"
            placeholder="Overview"
            value={formData.overview}
            onChange={handleInputChange}
          />
          <br></br>

          <select
            name="format"
            value={formData.format}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un formato</option>
            {format.map((format, index) => (
              <option value={format._id} key={index}>{format.name}</option>
            ))}
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="">Seleccione el estado</option>
            {status.map((status, index) => (
              <option value={status._id} key={index}>{status.name}</option>
            ))}
          </select>
          
          <CheckboxSection>
            {genres.map((genre, index) => (
              <Checkbox key={index} label={genre.name} value={genre._id} onChange={handleCheckboxChange} />
            ))}
          </CheckboxSection>
          <button onClick={uploadManga}>Subir Imágenes y Datos</button>
        </section>
      </Container>
    </Layout>
  );
};

export default AddManga;

export async function getServerSideProps(context) {
  try {
    await Connect()
    await createFormat()
  
    const genres = await Genres.find()
    const format = await Format.find()
    const status = await Status.find()

    const token = context.req.headers.cookie
    ?.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] || null;

    if (!token) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
  
    const userId = decodedToken.id;
  
    const user = await User.findById(userId);
  
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }
  
    const rol = user.roles[0];
  
    if(rol !== "admin") {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }
  
    console.log(userId)
  
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`;
  
    return {
      props: {
        genres: JSON.parse(JSON.stringify(genres)),
        format: JSON.parse(JSON.stringify(format)),
        status: JSON.parse(JSON.stringify(status)),
        url,
        token,
      }
    }
  } catch (err) {
    console.log(err)
    return {
      props: {}
    }
  }
}