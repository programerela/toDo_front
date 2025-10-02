# ToDo Frontend

Frontend aplikacije za upravljanje zadacima.

Izgrađen u **React + TypeScript (Vite)** sa:
- Context API za upravljanje state-om (taskovi, autentifikacija, statistika)
- Task CRUD operacije (create, read, update, delete)
- Filtriranje po statusu (all, active, completed)
- Admin panel za upravljanje korisnicima

---

## Pokretanje lokalno (PowerShell)

1. Uđi u frontend folder:

~powershell
cd .\toDo_front

2. Instaliraj zavisnosti:

~powershell
npm install

3. Napravi .env fajl u root-u sa URL-om backend-a:

VITE_API_URL=http://localhost:7265/api

4. Pokreni aplikaciju:

~powershell

npm run dev

Frontend će biti dostupan na http://localhost:5173.

## Arhitektura

React + TypeScript + Vite – brz i tipizovan frontend

Context API – jednostavno deljenje state-a između komponenti

REST API – komunikacija sa backendom (toDo_back)

Task filtering i stats – frontend filtrira i prikazuje broj završenih i aktivnih taskova

## Ključne odluke i kompromisi

Context API umesto Redux-a → jednostavnije održavanje

Minimalan UI → fokus na funkcionalnost i čitljiv kod
