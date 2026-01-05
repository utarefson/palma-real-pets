# Palma Real Pets — README

Short instructions for adding new pet registers and running the project locally.

**Overview:**

- **Project root:** contains `index.html`, `script.js`, `styles.css`, and the `images/` folder.
- The app reads pet and owner data from in-memory objects defined in `script.js`: `PET_TABLE` and `OWNER_TABLE`.

**Adding a new pet register**

- **Create images folder:** when registering a new pet with id `<pet-id>` you must create a directory `images/<pet-id>/` and add the pet photos there. The app expects three files by default:
  - `images/<pet-id>/pet1.jpg`
  - `images/<pet-id>/pet2.jpg`
  - `images/<pet-id>/pet3.jpg`
- The carousel falls back to `images/pet1.svg`, `images/pet2.svg`, `images/pet3.svg` if the per-pet images are missing, but it's best to provide the three JPGs for the pet.

**Updating application data**

- Edit `script.js` and add an entry to `PET_TABLE` for the new pet id. Example:

```javascript
const PET_TABLE = {
  "1A1": {
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    size: "Large",
    birthDate: "2018-06-15", // yyyy-mm-dd format
  },
  "<pet-id>": {
    name: "Fluffy",
    type: "Cat",
    breed: "Domestic",
    size: "Small",
    birthDate: "2022-03-10",
  },
};
```

- Add the owner details to `OWNER_TABLE` using the owner id extracted from the pet id (script uses `extractOwnerId(petId)`). Example:

```javascript
const OWNER_TABLE = {
  "1A": {
    firstName: "Ana",
    lastName: "Perez",
    phone: "67548522",
    email: "ana.perez@email.com",
    apartment: "1A",
  },
  "<owner-id>": {
    firstName: "Luis",
    lastName: "Gomez",
    phone: "600123456",
    email: "luis.gomez@email.com",
    apartment: "2B",
  },
};
```

Notes:

- Dates must use `yyyy-mm-dd` format so the age calculation works correctly.
- The code derives the owner id from the pet id with `extractOwnerId(petId)`; ensure your owner entry key matches that value.
- The project uses simple XOR + Base64 encode/decode for the `id` parameter; if you generate QR codes or links, make sure to encode the encrypted id properly and pass it as `?id=<encoded>` in the URL.

**Run locally**

- You can serve the project with a simple Python HTTP server from the repository root:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

**File references**

- Main script: `script.js` (contains `PET_TABLE`, `OWNER_TABLE`, carousel, image loading, encryption utilities)
- Images root: `images/` (add per-pet folders here)

If you want, I can add a small helper script to validate an images folder or provide a template for new entries.
