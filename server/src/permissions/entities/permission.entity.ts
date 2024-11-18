export class Permission {
  permission_id: string;
  permission_name: string;
  description: string;

  constructor(
    permission_id?: string,
    permission_name?: string,
    description?: string,
  ) {
    const randomPermission = this.generateRandomPermission();
    this.permission_id = permission_id
      ? permission_id
      : randomPermission.permission_id;
    this.permission_name = permission_name
      ? permission_name
      : randomPermission.permission_name;
    this.description = description ? description : randomPermission.description;
  }

  static fromJson(data: any) {
    return new Permission(
      data.permission_id,
      data.permission_name,
      data.description,
    );
  }

  private generateRandomPermission() {
    return {
      permission_id: `permission-${Math.floor(Math.random() * 1000)}`, // Unique permission ID
      permission_name: `Permission ${Math.random().toString(36).substring(2, 6)}`, // Random permission name
      description: `This permission allows ${Math.random().toString(36).substring(2, 8)} actions.`, // Random description
    };
  }
}
