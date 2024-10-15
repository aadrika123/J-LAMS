import BackendUrl from "./BackendUrl";

export default function ProjectApiList() {
  let baseUrl = BackendUrl;
  let apiList = {   
    api_login: `${baseUrl}/api/login`,
  };

  return apiList;
}
