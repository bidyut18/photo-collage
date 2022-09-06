import { createClient } from "@supabase/supabase-js";
export const urlMaker = (imgData: File) => {
  return URL.createObjectURL(imgData);
};

//type defination;
export interface UploadedImage {
  imgName: string;
  imgSrc: string;
  imgKey: string;
  resizedBlob: Blob | null;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fileUploader = async (file: Blob[], pathFolder: string) => {
  const promisesWeather = [...promiseMaker(file, pathFolder)];
  const prms = await Promise.all(promisesWeather);
  const data = await Promise.all(prms.map((val) => val.data?.Key as string));
  return data;
};

const promiseMaker = (files: Blob[], folderName: string) => {
  const prmises = [];
  for (let i = 0; i < files.length; i++) {
    prmises.push(
      supabase.storage
        .from("production")
        .upload(
          "public/" + folderName.replace(/\s/g, "") + "/" + Date.now() + ".png",
          files[i]
        )
    );
  }
  return prmises;
};
