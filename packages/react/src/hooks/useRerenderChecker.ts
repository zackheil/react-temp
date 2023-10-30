import { useEffect } from "react"

export const useRerenderChecker = (identifier?: string) => {
  useEffect(() => { 
    console.log(identifier ?? '', 'rerendered');
  }, [identifier]);
}