import { Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { getTitleByField, USER_FIELD } from "app/_cores/_enums/user.enum";
import { Helpers } from "app/_cores/_helpers";
import { IUserProfile } from "app/_cores/_models/user.model";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { IPost } from "app/_share/_interface/post.interface";
import { SessionService, ShareService } from "app/_share/_services";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
  userInfo: IUserProfile | null = null;
  loading = {
    post: false,
    listFollow: false
  }
  data = {
    posts: [] as IPost[],
    userInforList: [] as {
      value: any,
      field: string,
      title: string,
      order: number
    }[],
    listFollower: [] as { userId: number, fullName: string, avatarText: string }[],
    listFollowing: [] as { userId: number, fullName: string, avatarText: string }[],
    showFollowList: [] as { userId: number, fullName: string, avatarText: string }[],
  }
  USER_FIELD = USER_FIELD;
  ROUTING_DEFINED = ROUTING_DEFINED;
  visibleFollowModal: boolean = false;
  constructor(
    private sessionSer: SessionService,
    private shareSer: ShareService,
    private translate: TranslateService,
    private msg: NzMessageService,
    private sesionSer: SessionService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.getListUserInfor();
    this.getPostByID();
    this.getFollowList();
  }

  getListUserInfor() {
    this.userInfo = this.sessionSer.getUserInfor();
    if (this.userInfo && _.size(this.userInfo)) {
      for (const field in this.userInfo) {
        const _field = this.getTitleByField(field);
        if (_field) {
          this.data.userInforList.push({
            value: this.getValueByField(field),
            field: field,
            title: _field.title,
            order: _field.order
          });
        }
      }
      this.data.userInforList = _.orderBy(this.data.userInforList, ['order']);
    }
  }

  getPostByID() {
    this.loading.post = true;
    this.shareSer.getPostByID({ userId: this.sessionSer.getID() }).subscribe({
      next: resp => {
        if (resp.data && resp.data.length) {
          this.data.posts = _.orderBy(resp.data, ['createAt'], ['desc']);
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

  getTitleByField(field: string): {
    field: string,
    title: string,
    order: number
} | null {
    return getTitleByField(field);
  }

  getValueByField(field: string): string | number {
    if (field === USER_FIELD.gender) {
      return (this.userInfo as any)[field] === 1 ? 'OUTSIDE.SIGN_UP.MALE' : 'OUTSIDE.SIGN_UP.FEMALE'
    }
    return (this.userInfo as any)[field]
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

  getFollowList() {
    if (this.userInfo) {
      this.loading.listFollow = true;
      this.shareSer.getMyFollow().subscribe({
        next: resp => {
          if (resp.data) {
            this.data.listFollower = (resp.data['followedByDtoList'] || []).map((item: any) => {
              return {
                ...item,
                avatarText: this.getTextAvatar(item.fullName),
              }
            });
            this.data.listFollowing = (resp.data['followingDtoList'] || []).map((item: any) => {
              return {
                ...item,
                avatarText: this.getTextAvatar(item.fullName),
              }
            });
          } else {
            this.data.listFollower = [];
            this.data.listFollowing = [];
          }
          this.loading.listFollow = false;
        },
        error: error => {
          this.showError(error['error'] ? error['error'].code || 8 : 8);
          this.loading.listFollow = false;
        },
        complete: () => {
          this.loading.listFollow = false;
        }
      });
    } else {
      this.showError('8')
    }
  }

  onToggleFollowModal(visible: boolean, isFollower?: boolean) {
    if (visible) {
      this.getFollowListForShow(isFollower || false);
    } else {
      this.data.showFollowList = [];
    }
    this.visibleFollowModal = visible;
  }

  getFollowListForShow(isFollower: boolean) {
    if (isFollower) {
      this.data.showFollowList = [...this.data.listFollower];
    } else {
      this.data.showFollowList = [...this.data.listFollowing];
    }
  }

  getTextAvatar(name?: string): string {
    const _name = name ? name : this.userInfo ? this.userInfo.fullName : '';
    for (let i = 0; i < _name.length; i++) {
      if (_name[i].trim()) {
        return _name[i].toUpperCase();
      }
    }
    return ''
  }

  goToProfile(id: number) {
    if (id === this.sesionSer.getID()) {
      this.goToURL(ROUTING_DEFINED.PROFILE);
    } else {
      this.goToURL(Helpers.JoinPaths([ROUTING_DEFINED.HOME, id.toString()]));
    }
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
