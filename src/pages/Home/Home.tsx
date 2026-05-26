import { useRestClient } from '@/hooks/useRestClient';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import type { Accessory } from '@/types/accessory';

export function Home() {
  const { data, isLoading, error } = useRestClient<Accessory[]>('/objects');
  const { add , remove , items} = useShoppingCart();
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

      <h2>Objects</h2>
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
