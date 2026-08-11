export const buildPermissionRelation = (permissions: string[]) => ({
  connectOrCreate: permissions.map((name) => ({
    where: { name },
    create: { name }
  }))
});

export const replacePermissionRelation = (permissions: string[]) => ({
  set: [],
  ...buildPermissionRelation(permissions)
});

export const hasPermission = (
  permissions: Array<string | { name: string }> | undefined,
  permission: string
) => {
  if (!permissions) {
    return false;
  }

  return permissions.some((item) =>
    typeof item === 'string' ? item === permission : item.name === permission
  );
};
