export const createThemeStyleSheet = (hue = 217, saturation = 89) => {
  const css = `
    :host {
      --theme-primary: light-dark(hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 60%));
      --theme-primary-light: light-dark(hsl(${hue}, ${saturation}%, 90%), hsl(${hue}, ${saturation}%, 30%));
      --theme-primary-lighter: light-dark(hsl(${hue}, ${saturation}%, 95%), hsl(${hue}, ${saturation}%, 20%));
      --theme-primary-dark: light-dark(hsl(${hue}, ${saturation}%, 40%), hsl(${hue}, ${saturation}%, 70%));
      --theme-primary-darker: light-dark(hsl(${hue}, ${saturation}%, 30%), hsl(${hue}, ${saturation}%, 80%));
      --theme-primary-transparent: light-dark(hsla(${hue}, ${saturation}%, 50%, 70%), hsla(${hue}, ${saturation}%, 60%, 70%));
      --theme-primary-very-transparent: light-dark(hsla(${hue}, ${saturation}%, 50%, 20%), hsla(${hue}, ${saturation}%, 60%, 20%));

      --theme-neutral-50: light-dark(hsl(${hue}, 15%, 97%), hsl(${hue}, 15%, 10%));
      --theme-neutral-100: light-dark(hsl(${hue}, 25%, 95%), hsl(${hue}, 15%, 15%));
      --theme-neutral-200: light-dark(hsl(0, 0%, 87%), hsl(0, 0%, 25%));
      --theme-neutral-300: light-dark(hsl(0, 0%, 80%), hsl(0, 0%, 35%));
      --theme-neutral-400: light-dark(hsl(0, 0%, 63%), hsl(0, 0%, 50%));
      --theme-neutral-500: light-dark(hsl(0, 0%, 37%), hsl(0, 0%, 63%));
      --theme-neutral-600: light-dark(hsl(0, 0%, 20%), hsl(0, 0%, 85%));

      --theme-border: light-dark(hsl(0, 0%, 87%), hsl(0, 0%, 30%));
      --theme-shadow: light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
      
      --theme-icon-color: light-dark(hsl(0, 0%, 20%), hsl(0, 0%, 85%));

      --theme-spacing-xxs: 0.15rem;
      --theme-spacing-xs: 0.25rem;
      --theme-spacing-sm: 0.5rem;
      --theme-spacing-md: 1rem;
      --theme-spacing-lg: 2rem;
      --theme-spacing-xl: 3rem;

      --theme-border-radius-sm: 2px;
      --theme-border-radius-md: 4px;
      --theme-border-radius-lg: 8px;

      --theme-border-width-sm: 1px;
      --theme-border-width-md: 2px;

      --theme-font-size-sm: 12px;
      --theme-font-size-md: 14px;
      --theme-font-size-base: 0.9rem;

      --theme-icon-size-md: 16px;
      --theme-icon-size-lg: 18px;
    }
  `

  const sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  return sheet
}
