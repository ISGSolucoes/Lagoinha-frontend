import ApiService from '../lib/api';

export const AuthService = {
    async login(email: string, password: string) {
        try {
            const response = await ApiService.post('/auth/login', { email, password });

            console.log('Resposta de login: ', response)
            return response;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Credenciais inválidas')) {
                    throw new Error('Email ou senha incorretos');
                }
                if (error.message.includes('Usuário não encontrado')) {
                    throw new Error('Email não cadastrado');
                }
                if (error.message.includes('Senha incorreta')) {
                    throw new Error('Senha incorreta');
                }
                throw error;
            }
            throw new Error('Erro desconhecido ao fazer login');
        }
    },

    async register(formData: object) {
        const response = await ApiService.post('/auth/cadastro', formData);
        return response;
    },

    logout() {
        localStorage.removeItem('token');
    },

    async getProfile() {
        const response = await ApiService.get('/auth/me');
        return response;
    },

    async refreshToken() {
        const response = await ApiService.post('/auth/refresh', {
            token: localStorage.getItem('refreshToken')
        });
        return response;
    }
};

export interface UserType {
    value: number;
    label: string;
}

export interface Church {
    value: number;
    label: string;
}

export const UserTypeService = {
    async getUserTypes() {
        try {
            const response = await ApiService.get('/api/userType');
            return response;
        } catch (error) {
            console.error('Erro no getUserTypes:', error);
            throw new Error(`Falha ao carregar tipos de usuário: ${error.message}`);
        }
    }
}

export const ChurchService = {
    async getChurches() {
        try {
            const response = await ApiService.get('/api/church');
            return response; //await response.json() as Church[];
        } catch (error) {
            console.error('Erro no getChurch:', error);
            throw new Error(`Falha ao carregar igrejas: ${error.message}`);
        }
    }
        
}

export const SituationService = {
    getSituations: () => {
        return ApiService.get('/api/situation');
    }
}

export const locationsEstadosService = {
    getlocationsEstados: () => {
        return ApiService.get('/api/locations/estados');
    }
}

export const locationsCidadesService = {
    getlocationsCidades: (estado) => {
        return ApiService.get(`/api/locations/cidades/${estado}`);
    }
}
