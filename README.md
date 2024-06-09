### Jennifer Jakobsson


# Backend-baserad webbutveckling
### Moment 4 - Uppgift 1, DT207G

<br>
<br>

# Autentisering och säkerhet

>### Laboration i Moment 4 - Uppgift 1:
>Denna uppgift är den första delen av Moment 4 - Autentisering och säkerhet. Detta är en REST-webbtjänst byggt med Express och Moongose schema som hanterar användare och inloggning. Tjänsten innehar akronymen CRUD för att hantera data i en databas samt CORS för att låta resurser begäras från annan ursprung. 
>
>APIet använder en MongoDB-databas och kan användas genom att köra kommando npm install för installation av nödvändiga npm-paket och npm run server för att starta webbtjänsten. En liveversion av webbtjänsten finns tillgänglig här: [Länk till API](https://moment4-1.onrender.com/)
>
>Denna webbtjänst är skapad med funktionalitet för autentisering med registrering av användarkonton samt inloggning och använder även JSON Web Token för sessionshantering samt förhindra obehörig åtkomst. Den är också skapad med syftet att skydda känslig data.

<br>

### Användning av databas:

<br>

| Metod | Ändpunkt | Beskrivning |
|-----------------|-----------------|-----------------|
| GET | / | Hämtar webbtjänsten |
| GET | /api/protected | Skapar route som kräver autentisering |
| POST | /api/login | Route för inloggning |
| POST | /api/register | Route för registrering |

<br>

#### Ett user-objekt returneras/skickas som JSON med följande struktur vid registrering:

<br>

```json
{
    "_id": ObjectId("66298100c0cfa4410c5346d1"),
    "username": "JEJA",
    "password": "$2b$10$cvUtx4KAbojrZIPUMFM56Oc52RCCdptxWn9z6haggxdKqhh7BDoaV",
    "firstname": "Jennifer",
    "lastname": "Jakobsson",
    "email": "jeja2306@student.miun.se",
    "created": 2024-06-07T20:06:51.798+00:00,
    "__v": 0
}
```

<br>

### Struktur av userSchema:

- **username**
  - Type: String
  - Required: Yes
  - Unique: Yes
  - Trimmed: Yes
  - Minimum Length: 3 characters
  - Maximum Length: 20 characters
  - Validation: Must be unique and between 3 and 20 characters long

- **password**
  - Type: String
  - Required: Yes
  - Validation: Must contain at least one number

- **firstname**
  - Type: String
  - Required: Yes
  - Trimmed: Yes
  - Maximum Length: 25 characters

- **lastname**
  - Type: String
  - Required: Yes
  - Trimmed: Yes
  - Maximum Length: 30 characters

- **email**
  - Type: String
  - Required: Yes
  - Trimmed: Yes
  - Unique: Yes
  - Validation: Must be a valid email address format
  - Example: `example@example.com`

- **created**
  - Type: Date
  - Default: Current Date and Time

<br>