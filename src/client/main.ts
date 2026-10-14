import { MAX_TIMEOUT_MS, Callback } from './utils';
import { NetEvents, ResPayload } from '../shared/utils';

class CbManager {
  private readonly pendingCb = new Map<string, Callback>();
  private readonly timeoutDur: number;

  constructor(timeoutMs = 15000) {
    this.timeoutDur = timeoutMs;
    this.addNetListener();
  }

  private addNetListener() {
    onNet(NetEvents.CL_RES, (cbId: string, res: ResPayload) => {
      const pending = this.pendingCb.get(cbId);
      if (!pending) return;

      clearTimeout(pending.timeout);
      this.pendingCb.delete(cbId);

      if (res.success) pending.res(res.data);
      else pending.rej(new Error(res.error) || 'Unknown Callback Error');
    });
  }
  
  private genRandId = (): string => Math.random().toString(36).substring(2);

  private genCbId = (eventName: string): string => eventName
    + `_${Date.now()}-${GetPlayerServerId(PlayerId())}_${this.genRandId()}`;

  public triggerCb<T = any>(
    eventName: string,
    ...args: any[]
  ): Promise<T> {
    return new Promise<T>((res, rej) => {
      const cbId = this.genCbId(eventName);

      const timeout = setTimeout(() => {
        if (this.pendingCb.has(cbId)) {
          this.pendingCb.delete(cbId);
          rej(new Error(`[CB @ ${Date.now()}] Event Timeout`));
        }
      }, this.timeoutDur);

      this.pendingCb.set(cbId, { res, rej, timeout });

      emitNet(NetEvents.SV_REQ, eventName, cbId, ...args);
    });
  }
}

const ClCallbacks = new CbManager(MAX_TIMEOUT_MS);

globalThis.exports('TriggerCb', <T>(
  eventName: string,
  ...args: any[]
) => ClCallbacks.triggerCb<T>(eventName, ...args));