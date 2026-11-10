import { useState } from 'react';
import { useCase } from './useCase';
import type { CaseStatus } from './types';

const STATUSES: CaseStatus[] = ['open', 'in-progress', 'closed'];
const parser = new DOMParser();
export function CaseDetailPage() {

  const { theCase, comments, users, patchCase, addComment, deleteComment } = useCase();
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');

  if (!theCase) return <p>Loading…</p>;
 
  const ordered = comments.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );
  const shown = ordered.filter((c) =>
    c.body.toLowerCase().includes(filter.toLowerCase()),
  );
  // const santizedComments = shown.map((comment:Comment)=>({...comment,body:parser.parseFromString(comment.body,"text/html").documentElement.textContent}));

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 760 }}>
      <h1>{theCase.title}</h1>
      <div style={{ color: '#666', marginBottom: '1rem' }}>
        {theCase.severity} · opened {new Date(theCase.createdAt).toLocaleString()} ·{' '}
        {comments.length} comments
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select
          value={theCase.status}
          onChange={(e) => patchCase({ status: e.target.value as CaseStatus })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={theCase.assignee}
          onChange={(e) => patchCase({ assignee: e.target.value })}
        >
          {users.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <input
          placeholder="search comments"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {shown.map((comment) => (
          <li
            key={comment.id}
            style={{ borderTop: '1px solid #eee', padding: '0.75rem 0' }}
          >
            <div style={{ fontSize: 12, color: '#666' }}>
              {comment.author} · {new Date(comment.at).toLocaleString()}
              <button
                onClick={() => deleteComment(comment.id)}
                style={{ marginLeft: '0.5rem' }}
              >
                ×
              </button>
            </div>
            <div>{parser.parseFromString(comment.body,"text/html").documentElement.textContent}</div>
          </li>
        ))}
      </ul>

      <form style={{ marginTop: '1.5rem' }}>
        <textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="add a comment"
          style={{ width: '100%' }}
        />
        <button
          onClick={() => {
            addComment(draft);
            setDraft('');
          }}
        >
          Add comment
        </button>
      </form>
    </main>
  );
}
