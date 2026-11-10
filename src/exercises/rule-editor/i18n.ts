// Stand-in for @kbn/i18n. Every user-facing string is supposed to go through this.
const dictionary: Record<string, string> = {
  'ruleEditor.title': 'Detection rules',
  'ruleEditor.save': 'Save',
  'ruleEditor.saving': 'Saving…',
  'ruleEditor.nameLabel': 'Rule name',
  'ruleEditor.severityLabel': 'Severity',
  'ruleEditor.riskScoreLabel': 'Risk score',
  'ruleEditor.queryLabel': 'Query',
  'ruleEditor.enabledLabel': 'Enabled',
  'ruleEditor.newRule': 'New rule',
  'ruleEditor.nameRequired': 'Rule name is required',
  'ruleEditor.riskScoreRange': 'Risk score must be between 0 and 100',
  'ruleEditor.saveFailed': 'Could not save the rule',
};

export function t(id: string, fallback?: string): string {
  return dictionary[id] ?? fallback ?? id;
}
