# Фітнес-трекер

Трекер для відстеження тренувань, вправ та прогресу.

## Технологічний стек
- **Backend:** Node.js, Nest.js, TypeScript
- **Frontend:** React (Vite), TypeScript

## Структура репозиторію
- `/backend` - Nest.js API
- `/frontend` - React SPA

## Сутності та Ендпоінти (Day 1)
**Сутність: Workout (Тренування)**
- `id`: string
- `title`: string (наприклад, "Ранкова пробіжка")
- `date`: string
- `durationMin`: number

**Ендпоінти:**
- `GET /workouts` - Отримати список усіх тренувань
- `POST /workouts` - Створити нове тренування