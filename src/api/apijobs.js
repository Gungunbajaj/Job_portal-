import { createClerkSupabaseClient } from "@/utils/supabase";


// ================= GET ALL JOBS =================

export async function getJobs(
  session,
  { location, company_id, searchQuery }
) {
  const supabase = createClerkSupabaseClient(session);

  let query = supabase
    .from("jobs")
    .select("*");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  console.log("JOB DATA:", data);
  console.log("JOB ERROR:", error);

  if (error) {
    throw error;
  }

  return data || [];
}


// ================= SAVE / UNSAVE JOB =================

export async function saveJob(
  session,
  { alreadySaved },
  saveData
) {
  const supabase = createClerkSupabaseClient(session);

  if (alreadySaved) {
    const { data, error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id)
      .eq("user_id", saveData.user_id)
      .select();

    if (error) {
      console.error("Error deleting saved job:", error);
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select();

  if (error) {
    console.error("Error saving job:", error);
    throw error;
  }

  return data;
}


// ================= GET SINGLE JOB =================

export async function getSingleJob(session, { job_id }) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:COMPANIES(
        name,
        logo_url,
        location
      ),
      applications:application(*)
    `)
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching single job:", error);
    throw error;
  }

  console.log("Single Job Data:", data);

  return data;
}


// ================= UPDATE HIRING STATUS =================

export async function updateHiringStatus(
  session,
  { job_id },
  isOpen
) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error updating job:", error);
    throw error;
  }

  return data;
}


// ================= ADD NEW JOB =================

export async function addNewJob(session, jobData) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error);
    throw error;
  }

  return data;
}


// ================= GET SAVED JOBS =================

export async function getSavedJobs(session, { job_id }) {
  const supabase = createClerkSupabaseClient(session);

  let query = supabase
    .from("saved_jobs")
    .select(`
      *,
      job:jobs(
        *,
        company:COMPANIES(
          name,
          logo_url
        )
      )
    `);

  if (job_id) {
    query = query.eq("job_id", job_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }

  return data || [];
}


// ================= GET RECRUITER JOBS =================

export async function getRecruiterJobs(
  session,
  { recruiter_id }
) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:COMPANIES(
        name,
        logo_url
      )
    `)
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching recruiter jobs:", error);
    throw error;
  }

  return data || [];
}


// ================= DELETE JOB =================

export async function deleteJobs(session, { job_id }) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    throw error;
  }

  return data;
}

export async function getMyJobs(session, { recruiter_id }) {
  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:COMPANIES(
        name,
        logo_url,
        location
      )
    `)
    .eq("recruiter_id", recruiter_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my jobs:", error);
    throw error;
  }

  console.log("My Jobs:", data);

  return data || [];
}