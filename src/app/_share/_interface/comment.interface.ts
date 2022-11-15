export interface IComment {
    id: number;
    content: string;
    createdAt: Date | string | number,
    createdBy: string;
    updatedAt: string;
}