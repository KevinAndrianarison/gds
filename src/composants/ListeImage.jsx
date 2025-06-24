import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useContext } from "react";
import { UrlContext } from "@/contexte/useUrl";

export default function ListeImage({ photos }) {
  const { url } = useContext(UrlContext);

  return (
    <div className="w-[60vw] mb-4 h-[80vh] overflow-y-auto">
      <Carousel className="w-[90%] mx-auto h-[100vh]">
        <CarouselContent className="h-[100vh] ">
          {photos.length === 0 && (
            <p className="text-center">Aucune image disponible</p>
          )}
          {photos.map((photo) => (
            <CarouselItem key={photo.id} className="flex my-auto">
              <div className="w-full h-[100vh]">
                <img
                  className="w-full h-full  object-center"
                 // src={`${url}/storage/materiels_photos/${photo.chemin}`}
                  src={`${url}/storage/app/public/materiels_photos/${photo.chemin}`}
                />
              </div>
            </CarouselItem>
          ))} 
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
