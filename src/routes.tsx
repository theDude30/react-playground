import type { RouteObject } from 'react-router-dom';
import { AlertRulesPage } from '@/exercises/alert-rules';
import { Home } from '@/pages/Home';
import { EntityQueuePage } from '@/exercises/entity-queue';
import { RuleEditorPage } from '@/exercises/rule-editor';
import { AlertsTimelinePage } from '@/exercises/alerts-timeline';
import { CaseDetailPage } from '@/exercises/case-detail';
import { ExceptionsPage } from '@/exercises/exceptions';
import { RiskDetailPage } from '@/exercises/risk-detail';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
   { path: '/alerts', element: <AlertRulesPage /> },
   { path: '/entities', element: <EntityQueuePage /> },
   { path: '/rules', element: <RuleEditorPage /> },
    { path: '/alerts-timeline', element: <AlertsTimelinePage /> },
    { path: '/case', element: <CaseDetailPage /> },
    { path: '/exceptions', element: <ExceptionsPage /> },
    { path: '/risk', element: <RiskDetailPage /> }
];
