import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { Params, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers";
import { getSystemMsgByCode, ROUTING_DEFINED } from "app/_share/_enum";
import { IPost } from "app/_share/_interface";
import { SessionService, ShareService } from "app/_share/_services";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})

export class PostComponent implements OnChanges {
  @Input() textOnly: boolean = false;
  @Input() postInfor: IPost | null = null;
  @Input() visibleFullPostModal: boolean = false;

  @Output() oEmitvisibleFullPostModal = new EventEmitter();
  @Output() oReloadComment = new EventEmitter();
  @Output() oChangeReact = new EventEmitter();
  @Output() oDeletePost = new EventEmitter();
  @Output() oEditPost = new EventEmitter();

  visibleCommentModal: boolean = false;
  visibleEditPostModal: boolean = false
  interact: boolean | null = null;
  isLogged: boolean = false;
  actionId: number | null = null;
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: 'auto',
    minHeight: '300px',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: false,
    uploadWithCredentials: false,
    sanitize: false,
  }

  // @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //     const keyCode = event.keyCode
  //     if (keyCode === KEY_CODE_WINDOW.ESCAPE) {
  //         if (this.visibleCommentModal) {
  //             this.onTogglevisibleCommentModal(false);
  //             return
  //         }
  //         if (this.visibleFullPostModal) {
  //             this.visibleFullPostModal = false
  //         }
  //     }
  // }
  get currentUserPost(): boolean {
    if (!this.postInfor) return false;
    return this.sessionSer.getID() === this.postInfor.userId;
  }

  constructor(
    private translate: TranslateService,
    private shareSer: ShareService,
    private msg: NzMessageService,
    private sessionSer: SessionService,
    private _router: Router,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLogged = this.sessionSer.isLogged();
    if (changes['postInfor'] && changes['postInfor'].currentValue) {
      if (this.isLogged) {
        this.checkInteractPost();
      }
    }
  }

  onToggleVisibleFullPost(visible: boolean) {
    this.visibleFullPostModal = visible;
    if (this.visibleFullPostModal) {
      this.onTogglevisibleCommentModal(false)
    }
    this.oEmitVisibleFullPostModal();
  }

  onTogglevisibleCommentModal(visible: boolean) {
    this.visibleCommentModal = visible;
  }

  oEmitVisibleFullPostModal() {
    this.oEmitvisibleFullPostModal.emit(this.visibleFullPostModal);
  }

  reloadComment() {
    if (this.postInfor) {
      this.oReloadComment.emit(this.postInfor.id);
    }
  }

  onClickInteract(evt: any, field: 'totalDislike' | 'totalLike') {
    if (this.isLogged) {
      let _interact = _.cloneDeep(this.interact);
      if (this.postInfor) {
        if (evt === this.interact) {
          this.interact = null;
        } else {
          this.interact = evt;
        }
        const _params = { interact: this.interact };
        this.shareSer.interactPost(this.postInfor.id, _params).subscribe({
          next: resp => {
            if (this.interact === null) {
              this.onChangeReact(field, -1);
            } else {
              if (_interact === null) {
                this.onChangeReact(field, 1);
              }
              if (_interact === true) {
                this.onChangeReact(field, 1);
                this.onChangeReact('totalLike', -1);
              }
              if (_interact === false) {
                this.onChangeReact(field, 1);
                this.onChangeReact('totalDislike', -1);
              }
            }
          },
          error: error => {
            console.log(error)
            this.showError(error['error'] ? error['error'].code || 8 : 8);
          },
          complete: () => { }
        });
      } else {
        this.showError('8')
      }
    }
  }

  checkInteractPost() {
    if (this.postInfor) {
      this.shareSer.checkInteractPost(this.postInfor.id).subscribe({
        next: resp => {
          if (resp) {
            if (_.isBoolean(resp.data)) {
              this.interact = resp.data
            } else {
              this.interact = null
            }
          } else {
            this.interact = null
          }
        },
        error: error => {
          this.showError(error['error'] ? error['error'].code || 8 : 8);
          this.interact = null
        },
      });
    } else {
      this.interact = null;
    }
  }

  goToProfile(id: number) {
    this.goToURL(Helpers.JoinPaths([ROUTING_DEFINED.HOME, id.toString()]));
  }

  onChangeReact(field: 'totalDislike' | 'totalLike', value: number) {
    this.oChangeReact.emit({ id: this.postInfor ? this.postInfor.id || null : null, field: field, value: value })
  }

  onToogleActionDropDown(evt: any, id: number) {
    this.actionId = id;
    if (evt) {
      evt.stopPropagation()
    }
  }

  onDeletePost() {
    this.shareSer.deletePost({ id: this.actionId }).subscribe({
      next: resp => {
        this.actionId = null;
        this.emitDeletePost();
        this.showSuccess();
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
        this.actionId = null;
      }
    });
  }

  emitDeletePost() {
    this.oDeletePost.emit();
  }

  onEditPost() {
    this.onToggleEditPostModal(true);
  }

  onToggleEditPostModal(visible: boolean) {
    this.visibleEditPostModal = visible;
  }

  emitEditPost() {
    this.oEditPost.emit();
    this.onToggleEditPostModal(false);
  }

  showError(code: string) {
    const _msg = getSystemMsgByCode(code || '8') as string;
    this.msg.error(this.translate.instant(_msg));
  }

  showSuccess() {
    this.msg.success(this.translate.instant('SYS_MSG.SUCCESS'));
  }

  goToURL(url: string, param?: Params) {
    if (url) {
      if (param) {
        this._router.navigate([url], { queryParams: param });
      }
      else {
        this._router.navigate([url]);
      }
    }

  }
}
