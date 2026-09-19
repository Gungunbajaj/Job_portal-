import { createClerkSupabaseClient } from "@/utils/supabase";

// GET ALL COMPANIES
export async function getCompanies(session) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("COMPANIES")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }

  console.log("Companies API:", data);

  return data || [];
}

// ADD NEW COMPANY
export async function addNewCompany(session, _, companyData) {
  const supabase = createClerkSupabaseClient(session);

  const random = Math.floor(Math.random() * 90000);

  const file = companyData.logo;

  // Keep the original file extension
  const fileExtension = file.name.split(".").pop();

  const fileName = `logo-${random}-${companyData.name}.${fileExtension}`;

  // 1. Upload company logo to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error uploading company logo:", uploadError);
    throw uploadError;
  }

  // 2. Get public URL of uploaded logo
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("company-logo")
    .getPublicUrl(fileName);

  // 3. Insert company into database
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: publicUrl,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting company:", error);
    throw error;
  }

  return data;
}