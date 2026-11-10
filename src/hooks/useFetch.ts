import { useEffect, useState } from "react";
  

export function useFetch<T>(url:string) {
    const [loading,setLoading] = useState<Boolean>(false);
    const [data,setData] = useState<T | undefined>();
    const [error,setError] = useState<string>("");


    useEffect(()=>{ 
        const abortController = new AbortController();
        setData(undefined);
        setLoading(true);
        setError("");
        
        fetch(url,{
            signal: abortController.signal
        })
        .then((data:Response)=>{
            if(!data.ok){
                throw Error("response error");
            }
            return data.json()
        })
        .then(data =>{
            setLoading(false);
            setData(data as T);
        })
        .catch((err:Error)=>{
            if (err.name === 'AbortError') return;
            setLoading(false);
            setError(err.message);
        })
        return ()=> abortController.abort();
    },[url]);
    
    return {data,error,loading};
}