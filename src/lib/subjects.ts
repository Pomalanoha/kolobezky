// Témata kontaktního formuláře (sdílené mezi stránkami a serverem, bez závislostí).
export const SUBJECTS = {
  proefrit: 'Zkušební jízda',
  workshop: 'Workshop',
  prive: 'Soukromá lekce',
  sportstep: 'Koupě koloběžky / doplňku',
  club: 'Klub / klubové jízdy',
  skupina: 'Skupinová akce',
  poukaz: 'Dárkový poukaz',
  anders: 'Něco jiného',
} as const;
export type Subject = keyof typeof SUBJECTS;
export const isSubject = (s: string): s is Subject => s in SUBJECTS;
