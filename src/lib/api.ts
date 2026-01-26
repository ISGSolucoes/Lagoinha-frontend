import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
    private static async handleResponse(response: Response) {
        const contentType = response.headers.get('content-type');
        let errorData: string;

        if (contentType?.includes('application/json')) {
            errorData = await response.json();
        } else {
            errorData = await response.text();
        }

        if (!response.ok) {        
            if (errorData && typeof errorData === 'object') {
                throw new Error(errorData.detalhes || errorData.erro || 'Erro na requisição');
            }
            throw new Error(errorData || `Erro ${response.status}: ${response.statusText}`);
        }

        return errorData;
    }    

    static async get(endpoint: string, requiresAuth = false) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (requiresAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    }

    static async post(endpoint: string, body: object, requiresAuth = false) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (requiresAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    }

    // Adicione outros métodos (put, delete, etc) conforme necessário
}

export default ApiService;