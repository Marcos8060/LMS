import { API_URL } from '../../../../assets/api-endpoints/index';
import { backendAxiosInstance } from "../../../../assets/hooks/backend-axios-instance";

export async function POST(req) {
  try {
    // Directly process the incoming FormData
    const formData = await req.formData();  // Use formData() instead of json()


    // Pass form data directly to the backend
    const response = await backendAxiosInstance.post(`${API_URL.APPLY_JOB}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: e.response?.status ?? 500 });
  }
}
