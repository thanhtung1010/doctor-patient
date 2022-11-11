export interface IBookingInfor {
    id?: number;
    doctorName?: string;
    doctorId: null | number;
    specialist: null | string;

    bookedAt: null | number | string | Date;
    bookedShift: null | number;
    content: string;
    consult: string | null;
}

export interface IDoctorInfor {
    fullName: string,
    id: number;
    specialist: string;
}

export interface IShift {
    shift: number,
    startNumber: number,
    start: number,
    end: number,
    expired: boolean
}