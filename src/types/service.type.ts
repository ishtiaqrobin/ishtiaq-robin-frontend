export interface IServiceIcon {
  name: string;
  library: string;
  color: string;
}

export interface IService {
  id: string;
  name: string;
  icon?: IServiceIcon;
  description?: string;
  isPublish: boolean;
  createdAt: string;
  updatedAt: string;
}
