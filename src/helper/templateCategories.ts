import { Classification } from 'contexts/iProcessContext'

/**
 * This file is basically supporting the disruption classification as a back up in case the admin does not add any
 * @deprecated Avoid defining hard-coded values. Use data from the database
 */
export const defaultOptions: Classification[] = [
  {
    id: '0',
    value: 'Maschine Default',
    options: [
      { id: '0', value: 'Anlage' },
      { id: '1', value: 'Roboter' },
      { id: '2', value: 'Fördertechnik' },
      { id: '3', value: 'Baugruppe' },
      {
        id: '4',
        value: 'Werkzeug',
        options: [
          { id: '0', value: 'Elektrisch' },
          { id: '1', value: 'Mechanisch' },
          { id: '2', value: 'Hydraulisch' },
          { id: '3', value: 'Pneumatisch' }
        ]
      }
    ]
  },
  {
    id: '1',
    value: 'Methode Default',
    options: [
      { id: '0', value: 'Arbeitsmittel' },
      { id: '1', value: 'Arbeitsplanung' },
      { id: '2', value: 'Abläufe' }
    ]
  },
  {
    id: '2',
    value: 'Material Default',
    options: [
      { id: '0', value: 'Kein Leergut' },
      { id: '1', value: 'Logistik' },
      { id: '2', value: 'Anlieferungsqualität' }
    ]
  },
  {
    id: '3',
    value: 'Mensch Default',
    options: [
      { id: '0', value: 'Qualifizierung' },
      { id: '1', value: 'Stimmung' }
    ]
  },
  {
    id: '4',
    value: 'Mitwelt Default',
    options: [
      { id: '0', value: 'Informationsfluss' },
      { id: '1', value: 'Äußere Einwirkungen' },
      { id: '2', value: 'Voller Puffer' },
      { id: '3', value: 'Vorgelagerter Prozess' }
    ]
  }
]
