export interface IBookingItem {
    id?: number;
    doctorName?: string;
    doctorId: null | number;
    specialist: null | string;

    bookedAt: null | number | string | Date;
    shift?: number;
    bookedShift?: number;
    content: string;
    consult: string | null;
}