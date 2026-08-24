export type EmbeddedSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const EMBEDDED_FORM_SELECT_FIELDS: Record<string, EmbeddedSelectOption[]> = {
  cf_canales_de_contactabilidad: [
    { value: "", label: "Selecciona un canal", disabled: true },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Llamada", label: "Llamada" },
    { value: "Correo", label: "Correo" },
  ],
  cf_horario_preferido_para_contacto: [
    { value: "", label: "Selecciona un horario", disabled: true },
    { value: "7_am_a_12_pm", label: "7:00 a.m. a 12:00 p.m." },
    { value: "de_12_pm_a_2_pm", label: "12:00 p.m. a 2:00 p.m." },
    { value: "de_2_pm_a_6_pm", label: "2:00 p.m. a 6:00 p.m." },
    { value: "de_6_pm_a_8_pm", label: "6:00 p.m. a 8:00 p.m." },
  ],
  cf_tu_ciudad: [
    { value: "", label: "Selecciona tu ciudad", disabled: true },
    { value: "Bogotá D.C.", label: "Bogotá D.C." },
    { value: "Soacha", label: "Soacha" },
    { value: "Zipaquirá", label: "Zipaquirá" },
    { value: "Medellín", label: "Medellín" },
    { value: "Bello", label: "Bello" },
    { value: "Envigado", label: "Envigado" },
    { value: "Itagüí", label: "Itagüí" },
    { value: "Rionegro", label: "Rionegro" },
    { value: "Barranquilla", label: "Barranquilla" },
    { value: "Soledad", label: "Soledad" },
    { value: "Malambo", label: "Malambo" },
    { value: "Bucaramanga", label: "Bucaramanga" },
    { value: "Floridablanca", label: "Floridablanca" },
    { value: "Barrancabermeja", label: "Barrancabermeja" },
    { value: "Cali", label: "Cali" },
    { value: "Palmira", label: "Palmira" },
    { value: "Buenaventura", label: "Buenaventura" },
    { value: "Otra", label: "Otra" },
  ],
};
