export interface IBookingInfor {
    id?: number;
    doctorId: null | number;
    specialist: null | string;

    bookedAt: null | number | string | Date;
    shift: null | number;
    content: string;
    consult: string | null;
    createdBy?: string;
    doctorName?: string;
}

export interface IDoctorInfor {
    fullName: string,
    id: number;
    specialist: string;
    workingAt: string;
}

export interface IShift {
    shift: number,
    startNumber: number,
    start: number,
    end: number,
    expired: boolean;
    booked: boolean;
}