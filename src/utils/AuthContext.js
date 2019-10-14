import { createContext } from 'react';

export const AuthContext = createContext({auth: null});
export const AuthContextProvider = AuthContext.Provider;