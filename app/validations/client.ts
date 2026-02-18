export interface ClientFormData {
  fullname: string;
  email: string;
  status: boolean;
}

export interface ClientFormErrors {
  fullname?: string;
  email?: string;
}

export function validateClient(data: ClientFormData): ClientFormErrors {
  const errors: ClientFormErrors = {};
  if (!data.fullname.trim()) {
    errors.fullname = "El nombre es obligatorio";
  }
  else if (data.fullname.trim().length < 3) {
    errors.fullname = "Debe tener al menos 3 caracteres";
  }
  else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.fullname)) {
    errors.fullname = "Solo letras y espacios";
  }
  if (!data.email.trim()) {
    errors.email = "El email es obligatorio";
  }
  else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Email inválido";
  }

  return errors;

}
