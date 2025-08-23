"use client"
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';

import { FileUploader, UploadedFile } from '@/components/file-uploader';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { getFileMetadata } from '@/lib/metadata';
import { ArrayElement } from '@/types/array';
import { ApiTenantSlugSourcePost } from '@packages/common';

import { DialogType } from '../';

export const CreateSourceFile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { mutateAsync: generateUrl } = useApiMutation("[POST] /api/tenant/:slug/source/get-upload-file-signed-url");
  const { mutate: createSource } = useApiMutation("[POST] /api/tenant/:slug/source");
  const { closeDialog } = useDialog();

  const generateUploadUrl = async (info: UploadedFile): Promise<string> => {
    const { url } = await generateUrl({ 
      params: { slug },
      body: { fileName: info.name, contentType: info.type, fileSize: info.size }
    });
    return url;
  }

  const onUploadComplete = async (files: UploadedFile[]) => {
    const body = await Promise.all(files.map(async (f) => {
      const metadata = await getFileMetadata(f.file);
      const sourceType = f.type.startsWith("image") ? "IMAGE" : f.type.startsWith("audio") ? "AUDIO" : f.type.startsWith("video") ? "VIDEO" : "FILE";
      return {
        ...metadata,
        metadata,
        contentType: f.type,
        sourceType,
        extension: f.name.split('.').pop(),
        originalName: f.name,
        name: f.name,
      } as ArrayElement<ApiTenantSlugSourcePost.Body>;
    }));
    createSource({ body, params: { slug }, querystring: { path: searchParams.get("path") || "" } }, {
      onError(error) {
        toast({ title: t/*i18n*/("Error creating source"), description: error.message, variant: "destructive" });
      },
      onSuccess(data) {
        closeDialog(DialogType.CREATE_SOURCE);
        toast({ title: t/*i18n*/("Source created"), description: data.message });
      },
    });
  }

  return (
    <div>
      <FileUploader
        generateUploadUrl={generateUploadUrl}
        onUploadComplete={onUploadComplete}
        multiple
      />
    </div>
  )
}