import { supabase } from "./supabase";

const toDbPayload = (client = {}) => {
  const payload = {};

  if (client.id) payload.id = client.id;
  if (client.owner_id || client.ownerId) {
    payload.owner_id = client.owner_id ?? client.ownerId;
  }
  if (client.name !== undefined) payload.name = client.name;
  if (client.company !== undefined) payload.company = client.company;
  if (client.phone !== undefined) payload.phone = client.phone;
  if (client.email !== undefined) payload.email = client.email;

  const customFields = client.custom_fields ?? client.customFields;
  if (customFields !== undefined) payload.custom_fields = customFields;

  const createdAt = client.created_at ?? client.createdAt;
  if (createdAt) payload.created_at = createdAt;

  const updatedAt = client.updated_at ?? client.updatedAt;
  if (updatedAt) payload.updated_at = updatedAt;

  const editKey = client.edit_key ?? client.editKey;
  if (editKey !== undefined) payload.edit_key = editKey;

  return payload;
};

const fromDbRow = (row) => {
  if (!row) return null;

  return {
    ...row,
    customFields: row.custom_fields ?? row.customFields,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
    editKey: row.edit_key ?? row.editKey,
  };
};

const isNotFoundError = (error) =>
  error && (error.code === "PGRST116" || error.details === "Results contain 0 rows");

export const saveClient = async (client) => {
  const payload = toDbPayload(client);

  const { data, error } = await supabase
    .from("clients")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDbRow(data);
};

export const getClient = async (id) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (isNotFoundError(error)) {
    return null;
  }

  if (error) {
    throw error;
  }

  return fromDbRow(data);
};

export const updateClient = async (id, updates) => {
  const payload = toDbPayload(updates);
  delete payload.id;

  const { data, error } = await supabase
    .from("clients")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDbRow(data);
};
