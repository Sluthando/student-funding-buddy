import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ApplicationStatus = 'Saved' | 'Preparing' | 'Applied' | 'Awaiting Response' | 'Successful' | 'Unsuccessful'
export type StudentProfile = { name: string; email: string; province: string; institution: string; studyLevel: string; field: string; year: string; average: string; funding: string }
type Application = { bursaryId: string; status: ApplicationStatus; submitted?: string }
type AppState = {
  onboarded: boolean; profile: StudentProfile; saved: string[]; applications: Application[]; checkedDocs: Record<string, string[]>; reminders: Record<string, string[]>; readNotifications: string[]
  completeOnboarding: (profile: StudentProfile) => void; updateProfile: (profile: StudentProfile) => void; toggleSaved: (id: string) => void; startApplication: (id: string) => void; updateStatus: (id: string, status: ApplicationStatus) => void; toggleDocument: (id: string, doc: string) => void; toggleReminder: (id: string, reminder: string) => void; markNotificationRead: (id: string) => void
}

const initialProfile: StudentProfile = { name: 'Lerato', email: 'lerato@example.co.za', province: 'Gauteng', institution: 'University of Johannesburg', studyLevel: 'University', field: 'Engineering', year: '2nd year', average: '70–79%', funding: 'Full funding' }
const initial: Omit<AppState, 'completeOnboarding'|'updateProfile'|'toggleSaved'|'startApplication'|'updateStatus'|'toggleDocument'|'toggleReminder'|'markNotificationRead'> = { onboarded: false, profile: initialProfile, saved: ['engineering-future', 'digital-pioneers', 'future-scientists'], applications: [{ bursaryId: 'engineering-future', status: 'Preparing' }, { bursaryId: 'digital-pioneers', status: 'Applied', submitted: '15 September 2026' }], checkedDocs: { 'engineering-future': ['Certified ID copy', 'Academic transcript', 'Proof of registration'] }, reminders: { 'engineering-future': ['3 days before'] }, readNotifications: [] }
const Context = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial)
  useEffect(() => { const raw = localStorage.getItem('bursarybuddy-state'); if (raw) { try { setState({ ...initial, ...JSON.parse(raw) }) } catch { /* keep demo defaults */ } } }, [])
  useEffect(() => { localStorage.setItem('bursarybuddy-state', JSON.stringify(state)) }, [state])
  const value: AppState = {
    ...state,
    completeOnboarding: profile => setState(s => ({ ...s, onboarded: true, profile })),
    updateProfile: profile => setState(s => ({ ...s, profile })),
    toggleSaved: id => setState(s => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id] })),
    startApplication: id => setState(s => ({ ...s, saved: s.saved.includes(id) ? s.saved : [...s.saved, id], applications: s.applications.some(a => a.bursaryId === id) ? s.applications : [...s.applications, { bursaryId: id, status: 'Preparing' }] })),
    updateStatus: (id, status) => setState(s => ({ ...s, applications: s.applications.map(a => a.bursaryId === id ? { ...a, status, submitted: status === 'Applied' && !a.submitted ? '18 September 2026' : a.submitted } : a) })),
    toggleDocument: (id, doc) => setState(s => { const list = s.checkedDocs[id] ?? []; return { ...s, checkedDocs: { ...s.checkedDocs, [id]: list.includes(doc) ? list.filter(x => x !== doc) : [...list, doc] } } }),
    toggleReminder: (id, reminder) => setState(s => { const list = s.reminders[id] ?? []; return { ...s, reminders: { ...s.reminders, [id]: list.includes(reminder) ? list.filter(x => x !== reminder) : [...list, reminder] } } }),
    markNotificationRead: id => setState(s => ({ ...s, readNotifications: s.readNotifications.includes(id) ? s.readNotifications : [...s.readNotifications, id] })),
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAppState() { const value = useContext(Context); if (!value) throw new Error('App state is unavailable'); return value }