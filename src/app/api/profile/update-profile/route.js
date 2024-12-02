import { API_URL } from '../../../../assets/api-endpoints/index';
import { backendAxiosInstance } from "../../../../assets/hooks/backend-axios-instance";


export async function PUT(req) {
  try {
    const config = {
      headers: {
        Authorization: req.headers.get("authorization"),
        "Content-Type": "multipart/form-data",
      },
    };

    const payload = await req.formData();
  
    const response = await backendAxiosInstance.put(`${API_URL.UPDATE_PROFILE_DETAILS}`, payload, config);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: e.response?.status ?? 500 });
  }
}
