export const dashboardLanguageCookieName = "bunji-dashboard-language";
export const dashboardLanguageChangeEvent = "bunji-dashboard-language-change";

export type DashboardLanguage = "en" | "es";

type TranslationLeaf = string;
type TranslationNode = {
  [key: string]: TranslationLeaf | TranslationNode;
};

export const dashboardMessages = {
  en: {
    shell: {
      dashboard: "Dashboard",
      brands: "Brands",
      docs: "Documentation",
      newBrand: "Add brand",
      activeBrands: "Active brands",
      knowledgeBase: "Knowledge Base",
      journey: "Journey",
      editBrand: "Edit brand",
      createWithAi: "Create with AI",
      newLanding: "New landing",
      activeBrand: "Active brand",
      backToBrand: "Back to brand",
      backToLandings: "Back to landings",
      backToNewLanding: "Back to new landing",
      openSidebar: "Open menu",
      closeSidebar: "Close menu",
    },
    userMenu: {
      loading: "Loading...",
      user: "Account",
      language: "Language",
      theme: "Theme",
      english: "English",
      spanish: "Spanish",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      signOut: "Sign out",
      signingOut: "Signing out...",
    },
    home: {
      eyebrow: "Brands",
      title: "Your workspaces",
      descriptionHighlight: "Manage brand, content, and landing activation",
      descriptionTail: "for each university or institution in one place.",
      workspaceChip: "EDwin workspace",
    },
    brandCard: {
      edit: "Edit",
      viewBrand: "Open workspace",
      programSingular: "program",
      programPlural: "programs",
    },
    landings: {
      searchLabel: "Search landings",
      searchPlaceholder:
        "Search by program, slug, delivery mode, schedule, or status",
      clearSearch: "Clear search",
      empty: "We couldn't find any landings matching that search.",
      noType: "No category",
      updatedAt: "Last updated",
      slug: "Slug",
      viewDetail: "View details",
      preview: "Preview",
      export: "Export",
      duplicate: "Duplicate",
      duplicating: "Duplicating...",
      delete: "Delete",
      deleteTitle: "Delete landing",
      deleteBody:
        'You are about to delete "{title}". This action cannot be undone.',
      cancel: "Cancel",
      confirmDelete: "Yes, delete",
      deleting: "Deleting...",
      duplicateError: "We couldn't duplicate the landing.",
      deleteError: "We couldn't delete the landing.",
      statusDraft: "Draft",
      scheduleDay: "Daytime",
      scheduleNight: "Evening",
      scheduleFlexible: "Flexible",
      modalityOnCampus: "On-campus",
      modalityOnline: "Online",
    },
    brandEditor: {
      back: "Back",
      createMessage:
        "Set up the institution so your team can start building content and landings.",
      editMessage:
        "Update the institution profile, brand assets, and official links.",
      generalTab: "General information",
      stylesTab: "Visual styles",
      createBrand: "Create brand",
      creating: "Creating...",
      saving: "Saving...",
      saveChanges: "Save changes",
      saveError: "We couldn't save the brand information.",
      saveSuccess: "Brand information saved successfully.",
      createSuccess: "Brand created successfully in Supabase.",
      createPartialSuccess:
        "The JSON file was created, but the brand could not be created in Supabase: {error}",
      noErrorDetail: "No additional details were returned.",
      genericError: "Something went wrong.",
      fields: {
        slug: "Slug",
        name: "Display name",
        fullName: "Full institutional name",
        description: "Description",
        officialWebsite: "Official website",
        siteName: "Site name",
        abstract: "Abstract",
        keywords: "Keywords",
        robots: "Robots",
        generator: "Generator",
        brandImage: "Primary brand image",
        logo: "Main logo",
        logoLight: "Light logo",
        logoDark: "Dark logo",
        primaryColor: "Primary color",
        secondaryColor: "Secondary color",
        fontFamily: "Font family",
        googleFontsUrl: "Google Fonts URL",
        identityManual: "Brand guidelines",
        legalLinks: "Legal links",
        certifications: "Accreditations",
        campuses: "Campuses",
        imageGallery: "Image gallery",
      },
      helper: {
        gallery:
          "Add extra image URLs you may want to reuse across the brand.",
        galleryEmpty: "No extra brand images have been added yet.",
        addImage: "Add image",
        campuses:
          "Add each campus with a short description, image, and video link.",
        campusesEmpty: "No campuses have been added yet.",
        addCampus: "Add campus",
        legalLinks: "These links appear in landing page footers.",
        legalLinksEmpty: "No legal links have been added yet.",
        addLegalLink: "Add link",
        certifications: "Add institutional accreditations or certifications.",
        certificationsEmpty: "No certifications have been added yet.",
        addCertification: "Add accreditation",
        campusName: "Campus name",
        campusLocation: "Location",
        campusDescription: "Campus description",
        campusImage: "Campus image",
        campusVideo: "Video URL",
        linkLabel: "Label",
        accreditationName: "Accreditation name",
        accreditorUrl: "Accrediting body URL",
        colorVariantsPrimary: "Primary color variants",
        colorVariantsSecondary: "Secondary color variants",
        colorVariantsHelp:
          "These tones are generated from the main color, but you can adjust them if needed.",
      },
      item: {
        image: "Image",
        campus: "Campus",
        link: "Link",
        certification: "Accreditation",
      },
      actions: {
        remove: "Remove",
      },
      tones: {
        lightest: "Lightest",
        light: "Light",
        dark: "Dark",
        darkest: "Darkest",
      },
    },
    programsEditor: {
      title: "Programs",
      backToPrograms: "Back to programs",
      addProgram: "Add program",
      saving: "Saving...",
      save: "Save",
      remove: "Remove",
      addFirstProgram: "Add first program",
      saveError: "We couldn't save the programs.",
      saveSuccess: "Programs saved successfully.",
      programLabel: "Program",
      fields: {
        programName: "Program name",
        sourceWebsite: "Source website",
        catalog: "Catalog",
      },
    },
    programDataEditor: {
      baseInfo: "Base information",
      addProgram: "Add program",
      editProgram: "Edit program",
      createProgram: "Create program",
      saveProgram: "Save program",
      saving: "Saving...",
      creating: "Creating...",
      continue: "Continue",
      previous: "Previous",
      runAgent: "Run Content Agent",
      runningAgent: "Running...",
      preview: "Preview",
      previewTitle: "Program information will appear here",
      previewDescription:
        "Complete the setup steps and run the Content Agent to review the generated information before creating the program.",
      previewFooter:
        "When everything looks right, return to the flow and create the program.",
      createDescription:
        "Complete the program information step by step. The slug is generated automatically from the program name.",
      jsonTitle: "Full program JSON",
      jsonDescription:
        "Use this section to review and edit the full program structure. Any field in the data can be updated here.",
      jsonInvalid: "The JSON is invalid. Fix it before saving.",
      jsonSync:
        "Base information and this JSON stay in sync while the content is valid.",
      messages: {
        fixJsonBeforeSave: "Fix the full JSON before saving the program.",
        missingProgramName:
          "Add the program name before creating the program.",
        runAgentBeforeCreate:
          "Run the Content Agent before creating the program.",
        invalidSlug: "The program name must generate a valid slug.",
        created: "Program created successfully.",
        saved: "Program saved successfully.",
        saveError: "We couldn't save the program.",
        running: "Running Content Agent...",
        fixJsonBeforeAgent: "Fix the full JSON before running the agent.",
        missingNameForAgent:
          "Add the program name before running the agent.",
        missingSourceWebsite:
          "Add the source website before running the agent.",
        invalidSourceWebsite:
          "The source website must be a valid URL that starts with http:// or https://.",
        agentFailure:
          "The Content Agent could not complete the request. Review the workflow and try again.",
        emptyAgentData:
          "The Content Agent did not return usable data for this program.",
        agentComplete:
          "Content Agent complete. Review the preview and create the program when you're ready.",
        agentError: "We couldn't run the Content Agent.",
      },
      steps: {
        nameTitle: "Program name",
        nameDescription:
          "Enter the program name students and staff will recognize. The slug is generated automatically from this field.",
        sourceTitle: "Source website",
        sourceDescription:
          "Add the official page the agent should use as the main source.",
        catalogTitle: "Program catalog",
        catalogDescription:
          "Choose whether to connect the catalog with a file or a public link.",
      },
      fields: {
        programName: "Program name",
        fullTitle: "Full title",
        language: "Language",
        slug: "Slug",
        sourceWebsite: "Source website",
        catalog: "Catalog",
        programType: "Program type",
        schedule: "Schedule",
        status: "Status",
        template: "Template",
      },
      helper: {
        userFacingName:
          "Write the name users will see across the platform.",
        autoSlug: "This is generated automatically from the program name.",
        sourceWebsite:
          "Paste the official program URL or the page you want to use as a source.",
        howAddCatalog: "How would you like to add the catalog?",
        howAddCatalogDescription:
          "You can leave it for later, upload a file, or add a public link.",
        uploadCatalog: "Upload catalog",
        addLink: "Add link",
        catalogLink:
          "Paste the public catalog URL if you already have it available.",
        catalogFile: "Catalog file",
        fileReference:
          "For now, only the file reference is stored in the data. Final document upload can be connected later.",
      },
      actions: {
        english: "English",
        spanish: "Spanish",
      },
      empty: {
        pending: "Pending",
      },
    },
    buyerPersonTable: {
      profile: "Profile",
      stage: "Stage",
      motivations: "Motivations",
      updatedAt: "Updated",
      actions: "Actions",
      pending: "Pending",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      deleting: "Deleting...",
      deleteError: "We couldn't delete the buyer persona.",
      deleteSuccess: "Buyer persona deleted successfully.",
    },
    buyerPersonDetail: {
      descriptionTitle: "Description",
    },
    programsPage: {
      title: "Programs",
      addProgram: "Add program",
    },
    landingsPage: {
      title: "Brand landings",
      description:
        "Manage this institution's landings and launch new experiences whenever you need them.",
      createLanding: "Create landing",
      emptyEyebrow: "Landing agent",
      emptyTitle: "No landings have been created yet",
      emptyDescription:
        "Create the first landing for this brand to organize its academic offer and lead capture flow.",
      createFirstLanding: "Create first landing",
    },
    journeyPage: {
      title: "Journey",
      description:
        "This layer brings together the activation workflows that turn the brand foundation into campaigns, assets, and lead generation experiences.",
      buyerPersonaTitle: "Buyer Persona",
      buyerPersonaDescription:
        "Define audiences, motivations, and objections so each message speaks clearly to the right profiles.",
      buyerPersonaHelper: "{count} profiles created",
      buyerPersonaCta: "Go to buyer personas",
      visualAssetsTitle: "Visual Assets",
      visualAssetsDescription:
        "Organize the visual resources and references your team needs for campaigns, creative production, and brand experiences.",
      visualAssetsHelper: "{count} assets available",
      visualAssetsCta: "Go to visual assets",
      landingActivationTitle: "Landing Activation",
      landingActivationDescription:
        "Design and publish landings connected to the journey so traffic turns into leads ready for CRM and automation.",
      landingActivationHelper: "{published}/{total} published",
      landingActivationCta: "Go to landings",
    },
    knowledgeBasePage: {
      title: "Knowledge Base",
      description:
        "This layer brings together the institutional setup and core content that support the rest of the platform.",
      universityContentBaseTitle: "University Content Base",
      universityContentBaseDescription:
        "Set up a single institutional base that supports programs, narrative, and strategic decisions.",
      institutionalContentHelper: "Institutional content ready to connect",
      goToUniversityContentBase: "Go to University Content Base",
      brandSetupTitle: "Brand Setup",
      brandSetupDescription:
        "Organize identity, official links, logos, colors, and core guidelines so the team can work with reliable context.",
      baseSignalsCompleted: "base signals completed",
      setupBrand: "Set up brand",
      programContentBaseTitle: "Program Content Base",
      programContentBaseDescription:
          "Structure programs and core content that later feed landing copy, benefits, messaging, and conversion blocks.",
      structuredPrograms: "structured programs",
      goToContentBase: "Go to Program Content Base",
      documentsTitle: "Documents",
      documentsDescription:
        "Create the institutional document hub where teams will upload and organize PDFs that support content, admissions, and academic workflows.",
      documentsHelper: "PDF repository ready to configure",
      goToDocuments: "Go to Documents",
      goldenCircleTitle: "Golden Circle",
      goldenCircleSubtitle: "Why, How, What",
      goldenCircleDescription:
        "Shape the institutional purpose into a simple narrative that guides communication and growth.",
      narrativeFramework: "Foundational narrative framework",
      goToGoldenCircle: "Go to Golden Circle",
      completePreviousStep: "Complete the previous step to unlock this section.",
      availableLater: "Available later",
      statusCompleted: "Completed",
      statusInProgress: "In progress",
      statusLocked: "Locked",
      statusPending: "Pending",
      step01: "Step 01",
      step02: "Step 02",
      step03: "Step 03",
      step04: "Step 04",
    },
    documentsPage: {
      title: "Documents",
      context: "Institutional Documents",
      backToKnowledgeBase: "Back to Knowledge Base",
      save: "Save changes",
      saving: "Saving...",
      saved: "Changes saved for this document setup.",
      saveError: "We could not save these documents. Please try again.",
      repositoryEyebrow: "Document repository",
      repositoryTitle: "Prepare the university PDF library",
      repositoryDescription:
        "This section will gather institutional PDFs that help admissions, content, and academic teams work from the same source of truth.",
      categoriesEyebrow: "Categories",
      categoriesTitle: "Organize documents by university need",
      categoriesDescription:
        "Use these tabs to keep institutional PDFs separated by purpose so teams can find and maintain them more easily.",
      legalTab: "Legal",
      catalogsTab: "Catalogs",
      brandBookTab: "Brand book",
      curriculumTab: "Study plans",
      uploadEyebrow: "Upload flow",
      uploadTitle: "PDF upload area",
      uploadDescription:
          "Upload PDFs here and organize them by university context, program support, or internal documentation.",
      uploadFormats: "Supported format: PDF documents",
      uploadFileOption: "Upload file",
      addLinkOption: "Add link",
      dropTitle: "Drag and drop your PDF here",
      dropDescription:
        "You can drop the file into this area or use the button to browse from your computer.",
      browseFile: "Browse file",
      selectedFile: "Selected file",
      replaceFile: "Replace file",
      linkLabel: "Document link",
      linkPlaceholder: "Paste the PDF URL here",
      helperInstruction:
        "Each category supports one main document for now. Later we can expand this to multiple files and richer metadata.",
      libraryEyebrow: "Current status",
      libraryTitle: "No documents uploaded yet",
      libraryDescription:
        "The document hub is ready. In the next step, we can add upload, listing, tagging, and processing logic.",
      emptyState: "Your institutional PDF library will appear here.",
      readyEyebrow: "Current setup",
      readyTitle: "Categories ready to configure",
      readyDescription:
        "Use the tabs to define whether each category will be connected by uploaded PDF or external link.",
      sourceLabel: "Source",
      sourceFile: "File",
      sourceLink: "Link",
      noSource: "Pending",
      nextPhaseEyebrow: "Next phase",
      nextPhaseDescription:
        "This foundation is ready for drag and drop uploads, document metadata, and AI processing flows.",
    },
    universityPage: {
      backToKnowledgeBase: "Back to Knowledge Base",
      context: "University Content Base",
      edit: "Edit",
      configureSection: "Set up section",
      snapshotEyebrow: "Institutional snapshot",
      snapshotTitle: "Institutional context available today",
      snapshotEmptyDescription:
        "There is no institutional description for this brand yet.",
      programsLabel: "Programs",
      goToProgramsBase: "Go to programs base",
      programTypesLabel: "Program types",
      pendingStructure: "Pending structure",
      portfolioDetected: "Initial view of the detected portfolio",
    },
    brandOverviewPage: {
      backToBrands: "Back to brands",
      controlRoom: "Control Room",
      knowledgeBase: "Knowledge Base",
      buildKnowledgeBase: "Build the Knowledge Base",
      buildKnowledgeBaseDescription:
        "Organize programs, differentiators, students, historical context, experts, and competitors into a living backbone.",
      knowledgeBaseCompletion: "Knowledge Base completion",
      buildKnowledge: "Build knowledge ->",
      deployEducationAgents: "Deploy Education Agents",
      deployEducationAgentsDescription:
        "Use phase-specific agents to turn knowledge into tasks, deliverables, and next actions.",
      nextAction: "Next action",
      viewJourneyAndAgents: "Open journey and agents ->",
      setupBrand: "Set up brand",
      setupBrandUnlock:
        "Unlocks a clear foundation for messaging, tone, and consistent visual guidelines.",
      createBuyerPersona: "Create buyer persona",
      buyerPersonaUnlock:
        "Unlocks sharper messaging for content, landings, ads, and CRM.",
      createProgram: "Create program",
      contentBaseUnlock:
        "Unlocks a consistent narrative for landings, campaigns, and program-specific assets.",
      generateAssets: "Generate assets",
      visualAssetsUnlock:
        "Unlocks reusable creative for campaigns, ads, hero sections, and sales materials.",
      createLanding: "Create landing",
      landingActivationUnlock:
        "Unlocks active lead capture, public publishing, and direct connection to forms and automations.",
      brandSetup: "Brand Setup",
      buyerPersona: "Buyer Persona",
      contentBase: "Content Base",
      visualAssets: "Visual Assets",
      landingActivation: "Landing Activation",
      universityContentBase: "University Content Base",
      documents: "Documents",
      goldenCircle: "Golden Circle",
      completed: "Completed",
      educationAgentsEyebrow: "Education Agents",
    },
    workspaceProgress: {
      eyebrow: "Workspace Progress",
      title: "Operational state",
      description:
        "Track how the workspace moves across setup, knowledge, content, assets, and activation without mixing in institutional data.",
      stepsCompleted: "steps completed",
      recommendedMove: "Recommended next move",
      knowledgeBaseTab: "Knowledge Base",
      educationAgentsTab: "Education Agents",
      completedList: "Completed",
      inProgressList: "In progress",
      noneCompleted: "No completed items yet.",
      noneInProgress: "No items in progress.",
      complete: "Complete",
      inProgress: "In progress",
      setup: "Needs setup",
      active: "Operational",
      ready: "Activation-ready",
    },
    common: {
      noResults: "No results",
      pending: "Pending",
      yesDelete: "Yes, delete",
      remove: "Remove",
    },
  },
  es: {
    shell: {
      dashboard: "Inicio",
      brands: "Universidades",
      docs: "Documentacion",
      newBrand: "Nueva universidad",
      activeBrands: "Universidades activas",
      knowledgeBase: "Base de conocimiento",
      journey: "Acciones",
      editBrand: "Editar universidad",
      createWithAi: "Crear con AI",
      newLanding: "Nueva landing",
      activeBrand: "Universidad activa",
      backToBrand: "Volver a universidad",
      backToLandings: "Volver a landings",
      backToNewLanding: "Volver a nueva landing",
      openSidebar: "Abrir menu",
      closeSidebar: "Cerrar menu",
    },
    userMenu: {
      loading: "Cargando...",
      user: "Cuenta",
      language: "Idioma",
      theme: "Tema",
      english: "English",
      spanish: "Espanol",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      signOut: "Cerrar sesion",
      signingOut: "Cerrando sesion...",
    },
    home: {
      eyebrow: "Universidades",
      title: "Tus espacios de trabajo",
      descriptionHighlight:
        "Gestiona universidades, contenidos y campañas desde un solo lugar",
      descriptionTail:
        "para cada universidad o institucion en un solo lugar.",
      workspaceChip: "Espacio de trabajo de EDwin",
    },
    brandCard: {
      edit: "Editar",
      viewBrand: "Abrir workspace",
      programSingular: "programa",
      programPlural: "programas",
    },
    landings: {
      searchLabel: "Buscar landings",
      searchPlaceholder:
        "Busca por programa, slug, modalidad, jornada o estado",
      clearSearch: "Limpiar busqueda",
      empty: "No encontramos landings con esa busqueda.",
      noType: "Sin categoria",
      updatedAt: "Ultima actualizacion",
      slug: "Slug",
      viewDetail: "Ver detalle",
      preview: "Preview",
      export: "Exportar",
      duplicate: "Duplicar",
      duplicating: "Duplicando...",
      delete: "Eliminar",
      deleteTitle: "Eliminar landing",
      deleteBody:
        'Vas a eliminar "{title}". Esta accion no se puede deshacer.',
      cancel: "Cancelar",
      confirmDelete: "Si, eliminar",
      deleting: "Eliminando...",
      duplicateError: "No pudimos duplicar la landing.",
      deleteError: "No pudimos eliminar la landing.",
      statusDraft: "Borrador",
      scheduleDay: "Diurna",
      scheduleNight: "Nocturna",
      scheduleFlexible: "Flexible",
      modalityOnCampus: "Presencial",
      modalityOnline: "Virtual",
    },
    brandEditor: {
      back: "Volver",
      createMessage:
        "Configura la institucion para que tu equipo pueda empezar a crear contenido y landings.",
      editMessage:
        "Actualiza el perfil institucional, los recursos de marca y los enlaces oficiales.",
      generalTab: "Informacion general",
      stylesTab: "Estilos graficos",
      createBrand: "Crear marca",
      creating: "Creando...",
      saving: "Guardando...",
      saveChanges: "Guardar cambios",
      saveError: "No pudimos guardar la informacion de la marca.",
      saveSuccess: "La informacion de la marca se guardo correctamente.",
      createSuccess: "Marca creada correctamente en Supabase.",
      createPartialSuccess:
        "El JSON se creo, pero no se pudo crear la marca en Supabase: {error}",
      noErrorDetail: "No se recibio informacion adicional del error.",
      genericError: "Ocurrio un error.",
      fields: {
        slug: "Slug",
        name: "Nombre visible",
        fullName: "Nombre completo institucional",
        description: "Descripcion",
        officialWebsite: "Sitio oficial",
        siteName: "Site name",
        abstract: "Abstract",
        keywords: "Keywords",
        robots: "Robots",
        generator: "Generator",
        brandImage: "Imagen principal de marca",
        logo: "Logo principal",
        logoLight: "Logo light",
        logoDark: "Logo dark",
        primaryColor: "Color primario",
        secondaryColor: "Color secundario",
        fontFamily: "Font family",
        googleFontsUrl: "Google Fonts URL",
        identityManual: "Manual de identidad",
        legalLinks: "Links legales",
        certifications: "Certificaciones",
        campuses: "Campuses",
        imageGallery: "Galeria de imagenes",
      },
      helper: {
        gallery:
          "Agrega imagenes adicionales que quieras reutilizar en la marca.",
        galleryEmpty: "Todavia no has agregado imagenes adicionales.",
        addImage: "Agregar imagen",
        campuses:
          "Agrega cada sede con una descripcion breve, una imagen y un video.",
        campusesEmpty: "Todavia no has agregado sedes.",
        addCampus: "Agregar campus",
        legalLinks: "Estos enlaces aparecen en el footer de las landings.",
        legalLinksEmpty: "Todavia no has agregado enlaces legales.",
        addLegalLink: "Agregar link",
        certifications:
          "Agrega acreditaciones o certificaciones institucionales.",
        certificationsEmpty: "Todavia no has agregado certificaciones.",
        addCertification: "Agregar certificacion",
        campusName: "Nombre del campus",
        campusLocation: "Ubicacion",
        campusDescription: "Descripcion del campus",
        campusImage: "Imagen del campus",
        campusVideo: "Link de video",
        linkLabel: "Etiqueta",
        accreditationName: "Nombre de la acreditacion",
        accreditorUrl: "URL de la entidad acreditadora",
        colorVariantsPrimary: "Variantes del color primario",
        colorVariantsSecondary: "Variantes del color secundario",
        colorVariantsHelp:
          "Estos tonos se generan desde el color principal, pero puedes ajustarlos si lo necesitas.",
      },
      item: {
        image: "Imagen",
        campus: "Campus",
        link: "Link",
        certification: "Certificacion",
      },
      actions: {
        remove: "Eliminar",
      },
      tones: {
        lightest: "Mas claro",
        light: "Claro",
        dark: "Oscuro",
        darkest: "Mas oscuro",
      },
    },
    programsEditor: {
      title: "Programas",
      backToPrograms: "Volver a programas",
      addProgram: "Agregar programa",
      saving: "Guardando...",
      save: "Guardar",
      remove: "Eliminar",
      addFirstProgram: "Agregar primer programa",
      saveError: "No pudimos guardar los programas.",
      saveSuccess: "Los programas se guardaron correctamente.",
      programLabel: "Programa",
      fields: {
        programName: "Nombre del programa",
        sourceWebsite: "Sitio web fuente",
        catalog: "Catalogo",
      },
    },
    programDataEditor: {
      baseInfo: "Informacion base",
      addProgram: "Agregar programa",
      editProgram: "Editar programa",
      createProgram: "Crear programa",
      saveProgram: "Guardar programa",
      saving: "Guardando...",
      creating: "Creando...",
      continue: "Continuar",
      previous: "Anterior",
      runAgent: "Ejecutar Content Agent",
      runningAgent: "Ejecutando...",
      preview: "Preview",
      previewTitle: "Aqui veras la informacion del programa",
      previewDescription:
        "Completa los pasos de configuracion y ejecuta el Content Agent para revisar la informacion generada antes de crear el programa.",
      previewFooter:
        "Cuando todo se vea bien, vuelve al flujo y crea el programa.",
      createDescription:
        "Completa la informacion del programa paso a paso. El slug se genera automaticamente desde el nombre.",
      jsonTitle: "JSON completo del programa",
      jsonDescription:
        "En esta seccion puedes revisar y editar toda la estructura del programa. Cualquier campo del data se puede actualizar aqui.",
      jsonInvalid: "El JSON no es valido. Corrigelo antes de guardar.",
      jsonSync:
        "La informacion base y este JSON se mantienen sincronizados mientras el contenido sea valido.",
      messages: {
        fixJsonBeforeSave:
          "Corrige el JSON completo antes de guardar el programa.",
        missingProgramName:
          "Agrega el nombre del programa antes de crearlo.",
        runAgentBeforeCreate:
          "Ejecuta el Content Agent antes de crear el programa.",
        invalidSlug: "El nombre del programa debe generar un slug valido.",
        created: "Programa creado correctamente.",
        saved: "Programa guardado correctamente.",
        saveError: "No pudimos guardar el programa.",
        running: "Ejecutando Content Agent...",
        fixJsonBeforeAgent:
          "Corrige el JSON completo antes de ejecutar el agente.",
        missingNameForAgent:
          "Agrega el nombre del programa antes de ejecutar el agente.",
        missingSourceWebsite:
          "Agrega el sitio web fuente antes de ejecutar el agente.",
        invalidSourceWebsite:
          "El sitio web fuente debe ser una URL valida que empiece por http:// o https://.",
        agentFailure:
          "El Content Agent no pudo completar la solicitud. Revisa el flujo y vuelve a intentarlo.",
        emptyAgentData:
          "El Content Agent no devolvio datos utiles para este programa.",
        agentComplete:
          "Content Agent completo. Revisa el preview y crea el programa cuando todo este listo.",
        agentError: "No pudimos ejecutar el Content Agent.",
      },
      steps: {
        nameTitle: "Nombre del programa",
        nameDescription:
          "Escribe el nombre del programa tal como lo reconocen estudiantes y equipos internos. El slug se genera automaticamente con este dato.",
        sourceTitle: "Sitio web fuente",
        sourceDescription:
          "Agrega la pagina oficial que el agente usara como fuente principal.",
        catalogTitle: "Catalogo del programa",
        catalogDescription:
          "Elige si quieres conectar el catalogo con un archivo o con un enlace publico.",
      },
      fields: {
        programName: "Nombre del programa",
        fullTitle: "Titulo completo",
        language: "Idioma",
        slug: "Slug",
        sourceWebsite: "Sitio web fuente",
        catalog: "Catalogo",
        programType: "Tipo de programa",
        schedule: "Jornada",
        status: "Estado",
        template: "Template",
      },
      helper: {
        userFacingName:
          "Escribe el nombre que veran los usuarios en la plataforma.",
        autoSlug:
          "Se genera automaticamente a partir del nombre del programa.",
        sourceWebsite:
          "Pega la URL oficial del programa o la pagina que quieres usar como fuente.",
        howAddCatalog: "Como quieres agregar el catalogo?",
        howAddCatalogDescription:
          "Puedes dejarlo para despues, subir un archivo o agregar un enlace publico.",
        uploadCatalog: "Subir catalogo",
        addLink: "Agregar enlace",
        catalogLink:
          "Pega la URL publica del catalogo si ya la tienes disponible.",
        catalogFile: "Archivo del catalogo",
        fileReference:
          "Por ahora solo se guarda la referencia del archivo en la data. La carga final del documento se puede conectar mas adelante.",
      },
      actions: {
        english: "English",
        spanish: "Espanol",
      },
      empty: {
        pending: "Pendiente",
      },
    },
    buyerPersonTable: {
      profile: "Perfil",
      stage: "Etapa",
      motivations: "Motivaciones",
      updatedAt: "Actualizado",
      actions: "Acciones",
      pending: "Pendiente",
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
      deleting: "Eliminando...",
      deleteError: "No pudimos eliminar el buyer persona.",
      deleteSuccess: "Buyer persona eliminado correctamente.",
    },
    buyerPersonDetail: {
      descriptionTitle: "Descripcion",
    },
    programsPage: {
      title: "Programas",
      addProgram: "Agregar programa",
    },
    landingsPage: {
      title: "Landings de marca",
      description:
        "Gestiona las landings de esta institucion y crea nuevas experiencias cuando las necesites.",
      createLanding: "Crear landing",
      emptyEyebrow: "Landing agent",
      emptyTitle: "Todavia no hay landings creadas",
      emptyDescription:
        "Crea la primera landing de esta marca para organizar su oferta academica y su flujo de captacion.",
      createFirstLanding: "Crear primera landing",
    },
    journeyPage: {
      title: "Acciones",
      description:
        "Esta capa reune los flujos de activacion que convierten la base de marca en campanas, assets y experiencias de captacion.",
      buyerPersonaTitle: "Buyer Persona",
      buyerPersonaDescription:
        "Define audiencias, motivaciones y objeciones para que cada mensaje conecte con los perfiles correctos.",
      buyerPersonaHelper: "{count} perfiles creados",
      buyerPersonaCta: "Ir a buyer personas",
      visualAssetsTitle: "Visual Assets",
      visualAssetsDescription:
        "Organiza los recursos visuales y referencias que el equipo necesita para campanas, produccion creativa y experiencias de marca.",
      visualAssetsHelper: "{count} assets disponibles",
      visualAssetsCta: "Ir a visual assets",
      landingActivationTitle: "Landing Activation",
      landingActivationDescription:
        "Disena y publica landings conectadas al journey para convertir trafico en leads listos para CRM y automatizacion.",
      landingActivationHelper: "{published}/{total} publicadas",
      landingActivationCta: "Ir a landings",
    },
    knowledgeBasePage: {
      title: "Knowledge Base",
      description:
        "Esta capa reune la configuracion institucional y el contenido base que alimentan el resto de la plataforma.",
      universityContentBaseTitle: "University Content Base",
      universityContentBaseDescription:
        "Configura una base institucional unica que acompañe programas, narrativa y decisiones estrategicas.",
      institutionalContentHelper: "Contenido institucional listo para conectar",
      goToUniversityContentBase: "Ir a University Content Base",
      brandSetupTitle: "Brand Setup",
      brandSetupDescription:
        "Organiza identidad, enlaces oficiales, logos, colores y lineamientos base para que el equipo trabaje con contexto confiable.",
      baseSignalsCompleted: "senales base completadas",
      setupBrand: "Configurar marca",
      programContentBaseTitle: "Program Content Base",
      programContentBaseDescription:
          "Estructura programas y contenido central que luego alimentan copys, beneficios, mensajes y bloques de conversion.",
      structuredPrograms: "programas estructurados",
      goToContentBase: "Ir a Program Content Base",
      documentsTitle: "Documents",
      documentsDescription:
        "Crea el hub documental institucional donde el equipo podrá subir y organizar PDFs que apoyen contenido, admisiones y flujos académicos.",
      documentsHelper: "Repositorio PDF listo para configurar",
      goToDocuments: "Ir a Documents",
      goldenCircleTitle: "Golden Circle",
      goldenCircleSubtitle: "Why, How, What",
      goldenCircleDescription:
        "Ordena el proposito institucional en una narrativa simple que guie la comunicacion y el crecimiento.",
      narrativeFramework: "Marco narrativo fundacional",
      goToGoldenCircle: "Ir a Golden Circle",
      completePreviousStep: "Completa el paso anterior para desbloquear esta seccion.",
      availableLater: "Disponible despues",
      statusCompleted: "Completado",
      statusInProgress: "En progreso",
      statusLocked: "Bloqueado",
      statusPending: "Pendiente",
      step01: "Paso 01",
      step02: "Paso 02",
      step03: "Paso 03",
      step04: "Paso 04",
    },
    documentsPage: {
      title: "Documents",
      context: "Institutional Documents",
      backToKnowledgeBase: "Volver a Knowledge Base",
      save: "Guardar cambios",
      saving: "Guardando...",
      saveError: "No pudimos guardar estos documentos. Intenta de nuevo.",
      saved: "Los cambios quedaron guardados para esta configuración documental.",
      repositoryEyebrow: "Repositorio documental",
      repositoryTitle: "Prepara la biblioteca PDF de la universidad",
      repositoryDescription:
        "Esta sección reunirá PDFs institucionales para que admisiones, contenido y equipos académicos trabajen desde una misma fuente de verdad.",
      categoriesEyebrow: "Categorías",
      categoriesTitle: "Organiza los documentos por necesidad institucional",
      categoriesDescription:
        "Usa estas tabs para separar los PDFs institucionales por propósito y facilitar que el equipo los encuentre y mantenga.",
      legalTab: "Legales",
      catalogsTab: "Catálogos",
      brandBookTab: "Brand book",
      curriculumTab: "Planes de estudio",
      uploadEyebrow: "Flujo de carga",
      uploadTitle: "Área de carga de PDFs",
      uploadDescription:
        "Aquí podrás subir PDFs y organizarlos por contexto institucional, soporte de programas o documentación interna.",
      uploadFormats: "Formato soportado: documentos PDF",
      uploadFileOption: "Cargar archivo",
      addLinkOption: "Cargar link",
      dropTitle: "Arrastra y suelta tu PDF aquí",
      dropDescription:
        "Puedes soltar el archivo en esta zona o usar el botón para buscarlo en tu computador.",
      browseFile: "Buscar archivo",
      selectedFile: "Archivo seleccionado",
      replaceFile: "Reemplazar archivo",
      linkLabel: "Link del documento",
      linkPlaceholder: "Pega aquí la URL del PDF",
      helperInstruction:
        "Por ahora cada categoría soporta un documento principal. Después podemos ampliar esto a múltiples archivos y metadatos más completos.",
      libraryEyebrow: "Estado actual",
      libraryTitle: "Todavía no hay documentos cargados",
      libraryDescription:
        "El hub documental ya está listo. En el siguiente paso podemos sumar la lógica de carga, listado, etiquetas y procesamiento.",
      emptyState: "Aquí aparecerá la biblioteca institucional de PDFs.",
      readyEyebrow: "Configuración actual",
      readyTitle: "Categorías listas para configurar",
      readyDescription:
        "Usa las tabs para definir si cada categoría se conectará por PDF cargado o por link externo.",
      sourceLabel: "Origen",
      sourceFile: "Archivo",
      sourceLink: "Link",
      noSource: "Pendiente",
      nextPhaseEyebrow: "Siguiente fase",
      nextPhaseDescription:
        "Esta base ya queda lista para drag and drop, metadatos documentales y flujos de procesamiento con AI.",
    },
    universityPage: {
      backToKnowledgeBase: "Volver a Knowledge Base",
      context: "University Content Base",
      edit: "Editar",
      configureSection: "Configurar seccion",
      snapshotEyebrow: "Resumen institucional",
      snapshotTitle: "Contexto institucional disponible hoy",
      snapshotEmptyDescription:
        "Todavia no hay una descripcion institucional cargada para esta marca.",
      programsLabel: "Programas",
      goToProgramsBase: "Ir a la base de programas",
      programTypesLabel: "Tipo de programas",
      pendingStructure: "Pendiente por estructurar",
      portfolioDetected: "Vista inicial del portafolio detectado",
    },
    brandOverviewPage: {
      backToBrands: "Volver a marcas",
      controlRoom: "Control Room",
      knowledgeBase: "Base de conocimiento",
      buildKnowledgeBase: "Nutrir la Base de Conocimiento",
      buildKnowledgeBaseDescription:
        "Organiza programas, diferenciales, estudiantes, historicos, expertos y competidores en una columna vertebral viva.",
      knowledgeBaseCompletion: "Porcentaje completado Base de Conocimiento",
      buildKnowledge: "Construir conocimiento ->",
      deployEducationAgents: "Desplegar Acciones",
      deployEducationAgentsDescription:
        "Usa agentes especializados por fase para convertir el conocimiento en tareas, entregables y siguientes acciones.",
      nextAction: "Siguiente accion",
      viewJourneyAndAgents: "Ver journey y agentes ->",
      setupBrand: "Configurar marca",
      setupBrandUnlock:
        "Desbloquea una base clara para definir mensajes, tono y lineamientos visuales consistentes.",
      createBuyerPersona: "Crear buyer persona",
      buyerPersonaUnlock:
        "Desbloquea mensajes mas precisos para contenidos, landings, anuncios y CRM.",
      createProgram: "Crear programa",
      contentBaseUnlock:
        "Desbloquea una narrativa consistente para landings, campanas y activos por programa.",
      generateAssets: "Generar assets",
      visualAssetsUnlock:
        "Desbloquea creatividad reutilizable para campanas, anuncios, hero sections y materiales comerciales.",
      createLanding: "Crear landing",
      landingActivationUnlock:
        "Desbloquea captacion activa, publicacion publica y conexion directa con formularios y automatizaciones.",
      brandSetup: "Brand Setup",
      buyerPersona: "Buyer Persona",
      contentBase: "Content Base",
      visualAssets: "Visual Assets",
      landingActivation: "Landing Activation",
      universityContentBase: "University Content Base",
      documents: "Documents",
      goldenCircle: "Golden Circle",
      completed: "Completado",
      educationAgentsEyebrow: "Acciones",
    },
    workspaceProgress: {
      eyebrow: "Progreso",
      title: "Estado operativo",
      description:
        "Haz seguimiento al avance del workspace en configuracion, conocimiento, contenido, assets y activacion sin mezclar datos institucionales.",
      stepsCompleted: "etapas completadas",
      recommendedMove: "Siguiente paso recomendado",
      knowledgeBaseTab: "Base de conocimiento",
      educationAgentsTab: "Acciones",
      completedList: "Completado",
      inProgressList: "En progreso",
      noneCompleted: "Todavia no hay elementos completados.",
      noneInProgress: "No hay elementos en progreso.",
      complete: "Completado",
      inProgress: "En progreso",
      setup: "Pendiente de configurar",
      active: "Operativo",
      ready: "Listo para activar",
    },
    common: {
      noResults: "Sin resultados",
      pending: "Pendiente",
      yesDelete: "Si, eliminar",
      remove: "Eliminar",
    },
  },
} satisfies Record<DashboardLanguage, TranslationNode>;

export function normalizeDashboardLanguage(
  value: string | undefined | null,
): DashboardLanguage {
  return value === "en" ? "en" : "es";
}

export function getDashboardMessage(
  language: DashboardLanguage,
  key: string,
  replacements?: Record<string, string | number>,
) {
  const parts = key.split(".");
  let current: TranslationLeaf | TranslationNode = dashboardMessages[language];

  for (const part of parts) {
    if (!current || typeof current === "string" || !(part in current)) {
      return key;
    }

    current = current[part];
  }

  if (typeof current !== "string") {
    return key;
  }

  if (!replacements) {
    return current;
  }

  return Object.entries(replacements).reduce(
    (result, [token, value]) => result.replaceAll(`{${token}}`, String(value)),
    current,
  );
}

export function getDashboardTranslator(language: DashboardLanguage) {
  return (key: string, replacements?: Record<string, string | number>) =>
    getDashboardMessage(language, key, replacements);
}

export function formatCountLabel(
  language: DashboardLanguage,
  count: number,
  singular: string,
  plural?: string,
) {
  if (language === "en") {
    const normalizedPlural = plural ?? `${singular}s`;
    return `${count} ${count === 1 ? singular : normalizedPlural}`;
  }

  const normalizedPlural = plural ?? singular;
  return `${count} ${count === 1 ? singular : normalizedPlural}`;
}
