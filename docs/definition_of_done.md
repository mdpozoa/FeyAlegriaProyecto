# Definition of Done (DoD)

Para considerar completada una función (Historia de Usuario) dentro del proyecto SafeCampus Monitor, se deben cumplir obligatoriamente los siguientes criterios:

1. **Código:**
   - El código debe estar escrito en Vue.js usando Composition API.
   - Debe respetar el patrón de arquitectura MVC.
   - El código debe estar sin errores de sintaxis (linter) y sin warnings graves en consola.

2. **Funcionalidad:**
   - La característica debe cumplir exactamente con los criterios de aceptación definidos en el Sprint Backlog.
   - La interfaz debe responder adecuadamente y coincidir con la estética del PVM original.

3. **Pruebas:**
   - La función ha sido probada localmente ejecutando `npm run dev` y asegurando que compila en `npm run build`.
   - Navegación y componentes visuales han sido verificados de forma manual.

4. **Documentación:**
   - Si la función requiere variables de entorno, deben ser documentadas en `.env.example`.
   - Cualquier dependencia nueva instalada debe estar registrada en el `package.json`.

5. **Despliegue:**
   - El código de la función ha sido subido (commit/push) al repositorio de GitHub.
   - La versión en producción (Vercel) se ha reconstruido sin errores y refleja el nuevo cambio.
