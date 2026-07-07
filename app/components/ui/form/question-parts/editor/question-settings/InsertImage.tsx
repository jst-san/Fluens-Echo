import { useFormEditorStore } from "@/stores/form-editor-store";
import { CldUploadButton } from "next-cloudinary";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState } from "react";
import { LuImage } from "react-icons/lu";

export default function InsertImage({ qId }: { qId: string }) {
  const [uploadedImage, setUploadedImage] =
    useState<CloudinaryUploadWidgetInfo>();
    const insertToQuestion = useFormEditorStore((s) => s.insertToQuestion)

  return (
    <>
      <CldUploadButton
        className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
        uploadPreset="Fluens-Form-image"
        options={{
          sources: ['local', 'url', 'camera'],
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        }}
        onSuccess={(result) => {
          if (result.info && typeof result.info !== "string") {
            setUploadedImage(result.info);
            insertToQuestion(qId, {image: result.info.secure_url})
          }
        }}
        // onQueuesEnd={(result, { widget }) => {
        //   widget.close();
        // }}
      >
        <LuImage size={18} className="text-brand" /> Gambar
      </CldUploadButton>
    </>
  );
}
