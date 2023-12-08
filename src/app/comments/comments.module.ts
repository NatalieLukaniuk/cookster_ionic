import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommentComponent } from "./comment/comment.component";
import { CommentsBlockComponent } from './comments-block/comments-block.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    declarations: [
        CommentComponent,
        CommentsBlockComponent
    ],
    exports: [
        CommentsBlockComponent
    ]
})

export class CommentsModule { }