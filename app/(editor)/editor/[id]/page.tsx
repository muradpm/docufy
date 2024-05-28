import { TextEditor } from "../components/tiptap-editor";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { fetchDocumentsById } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";

export const revalidate = 60;

interface EditorPageProps {
  params: { id: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }

  const workspaceId = await getCurrentWorkspaceId(user.id);

  try {
    const document = await fetchDocumentsById(params.id, user.id, workspaceId);

    if (!document) {
      notFound();
    }

    return <TextEditor document={document} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
