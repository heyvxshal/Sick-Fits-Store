import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  return (
    <LocalStateProvider value={{ cartOpen, setCartOpen, toggleCart }}>
      {children}
    </LocalStateProvider>
  );
}

// Custom hook for accessing the cart local state
function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
