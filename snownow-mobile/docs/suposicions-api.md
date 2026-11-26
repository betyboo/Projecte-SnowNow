# Suposicions de l'app mòbil sobre l'API

L'app mòbil ja fa servir aquests camps i rutes, però **encara no existeixen al backend**.
Si el backend els fa exactament així, l'app funcionarà sense tocar res. Si decidiu un altre
nom o format, aviseu i s'adapta l'app.

Mentre no hi siguin, l'app funciona igual: els camps que falten no es mostren i els filtres
que el backend no coneix s'ignoren.

Codi del mòbil afectat: `snownow-mobile/src/api/resorts.ts`.

---

## Mòdul 2 · Estacions (`resorts`)

### 1. Pistes per color de dificultat: camp `slopes`

Decidit amb l'equip: la dificultat va pels colors de pista (verda, blava, vermella, negra).
L'app suposa que cada estació porta **quantes pistes té de cada color**:

```json
"slopes": { "green": 12, "blue": 20, "red": 16, "black": 5 }
```

- Claus en anglès i sempre les quatre (amb `0` si no n'hi ha cap).
- L'app mostra un punt de color amb el número al costat.

### 2. Tipus de neu: camp `snowType`

```json
"snowType": "powder"
```

Valors possibles: `"powder"` (pols), `"packed"` (dura), `"spring"` (primavera), `"artificial"`.

### 3. Visibilitat: camp `visibility`

```json
"visibility": "good"
```

Valors possibles: `"good"`, `"moderate"`, `"poor"`.

### 4. Filtre per dificultat a la cerca: paràmetre `difficulty`

```
GET /api/resorts/search?difficulty=red
```

- Valors: `green`, `blue`, `red`, `black` (un sol valor).
- Ha de tornar les estacions que tenen **almenys una pista** d'aquell color
  (per exemple `{ "slopes.red": { "$gt": 0 } }`).
- La resta de paràmetres i la resposta (`total`, `pages`, `data`...) igual que ara.

### 5. Detall d'una estació: `GET /api/resorts/:id`

```
GET /api/resorts/6aff0ca582d5ecf3fdfe5adb
```

Resposta:

```json
{ "success": true, "data": { "_id": "...", "name": "La Molina", "...": "mateixos camps que a la cerca" } }
```

Si no existeix: `404` amb `{ "success": false, "error": "Estació no trobada" }`.

### 6. Exemple complet d'una estació tal com l'espera l'app

```json
{
  "_id": "6aff0ca582d5ecf3fdfe5adb",
  "name": "La Molina",
  "country": "Espanya",
  "region": "Cerdanya",
  "description": "Estació de muntanya gestionada per FGC Turisme.",
  "skiAreaKm": 71,
  "altitudeMeters": { "base": 1667, "summit": 2537 },
  "services": ["Escola d'esquí", "Lloguer", "Restaurant"],
  "slopes": { "green": 12, "blue": 20, "red": 16, "black": 5 },
  "snowType": "packed",
  "visibility": "good"
}
```

Els valors de `slopes`, `snowType`, `visibility` i `services` d'aquest exemple són inventats.

### Pendent de confirmar

- **`skiAreaKm`**: l'app el mostra com a quilòmetres de pistes ("71 km"). Si el camp canvia
  de nom o d'unitat, aviseu.
- **Comparador**: l'equip el farà al backend. Quan sapigueu la ruta, passeu-la i l'app la farà servir.

---

## Altres mòduls (pendent)

Aquí s'aniran afegint les suposicions de les pantalles de Lloguer i de Pistes
quan es facin.
