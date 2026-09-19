import { createClerkSupabaseClient } from "@/utils/supabase";

export async function applyToJob(session, { job_id, user_id, resume }) {
  const supabase = createClerkSupabaseClient(session);

  // 1. Resume upload
  const random = Math.floor(Math.random() * 900000);

  const fileName = `resume-${random}-${user_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, resume);

  if (storageError) {
    console.error("Error uploading resume:", storageError);
    throw storageError;
  }

  // 2. Create application record
  const { data, error } = await supabase
    .from("application")
    .insert([
      {
        job_id,
        user_id,
        resume: fileName,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error applying to job:", error);
    throw error;
  }

  return data;
}

export async function updateApplicationStatus(session, { job_id, status }) {
  const supabase = createClerkSupabaseClient(session)
const { data, error } = await supabase
    .from("application")
    .update({ status })
    .eq("job_id", job_id)
    .select()
    .single();  
    if (error || data.length===0) {
    console.error("Error updating application status:", error);
    return null;
  }
return data;
};  
export async function getApplications(session, { user_id }) {
  const supabase = createClerkSupabaseClient(session)
const { data, error } = await supabase
    .from("application")
    .select("*, job:jobs(title, company:companies(name))")
     .eq("candidate_id", user_id);
    if (error || data.length===0) {
    console.error("Error getting saved applications:", error);
    return null;
  }
return data;
};  