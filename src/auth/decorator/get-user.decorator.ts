import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom Parameter Decorator zum Extrahieren von User-Daten aus JWT Token
 *
 * Verwendung:
 * @GetUser('id') userId: number     // Gibt nur die User-ID zurück
 * @GetUser('email') email: string   // Gibt nur die Email zurück
 * @GetUser() user: any              // Gibt das ganze User-Objekt zurück
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // 1. HTTP Request-Objekt aus dem Execution Context holen
    const request: Express.Request = ctx.switchToHttp().getRequest();

    // 2. Sicherheitscheck: Existiert request.user? (wird vom JWT Guard gesetzt)
    if (!request.user) {
      return null;
    }

    // 3. Falls spezifische Property gewünscht (z.B. 'id'), diese zurückgeben
    if (data) {
      return (request.user as Record<string, unknown>)[data];
    }

    // 4. Falls kein Parameter übergeben, ganzes User-Objekt zurückgeben
    return request.user;
  },
);
