# CLAUDE.md - Estándares Constitucionales de Proyecto

## Reglas de Desarrollo
1. **Regex de Saneamiento**: Siempre usar `\s` para espacios en blanco. **NUNCA** usar `/s+/` literal a menos que se desee borrar la letra 's'.
2. **Modularización de Assets**: Al mover un archivo de asset, se debe realizar un `grep` global para actualizar TODAS sus referencias. Priorizar `./` relativo en lugar de rutas absolutas o de raíz.
3. **Compatibilidad de Scripts**: Los scripts de `package.json` deben ser agnósticos al shell o estar adaptados para el entorno de usuario (Windows PowerShell).
4. **Fondos de Pantalla**: Las pantallas de tensión (`reveal`, `timer`, `panic`) deben compartir el mismo fondo `bg_tension.jpg` para mantener la cohesión visual del clímax.
5. **Paridad de Assets (Capacitor)**: En despliegues nativos sin bundler, siempre realizar un barrido recursivo (`robocopy src www/src /E`) antes de `npx cap sync` para evitar recursos faltantes (404) en Android/iOS.
