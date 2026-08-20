# Virtual Pet App

Virtual Pet App je web aplikacija za brigu o virtualnom ljubimcu. Korisnik se registrira i prijavljuje putem JWT autentikacije, bira vrstu, boju i spol ljubimca te ga vodi kroz svakodnevni život: hrani ga, čisti ga, zabavlja ga i prati njegov razvoj kroz vrijeme.

## Funkcionalnosti

- Registracija i prijava korisnika koristeći JWT
- Kreiranje ljubimca s odabirom vrste, boje i spola
- Briga o ljubimcu: hranjenje, čišćenje i igranje
- Propadanje statistika kroz vrijeme (glad, čistoća, sreća, energija)
- XP i level sustav
- Faze rasta ljubimca: baby, child, adult
- Integracija vremenske prognoze koja utječe na vizualnu scenu (dan/noć, kiša/snijeg/oblačno)
- Sustav umiranja ljubimca u slučaju zanemarivanja

## Tehnologije

- MongoDB
- Express.js
- React.js
- Node.js
- JWT (JSON Web Tokens)
- OpenWeatherMap API

## Prijava i registracija

Aplikacija koristi JWT za zaštitu korisničkih ruta i sesije. Nakon registracije ili prijave, frontend pohranjuje token i šalje ga u `Authorization` header za sve zahtjeve vezane uz ljubimca.

## Pokretanje projekta

### 1. Kloniraj repozitorij

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Instaliraj ovisnosti

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

### 3. Postavi environment varijable

Kreiraj `.env` datoteku u `server` direktoriju prema `.env.example` obrascu.

### 4. Pokreni aplikaciju

U terminalu za server:

```bash
cd server
npm run dev
```

U drugom terminalu za client:

```bash
cd client
npm run dev
```

## .env varijable

U `server/.env` datoteci potrebno je definirati sljedeće varijable:

- `PORT` - port na kojem se pokreće Express server
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - tajni ključ za JWT signiranje i verifikaciju
- `WEATHER_API_KEY` - API ključ za OpenWeatherMap servis

Napomena: u ovoj datoteci ne stavljaj pravi ključ ili stvarne vrijednosti za produkciju.

## Struktura projekta

```text
virtual-pet-app/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── package.json
├── README.md
└── .gitignore
```

## Napomena

Ovaj projekt je namijenjen kao funkcionalni demo i razvojni prototip virtualnog ljubimca s osnovnim sustavom upravljanja, statistika i vizualnog ponašanja.
