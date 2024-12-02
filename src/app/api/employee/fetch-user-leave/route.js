import { API_URL } from '../../../../assets/api-endpoints/index';
import { backendAxiosInstance } from "../../../../assets/hooks/backend-axios-instance";


export async function GET(req) {
  const token = req.headers.get("authorization");
    console.log("Authorization Header:", token);
  try {
    const config = {
      headers: {
        Authorization: req.headers.get("authorization"),
      },
    };

  
    const response = await backendAxiosInstance.get(`${API_URL.FETCH_USER_LEAVE}`,config);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: e.response?.status ?? 500 });
  }
}
