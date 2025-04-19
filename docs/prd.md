# PRD.md – Fantom Generator

**Document Status:** Draft / **Ready for Review** / Approved
**Version:** 1.0 (MVP)
**Last Updated:** [Insert Date, e.g., 2023-10-27]
**Author:** [Your Name/Team Name]

---

## PRD-SEC-001: Overview & Objectives

**Product Name:** Fantom Generator
**Purpose:** A web application for law enforcement to generate textual composite sketches (prompts) based on witness descriptions using adjustable visual parameters, text input, and potential AI assistance in future versions. The MVP focuses on robust prompt generation and data management via JSON.
**Primary Function:** Real-time, adjustable parameter-based prompt generation with JSON export/import and a placeholder for AI image analysis.
**Target Audience:** Police investigators and witness handling teams.
**Version:** 1.0 (Minimum Viable Product - MVP)
**Platform:** Web Application
**Frontend Stack:** Sveltekit latest (@https://svelte.dev/docs/kit/introduction) Svelte 5 with Runes (@https://svelte.dev/docs/svelte/overview) and Tailwind CSS
**Hosting:** Static (Netlify / GitHub Pages - Client-side only operation)

### Objectives for MVP (Version 1.0)

1.  **Enable Efficient Prompt Generation:** Allow investigators to quickly capture key physical descriptions in a structured, textual format.
2.  **Provide Standardized Data Output:** Generate structured JSON data representing the parameter set, ensuring consistency across cases.
3.  **Facilitate Data Portability:** Allow users to save/load parameter sets locally via JSON files.
4.  **Validate Core Concept:** Test the usability and value of a parameter-driven text prompt generator for composite sketches with the target audience.
5.  **Lay Foundation for Future AI:** Implement a clear structure and placeholder for future AI image analysis integration.

---

## PRD-SEC-002: Target Audience & Needs

-   **Primary Users:** Police investigators, detectives, and support staff directly involved in interviewing witnesses to crimes or processing witness statements.
-   **Needs:**
    *   **Speed:** Generate a structured description quickly during or after an interview.
    *   **Simplicity:** Easy-to-understand interface that doesn't require extensive training.
    *   **Consistency:** Standardized parameters help ensure consistency in descriptions across different officers and cases.
    *   **Data Control:** Ability to save, load, and manage description data locally and securely.
    *   **Flexibility:** Adapt parameters to the specific details of a witness description.
    *   **Digital Output:** Move away from purely manual or paper-based methods for this initial description phase.

---

## PRD-SEC-003: Core Features

### PRD-FEAT-001: Prompt Generator & Preview
**Description:** A dedicated area displays the composite sketch prompt dynamically generated based on all active parameters and the free-text input.
**Acceptance Criteria:**
-   [ ] A clear, read-only text area displays the generated prompt.
-   [ ] The prompt text updates automatically within 100ms of any slider adjustment or free-text input change.
-   [ ] The prompt incorporates the free-text input, likely at the beginning or end.
-   [ ] The prompt incorporates all active parameters and their current shade values in a human-readable sentence or paragraph structure (e.g., "Subject has [Hair Length] [Hair Color] hair...").
-   [ ] Parameter order in the prompt reflects the order of sliders displayed in the UI.
-   [ ] A "Copy Prompt" button copies the current prompt text to the user's clipboard.

---

### PRD-FEAT-002: Parameter Sliders Display
**Description:** Visual parameters (e.g., "Hair Length", "Eye Color") are controlled via sliders. Each slider represents a specific attribute and allows selecting from a predefined list of "shades".
**Acceptance Criteria:**
-   [ ] Two default parameters (e.g., Hair Length, Eye Color - *See PRD-SEC-013 for initial defaults*) load on application startup.
-   [ ] Each slider displays its parameter name clearly (UI language applies, but value labels remain English unless translated in shades array itself).
-   [ ] Each slider allows selection from a specific list of predefined values ("shades").
-   [ ] The slider mechanism (visual or interactive) clearly indicates the currently selected shade value.
-   [ ] The UI displays the current English shade value text label next to the slider handle or in a separate label during adjustment.
-   [ ] Slider movement is smooth and responsive.

---

### PRD-FEAT-003: Dynamic Parameter Management (Add, Edit, Delete)
**Description:** Users can add, edit, or remove custom parameters via a form UI, defining their name, minimum, maximum, and a list of specific shades.
**Acceptance Criteria:**
-   [ ] A clear UI element (e.g., a button) allows the user to initiate adding a new parameter.
-   [ ] A form or modal appears allowing the user to input:
    -   Parameter Name (Text input)
    -   List of Shades (Text area, comma-separated or similar format)
-   [ ] The user can save the new parameter definition. Upon successful save, a new slider for this parameter appears in the main "Parameters" view.
-   [ ] Validation prevents saving if the Parameter Name or Shades list is empty.
-   [ ] User can click on an existing custom parameter (or all parameters?) to enter an "edit" mode.
-   [ ] The edit form pre-populates with the parameter's current details.
-   [ ] User can save changes to an existing parameter. The corresponding slider and prompt update accordingly.
-   [ ] User can delete a custom parameter. The corresponding slider is removed, and the prompt updates.
-   [ ] Default parameters (defined initially) cannot be deleted, but may be editable (TBD - *MVP Scope: Default parameters are not editable via this UI*).

---

### PRD-FEAT-004: Multilingual UI Support
**Description:** All static UI labels and parameter names displayed to the user are loaded dynamically from a `lang.json` file. Parameter *values* (the shade labels within the `shades` array) remain in English unless explicitly translated within the data structure itself (which is outside the scope of *this* UI translation feature).
**Acceptance Criteria:**
-   [ ] A mechanism (e.g., dropdown, button) allows the user to select a language.
-   [ ] Upon selecting a language, the application loads the corresponding locale data from a `lang.json` file (or similar structure).
-   [ ] All predefined static UI text labels (button text, section titles, field labels, parameter *names*) update to the selected language.
-   [ ] Parameter *shade values* (e.g., "Short", "Medium", "Long" in the `shades` array) displayed next to sliders or in the prompt preview remain in the original English as defined in the parameter data, regardless of UI language. (Future scope could include translating values).
-   [ ] Default language is English.
-   [ ] Handles potential missing translation keys gracefully (e.g., falls back to English or displays the key name).

---

### PRD-FEAT-005: Case Information Fields
**Description:** Input fields for capturing essential case-related information: title, case/journal number, and date.
**Acceptance Criteria:**
-   [ ] Input fields or controls for "Title", "Case/Journal Number", and "Date" appear prominently at the top of the main interface, separate from parameters.
-   [ ] The "Date" field uses a native or standard date picker UI element.
-   [ ] The values entered into these fields are included in the exported JSON data structure.
-   [ ] (Optional but Recommended) The Title and Case/Journal Number are included in the generated text prompt (e.g., as a header or introductory sentence).

---

### PRD-FEAT-006: Upload & AI Tab (MVP Stub)
**Description:** A separate tab provides a placeholder interface for a future feature allowing users to upload an image and potentially receive AI-generated parameter values. In MVP, this only contains the upload mechanism and a mock AI response.
**Acceptance Criteria:**
-   [ ] Tab navigation is present, clearly separating the "Parameters" view and the "Upload & AI" view.
-   [ ] The "Upload & AI" tab contains an area or button for users to upload an image file.
-   [ ] The upload mechanism accepts common image formats (JPG, PNG).
-   [ ] After uploading an image (or clicking a mock "Analyze" button), a placeholder/stub function runs.
-   [ ] The placeholder function returns a predefined, static mock set of key-value parameters (matching the structure in PRD-SEC-005 Example 1).
-   [ ] The parameter values from the mock AI response are populated into the main parameter sliders on the "Parameters" tab, updating both slider positions and the prompt preview.

---

### PRD-FEAT-007: JSON Import/Export
**Description:** Functionality to save the current set of parameters (including custom parameters and their shade definitions, and case info) as a `.json` file and to load a previously saved `.json` file into the application.
**Acceptance Criteria:**
-   [ ] A "Save JSON" button is available in the UI.
-   [ ] Clicking "Save JSON" downloads a file named appropriately (e.g., `fantom-sketch-[case-number]-[date].json` or similar) containing the full state of the application's parameters and case info (matching the structure based on PRD-SEC-005 Example 3, plus case info and potentially the free text).
-   [ ] A "Load JSON" button is available, which triggers the user's file browser.
-   [ ] Selecting a `.json` file replaces the current application state (parameters, case info, free text) with the data from the file.
-   [ ] The UI updates immediately to reflect the loaded data.
-   [ ] Basic error handling is implemented for "Load JSON":
    -   [ ] Alerts the user if the selected file is not a valid JSON file.
    -   [ ] Alerts the user if the JSON structure is malformed or missing required top-level keys (e.g., parameters array, case info object), preventing the application from crashing. (Specific schema validation is V2, but basic structural checks for MVP).

---

## PRD-SEC-004: User Flow

1.  User opens the Fantom Generator web page.
2.  Application loads with default parameters and empty case info/free text.
3.  User navigates to Case Info section, inputs Title, Case Number, and selects Date.
4.  User uses Free Text field to add general notes about the subject.
5.  User adjusts default parameter sliders (e.g., Hair Length, Eye Color) based on witness description.
6.  User may add custom parameters if needed (e.g., "Scar Location", "Tattoo Description") via the add parameter form (PRD-FEAT-003).
7.  As sliders are adjusted and text is entered, the Prompt Preview (PRD-FEAT-001) updates in real-time.
8.  (Optional path) User navigates to "Upload & AI" tab (PRD-FEAT-006), uploads an image, triggers the mock analysis, and sees the parameter sliders update on the "Parameters" tab.
9.  Once satisfied, the user can "Copy Prompt" (PRD-FEAT-001) or "Save as JSON" (PRD-FEAT-007) to preserve the description.
10. (Optional path) User can "Load JSON" (PRD-FEAT-007) to resume working on a previous description.

---

## PRD-SEC-005: Technical Stack Recommendations

| Layer       | Technology              | Notes                                           |
| :---------- | :---------------------- | :---------------------------------------------- |
| Frontend    | Vanilla JS, Tailwind CSS | Pure client-side. Focus on speed and simplicity. |
| UI State    | Local DOM + localStorage | For temporary session persistence (optional), JSON handling for explicit save/load. No complex state management library needed for MVP. |
| Data Format | JSON                   | Standard, portable, human-readable.             |
| Hosting     | Netlify / GitHub Pages | Static hosting requires no backend for MVP. Simple deployment. |
| AI (v2)     | Python API / Stable Diffusion (external) | Placeholder in MVP. Will require a backend service in V2. |
| Browser Compatibility | Modern Browsers (Chrome, Firefox, Edge) | Target recent versions. Explicit support for older browsers is out of scope for MVP. |

---

## PRD-SEC-006: Conceptual Data Model

### Data Structures:

1.  **Case Information Object:** Stores metadata about the description.
    ```json
    {
      "title": "Burglar Suspect #1",
      "caseNumber": "PD-2023-12345",
      "date": "2023-10-27"
    }
    ```

2.  **Parameter Configuration Array:** The core data structure defining the sliders. Each object represents one parameter.
    ```json
    [
      {
        "id": "hair-length", // Unique identifier, useful for AI mapping/internal handling
        "name": "Hair Length", // Display name (UI translation via lang.json reference)
        "shades": ["Very short", "Short", "Medium", "Long", "Very long"], // Array of possible string values (English)
        "value": "Short" // Current selected value from 'shades' array
      },
      {
        "id": "eye-color",
        "name": "Eye Color",
        "shades": ["Blue", "Green", "Brown", "Hazel", "Gray"],
        "value": "Hazel"
      },
      // ... other default or custom parameters
    ]
    ```
    *Note: The "min" and "max" properties from the original example seem redundant if 'shades' is the definitive list. Removing them for clarity based on Example 3.*

3.  **Free Text:** Simple string input.
    ```json
    {
      "freeText": "Subject seen fleeing the scene on foot heading West. Appears to be nervous."
    }
    ```

4.  **Full Exported JSON Structure:** Combines all the above.
    ```json
    {
      "version": "fantom-gen-1.0", // Helps with future version compatibility
      "caseInfo": { /* Case Information Object */ },
      "freeText": "...",
      "parameters": [ /* Parameter Configuration Array */ ]
    }
    ```

5.  **Mock AI Output Structure (for PRD-FEAT-006):** A simple key-value object. The keys should ideally map directly to the `id` or `name` of parameters in the `Parameter Configuration Array` to facilitate populating sliders.
    ```json
    {
      "hair-color": "Gray", // Key should ideally match parameter ID
      "hair-length": "Short",
      "eye-color": "Hazel",
      // ... etc.
    }
    ```

6.  **Human-Readable Prompt (Generated):** Text derived from the above data (PRD-FEAT-001).
    > _“Case PD-2023-12345: Subject seen fleeing the scene on foot heading West. Appears to be nervous. Description: Subject has Short Hair Length, Hazel Eye Color...”_ (Order of parameters in prompt matches order in `parameters` array).

---

## PRD-SEC-007: UI Design Principles

-   **Layout:** Tab-based interface: “Parameters” (main workspace) and “Upload & AI” (future feature stub). Case Info and Free Text areas are persistent across tabs.
-   **Responsiveness:** Designed primarily for desktop/tablet usage, as this is the likely environment in a law enforcement office or vehicle. Basic responsiveness to avoid layout breakage on smaller screens but not necessarily optimized for mobile data entry.
-   **Visual Style:** Neutral color palette (gray, white, subtle blues) for a professional, non-distracting look. Clean typography (Inter or Roboto). Clear visual hierarchy.
-   **Accessibility:** Basic keyboard navigation for input fields and buttons. Sufficient color contrast for readability. Slider interaction should be clear. (Further accessibility enhancements are V2+).
-   **Feedback:** Clear visual feedback on slider changes, successful JSON save/load, and validation errors.

---

## PRD-SEC-008: Security Considerations (MVP)

-   **Data Handling:** All user input and generated data are processed and stored *only* within the user's browser session or explicit local file downloads. No data is transmitted to a server.
-   **Data Sensitivity:** While the generated data describes a potential subject, the application itself does not handle any Personally Identifiable Information (PII) about witnesses, victims, or suspects (unless the user *chooses* to put PII in the free text or parameters, which is outside the application's control and against recommended practice for this tool).
-   **Local Files:** Responsibility for securing downloaded JSON files lies solely with the user/agency.
-   **AI Placeholder:** The MVP's AI functionality is a static stub; no actual image processing or external API calls occur, mitigating associated security risks for this version.
-   **Hosting:** Static hosting platforms (Netlify/GitHub Pages) are inherently less vulnerable to certain types of attacks compared to dynamic server-side applications, as there is no server logic or database to target.

---

## PRD-SEC-009: Development Phases

### Phase 1: Discovery & Design (Estimated 2 weeks)
-   Finalize requirements based on stakeholder feedback.
-   Create detailed UI wireframes and potentially mockups.
-   Define the exact structure of the `lang.json` and exported JSON.
-   Select initial default parameters and their shade lists.
-   Plan core component structure (Vanilla JS).

### Phase 2: Development (Estimated 6 weeks)
-   **Week 1-2:** Set up project structure. Build core UI layout (tabs, sections). Implement Case Info and Free Text fields (PRD-FEAT-005). Implement basic parameter display with default parameters (PRD-FEAT-002 - display only).
-   **Week 3-4:** Implement slider interactivity and real-time prompt generation (PRD-FEAT-002 & PRD-FEAT-001). Implement the Add/Edit/Delete custom parameter form and logic (PRD-FEAT-003). Ensure prompt updates correctly with custom parameters.
-   **Week 5:** Implement JSON Import/Export (PRD-FEAT-007). Connect JSON loading to update parameter sliders and case info. Implement basic JSON validation.
-   **Week 6:** Implement Multilingual UI support (PRD-FEAT-004). Build the "Upload & AI" tab UI and the mock AI stub (PRD-FEAT-006). Final polish on UI/UX based on design principles.

### Phase 3: Internal Testing & User Acceptance Testing (UAT) (Estimated 2 weeks)
-   Conduct internal testing to identify bugs and usability issues.
-   Prepare documentation (basic user guide).
-   Deploy a build for testing with representatives from the target audience (Police teams).
-   Gather feedback and prioritize fixes/adjustments based on UAT results.

### Phase 4: Release & Deployment (Estimated 1 week)
-   Address critical feedback from UAT.
-   Perform final code review and optimization.
-   Deploy to the chosen static hosting platform.
-   Communicate availability to target users.

---

## PRD-SEC-010: Challenges & Solutions

| Risk                                       | Mitigation Strategy                                                                 |
| :----------------------------------------- | :---------------------------------------------------------------------------------- |
| **Parameter Definition Complexity:** Users struggle with defining parameters and shades. | Provide clear examples and guidance in the UI. Offer robust default parameters with well-defined shades. (V2: Template library). |
| **UI Performance:** Too many parameters slow down the application (DOM updates, prompt generation). | Optimize UI rendering (e.g., debouncing input, efficient DOM manipulation). Test performance with a higher number of parameters (e.g., 20-30). Limit the number of *default* parameters in MVP. |
| **Parameter Naming/Consistency:** Users create parameters with similar names or inconsistent shade lists. | Provide guidance on naming conventions. (V2: Shared templates, better validation). |
| **AI Mapping Limitations (V2 concern, but affects MVP design):** AI output values don't match defined shades in the sliders. | Design parameter data with stable IDs. Plan for a mapping layer in V2 that handles synonyms or finds the closest match within defined shades. MVP stub confirms this mapping is needed. |
| **User Training:** Law enforcement users may have limited technical proficiency or time for training. | Focus heavily on intuitive UI design (Simplicity, Speed - PRD-SEC-002). Provide a concise user guide (Phase 3). |
| **No Persistence:** Data is lost if the browser is closed without saving JSON. | Rely on explicit Save/Load JSON. Educate users that data is local and temporary unless saved. Use localStorage for auto-saving *within* a session as a potential enhancement, but explicit save is the primary method. |

---

## PRD-SEC-011: Future Expansions (Post-MVP)

-   **Full AI Integration:** Implement actual image analysis using an external AI API (e.g., Python backend with facial recognition/description models). Map AI output accurately to existing parameters.
-   **AI Image Generation:** Integrate with a generative AI model (like Stable Diffusion) to generate visual sketches based on the text prompt and parameter data.
-   **Cloud Persistence/Sharing:** Option for users (with appropriate agency accounts) to save and share prompts securely in a cloud database.
-   **Template Library:** Predefined, shareable templates for common parameter sets (e.g., standard facial features, common clothing types).
-   **Multilingual Prompt Generation:** Translate the *output prompt text* itself, not just the UI labels.
-   **Advanced Parameter Types:** Beyond sliders (e.g., checkboxes for multiple selections, drawing tools for scars/tattoos - high complexity).
-   **User Authentication/Roles:** For V2+ if cloud features or agency-specific configurations are introduced.

---

## PRD-SEC-012: Key Performance Indicators (KPIs) / Success Metrics (MVP)

-   **Adoption:** Number of agencies or investigators using the tool (qualitative feedback during UAT).
-   **Usage:** Frequency of JSON saves/loads per user (if usage tracking is implemented, unlikely for static MVP, rely on UAT feedback).
-   **Time Saving:** Anecdotal evidence or feedback from UAT participants on whether the tool speeds up the description process compared to previous methods.
-   **Data Consistency:** Feedback from analysts or supervisors on the quality and consistency of generated prompts (UAT feedback).
-   **Bug Rate:** Number of critical bugs reported during Phase 3 testing.

---

## PRD-SEC-013: Default Parameters (MVP Initial Set)

*Note: The exact shade lists will be defined in Phase 1.*
-   Hair Length (e.g., Very Short, Short, Medium, Long, Very Long)
-   Hair Color (e.g., Black, Brown, Blonde, Red, Gray, White)
-   Eye Color (e.g., Blue, Green, Brown, Hazel, Gray, Black)
-   Skin Tone (e.g., Pale, Light, Medium, Olive, Dark, Very Dark)
-   Build (e.g., Thin, Medium, Muscular, Heavy, Obese)
-   Height (e.g., Short, Medium, Tall - *using relative terms for simplicity in MVP*)

*(Initial thought was just 2, expanding to a core set makes the MVP more useful)*

---

## PRD-SEC-014: Definition of Done

A feature or the overall MVP is considered "Done" when:

-   The code is written and reviewed.
-   All acceptance criteria for the feature/version are met.
-   The feature has been tested internally and passes relevant test cases.
-   The feature is included in a build provided for UAT.
-   Any critical or high-priority bugs identified during testing are fixed.
-   Relevant documentation (e.g., user guide section) is updated.

---

## PRD-SEC-015: Language File Example (`lang.json`)

```json
{
  "en": {
    "languageName": "English",
    "labels": {
      "appTitle": "Fantom Generator",
      "sectionCaseInfo": "Case Information",
      "fieldTitle": "Title",
      "fieldDate": "Date",
      "fieldCaseNumber": "Case Number",
      "sectionFreeText": "Additional Description",
      "freeTextInputPlaceholder": "Enter any other details here...",
      "sectionParameters": "Physical Parameters",
      "addParameterButton": "+ Add Custom Parameter",
      "sectionPromptPreview": "Generated Prompt",
      "copyPromptButton": "Copy Prompt",
      "sectionActions": "Actions",
      "saveJSONButton": "Save as JSON",
      "loadJSONButton": "Load JSON",
      "tabParameters": "Parameters",
      "tabUpload": "Upload & AI",
      "uploadSectionTitle": "AI Image Analysis (MVP Placeholder)",
      "uploadImageButton": "Upload Image",
      "analyzeImageButton": "Analyze Image with AI (Mock)",
      "validationErrorRequired": "Required fields are missing.",
      "validationErrorInvalidJSON": "Invalid JSON file.",
      "validationErrorMalformedJSON": "Malformed JSON structure.",
      "modalAddParamTitle": "Add Custom Parameter",
      "modalEditParamTitle": "Edit Parameter",
      "modalParamNameLabel": "Parameter Name:",
      "modalParamShadesLabel": "Shades (comma-separated):",
      "modalSaveButton": "Save",
      "modalCancelButton": "Cancel",
      "modalDeleteButton": "Delete Parameter"
    }
  },
  "es": {
    "languageName": "Español",
    "labels": {
      "appTitle": "Generador Fantasma",
      "sectionCaseInfo": "Información del Caso",
      "fieldTitle": "Título",
      "fieldDate": "Fecha",
      "fieldCaseNumber": "Número de Caso",
      "sectionFreeText": "Descripción Adicional",
      "freeTextInputPlaceholder": "Ingrese otros detalles aquí...",
      "sectionParameters": "Parámetros Físicos",
      "addParameterButton": "+ Agregar Parámetro Personalizado",
      "sectionPromptPreview": "Descripción Generada",
      "copyPromptButton": "Copiar Descripción",
      "sectionActions": "Acciones",
      "saveJSONButton": "Guardar como JSON",
      "loadJSONButton": "Cargar JSON",
      "tabParameters": "Parámetros",
      "tabUpload": "Subir e IA",
      "uploadSectionTitle": "Análisis de Imagen con IA (Marcador de posición MVP)",
      "uploadImageButton": "Subir Imagen",
      "analyzeImageButton": "Analizar Imagen con IA (Simulado)",
      "validationErrorRequired": "Faltan campos obligatorios.",
      "validationErrorInvalidJSON": "Archivo JSON inválido.",
      "validationErrorMalformedJSON": "Estructura JSON mal formada.",
       "modalAddParamTitle": "Agregar Parámetro Personalizado",
      "modalEditParamTitle": "Editar Parámetro",
      "modalParamNameLabel": "Nombre del Parámetro:",
      "modalParamShadesLabel": "Tonos (separados por comas):",
      "modalSaveButton": "Guardar",
      "modalCancelButton": "Cancelar",
      "modalDeleteButton": "Eliminar Parámetro"
    }
  }
  // ... other languages
}
```

---

## PRD-SEC-016: Glossary

-   **Parameter:** A specific physical attribute being described (e.g., Hair Length, Eye Color, Jaw Shape).
-   **Shade:** A specific value or descriptor for a parameter (e.g., "Short" for Hair Length, "Blue" for Eye Color, "Square" for Jaw Shape). Sliders allow selecting among defined shades.
-   **Prompt:** The generated human-readable textual description of the subject, combining parameter values and free text.
-   **MVP:** Minimum Viable Product. The core set of features required for the first usable version to test the concept and gather feedback.
-   **UAT:** User Acceptance Testing. Testing conducted by representatives of the target audience to ensure the product meets their needs.
-   **Vanilla JS:** Plain JavaScript without frameworks or libraries.
-   **Tailwind CSS:** A utility-first CSS framework for styling.
-   **JSON:** JavaScript Object Notation. A lightweight data interchange format used for saving and loading parameter sets.

---