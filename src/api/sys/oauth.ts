import { ContentTypeEnum } from '/@/enums/httpEnum';
import { User } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  getAccessToken = '/oauth2.0/token',
}

export function getAccessToken(data: {
  grant_type: 'authorization_code';
  client_id: string;
  code: string;
  redirect_uri: string;
}) {
  return defHttp.post<{
    data: { accessToken: string; refreshToken: string; user: User };
    code: number;
    message: string;
  }>({
    url: Api.getAccessToken,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
