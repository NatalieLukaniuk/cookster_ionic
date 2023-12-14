import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommentComponent } from "./comment/comment.component";
import { CommentsBlockComponent } from './comments-block/comments-block.component';
import { SharedModule } from "../shared/shared.module";
import { LongPressDirective } from "../shared/directives/long-press.directive";


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        CommentComponent,
        CommentsBlockComponent
    ],
    exports: [
        CommentsBlockComponent
    ],
    providers: [LongPressDirective]
})

export class CommentsModule { }