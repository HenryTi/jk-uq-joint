export interface DataIn {
    transfer: (data:any) => Promise<any>;
    type: string
}
