export enum USER_FIELD {
    email = 'email',
    fullName = 'fullName',
    gender = 'gender',
    age = 'age',
    role = 'role',
    phone = 'phone',
    userLoaded = 'userLoaded',
    certificate = 'certificate',
    degree = 'degree',
    startworkattime = 'startWorkAtTime',
    endworkattime = 'endWorkAtTime',
    workingat = 'workingAt',
    workat = 'workAt',
    // totalFollower = 'totalFollower',
}

export const USER_TITLE_BY_FIELD = [
    {
        field: USER_FIELD.email,
        title: 'OUTSIDE.LOGIN.EMAIL',
        order: 1
    },
    {
        field: USER_FIELD.fullName,
        title: 'OUTSIDE.SIGN_UP.FULL_NAME',
        order: 2
    },
    {
        field: USER_FIELD.gender,
        title: 'OUTSIDE.SIGN_UP.GENDER',
        order: 3
    },
    {
        field: USER_FIELD.age,
        title: 'OUTSIDE.SIGN_UP.AGE',
        order: 4
    },
    {
        field: USER_FIELD.role,
        title: 'COMMON.ACCOUNT',
        order: 5
    },
    {
        field: USER_FIELD.phone,
        title: 'OUTSIDE.SIGN_UP.PHONE_NUMBER',
        order: 6
    },
    {
        field: USER_FIELD.certificate,
        title: 'COMMON.CERTIFICATE',
        order: 8
    },
    {
        field: USER_FIELD.degree,
        title: 'COMMON.DEGREE',
        order: 7
    },
    {
        field: USER_FIELD.startworkattime,
        title: 'COMMON.STARTWORKATTIME',
        order: 11
    },
    {
        field: USER_FIELD.endworkattime,
        title: 'COMMON.ENDWORKATTIME',
        order: 12
    },
    {
        field: USER_FIELD.workingat,
        title: 'COMMON.WORKINGAT',
        order: 9
    },
    {
        field: USER_FIELD.workat,
        title: 'COMMON.WORKAT',
        order: 10
    },
    // {
    //     field: USER_FIELD.totalFollower,
    //     title: 'COMMON.FOLLOWER'
    // },
] as {
    field: string,
    title: string,
    order: number
}[];

export const getTitleByField = (field: string): {
    field: string,
    title: string,
    order: number
} | null => {
    const _field = USER_TITLE_BY_FIELD.find(item => item.field === field);
    if (_field) {
        return _field
    }
    return null
}
