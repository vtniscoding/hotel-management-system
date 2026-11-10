import React, { useState, useEffect } from "react";
import { HeroSlider } from "../components/home/HeroSlider";
import { PromoWidget } from "../components/home/PromoWidget";
import { FeaturedServices } from "../components/home/FeaturedServices";
import { RoomSwiper } from "../components/home/RoomSwiper";
import { dbService } from "../services/dbService";

export const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await dbService.getRoomTypes();
        setRooms(data);
      } catch (err) {
        console.error("Error loading rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <main className="min-h-screen">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Promo Widget Overlay */}
      <PromoWidget />

      {/* 3. Featured Services */}
      <FeaturedServices />

      {/* 4. Room Types Swiper */}
      {!loading && <RoomSwiper rooms={rooms} />}
    </main>
  );
};
