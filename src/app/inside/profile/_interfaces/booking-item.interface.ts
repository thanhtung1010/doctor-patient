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

export interface IBookedCalendar {
  bookedAt: Date | string | number,
  doctorName: string,
  createdBy: string,
  children: IBookingItem[]
}

export interface IDoctorBookingInfor {
  doctorId: number;
  specialist: string;
}
