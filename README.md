# FlowLog

FlowLog er et norsk arbeidsverktøy for registrering og dokumentasjon av kumulative måleravlesninger på festivaler. Appen inneholder hurtigregistrering, Live Festival, dokumentasjon, analyse, historikk og lokal backup.

Versjon: **FlowLog v1.0.1**

## Krav

- Node.js 20 eller nyere
- npm 10 eller nyere
- Et Supabase-prosjekt for innlogging

## Sett opp innlogging

FlowLog bruker Supabase Auth med e-post og passord. Det finnes ingen åpen registreringsside. Etter oppsett administrerer administrator brukere direkte under **Innstillinger → Brukere**.

1. Opprett et prosjekt i Supabase.
2. Åpne **Authentication → Providers → Email** og deaktiver åpen registrering («Allow new users to sign up»).
3. Opprett den første godkjente brukeren under **Authentication → Users**. Ved første innlogging blir denne brukeren administrator dersom FlowLog ikke har noen profiler fra før.
4. Kopier `.env.example` til `.env.local`.
5. Finn prosjektets URL og publiserbare anon-nøkkel under **Project Settings → API**, og fyll inn:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ditt-prosjekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-publiserbare-anon-nokkel
SUPABASE_SERVICE_ROLE_KEY=din-hemmelige-service-role-nokkel
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. Finn service role-nøkkelen under **Project Settings → API Keys**. Denne brukes kun av sikre serverhandlinger for brukeradministrasjon.
7. Legg lokal adresse og produksjonsadressen til under **Authentication → URL Configuration → Redirect URLs**. Sett `NEXT_PUBLIC_APP_URL` til riktig offentlig adresse i produksjon.

Anon-nøkkelen er laget for bruk i klient-/webapplikasjoner. `SUPABASE_SERVICE_ROLE_KEY` skal kun ligge i `.env.local` eller hos driftsleverandørens sikre miljøvariabler. Den må aldri ha prefikset `NEXT_PUBLIC_`, legges i frontendkode eller sjekkes inn i Git.

### Roller og brukeradministrasjon

- **Administrator:** full tilgang, inkludert Innstillinger og brukere.
- **Tekniker:** Hjem, Registrering, Live Festival, Dokumentasjon, Dashboard og Historikk.
- **Leser:** Hjem, Dokumentasjon, Dashboard og Historikk. Rollen kan ikke skrive, redigere eller slette data.

Administrator kan opprette brukere, endre rolle og status, deaktivere tilgang og sende passordreset under **Innstillinger → Brukere**. Eksisterende passord er aldri tilgjengelige i FlowLog. Profiler lagres i lokal SQLite, mens innlogging og passord håndteres av Supabase Auth.

## Start lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000). Du sendes til `/login` før resten av appen blir tilgjengelig. Installasjonen genererer Prisma-klienten og kjører eksisterende databasemigreringer. Den sletter ikke data.

## Produksjonsbygg

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Data og SQLite

FlowLog bruker Prisma med SQLite. Databasen ligger lokalt i `prisma/dev.db`. Festivaler, arrangører, arrangementer og avlesninger lagres der. Aktivt oppdrag, tema og favoritter lagres i nettleserens `localStorage`.

Ikke slett `prisma/dev.db`. Ta backup fra Innstillinger før oppdateringer eller flytting av appen.

### Viktig om Vercel

Prosjektet kan bygges og publiseres som en Next.js-app på Vercel, men Vercels serverløse filsystem gir **ikke varig lagring for SQLite-skrivinger**. En Vercel-publisering er derfor egnet til teknisk kontroll eller demonstrasjon, men må ikke være eneste lagringssted for daglig produksjonsdata.

For faktisk bruk med dagens SQLite-arkitektur må FlowLog kjøres på en maskin eller server med vedvarende disk. En senere overgang til en driftet database krever en egen, planlagt arkitekturendring.

## Publisering på Vercel

1. Legg prosjektet i et Git-repositorium.
2. Importer repositoriet i Vercel.
3. Velg Next.js som rammeverk.
4. Bruk `npm run build` som build-kommando.
5. Publiser og kontroller manifest, offline-side og hovedrutene.
6. Legg `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` og `NEXT_PUBLIC_APP_URL` inn under **Vercel → Project Settings → Environment Variables**.
7. Bruk publiseringen som demo inntil en vedvarende database er konfigurert.

## Installer på mobil

PWA-funksjonene krever HTTPS i produksjon. Utviklingsmodus deaktiverer service worker for å unngå gammelt mellomlager under utvikling.

### iPhone og iPad

1. Åpne FlowLog i Safari.
2. Trykk Del.
3. Velg «Legg til på Hjem-skjerm».
4. Start FlowLog fra det nye appikonet.

### Android

1. Åpne FlowLog i Chrome.
2. Åpne nettlesermenyen.
3. Velg «Installer app» eller «Legg til på startskjermen».

## Ta backup

1. Åpne Innstillinger.
2. Finn «Backup og data».
3. Trykk «Eksporter backup».
4. Oppbevar JSON-filen på et sikkert sted.

Backupen inneholder festivaler, arrangører, arrangementer, avlesninger og lokale innstillinger. Nye filer får navn som `FlowLog_backup_2026-06-19_14-30.json`.

## Importer backup

1. Åpne Innstillinger.
2. Velg en tidligere FlowLog-backup under «Importer data».
3. Kontroller oppsummeringen.
4. Bekreft importen.

Import er additiv: eksisterende data slettes ikke, og identiske avlesninger hoppes over. Eldre backupfiler fra før navnebyttet støttes fortsatt.
