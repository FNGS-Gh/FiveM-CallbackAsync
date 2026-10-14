export type CbInstance = (
  src: number,
  ...args: any[]
) => Promise<any> | any;

export const ERRORS_MAP: Record<
  string, (e: string, id?: string, cl?: number) => string
> = {
  unhandled: (e, id?, cl?) =>
    `[CbHandler${id ? `:${id}` : ''}] Unhandled Event: ${e} ${cl ? `| Player ID: ${cl}` : ''}`,
  exception: (e, id?, cl?) =>
    `[CbHandler${id ? `:${id}` : ''}] Exception caught. Event: ${e} ${cl ? `| Player ID: ${cl}` : ''}`,
  overwrite: e =>
    `[CbHandler] Overwriting existing callback instance. Event: ${e}`,
  unknown: e =>
    `[CbHandler] Trying to unmount unknown callback instance. Event: ${e}`,
} as const;