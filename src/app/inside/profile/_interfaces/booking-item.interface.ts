export interface IBookingItem {
    id?: number;
    doctorName?: string;
    doctorId: null | number;
    specialist: null | string;

    bookedAt: null | number | string | Date;
    shift?: number;
    bookedShift?: number;
    createdBy?: string;
    content: string;
    consult: string | null;

    visibleInforModal?: boolean;
}