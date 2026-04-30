import { Injectable, signal } from '@angular/core';

export type Language = 'it' | 'en';

type TranslationKey =
  | 'appName'
  | 'language'
  | 'welcomeEyebrow'
  | 'welcomeTitle'
  | 'welcomeSubtitle'
  | 'iAmDj'
  | 'findDj'
  | 'profileEyebrow'
  | 'profileTitle'
  | 'profileSubtitle'
  | 'stageName'
  | 'phone'
  | 'city'
  | 'genres'
  | 'bio'
  | 'saveProfile'
  | 'editProfile'
  | 'profileError'
  | 'contactDj'
  | 'call'
  | 'openWhatsapp'
  | 'copyPhone'
  | 'phoneCopied'
  | 'close'
  | 'loginEyebrow'
  | 'loginTitle'
  | 'loginSubtitle'
  | 'email'
  | 'password'
  | 'signIn'
  | 'changeAccessType'
  | 'loginError'
  | 'demoHint'
  | 'googleLoginTitle'
  | 'googleLoginSubtitle'
  | 'signInWithGoogle'
  | 'accessing'
  | 'googleLoginError'
  | 'approvalHint'
  | 'approvalStatus'
  | 'accountPending'
  | 'accountPendingCopy'
  | 'accountRejected'
  | 'accountRejectedCopy'
  | 'adminEyebrow'
  | 'adminTitle'
  | 'adminSubtitle'
  | 'pendingUsers'
  | 'approvedUsers'
  | 'rejectedUsers'
  | 'loadingUsers'
  | 'noUsersForFilter'
  | 'approveUser'
  | 'rejectUser'
  | 'adminNav'
  | 'dashboardEyebrow'
  | 'dashboardTitle'
  | 'dashboardSubtitle'
  | 'calendar'
  | 'search'
  | 'logout'
  | 'availability'
  | 'availabilitySubtitle'
  | 'eventDate'
  | 'available'
  | 'notAvailable'
  | 'statusSaved'
  | 'noStatus'
  | 'thisMonth'
  | 'previousMonth'
  | 'nextMonth'
  | 'bookingsTitle'
  | 'bookingsSubtitle'
  | 'availableDjs'
  | 'noAvailableDjs'
  | 'quickActions'
  | 'todayStatus'
  | 'setTodayAvailable'
  | 'manageCalendar'
  | 'findArtists';

const translations: Record<Language, Record<TranslationKey, string>> = {
  it: {
    appName: 'DJ Booking',
    language: 'Lingua',
    welcomeEyebrow: 'Benvenuto',
    welcomeTitle: 'Come vuoi entrare?',
    welcomeSubtitle: 'Scegli se gestire il tuo calendario da DJ o cercare artisti disponibili per un evento.',
    iAmDj: 'Sono un DJ',
    findDj: 'Trova DJ',
    profileEyebrow: 'Profilo DJ',
    profileTitle: 'Completa il tuo profilo pubblico',
    profileSubtitle: 'Questi dati saranno visibili ai clienti quando risulti disponibile per una data.',
    stageName: 'Nome d’arte',
    phone: 'Telefono',
    city: 'Citta',
    genres: 'Generi musicali',
    bio: 'Bio',
    saveProfile: 'Salva profilo',
    editProfile: 'Modifica profilo',
    profileError: 'Nome d’arte e telefono sono obbligatori.',
    contactDj: 'Contatta DJ',
    call: 'Chiama',
    openWhatsapp: 'WhatsApp',
    copyPhone: 'Copia numero',
    phoneCopied: 'Numero copiato',
    close: 'Chiudi',
    loginEyebrow: 'Area artisti',
    loginTitle: 'Accedi al tuo booking',
    loginSubtitle: 'Entra con email e password per gestire disponibilita e calendario.',
    email: 'Email',
    password: 'Password',
    signIn: 'Entra',
    changeAccessType: 'Cambia tipo di accesso',
    loginError: 'Inserisci una email valida e una password.',
    demoHint: 'Prototipo: la password viene validata solo localmente.',
    googleLoginTitle: 'Accedi con Google',
    googleLoginSubtitle: 'Usa il tuo account Google: dopo il primo accesso il profilo dovra essere approvato da un supervisore.',
    signInWithGoogle: 'Continua con Google',
    accessing: 'Accesso in corso...',
    googleLoginError: 'Non sono riuscito a completare l’accesso Google. Controlla Firebase e riprova.',
    approvalHint: 'Solo i DJ approvati possono entrare in dashboard e calendario.',
    approvalStatus: 'Stato account',
    accountPending: 'In attesa di approvazione',
    accountPendingCopy: 'La richiesta e stata inviata. Potrai accedere alla dashboard appena il supervisore approvera il tuo account.',
    accountRejected: 'Account non approvato',
    accountRejectedCopy: 'Questo account non e stato approvato. Contatta il supervisore se pensi sia un errore.',
    adminEyebrow: 'Supervisore',
    adminTitle: 'Gestione accessi DJ',
    adminSubtitle: 'Approva o rifiuta le richieste di accesso arrivate tramite Google.',
    pendingUsers: 'In attesa',
    approvedUsers: 'Approvati',
    rejectedUsers: 'Rifiutati',
    loadingUsers: 'Caricamento richieste...',
    noUsersForFilter: 'Nessun utente in questa lista.',
    approveUser: 'Approva',
    rejectUser: 'Rifiuta',
    adminNav: 'Admin',
    dashboardEyebrow: 'Dashboard',
    dashboardTitle: 'Ciao',
    dashboardSubtitle: 'Tieni aggiornate le disponibilita e controlla chi e libero per un evento.',
    calendar: 'Calendario',
    search: 'Ricerca',
    logout: 'Esci',
    availability: 'Disponibilita',
    availabilitySubtitle: 'Tocca un giorno e imposta il tuo stato per quella data.',
    eventDate: 'Data evento',
    available: 'Disponibile',
    notAvailable: 'Non disponibile',
    statusSaved: 'Stato salvato',
    noStatus: 'Nessuno stato',
    thisMonth: 'Questo mese',
    previousMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    bookingsTitle: 'Cerca DJ disponibili',
    bookingsSubtitle: 'Seleziona una data e trova gli artisti liberi.',
    availableDjs: 'DJ disponibili',
    noAvailableDjs: 'Nessun DJ disponibile per questa data.',
    quickActions: 'Azioni rapide',
    todayStatus: 'Stato di oggi',
    setTodayAvailable: 'Segna oggi disponibile',
    manageCalendar: 'Gestisci calendario',
    findArtists: 'Trova artisti'
  },
  en: {
    appName: 'DJ Booking',
    language: 'Language',
    welcomeEyebrow: 'Welcome',
    welcomeTitle: 'How do you want to enter?',
    welcomeSubtitle: 'Choose whether to manage your DJ calendar or search available artists for an event.',
    iAmDj: 'I am a DJ',
    findDj: 'Find DJs',
    profileEyebrow: 'DJ profile',
    profileTitle: 'Complete your public profile',
    profileSubtitle: 'Clients will see these details when you are available for a date.',
    stageName: 'Stage name',
    phone: 'Phone',
    city: 'City',
    genres: 'Music genres',
    bio: 'Bio',
    saveProfile: 'Save profile',
    editProfile: 'Edit profile',
    profileError: 'Stage name and phone are required.',
    contactDj: 'Contact DJ',
    call: 'Call',
    openWhatsapp: 'WhatsApp',
    copyPhone: 'Copy number',
    phoneCopied: 'Phone copied',
    close: 'Close',
    loginEyebrow: 'Artist area',
    loginTitle: 'Sign in to your booking',
    loginSubtitle: 'Use email and password to manage availability and calendar.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    changeAccessType: 'Change access type',
    loginError: 'Enter a valid email and password.',
    demoHint: 'Prototype: password is validated locally only.',
    googleLoginTitle: 'Sign in with Google',
    googleLoginSubtitle: 'Use your Google account: after the first sign-in, a supervisor must approve your profile.',
    signInWithGoogle: 'Continue with Google',
    accessing: 'Signing in...',
    googleLoginError: 'Google sign-in could not be completed. Check Firebase and try again.',
    approvalHint: 'Only approved DJs can access dashboard and calendar.',
    approvalStatus: 'Account status',
    accountPending: 'Waiting for approval',
    accountPendingCopy: 'Your request has been sent. You can access the dashboard as soon as the supervisor approves your account.',
    accountRejected: 'Account not approved',
    accountRejectedCopy: 'This account was not approved. Contact the supervisor if you think this is a mistake.',
    adminEyebrow: 'Supervisor',
    adminTitle: 'DJ access management',
    adminSubtitle: 'Approve or reject access requests submitted through Google.',
    pendingUsers: 'Pending',
    approvedUsers: 'Approved',
    rejectedUsers: 'Rejected',
    loadingUsers: 'Loading requests...',
    noUsersForFilter: 'No users in this list.',
    approveUser: 'Approve',
    rejectUser: 'Reject',
    adminNav: 'Admin',
    dashboardEyebrow: 'Dashboard',
    dashboardTitle: 'Hi',
    dashboardSubtitle: 'Keep availability updated and check who is free for an event.',
    calendar: 'Calendar',
    search: 'Search',
    logout: 'Logout',
    availability: 'Availability',
    availabilitySubtitle: 'Tap a day and set your status for that date.',
    eventDate: 'Event date',
    available: 'Available',
    notAvailable: 'Not available',
    statusSaved: 'Saved status',
    noStatus: 'No status',
    thisMonth: 'This month',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    bookingsTitle: 'Search available DJs',
    bookingsSubtitle: 'Pick a date and find free artists.',
    availableDjs: 'Available DJs',
    noAvailableDjs: 'No DJs available for this date.',
    quickActions: 'Quick actions',
    todayStatus: 'Today status',
    setTodayAvailable: 'Mark today available',
    manageCalendar: 'Manage calendar',
    findArtists: 'Find artists'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly key = 'dj-booking-language';
  readonly language = signal<Language>(this.readLanguage());

  setLanguage(language: Language): void {
    localStorage.setItem(this.key, language);
    this.language.set(language);
  }

  toggleLanguage(): void {
    this.setLanguage(this.language() === 'it' ? 'en' : 'it');
  }

  t(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  private readLanguage(): Language {
    return localStorage.getItem(this.key) === 'en' ? 'en' : 'it';
  }
}
