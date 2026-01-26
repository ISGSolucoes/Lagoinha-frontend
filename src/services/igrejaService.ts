import ApiService from '../lib/api';

export interface IgrejaDTO {
  FANTASIA: string;
  RAZAO_SOCIAL?: string;
  CNPJ: string;
  ENDERECO?: string;
  CEP?: string;
  CD_CIDADE: number;
  fone?: string;
  email?: string;
  CD_SITUACAO: number;
}

// Interface baseada no que seu backend retorna
export interface IgrejaBackend {
  ID: number;
  LABEL: string; // FANTASIA
  CD_CIDADE: number;
  LOCALIZACAO: string; // "Cidade-UF"
  CIDADE: string;
  ESTADO: string;
  CNPJ: string;
  FONE: string | null;
  EMAIL: string | null;
  SITUACAO: string;
  RAZAO_SOCIAL: string;
  ENDERECO: string;
  CEP: string;
  CD_SITUACAO: number;
}

// Interface para o frontend
export interface Igreja {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cd_cidade: number;
  cidade: string;
  estado: string;
  cnpj: string;
  telefone: string;
  email: string;
  situacao: string;
  cd_situacao: number;
  endereco: string;
  cep: string;
}

class IgrejaService {
  async getIgrejas() {
    try {
      const response = await ApiService.get('/api/church');
      
      console.log('retorno api response: ', response);
      
      // O response já é o array de dados, não precisa de .data
      const backendData: IgrejaBackend[] = response;
      
      if (!Array.isArray(backendData)) {
        console.error('Dados retornados não são um array:', backendData);
        return [];
      }

      // Transformar dados do backend para o frontend
      const igrejas: Igreja[] = backendData.map(item => {
        // Usar CIDADE e ESTADO separados se disponíveis, senão usar LOCALIZACAO
        let cidade = item.CIDADE || '';
        let estado = item.ESTADO || '';
        
        if (!cidade && item.LOCALIZACAO) {
          [cidade, estado] = item.LOCALIZACAO.split('-');
        }
        
        // Limpar espaços no estado
        estado = estado.trim();
        
        return {
          id: item.ID,
          nomeFantasia: item.LABEL,
          razaoSocial: item.RAZAO_SOCIAL || item.LABEL,
          cd_cidade: item.CD_CIDADE,
          cidade: cidade,
          estado: estado,
          cnpj: item.CNPJ,
          telefone: item.FONE || '',
          email: item.EMAIL || '',
          situacao: item.SITUACAO,
          cd_situacao: item.CD_SITUACAO,
          endereco: item.ENDERECO || '',
          cep: item.CEP || ''
        };
      });

      console.log('Igrejas transformadas:', igrejas);
      return igrejas;
    } catch (error) {
      console.error('Erro ao buscar igrejas:', error);
      throw error;
    }
  }

  async getIgrejaById(id: number) {
    try {
      const response = await ApiService.get(`/api/church/${id}`);
      const item: IgrejaBackend = response;

      console.log('Retorno api response: ',response)
      console.log('Retorno api item: ',item)
 
      // Transformar para o formato do frontend
      let cidade = item.CIDADE || '';
      let estado = item.ESTADO || '';
      
      if (!cidade && item.LOCALIZACAO) {
        [cidade, estado] = item.LOCALIZACAO.split('-');
      }
      
      estado = estado.trim();
      
      return {
        id: item.ID,
        nomeFantasia: item.FANTASIA,
        razaoSocial: item.RAZAO_SOCIAL,
        cd_cidade: item.CD_CIDADE,
        cidade: cidade,
        estado: estado,
        cnpj: item.CNPJ,
        telefone: item.FONE || '',
        email: item.EMAIL || '',
        situacao: item.SITUACAO,
        cd_situacao: item.CD_SITUACAO,
        endereco: item.ENDERECO || '',
        cep: item.CEP || ''
      };
    } catch (error) {
      console.error('Erro ao buscar igreja:', error);
      throw error;
    }
  }

  async createIgreja(data: IgrejaDTO) {
    try {
      const payload = {
        FANTASIA: data.FANTASIA,
        RAZAO_SOCIAL: data.RAZAO_SOCIAL || data.FANTASIA,
        CNPJ: data.CNPJ,
        ENDERECO: data.ENDERECO || '',
        CEP: data.CEP || '',
        CD_CIDADE: data.CD_CIDADE,
        fone: data.fone || '',
        email: data.email || '',
        CD_SITUACAO: data.CD_SITUACAO,
      };

      console.log('Enviando dados para criação:', payload);
      const response = await ApiService.post('/api/church', payload);
      console.log('Resposta da criação:', response);
      
      return response;
    } catch (error) {
      console.error('Erro ao criar igreja:', error);
      throw error;
    }
  }

  async updateIgreja(id: number, data: Partial<IgrejaDTO>) {
    try {
      const payload = {
        FANTASIA: data.FANTASIA,
        RAZAO_SOCIAL: data.RAZAO_SOCIAL,
        CNPJ: data.CNPJ,
        ENDERECO: data.ENDERECO,
        CEP: data.CEP || '',
        CD_CIDADE: data.CD_CIDADE,
        fone: data.fone || '',
        email: data.email || '',
        CD_SITUACAO: data.CD_SITUACAO,
      };

      console.log('Enviando dados para atualização:', payload);

      const response = await ApiService.put(`/api/church/${id}`, payload);
      
      console.log('Resposta da atualização:', response);
      
      return response;
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      throw error;
    }
  }

  async deleteIgreja(id: number) {
    try {
      console.log('Deletando igreja com ID:', id);
      const response = await ApiService.delete(`/api/church/${id}`);
      console.log('Resposta da exclusão:', response);
      
      return response;
    } catch (error) {
      console.error('Erro ao deletar igreja:', error);
      throw error;
    }
  }
}

export default new IgrejaService();