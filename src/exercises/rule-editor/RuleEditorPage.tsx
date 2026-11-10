import { useState } from 'react';
import { t } from './i18n';
import { useRules } from './useRules';
import type { Rule, Severity } from './types';

const SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical'];

const EMPTY: Rule = {
  id: '',
  name: '',
  description: '',
  severity: 'low',
  riskScore: 50,
  query: '',
  enabled: false
};

export function RuleEditorPage() {
  const { rules, saving, save } = useRules();
  const [selected, setSelected] = useState<Rule>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);

  function validate(rule: Rule): string[] {
    const found: string[] = [];
    if (!rule.name) found.push(t('ruleEditor.nameRequired'));
    if (!(rule.riskScore > 0 && rule.riskScore < 100)) {
      found.push(t('ruleEditor.riskScoreRange'));
    }
    return found;
  }

  async function onSave() {
    let isNew = false;
    const found = validate(selected);
    setErrors(found);
    if(!selected.id){
      selected.id=crypto.randomUUID();
      isNew=true;
    }
    if (found.length) return;
    await save(selected,isNew);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', display: 'flex', gap: '2rem' }}>
      <section>
        <h1>{t('ruleEditor.title')}</h1>
        <ul style={{ listStyle: 'none', padding: 0, minWidth: 260 }}>
          {rules.map((rule) => (
            <li key={rule.id} style={{ marginBottom: '0.5rem' }}>
              <div
                onClick={() => setSelected(rule)}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  background: selected.id === rule.id ? '#eef' : '#fff',
                }}
              >
                <strong>{rule.name}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {rule.severity} · {rule.riskScore} · {rule.enabled ? 'on' : 'off'}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelected(EMPTY)}>{t('ruleEditor.newRule')}</button>
      </section>

      <section style={{ flex: 1, maxWidth: 520 }}>
        <h2>{selected.id ? selected.name : t('ruleEditor.newRule')}</h2>

        {errors.length > 0 && (
          <div style={{ border: '1px solid red', padding: '0.5rem', marginBottom: '1rem' }}>
            {errors.map((e) => (
              <div key={e} style={{ color: 'red' }}>{e}</div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <label>{t('ruleEditor.nameLabel')}</label>
            <input
              defaultValue={selected.name}
              onChange={(e) => setSelected({ ...selected, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Description</label>
            <input
              defaultValue={selected.description}
              onChange={(e) => setSelected({ ...selected, description: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>{t('ruleEditor.severityLabel')}</label>
            <select
              value={selected.severity}
              onChange={(e) => setSelected({ ...selected, severity: e.target.value as Severity })}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label>{t('ruleEditor.riskScoreLabel')}</label>
            <input
              type="number"
              defaultValue={selected.riskScore}
              onChange={(e) => setSelected({ ...selected, riskScore: Number(e.target.value) })}
            />
          </div>

          <div>
            <label>{t('ruleEditor.queryLabel')}</label>
            <textarea
              rows={3}
              defaultValue={selected.query}
              onChange={(e) => setSelected({ ...selected, query: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <input
              type="checkbox"
              checked={selected.enabled}
              onChange={(e) => setSelected({ ...selected, enabled: e.target.checked,})}
            />
            <span>{t('ruleEditor.enabledLabel')}</span>
          </div>

          <div>
            <button onClick={onSave}>
              {saving ? t('ruleEditor.saving') : t('ruleEditor.save')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
