export const updateThemeColors = (element, hue = 217, saturation = 89) => {
  element.style.setProperty('--theme-primary', `hsl(${hue}, ${saturation}%, 50%)`)
  element.style.setProperty('--theme-primary-light', `hsl(${hue}, ${saturation}%, 90%)`)
  element.style.setProperty('--theme-primary-lighter', `hsl(${hue}, ${saturation}%, 95%)`)
  element.style.setProperty('--theme-primary-dark', `hsl(${hue}, ${saturation}%, 40%)`)
  element.style.setProperty('--theme-primary-darker', `hsl(${hue}, ${saturation}%, 30%)`)
  element.style.setProperty('--theme-primary-transparent', `hsla(${hue}, ${saturation}%, 50%, 70%)`)
  element.style.setProperty('--theme-primary-very-transparent', `hsla(${hue}, ${saturation}%, 50%, 20%)`)

  element.style.setProperty('--theme-neutral-50', `hsl(${hue}, 15%, 97%)`)
  element.style.setProperty('--theme-neutral-100', `hsl(${hue}, 25%, 95%)`)
  element.style.setProperty('--theme-neutral-200', 'hsl(0, 0%, 87%)')
  element.style.setProperty('--theme-neutral-300', 'hsl(0, 0%, 80%)')
  element.style.setProperty('--theme-neutral-400', 'hsl(0, 0%, 63%)')
  element.style.setProperty('--theme-neutral-500', 'hsl(0, 0%, 37%)')
  element.style.setProperty('--theme-neutral-600', 'hsl(0, 0%, 20%)')

  element.style.setProperty('--theme-border', 'hsl(0, 0%, 87%)')
  element.style.setProperty('--theme-shadow', 'rgba(0, 0, 0, 0.1)')

  element.style.setProperty('--theme-spacing-xxs', '0.15rem')
  element.style.setProperty('--theme-spacing-xs', '0.25rem')
  element.style.setProperty('--theme-spacing-sm', '0.5rem')
  element.style.setProperty('--theme-spacing-md', '1rem')
  element.style.setProperty('--theme-spacing-lg', '2rem')
  element.style.setProperty('--theme-spacing-xl', '3rem')

  element.style.setProperty('--theme-border-radius-sm', '2px')
  element.style.setProperty('--theme-border-radius-md', '4px')
  element.style.setProperty('--theme-border-radius-lg', '8px')

  element.style.setProperty('--theme-border-width-sm', '1px')
  element.style.setProperty('--theme-border-width-md', '2px')

  element.style.setProperty('--theme-font-size-sm', '12px')
  element.style.setProperty('--theme-font-size-md', '14px')
  element.style.setProperty('--theme-font-size-base', '0.9rem')
}
