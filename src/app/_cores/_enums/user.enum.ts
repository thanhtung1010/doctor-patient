export enum USER_FIELD {
    email = 'email',
    fullName = 'fullName',
    gender = 'gender',
    age = 'age',
    role = 'role',
    phone = 'phone',
    userLoaded = 'userLoaded',
    // totalFollower = 'totalFollower',
}

export const USER_TITLE_BY_FIELD = [
    {
        field: USER_FIELD.email,
        title: 'OUTSIDE.LOGIN.EMAIL'
    },
    {
        field: USER_FIELD.fullName,
        title: 'OUTSIDE.SIGN_UP.FULL_NAME'
    },
    {
        field: USER_FIELD.gender,
        title: 'OUTSIDE.SIGN_UP.GENDER'
    },
    {
        field: USER_FIELD.age,
        title: 'OUTSIDE.SIGN_UP.AGE'
    },
    {
        field: USER_FIELD.role,
        title: 'COMMON.ACCOUNT'
    },
    {
        field: USER_FIELD.phone,
        title: 'OUTSIDE.SIGN_UP.PHONE_NUMBER'
    },
    // {
    //     field: USER_FIELD.totalFollower,
    //     title: 'COMMON.FOLLOWER'
    // },
];

export const getTitleByField = (field: string): string | null => {
    const _field = USER_TITLE_BY_FIELD.find(item => item.field === field);
    if (_field) {
        return _field.title
    }
    return null
}