import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

export interface UseFormValidationReturn {
  errors: ValidationErrors;
  isValid: boolean;
  validateField: (name: string, value: any) => boolean;
  validateForm: (data: any) => boolean;
  clearErrors: () => void;
  clearFieldError: (name: string) => void;
  setCustomError: (name: string, error: string) => void;
}

export const commonValidations = {
  required: (message = 'Campo obrigatório'): ValidationRule => ({
    required: true,
    message
  }),

  email: (message = 'Email inválido'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message
  }),

  phone: (message = 'Telefone inválido'): ValidationRule => ({
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message
  }),

  cpf: (message = 'CPF inválido'): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return null;
      
      const cpf = value.replace(/\D/g, '');
      
      if (cpf.length !== 11) return message;
      

      if (/^(\d)\1+$/.test(cpf)) return message;
      
      
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[9])) return message;
      
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[10])) return message;
      
      return null;
    }
  }),

  cnpj: (message = 'CNPJ inválido'): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return null;
      
      const cnpj = value.replace(/\D/g, '');
      
      if (cnpj.length !== 14) return message;
      if (/^(\d)\1+$/.test(cnpj)) return message;
      
      
      const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const weights2 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
      
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weights1[i];
      }
      let remainder = sum % 11;
      const digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      sum = 0;
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weights2[i];
      }
      remainder = sum % 11;
      const digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      if (parseInt(cnpj[12]) !== digit1 || parseInt(cnpj[13]) !== digit2) {
        return message;
      }
      
      return null;
    }
  }),

  placa: (message = 'Placa inválida'): ValidationRule => ({
    pattern: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    message: message || `Mínimo de ${min} caracteres`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    message: message || `Máximo de ${max} caracteres`
  }),

  numeric: (message = 'Apenas números'): ValidationRule => ({
    pattern: /^\d+$/,
    message
  }),

  decimal: (message = 'Valor inválido'): ValidationRule => ({
    pattern: /^\d+(\.\d{1,2})?$/,
    message
  }),

  year: (message = 'Ano inválido'): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return null;
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        return message;
      }
      return null;
    }
  }),

  date: (message = 'Data inválida'): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return null;
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(value)) return message;
      
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (date.getDate() !== day || 
          date.getMonth() !== month - 1 || 
          date.getFullYear() !== year) {
        return message;
      }
      
      return null;
    }
  })
};

export const useFormValidation = (validationRules: FieldValidation): UseFormValidationReturn => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: any): boolean => {
    const rules = validationRules[name] || [];
    let fieldError = '';

    for (const rule of rules) {
     
      if (rule.required && (!value || value.toString().trim() === '')) {
        fieldError = rule.message || 'Campo obrigatório';
        break;
      }

      if (!value || value.toString().trim() === '') {
        continue;
      }

      if (rule.minLength && value.toString().length < rule.minLength) {
        fieldError = rule.message || `Mínimo de ${rule.minLength} caracteres`;
        break;
      }

      if (rule.maxLength && value.toString().length > rule.maxLength) {
        fieldError = rule.message || `Máximo de ${rule.maxLength} caracteres`;
        break;
      }

      if (rule.pattern && !rule.pattern.test(value.toString())) {
        fieldError = rule.message || 'Formato inválido';
        break;
      }

      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          fieldError = customError;
          break;
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    return !fieldError;
  }, [validationRules]);

  const validateForm = useCallback((data: any): boolean => {
    const newErrors: ValidationErrors = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = data[fieldName];
      const rules = validationRules[fieldName];
      let fieldError = '';

      for (const rule of rules) {
        
        if (rule.required && (!fieldValue || fieldValue.toString().trim() === '')) {
          fieldError = rule.message || 'Campo obrigatório';
          break;
        }

        
        if (!fieldValue || fieldValue.toString().trim() === '') {
          continue;
        }

        
        if (rule.minLength && fieldValue.toString().length < rule.minLength) {
          fieldError = rule.message || `Mínimo de ${rule.minLength} caracteres`;
          break;
        }

        
        if (rule.maxLength && fieldValue.toString().length > rule.maxLength) {
          fieldError = rule.message || `Máximo de ${rule.maxLength} caracteres`;
          break;
        }

        
        if (rule.pattern && !rule.pattern.test(fieldValue.toString())) {
          fieldError = rule.message || 'Formato inválido';
          break;
        }

        
        if (rule.custom) {
          const customError = rule.custom(fieldValue);
          if (customError) {
            fieldError = customError;
            break;
          }
        }
      }

      if (fieldError) {
        newErrors[fieldName] = fieldError;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [validationRules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const setCustomError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const isValid = Object.keys(errors).length === 0 || Object.values(errors).every(error => !error);

  return {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setCustomError
  };
};