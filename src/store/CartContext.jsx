import { createContext, useReducer, useEffect } from 'react';

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (_id) => {},
  clearCart: () => {},
  setItems: (items) => {},
  setTotalAmount: (totalAmount) => {},
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item._id === action.item._id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item._id === action._id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] };
  }

  if (action.type === 'SET_ITEMS') {
    return { ...state, items: action.items };
  }

  if (action.type === 'SET_TOTAL_AMOUNT') {
    return { ...state, totalAmount: action.totalAmount };
  }

  return state;
}

export function CartContextProvider({ children }) {
  // Load cart data from localStorage if it exists
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] }; // Default to empty cart if nothing found
  };

  const [cart, dispatchCartAction] = useReducer(cartReducer, loadCartFromLocalStorage());

  useEffect(() => {
    // Save the cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]); // Dependency array ensures it runs whenever `cart` changes

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item });
  }

  function removeItem(_id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', _id });
  }

  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  function setItems(items) {
    dispatchCartAction({ type: 'SET_ITEMS', items });
  }

  function setTotalAmount(totalAmount) {
    dispatchCartAction({ type: 'SET_TOTAL_AMOUNT', totalAmount });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
    setItems,
    setTotalAmount,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
