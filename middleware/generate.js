import Format from "@/src/models/Format";
import Genres from "@/src/models/Genres";
import Suscription from "@/src/models/Suscription";
import Role from "@/src/models/Role";


export const createRoles = async () => {
    try {
      const count = await Role.estimatedDocumentCount();
  
      if (count > 0) return;
  
      const values = await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
  
      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };
;

export const createSuscription = async () => {
  try {
    const count = await Suscription.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Suscription({ name: "default" }).save(),
      new Suscription({ name: "premium" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};
;

export const createFormat = async () => {
    try {
      const count = await Format.estimatedDocumentCount();
  
      if (count > 0) return;
  
      const values = await Promise.all([
        new Format({ name: "Manga" }).save(),
        new Format({ name: "Novela Ligera" }).save(),
        new Format({ name: "One Shot" }).save(),
      ]);
  
      console.log(values);
    } catch (error) {
      console.error(error);
    }
};

export const createGenres = async () => {
    try {
      const count = await Genres.estimatedDocumentCount();
  
      if (count > 0) return;
  
      const values = await Promise.all([
        new Genres({ name: "Acción" }).save(),
        new Genres({ name: "Aventura" }).save(),
        new Genres({ name: "Comedia" }).save(),
        new Genres({ name: "Drama" }).save(),
        new Genres({ name: "Ecchi" }).save(),
        new Genres({ name: "Fantasia" }).save(),
        new Genres({ name: "Terror" }).save(),
        new Genres({ name: "Mahou Shoujo" }).save(),
        new Genres({ name: "Mecha" }).save(),
        new Genres({ name: "Música" }).save(),
        new Genres({ name: "Misterio" }).save(),
        new Genres({ name: "Psicológico" }).save(),
        new Genres({ name: "Romance" }).save(),
        new Genres({ name: "Sci-Fi" }).save(),
        new Genres({ name: "Slice of Life" }).save(),
        new Genres({ name: "Deportes" }).save(),
        new Genres({ name: "Sobrenatural" }).save(),
        new Genres({ name: "Suspenso" }).save(),
      ]);
  
      console.log(values);
    } catch (error) {
      console.error(error);
    }
};