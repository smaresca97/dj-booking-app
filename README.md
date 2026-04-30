# dj-booking-app

## Firebase setup

L'app usa Firebase Authentication con provider Google e Firestore per approvare i DJ.

1. Crea un progetto Firebase.
2. In Authentication abilita il provider Google.
3. Crea Firestore in modalità production.
4. Copia la configurazione web Firebase in `src/environments/firebase.ts`.
5. Sostituisci `INSERISCI_LA_TUA_EMAIL_GOOGLE` con la tua email Google in:
   - `src/environments/firebase.ts`
   - `firestore.rules`
6. Pubblica le regole Firestore da `firestore.rules`.

Al primo accesso con la tua email, l'utente viene creato come admin approvato. Gli altri account Google entrano come DJ `pending` e vanno approvati dalla pagina `/admin`.
