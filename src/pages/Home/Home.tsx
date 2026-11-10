import { useRestClient } from '@/hooks/useRestClient';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import type { Accessory } from '@/types/accessory';
import debounce from '../../hooks/myDebounce';
import { useRef } from 'react';

enum FILE_TYPES {
  'file', 
  'folder'
};

type FILE={
  name:string;
  path?: string;
  type: FILE_TYPES;
  files?: FILE[];
}
const FileComponent = ({ file, depth = 1 }: { file: FILE; depth?: number }) => {
  return (
    <>
      <li style={{ paddingLeft: `${depth * 10}px` }}>
        {file.name} - {file.path}
      </li>
      {file.files?.map((subFile, index) => (
        <FileComponent 
          key={subFile.path || index} 
          file={subFile} 
          depth={depth + 1} 
        />
      ))}
    </>
  );
};


export function Home() {

  const { data, isLoading, error } = useRestClient<Accessory[]>('/objects');
  const { add , remove , items} = useShoppingCart();
  const inputVal  = useRef('');
  const sendValue = () =>{
     console.log("debounced send value ",inputVal.current)
  }

  const debounceSend = debounce(sendValue,3000);
  const onInputChange= (event)=>{
    const value= event.currentTarget.value;
    inputVal.current=value;
    debounceSend();
  }

  const flattern = (obj:Record<string,unknown>,prefix=''):Record<string,unknown> =>{
    const flattenObj:Record<string,unknown>={};
    for (const [key,value] of Object.entries(obj)){
      const latestPrefix = prefix ? `${prefix}.${key}` : key;
      const isPlainObect = (value!=null && Object.getPrototypeOf(value)===Object.prototype)
      if(isPlainObect){
          if(Object.keys(value).length === 0){
            flattenObj[latestPrefix]={};
          }
          else {
            Object.assign(flattenObj,flattern({...value},latestPrefix));
          }
      }
      else {
        flattenObj[latestPrefix]=value;
      }
    }
    return flattenObj;
  }
  const testFlat = ()=>{
    const source= { a: 1, b: { c: 2, d: { e: 3 },z:new Date() ,wsfedcwe:[23,5,6,7,8], www:new Set()} };
    const output = { 'a': 1, 'b.c': 2, 'b.d.e': 3 }   
    const result = flattern(source); 
    console.log("output",output);
    console.log("result",result);
  }

  const fileSystem:FILE[] = [{
    name: 'root',
    path: '/',
    type: FILE_TYPES.folder,
    files: [{
      name: 'Downloads',
      path: '/Downloads',
      type: FILE_TYPES.folder,
      files: [
        {
          name: 'a0',
          path: '',
          type: FILE_TYPES.file
        },
           {
          name: 'b1',
          path: '',
          type: FILE_TYPES.file
        },
           {
          name: 'myDownloads',
          path: '',
          type: FILE_TYPES.folder,
          files: [
               {
          name: 'tzahi',
          type: FILE_TYPES.file
        },
                       {
          name: 'ddd',
          type: FILE_TYPES.file
        }
          ]
        }
      ]
    },
  {
    name:'root2',
    type:FILE_TYPES.file
  }]
  }];



  return (
    <main
      style={{
        padding: '2rem',
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <h1>Hello, World</h1>
      <p>react-playground — ready to extend.</p>
      <button onClick={()=>testFlat()}>TEST ME </button>
      <input defaultValue={inputVal.current} onChange={onInputChange}/>
      <h2>Objects</h2>

      <ul>
      {fileSystem.map(file=><FileComponent file={file} depth={1}/>)}
      </ul>



      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: 'tomato' }}>Error: {error.message}</p>}
      {data && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.map((obj) => (
            <li
              key={obj.id}
              style={{
                border: '1px solid #444',
                borderRadius: 6,
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
              }}
            >
              <strong>{obj.name}</strong>
              {obj.data && (
                <ul style={{ marginTop: '0.5rem' }}>
                  {Object.entries(obj.data).map(([k, v]) => (
                    <li key={k}>
                      {k}: {String(v)}
                    </li>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '1rem' }}>
                   <button onClick={() => add(obj)}>Add to cart</button>
                   {items.some(item => item.accessory.id === obj.id) ? <button onClick={() => remove(obj.id)}>Remove from cart</button> : null}
                   </div>
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
