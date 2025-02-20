import { createContext, useState } from 'react';

const UserProgressContext = createContext({
  progress: '',
  user: null,
  userMeals : [],
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
  showUserLogin: ()=>{},
  hideUserLogin: ()=>{}
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState('');
  const [user, setUser] = useState(null);
  const [userMeals, setUserMeals] = useState([]);

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
    user,
    userMeals,
    setUser,
    setUserMeals,
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