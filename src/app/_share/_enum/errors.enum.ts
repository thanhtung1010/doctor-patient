import * as _ from "lodash"

export const SYSTEM_MSG = {

  1: "SYS_MSG.INVALID_REQUEST",//:Invalid request",
  2: "error.NO_DATA",//:No data,",
  3: "SYS_MSG.INVALID_AUTHORITY", //Invalid authorization,
  4: "SYS_MSG.DUPLICATION_ERROR", //:Duplication error",
  5: "SYS_MSG.LOGIN_ERROR", // : Login error",
  6: "SYS_MSG.INVALID_FORMAT",//:Invalid format",
  7: "SYS_MSG.RESOURCE_NOT_FOUND", // : Response not found
  8: "SYS_MSG.SOMETHING_WRONG",//Server error",
  9: "SYS_MSG.TOKEN_EXPIRED", // :Token expired
  10: "SYS_MSG.ACCESS_DENIED",//Access denied",
  11: "SYS_MSG.FIREBASE_ERROR",//Firebase error",
  12: "SYS_MSG.RESOURCE_LOCKING",//Resource locking",
  13: "SYS_MSG.RESOURCE_EXISTED",//Resource existed",
  14: "SYS_MSG.INVALID_USER_PASSWORD",//:The username or password is not correct",
  15: "SYS_MSG.ERROR_TYPE_UPLOAD",
  16: "SYS_MSG.ERROR_SIZE_UPLOAD",

  200: "SYS_MSG.OK", // :OK
  400: "SYS_MSG.BAD_REQUEST", //:Bad request
  404: "SYS_MSG.NOT_FOUND", //:Not found
  500: "SYS_MSG.INTERNAL_SERVER_ERROR",// :Internal server error

  // 1000: 'SYS_MSG.TOKEN_EXPIRES', // Access token was expired
  1001: "SYS_MSG.GENERATE_FILE_ERROR", //Generate export file error
  1002: "SYS_MSG.NOT_FOUND_USER",
  1003: "SYS_MSG.PASSWORD_NOT_MATCHED", //The password is not matched
  1004: "SYS_MSG.PASSWORD_CHANGED", //The password was changed successfully

  1100: "SYS_MSG.ROLE_SAVED", //The role is save successfully
  1101: "SYS_MSG.ROLE_DUPLICATED", //The role is already existing
  1102: "SYS_MSG.ROLE_NOT_FOUND", //The role is not found
  1103: "SYS_MSG.ROLE_DELETED", //The role is deleted
  1104: "SYS_MSG.ROLE_MISSING", //The role is missing
  1105: "SYS_MSG.DIVISION_MISSING", //The division is missing
  1106: "SYS_MSG.ROLE_IN_USED", //The role is assigned to users

  1150: "SYS_MSG.MISSING_MODULE_ACTION", //Missing module action
  1151: "SYS_MSG.BAD_MODULE", //Invalid module
  1152: "SYS_MSG.BAD_ACTION", //Invalid action

  1201: "SYS_MSG.USER_NOT_FOUND", //User is not found
  1202: "SYS_MSG.USER_DUPLICATED_USERNAME", //Username is duplicated
  1203: "SYS_MSG.USER_DUPLICATED_EMAIL", //Email is duplicated
  1204: "SYS_MSG.USER_MISSING_PASSWORD", //Password is missing
  1205: "SYS_MSG.USER_PASSWORD_INVALID", //Password is invalid
  1206: "SYS_MSG.USER_MISSING_USERNAME", //Username is missing
  1207: "SYS_MSG.USER_MISSING_EMAIL", //Email is missing
  1208: "SYS_MSG.USER_INVALID_EMAIL", //Email is invalid
  1209: "SYS_MSG.USER_MISSING_FULLNAME", //Full name is missing
  1210: "SYS_MSG.USER_DUPLICATED_USERNAME", //Username is duplicated



  /*
  ***************** NOT IN FILE BE SENT ******************
  */

  // 1003: "SYS_MSG.TOKEN_CLEARED", //The access token was cleared successfully
  // 1004: "SYS_MSG.LOGIN_ERR_WRONG_USER_PASS", //The username or password is not correct
  // 1005: "The user is not found",
  // 4042: "SYS_MSG.NOT_FOUND_USER", // User is not found,

  // 2001: "SYS_MSG.GENERATE_FILE_ERROR", // INTERNAL_SERVER_ERROR:Generate file error
  2022: "SYS_MSG.NOT_FOUND_CUSTOMER", // NOT_FOUND_CUSTOMER, Customer is not found

  3001: "SYS_MSG.BOX_MISSING_BOX_UPN", //:Missing box product_upn
  3002: "SYS_MSG.BOX_MISSING_SINGLE_UPN", //:Missing unbox product_upn
  3003: "SYS_MSG.BOX_MISSING_PACKAGE_QTY", //:Missing package quantity
  3004: "SYS_MSG.BOX_PACKAGE_QTY_LESS_THAN_ZERO", //:The package quantity must larger than zero
  3101: "SYS_MSG.BOX_PRODUCT_NOT_FOUND",//Box product is not found
  3102: "SYS_MSG.BOX_SINGLE_PRODUCT_NOT_FOUND",//Single product is not found
  3103: "SYS_MSG.BOX_SINGLE_NOT_FOUND",//Box-Single is not found
  3104: "SYS_MSG.BOX_SINGLE_DUPLICATED",//:Box-Single is dupplicated
  3105: "SYS_MSG.BOX_SINGLE_DELETED", // OK: Box/Unbox product is deleted
  3106: "SYS_MSG.GENERATE_FILE_ERROR", // INTERNAL_SERVER_ERROR:Generate file error
  3201: "SYS_MSG.FORBIDDEN",
  3202: "SYS_MSG.NO_PERMISSION", // No permission to access this resource

  // 2001: "USER_SAVE_ROLE_SUCCESS",// Save role permission successfully",
  4001: "SYS_MSG.USER_INVALID_ROLE", // Invalid group code
  4002: "SYS_MSG.USER_INVALID_DIVISION", //Invalid division code",
  4003: "SYS_MSG.USER_INVALID_MODULE", //"Invalid module code",
  // 4004: "SYS_MSG.USER_INVALID_ACTION", //"Invalid action code",
  // 4005: "SYS_MSG.USER_MISSING_USERNAME", //"Missing username",
  // 4006: "SYS_MSG.USER_MISSING_PASSWORD",
  // 4007: "SYS_MSG.USER_MISSING_EMAIL", //"Missing email",
  // 4008: "SYS_MSG.USER_MISSING_FULLNAME", //"Missing full name",
  4009: "SYS_MSG.USER_MISSING_ROLE", //"Missing role",
  4010: "SYS_MSG.USER_MISSING_DIVISION", //"Missing division",
  4011: "SYS_MSG.USER_INVALID_ROLE", //"Invalid role",
  4012: "SYS_MSG.USER_INVALID_DIVISION", //"Invalid division",
  // 4013: "SYS_MSG.USER_INVALID_EMAIL", //"Invalid email",
  4014: "SYS_MSG.USER_PASSWORD_LENGTH", //"Password length must be between 8 - 20 characters",
  // 4041: "SYS_MSG.USER_NOT_FOUND", // User is not found",
  // 4042: "NOT_FOUND_PERMISSION: Permission is not found",
  // 4043: "SYS_MSG.USER_NOT_FOUND_ROLE", //: Role is not found",

  // 409: "SYS_MSG.DUPLICATED", // Duplicated",
  // 4091: "SYS_MSG.USER_DUPLICATED_USERNAME",//" Duplicated username",
  // 4092: "SYS_MSG.USER_DUPLICATED_EMAIL",//" Duplicated email",
  // 4093: "SYS_MSG.USER_DUPLICATED_ROLE",//" Duplicated role",
  4042: "SYS_MSG.NOT_FOUND_USER",
  // 4043: "NOT_MATCH: The password is not matched",
  // 5001: "SYS_MSG.INTERNAL_SERVER_ERROR",//: Generate file error",

  // 4041: "SYS_MSG.NOT_FOUND",
  4004: "SYS_MSG.NUMBER_PACKAGE_MIN",


  5001: "SYS_MSG.FROM_CURRENCY_MISSING", //:From currency is missing
  5002: "SYS_MSG.TO_CURRENCY_MISSING", //:To currency is missing
  5003: "SYS_MSG.VALID_FROM_MISSING", //:Valid from is missing
  5004: "SYS_MSG.VALID_TO_MISSING", //:Valid to is missing
  5005: "SYS_MSG.EXCHANGE_RATE_MISSING", //:Exchange rate is missing
  5006: "SYS_MSG.FROM_CURRENCY_INVALID", //:From currency is invalid
  5007: "SYS_MSG.TO_CURRENCY_INVALID", //:To currency is invalid
  5008: "SYS_MSG.FROM_TO_TIME_INVALID", //:Valid from time or to time is invalid
  5009: "SYS_MSG.EXCHANGE_RATE_INVALID", //:Exchange rate is invalid
  5010: "SYS_MSG.EXCHANGE_RATE_EXISTING", //:Exchange rate is still valid in the range time
  5011: "SYS_MSG.EXCHANGE_RATE_NOT_FOUND", //:Exchange rate not found
  5012: "SYS_MSG.EXCHANGE_RATE_DELETE", //:Exchange rate is deleted

  5110: "SYS_MSG.PRODUCT_SET_EXISTING", //:Product set is existing
  5111: "SYS_MSG.PRODUCT_SET_NOT_FOUND", //:Product set is not found
  5112: "SYS_MSG.PRODUCT_SET_DELETED", //:Product set is deleted

  // Bundle
  5410: "SYS_MSG.ADDING_BUNDLE_FAIL", //: Fail to add new bundle
  5411: "SYS_MSG.CHECKING_BUNDLE_FAIL", //: Fail to check exist bundles
  5412: "SYS_MSG.CHECKING_BUNDLE_REQ", //: Invalid value to continue process
  5413: "SYS_MSG.BUNDLE_EXISTING", //: Bundle is already existing
  5414: "SYS_MSG.BUNDLE_INVALID", //: Bundle has some invalid info
  5415: "SYS_MSG.UPDATING_BUNDLE_FAIL", //: Fail to update exist bundle

  6001: "SYS_MSG.ORDER_DRAFT_EXISTING",
  6003: "SYS_MSG.ORDER_CANCEL",
  6101: "SYS_MSG.LIMITATION_RULE",

  6201: "SYS_MSG.ZERO_PRICE_EXCEPTION",
  6203: "SYS_MSG.CUSTOMER_NO_UUB",
  6204: "SYS_MSG.ZTKA_EXCEPTION", //:This customer is missing Bill to/Payer account. Please contact with CC/Admin to resolve this issue!

  6301: "SYS_MSG.DUPLICATED_CASE_ID",
  6302: "SYS_MSG.UNBILLED_USAGE_NOT_FOUND",

  7001: "SYS_MSG.IMPORT_ERROR",
  7002: "SYS_MSG.IS_NOT_EXCEL_FILE",
  7003: "SYS_MSG.HEADER_INCORRECT",
  7004: "SYS_MSG.INVALID_DATA",
  7005: "SYS_MSG.SHEET_EMPTY",
  7006: "SYS_MSG.SHEET_INVALID",
  7007: "SYS_MSG.CUSTOMER_INVALID",
  7008: "SYS_MSG.OVER_250_LINES",


  7009: "SYS_MSG.OTHER_ERROR",

  7403: "SYS_MSG.ZTKA_EXCEPTION",

  9101: "SYS_MSG.FILE_INVALID",
  9102: "SYS_MSG.FILE_NOT_EXCEL",
  9103: "SYS_MSG.FILE_NOT_TEMPLATE",

  9201: "SYS_MSG.UPN_EMPTY",
  9202: "SYS_MSG.UPN_INVALID",
  9203: "SYS_MSG.QTY_NULL",
  9204: "SYS_MSG.QTY_IS_STRING",
  9205: "SYS_MSG.QTY_MUST_BE_GREATER_THAN_ZERO",
  9206: "SYS_MSG.DIFFERENT_SALE_ORGS",
  9207: "SYS_MSG.PRODUCT_NAME_INVALID",
  9208: "SYS_MSG.PRODUCT_DIVISION_INVALID",
  9209: "SYS_MSG.PRODUCT_SALES_STATUS_INVALID",
  9210: "SYS_MSG.PRODUCT_OFFERING_STATUS_IS_UNAVAILABLE",
  9211: "SYS_MSG.DATA_TO_IMPORT_IS_EMPTY",

  9104: "SYS_MSG.EXPORT_FILE_ERROR",

  9301: "SYS_MSG.PACKAGE_QUANTITY_MUST_BE_GREATER_THAN_ZERO",
  9302: "SYS_MSG.BOX_UPN_IS_NOT_IN_MASTER_DATA",
  9303: "SYS_MSG.SINGLE_UPN_IS_NOT_IN_MASTER_DATA",
}

export const getSystemMsgByCode = (_key: string): string | null => {
  return _.get(SYSTEM_MSG, _key) || null;
}
