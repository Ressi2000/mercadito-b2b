import { createContext, useContext, useState, type ReactNode } from "react";
import { type Carrito } from "../models/Carrito";

interface CarritoContextType {
  carrito: Carrito | null;
  setCarrito: (c: Carrito | null) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);

  return (
    <CarritoContext.Provider value={{ carrito, setCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito must be used inside provider");
  return context;
};
