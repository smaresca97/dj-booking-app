import { Injectable, signal } from '@angular/core';

export type Language = 'it' | 'en';

type TranslationKey =
  | 'appName'
  | 'language'
  | 'welcomeEyebrow'
  | 'welcomeTitle'
  | 'welcomeSubtitle'
  | 'welcomeDjTitle'
  | 'welcomeDjCopy'
  | 'welcomeVenueTitle'
  | 'welcomeVenueCopy'
  | 'welcomeClientTitle'
  | 'welcomeClientCopy'
  | 'iAmDj'
  | 'iAmVenue'
  | 'findDj'
  | 'profileEyebrow'
  | 'profileTitle'
  | 'profileSubtitle'
  | 'stageName'
  | 'phone'
  | 'city'
  | 'genres'
  | 'bio'
  | 'profilePhoto'
  | 'changePhoto'
  | 'removePhoto'
  | 'photoHelp'
  | 'publicInfo'
  | 'publicInfoCopy'
  | 'photoError'
  | 'saveProfile'
  | 'editProfile'
  | 'profileError'
  | 'contactDj'
  | 'bookingRequest'
  | 'bookingRequestSubtitle'
  | 'fromTime'
  | 'toTime'
  | 'eventType'
  | 'eventPlace'
  | 'registeredVenue'
  | 'manualPlace'
  | 'selectVenue'
  | 'noRegisteredVenues'
  | 'eventTypeBirthday'
  | 'eventTypeParty'
  | 'eventTypeWedding'
  | 'eventTypeClub'
  | 'eventTypeCorporate'
  | 'eventTypeOther'
  | 'sendBookingRequest'
  | 'clientName'
  | 'clientPhone'
  | 'bookingRequestError'
  | 'bookingRequests'
  | 'bookingRequestsTitle'
  | 'bookingQueue'
  | 'bookingQueueTitle'
  | 'bookingQueueCopy'
  | 'adminBookingHelp'
  | 'acceptRequest'
  | 'rejectRequest'
  | 'pendingRequests'
  | 'acceptedRequests'
  | 'rejectedRequests'
  | 'noBookingRequests'
  | 'dayBookings'
  | 'call'
  | 'openWhatsapp'
  | 'copyPhone'
  | 'phoneCopied'
  | 'close'
  | 'saveChanges'
  | 'cancelBooking'
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
  | 'venueLoginSubtitle'
  | 'signInWithGoogle'
  | 'accessing'
  | 'googleLoginError'
  | 'approvalHint'
  | 'venueApprovalHint'
  | 'approvalStatus'
  | 'accountPending'
  | 'accountPendingCopy'
  | 'accountRejected'
  | 'accountRejectedCopy'
  | 'adminEyebrow'
  | 'adminTitle'
  | 'adminSubtitle'
  | 'accessManagement'
  | 'pendingUsers'
  | 'approvedUsers'
  | 'rejectedUsers'
  | 'deletedUsers'
  | 'usersFilterHint'
  | 'loadingUsers'
  | 'noUsersForFilter'
  | 'approveUser'
  | 'approveDj'
  | 'approveVenue'
  | 'rejectUser'
  | 'deleteUser'
  | 'deleteUserHint'
  | 'deleteUserError'
  | 'restoreUser'
  | 'restoreUserError'
  | 'adminNav'
  | 'artDirection'
  | 'artDirectionNav'
  | 'venueOperations'
  | 'venueOperationsCopy'
  | 'venueArea'
  | 'venueRole'
  | 'guestRole'
  | 'venueAssignmentsTitle'
  | 'venueAssignmentsSubtitle'
  | 'venueName'
  | 'venueNamePlaceholder'
  | 'linkedVenueAccount'
  | 'noLinkedVenue'
  | 'approvedVenues'
  | 'venueControlRoom'
  | 'venueControlRoomCopy'
  | 'assignmentDjAvailabilityHint'
  | 'venueDashboardTitle'
  | 'venueDashboardSubtitle'
  | 'venueDashboardCopy'
  | 'venueCalendar'
  | 'venueCalendarCopy'
  | 'nextNight'
  | 'registeredDj'
  | 'externalDj'
  | 'selectDj'
  | 'selectDjPlaceholder'
  | 'externalDjName'
  | 'assignmentNotes'
  | 'assignmentError'
  | 'saveAssignment'
  | 'updateAssignment'
  | 'editAssignment'
  | 'editAssignmentHint'
  | 'cancelEdit'
  | 'scheduledAssignments'
  | 'noAssignments'
  | 'assignmentFormTitle'
  | 'assignmentListCopy'
  | 'assignmentSavedHint'
  | 'dashboardEyebrow'
  | 'dashboardNav'
  | 'dashboardTitle'
  | 'dashboardSubtitle'
  | 'nextStep'
  | 'calendarNeededTitle'
  | 'calendarNeededCopy'
  | 'profileStrength'
  | 'profileVisible'
  | 'availabilityVisible'
  | 'calendar'
  | 'calendarNav'
  | 'search'
  | 'logout'
  | 'availability'
  | 'availabilitySubtitle'
  | 'calendarHowToTitle'
  | 'calendarHowToCopy'
  | 'selectedDay'
  | 'chooseStatus'
  | 'availableWholeMonth'
  | 'availableWholeMonthCopy'
  | 'setMonthAvailable'
  | 'savingMonth'
  | 'calendarLegendAvailable'
  | 'calendarLegendBusy'
  | 'calendarLegendEmpty'
  | 'eventDate'
  | 'available'
  | 'notAvailable'
  | 'statusSaved'
  | 'availabilitySaveError'
  | 'noStatus'
  | 'thisMonth'
  | 'previousMonth'
  | 'nextMonth'
  | 'bookingsTitle'
  | 'bookingsSubtitle'
  | 'availableDjs'
  | 'searchPanelTitle'
  | 'searchPanelCopy'
  | 'availableDjsForDate'
  | 'changeDateHint'
  | 'readyForDate'
  | 'noAvailableDjs'
  | 'quickActions'
  | 'todayStatus'
  | 'setTodayAvailable'
  | 'manageCalendar'
  | 'findArtists'
  | 'toastProfileSaved'
  | 'toastAvailabilitySaved'
  | 'toastMonthAvailabilitySaved'
  | 'toastUserApproved'
  | 'toastUserRejected'
  | 'toastUserDeleted'
  | 'toastUserRestored'
  | 'toastAssignmentSaved'
  | 'toastAssignmentUpdated'
  | 'toastAssignmentDeleted'
  | 'toastBookingRequestSent'
  | 'toastBookingAccepted'
  | 'toastBookingRejected'
  | 'toastBookingUpdated'
  | 'toastBookingCancelled'
  | 'toastCopied'
  | 'toastGenericError';

const translations: Record<Language, Record<TranslationKey, string>> = {
  it: {
    appName: 'DJ Booking',
    language: 'Lingua',
    welcomeEyebrow: 'Benvenuto',
    welcomeTitle: 'Come vuoi entrare?',
    welcomeSubtitle: 'Scegli se gestire il tuo calendario da DJ o cercare artisti disponibili per un evento.',
    welcomeDjTitle: 'Area DJ',
    welcomeDjCopy: 'Aggiorna profilo, foto e disponibilita. Compari solo nei giorni segnati disponibili.',
    welcomeVenueTitle: 'Area Locali',
    welcomeVenueCopy: 'Accedi come locale e consulta le serate che l’admin ti ha assegnato.',
    welcomeClientTitle: 'Cerco un DJ',
    welcomeClientCopy: 'Scegli una data, vedi solo artisti liberi e invia una richiesta gia pronta.',
    iAmDj: 'Sono un DJ',
    iAmVenue: 'Sono un locale',
    findDj: 'Trova DJ',
    profileEyebrow: 'Profilo DJ',
    profileTitle: 'Completa il tuo profilo pubblico',
    profileSubtitle: 'Questi dati saranno visibili ai clienti quando risulti disponibile per una data.',
    stageName: 'Nome d’arte',
    phone: 'Telefono',
    city: 'Citta',
    genres: 'Generi musicali',
    bio: 'Bio',
    profilePhoto: 'Foto profilo',
    changePhoto: 'Carica foto',
    removePhoto: 'Rimuovi foto',
    photoHelp: 'Una foto riconoscibile rende la scheda piu affidabile nella ricerca clienti.',
    publicInfo: 'Informazioni pubbliche',
    publicInfoCopy: 'Mostra subito chi sei, dove lavori e come contattarti.',
    photoError: 'Non sono riuscito a leggere la foto. Prova con un’immagine piu leggera.',
    saveProfile: 'Salva profilo',
    editProfile: 'Modifica profilo',
    profileError: 'Nome d’arte e telefono sono obbligatori.',
    contactDj: 'Contatta DJ',
    bookingRequest: 'Prenotazione per questa data',
    bookingRequestSubtitle: 'Compila i dettagli e invia una richiesta gia pronta al DJ.',
    fromTime: 'Dalle',
    toTime: 'Alle',
    eventType: 'Tipo evento',
    eventPlace: 'Luogo',
    registeredVenue: 'Locale registrato',
    manualPlace: 'Luogo manuale',
    selectVenue: 'Seleziona locale',
    noRegisteredVenues: 'Nessun locale approvato',
    eventTypeBirthday: 'Compleanno',
    eventTypeParty: 'Festa privata',
    eventTypeWedding: 'Matrimonio',
    eventTypeClub: 'Locale / Club',
    eventTypeCorporate: 'Evento aziendale',
    eventTypeOther: 'Altro',
    sendBookingRequest: 'Invia richiesta',
    clientName: 'Il tuo nome',
    clientPhone: 'Il tuo telefono',
    bookingRequestError: 'Inserisci nome, telefono e luogo per inviare la richiesta.',
    bookingRequests: 'Richieste',
    bookingRequestsTitle: 'Prenotazioni da gestire',
    bookingQueue: 'Centro operativo',
    bookingQueueTitle: 'Richieste clienti',
    bookingQueueCopy: 'Vedi subito cosa e arrivato, cosa hai confermato e cosa e stato rifiutato.',
    adminBookingHelp: 'Accettando una richiesta la data del DJ viene occupata e non compare piu nelle ricerche.',
    acceptRequest: 'Accetta',
    rejectRequest: 'Rifiuta',
    pendingRequests: 'Da gestire',
    acceptedRequests: 'Accettate',
    rejectedRequests: 'Rifiutate',
    noBookingRequests: 'Nessuna richiesta da gestire.',
    dayBookings: 'Impegni del giorno',
    call: 'Chiama',
    openWhatsapp: 'WhatsApp',
    copyPhone: 'Copia numero',
    phoneCopied: 'Numero copiato',
    close: 'Chiudi',
    saveChanges: 'Salva modifiche',
    cancelBooking: 'Annulla impegno',
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
    venueLoginSubtitle: 'Usa Google per richiedere accesso come locale. Dopo l’approvazione vedrai solo le serate assegnate al tuo account.',
    signInWithGoogle: 'Continua con Google',
    accessing: 'Accesso in corso...',
    googleLoginError: 'Non sono riuscito a completare l’accesso Google. Controlla Firebase e riprova.',
    approvalHint: 'Solo i DJ approvati possono entrare in dashboard e calendario.',
    venueApprovalHint: 'Solo i locali approvati possono vedere la propria programmazione.',
    approvalStatus: 'Stato account',
    accountPending: 'In attesa di approvazione',
    accountPendingCopy: 'La richiesta e stata inviata. Potrai accedere alla dashboard appena il supervisore approvera il tuo account.',
    accountRejected: 'Account non approvato',
    accountRejectedCopy: 'Questo account non e stato approvato. Contatta il supervisore se pensi sia un errore.',
    adminEyebrow: 'Supervisore',
    adminTitle: 'Pannello admin',
    adminSubtitle: 'Gestisci richieste clienti, accessi DJ e serate nei locali da un unico punto.',
    accessManagement: 'Accessi DJ',
    pendingUsers: 'In attesa',
    approvedUsers: 'Approvati',
    rejectedUsers: 'Rifiutati',
    deletedUsers: 'Eliminati',
    usersFilterHint: 'Gestisci il ciclo degli account: approva, rifiuta, elimina o rimetti in circolo un DJ.',
    loadingUsers: 'Caricamento richieste...',
    noUsersForFilter: 'Nessun utente in questa lista.',
    approveUser: 'Approva',
    approveDj: 'Approva DJ',
    approveVenue: 'Approva locale',
    rejectUser: 'Rifiuta',
    deleteUser: 'Elimina',
    deleteUserHint: 'Scorri a sinistra per eliminare dagli approvati.',
    deleteUserError: 'Non posso eliminare questo utente.',
    restoreUser: 'Rimetti in approvati',
    restoreUserError: 'Non posso ripristinare questo utente.',
    adminNav: 'Admin',
    artDirection: 'Art direction',
    artDirectionNav: 'Locali',
    venueOperations: 'Programmazione',
    venueOperationsCopy: 'Apri la sezione locali per assegnare DJ registrati o artisti esterni alle date.',
    venueArea: 'Area locali',
    venueRole: 'Locale',
    guestRole: 'Ospite',
    venueAssignmentsTitle: 'Assegna DJ ai locali',
    venueAssignmentsSubtitle: 'Organizza chi suona in un locale in date specifiche. Usa DJ registrati o inserisci artisti esterni a mano.',
    venueName: 'Locale',
    venueNamePlaceholder: 'Es. Club, lounge, ristorante...',
    linkedVenueAccount: 'Account locale',
    noLinkedVenue: 'Nessun account collegato',
    approvedVenues: 'Locali approvati',
    venueControlRoom: 'Regia locali',
    venueControlRoomCopy: 'Scegli data, locale, DJ disponibile e collega l’account del locale quando esiste.',
    assignmentDjAvailabilityHint: 'La lista DJ registrati mostra solo chi ha dato disponibilita per questa data.',
    venueDashboardTitle: 'Programmazione locale',
    venueDashboardSubtitle: 'Qui trovi le serate che l’admin ha assegnato al tuo locale.',
    venueDashboardCopy: 'Controlla rapidamente le prossime date e i DJ previsti.',
    venueCalendar: 'Calendario locale',
    venueCalendarCopy: 'Quando l’admin collega il tuo account a una serata, la trovi qui.',
    nextNight: 'Prossima serata',
    registeredDj: 'DJ registrato',
    externalDj: 'DJ esterno',
    selectDj: 'Seleziona DJ',
    selectDjPlaceholder: 'Scegli un DJ registrato',
    externalDjName: 'Nome DJ esterno',
    assignmentNotes: 'Note',
    assignmentError: 'Inserisci locale, data e DJ.',
    saveAssignment: 'Salva assegnazione',
    updateAssignment: 'Aggiorna assegnazione',
    editAssignment: 'Modifica',
    editAssignmentHint: 'Stai modificando una serata esistente. Puoi collegarla a un account locale approvato senza crearne una nuova.',
    cancelEdit: 'Annulla',
    scheduledAssignments: 'Assegnazioni programmate',
    noAssignments: 'Nessuna assegnazione programmata.',
    assignmentFormTitle: 'Nuova serata',
    assignmentListCopy: 'Qui trovi il calendario operativo dei locali che stai seguendo.',
    assignmentSavedHint: 'Le assegnazioni sono visibili solo all’admin.',
    dashboardEyebrow: 'Dashboard',
    dashboardNav: 'Home',
    dashboardTitle: 'Ciao',
    dashboardSubtitle: 'Tieni aggiornate le disponibilita e controlla chi e libero per un evento.',
    nextStep: 'Prossimo passo',
    calendarNeededTitle: 'Aggiorna il calendario',
    calendarNeededCopy: 'Se una data non ha stato, i clienti non ti vedono. Segna i giorni liberi per comparire nelle ricerche.',
    profileStrength: 'Profilo pubblico',
    profileVisible: 'Foto e info rendono la scheda piu chiara ai clienti.',
    availabilityVisible: 'Visibile ai clienti quando sei disponibile',
    calendar: 'Calendario',
    calendarNav: 'Calendario',
    search: 'Ricerca',
    logout: 'Esci',
    availability: 'Disponibilita',
    availabilitySubtitle: 'Seleziona una data e indica se sei disponibile. I clienti ti vedranno solo nei giorni segnati disponibili.',
    calendarHowToTitle: 'Come funziona',
    calendarHowToCopy: '1. Tocca un giorno sul calendario. 2. Premi Disponibile o Non disponibile. 3. Lo stato viene salvato per i clienti.',
    selectedDay: 'Giorno selezionato',
    chooseStatus: 'Scegli cosa devono vedere i clienti',
    availableWholeMonth: 'Disponibile tutto il mese',
    availableWholeMonthCopy: 'Imposta tutti i giorni del mese visibile. Dopo puoi modificare singole date.',
    setMonthAvailable: 'Segna mese',
    savingMonth: 'Salvo...',
    calendarLegendAvailable: 'Verde: i clienti possono prenotarti',
    calendarLegendBusy: 'Rosa: non compari nelle ricerche',
    calendarLegendEmpty: 'Scuro: nessuno stato impostato',
    eventDate: 'Data evento',
    available: 'Disponibile',
    notAvailable: 'Non disponibile',
    statusSaved: 'Stato salvato',
    availabilitySaveError: 'Non sono riuscito a salvare la disponibilita. Controlla che l’account sia approvato e riprova.',
    noStatus: 'Nessuno stato',
    thisMonth: 'Questo mese',
    previousMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    bookingsTitle: 'Cerca DJ disponibili',
    bookingsSubtitle: 'Seleziona una data e trova gli artisti liberi.',
    availableDjs: 'DJ disponibili',
    searchPanelTitle: 'Quando ti serve il DJ?',
    searchPanelCopy: 'La lista si aggiorna subito e mostra solo chi ha segnato disponibile quella data.',
    availableDjsForDate: 'Disponibili per questa data',
    changeDateHint: 'Prova un’altra data: i DJ senza disponibilita salvata non vengono mostrati.',
    readyForDate: 'Pronto per la tua data',
    noAvailableDjs: 'Nessun DJ disponibile per questa data.',
    quickActions: 'Azioni rapide',
    todayStatus: 'Stato di oggi',
    setTodayAvailable: 'Segna oggi disponibile',
    manageCalendar: 'Gestisci calendario',
    findArtists: 'Trova artisti',
    toastProfileSaved: 'Profilo salvato correttamente.',
    toastAvailabilitySaved: 'Disponibilita aggiornata.',
    toastMonthAvailabilitySaved: 'Tutto il mese e stato segnato disponibile.',
    toastUserApproved: 'Utente approvato.',
    toastUserRejected: 'Utente rifiutato.',
    toastUserDeleted: 'Utente spostato tra gli eliminati.',
    toastUserRestored: 'Utente rimesso tra gli approvati.',
    toastAssignmentSaved: 'Assegnazione salvata.',
    toastAssignmentUpdated: 'Assegnazione aggiornata.',
    toastAssignmentDeleted: 'Assegnazione eliminata.',
    toastBookingRequestSent: 'Richiesta inviata al DJ.',
    toastBookingAccepted: 'Richiesta accettata e data occupata.',
    toastBookingRejected: 'Richiesta rifiutata.',
    toastBookingUpdated: 'Impegno aggiornato.',
    toastBookingCancelled: 'Impegno annullato.',
    toastCopied: 'Copiato negli appunti.',
    toastGenericError: 'Qualcosa non e andato. Riprova.'
  },
  en: {
    appName: 'DJ Booking',
    language: 'Language',
    welcomeEyebrow: 'Welcome',
    welcomeTitle: 'How do you want to enter?',
    welcomeSubtitle: 'Choose whether to manage your DJ calendar or search available artists for an event.',
    welcomeDjTitle: 'DJ area',
    welcomeDjCopy: 'Update profile, photo, and availability. You appear only on days marked available.',
    welcomeVenueTitle: 'Venue area',
    welcomeVenueCopy: 'Sign in as a venue and see the nights assigned by the admin.',
    welcomeClientTitle: 'I need a DJ',
    welcomeClientCopy: 'Pick a date, see only free artists, and send a ready-made request.',
    iAmDj: 'I am a DJ',
    iAmVenue: 'I am a venue',
    findDj: 'Find DJs',
    profileEyebrow: 'DJ profile',
    profileTitle: 'Complete your public profile',
    profileSubtitle: 'Clients will see these details when you are available for a date.',
    stageName: 'Stage name',
    phone: 'Phone',
    city: 'City',
    genres: 'Music genres',
    bio: 'Bio',
    profilePhoto: 'Profile photo',
    changePhoto: 'Upload photo',
    removePhoto: 'Remove photo',
    photoHelp: 'A recognizable photo makes your card feel more trustworthy in client search.',
    publicInfo: 'Public information',
    publicInfoCopy: 'Show who you are, where you work, and how clients can contact you.',
    photoError: 'The photo could not be read. Try a lighter image.',
    saveProfile: 'Save profile',
    editProfile: 'Edit profile',
    profileError: 'Stage name and phone are required.',
    contactDj: 'Contact DJ',
    bookingRequest: 'Booking for this date',
    bookingRequestSubtitle: 'Fill in the details and send a ready-made request to the DJ.',
    fromTime: 'From',
    toTime: 'To',
    eventType: 'Event type',
    eventPlace: 'Place',
    registeredVenue: 'Registered venue',
    manualPlace: 'Manual place',
    selectVenue: 'Select venue',
    noRegisteredVenues: 'No approved venues',
    eventTypeBirthday: 'Birthday',
    eventTypeParty: 'Private party',
    eventTypeWedding: 'Wedding',
    eventTypeClub: 'Venue / Club',
    eventTypeCorporate: 'Corporate event',
    eventTypeOther: 'Other',
    sendBookingRequest: 'Send request',
    clientName: 'Your name',
    clientPhone: 'Your phone',
    bookingRequestError: 'Enter name, phone, and place to send the request.',
    bookingRequests: 'Requests',
    bookingRequestsTitle: 'Bookings to manage',
    bookingQueue: 'Operations center',
    bookingQueueTitle: 'Client requests',
    bookingQueueCopy: 'See what came in, what is confirmed, and what was rejected.',
    adminBookingHelp: 'When you accept a request, the DJ date is blocked and no longer appears in searches.',
    acceptRequest: 'Accept',
    rejectRequest: 'Reject',
    pendingRequests: 'To manage',
    acceptedRequests: 'Accepted',
    rejectedRequests: 'Rejected',
    noBookingRequests: 'No requests to manage.',
    dayBookings: 'Day bookings',
    call: 'Call',
    openWhatsapp: 'WhatsApp',
    copyPhone: 'Copy number',
    phoneCopied: 'Phone copied',
    close: 'Close',
    saveChanges: 'Save changes',
    cancelBooking: 'Cancel booking',
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
    venueLoginSubtitle: 'Use Google to request venue access. After approval, you will see only the nights assigned to your account.',
    signInWithGoogle: 'Continue with Google',
    accessing: 'Signing in...',
    googleLoginError: 'Google sign-in could not be completed. Check Firebase and try again.',
    approvalHint: 'Only approved DJs can access dashboard and calendar.',
    venueApprovalHint: 'Only approved venues can see their schedule.',
    approvalStatus: 'Account status',
    accountPending: 'Waiting for approval',
    accountPendingCopy: 'Your request has been sent. You can access the dashboard as soon as the supervisor approves your account.',
    accountRejected: 'Account not approved',
    accountRejectedCopy: 'This account was not approved. Contact the supervisor if you think this is a mistake.',
    adminEyebrow: 'Supervisor',
    adminTitle: 'Admin panel',
    adminSubtitle: 'Manage client requests, DJ access, and venue nights from one place.',
    accessManagement: 'DJ access',
    pendingUsers: 'Pending',
    approvedUsers: 'Approved',
    rejectedUsers: 'Rejected',
    deletedUsers: 'Deleted',
    usersFilterHint: 'Manage the account lifecycle: approve, reject, delete, or restore a DJ.',
    loadingUsers: 'Loading requests...',
    noUsersForFilter: 'No users in this list.',
    approveUser: 'Approve',
    approveDj: 'Approve DJ',
    approveVenue: 'Approve venue',
    rejectUser: 'Reject',
    deleteUser: 'Delete',
    deleteUserHint: 'Swipe left to remove from approved users.',
    deleteUserError: 'This user could not be deleted.',
    restoreUser: 'Restore to approved',
    restoreUserError: 'This user could not be restored.',
    adminNav: 'Admin',
    artDirection: 'Art direction',
    artDirectionNav: 'Venues',
    venueOperations: 'Scheduling',
    venueOperationsCopy: 'Open venues to assign registered DJs or external artists to dates.',
    venueArea: 'Venue area',
    venueRole: 'Venue',
    guestRole: 'Guest',
    venueAssignmentsTitle: 'Assign DJs to venues',
    venueAssignmentsSubtitle: 'Plan who plays at a venue on specific dates. Use registered DJs or add external artists manually.',
    venueName: 'Venue',
    venueNamePlaceholder: 'E.g. club, lounge, restaurant...',
    linkedVenueAccount: 'Venue account',
    noLinkedVenue: 'No linked account',
    approvedVenues: 'Approved venues',
    venueControlRoom: 'Venue control room',
    venueControlRoomCopy: 'Pick date, venue, available DJ, and link the venue account when it exists.',
    assignmentDjAvailabilityHint: 'Registered DJs show only when they marked availability for this date.',
    venueDashboardTitle: 'Venue schedule',
    venueDashboardSubtitle: 'Here are the nights the admin assigned to your venue.',
    venueDashboardCopy: 'Quickly check upcoming dates and planned DJs.',
    venueCalendar: 'Venue calendar',
    venueCalendarCopy: 'When the admin links your account to a night, it appears here.',
    nextNight: 'Next night',
    registeredDj: 'Registered DJ',
    externalDj: 'External DJ',
    selectDj: 'Select DJ',
    selectDjPlaceholder: 'Choose a registered DJ',
    externalDjName: 'External DJ name',
    assignmentNotes: 'Notes',
    assignmentError: 'Enter venue, date, and DJ.',
    saveAssignment: 'Save assignment',
    updateAssignment: 'Update assignment',
    editAssignment: 'Edit',
    editAssignmentHint: 'You are editing an existing night. You can link it to an approved venue account without creating a duplicate.',
    cancelEdit: 'Cancel',
    scheduledAssignments: 'Scheduled assignments',
    noAssignments: 'No scheduled assignments.',
    assignmentFormTitle: 'New night',
    assignmentListCopy: 'This is the operating schedule for the venues you are directing.',
    assignmentSavedHint: 'Assignments are visible to admins only.',
    dashboardEyebrow: 'Dashboard',
    dashboardNav: 'Home',
    dashboardTitle: 'Hi',
    dashboardSubtitle: 'Keep availability updated and check who is free for an event.',
    nextStep: 'Next step',
    calendarNeededTitle: 'Update calendar',
    calendarNeededCopy: 'If a date has no status, clients cannot see you. Mark free days to appear in searches.',
    profileStrength: 'Public profile',
    profileVisible: 'Photo and info make your card clearer for clients.',
    availabilityVisible: 'Visible to clients when available',
    calendar: 'Calendar',
    calendarNav: 'Calendar',
    search: 'Search',
    logout: 'Logout',
    availability: 'Availability',
    availabilitySubtitle: 'Select a date and mark whether you are available. Clients will only see you on days marked available.',
    calendarHowToTitle: 'How it works',
    calendarHowToCopy: '1. Tap a day on the calendar. 2. Press Available or Not available. 3. The status is saved for clients.',
    selectedDay: 'Selected day',
    chooseStatus: 'Choose what clients should see',
    availableWholeMonth: 'Available all month',
    availableWholeMonthCopy: 'Set every day in the visible month. You can still edit single dates after.',
    setMonthAvailable: 'Set month',
    savingMonth: 'Saving...',
    calendarLegendAvailable: 'Green: clients can book you',
    calendarLegendBusy: 'Pink: you will not appear in searches',
    calendarLegendEmpty: 'Dark: no status set',
    eventDate: 'Event date',
    available: 'Available',
    notAvailable: 'Not available',
    statusSaved: 'Saved status',
    availabilitySaveError: 'Availability could not be saved. Check that the account is approved and try again.',
    noStatus: 'No status',
    thisMonth: 'This month',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    bookingsTitle: 'Search available DJs',
    bookingsSubtitle: 'Pick a date and find free artists.',
    availableDjs: 'Available DJs',
    searchPanelTitle: 'When do you need the DJ?',
    searchPanelCopy: 'The list updates instantly and shows only artists marked available on that date.',
    availableDjsForDate: 'Available for this date',
    changeDateHint: 'Try another date: DJs without saved availability are not shown.',
    readyForDate: 'Ready for your date',
    noAvailableDjs: 'No DJs available for this date.',
    quickActions: 'Quick actions',
    todayStatus: 'Today status',
    setTodayAvailable: 'Mark today available',
    manageCalendar: 'Manage calendar',
    findArtists: 'Find artists',
    toastProfileSaved: 'Profile saved.',
    toastAvailabilitySaved: 'Availability updated.',
    toastMonthAvailabilitySaved: 'The whole month was marked available.',
    toastUserApproved: 'User approved.',
    toastUserRejected: 'User rejected.',
    toastUserDeleted: 'User moved to deleted.',
    toastUserRestored: 'User restored to approved.',
    toastAssignmentSaved: 'Assignment saved.',
    toastAssignmentUpdated: 'Assignment updated.',
    toastAssignmentDeleted: 'Assignment deleted.',
    toastBookingRequestSent: 'Request sent to the DJ.',
    toastBookingAccepted: 'Request accepted and date blocked.',
    toastBookingRejected: 'Request rejected.',
    toastBookingUpdated: 'Booking updated.',
    toastBookingCancelled: 'Booking cancelled.',
    toastCopied: 'Copied to clipboard.',
    toastGenericError: 'Something went wrong. Try again.'
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
