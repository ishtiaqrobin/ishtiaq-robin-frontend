export interface ISkillIcon {
  name: string;
  library: string;
  color: string;
}

export interface ISkill {
  id: string;
  name: string;
  level: "Expert" | "Recently Learned" | "Learning";
  icon?: ISkillIcon;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
