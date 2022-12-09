import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IPost } from "app/_share/_interface";
import { SessionService } from "app/_share/_services/session.service";
import { ShareService } from "app/_share/_services/share.service";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";
import { HomePageModel } from "../../_models";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html"
})

export class HomePageComponent implements OnInit {
  data = {
    posts: [] as IPost[],
    threads: [] as { id: number, name: string }[]
  }
  loading = {
    post: false,
    thread: false,
  }
  params!: HomePageModel
  allowCreatePost: boolean = false;
  constructor(
    private translate: TranslateService,
    private shareSer: ShareService,
    private msg: NzMessageService,
    private _router: Router,
    private sessionSer: SessionService,
  ) {
    this.allowCreatePost = this.sessionSer.isLogged();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.parseParams();
    this.getAllThread();
  }

  parseParams() {
    const _object = Helpers.convertParamsToObject(Helpers.getParamString());
    this.params = new HomePageModel(_object || null);
    this.changeURL();
  }

  changeURL() {
    this._router.navigate([], {
      queryParams: this.params || {},
      queryParamsHandling: 'merge'
    });
    this.getPost();
  }

  getPost() {
    if (this.params) {
      if (this.params.threadFilter === 'ALL') {
        this.getAllPost();
      } else if (this.params.threadFilter === 'FOLLOW') {
        this.getPostFolowing();
      } else {
        this.getPostbyThread();
      }
    }
  }

  getAllPost() {
    this.loading.post = true;
    this.shareSer.getAllPost().subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          this.data.posts = _.orderBy(resp.data.map((item: any) => {
            return {
              ...item,
              commentList: _.orderBy([...(item.commentList || [])], ['createdAt'], ['desc'])
            }
          }), ['createAt'], ['desc']);
        } else {
          this.data.posts = [];
        }
        this.loading.post = false;
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
        this.loading.post = false;
      },
      complete: () => {
        this.loading.post = false;
      }
    });
  }

  getAllThread() {
    this.loading.thread = true;
    this.shareSer.getThread().subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          this.data.threads = resp.data
        } else {
          this.data.threads = []
        }
        this.loading.thread = false;
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
        this.loading.thread = false;
      },
      complete: () => {
        this.loading.thread = false;
      }
    });
  }

  getPostbyThread() {
    this.loading.post = true;
    const _params = { threadId: this.params.threadFilter }
    this.shareSer.getPostByThread(_params).subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          this.data.posts = _.orderBy(resp.data.map((item: any) => {
            return {
              ...item,
              commentList: _.orderBy([...(item.commentList || [])], ['createdAt'], ['desc'])
            }
          }), ['createAt'], ['desc']);
        } else {
          this.data.posts = [];
        }
        this.loading.post = false;
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
        this.loading.post = false;
      },
      complete: () => {
        this.loading.post = false;
      }
    });
  }

  getPostFolowing() {
    this.loading.post = true;
    this.shareSer.getPostFollowing().subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          this.data.posts = _.orderBy(resp.data.map((item: any) => {
            return {
              ...item,
              commentList: _.orderBy([...(item.commentList || [])], ['createdAt'], ['desc'])
            }
          }), ['createAt'], ['desc']);
        } else {
          this.data.posts = [];
        }
        this.loading.post = false;
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
        this.loading.post = false;
      },
      complete: () => {
        this.loading.post = false;
      }
    });
  }

  onChangeThread(id: 'ALL' | 'FOLLOW' | number) {
    if (_.isNumber(id)) {
      if (+id === this.params.threadFilter) {
        this.params.threadFilter = 'ALL';
      } else {
        this.params.threadFilter = +id;
      }
    } else {
      if (id === this.params.threadFilter) {
        this.params.threadFilter = 'ALL';
      } else {
        this.params.threadFilter = id;
      }
    }
    this.params = new HomePageModel(this.params);
    this.changeURL();
  }

  onReloadComment(id: number) {
    this.shareSer.getCommentByPosyId(id).subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          const _exitsIndex = this.data.posts.findIndex(post => post.id === id);
          if (_exitsIndex > -1) {
            this.data.posts[_exitsIndex].commentList = _.orderBy([...resp.data], ['createdAt'], ['desc'])
          }
        }
      },
      error: error => {
        this.showError(error['error'] ? error['error'].code || 8 : 8);
      },
      complete: () => { }
    });
  }

  onChangeInteract(evt: { id: number, field: 'totalDislike' | 'totalLike', value: number }) {
    const { id, field, value } = evt
    const _existIndex = this.data.posts.findIndex(post => post.id === id);
    if (_existIndex > -1) {
      this.data.posts[_existIndex][field] = (this.data.posts[_existIndex][field] || 0) + value
    }
  }

  showError(code: string) {
    const _msg = getSystemMsgByCode(code || '8') as string;
    this.msg.error(this.translate.instant(_msg));
  }

  showSuccess() {
    this.msg.success(this.translate.instant('SYS_MSG.SUCCESS'));
  }

}
