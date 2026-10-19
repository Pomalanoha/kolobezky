// Témata kontaktního formuláře (sdílené mezi stránkami a serverem, bez závislostí).
export const SUBJECTS = {
  proefrit: 'Proefrit',
  workshop: 'Workshop',
  prive: 'Privéles',
  sportstep: 'Een step of accessoire kopen',
  club: 'Club / clubritten',
  skupina: 'Groepsuitje',
  poukaz: 'Cadeaubon',
  anders: 'Iets anders',
} as const;
export type Subject = keyof typeof SUBJECTS;
export const isSubject = (s: string): s is Subject => s in SUBJECTS;
