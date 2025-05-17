import { API_CONFIG } from "./config";

// 카테고리 제작
//POST {{baseURL}}/api/categories

//카테고리 조회
//GET {{baseURL}}/api/categories

// 카테고리 테스트
//카테고리 부분 url 맨뒤에 /test 붙여서 보내면 동작
// subjectData.js 파일 참고
export const categoryGet = async () => {
  const response = await fetch(`/api/test`, {
    ...API_CONFIG,
  });
  return response.json();
};
