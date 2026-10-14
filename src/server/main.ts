import { ERRORS_MAP, CbInstance } from './utils';
import { NetEvents, ResPayload } from '../shared/utils';

class CbHandler {
  private readonly cbInstances = new Map<string, CbInstance>();

  constructor() {
    this.addNetListener();
  }

  private addNetListener() {
    onNet(NetEvents.SV_REQ, async (
      eventName: string,
      cbId: string,
      ...args: any[]
    ) => {
      const src = source;
      const cb = this.cbInstances.get(eventName);

      if (!cb) {
        console.error(ERRORS_MAP.unhandled(eventName, cbId, src));

        emitNet(NetEvents.CL_RES, src, cbId, <ResPayload>{
          success: false,
          error: `[${src} @ ${Date.now()}]: Unhandled Event`
        });

        return;
      }

      try {
        const result = await cb(src, ...args);

        emitNet(NetEvents.CL_RES, src, cbId, <ResPayload>{
          success: true,
          data: result
        });
      } catch (err: any) {
        console.error(ERRORS_MAP.exception(eventName, cbId, src), err);

        emitNet(NetEvents.CL_RES, src, cbId, <ResPayload>{
          success: false,
          error: `[${src} @ ${Date.now()}]: Server Callback Error`
        });
      }
    });
  }

  public mountCb(eventName: string, cb: CbInstance) {
    if (this.cbInstances.has(eventName))
      console.warn(ERRORS_MAP.overwrite(eventName));
    this.cbInstances.set(eventName, cb);
  }

  public unmountCb(eventName: string) {
    if (!this.cbInstances.has(eventName)) {
      console.error(ERRORS_MAP.unknown(eventName));
      return;
    }
    this.cbInstances.delete(eventName);
  }
}

const SvCallbacks = new CbHandler;

globalThis.exports('MountCb', (
  eventName: string,
  instance: CbInstance
): void => {
  SvCallbacks.mountCb(eventName, instance);
});