export const validateSchema = async (schema, data) => {
  const { error, value } = await schema.validate(data);
  return { error };
};
