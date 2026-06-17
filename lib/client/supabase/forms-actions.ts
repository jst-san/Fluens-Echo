import { AppError } from "@/lib/app-error";
import { supabase } from "@/utils/supabase/client";

export async function deleteForm(shareToken: string) {
  if (!shareToken) throw new AppError({ message: "Format tidak valid" });

  const getUserRes = await supabase.auth.getUser();

  if (getUserRes.error) {
    throw new AppError(getUserRes.error);
  }

  const { user } = getUserRes.data;

  const deleteFormRes = await supabase
    .from("forms")
    .delete()
    .eq("share_token", shareToken)
    .eq("creator_id", user?.id);

  if(deleteFormRes.error) {
    throw new AppError(deleteFormRes.error)
  }

  return null
}
