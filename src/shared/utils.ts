export enum NetEvents {
  SV_REQ = 'cb:sv:req',
  CL_RES = 'cb:cl:res',
}

export interface ResPayload {
  success: boolean;
  data?: any;
  error?: string;
}