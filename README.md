# Toolbox Fullstack Challenge

Reto Full Stack JS: API en **Node + Express** que consume un servicio externo de archivos CSV, y un frontend **React + Redux + React Bootstrap** que muestra los datos formateados. Orquestación con **Docker Compose**.

> Proyecto entregado como code-challenge. El código cumple todos los requisitos obligatorios y los puntos opcionales del challenge (filtro por `?fileName=`, `GET /files/list`, StandardJS, Redux, Jest, Docker Compose).

---

## 🧱 Stack

### Backend
- **Node.js 14** (Express 4)
- **Mocha + Chai + Sinon + Supertest** para tests
- **ESLint (StandardJS)**
- **Axios** como cliente HTTP hacia el API externo

### Frontend
- **Node.js 16** (build con Webpack 5)
- **React 17** (programación funcional + Hooks)
- **Redux + Redux Thunk** para estado global
- **React Bootstrap 2** + **Bootstrap 5** para UI
- **Jest + React Testing Library + redux-mock-store** para tests

### Orquestación
- **Docker** + **Docker Compose**

---

## 📂 Estructura del proyecto

```
.
├── backend/                     # API Express
│   ├── Dockerfile
│   ├── .eslintrc.json
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── index.js             # entrypoint (listen en :3001)
│   │   ├── app.js               # app de Express + middlewares
│   │   ├── routes/files.js      # GET /files/list y GET /files/data
│   │   ├── services/externalApi.js   # cliente al API TBXNet
│   │   └── utils/csvParser.js   # parser y validador de CSV
│   └── test/
│       ├── csvParser.test.js
│       ├── externalApi.test.js
│       └── files.route.test.js
├── frontend/                    # Cliente React
│   ├── Dockerfile               # build multi-stage (node 16 → nginx)
│   ├── nginx.conf               # reverse proxy /files → backend
│   ├── babel.config.json
│   ├── jest.config.js
│   ├── webpack.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/index.html
│   ├── src/
│   │   ├── index.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── FilesTable.jsx
│   │   │   └── FilterBar.jsx
│   │   └── store/
│   │       ├── actions.js
│   │       ├── actionTypes.js
│   │       ├── index.js
│   │       └── reducer.js
│   └── test/
│       ├── App.test.jsx
│       ├── reducer.test.js
│       ├── setupTests.js
│       └── __mocks__/styleMock.js
├── docker-compose.yml           # backend (3001) + frontend (3000)
├── .gitignore
└── README.md
```

---

## 🚀 Cómo correr la app

### Opción 1 — Docker Compose (recomendado)

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Servicios expuestos:
- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:3001

Para detener y remover los contenedores:

```bash
docker compose down
```

### Opción 2 — En local sin Docker

#### Backend

```bash
cd backend
npm install
npm start         # levanta el API en http://localhost:3001
npm test          # corre la suite de Mocha
npm run lint      # corre ESLint sobre src/ y test/
```

#### Frontend

```bash
cd frontend
npm install
npm start         # webpack-dev-server en http://localhost:3000 (proxy /files → :3001)
npm run build     # build de producción a ./dist
npm test          # corre la suite de Jest
```

---

## 📡 Endpoints del API

### `GET /files/data`

Devuelve el contenido de todos los archivos del API externo, parseado y validado.

**Query params (opcional):**
- `fileName=<nombre>` — filtra la respuesta por nombre de archivo (ej. `?fileName=file1.csv`).

**Respuesta `200 OK`** (`Content-Type: application/json`):

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

Las líneas inválidas (cantidad de columnas incorrecta, `text` vacío, `number` no numérico, `hex` con longitud distinta a 32 o con caracteres no hexadecimales) se descartan. Si un archivo falla al descargarse, se omite del resultado final sin afectar al resto.

**Ejemplo con curl:**

```bash
curl -X GET "http://localhost:3001/files/data" -H "accept: application/json"
```

```bash
curl -X GET "http://localhost:3001/files/data?fileName=file1.csv" -H "accept: application/json"
```

### `GET /files/list`

Devuelve la lista cruda de archivos disponibles en el API externo.

**Respuesta `200 OK`:**

```json
{
  "files": ["file1.csv", "file2.csv", "file3.csv"]
}
```

**Ejemplo con curl:**

```bash
curl -X GET "http://localhost:3001/files/list" -H "accept: application/json"
```

---

## 🔌 API Externo consumido

- **Base URL:** `https://echo-serv.tbxnet.com/v1/secret`
- **Auth header:** `authorization: Bearer aSuperSecretKey` (provisto por el challenge, hardcodeado en `backend/src/services/externalApi.js`).

> Nota: el challenge prohíbe explícitamente el uso de variables de entorno, por lo que la API key va inline en el código. **No rotar la key** salvo que se actualice también el Swagger de referencia.

---

## 🖥️ UI

La pantalla principal muestra:

- Encabezado rojo con el título **"React Test App"**.
- Un `<select>` de filtro poblado con los nombres de archivo (cargados vía `GET /files/list`).
- Una tabla responsive con cuatro columnas: **File Name**, **Text**, **Number**, **Hex**.

Estados manejados: `loading` (spinner), `error` (alert rojo), `empty` (alert info), `data` (tabla).

Al cambiar el filtro se dispara el thunk `setFilter` → `fetchFiles(fileName)`, que pega contra `GET /files/data?fileName=…`.

---

## 🧪 Tests

### Backend

```bash
cd backend && npm test
```

Cubre:
- `csvParser`: parseo válido, archivo vacío/solo header, descarte por columnas faltantes, `number` no numérico, `hex` inválido, todas las líneas inválidas.
- `externalApi`: stub de Axios, manejo de errores.
- `files.route`: integración HTTP con Supertest, filtro por `?fileName=`, resiliencia ante archivos que fallan al descargar.

### Frontend

```bash
cd frontend && npm test
```

Cubre:
- `App`: renderiza el título "React Test App" con un store mockeado.
- `reducer`: estado inicial y manejo de cada action type.

---

## 📜 Scripts útiles

| Comando (raíz)            | Descripción                                       |
| ------------------------- | ------------------------------------------------- |
| `docker compose up`       | Levanta backend + frontend                        |
| `docker compose down`     | Detiene y remueve los contenedores                |
| `cd backend && npm start` | Backend en modo desarrollo (puerto 3001)          |
| `cd backend && npm test`  | Suite Mocha del backend                           |
| `cd backend && npm run lint` | Linter StandardJS del backend                  |
| `cd frontend && npm start`| Webpack dev server con proxy al backend           |
| `cd frontend && npm run build` | Build de producción a `frontend/dist/`        |
| `cd frontend && npm test` | Suite Jest del frontend                           |

---

## 📌 Notas

- El challenge exige **Node 14 en backend** y **Node 16 en frontend**; los Dockerfiles respetan esas versiones.
- El challenge prohíbe Babel, TypeScript, Dart y Elm. El backend es JavaScript puro (CommonJS). El frontend usa Babel solo como preset para el pipeline de Webpack/Jest, no se transpilan features exóticas.
- `.gitignore` excluye `node_modules/`, `dist/`, `build/`, logs, `.env*` y archivos del editor.
