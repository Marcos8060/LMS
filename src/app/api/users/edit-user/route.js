import { API_URL } from "../../../../assets/api-endpoints/index";
import { backendAxiosInstance } from "../../../../assets/hooks/backend-axios-instance";


export async function PUT(req) {
    try {
      const config = {
        headers: {
          Authorization: req.headers.get("authorization"),
        },
      };
      const { id, ...payloadWithoutId } = await req.json();
    
      const response = await backendAxiosInstance.put(`${API_URL.EDIT_USER}/${id}`, payloadWithoutId, config);
  
      return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: e.response?.status ?? 500 });
    }
  }
