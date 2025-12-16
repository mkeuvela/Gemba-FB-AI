import { DashboardData } from './types';

export const INITIAL_DATA: DashboardData = {
  rtb: {
    id: 'rtb',
    title: 'Running the Business',
    topics: [
      {
        id: 't1',
        title: 'Osiris',
        updates: [
          { id: 'u1', title: 'Inschrijfmodule Live', text: 'De nieuwe inschrijfmodule is succesvol live gegaan na de testfase.' },
          { id: 'u2', title: 'Database Optimalisatie', text: 'Performance optimalisatie database afgerond, laadtijden met 20% verbeterd.' }
        ]
      },
      {
        id: 't2',
        title: 'Studielink',
        updates: []
      },
      {
        id: 't3',
        title: 'International Office',
        updates: [
          { id: 'u3', title: 'Erasmus+ Q4', text: 'Alle Erasmus+ aanvragen zijn verwerkt voor het vierde kwartaal.' }
        ]
      },
      {
        id: 't4',
        title: 'Functioneel Beheer Gilde',
        updates: []
      },
      {
        id: 't5',
        title: 'Managementinformatie',
        updates: []
      }
    ]
  },
  projects: {
    id: 'projects',
    title: 'Projecten',
    topics: [
      {
        id: 'p1',
        title: 'Actuele projecten',
        updates: [
          { id: 'u4', title: 'Cloud Migratie', text: 'Migratie naar Cloud omgeving gestart. Eerste servers zijn overgezet.' }
        ]
      },
      {
        id: 'p2',
        title: 'In beheer/nazorg',
        updates: []
      },
      {
        id: 'p3',
        title: 'Toekomstig',
        updates: []
      }
    ]
  }
};

export const STORAGE_KEY = 'gemba_dashboard_data';