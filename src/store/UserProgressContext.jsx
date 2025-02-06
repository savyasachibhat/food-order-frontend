import { createContext, useState } from 'react';

const UserProgressContext = createContext({
  progress: '',
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
  showUserLogin: ()=>{},
  hideUserLogin: ()=>{}
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState('');

  function showCart() {
    setUserProgress('cart');
  }

  function hideCart() {
    setUserProgress('');
  }

  function showCheckout() {
    setUserProgress('checkout');
  }

  function hideCheckout() {
    setUserProgress('');
  }
  function showUserLogin() {
    setUserProgress('login');
  }
  function hideUserLogin() {
    setUserProgress('');
  }

  const userProgressCtx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
    showUserLogin,
    hideUserLogin,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;