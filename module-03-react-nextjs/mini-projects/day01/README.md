# Mini-Project · The Addis Eats Checkout

> **Module 3 · Day 33** — IBT College Canada CodeOps · Full Stack Software Development

A complete, production-grade checkout form that handles all six states honestly. Four fields in one state object, rules in a pure function, errors that appear when they help rather than nag, accessible screen reader feedback (`role="alert"`, `aria-invalid`, `aria-describedby`), greyscale-friendly visual error cues, and a resilient submit flow that cannot fire twice or lose order details when the network fails.

---

## 📋 Architecture & Core Requirements

1. **Single State Object**: All four checkout fields (`name`, `phone`, `area`, `address`) are managed in one controlled `form` state object with a single `handleChange` handler.
2. **Pure Validation Function**: `validate(form)` in `validate.js` is a pure function returning an `errors` object, derived on every render (`const errors = validate(form)`).
3. **Helpful, Non-Nagging Errors**: Errors only appear after a field has been touched (`onBlur`), and update live on every keystroke as the customer corrects their input.
4. **Accessible Semantics & Screen Readers**:
   - Real `<label htmlFor={id}>` per field.
   - Dynamic `aria-invalid` and `aria-describedby` linking to error alerts (`${id}-error`) and helper guides (`${id}-helper`).
   - `role="alert"` and `aria-live="assertive"` on error announcements.
   - Visible visual glyphs (`⚠️`) and high-contrast double borders ensuring errors are clear on greyscale screens.
5. **Single-Submission Guarantee**:
   - Submitting state disables the button and displays the live ETB total in its label (`Placing Order (${total} ETB)...`).
   - Prevents duplicate clicks or rapid Enter key submissions.
6. **Resilient Failure Path**:
   - If network or gateway failure occurs, 100% of entered customer values are preserved in state.
   - An alert banner is announced with `role="alert"`.
   - Focus is automatically moved to the first invalid field.

---

## 🏛️ Validation Rules & Why Each Exists

| Field | Rule / Validation Logic | Why It Exists in Addis Ababa Context |
| :--- | :--- | :--- |
| **`name`** (Full Name) | `trim().length >= 2` | Food couriers need an identifiable person's name at delivery handoff or building reception. Single character inputs or blank spaces are rejected. |
| **`phone`** (Phone Number) | Matches `/^(\+251\|0)9\d{8}$/` | Couriers call customers upon reaching security checkpoints, compound gates, or condominium entrances in Addis Ababa. Must be a valid Ethiopian mobile number (e.g. `0911234567` or `+251911234567`). |
| **`area`** (Delivery Area) | Must be a recognized Addis Ababa sub-city (`Bole`, `Kazanchis`, `Summit`, `Piassa`, `Sarbet`, `CMC`, `Megenagna`, `Arat Kilo`, `Gerji`) | Delivery fees and dispatch route assignments rely strictly on the customer's sub-city zone. |
| **`address`** (Street & Landmark) | `trim().length >= 5` | Addis Ababa lacks comprehensive postal house numbering. Couriers require specific street names, nearby landmarks, or building/floor numbers (minimum 5 characters) to prevent lost orders. |

---

## 🔄 The Six Honest Form States

1. **Idle / Pristine State**:
   - Initial form load. Untouched fields stay completely quiet and clean without any nagging red borders or premature error messages.
2. **Validating / Touched State**:
   - As fields lose focus (`onBlur`), they become marked as touched. Once touched, derived validation calculates errors live on every keystroke, clearing immediately when fixed.
3. **Submitting State**:
   - When submitted, the button enters `is-loading`, becomes disabled, and displays the ETB total in its label (`Placing Order (${total} ETB)...`), preventing duplicate orders.
4. **Success State**:
   - Order confirmation screen showing generated order ID, timestamp, summary of ordered dishes, delivery details, and final ETB amount. Cart is automatically cleared.
5. **Failure / Network Error State**:
   - Simulated or real network failures display an accessible `role="alert"` error banner. **All entered form values are 100% preserved**, and focus is automatically moved to the first invalid field for quick recovery.
6. **Empty Cart State**:
   - When the cart is empty (0 items / 0 ETB), checkout is safely disabled with friendly guidance and navigation back to the menu.

---

## ✅ Check Yourself

| Question | Answer |
| :--- | :--- |
| **Does pressing Enter in a text field submit the form?** | **Yes.** The form is wrapped in a standard semantic `<form onSubmit={handleSubmit}>`, enabling native Enter-key submission from any input field. |
| **Can you complete the whole form using only the keyboard?** | **Yes.** Full keyboard accessibility with logical `Tab` indexing, explicit `<label>` bindings, `:focus-visible` rings, and keyboard submit hints. |
| **Does an untouched empty field stay quiet until you leave it?** | **Yes.** Errors are guarded by `show(field) = touched[field] && errors[field]`. Untouched fields never show error messages. |
| **Does a corrected field clear its message immediately?** | **Yes.** `validate(form)` is derived on every render. As soon as the user types a valid input, the error clears immediately without requiring another blur event. |
| **Does pressing Order twice quickly send only one order?** | **Yes.** The `status === 'submitting'` check immediately guards `handleSubmit`, and the submit button is simultaneously `disabled`. |
| **After a simulated failure, is every value still in the form?** | **Yes.** The failure path never wipes the `form` state; only explicit user reset or successful order completion clears data. |
| **Turn the screen greyscale — can you still tell which field is wrong?** | **Yes.** Invalid fields use warning glyphs (`⚠️`), distinct textual prefixes (`⚠️ Error:`), high-contrast double borders, and `aria-invalid` outlines that do not rely solely on color. |

---

## 📁 Key Files Submitted

- **[`src/Checkout.jsx`](file:///c:/Users/hp/Desktop/Tehesh-Tslalom-Grmay-SQ7/module-03-react-nextjs/mini-projects/day01/src/Checkout.jsx)** / **[`src/components/Checkout.jsx`](file:///c:/Users/hp/Desktop/Tehesh-Tslalom-Grmay-SQ7/module-03-react-nextjs/mini-projects/day01/src/components/Checkout.jsx)**: Full checkout orchestrator managing all 6 states, single state object, and failure focus management.
- **[`src/validate.js`](file:///c:/Users/hp/Desktop/Tehesh-Tslalom-Grmay-SQ7/module-03-react-nextjs/mini-projects/day01/src/validate.js)**: Pure, side-effect-free validation engine for all four fields.
- **[`src/Field.jsx`](file:///c:/Users/hp/Desktop/Tehesh-Tslalom-Grmay-SQ7/module-03-react-nextjs/mini-projects/day01/src/Field.jsx)** / **[`src/components/Field.jsx`](file:///c:/Users/hp/Desktop/Tehesh-Tslalom-Grmay-SQ7/module-03-react-nextjs/mini-projects/day01/src/components/Field.jsx)**: Accessible input/select/textarea wrapper with `role="alert"`, `aria-invalid`, `aria-describedby`, and greyscale cues.

---

## 💻 Running the Project

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
