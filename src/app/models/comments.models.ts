export interface Comment {
    id?: string;
    text: string;
    author: string;
    addedOn: Date;
    editedOn?: Date;
    parentCommentId?: string;
    recipyId: string;
    children?: Comment[]
}