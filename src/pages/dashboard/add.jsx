import React, { useState, useEffect } from 'react';
import Connect from '@/db/connect';
import Genres from '@/models/Genres';
import Format from '@/models/Format';
import Status from '@/models/Status';
import { createFormat } from "@/middleware/generate"
import jwt from "jsonwebtoken"
import UploadIcon from '@/src/icon/upload';
import styled from '@emotion/styled';
import Layout from "@/layout/Dash"
import User from '@/models/User';

const Container = styled.section`

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

const Header = styled.main`
  width:100%;
  background-color: var(--background-nav);
  padding:.400rem;
  height:3rem;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-radius: 5px;
`

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
    titleJp: '',
    author: '',
    overview: '',
    format: '',
    genres: [],
    status: '',
    nsfw: false,
  });
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleNsfwChange = (event) => {
    const { checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      nsfw: checked,
    }));
  };


  const handleFileChange = (event, index) => {
    const selectedFiles = event.target.files;
    setFilesToUpload((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = Array.from(selectedFiles);
      return updatedFiles;
    });
  
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
        const response = await fetch(`${url}/api/v1/manga/upload`, {
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

          const imageTypes = ['poster', 'logo', 'background'];

          filesToUpload.forEach((files, index) => {
            files.forEach((file) => uploadImage(file, id, imageTypes[index]));
          });

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

  const uploadImage = async (file, id, imageType) => {
    console.log(`Cargando archivo ${imageType}:`, file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch(`${url}/v1/${imageType}/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (uploadResponse.ok) {
        console.log(`Segundo POST exitoso para el archivo ${imageType}:`, file.name);
      } else {
        console.error(`Error en el segundo POST para el archivo ${imageType}:`, file.name);
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

  useEffect(() => {
    // Aquí puedes realizar cualquier acción adicional cuando nsfw cambie
    console.log('Valor de nsfw actualizado:', formData.nsfw);
  }, [formData.nsfw]);

  const layout = {
    title: 'xdsss',
    description: '3'
  }

  return (
    <Layout layout={layout}>
      <Header>
        <p>volver</p>
        <h1>Agregar</h1>
        <button onClick={uploadManga}>Subir</button>
      </Header>
      <Container>
        <ContainerDrop>
        <Drop>
            <StyledInput
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 0)}
            />
            <div>
              <UploadIcon width={34} height={34} />
            </div>
            <label htmlFor="files">Seleccionar Poster</label>
            <p id="status"></p>
          </Drop>

          <Drop>
            <StyledInput
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 1)}
            />
            <div>
              <UploadIcon width={34} height={34} />
            </div>
            <label htmlFor="files">Seleccionar Logo</label>
            <p id="status"></p>
          </Drop>

          <Drop>
            <StyledInput
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 2)}
            />
            <div>
              <UploadIcon width={34} height={34} />
            </div>
            <label htmlFor="files">Seleccionar Background</label>
            <p id="status"></p>
          </Drop>
        </ContainerDrop>
        <section>

          <input
            type="text"
            name="title"
            placeholder="Titulo"
            value={formData.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="titleJp"
            placeholder="Titulo Japones"
            value={formData.titleJp}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={formData.author}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="overview"
            placeholder="Descripcion"
            value={formData.overview}
            onChange={handleInputChange}
          />
          <br></br>

          NSFW:
          <input
            type="checkbox"
            checked={formData.nsfw}
            onChange={handleNsfwChange}
          />

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
      
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `https://${req.headers.host}`;
  
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