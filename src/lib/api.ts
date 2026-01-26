import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
    private static async handleResponse(response: Response) {
        const contentType = response.headers.get('content-type');
        
        // Verificar se a resposta está vazia (sem conteúdo)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }
        
        let data;

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else if (contentType?.includes('text/')) {
            data = await response.text();
        } else {
            data = await response.blob();
        }

        if (!response.ok) {        
            if (data && typeof data === 'object') {
                throw new Error(data.detalhes || data.erro || data.message || 'Erro na requisição');
            }
            throw new Error(data || `Erro ${response.status}: ${response.statusText}`);
        }

        return data;
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

    static async put(endpoint: string, body: object, requiresAuth = false) {
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
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('PUT Error:', error);
            throw error;
        }
    }

    static async patch(endpoint: string, body: object, requiresAuth = false) {
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
                method: 'PATCH',
                headers,
                body: JSON.stringify(body)
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('PATCH Error:', error);
            throw error;
        }
    }

    static async delete(endpoint: string, requiresAuth = false) {
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
                method: 'DELETE',
                headers
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    }
}

export default ApiService;