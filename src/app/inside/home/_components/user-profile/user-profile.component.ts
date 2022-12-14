import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { IDoctorBookingInfor } from "app/inside/profile/_interfaces";
import { getTitleByField, USER_FIELD } from "app/_cores/_enums/user.enum";
import { Helpers } from "app/_cores/_helpers";
import { IUserProfile } from "app/_cores/_models/user.model";
import { CommonService } from "app/_cores/_services/common.service";
import { ROUTING_DEFINED } from "app/_share/_enum";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { IPost } from "app/_share/_interface/post.interface";
import { SessionService } from "app/_share/_services/session.service";
import { ShareService } from "app/_share/_services/share.service";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";
import { USER_FIELD_NAME } from "../../_enums";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html"
})

export class UserProfileComponent implements OnInit {
  id: number | null = null;
  userInfo: IUserProfile | null = null;
  avatarText: string = '';
  follow: boolean = false;
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
  bookingData = {
    visibleBookingModal: false,
    infor: null as null | IDoctorBookingInfor
  };
  ROLE = ROLE;
  loading = {
    infor: false,
    follow: false,
    listFollow: false,
  }
  routerSub!: ActivatedRoute;
  USER_FIELD = USER_FIELD;
  USER_FIELD_NAME = USER_FIELD_NAME;
  showProfileByField = [
    {
      role: [ROLE.USER, ROLE.ADMIN],
      fields: [
        this.USER_FIELD_NAME.FULL_NAME,
        this.USER_FIELD_NAME.ROLE,
        this.USER_FIELD_NAME.EMAIL,
        this.USER_FIELD_NAME.AGE,
        this.USER_FIELD_NAME.GENDER,
        this.USER_FIELD_NAME.PHONE,
      ]
    },
    {
      role: [ROLE.DOCTOR],
      fields: [
        this.USER_FIELD_NAME.FULL_NAME,
        this.USER_FIELD_NAME.ROLE,
        this.USER_FIELD_NAME.EMAIL,
        this.USER_FIELD_NAME.AGE,
        this.USER_FIELD_NAME.GENDER,
        this.USER_FIELD_NAME.PHONE,
        this.USER_FIELD_NAME.CERTIFICATE,
        this.USER_FIELD_NAME.DEGREE,
        this.USER_FIELD_NAME.STARTWORKATTIME,
        this.USER_FIELD_NAME.ENDWORKATTIME,
        this.USER_FIELD_NAME.WORKINGAT,
        this.USER_FIELD_NAME.WORKAT,
      ]
    },
  ];
  visibleFollowModal: boolean = false;
  constructor(
    private translate: TranslateService,
    private shareSer: ShareService,
    private commenSer: CommonService,
    private msg: NzMessageService,
    private _router: Router,
    private _activeRouter: ActivatedRoute,
    private sesionSer: SessionService,
  ) {
  }

  ngOnInit(): void {
    if (!this.routerSub) {
      this.routerSub = this._activeRouter;
      this.routerSub.params.subscribe(params => {
        if (params['id']) {
          if (!this.userInfo || +params['id'] !== this.id) {
            this.id = +params['id'];
            this.getUserInfor();
          }
        } else {
          this.goToURL(ROUTING_DEFINED.NOTFOUND);
        }
      })
    }
  }

  getUserInfor() {
    if (this.id) {
      this.loading.infor = true;
      this.commenSer.getUserInfoById(this.id).subscribe({
        next: resp => {
          if (resp.data && _.size(resp.data)) {
            this.userInfo = {
              ...resp.data,
              role: resp.data['role'] ? resp.data['role'].toUpperCase() : ROLE.USER
            }
            if (resp.data['postSearchResultDtoList'] && resp.data['postSearchResultDtoList'].length) {
              this.data.posts = _.orderBy(resp.data['postSearchResultDtoList'].map((post: any) => {
                return {
                  ...post,
                  commentList: _.orderBy([...post.commentList], ['createdAt'], ['desc'])
                }
              }), ['createAt'], ['desc'])
            } else {
              this.data.posts = [];
            }
            this.getListUserInfor();
            this.avatarText = this.getTextAvatar();
            this.checkFollow();
            this.getFollowList();
            this.getDoctorBookingInfor();
          }
          this.loading.infor = false;
        },
        error: error => {
          this.showError(error['error'] ? error['error'].code || 8 : 8);
          this.goToURL(ROUTING_DEFINED.NOTFOUND);
          this.loading.infor = false;
        },
        complete: () => {
          this.loading.infor = false;
        }
      });
    } else {
      this.goToURL(ROUTING_DEFINED.NOTFOUND);
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

  getListUserInfor() {
    this.data.userInforList = [];
    if (this.userInfo && _.size(this.userInfo)) {
      for (const field in this.userInfo) {
        const _field = this.getTitleByField(field);
        if (_field && this.checkFieldByRole(field)) {
          this.data.userInforList.push({
            value: this.getValueByField(field),
            field: field,
            title: _field.title,
            order: _field.order
          });
        }
      }
      this.data.userInforList = _.orderBy(this.data.userInforList, ['order'])
    }
  }

  checkFieldByRole(field: any): boolean {
    if (!this.userInfo) return false;
    const _fieldNameByRole = this.showProfileByField.find(item => item.role.includes((this.userInfo?.role || '') as any));
    if (!_fieldNameByRole) return false;
    return _fieldNameByRole.fields.includes(field);
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

  toggleFollow() {
    if (this.userInfo) {
      this.loading.follow = true;
      this.shareSer.toggleFollow(this.userInfo.id).subscribe({
        next: resp => {
          this.follow = !this.follow;
          this.loading.follow = false;
          this.showSuccess();
        },
        error: error => {
          this.showError(error['error'] ? error['error'].code || 8 : 8);
          this.loading.follow = false;
        },
        complete: () => {
          this.loading.follow = false;
        }
      });
    } else {
      this.showError('8')
    }
  }

  checkFollow() {
    if (this.userInfo) {
      this.loading.follow = true;
      this.shareSer.checkFollow(this.userInfo.id).subscribe({
        next: resp => {
          this.follow = resp.data || false;
          this.loading.follow = false;
        },
        error: error => {
          this.showError(error['error'] ? error['error'].code || 8 : 8);
          this.loading.follow = false;
        },
        complete: () => {
          this.loading.follow = false;
        }
      });
    } else {
      this.showError('8')
    }
  }

  getFollowList() {
    if (this.userInfo) {
      this.loading.listFollow = true;
      this.shareSer.getUserFollow(this.userInfo.id).subscribe({
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

  getFollowListForShow(isFollower: boolean) {
    if (isFollower) {
      this.data.showFollowList = [...this.data.listFollower];
    } else {
      this.data.showFollowList = [...this.data.listFollowing];
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

  goToProfile(id: number) {
    if (id === this.sesionSer.getID()) {
      this.goToURL(ROUTING_DEFINED.PROFILE);
    } else {
      this.goToURL(Helpers.JoinPaths([ROUTING_DEFINED.HOME, id.toString()]));
    }
  }

  onToogleBookingModal(visible: boolean) {
    this.bookingData.visibleBookingModal = visible;
  }

  getDoctorBookingInfor() {
    if (this.userInfo && this.userInfo.role === ROLE.DOCTOR) {
      if (!this.userInfo.doctorId || !this.userInfo.specialist) {
        this.bookingData.infor = null;
      } else {
        this.bookingData.infor = {
          doctorId: this.userInfo.doctorId,
          specialist: (this.userInfo.specialist || '').toUpperCase(),
        }
      }
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
