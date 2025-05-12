/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSWORD: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_USER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// React Quill
declare module 'react-quill';

// React Colorful
declare module 'react-colorful' {
  export interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
  }

  export const HexColorPicker: React.FC<ColorPickerProps>;
}